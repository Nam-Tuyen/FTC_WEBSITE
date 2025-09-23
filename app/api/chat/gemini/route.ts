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

const STATIC_FAQS: FAQItem[] = [
  {
    canonical_question: "câu lạc bộ có những hoạt động gì",
    answer: "FTC triển khai hệ sinh thái hoạt động học thuật và trải nghiệm thực tế gồm hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn và quản trị rủi ro. Bên cạnh đó là cuộc thi học thuật ATTACKER, chuỗi talkshow và workshop, các buổi training nội bộ, tham quan doanh nghiệp như VNG, sự kiện hướng nghiệp Web3 Career Innovation và hoạt động gắn kết cộng đồng FTC Trip."
  },
  {
    canonical_question: "làm thế nào để tham gia câu lạc bộ",
    answer: "Bạn theo dõi Fanpage để cập nhật đợt tuyển thành viên và hướng dẫn nộp hồ sơ. Link Fanpage: https://www.facebook.com/clbfintechuel. Thông báo sẽ nêu rõ mốc thời gian, điều kiện và quy trình."
  },
  {
    canonical_question: "các ban trong câu lạc bộ làm gì",
    answer: "Ban Học thuật: Thiết kế nội dung cho workshop và talkshow, chuẩn bị câu hỏi cho tọa đàm, xây dựng ngân hàng câu hỏi, ra đề và chấm cuộc thi ATTACKER. Ban Sự kiện: Lập kế hoạch và hồ sơ tổ chức, xây dựng kịch bản MC và timeline, điều phối hậu cần và giám sát thực thi tại hiện trường. Ban Truyền thông: Thiết kế ấn phẩm, quản lý các kênh truyền thông, lập kế hoạch nội dung và phát triển hình ảnh thương hiệu của câu lạc bộ. Ban Tài chính cá nhân: Tổ chức đào tạo về quản lý tài chính cá nhân cho sinh viên, phát triển và cập nhật bộ bài MoneyWe, hỗ trợ giảng viên ở các học phần liên quan. Ban Nhân sự: Phân công và theo dõi tiến độ, bảo đảm nguồn lực, triển khai hoạt động gắn kết và gìn giữ văn hóa tổ chức."
  },
  {
    canonical_question: "thời gian sinh hoạt diễn ra khi nào",
    answer: "Lịch sinh hoạt được công bố trước trên các kênh nội bộ và Fanpage để mọi thành viên nắm bắt kịp thời. Tùy chương trình, câu lạc bộ sẽ thông báo rõ thời gian, hình thức tham gia và yêu cầu chuẩn bị cho từng hoạt động như talkshow, workshop, training hoặc sự kiện theo mùa."
  },
  {
    canonical_question: "cần kỹ năng gì để ứng tuyển",
    answer: "FTC chào đón đa dạng chuyên ngành. Tinh thần học hỏi, kỷ luật và chủ động là nền tảng quan trọng. Kiến thức nền về Excel, SQL hoặc Python là lợi thế khi tham gia các nội dung dữ liệu và công nghệ tài chính. Kỹ năng viết và thuyết trình giúp bạn đóng góp hiệu quả cho học thuật và truyền thông. Kỹ năng làm việc nhóm và quản lý thời gian hỗ trợ bạn theo kịp tiến độ dự án và sự kiện. Ứng viên quan tâm mảng sự kiện nên có tư duy tổ chức và khả năng phối hợp nhiều đầu việc. Ứng viên thiên về truyền thông cần khả năng xây dựng nội dung và thẩm mỹ thị giác."
  },
  {
    canonical_question: "câu lạc bộ được thành lập khi nào",
    answer: "FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM. Câu lạc bộ được thành lập vào tháng mười một năm 2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm cùng đội ngũ sinh viên ngành công nghệ tài chính."
  },
  {
    canonical_question: "câu lạc bộ có những thành tích gì",
    answer: "Năm học 2024–2025, FTC được Ban Cán sự Đoàn ĐHQG-HCM tặng Giấy khen vì đóng góp tích cực cho công tác Đoàn và phong trào thanh niên. Câu lạc bộ đồng thời vào Top 10 Nhóm 4 của Giải thưởng Đổi mới sáng tạo và Khởi nghiệp TP.HCM I-STAR, được cấp Giấy chứng nhận ghi nhận nỗ lực và đóng góp trong hoạt động đổi mới sáng tạo."
  }
];

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

