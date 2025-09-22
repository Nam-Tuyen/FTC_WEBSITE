import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type KBItem = { id?: string; question?: string; answer?: string; content?: string; tags?: string[] };

async function readKB(): Promise<KBItem[]> {
  const candidates = [
    "configuration_chatbot/knowledge_base/faq.json",
    "knowledge_base/faq.json",
    "configuration_chatbot/knowledge_base/index.json",
    "public/knowledge_base/faq.json",
  ];
  for (const rel of candidates) {
    try {
      const p = path.resolve(process.cwd(), rel);
      const raw = await fs.readFile(p, "utf8");
      const json = JSON.parse(raw);
      if (Array.isArray(json)) return json as KBItem[];
      if (Array.isArray((json as any)?.data)) return (json as any).data as KBItem[];
    } catch {}
  }
  return [];
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

function score(q: string, item: KBItem) {
  const text = `${item.question ?? ""}\n${item.answer ?? ""}\n${item.content ?? ""}\n${(item.tags ?? []).join(" ")}`;
  const a = new Set(normalize(q).split(/\s+/).filter(Boolean));
  const b = new Set(normalize(text).split(/\s+/).filter(Boolean));
  let hit = 0;
  for (const t of a) if (b.has(t)) hit++;
  const j = hit / (a.size + b.size - hit || 1);
  const titleBoost = item.question && normalize(item.question).includes(normalize(q)) ? 0.1 : 0;
  return j + titleBoost;
}

function buildContext(q: string, kb: KBItem[]) {
  const withScores = kb.map((k) => ({ k, s: score(q, k) })).sort((x, y) => y.s - x.s);
  const top = withScores.slice(0, 4).filter((x) => x.s >= 0.035);
  return {
    ids: top.map((x) => x.k.id ?? ""),
    text: top
      .map(({ k }) => {
        const q = k.question ? `Q: ${k.question}\n` : "";
        const a = k.answer ? `A: ${k.answer}\n` : "";
        const c = k.content ? `${k.content}\n` : "";
        return `${q}${a}${c}`.trim();
      })
      .join("\n\n---\n\n"),
  };
}

const genAI = new GoogleGenerativeAI({ apiKey: (process.env.GEMINI_API_KEY as string) || (process.env.GOOGLE_API_KEY as string) || "" });

function systemPrompt(mode: "kb" | "google") {
  return mode === "kb"
    ? "Bạn là trợ lý FTC (Câu lạc bộ Công nghệ Tài chính – UEL). Trả lời NGẮN GỌN, chính xác, dựa vào CONTEXT. Nếu CONTEXT thiếu, bổ sung kiến thức phổ thông và nêu 2–3 nguồn (tên miền)."
    : "CHẾ ĐỘ MÔ PHỎNG TÌM KIẾM GOOGLE: tổng hợp nhanh, có cấu trúc; luôn đưa 2–3 nguồn uy tín dạng (nguồn: domain1, domain2, ...).";
}

export async function POST(req: NextRequest) {
  const started = Date.now();
  const body = await req.json().catch(() => ({} as any));

  // Accept both shapes: { messages: [...] } and { message, history }
  const arr = Array.isArray((body as any)?.messages) ? (body as any).messages : [];
  const lastFromArray = [...arr].reverse().find((m: any) => m && m.role === "user");
  const fromSingle = typeof (body as any)?.message === "string" ? (body as any).message : "";
  const userQ: string = String((lastFromArray?.content ?? fromSingle ?? "")).trim();

  if (!userQ) {
    return NextResponse.json(
      { error: "Invalid message" },
      { status: 400, headers: { "x-chat-route": "gemini-rag", "Cache-Control": "no-store" } }
    );
  }

  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not set" },
      { status: 500, headers: { "x-chat-route": "gemini-rag", "Cache-Control": "no-store" } }
    );
  }

  const kb = await readKB();
  const { ids, text } = buildContext(userQ, kb);
  const mode: "kb" | "google" = text ? "kb" : "google";

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
    systemInstruction: systemPrompt(mode),
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUAL, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  });

  const userMsg =
    mode === "kb"
      ? `CÂU HỎI: ${userQ}\n\nCONTEXT:\n${text}\n\nYÊU CẦU: Dựa tối đa vào CONTEXT; nếu thiếu, bổ sung kiến thức phổ thông và nêu nguồn.`
      : `CÂU HỎI: ${userQ}\n\nYÊU CẦU: Mô phỏng tìm kiếm Google và trả lời, kèm 2–3 nguồn (tên miền).`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userMsg }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
    });
    const out = result.response.text();

    const headers = new Headers({
      "x-chat-route": "gemini-rag",
      "x-rag-mode": mode,
      "x-kb-count": String(kb.length),
      "x-kb-hit": String(ids.length),
      "x-duration-ms": String(Date.now() - started),
      "Cache-Control": "no-store",
    });

    return new NextResponse(
      JSON.stringify({ text: out, reply: out, response: out, mode, kb_hit_ids: ids }),
      { status: 200, headers }
    );
  } catch (err: any) {
    console.error("[gemini-route]", err?.message || err);
    return NextResponse.json(
      { text: "Xin lỗi, hiện chưa thể tạo câu trả lời.", reply: "Xin lỗi, hiện chưa thể tạo câu trả lời.", response: "Xin lỗi, hiện chưa thể tạo câu trả lời.", detail: err?.message || String(err) },
      { status: 200, headers: { "x-chat-route": "gemini-rag", "x-error": err?.name || "unknown", "Cache-Control": "no-store" } }
    );
  }
}
