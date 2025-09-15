import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { matchSuggestedQuestion } from "@/lib/faq-grounding";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes timeout
export const runtime = "nodejs";

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";

// Required extra suggestions to always include
const EXTRA_SUGGESTIONS = [
  "FTC là câu lạc bộ như thế nào",
  "FTC có thành tích gì"
];

// Helper to extract text from various SDK response shapes
function extractText(resp: any): string {
  try {
    if (!resp) return "";
    if (resp.response && typeof resp.response.text === "function") {
      return String(resp.response.text()).trim();
    }
    if (resp.response && typeof resp.response.text === "string") {
      return resp.response.text.trim();
    }
    if (typeof resp.output_text === "string") return resp.output_text.trim();
    if (Array.isArray(resp.output) && resp.output.length) {
      const first = resp.output[0];
      if (first && Array.isArray(first.content) && first.content.length) {
        const part = first.content[0];
        if (part && typeof part.text === "string") return part.text.trim();
      }
    }
    return "";
  } catch {
    return "";
  }
}

// Helper to initialize Gemini model at request time
function initGemini() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    console.error("GEMINI_API_KEY not found in environment variables");
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI({ apiKey: key });
    return genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
  } catch (e) {
    console.error("initGemini error:", e);
    return null;
  }
}

// Fallback answers for common club topics when AI is unavailable
const FALLBACK_ANSWERS = {
  activities:
    "FTC tổ chức talkshow, workshop và lớp bồi dưỡng về Fintech, AI trong tài chính, giao dịch thuật toán, blockchain và tài chính cá nhân. Thành viên được tham gia dự án thực tế trên dữ liệu và thị trường, rèn tư duy sản phẩm và quản trị rủi ro. CLB kết nối doanh nghiệp, mở cơ hội thực tập và xây hồ sơ học thuật, đồng thời phát triển kỹ năng giao tiếp, làm việc nhóm và quản lý dự án.",
  join:
    'Bạn vào mục Ứng tuyển trên website, chọn "Bắt đầu ngay hôm nay" và điền form. Chọn ban mong muốn, Ban Nhân sự sẽ liên hệ, định hướng và thông báo các bước tiếp theo. Cần hỗ trợ nhanh có thể gửi email hoặc nhắn fanpage của FTC.',
  teams:
    "CLB có 5 ban: Ban Học thuật (nội dung Fintech, giáo trình, rèn kỹ năng dữ liệu/SQL), Ban Sự kiện (lập kế hoạch, điều phối, tổng kết), Ban Truyền thông (quản trị kênh, bài viết, đồ họa, video), Ban Nhân sự (văn hóa, tuyển chọn, phân công, theo dõi hiệu quả) và Ban Tài chính cá nhân (giáo dục tài chính cá nhân, MoneyWe, FTCCN Sharing).",
  schedule:
    "CLB sinh hoạt định kỳ qua talkshow, workshop và hoạt động nội bộ. Lịch cụ thể được công bố tại mục Hoạt động và trên các kênh chính thức; ứng viên sau khi đăng ký sẽ nhận thông báo qua email.",
  skills:
    "Ưu tiên tinh thần ham học, chủ động, cam kết thời gian; kỹ năng giao tiếp, làm việc nhóm, quản lý thời gian. Lợi th��: Excel/Google Sheets, SQL/Python (Ban Học thuật); lập kế hoạch/điều phối (Ban Sự kiện); viết/thiết kế/quay dựng (Ban Truyền thông); kiến thức tài chính cá nhân (Ban Tài chính cá nhân); tổ chức/phỏng vấn/vận hành (Ban Nhân sự).",
} as const;

function getFallbackAnswer(message: string): string | null {
  const matched = matchSuggestedQuestion(message);
  if (matched.matched && matched.topic && (FALLBACK_ANSWERS as any)[matched.topic]) {
    return (FALLBACK_ANSWERS as any)[matched.topic];
  }
  return null;
}

// Determine if a query is about the club (FTC/CLB/Câu lạc bộ)
function isClubQuery(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("ftc") ||
    m.includes("clb") ||
    m.includes("câu lạc bộ") ||
    m.includes("cau lac bo")
  );
}

