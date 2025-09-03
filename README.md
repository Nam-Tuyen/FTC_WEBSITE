# FTC Chatbot - Hệ thống Chatbot Python

Hệ thống chatbot thông minh cho Câu lạc bộ Công nghệ - Tài chính (FTC) với khả năng trả lời câu hỏi về câu lạc bộ và tích hợp Gemini AI cho các câu hỏi chuyên môn.

## 🚀 Tính năng chính

- ✅ Trả lời câu hỏi về thông tin câu lạc bộ từ dữ liệu đã huấn luyện
- ✅ Tự động phân loại câu hỏi (câu lạc bộ vs. chuyên môn)
- ✅ Tích hợp Gemini API cho câu hỏi ngoài phạm vi
- ✅ Xử lý lỗi và fallback khi API không khả dụng
- ✅ Giao diện web đẹp mắt
- ✅ Command line interface
- ✅ Logging và monitoring

## 📋 Yêu cầu hệ thống

- Python 3.8+
- Gemini API Key (tùy chọn)

## 🛠️ Cài đặt

1. **Clone repository và cài đặt dependencies:**
```bash
pip install -r requirements.txt
```

2. **Cấu hình environment variables:**
```bash
cp .env.example .env
# Chỉnh sửa .env và thêm GEMINI_API_KEY
```

3. **Chạy chatbot:**

### Web Interface:
```bash
python app.py
```
Truy cập: http://localhost:5000

### Command Line:
```bash
python run_chatbot.py
```

### Interactive Test:
```bash
python test_chatbot.py
```

## 🏗️ Cấu trúc dự án

```
├── app.py                      # Flask web application
├── chatbot.py                  # Chatbot chính
├── config.py                   # Cấu hình hệ thống
├── requirements.txt            # Dependencies
├── run_chatbot.py             # CLI interface
├── test_chatbot.py            # Test cases
├── data/
│   └── club_data.py           # Dữ liệu câu lạc bộ
├── services/
│   ├── gemini_service.py      # Gemini API service
│   ├── club_knowledge.py      # Kiến thức câu lạc bộ
│   └── question_classifier.py # Phân loại câu hỏi
└── utils/
    └── text_processor.py      # Xử lý văn bản
```

## 🔧 Cấu hình

### Environment Variables (.env):
```env
GEMINI_API_KEY=your_gemini_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_PORT=5000
LOG_LEVEL=INFO
```

### Lấy Gemini API Key:
1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tạo API key mới
3. Copy và paste vào file `.env`

## 📖 Sử dụng

### 1. Web Interface
```bash
python app.py
```

### 2. Command Line
```bash
python run_chatbot.py
```

### 3. Programmatic Usage
```python
from chatbot import FTCChatBot

# Khởi tạo chatbot
bot = FTCChatBot()

# Xử lý câu hỏi
response = bot.process_question("CLB có những hoạt động gì?")
print(response)

# Lấy thống kê
stats = bot.get_stats()
print(stats)
```

## 🧪 Testing

Chạy test cases:
```bash
python -m pytest test_chatbot.py -v
```

Chạy interactive test:
```bash
python test_chatbot.py
```

## 📊 API Endpoints

### POST /api/chat
Xử lý tin nhắn chat
```json
{
  "message": "CLB có những hoạt động gì?"
}
```

### GET /api/stats
Lấy thống kê sử dụng

### POST /api/clear
Xóa lịch sử hội thoại

### GET /health
Health check

## 🎯 Ví dụ câu hỏi

### Câu hỏi về câu lạc bộ:
- "CLB có những hoạt động gì?"
- "Làm sao để tham gia FTC?"
- "Các ban trong câu lạc bộ làm gì?"
- "Chi phí tham gia là bao nhiêu?"

### Câu hỏi chuyên môn (sẽ dùng Gemini):
- "Blockchain là gì?"
- "DeFi hoạt động như thế nào?"
- "Smart contract có an toàn không?"
- "Phân tích dữ liệu trong tài chính"

## 🔍 Troubleshooting

### Lỗi thường gặp:

1. **Gemini API không hoạt động:**
   - Kiểm tra API key trong `.env`
   - Kiểm tra kết nối internet
   - Chatbot vẫn hoạt động với dữ liệu nội bộ

2. **Import error:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Port đã được sử dụng:**
   - Thay đổi `FLASK_PORT` trong `.env`
   - Hoặc kill process đang dùng port 5000

## 📝 Ghi chú

- Chatbot hoạt động offline với dữ liệu câu lạc bộ
- Gemini API chỉ dùng cho câu hỏi chuyên môn
- Hệ thống tự động fallback khi API lỗi
- Hỗ trợ tiếng Việt có dấu

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.