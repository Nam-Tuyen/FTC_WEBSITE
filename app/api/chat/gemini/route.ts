export const runtime = 'edge';
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body = { contents: [{ parts: [{ text: prompt || 'Hello from Vercel + Gemini' }] }] };

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return new Response(JSON.stringify({ error: true, status: r.status, data }), { status: 500 });
    }

    const text = extractTextFromGemini(data);
    return new Response(JSON.stringify({ text, source: 'gemini', model, raw: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: true, message: e?.message || 'Unknown error' }), { status: 500 });
  }
}
