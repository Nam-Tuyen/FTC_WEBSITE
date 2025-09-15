import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGemini(modelName = process.env.GEMINI_MODEL || "gemini-1.5-pro-latest") {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY or GOOGLE_API_KEY");
  const genAI = new GoogleGenerativeAI({ apiKey });
  return genAI.getGenerativeModel({ model: modelName });
}
