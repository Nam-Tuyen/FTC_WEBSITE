# FTC Chatbot Backend với Genkit

Hệ thống backend chatbot được xây dựng bằng Google Genkit, cung cấp các AI flows cho các tính năng khác nhau của ứng dụng FTC.

## 🏗️ Cấu trúc

```
ai/
├── genkit.ts                    # Cấu hình chính Genkit
└── flows/
    ├── ftc-chatbot.ts          # Flow chatbot chính cho FTC
    ├── moderate-blog-comments.ts # Kiểm duyệt bình luận blog
    ├── analyze-application.ts   # Phân tích đơn ứng tuyển
    └── personal-advisor-chat.ts # Tư vấn cá nhân theo quiz
```

## 🚀 Cài đặt

1. **Cài đặt dependencies:**
   ```bash
   npm install
   # hoặc
   pnpm install
   ```

2. **Cấu hình biến môi trường:**
   ```bash
   cp .env.example .env.local
   ```
   
   Thêm API key của Google:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Test các flows:**
   ```bash
   npm run test:genkit
   ```

## 📡 API Endpoints

### 1. FTC Chatbot - `/api/chat/genkit`

**POST Request:**
```json
{
  "message": "FTC là gì?",
  "history": [
    {"role": "user", "content": "Xin chào"},
    {"role": "assistant", "content": "Chào bạn!"}
  ],
  "mode": "club"
}
```

**Response:**
```json
{
  "response": "FTC là Câu lạc bộ Công nghệ Tài chính...",
  "source": "knowledge_base",
  "suggestions": [
    "FTC có những hoạt động gì?",
    "Làm thế nào để tham gia FTC?"
  ]
}
```

### 2. Comment Moderation - `/api/ai/moderate-comments`

**POST Request:**
```json
{
  "comment": "Bài viết rất hay!"
}
```

**Response:**
```json
{
  "isSafe": true,
  "reason": null
}
```

### 3. Application Analysis - `/api/ai/analyze-application`

**POST Request:**
```json
{
  "reason": "Tôi muốn tham gia FTC để học FinTech",
  "expectation": "Tôi hy vọng được tham gia dự án thực tế",
  "situation": "Tôi sẽ giải quyết xung đột bằng cách lắng nghe"
}
```

**Response:**
```json
{
  "analysis": "Ứng viên thể hiện động lực học tập mạnh mẽ..."
}
```

### 4. Personal Advisor - `/api/ai/personal-advisor`

**POST Request:**
```json
{
  "message": "Tôi có thể làm gì trong ban này?",
  "context": {
    "departmentInfo": {
      "name": "Ban Truyền thông & Kỹ thuật",
      "description": "Quản lý công nghệ và thiết kế",
      "strengths": ["Sáng tạo", "Kỹ thuật"],
      "weaknesses": ["Giao tiếp"]
    },
    "quizScores": {
      "A": 7, "B": 3, "C": 5, "D": 4
    },
    "department": "A",
    "isReturningUser": false,
    "chatCount": 1
  }
}
```

**Response:**
```json
{
  "response": "Dựa trên kết quả quiz của bạn, mình thấy bạn rất phù hợp với Ban Truyền thông & Kỹ thuật..."
}
```

## 🔧 Tùy chỉnh

### Thêm Flow mới

1. Tạo file flow trong `ai/flows/`:
   ```typescript
   import { ai } from '@/ai/genkit';
   import { z } from 'genkit';

   const MyFlowInputSchema = z.object({
     input: z.string()
   });

   const MyFlowOutputSchema = z.object({
     output: z.string()
   });

   export async function myFlow(input: MyFlowInput) {
     return myFlowImplementation(input);
   }

   const myFlowImplementation = ai.defineFlow({
     name: 'myFlow',
     inputSchema: MyFlowInputSchema,
     outputSchema: MyFlowOutputSchema,
   }, async (input) => {
     // Implementation here
   });
   ```

2. Import trong `ai/genkit.ts`:
   ```typescript
   import '@/ai/flows/my-flow.ts';
   ```

3. Tạo API endpoint trong `app/api/`:
   ```typescript
   import { myFlow } from '@/ai/flows/my-flow';
   
   export async function POST(req: NextRequest) {
     const input = await req.json();
     const result = await myFlow(input);
     return NextResponse.json(result);
   }
   ```

### Cập nhật Knowledge Base

Knowledge base được load từ:
- `backend/data/knowledge_base/` - Files Python hiện tại
- `knowledge_base/` - Files mới (MD, TXT, JSON)

Để thêm thông tin mới, tạo file trong một trong hai thư mục trên.

### Cấu hình Model

Thay đổi model trong `ai/genkit.ts`:
```typescript
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-pro', // Thay đổi model ở đây
});
```

## 🐛 Debug

1. **Kiểm tra logs:**
   ```bash
   # Development mode
   npm run dev
   
   # Check console logs in browser or terminal
   ```

2. **Test individual flows:**
   ```bash
   npm run test:genkit
   ```

3. **Common issues:**
   - **API Key không hoạt động**: Kiểm tra `.env.local` và đảm bảo key đúng
   - **Import errors**: Kiểm tra path aliases trong `tsconfig.json`
   - **Flow không response**: Kiểm tra schema input/output

## 📚 Tài liệu tham khảo

- [Google Genkit Documentation](https://firebase.google.com/docs/genkit)
- [Gemini API](https://ai.google.dev/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🤝 Contributing

1. Tạo branch mới cho feature
2. Implement và test flow
3. Update documentation
4. Create pull request