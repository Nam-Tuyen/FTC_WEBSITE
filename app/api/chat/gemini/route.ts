import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs'
import path from 'path'
import { RECRUITMENT_CONFIG } from '../../../ung-tuyen/constants'
import { matchSuggestedQuestion } from '@/lib/faq-grounding'

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout
export const runtime = 'nodejs';

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

// Helper to initialize Gemini model at request time
function initGemini() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!key) {
    console.error('GEMINI_API_KEY not found in environment variables')
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(key);
    return genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
  } catch (e) {
    console.error('initGemini error:', e)
    return null;
  }
}

// Fallback answers for common topics when AI is unavailable
const FALLBACK_ANSWERS: Record<string, string> = {
  activities: `FTC tổ chức talkshow, workshop và lớp bồi dưỡng về Fintech, AI trong tài chính, giao dịch thuật toán, blockchain và tài chính cá nhân. Thành viên được tham gia dự án thực tế trên dữ liệu và thị trường, rèn tư duy sản phẩm và quản trị rủi ro. CLB kết nối doanh nghiệp, mở cơ hội thực tập và xây hồ sơ học thuật, đồng th��i phát triển kỹ năng giao tiếp, làm việc nhóm và quản lý dự án.`,
  join: `Bạn vào mục Ứng tuyển trên website, chọn “Bắt đầu ngay hôm nay” và điền form. Chọn ban mong muốn, Ban Nhân sự sẽ liên hệ, định hướng và thông báo các bước tiếp theo. Cần hỗ trợ nhanh có thể gửi email hoặc nhắn fanpage của FTC.`,
  teams: `CLB có 5 ban: Ban Học thuật (nội dung Fintech, giáo trình, rèn kỹ năng dữ liệu/SQL), Ban Sự kiện (lập kế hoạch, điều phối, tổng kết), Ban Truyền thông (quản trị kênh, bài viết, đồ họa, video), Ban Nhân sự (văn hóa, tuyển chọn, phân công, theo dõi hiệu quả) và Ban Tài chính cá nhân (giáo dục tài chính cá nhân, MoneyWe, FTCCN Sharing).`,
  schedule: `CLB sinh hoạt định kỳ qua talkshow, workshop và hoạt động nội bộ. Lịch cụ thể được công bố tại mục Hoạt động và trên các kênh chính thức; ứng viên sau khi đăng ký sẽ nhận thông báo qua email.`,
  skills: `Ưu tiên tinh thần ham học, chủ động, cam kết thời gian; kỹ năng giao tiếp, làm việc nhóm, quản lý thời gian. Lợi thế: Excel/Google Sheets, SQL/Python (Ban Học thuật); lập kế hoạch/điều phối (Ban Sự kiện); viết/thiết kế/quay dựng (Ban Truyền thông); kiến thức tài chính cá nhân (Ban Tài chính cá nhân); tổ chức/phỏng vấn/vận hành (Ban Nhân sự).`
}

function getFallbackAnswer(message: string): string | null {
  const matched = matchSuggestedQuestion(message)
  if (matched.matched && matched.topic && FALLBACK_ANSWERS[matched.topic]) {
    return FALLBACK_ANSWERS[matched.topic]
  }
  return null
}

// Load knowledge base content (supports .txt and .md with sensible default)
async function loadKnowledgeBase() {
  const parts: string[] = [];

  try {
    const kbDir = path.resolve(process.cwd(), 'backend', 'data', 'knowledge_base')

    // Check dir exists
    try {
      await fs.promises.access(kbDir)
    } catch {
      return `Câu lạc bộ Công nghệ – Tài chính (FTC) là một câu lạc bộ sinh viên tại UEL.\nMục tiêu: Phát triển kỹ năng về công nghệ tài chính và fintech.\nHoạt động: Tổ chức các workshop, seminar, hackathon về fintech.\nThành viên: Sinh viên quan tâm đến lĩnh vực fintech và công nghệ tài chính.`
    }

    const files = await fs.promises.readdir(kbDir)
    for (const file of files) {
      if (file.endsWith('.txt') || file.endsWith('.md')) {
        try {
          const content = await fs.promises.readFile(path.join(kbDir, file), 'utf-8')
          if (content.trim()) parts.push(content.trim())
        } catch (e) {
          console.error(`Error reading file ${file}:`, e)
        }
      }
    }
  } catch (e) {
    console.error('Error reading knowledge base:', e)
  }

  if (parts.length === 0) {
    return `Câu lạc bộ Công nghệ – Tài chính (FTC) là một câu lạc bộ sinh viên tại UEL.\nMục tiêu: Phát triển kỹ năng về công nghệ tài chính và fintech.\nHoạt động: Tổ chức các workshop, seminar, hackathon về fintech.\nThành viên: Sinh viên quan tâm đến lĩnh vực fintech và công nghệ tài chính.`
  }

  return parts.join('\n\n')
}

