# 🤖 Hướng dẫn lập trình Chatbot với Câu hỏi gợi ý

## Tổng quan
Hướng dẫn này mô tả cách implement hệ thống chatbot với câu hỏi gợi ý có câu trả lời định sẵn và fallback sang Gemini API cho các câu hỏi khác.

## 🎯 Logic xử lý

### 1. Phát hiện câu hỏi gợi ý
```typescript
const SUGGESTED_QUESTIONS = [
  "Câu lạc bộ có những hoạt động gì?",
  "Làm thế nào để tham gia câu lạc bộ?", 
  "Các ban trong câu lạc bộ làm gì?",
  "Thời gian sinh hoạt diễn ra khi nào?",
  "Cần kỹ năng gì để ứng tuyển?",
  "Câu lạc bộ được thành lập khi nào?",
  "Câu lạc bộ có những thành tích gì?"
];

const SUGGESTED_ANSWERS = {
  "Câu lạc bộ có những hoạt động gì?": `FTC triển khai hệ sinh thái hoạt động học thuật và trải nghiệm thực tế gồm hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn và quản trị rủi ro. Bên cạnh đó là cuộc thi học thuật ATTACKER, chuỗi talkshow và workshop, các buổi training nội bộ, tham quan doanh nghiệp như VNG, sự kiện hướng nghiệp Web3 Career Innovation và hoạt động gắn kết cộng đồng FTC Trip.`,
  
  "Làm thế nào để tham gia câu lạc bộ?": `Bạn theo dõi Fanpage để cập nhật đợt tuyển thành viên và hướng dẫn nộp hồ sơ. Link Fanpage: https://www.facebook.com/clbfintechuel. Thông báo sẽ nêu rõ mốc thời gian, điều kiện và quy trình.`,
  
  "Các ban trong câu lạc bộ làm gì?": `Ban Học thuật: Thiết kế nội dung cho workshop và talkshow, chuẩn bị câu hỏi cho tọa đàm, xây dựng ngân hàng câu hỏi, ra đề và chấm cuộc thi ATTACKER. Ban Sự kiện: Lập kế hoạch và hồ sơ tổ chức, xây dựng kịch bản MC và timeline, điều phối hậu cần và giám sát thực thi tại hiện trường. Ban Truyền thông: Thiết kế ấn phẩm, quản lý các kênh truyền thông, lập kế hoạch nội dung và phát triển hình ảnh thương hiệu của câu lạc bộ. Ban Tài chính cá nhân: Tổ chức đào tạo về quản lý tài chính cá nhân cho sinh viên, phát triển và cập nhật bộ bài MoneyWe, hỗ trợ giảng viên ở các học phần liên quan. Ban Nhân sự: Phân công và theo dõi tiến độ, bảo đảm nguồn lực, triển khai hoạt động gắn kết và gìn giữ văn hóa tổ chức.`,
  
  "Thời gian sinh hoạt diễn ra khi nào?": `Lịch sinh hoạt được công bố trước trên các kênh nội bộ và Fanpage để mọi thành viên nắm bắt kịp thời. Tùy chương trình, câu lạc bộ sẽ thông báo rõ thời gian, hình thức tham gia và yêu cầu chuẩn bị cho từng hoạt động như talkshow, workshop, training hoặc sự kiện theo mùa.`,
  
  "Cần kỹ năng gì để ứng tuyển?": `FTC chào đón đa dạng chuyên ngành. Tinh thần học hỏi, kỷ luật và chủ động là nền tảng quan trọng. Kiến thức nền về Excel, SQL hoặc Python là lợi thế khi tham gia các nội dung dữ liệu và công nghệ tài chính. Kỹ năng viết và thuyết trình giúp bạn đóng góp hiệu quả cho học thuật và truyền thông. Kỹ năng làm việc nhóm và quản lý thời gian hỗ trợ bạn theo kịp tiến độ dự án và sự kiện. Ứng viên quan tâm mảng sự kiện nên có tư duy tổ chức và khả năng phối hợp nhiều đầu việc. Ứng viên thiên về truyền thông cần khả năng xây dựng nội dung và thẩm mỹ thị giác.`,
  
  "Câu lạc bộ được thành lập khi nào?": `FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM. Câu lạc bộ được thành lập vào tháng mười một năm 2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm cùng đội ngũ sinh viên ngành công nghệ tài chính.`,
  
  "Câu lạc bộ có những thành tích gì?": `Năm học 2024–2025, FTC được Ban Cán sự Đoàn ĐHQG-HCM tặng Giấy khen vì đóng góp tích cực cho công tác Đoàn và phong trào thanh niên. Câu lạc bộ đồng thời vào Top 10 Nhóm 4 của Giải thưởng Đổi mới sáng tạo và Khởi nghiệp TP.HCM I-STAR, được cấp Giấy chứng nhận ghi nhận nỗ lực và đóng góp trong hoạt động đổi mới sáng tạo.`
};
```

### 2. Hàm phát hiện câu hỏi gợi ý
```typescript
function detectSuggestedQuestion(userQuestion: string): string | null {
  const normalizedQuestion = userQuestion.trim().toLowerCase();
  
  for (const suggestedQ of SUGGESTED_QUESTIONS) {
    const normalizedSuggested = suggestedQ.toLowerCase();
    
    // So sánh chính xác
    if (normalizedQuestion === normalizedSuggested) {
      return suggestedQ;
    }
    
    // So sánh tương đối (có thể mở rộng)
    const similarity = calculateSimilarity(normalizedQuestion, normalizedSuggested);
    if (similarity > 0.8) {
      return suggestedQ;
    }
  }
  
  return null;
}

