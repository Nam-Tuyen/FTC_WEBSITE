// app/api/chat/gemini/route.ts
import { NextResponse } from "next/server";
import {
  matchClubFaq,
  shouldRouteToIndustry,
  getBotFallbackAnswer,
  isClubRelated,
} from "@/lib/club-faq";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const runtime = "nodejs";         // chạy Node.js runtime để đọc process.env
export const dynamic = "force-dynamic";  // tránh cache cứng giá trị env

type HistItem = { role: "user" | "model"; content: string };

function buildPrompt(userQuestion: string, domain?: string) {
  return (
    `Bạn là trợ lý AI cho Câu lạc bộ Công nghệ – Tài chính (FTC) – UEL.\n\n` +
    `Ngữ cảnh: người hỏi là sinh viên/quan tâm Fintech. Trả lời súc tích, tiếng Việt, có cấu trúc gọn, ưu tiên hướng dẫn thực hành.\n` +
    `Nếu câu hỏi mang tính chuyên môn ${domain ? `(${domain})` : ""}, hãy giải thích khái niệm và đưa ví dụ gần gũi.\n` +
    `Không bịa đặt thông tin nội bộ. Nếu thiếu dữ liệu, nói rõ và đề xuất cách tìm hiểu tiếp.\n\n` +
    `Câu hỏi người dùng: ${userQuestion}`
  );
}

export async function POST(req: Request) {
  try {
    const { prompt, history } = (await req.json()) as {
      prompt: string;
      history?: HistItem[];
    };

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ text: "Câu hỏi không hợp lệ." }, { status: 400 });
    }

    // CORS (nếu gọi từ origin khác)
    const baseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    } as const;

    // 1) FAQ nội bộ → trả ngay
    const faqHit = matchClubFaq(prompt);
    if (faqHit) {
      return new NextResponse(JSON.stringify({ text: faqHit }), {
        status: 200,
        headers: baseHeaders,
      });
    }

    // 2) Phân loại
    const club = isClubRelated(prompt);
    const { domain } = shouldRouteToIndustry(prompt);

    // 3) Câu hỏi liên quan CLB → fallback thân thiện (không gọi Gemini)
    if (club) {
      return new NextResponse(JSON.stringify({ text: getBotFallbackAnswer(prompt) }), {
        status: 200,
        headers: baseHeaders,
      });
    }

    // 4) Không liên quan CLB → gọi Gemini
    const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      // Không ném lỗi để build/deploy không vỡ; trả fallback thay thế
      console.warn("[gemini] Missing GEMINI_API_KEY/GOOGLE_API_KEY (returning fallback)");
      return new NextResponse(JSON.stringify({ text: getBotFallbackAnswer(prompt) }), {
        status: 200,
        headers: baseHeaders,
      });
    }

    // Lắp history giữ ngữ cảnh
    const contents: Array<{ role: "user" | "model"; parts: { text: string }[] }> = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-8)) {
        if (h?.role === "user" || h?.role === "model") {
          contents.push({ role: h.role, parts: [{ text: h.content }] });
        }
      }
    }
    contents.push({ role: "user", parts: [{ text: buildPrompt(prompt, domain) }] });

    const r = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.4, topK: 32, topP: 0.95, maxOutputTokens: 1024 },
        safetySettings: [
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
        ],
      }),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      console.error("[gemini] HTTP", r.status, errText);
      return new NextResponse(JSON.stringify({ text: getBotFallbackAnswer(prompt) }), {
        status: 200,
        headers: baseHeaders,
      });
    }

    const data = (await r.json().catch(() => ({}))) as any;
    const text: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.() ??
      getBotFallbackAnswer(prompt);

    return new NextResponse(JSON.stringify({ text }), {
      status: 200,
      headers: baseHeaders,
    });
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
