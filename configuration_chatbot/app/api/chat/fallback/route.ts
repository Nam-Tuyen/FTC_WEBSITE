export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Fallback chat API that works without Gemini API key
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid message' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Simple keyword-based responses
    const responses = {
      'kỹ năng': `Để ứng tuyển vào FTC, bạn cần có:
- Kiến thức cơ bản về tài chính và công nghệ
- Kỹ năng lập trình (Python, JavaScript, Java)
- Khả năng làm việc nhóm
- Tinh thần học hỏi và đam mê fintech
- Kỹ năng thuyết trình và giao tiếp

Không cần có tất cả kỹ năng trên, quan trọng là tinh thần học hỏi!`,
      
      'tham gia': `Để tham gia FTC:
1. Theo dõi fanpage để biết thời gian tuyển thành viên
2. Điền form đăng ký khi có thông báo
3. Tham gia phỏng vấn (nếu có)
4. Tham gia các hoạt động của câu lạc bộ

Câu lạc bộ tuyển thành viên mới vào đầu mỗi học kỳ.`,
      
      'hoạt động': `FTC tổ chức nhiều hoạt động:
- Workshop về blockchain, cryptocurrency
- Seminar với chuyên gia fintech
- Hackathon fintech hàng năm
- Dự án nghiên cứu và phát triển
- Tham quan các công ty fintech
- Networking events`,
      
      'liên hệ': `Bạn có thể liên hệ FTC qua:
- Fanpage: https://facebook.com/ftc-uel
- Email: ftc@uel.edu.vn
- Địa chỉ: Trường Đại học Kinh tế - Luật, UEL
- Thời gian hoạt động: Thứ 3, 5, 7 hàng tuần`
    };

    // Find matching response
    let response = 'Xin chào! Tôi là trợ lý AI của FTC. Bạn có thể hỏi về kỹ năng cần thiết, cách tham gia, hoạt động của câu lạc bộ, hoặc cách liên hệ.';
    
    for (const [keyword, answer] of Object.entries(responses)) {
      if (message.toLowerCase().includes(keyword)) {
        response = answer;
        break;
      }
    }

    return new Response(JSON.stringify({
      response,
      source: 'fallback',
      suggestions: [
        'Cần kỹ năng gì để ứng tuyển?',
        'Làm thế nào để tham gia câu lạc bộ?',
        'Các hoạt động của câu lạc bộ có gì?',
        'Làm sao để liên hệ với ban chủ nhiệm?',
        'Câu lạc bộ có những chương trình gì?'
      ]
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in fallback chat route:', error);
    return new Response(JSON.stringify({
      error: true,
      message: 'Internal server error',
      response: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
      suggestions: [
        'Làm thế nào để tham gia câu lạc bộ FTC?',
        'Các hoạt động của câu lạc bộ có gì?',
        'Làm sao để đăng ký tham gia?'
      ]
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
