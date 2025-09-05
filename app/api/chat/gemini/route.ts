import { matchSuggestedQuestion, buildGroundedPrompt } from '@/lib/faq-grounding'

export const dynamic = 'force-dynamic';

function extractTextFromGemini(data: any) {
  try {
    const parts = data?.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) {
      const txt = parts.map((p: any) => p?.text).filter(Boolean).join('\n').trim();
      if (txt) return txt;
    }
    const txt2 = data?.candidates?.[0]?.text ?? data?.output_text ?? '';
    if (txt2) return String(txt2);
  } catch (e) {
    // ignore
  }
  return '';
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), { status: 500 });
    }

    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    const { matched } = matchSuggestedQuestion(prompt || '');
    const contentText = matched ? buildGroundedPrompt(prompt || '') : (prompt || 'Hello from Vercel + Gemini');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const body = { contents: [{ parts: [{ text: contentText }] }] };

    let r
    let data = {}
    try {
      r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        // keep redirects manual to detect issues
        redirect: 'follow',
      })
    } catch (networkErr: any) {
      return new Response(JSON.stringify({ error: true, message: 'Network error when calling Gemini API', details: String(networkErr?.message || networkErr) }), { status: 502, headers: { 'Content-Type': 'application/json' } })
    }

    try {
      data = await r.json().catch(() => ({}))
    } catch (e) {
      data = {}
    }

    if (!r || !r.ok) {
      return new Response(JSON.stringify({ error: true, status: r?.status || 500, data }), { status: 502, headers: { 'Content-Type': 'application/json' } })
    }

    const text = extractTextFromGemini(data);
    return new Response(
      JSON.stringify({ text, source: 'gemini', model, raw: data, grounded: Boolean(matched) }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: true, message: e?.message || 'Unknown error' }), { status: 500 });
  }
}
