# 📚 Hướng dẫn sử dụng Knowledge Base System

Hệ thống quản lý kiến thức cho chatbot FTC - **Chỉ cần thêm file là chatbot tự động học!**

## 🚀 Cách sử dụng nhanh

### 1. Thêm kiến thức bằng cách tạo file
```bash
# Tạo file mới trong knowledge_base/
echo "# Thông tin mới
Nội dung kiến thức mới...
#tag1 #tag2" > knowledge_base/ftc/thong-tin-moi.md
```

### 2. Chatbot tự động học
- File được tạo → Hệ thống tự động phát hiện
- Kiến thức được load → Chatbot có thể trả lời ngay

### 3. Kiểm tra qua giao diện admin
```
http://localhost:3000/admin/knowledge
```

## 📁 Cấu trúc thư mục

```
knowledge_base/
├── ftc/           # Thông tin về FTC
├── fintech/       # Kiến thức FinTech  
├── events/        # Sự kiện
├── faq/           # Câu hỏi thường gặp
├── templates/     # Mẫu templates
└── examples/      # Ví dụ mẫu
```

## ✍️ Các cách thêm kiến thức

### Cách 1: Tạo file Markdown (.md) - **Khuyến nghị**
```markdown
# Tiêu đề kiến thức

## Mô tả
Thông tin chi tiết về chủ đề...

## Ví dụ
- Ví dụ 1
- Ví dụ 2

#tag1 #tag2 #tag3
```

### Cách 2: Tạo file JSON (.json)
```json
{
  "title": "Tiêu đề",
  "category": "ftc",
  "content": "Nội dung chi tiết...",
  "tags": ["tag1", "tag2"],
  "lastUpdated": "2024-01-01"
}
```

### Cách 3: Tạo file Text (.txt)
```
Tiêu đề: Tên chủ đề
Danh mục: ftc
Nội dung:
Thông tin chi tiết...
```

### Cách 4: Qua giao diện Admin
1. Truy cập: `http://localhost:3000/admin/knowledge`
2. Tab "Thêm mới"
3. Điền form và submit

## 🏷️ Hệ thống Tags

### Tags thường dùng:
- `#ftc` - Thông tin về FTC
- `#fintech` - Kiến thức FinTech
- `#sự-kiện` - Các sự kiện
- `#tuyển-thành-viên` - Tuyển dụng
- `#faq` - Câu hỏi thường gặp
- `#hoạt-động` - Hoạt động CLB
- `#ban` - Thông tin các ban

## 📂 Danh mục (Categories)

### Danh mục chính:
- **ftc** - Thông tin câu lạc bộ
- **fintech** - Kiến thức chuyên môn
- **events** - Sự kiện, workshop
- **faq** - Câu hỏi thường gặp
- **announcements** - Thông báo
- **recruitment** - Tuyển thành viên

## 🛠️ Công cụ và Scripts

### Test hệ thống:
```bash
npm run test:knowledge
```

### Test chatbot:
```bash
npm run test:genkit
```

### Reload knowledge base:
```bash
# Qua API
curl -X PUT "http://localhost:3000/api/knowledge?action=reload"

# Hoặc qua admin interface
```

## 📊 API Endpoints

### GET /api/knowledge
```bash
# Lấy tất cả
curl "http://localhost:3000/api/knowledge"

# Tìm kiếm
curl "http://localhost:3000/api/knowledge?q=FTC"

# Lọc theo category
curl "http://localhost:3000/api/knowledge?category=ftc"

# Lấy thống kê
curl "http://localhost:3000/api/knowledge?stats=true"
```

### POST /api/knowledge
```bash
curl -X POST "http://localhost:3000/api/knowledge" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kiến thức mới",
    "content": "Nội dung...",
    "category": "ftc",
    "tags": ["tag1", "tag2"]
  }'
```

## 🎯 Best Practices

### 1. Đặt tên file
- Sử dụng tiếng Việt không dấu
- Thay khoảng trắng bằng dấu gạch ngang
- Ví dụ: `thong-tin-tuyen-thanh-vien.md`

