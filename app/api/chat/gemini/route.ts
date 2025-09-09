import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { matchSuggestedQuestion, buildGroundedPrompt } from '@/lib/faq-grounding'
import { matchClubFaq, buildClubContextBlock, shouldRouteToIndustry } from '@/lib/club-faq'
import { RECRUITMENT_CONFIG } from '@/app/ung-tuyen/constants'

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout

// Validate environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not configured in environment variables');
}

const MODEL_NAME = "gemini-pro";

// Initialize Gemini with validated API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  }
});

// Validate and parse request body
async function parseRequest(req: Request) {
  try {
    const clonedReq = req.clone ? req.clone() : req;
    const body = await clonedReq.json();

    if (!body.message || typeof body.message !== 'string') {
      throw new Error('Invalid message format');
    }

    const history = body.history || [];
    if (!Array.isArray(history)) {
      throw new Error('Invalid history format');
    }

    const mode = body.mode === 'club' ? 'club' : (body.mode === 'domain' ? 'domain' : 'auto')

    return { message: body.message.trim(), history, mode };
  } catch (error) {
    throw new Error('Invalid request body');
  }
}

import fs from 'fs'
import path from 'path'

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

export async function POST(req: Request) {
  try {
    // Validate request
    const { message, history, mode } = await parseRequest(req);
    if (!message) {
      return new Response(
        JSON.stringify({ error: true, message: 'Message cannot be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Determine type of question
    const suggested = matchSuggestedQuestion(message);
    const clubMatch = matchClubFaq(message);
    const industry = shouldRouteToIndustry(message);

    // Build grounding blocks
    const clubContext = buildClubContextBlock(message);
    const backendContext = await fetchBackendContext();

    // If the question is clearly about the club (suggested FAQ or club match), attempt to answer from club data without calling Gemini
    if (suggested.matched || clubMatch) {
      // First try official FAQ
      let answer: string | null = null
      try {
        const hit = matchClubFaq(message)
        if (typeof hit === 'string' && hit.trim()) answer = hit
      } catch (e) {}

      // If no FAQ hit, try to find relevant snippet in the knowledge base summary
      if (!answer) {
        const q = message.toLowerCase()
        const idx = backendContext.toLowerCase().indexOf(q.split(' ')[0] || '')
        if (idx >= 0) {
          const snippet = backendContext.slice(Math.max(0, idx - 200), Math.min(backendContext.length, idx + 600))
          answer = `Thông tin tham khảo từ dữ liệu CLB: ${snippet}`
        }
      }

      if (!answer) answer = 'Thông tin hiện chưa có trong dữ li���u FTC.'

      return new Response(JSON.stringify({ response: answer, source: 'club' }), { headers: { 'Content-Type': 'application/json' } })
    }

    // Otherwise assemble prompt for Gemini and include a summarized knowledge-base context to reduce prompt size but keep coverage
    let prompt = '';
    // buildGroundedPrompt already includes FTC official QA; for non-club questions we will append a KB summary
    const kbSummary = backendContext.slice(0, 4000) // pre-trim summary
    prompt = `You are FTC assistant. Use the official FTC context when answering club-related aspects. For industry questions, you may use external knowledge.\n\n[KB_SUMMARY]\n${kbSummary}\n\n[CLUB_CONTEXT]\n${clubContext}\n\n[USER_QUESTION]\n${message}\n\nPlease answer in Vietnamese, concisely and in friendly tone.`

    // Call Gemini with grounded prompt
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const chat = model.startChat({
          history: history?.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: msg.content,
          })) || [],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) {
          throw new Error('Empty response from Gemini');
        }

        return new Response(
          JSON.stringify({
            response: text,
            source: 'gemini',
            model: MODEL_NAME,
            grounded: suggested.matched || !!clubMatch,
            backendContext
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        attempts++;
        if (attempts === maxAttempts) {
          throw error;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }
  } catch (error: any) {
    console.error('Error in chat route:', error);

    // Determine appropriate error message and status
    let status = 500;
    let message = 'An unexpected error occurred';

    if (error.message === 'Invalid request body' || error.message === 'Message cannot be empty') {
      status = 400;
      message = error.message;
    } else if (error.message.includes('API key')) {
      message = 'Configuration error - please contact support';
    } else if (error.message.includes('SAFETY')) {
      status = 400;
      message = 'Content was filtered for safety reasons';
    }

    return new Response(
      JSON.stringify({
        error: true,
        message,
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      {
        status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
