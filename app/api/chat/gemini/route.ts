import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type KBItem = { id?: string; question?: string; answer?: string; content?: string; tags?: string[] };
type FAQItem = { id?: string; canonical_question?: string; answer: string };
type HistoryMsg = { role?: string; content?: string };

function normalize(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

function jaccard(aArr: string[], bArr: string[]) {
  const a = new Set(aArr), b = new Set(bArr);
  let hit = 0;
  for (const t of a) if (b.has(t)) hit++;
  return hit / (a.size + b.size - hit || 1);
}

function levenshtein(a: string, b: string) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function score(q: string, item: KBItem) {
  const text = `${item.question ?? ""}\n${item.answer ?? ""}\n${item.content ?? ""}\n${(item.tags ?? []).join(" ")}`;
  const s = jaccard(normalize(q).split(/\s+/).filter(Boolean), normalize(text).split(/\s+/).filter(Boolean));
  const titleBoost = item.question && normalize(item.question).includes(normalize(q)) ? 0.1 : 0;
  return s + titleBoost;
}

async function readKB(): Promise<KBItem[]> {
  // Ưu tiên lấy từ ENV nếu muốn deploy không đụng filesystem
  const envJson = process.env.KB_JSON;
  if (envJson) {
    try {
      const parsed = JSON.parse(envJson);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray((parsed as any)?.data)) return (parsed as any).data;
    } catch {}
  }
  // Fallback: đọc file trong repo
  const candidates = [
    "public/knowledge_base/faq.json",
    "public/kb.json",
    "knowledge_base/faq.json",
    "configuration_chatbot/knowledge_base/faq.json",
    "configuration_chatbot/knowledge_base/index.json",
  ];
  for (const rel of candidates) {
    try {
      const p = path.resolve(process.cwd(), rel);
      const raw = await fs.readFile(p, "utf8");
      const json = JSON.parse(raw);
      if (Array.isArray(json)) return json;
      if (Array.isArray(json?.data)) return json.data;
    } catch {}
  }
  return [];
}

function extractFAQFromKB(kb: KBItem[]): FAQItem[] {
  return kb
    .filter((it) => it.answer && (((it as any).canonical_question) || it.question))
    .map((it) => ({
      id: it.id,
      canonical_question: (it as any).canonical_question || (it.question ? normalize(it.question) : undefined),
      answer: it.answer as string,
    })) as FAQItem[];
}

function readFAQFromEnv(): FAQItem[] {
  const out: FAQItem[] = [];
  const envJson = process.env.KB_JSON;
  if (!envJson) return out;
  try {
    const parsed = JSON.parse(envJson);
    const faqArr = Array.isArray(parsed?.faq) ? parsed.faq : (Array.isArray(parsed) ? parsed : []);
    for (const f of faqArr) {
      if (f?.answer && (f?.canonical_question || f?.question)) {
        out.push({ id: f.id, canonical_question: normalize(f.canonical_question || f.question), answer: f.answer });
      }
    }
  } catch {}
  return out;
}

function tokenizeForKeywords(s: string) {
  const tokens = normalize(s).split(/\s+/).filter(Boolean);
  return tokens.filter((t) => t.length >= 3);
}

function matchFAQ(userQuestion: string, faqList: FAQItem[]) {
  const uqNorm = normalize(userQuestion);
  let best: { item: FAQItem; score: number; reason: string } | null = null;
  for (const item of faqList) {
    if (!item.canonical_question) continue;
    const cq = item.canonical_question;
    let score = 0;
    let reason = "";

    if (uqNorm === cq || uqNorm.includes(cq)) {
      score = 2.0;
      reason = "direct";
    } else {
      const uqTokens = new Set(tokenizeForKeywords(uqNorm));
      const cqTokens = Array.from(new Set(tokenizeForKeywords(cq)));
      let overlap = 0;
      for (const t of cqTokens) if (uqTokens.has(t)) overlap++;
      if (overlap >= 2) {
        score = 1.0 + overlap * 0.05;
        reason = "keywords";
      }

      const j = jaccard(Array.from(uqTokens), cqTokens);
      if (j >= 0.35) {
        const s = 0.8 + j * 0.2;
        if (s > score) {
          score = s;
          reason = "jaccard";
        }
      }
      if (uqNorm.length > 30 || cq.length > 30) {
        const d = levenshtein(uqNorm, cq);
        if (d <= 10) {
          const s = 0.85 + (10 - d) * 0.01;
          if (s > score) {
            score = s;
            reason = "levenshtein";
          }
        }
      }
    }

    if (!best || score > best.score) best = { item, score, reason };
  }
  return best && best.score >= 0.9 ? best : null;
}

