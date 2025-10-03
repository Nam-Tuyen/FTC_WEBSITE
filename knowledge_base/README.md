# 📚 FTC Knowledge Base

Hệ thống quản lý kiến thức cho chatbot FTC và website. Chỉ cần thêm file vào đây là chatbot sẽ tự động học được!

## 🗂️ Cấu trúc thư mục hiện tại

```
knowledge_base/
├── ftc/                    # Thông tin về FTC
│   ├── general.md         # Thông tin chung về câu lạc bộ
│   ├── activities.md      # Hoạt động và sự kiện
│   └── departments.md     # Cơ cấu tổ chức các ban
├── fintech/               # Kiến thức FinTech
│   └── basics.md         # Kiến thức cơ bản về FinTech
└── faq/                   # Câu hỏi thường gặp
    └── general.md        # FAQ chung về FTC và website
```

## 🌐 Tính năng website hiện tại

### 🤖 Chatbot thông minh
- **Chế độ câu lạc bộ**: Tư vấn về FTC, hoạt động, tuyển thành viên
- **Chế độ FinTech**: Giải đáp kiến thức công nghệ tài chính
- **Tích hợp RAG**: Sử dụng kiến thức từ knowledge base
- **Giao diện thân thiện**: Chat real-time với AI

### 💬 Diễn đàn tương tác
- **Đăng câu hỏi**: Hỏi đáp về FinTech và FTC
- **Thảo luận**: Tương tác với cộng đồng
- **Tìm kiếm thông minh**: 6 cách sắp xếp khác nhau
- **Phân loại**: Theo danh mục và chủ đề
- **Hệ thống like**: Đánh giá câu hỏi hay

### 👤 Hệ thống đăng ký/đăng nhập
- **Đăng ký thành viên**: Form đăng ký chi tiết
- **Câu hỏi bảo mật**: 3 câu hỏi để khôi phục tài khoản
- **Bảo mật**: Mã hóa thông tin người dùng
- **Quản lý profile**: Cập nhật thông tin cá nhân

### 📊 Thống kê và phân tích
- **Dashboard**: Thống kê câu hỏi, phản hồi, lượt thích
- **Thành viên hoạt động**: Theo dõi người dùng tích cực
- **Xu hướng**: Câu hỏi được quan tâm nhất

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