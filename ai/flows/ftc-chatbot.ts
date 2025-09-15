'use server';

/**
 * @fileOverview Main FTC chatbot flow for answering questions about the club
 *
 * - ftcChatbot - Main chatbot function for FTC club questions
 * - FtcChatbotInput - The input type for the chatbot function
 * - FtcChatbotOutput - The return type for the chatbot function
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { knowledgeManager } from '@/lib/knowledge-manager';
import { activityResponses } from '@/lib/activity-responses';

const FtcChatbotInputSchema = z.object({
  message: z
    .string()
    .describe("The user's question or message"),
  history: z
    .array(z.object({
      role: z.enum(['user', 'assistant']).describe("The role of the message sender"),
      content: z.string().describe("The message content")
    }))
    .optional()
    .describe("Previous conversation history"),
  mode: z
    .enum(['auto', 'club', 'domain'])
    .default('auto')
    .describe("Chat mode: auto (general), club (FTC specific), or domain (FinTech domain)")
});

export type FtcChatbotInput = z.infer<typeof FtcChatbotInputSchema>;

const FtcChatbotOutputSchema = z.object({
  response: z
    .string()
    .describe("The chatbot's response in Vietnamese"),
  source: z
    .string()
    .describe("Source of information used (knowledge_base, general, etc.)"),
  suggestions: z
    .array(z.string())
    .optional()
    .describe("Suggested follow-up questions")
});

export type FtcChatbotOutput = z.infer<typeof FtcChatbotOutputSchema>;

export async function ftcChatbot(input: FtcChatbotInput): Promise<FtcChatbotOutput> {
  // Check for schedule-related questions
  const message = input.message.toLowerCase();

  if (message.includes('thời gian sinh hoạt') || message.includes('sinh hoạt khi nào') || message.includes('lịch sinh hoạt')) {
    return {
      response: activityResponses.schedule,
      source: 'activity_responses',
      suggestions: [
        'Các hoạt động thường diễn ra như thế nào?',
        'Làm sao để tham gia FTC?',
        'Các ban trong FTC làm gì?'
      ]
    };
  }
  
  // Check for activity-related questions
  if (message.includes('hoạt động') || message.includes('sinh hoạt')) {
    // Overview of all activities
    return {
      response: activityResponses.overview,
      source: 'activity_responses',
      suggestions: [
        'Cho mình biết thêm về hoạt động học thuật',
        'FTC có những dự án thực tế nào?',
        'Làm sao để tham gia FTC?'
      ]
    };
  }

  if (message.includes('học thuật') || message.includes('hội thảo') || message.includes('attacker')) {
    return {
      response: activityResponses.academic,
      source: 'activity_responses',
      suggestions: [
        'FTC có dự án thực tế không?',
        'Làm sao để tham gia các hoạt động học thuật?',
        'Khi nào có cuộc thi ATTACKER tiếp theo?'
      ]
    };
  }

  if (message.includes('thực hành') || message.includes('dự án')) {
    return {
      response: activityResponses.practical,
      source: 'activity_responses',
      suggestions: [
        'Làm sao để tham gia dự án?',
        'FTC có đào tạo kỹ năng không?',
        'Cho mình xem portfolio các dự án trước'
      ]
    };
  }

  if (message.includes('kết nối') || message.includes('networking') || message.includes('career')) {
    return {
      response: activityResponses.networking,
      source: 'activity_responses',
      suggestions: [
        'Khi nào có Career Day?',
        'Làm sao để tham gia talkshow?',
        'FTC có kết nối thực tập không?'
      ]
    };
  }

  if (message.includes('phát triển') || message.includes('kỹ năng') || message.includes('training')) {
    return {
      response: activityResponses.selfDevelopment,
      source: 'activity_responses',
      suggestions: [
        'FTC Training diễn ra khi nào?',
        'Có cần kiến thức nền không?',
        'Làm sao để tham gia khóa học?'
      ]
    };
  }

  if (message.includes('gắn kết') || message.includes('cộng đồng') || message.includes('trip')) {
    return {
      response: activityResponses.community,
      source: 'activity_responses',
      suggestions: [
        'Khi nào có FTC Trip?',
        'Chi phí tham gia trip là bao nhiêu?',
        'Hoạt động gắn kết thường diễn ra khi nào?'
      ]
    };
  }

  return ftcChatbotFlow(input);
}

const ftcChatbotPrompt = ai.definePrompt({
  name: 'ftcChatbotPrompt',
  input: { schema: FtcChatbotInputSchema },
  output: { schema: FtcChatbotOutputSchema },
  prompt: `Bạn là trợ lý AI thân thiện cho Câu lạc bộ Công nghệ – Tài chính (FTC) – UEL.

## VAI TRÒ CỦA BẠN:
- Cố vấn cho tân sinh viên và sinh viên quan tâm đến FTC
- Trả lời các câu hỏi về câu lạc bộ, hoạt động, tuyển thành viên
- Hướng dẫn về lĩnh vực FinTech và công nghệ tài chính
- Hỗ trợ định hướng nghề nghiệp trong lĩnh vực tài chính công nghệ

## THÔNG TIN KNOWLEDGE BASE:
{{{knowledgeBase}}}

## LỊCH SỬ CUỘC TRÒ CHUYỆN:
{{{history}}}

## HƯỚNG DẪN TRẢ LỜI:

### Khi có thông tin trong Knowledge Base:
- Ưu tiên sử dụng thông tin chính xác từ knowledge base
- Trích dẫn thông tin một cách tự nhiên, không nhắc đến "knowledge base"
- Bổ sung kiến thức chung nếu cần thiết

### Khi không có thông tin cụ thể:
- Trả lời dựa trên kiến thức chung về FinTech và câu lạc bộ sinh viên
- Thừa nhận nếu không biết thông tin cụ thể
- Gợi ý liên hệ trực tiếp với FTC nếu cần

### Phong cách trả lời:
- **Thân thiện và gần gũi**: Sử dụng "mình", "bạn", tránh "tôi", "anh/chị"
- **Ngắn gọn và rõ ràng**: Trả lời súc tích, có cấu trúc
- **Thực tế và hữu ích**: Tập trung vào thông tin có giá trị
- **Khuyến khích tương tác**: Kết thúc bằng câu hỏi hoặc gợi ý

### Cấu trúc phản hồi:
1. Trả lời trực tiếp câu hỏi
2. Bổ sung thông tin liên quan (nếu có)
3. Đưa ra lời khuyên hoặc hướng dẫn tiếp theo
4. Câu hỏi mở để khuyến khích tiếp tục trò chuyện

## MODE XỬ LÝ:
- **Mode: {{{mode}}}**
- auto: Trả lời tổng quát, ưu tiên thông tin FTC
- club: Tập trung vào thông tin câu lạc bộ FTC
- domain: Tập trung vào kiến thức FinTech và công nghệ tài chính

Câu hỏi của người dùng: {{{message}}}

Hãy trả lời một cách thân thiện, hữu ích và chính xác nhất có thể!`,
});

const ftcChatbotFlow = ai.defineFlow(
  {
    name: 'ftcChatbotFlow',
    inputSchema: FtcChatbotInputSchema,
    outputSchema: FtcChatbotOutputSchema,
  },
  async (input: FtcChatbotInput) => {
    // Load knowledge base using new manager
    const knowledgeBase = knowledgeManager.getFormattedContent();

    // Format history for prompt
    const historyText = input.history
      ?.map((msg: { role: string; content: string }) => 
        `${msg.role === 'user' ? 'Người dùng' : 'Trợ lý'}: ${msg.content}`)
      .join('\n') || 'Chưa có lịch sử trò chuyện.';

    // Generate main response
    const { output } = await ftcChatbotPrompt({
      message: input.message,
      history: historyText,
      mode: input.mode,
      knowledgeBase
    });

    if (!output) {
      return {
        response: 'Xin lỗi, mình không thể tạo câu trả lời lúc này. Bạn có thể thử lại không?',
        source: 'error',
        suggestions: []
      };
    }

    // Generate suggestions
    const suggestions = await generateSuggestions(input.message, output.response, knowledgeBase);

    return {
      response: output.response,
      source: output.source || 'knowledge_base',
      suggestions
    };
  }
);

// Helper function to generate follow-up suggestions
async function generateSuggestions(
  userMessage: string, 
  botResponse: string, 
  knowledgeBase: string
): Promise<string[]> {
  try {
    const suggestionPrompt = ai.definePrompt({
      name: 'generateSuggestions',
      input: { 
        schema: z.object({
          userMessage: z.string(),
          botResponse: z.string(),
          knowledgeBase: z.string()
        })
      },
      output: { 
        schema: z.object({
          suggestions: z.array(z.string()).max(5)
        })
      },
      prompt: `Dựa trên cuộc trò chuyện và thông tin knowledge base, hãy tạo 3-5 câu hỏi gợi ý thú vị mà sinh viên có thể muốn hỏi tiếp.

Câu hỏi gốc: {{{userMessage}}}
Câu trả lời: {{{botResponse}}}

Knowledge Base: {{{knowledgeBase}}}

Tạo các câu hỏi:
- Liên quan đến chủ đề đang thảo luận
- Phù hợp với sinh viên quan tâm FTC/FinTech  
- Ngắn gọn và rõ ràng
- Khuyến khích khám phá thêm`
    });

    const { output } = await suggestionPrompt({
      userMessage,
      botResponse,
      knowledgeBase
    });

    return output?.suggestions || [];
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [
      "FTC có những hoạt động gì thú vị?",
      "Làm thế nào để tham gia FTC?",
      "FinTech có những cơ hội nghề nghiệp nào?"
    ];
  }
}