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
  if (!key) {
    console.error('GEMINI_API_KEY not found in environment variables')
    return null;
  }
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

  // Read all files under knowledge_base directory
  try {
    const kbDir = path.resolve(process.cwd(), 'knowledge_base')
    console.log('Looking for knowledge base at:', kbDir)
    
    const files = await fs.promises.readdir(kbDir)
    console.log('Found knowledge base files:', files)
    
    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.txt')) {
        try {
          const content = await fs.promises.readFile(path.join(kbDir, file), 'utf-8')
          parts.push(content.trim())
          console.log(`Loaded knowledge from ${file}`)
        } catch (e) {
          console.error(`Error reading file ${file}:`, e)
        }
      }
    }
  } catch (e) {
    console.error('Error reading knowledge base:', e)
    // Fallback: return basic information about FTC
    parts.push(`
Câu lạc bộ Công nghệ – Tài chính (FTC) – UEL là một câu lạc bộ sinh viên chuyên về lĩnh vực fintech.

Các ban trong câu lạc bộ:
- Ban Chủ nhiệm: Điều hành và quản lý câu lạc bộ
- Ban Nội dung: Tổ chức các hoạt động học thuật và sự kiện
- Ban Truyền thông: Quản lý mạng xã hội và truyền thông
- Ban Kỹ thuật: Phát triển các dự án công nghệ
- Ban Đối ngoại: Kết nối với các đối tác và doanh nghiệp

Hoạt động chính:
- Tổ chức các workshop về fintech
- Tham gia các cuộc thi lập trình và fintech
- Kết nối với các chuyên gia trong ngành
- Phát triển các dự án thực tế
    `)
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
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('GEMINI') || k.includes('GOOGLE')))
      
      // Provide fallback response based on common questions
      let fallbackResponse = '';
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('ban') || lowerMessage.includes('các ban')) {
        fallbackResponse = `Câu lạc bộ Công nghệ – Tài chính (FTC) có các ban chính sau:

**Ban Chủ nhiệm**: Điều hành và quản lý toàn bộ hoạt động của câu lạc bộ, đưa ra các quyết định chiến lược.

**Ban Nội dung**: Tổ chức các hoạt động học thuật, workshop, seminar về fintech và công nghệ tài chính.

**Ban Truyền thông**: Quản lý mạng xã hội, website, tạo nội dung truyền thông và quảng bá câu lạc bộ.

**Ban Kỹ thuật**: Phát triển các dự án công nghệ, ứng dụng fintech và hỗ trợ kỹ thuật cho các hoạt động.

**Ban Đối ngoại**: Kết nối với các doanh nghiệp, đối tác, tổ chức các sự kiện networking và tìm kiếm cơ hội hợp tác.

Mỗi ban đều có vai trò quan trọng trong việc phát triển câu lạc bộ và tạo ra giá trị cho thành viên.`;
      } else if (lowerMessage.includes('hoạt động') || lowerMessage.includes('chương trình')) {
        fallbackResponse = `Câu lạc bộ FTC tổ chức nhiều hoạt động đa dạng:

**Hoạt động học thuật**:
- Workshop về blockchain, AI trong tài chính
- Seminar với chuyên gia trong ngành
- Cuộc thi lập trình fintech

**Hoạt động thực tế**:
- Phát triển dự án fintech
- Tham gia hackathon
- Thực tập tại các công ty fintech

**Hoạt động kết nối**:
- Networking events
- Company visits
- Mentorship programs

**Hoạt động cộng đồng**:
- Team building
- Social events
- Community service`;
      } else {
        fallbackResponse = `Xin chào! Tôi là trợ lý AI của Câu lạc bộ Công nghệ – Tài chính (FTC) – UEL.

Câu lạc bộ FTC là nơi sinh viên có thể:
- Học hỏi về fintech và công nghệ tài chính
- Tham gia các hoạt động thực tế
- Kết nối với chuyên gia trong ngành
- Phát triển kỹ năng lập trình và tư duy kinh doanh

Để biết thêm thông tin chi tiết, bạn có thể hỏi về:
- Các ban trong câu lạc bộ
- Hoạt động và chương trình
- Cách tham gia
- Lịch sử và thành tích`;
      }
      
      return new Response(JSON.stringify({ 
        response: fallbackResponse,
        source: 'fallback',
        suggestions: [
          'Làm thế nào để tham gia câu lạc bộ FTC?',
          'Các hoạt động của câu lạc bộ có gì?',
          'Làm sao để đăng ký tham gia?',
          'Câu lạc bộ có những chương trình gì?',
          'Làm thế nào để liên hệ với ban chủ nhiệm?'
        ]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } })
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

    // helper to extract text from various SDK response shapes
    function extractText(resp: any) {
      try {
        if (!resp) return ''
        // older SDK: resp.response.text() is a function
        if (resp.response && typeof resp.response.text === 'function') {
          return String(resp.response.text()).trim()
        }
        // newer SDK: resp.response.text is string
        if (resp.response && typeof resp.response.text === 'string') {
          return resp.response.text.trim()
        }
        // fallback: check common fields
        if (typeof resp.output_text === 'string') return resp.output_text.trim()
        if (Array.isArray(resp.output) && resp.output.length) {
          const first = resp.output[0]
          if (first && Array.isArray(first.content) && first.content.length) {
            const part = first.content[0]
            if (part && typeof part.text === 'string') return part.text.trim()
          }
        }
        return ''
      } catch (e) {
        return ''
      }
    }

    // Generate response
    let result;
    try {
      result = await model.generateContent(prompt);
      console.log('Gemini result:', result);
    } catch (error) {
      console.error('Error generating content:', error);
      return new Response(JSON.stringify({
        error: true,
        message: 'Failed to generate response',
        response: 'Xin lỗi, có lỗi xảy ra khi tạo câu trả lời. Vui lòng thử lại sau.',
        suggestions: [
          'Làm thế nào để tham gia câu lạc bộ FTC?',
          'Các hoạt động của câu lạc bộ có gì?',
          'Làm sao để đăng ký tham gia?',
          'Câu lạc bộ có những chương trình gì?',
          'Làm thế nào để liên hệ với ban chủ nhiệm?'
        ]
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const answer = extractText(result) || 'Xin lỗi, không thể tạo câu trả lời. Vui lòng thử lại.';
    console.log('Extracted answer:', answer);

    // Generate suggested follow-up questions (5) using Gemini, prefer knowledge base
    let suggestions: string[] = [];
    try {
      const suggestionPrompt = `Dựa trên câu hỏi "${message}" và câu trả lời vừa rồi, hãy tạo 5 câu hỏi gợi ý liên quan mà tân sinh viên có thể hỏi tiếp. Trả về dạng JSON array: ["câu hỏi 1", "câu hỏi 2", "câu hỏi 3", "câu hỏi 4", "câu hỏi 5"]`;
      const sugResp = await model.generateContent(suggestionPrompt);
      const rawSug = extractText(sugResp)
      console.log('Raw suggestions:', rawSug)
      
      try {
        // Try to extract JSON from the response
        const jsonMatch = rawSug.match(/\[.*?\]/s);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            suggestions = parsed.filter((x) => typeof x === 'string').slice(0, 5);
          }
        }
      } catch (e) {
        console.log('Failed to parse suggestions JSON:', e)
        // Fallback suggestions
        suggestions = [
          'Làm thế nào để tham gia câu lạc bộ FTC?',
          'Các hoạt động của câu lạc bộ có gì?',
          'Làm sao để đăng ký tham gia?',
          'Câu lạc bộ có những chương trình gì?',
          'Làm thế nào để liên hệ với ban chủ nhiệm?'
        ];
      }
    } catch (e) {
      console.log('Error generating suggestions:', e)
      // Fallback suggestions
      suggestions = [
        'Làm thế nào để tham gia câu lạc bộ FTC?',
        'Các hoạt động của câu lạc bộ có gì?',
        'Làm sao để đăng ký tham gia?',
        'Câu lạc bộ có những chương trình gì?',
        'Làm thế nào để liên hệ với ban chủ nhiệm?'
      ];
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
      response: 'Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau.',
      suggestions: [
        'Làm thế nào để tham gia câu lạc bộ FTC?',
        'Các hoạt động của câu lạc bộ có gì?',
        'Làm sao để đăng ký tham gia?',
        'Câu lạc bộ có những chương trình gì?',
        'Làm thế nào để liên hệ với ban chủ nhiệm?'
      ],
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}