function calculateSimilarity(str1: string, str2: string): number {
  // Implement similarity algorithm (Levenshtein, Jaccard, etc.)
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  const intersection = words1.filter(word => words2.includes(word));
  return intersection.length / Math.max(words1.length, words2.length);
}
```

### 3. Logic xử lý chính
```typescript
async function handleChatbotRequest(userQuestion: string, history: any[]) {
  // 1. Kiểm tra câu hỏi gợi ý trước
  const matchedQuestion = detectSuggestedQuestion(userQuestion);
  
  if (matchedQuestion) {
    // Trả về câu trả lời định sẵn
    return {
      response: SUGGESTED_ANSWERS[matchedQuestion],
      source: 'suggested_question',
      mode: 'predefined'
    };
  }
  
  // 2. Nếu không phải câu hỏi gợi ý, gọi Gemini API
  return await callGeminiAPI(userQuestion, history);
}
```

### 4. Gemini API với role cố vấn
```typescript
async function callGeminiAPI(userQuestion: string, history: any[]) {
  const GEMINI_SYSTEM_PROMPT = `Bạn là cố vấn học tập dành cho tân sinh viên. Hãy giới thiệu ngắn gọn, thân thiện và dễ hiểu về Câu lạc bộ Công nghệ tài chính FTC cùng định hướng ngành học liên quan. 

Thông tin nền để dùng khi trả lời: FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM, thành lập tháng 11/2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm. Hoạt động tiêu biểu gồm hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn, quản trị rủi ro; cuộc thi học thuật ATTACKER; chuỗi talkshow và workshop; training nội bộ; tham quan doanh nghiệp như VNG; sự kiện hướng nghiệp Web3 Career Innovation; hoạt động gắn kết cộng đồng FTC Trip. Cơ cấu gồm 5 ban chuyên môn: Học thuật, Sự kiện, Truyền thông, Tài chính cá nhân, Nhân sự (Ban Điều hành giữ vai trò định hướng và phê duyệt, không tính là ban chuyên môn). Cách tham gia: theo dõi Fanpage để cập nhật đợt tuyển và hướng dẫn nộp hồ sơ (https://www.facebook.com/clbfintechuel). Lịch sinh hoạt được công bố trước trên kênh nội bộ và Fanpage theo từng chương trình. Kỹ năng khuyến khích: tinh thần học hỏi, kỷ luật, chủ động; nền tảng Excel, SQL hoặc Python là lợi thế; kỹ năng viết, thuyết trình, làm việc nhóm và quản lý thời gian giúp theo kịp dự án và sự kiện; thiên về sự kiện cần tư duy tổ chức, thiên về truyền thông cần năng lực xây dựng nội dung và thẩm mỹ thị giác. Thành tích: Giấy khen của Ban Cán sự Đoàn ĐHQG-HCM năm học 2024–2025; Top 10 Nhóm 4 Giải thưởng I-STAR TP.HCM. Khi thiếu dữ liệu chi tiết, hãy nói rõ "tài liệu chưa nêu" và hướng người hỏi sang Fanpage. Trả lời bằng tiếng Việt, mạch lạc, không dùng dấu ";" hoặc gạch đầu dòng. Đặc biệt hãy trả lời thân thiện tự nhiên.`;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: GEMINI_SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    }
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userQuestion }] }]
  });

  return {
    response: result.response.text(),
    source: 'gemini',
    mode: 'ai_generated'
  };
}
```

## 🔧 Implementation trong API Route

### Cập nhật `/app/api/chat/gemini/route.ts`
```typescript
export async function POST(req: NextRequest) {
  const body = await req.json();
  const userQuestion = extractUserQuestion(body);
  const history = body.history || [];

  // 1. Kiểm tra câu hỏi gợi ý
  const matchedQuestion = detectSuggestedQuestion(userQuestion);
  
  if (matchedQuestion) {
    return NextResponse.json({
      text: SUGGESTED_ANSWERS[matchedQuestion],
      reply: SUGGESTED_ANSWERS[matchedQuestion],
      response: SUGGESTED_ANSWERS[matchedQuestion],
      mode: "suggested_question",
      source: "predefined"
    });
  }

  // 2. Fallback sang Gemini
  const geminiResponse = await callGeminiAPI(userQuestion, history);
  
  return NextResponse.json({
    text: geminiResponse.response,
    reply: geminiResponse.response,
    response: geminiResponse.response,
    mode: "gemini",
    source: "ai_generated"
  });
}
```

## 🎨 UI Implementation

### Cập nhật Suggested Questions trong UI
```typescript
// Trong app/chatbot/chat/page.tsx
const suggestedQuestions = [
  "Câu lạc bộ có những hoạt động gì?",
  "Làm thế nào để tham gia câu lạc bộ?",
  "Các ban trong câu lạc bộ làm gì?",
  "Thời gian sinh hoạt diễn ra khi nào?",
  "Cần kỹ năng gì để ứng tuyển?",
  "Câu lạc bộ được thành lập khi nào?",
  "Câu lạc bộ có những thành tích gì?"
];

