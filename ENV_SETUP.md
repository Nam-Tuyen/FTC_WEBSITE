# Hướng dẫn cấu hình Environment Variables

## Tạo file .env.local

Tạo file `.env.local` trong thư mục gốc của project với nội dung sau:

```env
# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Alternative Google API Key (if using Google AI Studio)
GOOGLE_API_KEY=your_google_api_key_here

# Base URL for API calls
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

## Lấy API Key

1. **Gemini API Key**:
   - Truy cập [Google AI Studio](https://aistudio.google.com/)
   - Đăng nhập bằng Google account
   - Tạo API key mới
   - Copy API key và paste vào `GEMINI_API_KEY`

2. **Google API Key** (tùy chọn):
   - Truy cập [Google Cloud Console](https://console.cloud.google.com/)
   - Tạo project mới hoặc chọn project hiện có
   - Bật Google Generative AI API
   - Tạo API key
   - Copy API key và paste vào `GOOGLE_API_KEY`

## Chạy ứng dụng

Sau khi cấu hình xong:

```bash
npm install
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Lưu ý

- Đảm bảo API key có quyền truy cập Google Generative AI
- Không commit file `.env.local` vào git
- Kiểm tra console để xem lỗi nếu có
