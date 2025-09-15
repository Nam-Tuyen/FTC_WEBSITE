# Hướng dẫn sử dụng Hệ thống RAG cho Chatbot FTC

## Tổng quan

Hệ thống RAG (Retrieval-Augmented Generation) cho phép chatbot học từ dữ liệu được cung cấp trong knowledge base. Khi có câu hỏi, hệ thống sẽ:
1. Tìm kiếm thông tin liên quan trong knowledge base
2. Đưa thông tin đó vào prompt cho Gemini
3. Gemini trả lời dựa trên thông tin đã học

## Cấu trúc Knowledge Base

```
backend/data/knowledge_base/
├── ftc_general.txt          # Thông tin chung về FTC
├── recruitment_skills.txt   # Kỹ năng ứng tuyển
├── activities.txt           # Hoạt động câu lạc bộ
├── lch_hot_ng_thng.txt     # Lịch hoạt động
├── quy_nh_cu_lc_b.txt      # Quy định câu lạc bộ
├── c_hi_ngh_nghip.txt      # Cơ hội nghề nghiệp
└── .rag_cache.json         # Cache file (tự động tạo)
```

## Cách thêm thông tin mới

### 1. Sử dụng Script (Khuyến nghị)

```bash
# Thêm thông tin mới
node scripts/add-knowledge.js "Tiêu đề" "Nội dung" [thể_loại] [tên_file]

# Ví dụ:
node scripts/add-knowledge.js "Học phí" "Tham gia FTC hoàn toàn miễn phí" "general"
node scripts/add-knowledge.js "Địa điểm" "Phòng A101, Tòa nhà A, UEL" "location" "dia_diem.txt"
```

### 2. Tạo file trực tiếp

Tạo file `.txt` trong thư mục `backend/data/knowledge_base/` với format:

```markdown
# Tiêu đề

**Thể loại:** category_name

Nội dung chi tiết...
```

### 3. Sử dụng API

```bash
# Thêm qua API
curl -X POST http://localhost:3000/api/knowledge \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tiêu đề",
    "content": "Nội dung",
    "category": "general",
    "filename": "optional_filename.txt"
  }'
```

## Quản lý Knowledge Base

### Xem tất cả thông tin

```bash
curl http://localhost:3000/api/knowledge
```

### Tìm kiếm thông tin

```bash
curl "http://localhost:3000/api/knowledge?q=từ_khóa"
```

### Lọc theo thể loại

```bash
curl "http://localhost:3000/api/knowledge?category=general"
```

## Các thể loại (Categories) được hỗ trợ

- `general` - Thông tin chung
- `recruitment` - Tuyển dụng
- `activities` - Hoạt động
- `schedule` - Lịch trình
- `rules` - Quy định
- `career` - Nghề nghiệp
- `location` - Địa điểm
- `contact` - Liên hệ

## Cách hoạt động của RAG

1. **Khi có câu hỏi**: Hệ thống phân tích từ khóa trong câu hỏi
2. **Tìm kiếm**: Tìm các file có nội dung liên quan
3. **Chấm điểm**: Tính điểm relevance cho từng file
4. **Chọn lọc**: Lấy top 3 file có điểm cao nhất
5. **Tạo context**: Ghép nội dung thành context string
6. **Gửi Gemini**: Đưa context vào prompt cho Gemini
7. **Trả lời**: Gemini trả lời dựa trên thông tin đã học

## Ví dụ thực tế

### Câu hỏi: "Lịch hoạt động của câu lạc bộ như thế nào?"

1. Hệ thống tìm thấy file `lch_hot_ng_thng.txt`
2. Lấy nội dung về lịch hoạt động
3. Đưa vào prompt cho Gemini
4. Gemini trả lời dựa trên thông tin này

### Câu hỏi: "Cơ hội nghề nghiệp khi tham gia FTC?"

1. Hệ thống tìm thấy file `c_hi_ngh_nghip.txt`
2. Lấy nội dung về cơ hội nghề nghiệp
3. Đưa vào prompt cho Gemini
4. Gemini trả lời dựa trên thông tin này

## Lưu ý quan trọng

1. **Cache**: Hệ thống có cache 5 phút, thay đổi file sẽ được load sau 5 phút
2. **Format**: Sử dụng Markdown format để dễ đọc
3. **Encoding**: Luôn sử dụng UTF-8
4. **Tên file**: Nên sử dụng tiếng Việt không dấu, gạch dưới thay vì khoảng trắng
5. **Nội dung**: Viết rõ ràng, có cấu trúc để Gemini hiểu tốt hơn

## Troubleshooting

### Chatbot không trả lời đúng thông tin mới

- Kiểm tra file đã được tạo đúng format chưa
- Đợi 5 phút để cache refresh
- Restart server: `npm run dev`

### Lỗi import module

- Kiểm tra đường dẫn file
- Đảm bảo file `.ts` được compile đúng

### Không tìm thấy thông tin

- Kiểm tra từ khóa trong câu hỏi có match với nội dung file
- Thử sử dụng từ khóa khác
- Kiểm tra file có nội dung không rỗng

## Mở rộng

Để mở rộng hệ thống, bạn có thể:

1. Thêm các loại file khác (PDF, Word, etc.)
2. Cải thiện thuật toán tìm kiếm
3. Thêm vector search
4. Tích hợp database
5. Thêm webhook để auto-update

Hệ thống RAG này giúp chatbot FTC có thể học và trả lời dựa trên thông tin thực tế của câu lạc bộ! 🚀
