# FTC Website - Câu lạc bộ Công nghệ Tài chính

Website chính thức của Câu lạc bộ Công nghệ Tài chính (FTC) - Nơi kết nối những người đam mê fintech.

## 🚀 Tính năng chính

- **Trang chủ**: Giới thiệu về câu lạc bộ với thiết kế hiện đại và responsive
- **Thông tin**: Thông tin chi tiết về câu lạc bộ, cơ cấu tổ chức
- **Thành tích**: Những thành tựu nổi bật của câu lạc bộ
- **Hoạt động**: Các sự kiện và hoạt động thú vị
- **Ứng tuyển**: Form đăng ký tham gia câu lạc bộ
- **Diễn đàn**: Nơi thảo luận và chia sẻ kiến thức với hệ thống đăng nhập/đăng ký
- **Chatbot AI**: Trợ lý thông minh hỗ trợ tư vấn về fintech

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS với thiết kế responsive
- **UI Components**: Shadcn/ui
- **Authentication**: Custom auth system với Google Sheets API
- **Database**: Google Sheets làm backend database
- **AI**: Google Gemini API cho chatbot
- **Deployment**: Vercel

## 📁 Cấu trúc dự án

```
├── app/                    # Next.js App Router
│   ├── dien-dan/          # Diễn đàn thảo luận
│   ├── chatbot/           # Chatbot AI
│   ├── thong-tin/         # Thông tin câu lạc bộ
│   ├── thanh-tich/        # Thành tích
│   ├── hoat-dong/         # Hoạt động
│   ├── ung-tuyen/         # Ứng tuyển
│   └── co-cau/            # Cơ cấu tổ chức
├── components/            # React components
│   ├── auth/              # Authentication forms
│   ├── forum/             # Forum components
│   └── ui/                # UI components
├── lib/                   # Utilities và API clients
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🚀 Cài đặt và chạy

1. **Clone repository**
   ```bash
   git clone https://github.com/Nam-Tuyen/FTC_WEBSITE.git
   cd FTC_WEBSITE
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   # hoặc
   pnpm install
   ```

3. **Cấu hình environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Cập nhật các biến môi trường:
   - `GEMINI_API_KEY`: API key cho Google Gemini
   - `NEXT_PUBLIC_FORUM_API_URL`: URL API cho forum
   - `NEXT_PUBLIC_FORUM_API_TOKEN`: Token xác thực API

4. **Chạy development server**
   ```bash
   npm run dev
   # hoặc
   pnpm dev
   ```

5. **Mở trình duyệt**
   Truy cập [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Vercel (Khuyến nghị)

1. Fork repository này
2. Kết nối với Vercel
3. Cấu hình environment variables trong Vercel Dashboard
4. Deploy tự động

### Environment Variables cần thiết

- `GEMINI_API_KEY`: API key cho Google Gemini AI
- `NEXT_PUBLIC_FORUM_API_URL`: URL API cho forum system
- `NEXT_PUBLIC_FORUM_API_TOKEN`: Token xác thực API

## 📝 Ghi chú

- Dự án sử dụng Google Sheets làm backend database
- Chatbot sử dụng Google Gemini API
- Thiết kế responsive hoàn toàn cho mobile và desktop
- Hệ thống authentication custom với Google Sheets

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License
