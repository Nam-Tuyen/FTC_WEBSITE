import { NextResponse } from "next/server";
import { z } from "zod";
import { getGemini } from "@/lib/gemini";
import { retrieveTopN } from "@/lib/rag";
import { SYSTEM_ROLE, buildRAGPrompt } from "@/lib/prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ChatSchema = z.object({
  mode: z.enum(["club", "major"]).default("club"),
  message: z.string().min(1),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant", "system"]), content: z.string() }))
    .optional(),
});

function sanitize(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*{1,}|_{1,2}|~{2,}/g, "")
    .replace(/[\u0000-\u001F]/g, " ")
    .trim();
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const { mode, message, history } = ChatSchema.parse(raw);

    const model = getGemini();

    const preface = `Xin chào! Tôi là FTC AI Assistant.\n\nTôi có thể giúp bạn:\n• Trả lời câu hỏi về câu lạc bộ\n• Giải thích khái niệm Fintech\n• Hướng dẫn tham gia hoạt động\n• Tìm thông tin trên website\n\n📮 Liên hệ: clbcongnghetaichinh@st.uel.edu.vn\n📘 Fanpage: https://www.facebook.com/clbfintechuel`;

    let finalPrompt = "";
    if (mode === "club") {
      const top = retrieveTopN(message, 6);
      const rag = buildRAGPrompt(message, top);
      finalPrompt = `${SYSTEM_ROLE}\n\n${rag}\n\nYêu cầu: Trả lời chính xác dựa trên context nếu có; nếu không có, nói rõ thiếu context nội bộ, sau đó trả lời theo hiểu biết chung. Dùng tiếng Việt tự nhiên, dễ hiểu.`;
    } else {
      finalPrompt = `${SYSTEM_ROLE}\n\nCâu hỏi: ${message}\nYêu cầu: Trả lời ngắn gọn, dễ hiểu, định hướng tân sinh viên Fintech.`;
    }

    const historyText = (history || [])
      .map((h) => `${h.role.toUpperCase()}: ${h.content}`)
      .join("\n");

    const composed = `${historyText ? historyText + "\n\n" : ""}${finalPrompt}`;

    const resp = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: composed }] }],
    });
    const text = sanitize(resp.response.text());

    const suggestionPrompt =
      mode === "club"
        ? `${SYSTEM_ROLE}\nHãy tạo 5 câu hỏi gợi ý liên quan đến câu trả lời trên, bám vào nội dung từ knowledge_base. Trả về mảng JSON thuần.`
        : `${SYSTEM_ROLE}\nHãy tạo 5 câu hỏi gợi ý cho tân sinh viên Fintech (không cần KB). Trả về mảng JSON thuần.`;

    let suggestions: string[] = [];
    try {
      const sug = await model.generateContent({ contents: [{ role: "user", parts: [{ text: suggestionPrompt }] }] });
      const rawSug = sug.response.text();
      const parsed = JSON.parse(rawSug);
      if (Array.isArray(parsed)) suggestions = parsed.filter((x) => typeof x === "string");
    } catch {}

    return NextResponse.json({ preface, reply: text, suggestions });
  } catch (err: any) {
    const msg = err?.message || "Unexpected error";
    const status = /Missing GEMINI_API_KEY|GOOGLE_API_KEY/.test(msg) ? 500 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
