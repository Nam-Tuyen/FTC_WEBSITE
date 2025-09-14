# Hướng dẫn Setup FTC Website

## Lỗi 500 Internal Server Error - Đã được sửa ✅

### Nguyên nhân lỗi:
1. **Lỗi syntax**: Thiếu dấu `{` trong function `parseRequest` (đã sửa)
2. **Thiếu biến môi trường**: Không có `GEMINI_API_KEY` (đã tạo file `.env.local`)
3. **Error handling kém**: API trả về 500 thay vì 503 khi có lỗi (đã cải thiện)

### Các bước setup:

#### 1. Cài đặt dependencies
```bash
pnpm install
```

#### 2. Cấu hình biến môi trường
File `.env.local` đã được tạo với template. Bạn cần cập nhật các giá trị thực:

```bash
# Lấy API key từ: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Cấu hình Supabase (nếu sử dụng)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

#### 3. Chạy development server
```bash
pnpm dev
```

#### 4. Test API
Truy cập: `http://localhost:3000/api/chat/gemini`

### Các cải thiện đã thực hiện:

1. **Sửa lỗi syntax** trong `parseRequest` function
2. **Tạo file `.env.local`** với template cấu hình
3. **Cải thiện error handling**:
   - Trả về 503 thay vì 500 khi không có API key
   - Xử lý lỗi khi load knowledge base
   - Xử lý lỗi khi gọi Gemini API
4. **Thêm logging** chi tiết để debug

### Troubleshooting:

#### Nếu vẫn gặp lỗi 500:
1. Kiểm tra file `.env.local` có đúng API key không
2. Kiểm tra console logs để xem lỗi cụ thể
3. Đảm bảo API key Gemini có quyền truy cập

#### Nếu gặp lỗi 503:
- API key không hợp lệ hoặc hết hạn
- Kiểm tra quota của Gemini API

### Deploy lên Vercel:

1. Thêm biến môi trường trong Vercel Dashboard:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL` (nếu cần)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (nếu cần)

2. Deploy:
```bash
vercel --prod
```

### Kiểm tra health:
Truy cập: `http://localhost:3000/api/_health` để kiểm tra trạng thái API.