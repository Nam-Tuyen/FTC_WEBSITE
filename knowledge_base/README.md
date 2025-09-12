# 📚 FTC Knowledge Base

Hệ thống quản lý kiến thức cho chatbot FTC. Chỉ cần thêm file vào đây là chatbot sẽ tự động học được!

## 🗂️ Cấu trúc thư mục

```
knowledge_base/
├── ftc/                    # Thông tin về FTC
│   ├── general.md         # Thông tin chung
│   ├── activities.md      # Hoạt động
│   ├── departments.md     # Các ban
│   └── recruitment.md     # Tuyển thành viên
├── fintech/               # Kiến thức FinTech
│   ├── basics.md         # Kiến thức cơ bản
│   ├── trends.md         # Xu hướng
│   └── careers.md        # Nghề nghiệp
├── events/                # Sự kiện
│   ├── upcoming.md       # Sự kiện sắp tới
│   └── past.md          # Sự kiện đã qua
├── faq/                   # Câu hỏi thường gặp
│   ├── general.md        # FAQ chung
│   └── technical.md      # FAQ kỹ thuật
└── templates/             # Templates mẫu
    ├── event.md          # Template sự kiện
    └── faq.md           # Template FAQ
```

## ✍️ Cách thêm kiến thức mới

### 1. Thêm file Markdown (.md)
Tạo file `.md` trong thư mục phù hợp:

```markdown
# Tiêu đề

## Mô tả ngắn gọn
Thông tin tóm tắt về chủ đề.

## Chi tiết
Nội dung chi tiết...

## Ví dụ
- Ví dụ 1
- Ví dụ 2

## Tags
#ftc #fintech #sự-kiện
```

### 2. Thêm file JSON (.json)
```json
{
  "title": "Tiêu đề",
  "category": "ftc",
  "content": "Nội dung chính...",
  "tags": ["ftc", "fintech"],
  "lastUpdated": "2024-01-01"
}
```

### 3. Thêm file Text (.txt)
```
Tiêu đề: Tên chủ đề
Danh mục: FTC
Nội dung: 
Thông tin chi tiết về chủ đề...
```

## 🔄 Auto-reload
Chatbot sẽ tự động load lại kiến thức khi:
- Có file mới được thêm
- File cũ được cập nhật
- Server restart

## 📝 Lưu ý
- Sử dụng tiếng Việt có dấu
- Tên file nên ngắn gọn, dễ hiểu
- Tránh ký tự đặc biệt trong tên file
- Nội dung nên có cấu trúc rõ ràng