### 2. Cấu trúc nội dung
- Tiêu đề rõ ràng với `# Tiêu đề`
- Sử dụng heading phân cấp (`##`, `###`)
- Thêm tags ở cuối file

### 3. Categories
- Chọn category phù hợp với nội dung
- Tạo category mới nếu cần thiết
- Tên category nên ngắn gọn

### 4. Tags
- Tối đa 5-7 tags per file
- Sử dụng tags phổ biến để dễ tìm kiếm
- Tags bằng tiếng Việt có dấu gạch ngang

## 🔧 Troubleshooting

### Chatbot không trả lời đúng?
1. Kiểm tra file có được load không:
   ```bash
   npm run test:knowledge
   ```
2. Reload knowledge base:
   - Admin interface → Reload button
   - Hoặc restart server

### File mới không được nhận diện?
1. Kiểm tra format file (.md, .json, .txt)
2. Kiểm tra cấu trúc thư mục
3. Kiểm tra quyền file (readable)

### Giao diện admin không hoạt động?
1. Kiểm tra server đang chạy
2. Truy cập đúng URL: `/admin/knowledge`
3. Kiểm tra console browser có lỗi không

## 📝 Templates có sẵn

### Sự kiện:
```bash
cp knowledge_base/templates/event.md knowledge_base/events/ten-su-kien.md
```

### FAQ:
```bash
cp knowledge_base/templates/faq.md knowledge_base/faq/chu-de-faq.md
```

### Thông báo:
```bash
cp knowledge_base/templates/announcement.json knowledge_base/announcements/thong-bao.json
```

## 🎉 Ví dụ thực tế

### Thêm thông tin sự kiện mới:
```bash
# Tạo file
cat > knowledge_base/events/workshop-ai-trading.md << 'EOF'
# Workshop: AI trong Trading

## Thời gian
15/03/2024 - 14:00-17:00

## Địa điểm  
Phòng A2.01, UEL

## Nội dung
- Giới thiệu AI trong trading
- Demo trading bot
- Thực hành với Python

## Đăng ký
Link: https://forms.gle/example

#workshop #ai #trading #sự-kiện #ftc
EOF

# Kiểm tra
curl "http://localhost:3000/api/knowledge?q=workshop"
```

### Thêm FAQ mới:
```bash
cat > knowledge_base/faq/hoc-phi-ftc.md << 'EOF'
# FAQ - Học phí và chi phí

## FTC có thu học phí không?
FTC hoàn toàn miễn phí! Không có bất kỳ khoản phí nào.

## Có chi phí nào khác không?
Chỉ có chi phí tự nguyện cho:
- Đi trip (khoảng 500k-1tr)
- Mua áo CLB (200k-300k)

#faq #học-phí #chi-phí #ftc
EOF
```

## 🚀 Workflow khuyến nghị

### Hàng ngày:
1. **Thêm kiến thức mới** → Tạo file trong `knowledge_base/`
2. **Kiểm tra chatbot** → Test câu hỏi liên quan
3. **Cập nhật nếu cần** → Sửa file hoặc thêm thông tin

### Hàng tuần:
1. **Review knowledge base** → Admin interface
2. **Kiểm tra stats** → Số lượng, categories
3. **Cleanup** → Xóa thông tin cũ không còn cần thiết

### Trước sự kiện lớn:
1. **Thêm thông tin sự kiện** → Chi tiết, FAQ
2. **Test chatbot** → Đảm bảo trả lời đúng
3. **Thông báo team** → Hướng dẫn sử dụng

---

## 💡 Tips & Tricks

- **File mới tự động load trong 1-2 giây**
- **Chatbot ưu tiên thông tin mới nhất**
- **Sử dụng markdown để format đẹp**
- **Tags giúp tìm kiếm chính xác hơn**
- **Admin interface có search và filter mạnh**

**🎯 Mục tiêu: Chatbot thông minh hơn mỗi ngày!**