// Khi user click vào suggested question
const handleSuggestedQuestion = (question: string) => {
  setInputValue(question);
  // Tự động gửi câu hỏi
  setTimeout(() => {
    handleSendMessage();
  }, 100);
};
```

## 📊 Monitoring & Analytics

### Thêm tracking cho suggested questions
```typescript
// Log khi sử dụng suggested question
if (matchedQuestion) {
  console.log('Suggested question used:', {
    question: matchedQuestion,
    timestamp: new Date().toISOString(),
    userAgent: req.headers.get('user-agent')
  });
}
```

## 🚀 Deployment Checklist

- [ ] Cập nhật API route với logic phát hiện câu hỏi gợi ý
- [ ] Thêm SUGGESTED_ANSWERS vào constants
- [ ] Test tất cả 7 câu hỏi gợi ý
- [ ] Test fallback sang Gemini cho câu hỏi khác
- [ ] Kiểm tra UI hiển thị suggested questions
- [ ] Deploy và test trên production

## 🔍 Testing

### Test Cases
```typescript
const testCases = [
  {
    input: "Câu lạc bộ có những hoạt động gì?",
    expected: "suggested_question",
    shouldMatch: true
  },
  {
    input: "FTC có hoạt động gì không?",
    expected: "gemini",
    shouldMatch: false
  },
  {
    input: "Làm sao để join FTC?",
    expected: "suggested_question", 
    shouldMatch: true
  }
];
```

## 📝 Lưu ý quan trọng

1. **Thứ tự xử lý**: Luôn kiểm tra suggested questions trước khi gọi Gemini
2. **Performance**: Suggested questions có response time nhanh hơn
3. **Consistency**: Đảm bảo câu trả lời định sẵn chính xác và cập nhật
4. **Fallback**: Gemini chỉ được gọi khi không match suggested questions
5. **User Experience**: Giữ tone thân thiện, tự nhiên trong tất cả responses

## 🎯 Kết quả mong đợi

- Câu hỏi gợi ý → Trả lời ngay lập tức với nội dung định sẵn
- Câu hỏi khác → Gọi Gemini API với role cố vấn học tập
- Tất cả responses đều thân thiện, tự nhiên, không dùng dấu ";" hoặc gạch đầu dòng
- Links trong responses tự động trở thành clickable links
