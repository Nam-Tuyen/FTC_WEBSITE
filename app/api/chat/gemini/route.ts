// app/api/chat/gemini/route.ts
import { NextResponse } from "next/server";
import {
  FTCKB,
  buildSystemInstructionFromKB,
  buildContextFromKB,
  normalizeVi,
} from "@/lib/kb/ftc";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-pro";
const GEMINI_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HistItem = { role: "user" | "model"; content: string };

export async function POST(req: Request) {
  try {
    const { prompt, history } = (await req.json()) as {
      prompt: string;
      history?: HistItem[];
    };

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ text: "Câu hỏi không hợp lệ." }, { status: 400 });
    }

    const baseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    } as const;

    const apiKey =
      process.env.GEMINI_API_KEY ??
      process.env.GOOGLE_API_KEY ?? "";

    if (!apiKey) {
      console.warn("[gemini] Missing GEMINI_API_KEY/GOOGLE_API_KEY (returning fallback)");
      return new NextResponse(JSON.stringify({
        text: "Xin lỗi, hiện chưa có khóa API. Vui lòng liên hệ quản trị viên để cấp GEMINI_API_KEY.",
        source: "fallback",
        error: "missing_api_key",
      }), { status: 200, headers: baseHeaders });
    }

    // ====== LUÔN DÙNG GEMINI ======
    const systemInstruction = buildSystemInstructionFromKB(FTCKB);
    const contextBlock = buildContextFromKB(FTCKB, prompt);

    const contents: Array<{ role: "user" | "model"; parts: { text: string }[] }> = [];

    // Tiêm systemInstruction vào contents để chắc mô hình luôn "thấy"
    contents.push({ role: "user", parts: [{ text: systemInstruction }] });

    // Lịch sử gần đây (tối đa 8)
    if (Array.isArray(history)) {
      for (const h of history.slice(-8)) {
        if (h?.role === "user" || h?.role === "model") {
          contents.push({ role: h.role, parts: [{ text: normalizeVi(h.content) }] });
        }
      }
    }

    // Câu hỏi hiện tại + context
    contents.push({
      role: "user",
      parts: [
        { text: contextBlock },
        { text: `\n\n# CÂU HỎI\n${normalizeVi(prompt)}` },
        { text: "\n\n# YÊU CẦU TRẢ LỜI\n- Dùng tiếng Việt tự nhiên, ngắn gọn, đúng trọng tâm.\n- Ưu tiên dữ liệu CLB trong NGỮ CẢNH nếu liên quan.\n- Thiếu dữ liệu thì nói chưa có, không bịa.\n- Không sinh ký tự lạ (�)." },
      ],
    });

    const body = {
      contents,
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
      generationConfig: { temperature: 0.6, topK: 32, topP: 0.95, maxOutputTokens: 1024 },
      safetySettings: [
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
      ],
    };

    const r = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      console.error("[gemini] HTTP", r.status, errText);
      return new NextResponse(JSON.stringify({
        text: "Xin lỗi, hệ thống đang bận hoặc API gặp sự cố. Vui lòng thử lại sau.",
        source: "fallback",
        error: `http_${r.status}${errText ? ": " + errText.slice(0, 200) : ""}`,
      }), { status: 200, headers: baseHeaders });
    }

    const data = await r.json().catch(() => ({}));
    const outText = ((data?.candidates?.[0]?.content?.parts ?? [])
      .map((p: any) => p?.text || "")
      .join("") || "").toString();

    const clean = normalizeVi(outText);

    return new NextResponse(
      JSON.stringify({
        text: clean,
        source: "gemini",
      }),
      {
        status: 200,
        headers: {
          ...baseHeaders,
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (e) {
    console.error("[gemini] Exception", e);
    return NextResponse.json(
      { text: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.", source: "fallback", error: (e as Error)?.message || "exception" },
      { status: 200 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
