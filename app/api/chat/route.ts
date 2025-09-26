import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { ChatMode } from "@/chatbot/types";
import { detectMode, buildSystemPrompt, normalize } from "@/chatbot/router";
import { faqMatchOrNull } from "@/chatbot/data/faq";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function extractUserQuestion(body: any): string {
  const direct = [body?.message, body?.input, body?.prompt, body?.question].find(
    (x) => typeof x === "string" && String(x).trim()
  );
  if (direct) return String(direct).trim();

  const arr = Array.isArray(body?.messages) ? body.messages : Array.isArray(body?.history) ? body.history : [];
  if (Array.isArray(arr)) {
    for (let i = arr.length - 1; i >= 0; i--) {
      const m = arr[i]; const role = (m?.role ?? "user").toLowerCase();
      const c = typeof m?.content === "string" ? m.content : m?.content?.toString?.();
      if (role !== "system" && c && String(c).trim()) return String(c).trim();
    }
  }
  return "";
}

export async function POST(req: NextRequest) {
  const started = Date.now();
  let body: any = {};
  try { body = await req.json(); } catch {}
  const userQ = extractUserQuestion(body);
  if (!userQ) return NextResponse.json({ error: "Empty prompt" }, { status: 400, headers: { "Cache-Control": "no-store" } });

  let mode: ChatMode = (body.mode || "").toLowerCase();
  if (mode !== "club" && mode !== "industry") mode = detectMode(userQ);

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }

  // 1) CLUB: ưu tiên FAQ nội bộ
  if (mode === "club") {
    const matched = faqMatchOrNull(userQ);
    console.log("Club mode - Question:", userQ);
    console.log("Club mode - Normalized:", normalize(userQ));
    console.log("Club mode - Matched:", matched);
    if (matched) {
      console.log("Club mode - Returning FAQ response");
      return NextResponse.json(
        { reply: matched.trim(), response: matched.trim(), text: matched.trim(), mode },
        { status: 200, headers: { "x-mode": mode, "x-route": "faq", "Cache-Control": "no-store" } }
      );
    }
    console.log("Club mode - No FAQ match, proceeding to Gemini");
  }

  // 2) Gọi Gemini theo SYSTEM PROMPT từng mode
  console.log("Calling Gemini with mode:", mode);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
    systemInstruction: buildSystemPrompt(mode),
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  });

  const userMsg = `CÂU HỎI: ${userQ}`;
  console.log("Gemini - User message:", userMsg);
  console.log("Gemini - System prompt length:", buildSystemPrompt(mode).length);
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userMsg }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
    });
    const out = result.response.text().trim();
    console.log("Gemini - Response:", out);

    return new NextResponse(JSON.stringify({ reply: out, response: out, text: out, mode }), {
      status: 200,
      headers: {
        "x-mode": mode,
        "x-route": "gemini",
        "x-duration-ms": String(Date.now() - started),
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.log("Gemini - Error:", err.message);
    const msg = (err?.message || String(err)).toLowerCase();
    let hint = "unknown";
    if (msg.includes("permission") || msg.includes("401") || msg.includes("api key")) hint = "invalid_or_missing_key";
    else if (msg.includes("safety")) hint = "safety_block";
    else if (msg.includes("quota") || msg.includes("rate")) hint = "quota_or_rate_limit";
    else if (msg.includes("model")) hint = "model_not_available";

    return NextResponse.json(
      { text: "Xin lỗi, hiện chưa thể tạo câu trả lời.", detail: err?.message || String(err) },
      { status: 200, headers: { "x-error": hint, "x-duration-ms": String(Date.now() - started), "Cache-Control": "no-store" } }
    );
  }
}
