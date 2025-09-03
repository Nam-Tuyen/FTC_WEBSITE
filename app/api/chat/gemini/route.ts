// app/api/chat/gemini/route.ts
import { NextResponse } from "next/server";
import {
  matchClubFaq,
  getBotFallbackAnswer,
  normalizeVi,
  buildClubContextBlock,
} from "@/lib/club-faq";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-pro";
const GEMINI_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HistItem = { role: "user" | "model"; content: string };

const cleanText = (s: string) => (s ?? "").replace(/\uFFFD/g, "").normalize("NFC").trim();

export async function POST(req: Request) {
  try {
    const { prompt, history } = (await req.json()) as {
      prompt: string;
      history?: HistItem[];
    };

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ text: "Câu hỏi không hợp lệ." }, { status: 400 });
    }

    // CORS base headers
    const baseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    } as const;

    // 1) Chuẩn bị gọi Gemini
    const apiKey =
      process.env.GEMINI_API_KEY ??
      process.env.GOOGLE_API_KEY ?? "";

    if (!apiKey) {
      console.warn("[gemini] Missing GEMINI_API_KEY/GOOGLE_API_KEY (returning fallback)");
      return new NextResponse(JSON.stringify({ text: getBotFallbackAnswer(prompt) }), {
        status: 200,
        headers: baseHeaders,
      });
    }

    // 2) System instruction + club context + history
    const systemInstruction = [
      "Bạn là FTC AI Assistant – trợ lý của CLB Công nghệ – Tài chính (FTC) thuộc UEL.",
      "Mục tiêu: trả lời tự nhiên bằng tiếng Việt, ưu tiên dữ liệu CLB nếu câu hỏi liên quan.",
      "Nếu câu hỏi KHÔNG liên quan CLB, vẫn có thể trả lời Fintech/Blockchain/Data ở mức phổ thông.",
      "Thiếu dữ liệu CLB thì nói 'chưa có thông tin', không bịa đặt.",
      "Sửa/loại bỏ ký tự lỗi encoding nếu có (�, mojibake). Giữ câu trả lời ngắn gọn, đúng trọng tâm.",
      "Nếu người dùng muốn liên hệ, trích email/fanpage từ ngữ cảnh.",
    ].join("\n");

    const contextBlock = buildClubContextBlock(prompt);

    // (tuỳ) FAQ snippet đưa vào ngữ cảnh, không trả sớm
    let faqSnippet = "";
    try {
      const hit = matchClubFaq?.(prompt);
      if (typeof hit === "string" && hit.trim()) {
        faqSnippet = `\n\n# FAQ LIÊN QUAN\n${normalizeVi(hit.trim())}\n`;
      }
    } catch {}

    const contents: Array<{ role: "user" | "model"; parts: { text: string }[] }> = [];

    // Tiêm systemInstruction như 1 phần nội dung (phòng backend bỏ qua field systemInstruction)
    contents.push({
      role: "user",
      parts: [{ text: systemInstruction }],
    });

    // Lịch sử gần đây
    if (Array.isArray(history)) {
      for (const h of history.slice(-8)) {
        if (h?.role === "user" || h?.role === "model") {
          contents.push({ role: h.role, parts: [{ text: normalizeVi(h.content) }] });
        }
      }
    }

    // Câu hỏi hiện tại + context CLB + yêu cầu trả lời
    contents.push({
      role: "user",
      parts: [
        { text: contextBlock + faqSnippet },
        { text: `\n\n# CÂU HỎI\n${normalizeVi(prompt)}` },
        { text: "\n\n# YÊU CẦU TRẢ LỜI\n- Dùng tiếng Việt tự nhiên, ngắn gọn.\n- Ưu tiên dữ liệu CLB trong NGỮ CẢNH nếu liên quan.\n- Thiếu dữ liệu thì nói chưa có, không bịa.\n- Không sinh ký tự lạ." },
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
      return new NextResponse(JSON.stringify({ text: getBotFallbackAnswer(prompt) }), {
        status: 200,
        headers: baseHeaders,
      });
    }

    const data = await r.json().catch(() => ({}));
    const outText = ((data?.candidates?.[0]?.content?.parts ?? [])
      .map((p: any) => p?.text || "")
      .join("") || "").toString();

    const clean = normalizeVi(outText);

    return new NextResponse(
      JSON.stringify({ text: clean || getBotFallbackAnswer(prompt) }),
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
      { text: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau." },
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
