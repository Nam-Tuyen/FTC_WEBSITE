# Hướng dẫn cấu hình Chatbot FTC

## Cấu hình API Key

### 1. Cấu hình cho Development (Local)

File `.env.local` đã được tạo với API key của bạn:
```bash
GEMINI_API_KEY=AIzaSyAQGT-i0relKV5cu20n6LL91w0fmThqU_Y
GOOGLE_API_KEY=AIzaSyAQGT-i0relKV5cu20n6LL91w0fmThqU_Y
```

### 2. Cấu hình cho Production (Vercel)

API key đã được cấu hình trên Vercel Environment Variables:
- `GEMINI_API_KEY` = `AIzaSyAQGT-i0relKV5cu20n6LL91w0fmThqU_Y`
- `GOOGLE_API_KEY` = `AIzaSyAQGT-i0relKV5cu20n6LL91w0fmThqU_Y`

## Bảo mật

✅ **API key được bảo vệ an toàn:**
- File `.env.local` được thêm vào `.gitignore`
- Không bao giờ commit API key lên GitHub
- Chỉ sử dụng Environment Variables trên Vercel cho production

## Chạy ứng dụng

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Truy cập chatbot
http://localhost:3000/chatbot
```

## API Endpoints

1. **Primary API**: `/api/chat/gemini` - Sử dụng Gemini AI với knowledge base
2. **Fallback API**: `/api/chat/fallback` - API dự phòng không cần Gemini key

## Kiểm tra hoạt động

```bash
# Test Gemini API
curl -X POST http://localhost:3000/api/chat/gemini \
  -H "Content-Type: application/json" \
  -d '{"message": "Cần kỹ năng gì để ứng tuyển?"}'

# Test Fallback API
curl -X POST http://localhost:3000/api/chat/fallback \
  -H "Content-Type: application/json" \
  -d '{"message": "Cần kỹ năng gì để ứng tuyển?"}'
```

## Lưu ý

- Model sử dụng: `gemini-1.5-flash` (đã cập nhật từ `gemini-pro`)
- Knowledge base được load từ `backend/data/knowledge_base/`
- Có error handling và fallback mechanism
- API key được bảo vệ và không lộ trên GitHub