export async function POST(req: Request) {
  try {
    // Parse request body
    let body: any = null
    try {
      body = await req.json()
    } catch (e) {
      console.error('Failed to parse JSON body for /api/chat/gemini', e)
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const message: string = typeof body?.message === 'string' ? body.message.trim() : ''
    const history = Array.isArray(body?.history) ? body.history : []
    console.log('[api/chat/gemini] incoming', { messageLen: message?.length || 0, historyLen: history.length })

    if (!message) {
      return new Response(JSON.stringify({ error: 'Invalid message' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const fallbackAnswer = getFallbackAnswer(message)

    // Initialize Gemini
    const model = initGemini();
    if (!model) {
      if (fallbackAnswer) {
        return new Response(JSON.stringify({ response: fallbackAnswer, source: 'fallback', suggestions: [
          'Làm thế nào để tham gia câu lạc bộ FTC?',
          'Các hoạt động của câu lạc bộ có gì?',
          'Làm sao để đăng ký tham gia?',
          'Câu lạc bộ có những chương trình gì?',
          'Làm thế nào để liên hệ với ban chủ nhiệm?'
        ] }), { headers: { 'Content-Type': 'application/json' } })
      }
      return new Response(JSON.stringify({
        error: true,
        message: 'AI service temporarily unavailable',
        code: 'NO_GEMINI_KEY',
        response: 'Xin lỗi, dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.',
        suggestions: [
          'Làm thế nào để tham gia câu lạc bộ FTC?',
          'Các hoạt động của câu lạc bộ có gì?',
          'Làm sao để đăng ký tham gia?',
          'Câu lạc bộ có những chương trình gì?',
          'Làm thế nào để liên hệ với ban chủ nhiệm?'
        ]
      }), { status: 503, headers: { 'Content-Type': 'application/json' } })
    }

    // Load knowledge base
    let knowledgeBase = '';
    try {
      knowledgeBase = await loadKnowledgeBase();
    } catch (error) {
      console.error('[api/chat/gemini] Error loading knowledge base:', error);
      knowledgeBase = '';
    }

    // Build prompt with knowledge base context
    const prompt = `Bạn là trợ lý AI cho Câu lạc bộ Công nghệ – Tài chính (FTC) – UEL.
Vai trò của bạn là cố vấn cho tân sinh viên và trả lời các câu hỏi về CLB.

Thông tin tham khảo từ knowledge base:
${knowledgeBase}

Dựa vào thông tin trên, hãy trả lời câu hỏi sau một cách súc tích bằng tiếng Việt.
Nếu không có thông tin liên quan trong knowledge base, hãy trả lời dựa trên kiến thức chung về fintech và câu lạc bộ sinh viên.
Trả lời cần phải:
- Ngắn gọn, dễ hiểu
- Có cấu trúc rõ ràng (sử dụng gạch đầu dòng nếu cần)
- Thân thiện, phù hợp với tân sinh viên
- Tập trung vào thông tin thực tế và hữu ích

Câu hỏi: ${message}

Trả lời:`;

    // helper to extract text from various SDK response shapes
    function extractText(resp: any) {
      try {
        if (!resp) return ''
        if (resp.response && typeof resp.response.text === 'function') {
          return String(resp.response.text()).trim()
        }
        if (resp.response && typeof resp.response.text === 'string') {
          return resp.response.text.trim()
        }
        if (typeof resp.output_text === 'string') return resp.output_text.trim()
        if (Array.isArray(resp.output) && resp.output.length) {
          const first = resp.output[0]
          if (first && Array.isArray(first.content) && first.content.length) {
            const part = first.content[0]
            if (part && typeof part.text === 'string') return part.text.trim()
          }
        }
        return ''
      } catch (e) {
        return ''
      }
    }

    // Generate response
    let answer = ''
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      });
      answer = extractText(result)
    } catch (error) {
      console.error('[api/chat/gemini] Error generating content:', error);
      if (fallbackAnswer) {
        return new Response(JSON.stringify({ response: fallbackAnswer, source: 'fallback', suggestions: [
          'Làm thế nào để tham gia câu lạc bộ FTC?',
          'Các hoạt động của câu lạc bộ có gì?',
          'Làm sao để đăng ký tham gia?',
          'Câu lạc bộ có những chương trình gì?',
          'Làm thế nào để liên hệ với ban chủ nhiệm?'
        ] }), { headers: { 'Content-Type': 'application/json' } })
      }
      return new Response(JSON.stringify({
        error: true,
        message: 'AI service error',
        response: 'Xin lỗi, có lỗi xảy ra khi tạo câu trả lời. Vui lòng thử lại sau.',
        suggestions: [
          'Làm thế nào để tham gia câu lạc bộ FTC?',
          'Các hoạt động của câu lạc bộ có gì?',
          'Làm sao để đăng ký tham gia?',
          'Câu lạc bộ có những chương trình gì?',
          'Làm thế nào để liên hệ với ban chủ nhiệm?'
        ]
      }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    if (!answer) {
      answer = fallbackAnswer || 'Xin lỗi, không thể tạo câu trả lời. Vui lòng thử lại.'
    }

    // Generate suggested follow-up questions (best-effort)
    let suggestions: string[] = [];
    try {
      const suggestionPrompt = `Bạn là cố vấn thân thiện cho tân sinh viên. Dựa trên thông tin từ knowledge base (nếu có) và câu trả lời vừa soạn ở trên, hãy tạo 5 câu hỏi gợi ý mà tân sinh viên có thể tiếp tục hỏi. Trả về một mảng JSON thuần gồm các chuỗi.`;
      const sugResp = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: suggestionPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 256 }
      });
      const rawSug = extractText(sugResp)
      try {
        const parsed = JSON.parse(rawSug);
        if (Array.isArray(parsed)) suggestions = parsed.filter((x) => typeof x === 'string');
      } catch (e) {}
    } catch (e) {}

    return new Response(JSON.stringify({
      response: answer,
      source: 'knowledge_base',
      suggestions
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Error in chat route:', error)
    return new Response(JSON.stringify({
      error: true,
      message: 'Internal server error',
      response: 'Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau.',
      suggestions: [
        'Làm thế nào để tham gia câu lạc bộ FTC?',
        'Các hoạt động của câu lạc bộ có gì?',
        'Làm sao để đăng ký tham gia?',
        'Câu lạc bộ có những chương trình gì?',
        'Làm thế nào để liên hệ với ban chủ nhiệm?'
      ],
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
