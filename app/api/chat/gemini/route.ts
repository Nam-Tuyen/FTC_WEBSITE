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

    return { message: body.message.trim(), history };
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

  // Read all files under backend/data/knowledge_base and include their contents
  try {
    const kbDir = path.resolve(process.cwd(), 'backend', 'data', 'knowledge_base')
    const files = await fs.promises.readdir(kbDir)
    const kbParts: string[] = []
    for (const f of files) {
      const full = path.join(kbDir, f)
      const stat = await fs.promises.stat(full)
      if (stat.isFile() && f.endsWith('.py')) {
        const txt = await fs.promises.readFile(full, 'utf-8')
        kbParts.push(`--- ${f} ---`)
        // include the full file content as context; strip non-ascii control chars
        kbParts.push(txt.replace(/\r/g, '').trim())
      }
    }
    if (kbParts.length) {
      parts.push('[KNOWLEDGE_BASE]')
      parts.push(...kbParts)
    }
  } catch (e) {
    // ignore if folder not present
  }

  return parts.join('\n')
}

export async function POST(req: Request) {
  try {
    // Validate request
    const { message, history, mode, showCitations } = await parseRequest(req);
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

    // If client requested club-only mode OR the question clearly matches club FAQ, answer using club dataset without calling Gemini
    if ((typeof (history as any).mode !== 'undefined' && (history as any).mode === 'club') || false) {
      // This branch kept for future use; prefer using explicit mode from parseRequest
    }

    // If mode is 'club', return deterministic club answer using matchClubFaq
    if (mode === 'club') {
      const hit = matchClubFaq(message)
      const answer = hit && typeof hit === 'string' && hit.trim() ? hit : 'Thông tin hiện chưa có trong dữ liệu FTC.'
      return new Response(JSON.stringify({ response: answer, source: 'club', backendContext: backendContext, showCitations }), { headers: { 'Content-Type': 'application/json' } })
    }

    // Otherwise (mode domain/auto), assemble prompt
    let prompt = '';
    if (suggested.matched || clubMatch) {
      // If suggested or club-related, use strict grounding rules from buildGroundedPrompt
      prompt = await buildGroundedPrompt(message);
      // append backend context as additional info (non-authoritative)
      if (backendContext) prompt += `\n\n[BACKEND_DATA]\n${backendContext}`;
    } else {
      // For industry or general questions, include club context as reference but allow external knowledge
      prompt = `You are FTC assistant. Before answering, consult the official FTC context below for any club-related facts. Use external knowledge for industry questions.\n\n[CLUB_CONTEXT]\n${clubContext}\n\n[BACKEND_DATA]\n${backendContext}\n\n[USER_QUESTION]\n${message}\n\nRespond in Vietnamese, concise, friendly.`
    }

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
            backendContext,
            showCitations
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