function buildContext(q: string, kb: KBItem[]) {
  const withScores = kb.map(k => ({ k, s: score(q, k) })).sort((a, b) => b.s - a.s);
  const top = withScores.slice(0, 4).filter(x => x.s >= 0.035);
  const ids = top.map(x => x.k.id ?? "");
  const text = top.map(({ k }) => {
    const q = k.question ? `Q: ${k.question}\n` : "";
    const a = k.answer ? `A: ${k.answer}\n` : "";
    const c = k.content ? `${k.content}\n` : "";
    return `${q}${a}${c}`.trim();
  }).join("\n\n---\n\n");
  return { ids, text };
}

function systemPrompt(mode: "kb" | "google", greetOnce: boolean) {
  if (mode === "google") {
    // Ngoài phạm vi FTC: dùng kiến thức tổng quát từ Gemini, không ràng buộc FTC
    return (
      "Bạn là trợ lý AI nói tiếng Việt, giọng điệu tự nhiên, xúc tích, thân thiện nhưng không rườm rà. " +
      (greetOnce ? "Chỉ chào ở tin nhắn đầu tiên nếu người dùng chào trước; về sau trả lời trực tiếp, không mở đầu bằng lời chào. " : "Không mở đầu bằng lời chào. ") +
      "Nếu câu hỏi yêu cầu kiến thức phổ quát, hãy trả lời trực diện, có cấu trúc mạch lạc, tránh gạch đầu dòng và dấu ';'. " +
      "Nếu thiếu dữ liệu, nêu rõ còn thiếu thay vì suy đoán."
    );
  }
  // Trong phạm vi FTC: đóng vai cố vấn FTC, nhưng vẫn tránh chào nhiều lần
  return (
    "Bạn là cố vấn FTC. Trả lời về Câu lạc bộ Công nghệ tài chính FTC bằng tiếng Việt, tự nhiên, xúc tích, mạch lạc. " +
    (greetOnce ? "Chỉ chào ở tin đầu tiên; về sau trả lời trực tiếp, không chào lại. " : "Không mở đầu bằng lời chào. ") +
    "Thông tin nền: FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường ĐH Kinh tế và Luật (ĐHQG-HCM), thành lập 11/2020 (GV hướng dẫn: ThS. NCS Phan Huy Tâm). Hoạt động: hội thảo/tọa đàm FinTech, dữ liệu, AI, ngân hàng số, thị trường vốn, quản trị rủi ro; cuộc thi học thuật ATTACKER; workshop; training nội bộ; tham quan doanh nghiệp (VD: VNG); Web3 Career Innovation; gắn kết cộng đồng FTC Trip. Cơ cấu: 5 ban chuyên môn (Học thuật, Sự kiện, Truyền thông, Tài chính cá nhân, Nhân sự). Cách tham gia: theo dõi Fanpage https://www.facebook.com/clbfintechuel để biết đợt tuyển. Khi thiếu chi tiết, nói \"tài liệu chưa nêu\" và hướng sang Fanpage. Tránh dùng dấu ';' và gạch đầu dòng."
  );
}

function isFirstTurn(body: any): boolean {
  const collect = (arr?: HistoryMsg[]) =>
    Array.isArray(arr) ? arr.filter((m) => (m?.role || "").toLowerCase() !== "system" && !!m?.content).length : 0;
  const histMsgs = (Array.isArray(body?.history) ? body.history : Array.isArray(body?.messages) ? body.messages : []) as HistoryMsg[];
  const assistantCount = histMsgs.filter((m) => (m?.role || "").toLowerCase() === "assistant" || (m?.role || "").toLowerCase() === "model").length;
  return assistantCount === 0; // chưa có trả lời từ bot trước đó
}

