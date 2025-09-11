import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs'
import path from 'path'
import { RECRUITMENT_CONFIG } from '../../../ung-tuyen/constants'

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout
export const runtime = 'nodejs';

const MODEL_NAME = "gemini-pro";

// Helper to initialize Gemini model at request time
function initGemini() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!key) return null;
  try {
    const genAI = new GoogleGenerativeAI(key);
    return genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
  } catch (e) {
    console.error('initGemini error:', e)
    return null;
  }
}

// Validate and parse request body
async function parseRequest(req: Request) {
  try {
    const clonedReq = req.clone ? req.clone() : req;
    const body = await clonedReq.json();

    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body.history) ? body.history : [];
    const mode = body.mode === 'club' ? 'club' : (body.mode === 'domain' ? 'domain' : 'auto');

    if (!message) {
      throw new Error('Invalid message');
    }

    return { message, history, mode };
  } catch (error) {
    throw new Error('Invalid request body');
  }
}

async function fetchBackendContext() {
  // Fetch useful backend data: recent forum questions and recruitment info
  const parts: string[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/forum/questions`);
    if (res.ok) {
      const qs = await res.json();
      if (Array.isArray(qs) && qs.length) {
        const top = qs.slice(0, 5).map((q: any) => `- ${q.title}: ${String(q.content || '').slice(0, 120).replace(/\n/g, ' ')}...`);
        parts.push('[RECENT_FORUM_QUESTIONS]');
        parts.push(...top);
      }
    }
  } catch (e) {
    // ignore
  }

  try {
    const status = RECRUITMENT_CONFIG.getStatus();
    parts.push('[RECRUITMENT]');
    parts.push(`status: ${status}`);
    parts.push(`formUrl: ${RECRUITMENT_CONFIG.formUrl}`);
  } catch (e) {}

  // Read all files under backend/data/knowledge_base and build a heuristic summary (cacheable)
  try {
    const kbDir = path.resolve(process.cwd(), 'backend', 'data', 'knowledge_base')
    const cacheFile = path.join(kbDir, '.kb_summary.txt')

    // Use cache if present and recent (24h)
    try {
      const s = await fs.promises.stat(cacheFile)
      const age = Date.now() - s.mtime.getTime()
      if (age < 24 * 60 * 60 * 1000) {
        const cached = await fs.promises.readFile(cacheFile, 'utf-8')
        parts.push('[KNOWLEDGE_BASE_SUMMARY]')
        parts.push(cached.trim())
        // return early using cache
        return parts.join('\n')
      }
    } catch (e) {
      // no cache or unreadable
    }

    const files = await fs.promises.readdir(kbDir)
    const summaries: string[] = []
    for (const f of files) {
      const full = path.join(kbDir, f)
      const stat = await fs.promises.stat(full)
      if (stat.isFile() && f.endsWith('.py')) {
        const txt = await fs.promises.readFile(full, 'utf-8')
        // Heuristic: extract triple-quoted blocks and long comment/paragraph lines
        const triples: string[] = []
        const tripleRe = /"""([\s\S]*?)"""/g
        let m: RegExpExecArray | null
        while ((m = tripleRe.exec(txt)) !== null) {
          const block = m[1].replace(/\s+/g, ' ').trim()
          if (block.length > 30) triples.push(block)
        }
        // fallback: collect long lines
        const longLines = txt.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 40).slice(0, 5)
        const top = triples.length ? triples.slice(0,3) : longLines
        if (top.length) {
          summaries.push(`--- ${f} ---`)
          summaries.push(...top.map(s => s.replace(/\s+/g, ' ').trim()))
        }
      }
    }

    const joined = summaries.join('\n').trim()
    if (joined) {
      // limit size
      const limited = joined.slice(0, 15000)
      parts.push('[KNOWLEDGE_BASE_SUMMARY]')
      parts.push(limited)
      // write cache (best-effort)
      try {
        await fs.promises.writeFile(cacheFile, limited, 'utf-8')
      } catch (e) {
        // ignore cache write errors
      }
    }
  } catch (e) {
    // ignore if folder not present
  }

  return parts.join('\n')
}

// Load knowledge base content
async function loadKnowledgeBase() {
  const parts: string[] = [];

  // Read all files under backend/data/knowledge_base
  try {
    const kbDir = path.resolve(process.cwd(), 'backend', 'data', 'knowledge_base')
    const files = await fs.promises.readdir(kbDir)
    
    for (const file of files) {
      if (file.endsWith('.txt')) {
        try {
          const content = await fs.promises.readFile(path.join(kbDir, file), 'utf-8')
          parts.push(content.trim())
        } catch (e) {
          console.error(`Error reading file ${file}:`, e)
        }
      }
    }
  } catch (e) {
    console.error('Error reading knowledge base:', e)
  }

  return parts.join('\n\n')
}

export async function POST(req: Request) {
  try {
    // Parse request
    let parsedBody: any = null
    try {
      parsedBody = await req.json()
    } catch (e) {
      console.error('Failed to parse JSON body for /api/chat/gemini', e)
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const { message, history } = parsedBody
    console.log('[api/chat/gemini] incoming request, messageLength=', typeof message === 'string' ? message.length : 'none', 'historyLen=', Array.isArray(history) ? history.length : 0)

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid message' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    // Initialize Gemini
    const model = initGemini();
    if (!model) {
      console.error('[api/chat/gemini] GEMINI API not configured')
      return new Response(JSON.stringify({ error: 'AI service unavailable', code: 'NO_GEMINI_KEY' }), { status: 503, headers: { 'Content-Type': 'application/json' } })
    }

    // Load knowledge base
    const knowledgeBase = await loadKnowledgeBase();

    // Build prompt with knowledge base context
    const prompt = `Bạn là trợ lý AI cho Câu lạc bộ Công nghệ – Tài chính (FTC) – UEL.
Vai trò của bạn là cố vấn cho tân sinh viên và trả lời các câu hỏi về CLB.

Thông tin tham khảo từ knowledge base:
${knowledgeBase}

Dựa vào thông tin trên, hãy trả lời câu hỏi sau một cách súc tích bằng tiếng Việt.
Nếu không có thông tin liên quan trong knowledge base, hãy trả lời dựa trên kiến thức chung về fintech và câu lạc bộ sinh viên.
Trả lời cần phải:
- Ngắn gọn, dễ hiểu
- Có cấu trúc rõ ràng (sử dụng gạch đầu dòng nếu cần)
- Thân thiện, phù hợp với tân sinh viên
- Tập trung vào thông tin thực tế và hữu ích

Câu hỏi: ${message}

Trả lời:`;

    // Generate response
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    const answer = result.response?.text?.trim() || 'Xin lỗi, không thể tạo câu trả lời. Vui lòng thử lại.';

    // Generate suggested follow-up questions (5) using Gemini, prefer knowledge base
    let suggestions: string[] = [];
    try {
      const suggestionPrompt = `Bạn là cố vấn thân thiện cho tân sinh viên. Dựa trên thông tin từ knowledge base (nếu có) và câu trả lời vừa soạn ở trên, hãy tạo 5 câu hỏi gợi ý mà tân sinh viên có thể tiếp tục hỏi. Trả về một mảng JSON thuần gồm các chuỗi.`;
      const sugResp = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: suggestionPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 256 }
      });
      const rawSug = sugResp.response?.text?.trim?.() || '';
      try {
        const parsed = JSON.parse(rawSug);
        if (Array.isArray(parsed)) suggestions = parsed.filter((x) => typeof x === 'string');
      } catch (e) {
        // ignore parse errors
      }
    } catch (e) {
      // ignore suggestion generation errors
    }

    return new Response(JSON.stringify({
      response: answer,
      source: 'knowledge_base',
      suggestions
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Error in chat route:', error)
    return new Response(JSON.stringify({
      error: true,
      message: 'Internal server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}