function systemPrompt(mode: "club" | "industry", greetOnce: boolean) {
  const WEBSITE_LINK = process.env.NEXT_PUBLIC_FTC_WEBSITE
    ? `Bạn có thể xem thêm tại website chính thức: <a href='${process.env.NEXT_PUBLIC_FTC_WEBSITE}' target='_blank' rel='noopener noreferrer'>${process.env.NEXT_PUBLIC_FTC_WEBSITE}</a>.`
    : "Bạn có thể xem thêm tại Fanpage của câu lạc bộ: https://www.facebook.com/clbfintechuel.";

  const CLUB_INFO = `FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM; thành lập tháng 11/2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm. Hoạt động tiêu biểu gồm hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn, quản trị rủi ro; cuộc thi ATTACKER; chuỗi talkshow và workshop; training nội bộ; tham quan VNG; sự kiện Web3 Career Innovation; hoạt động gắn kết cộng đồng FTC Trip. Cơ cấu: Học thuật, Sự kiện, Truyền thông, Tài chính cá nhân, Nhân sự (Ban Điều hành không tính là ban chuyên môn). Cách tham gia: theo dõi Fanpage https://www.facebook.com/clbfintechuel. Lịch sinh hoạt công bố trước trên kênh nội bộ và Fanpage. Kỹ năng khuyến khích: tinh thần học hỏi, kỷ luật, chủ động; nền tảng Excel, SQL, Python là lợi thế; kỹ năng viết, thuyết trình, làm việc nhóm, quản lý thời gian; thiên về sự kiện cần tư duy tổ chức; thiên về truyền thông cần năng lực nội dung và thẩm mỹ thị giác. Thành tích: Giấy khen Ban Cán sự Đoàn ĐHQG-HCM năm học 2024–2025; Top 10 Nhóm 4 Giải thưởng I-STAR TP.HCM.`;

  if (mode === "industry") {
    return (
      "Bạn là FTC Chatbot với 2 chế độ: 'club' (Hỏi về câu lạc bộ) và 'industry' (Hỏi về ngành). Chỉ trả lời bằng tiếng Việt, mạch lạc, tự nhiên, không dùng dấu ';' và không gạch đầu dòng. Luôn ưu tiên ngắn gọn, đúng trọng tâm. " +
      (greetOnce ? "Chỉ chào ở tin nhắn đầu tiên nếu người dùng chào trước; về sau trả lời trực tiếp, không mở đầu bằng lời chào. " : "Không mở đầu bằng lời chào. ") +
      "Nếu mode = 'industry': Tóm tắt dựa trên kết quả tìm kiếm Google (API thật hoặc snippets được truyền vào). Chỉ dùng nội dung từ kết quả tìm kiếm đã cung cấp. Kết thúc bằng một dòng 'Nguồn: domain1, domain2, domain3'. Nếu không có dữ liệu, trả lời lịch sự rằng chưa thể tìm được thông tin phù hợp."
    );
  }
  // mode === "club"
  return (
    "Bạn là FTC Chatbot với 2 chế độ: 'club' (Hỏi về câu lạc bộ) và 'industry' (Hỏi về ngành). Chỉ trả lời bằng tiếng Việt, mạch lạc, tự nhiên, không dùng dấu ';' và không gạch đầu dòng. Luôn ưu tiên ngắn gọn, đúng trọng tâm. " +
    (greetOnce ? "Chỉ chào ở tin nhắn đầu tiên nếu người dùng chào trước; về sau trả lời trực tiếp, không mở đầu bằng lời chào. " : "Không mở đầu bằng lời chào. ") +
    "Nếu mode = 'club': So khớp câu hỏi với 7 câu FAQ (khớp chính xác hoặc na ná). Nếu khớp, trả đúng 'câu trả lời cố định' đã định nghĩa, không thêm bớt. " +
    `Nếu không khớp, chuyển sang vai 'Cố vấn tân sinh viên' và trả lời dựa trên thông tin nền: ${CLUB_INFO} ` +
    `Nếu người dùng hỏi 'link/website', chèn thêm một dòng có thể click: ${WEBSITE_LINK}`
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
  const requestedMode: "club" | "industry" = (body.mode || "club").toLowerCase();

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
  const faqFromEnv = readFAQFromEnv();
  const faqFromKb = extractFAQFromKB(kb);
  const faqList: FAQItem[] = [...STATIC_FAQS, ...faqFromEnv, ...faqFromKb];

  let finalMode: "kb" | "google" = "google"; // Default to general knowledge (industry mode)
  let botResponse: string | null = null;
  let kbHitIds: string[] = [];

  if (requestedMode === "club") {
    const matched = faqList.length ? matchFAQ(userQ, faqList) : null;
    if (matched) {
      botResponse = matched.item.answer;
      finalMode = "kb"; // FAQ response is part of KB mode
    } else {
      // Fallback to Gemini with KB context if no direct FAQ match in club mode
      finalMode = "kb"; // Ensure it's KB mode if no direct FAQ but still in club mode
    }
  } else if (requestedMode === "industry") {
    finalMode = "google"; // Explicitly set for industry mode
  }

  if (botResponse) {
    const headers = new Headers({
      "x-chat-route": "gemini-rag",
      "x-router": "faq",
      "x-faq-id": String(faqList.find(f => f.answer === botResponse)?.id || ""),
      "Cache-Control": "no-store",
    });
    return new NextResponse(JSON.stringify({ text: botResponse, reply: botResponse, response: botResponse, mode: requestedMode }), { status: 200, headers });
  }

  // Prepare for Gemini generation
  const greetOnce = isFirstTurn(body);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
    systemInstruction: systemPrompt(finalMode, greetOnce),
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  });

  let contextText = ""; // This will not be used directly in the prompt anymore, context is in systemPrompt
  if (requestedMode === "club" && !botResponse) {
    // In club mode, if no FAQ match, Gemini acts as advisor, no explicit context needed here
    // The systemPrompt already contains the CLUB_INFO
  }

  const userMsg = `CÂU HỎI: ${userQ}`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userMsg }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
    });
    const out = result.response.text();

    const headers = new Headers({
      "x-chat-route": "gemini-rag",
      "x-router": "gemini",
      "x-rag-mode": finalMode,
      "x-kb-count": String(kb.length),
      "x-kb-hit": String(kbHitIds.length),
      "x-duration-ms": String(Date.now() - started),
      "Cache-Control": "no-store",
    });

    const payload = { reply: out, response: out, text: out, mode: requestedMode, kb_hit_ids: kbHitIds };
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