// Load knowledge base content (supports various file formats)
async function loadKnowledgeBase() {
  const parts: string[] = [];

  try {
    const kbDir = path.resolve(process.cwd(), "backend", "data", "knowledge_base");

    try {
      await fs.promises.access(kbDir);
    } catch {
      return (
        "Câu lạc bộ Công nghệ – Tài chính (FTC) là một câu lạc bộ sinh viên tại UEL.\n" +
        "Mục ti��u: Phát triển kỹ năng về công nghệ tài chính và fintech.\n" +
        "Hoạt động: Tổ chức các workshop, seminar, hackathon về fintech.\n" +
        "Thành viên: Sinh viên quan tâm đến lĩnh vực fintech và công nghệ tài chính."
      );
    }

    // Load structured knowledge if exists
    try {
      const structuredKB = path.join(kbDir, "structured");
      if (fs.existsSync(structuredKB)) {
        const sections = await fs.promises.readdir(structuredKB);
        for (const section of sections) {
          const sectionDir = path.join(structuredKB, section);
          if ((await fs.promises.stat(sectionDir)).isDirectory()) {
            parts.push(`# ${section.toUpperCase()}`);
            const files = await fs.promises.readdir(sectionDir);
            for (const file of files) {
              if (file.endsWith(".txt") || file.endsWith(".md")) {
                const content = await fs.promises.readFile(path.join(sectionDir, file), "utf-8");
                if (content.trim()) parts.push(content.trim());
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Error loading structured knowledge base:", e);
    }

    // Unstructured fallback
    const files = await fs.promises.readdir(kbDir);
    for (const file of files) {
      if (file.endsWith(".txt") || file.endsWith(".md")) {
        try {
          const content = await fs.promises.readFile(path.join(kbDir, file), "utf-8");
          if (content.trim()) parts.push(content.trim());
        } catch (e) {
          console.error(`Error reading file ${file}:`, e);
        }
      }
    }
  } catch (e) {
    console.error("Error reading knowledge base:", e);
  }

  if (parts.length === 0) {
    return (
      "Câu lạc bộ Công nghệ – Tài chính (FTC) là một câu lạc bộ sinh viên tại UEL.\n" +
      "Mục tiêu: Phát triển kỹ năng về công nghệ tài chính và fintech.\n" +
      "Hoạt động: Tổ chức các workshop, seminar, hackathon về fintech.\n" +
      "Thành viên: Sinh viên quan tâm đến lĩnh vực fintech và công nghệ tài chính."
    );
  }

  return parts.join("\n\n");
}

function mergeSuggestions(existing: string[] | undefined, fallback: string[]): string[] {
  const out = new Set<string>();
  (existing || []).forEach((s) => {
    if (typeof s === "string" && s.trim()) out.add(s.trim());
  });
  fallback.forEach((s) => out.add(s));
  EXTRA_SUGGESTIONS.forEach((s) => out.add(s));
  return Array.from(out).slice(0, 7);
}

export async function POST(req: Request) {
  try {
    // Parse request body
    let body: any = null;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Failed to parse JSON body for /api/chat/gemini", e);
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const message: string = typeof body?.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body?.history) ? body.history : [];
    const requestedMode = body?.mode === "domain" ? "domain" : body?.mode === "club" ? "club" : "auto";
    console.log("[api/chat/gemini] incoming", {
      messageLen: message?.length || 0,
      historyLen: history.length,
      mode: requestedMode,
    });

    if (!message) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const clubQuery = requestedMode === "club" || (requestedMode === "auto" && isClubQuery(message));
    const fallbackClubAnswer = getFallbackAnswer(message);

    // Initialize Gemini for non-club or as generator for club when available
    const model = initGemini();

    // Load knowledge base (only if club query)
    let knowledgeBase = "";
    if (clubQuery) {
      try {
        knowledgeBase = await loadKnowledgeBase();
      } catch (error) {
        console.error("[api/chat/gemini] Error loading knowledge base:", error);
        knowledgeBase = "";
      }
    }

    // Build prompt
    let prompt = "";
    if (clubQuery) {
      prompt = `Bạn là trợ lý AI cho Câu lạc bộ Công nghệ – Tài chính (FTC) – UEL.\nTập trung trả lời về thông tin liên quan đến câu lạc bộ, hoạt động và cách tham gia.\n\nThông tin tham khảo (knowledge base):\n${knowledgeBase}\n\nHãy trả lời ngắn gọn, rõ ràng, thân thiện bằng tiếng Việt.\nCâu hỏi: ${message}\n\nTrả lời:`;
    } else {
      prompt = `Bạn là chuyên gia về FinTech và công nghệ tài chính.\nTrả lời câu hỏi một cách chính xác, ngắn gọn, có cấu trúc, bằng tiếng Việt.\nKhông cần nhắc đến FTC nếu câu hỏi không liên quan.\n\nCâu hỏi: ${message}\n\nTrả lời:`;
    }

    const defaultSuggestions = clubQuery
      ? [
          "Làm thế nào để tham gia câu lạc bộ FTC?",
          "Các hoạt động của câu lạc bộ có gì?",
          "Làm sao để đăng k�� tham gia?",
          "Câu lạc bộ có những chương trình gì?",
          "Làm thế nào để liên hệ với ban chủ nhiệm?",
        ]
      : [
          "FinTech gồm những mảng chính nào?",
          "Blockchain ứng dụng vào tài chính như thế nào?",
          "Sự khác nhau giữa ngân hàng số và ngân hàng truyền thống?",
          "Làm sao bắt đầu học FinTech?",
          "Những kỹ năng cần có để làm việc trong FinTech?",
        ];

    // If no Gemini available or generation fails, craft deterministic fallback
    if (!model) {
      const answer =
        fallbackClubAnswer ||
        (clubQuery
          ? "Xin lỗi, d���ch vụ AI tạm thời không khả dụng. Đây là tóm tắt nhanh: FTC là câu lạc bộ học thuật về FinTech tại UEL, tổ chức workshop/talkshow/dự án thực tế, có các ban Học thuật, Sự kiện, Truyền thông, Nhân sự và Tài chính cá nhân. Bạn có thể vào mục Ứng tuyển để đăng ký tham gia."
          : "Xin lỗi, dịch vụ AI tạm thời không khả dụng. Bạn có thể hỏi về các chủ đề như FinTech, ngân hàng số, blockchain, thanh toán điện tử, quản lý rủi ro và đầu tư.");

      return new Response(
        JSON.stringify({
          reply: answer,
          answer,
          response: answer,
          source: clubQuery ? "knowledge_base_fallback" : "general_fallback",
          suggestions: mergeSuggestions([], defaultSuggestions),
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Try generating with Gemini
    let answer = "";
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
      answer = extractText(result);
    } catch (error) {
      console.error("[api/chat/gemini] Error generating content:", error);
      const fallback =
        fallbackClubAnswer ||
        (clubQuery
          ? "FTC tổ chức talkshow, workshop, hoạt động nội bộ và dự án thực tế về FinTech. Bạn có thể vào mục Ứng tuyển để tham gia và chọn ban phù hợp."
          : "Xin lỗi, hiện chưa thể tạo câu trả lời. Bạn có thể hỏi thêm về FinTech, blockchain, thanh toán, bảo hiểm số hoặc ngân hàng số.");

      return new Response(
        JSON.stringify({
          reply: fallback,
          answer: fallback,
          response: fallback,
          source: clubQuery ? "knowledge_base_fallback" : "general_fallback",
          suggestions: mergeSuggestions([], defaultSuggestions),
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    if (!answer) {
      answer =
        fallbackClubAnswer ||
        (clubQuery
          ? "Xin lỗi, không thể tạo câu trả lời lúc này. Bạn có thể hỏi về hoạt động, cách tham gia, các ban của FTC hoặc lịch sinh hoạt."
          : "Xin lỗi, không thể tạo câu trả lời lúc này. Bạn có thể hỏi về các chủ đề FinTech cụ thể như blockchain, thanh toán số hoặc ngân hàng số.");
    }

    // Generate suggested follow-up questions (best-effort)
    let suggestions: string[] = [];
    try {
      const suggestionPrompt = clubQuery
        ? `Bạn là cố vấn thân thiện cho tân sinh viên. Dựa trên câu trả lời trên, hãy tạo 5 câu hỏi gợi ý về CLB mà tân sinh viên có thể hỏi. Trả về mảng JSON thuần các chuỗi.`
        : `Bạn là chuyên gia FinTech. Dựa trên câu trả lời trên, hãy tạo 5 câu hỏi gợi ý liên quan FinTech. Trả về mảng JSON thuần các chuỗi.`;

      const sugResp = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: suggestionPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
      });
      const rawSug = extractText(sugResp);
      try {
        const parsed = JSON.parse(rawSug);
        if (Array.isArray(parsed)) suggestions = parsed.filter((x) => typeof x === "string");
      } catch {}
    } catch {}

    return new Response(
      JSON.stringify({
        reply: answer,
        answer,
        response: answer,
        source: clubQuery ? "knowledge_base" : "gemini",
        suggestions: mergeSuggestions(suggestions, defaultSuggestions),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in chat route:", error);
    const fallback =
      "Xin lỗi, có lỗi x���y ra khi xử lý yêu cầu. Vui lòng thử lại sau.";
    return new Response(
      JSON.stringify({
        error: true,
        message: "Internal server error",
        reply: fallback,
        answer: fallback,
        response: fallback,
        suggestions: mergeSuggestions([], [
          "Làm thế nào để tham gia câu lạc bộ FTC?",
          "Các hoạt động của câu lạc bộ có gì?",
          "Làm sao để đăng ký tham gia?",
          "Câu lạc bộ có những chương trình gì?",
          "Làm thế nào để li��n hệ với ban chủ nhiệm?",
        ]),
        debug: process.env.NODE_ENV === "development" ? error?.message : undefined,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