function extractUserQuestion(body: any): string {
  // Hỗ trợ nhiều định dạng payload từ FE/builder
  const direct = [body?.message, body?.input, body?.prompt, body?.question].find(
    (x) => typeof x === "string" && String(x).trim()
  );
  if (direct) return String(direct).trim();

  const pickFromArray = (arr: any[]) => {
    const last = [...arr].reverse().find((m) => {
      const role = (m?.role ?? "user").toLowerCase();
      const content = typeof m?.content === "string" ? m.content : m?.content?.toString?.();
      return role !== "system" && content && String(content).trim();
    });
    return last ? String(last.content).trim() : "";
  };

  if (Array.isArray(body?.messages)) {
    const s = pickFromArray(body.messages);
    if (s) return s;
  }
  if (Array.isArray(body?.history)) {
    const s = pickFromArray(body.history);
    if (s) return s;
  }
  return "";
}

export async function POST(req: NextRequest) {
  const started = Date.now();
  let body: any = {};
  try { body = await req.json(); } catch {}

  const userQ = extractUserQuestion(body);

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not set" },
      { status: 500, headers: { "x-chat-route": "gemini-rag", "Cache-Control": "no-store" } }
    );
  }
  if (!userQ) {
    return NextResponse.json(
      { error: "Empty prompt" },
      { status: 400, headers: { "x-chat-route": "gemini-rag", "Cache-Control": "no-store" } }
    );
  }

  const kb = await readKB();
  // Build FAQ set: ENV.faq first, then derive from KB entries
  const faqFromEnv = readFAQFromEnv();
  const faqFromKb = extractFAQFromKB(kb);
  const faqList: FAQItem[] = [...faqFromEnv, ...faqFromKb];

  // FAQ router override
  const matched = faqList.length ? matchFAQ(userQ, faqList) : null;
  if (matched) {
    const headers = new Headers({
      "x-chat-route": "gemini-rag",
      "x-router": "faq",
      "x-faq-id": String(matched.item.id || ""),
      "Cache-Control": "no-store",
    });
    const ans = matched.item.answer;
    return new NextResponse(JSON.stringify({ text: ans, reply: ans, response: ans, mode: "faq" }), { status: 200, headers });
  }
  const { ids, text } = buildContext(userQ, kb);
  const mode: "kb" | "google" = text ? "kb" : "google";
  const greetOnce = isFirstTurn(body);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
    systemInstruction: systemPrompt(mode, greetOnce),
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  });

  const userMsg = text
    ? `CÂU HỎI: ${userQ}\n\nNGỮ CẢNH (CONTEXT):\n${text}\n\nYÊU CẦU PHONG CÁCH: Trả lời tự nhiên, trực diện, không chào lại trừ khi đây là tin nhắn đầu. Không dùng dấu ";" và không dùng gạch đầu dòng.`
    : `CÂU HỎI: ${userQ}\n\nYÊU CẦU PHONG CÁCH: Trả lời tự nhiên, trực diện, không chào lại trừ khi đây là tin nhắn đầu. Không dùng dấu ";" và không dùng gạch đầu dòng.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userMsg }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
    });
    const out = result.response.text();

    const headers = new Headers({
      "x-chat-route": "gemini-rag",
      "x-router": "gemini",
      "x-rag-mode": mode,
      "x-kb-count": String(kb.length),
      "x-kb-hit": String(ids.length),
      "x-duration-ms": String(Date.now() - started),
      "Cache-Control": "no-store",
    });

    const payload = { reply: out, response: out, text: out, mode, kb_hit_ids: ids };
    return new NextResponse(JSON.stringify(payload), { status: 200, headers });
  } catch (err: any) {
    const msg = (err?.message || String(err)).toLowerCase();
    let hint = "unknown";
    if (msg.includes("permission") || msg.includes("401") || msg.includes("api key")) hint = "invalid_or_missing_key";
    else if (msg.includes("safety")) hint = "safety_block";
    else if (msg.includes("quota") || msg.includes("rate")) hint = "quota_or_rate_limit";
    else if (msg.includes("model")) hint = "model_not_available";

    return NextResponse.json(
      { text: "Xin lỗi, hiện chưa thể tạo câu trả lời.", detail: err?.message || String(err) },
      {
        status: 200,
        headers: {
          "x-chat-route": "gemini-rag",
          "x-error": hint,
          "x-duration-ms": String(Date.now() - started),
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
