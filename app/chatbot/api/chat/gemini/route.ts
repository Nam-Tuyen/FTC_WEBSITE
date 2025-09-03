// /app/api/chat/gemini/route.ts
import { NextResponse } from "next/server"
import { matchClubFaq, shouldRouteToIndustry, getBotFallbackAnswer, isClubRelated } from "@/lib/club-faq"

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type HistItem = { role: "user" | "model"; content: string }

function buildPrompt(userQuestion: string, domain?: string) {
  return (
    `Bạn là trợ lý AI cho Câu lạc bộ Công nghệ – Tài chính (FTC) – UEL.\n\n` +
    `Ngữ cảnh: người hỏi là sinh viên/quan tâm Fintech. Trả lời súc tích, tiếng Việt, có cấu trúc gọn (gạch đầu dòng khi phù hợp), ưu tiên hướng dẫn thực hành.\n` +
    `Nếu câu hỏi mang tính chuyên môn ${domain ? `(${domain})` : ""}, hãy giải thích khái niệm và đưa ví dụ gần gũi, tránh phóng đại rủi ro/lợi ích.\n` +
    `Không bịa đặt thông tin nội bộ. Nếu thiếu dữ liệu, nói rõ và đề xuất cách tìm hiểu tiếp.\n\n` +
    `Câu hỏi người dùng: ${userQuestion}`
  )
}

export async function POST(req: Request) {
  try {
    const { prompt, history } = (await req.json()) as {
      prompt: string
      history?: HistItem[]
    }

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ text: "Câu hỏi không hợp lệ." }, { status: 400 })
    }

    const response = NextResponse.json({ text: "" }, { status: 200 })
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type")

    // 1) FAQ nội bộ → trả ngay
    const faqHit = matchClubFaq(prompt)
    if (faqHit) {
      return NextResponse.json({ text: faqHit }, { status: 200 })
    }

    // 2) Phân loại: câu hỏi liên quan CLB hay không
    const club = isClubRelated(prompt)
    const { domain } = shouldRouteToIndustry(prompt)

    // 3) Câu hỏi liên quan CLB nhưng không khớp FAQ → trả lời fallback thân thiện (hướng dẫn liên hệ)
    if (club) {
      return NextResponse.json({ text: getBotFallbackAnswer(prompt) }, { status: 200 })
    }

    // 4) Không liên quan CLB → gọi Gemini để trả lời

    // 4) Gọi Gemini
    const apiKey =
      process.env.GEMINI_API_KEY ??
      process.env.GOOGLE_API_KEY ?? // hỗ trợ tên biến phổ biến khác
      ""

    if (!apiKey) {
      console.warn("No Gemini API key found, using fallback response")
      return NextResponse.json({ text: getBotFallbackAnswer(prompt) }, { status: 200 })
    }

    // Đưa history vào "contents" để giữ ngữ cảnh
    const contents: Array<{ role: "user" | "model"; parts: { text: string }[] }> = []
    if (Array.isArray(history)) {
      for (const h of history.slice(-8)) {
        if (h?.role === "user" || h?.role === "model") {
          contents.push({ role: h.role, parts: [{ text: h.content }] })
        }
      }
    }
    // Thêm lượt hỏi hiện tại (đã ghép prompt hướng dẫn)
    contents.push({ role: "user", parts: [{ text: buildPrompt(prompt, domain) }] })

    const r = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
        ],
      }),
    })

    if (!r.ok) {
      const errText = await r.text().catch(() => "")
      console.error("Gemini error", r.status, errText)
      return NextResponse.json({ text: getBotFallbackAnswer(prompt) }, { status: 200 })
    }

    const data = await r.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.() ?? ""

    return NextResponse.json({ text: text || getBotFallbackAnswer(prompt) }, { status: 200 })
  } catch (e) {
    console.error("API error", e)
    return NextResponse.json({ text: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau." }, { status: 200 })
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
  })
}
