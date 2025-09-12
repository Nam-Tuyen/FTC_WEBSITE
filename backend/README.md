# 🤖 RAG Chatbot Backend với Gemini API

Hệ thống backend RAG (Retrieval-Augmented Generation) chatbot sử dụng Google Gemini API, được tối ưu hóa cho deployment trên Vercel.

## 🚀 Tính năng

- **RAG System**: Tìm kiếm và sử dụng context từ documents để trả lời
- **Gemini API Integration**: Sử dụng Google Gemini 1.5 Flash model
- **Document Processing**: Hỗ trợ PDF, DOCX, TXT files
- **Vector Search**: Semantic search trong documents
- **Conversation Memory**: Lưu trữ lịch sử chat
- **Secure API Key**: Sử dụng Vercel environment variables
- **Rate Limiting**: Bảo vệ khỏi spam requests
- **Comprehensive Logging**: Winston logging system

## 📁 Cấu trúc dự án

```
backend/
├── api/
│   ├── index.js         # Main API entry point
│   ├── chat.js          # Chat endpoint
│   └── documents.js     # Document upload endpoint
├── services/
│   ├── geminiService.js # Gemini API integration
│   ├── ragService.js    # RAG logic
│   └── vectorService.js # Vector storage & search
├── utils/
│   ├── logger.js        # Winston logging
│   ├── textProcessor.js # Text processing utilities
│   └── documentParser.js # Document parsing
├── middleware/
│   └── errorHandler.js  # Error handling
├── package.json
├── vercel.json          # Vercel configuration
└── .env.example         # Environment variables template
```

## 🔧 API Endpoints

### Chat
- `POST /chat` - Chat với RAG system
- `GET /chat/history/:conversationId` - Lấy lịch sử chat
- `DELETE /chat/history/:conversationId` - Xóa lịch sử chat

### Documents
- `POST /documents/upload` - Upload documents
- `GET /documents` - Lấy danh sách documents
- `DELETE /documents/:documentId` - Xóa document
- `POST /documents/search` - Tìm kiếm trong documents

### System
- `GET /` - API info
- `GET /health` - Health check

## 🛠️ Setup và Deployment

### 1. Cài đặt Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Trong Vercel Dashboard → Settings → Environment Variables:

**Required:**
```
GEMINI_API_KEY = AIzaSyCM4LsYsE6adRq1A5u4ros6yRJpBG7YMSw
```

**Optional:**
```
GEMINI_MODEL = gemini-1.5-flash
NODE_ENV = production
MAX_DOCUMENTS = 1000
CHUNK_SIZE = 500
SIMILARITY_THRESHOLD = 0.7
```

### 3. Deploy lên Vercel
```bash
# Vercel CLI
npm install -g vercel
vercel --prod

# Hoặc Git Integration
# Push code → Auto deploy
```

## 📝 Usage Examples

### Chat Request
```bash
curl -X POST https://your-backend.vercel.app/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is artificial intelligence?",
    "useRag": true
  }'
```

### Upload Document
```bash
curl -X POST https://your-backend.vercel.app/documents/upload \
  -F "documents=@document.pdf"
```

### Health Check
```bash
curl https://your-backend.vercel.app/health
```

## 🔒 Security Features

- ✅ Secure API key handling via Vercel environment variables
- ✅ Rate limiting (100 requests/15 minutes)
- ✅ Input validation
- ✅ File type restrictions
- ✅ Error message sanitization
- ✅ CORS configuration
- ✅ Helmet security headers

## 🧠 RAG System

1. **Document Upload**: Parse và chia nhỏ documents thành chunks
2. **Vector Generation**: Tạo embeddings cho mỗi chunk
3. **Similarity Search**: Tìm chunks liên quan đến user query
4. **Context Injection**: Thêm relevant context vào Gemini prompt
5. **Response Generation**: Gemini tạo response dựa trên context

## 📊 Monitoring

- **Health Endpoint**: `/health` - Check system status
- **Logs**: Winston logging với different levels
- **Error Tracking**: Comprehensive error handling
- **Performance**: Request timing và memory usage

## 🔧 Configuration

Tất cả configuration thông qua environment variables:

```bash
# Core
GEMINI_API_KEY=xxx        # Required
GEMINI_MODEL=gemini-1.5-flash

# RAG Settings  
MAX_DOCUMENTS=1000        # Max documents in memory
CHUNK_SIZE=500           # Text chunk size
CHUNK_OVERLAP=50         # Overlap between chunks
MAX_CONTEXT_LENGTH=4000  # Max context for Gemini
SIMILARITY_THRESHOLD=0.7 # Min similarity for RAG

# System
NODE_ENV=production
LOG_LEVEL=info
FRONTEND_URL=*
```

## 🚀 Performance

- **Serverless**: Tự động scale với Vercel
- **In-Memory Storage**: Fast access (sẽ reset khi function restart)
- **Optimized Chunking**: Efficient text processing
- **Rate Limiting**: Prevent abuse
- **Compression**: Gzip compression enabled

## 📈 Scaling Considerations

Hiện tại sử dụng in-memory storage. Để scale production:

1. **Database**: Thêm PostgreSQL/MongoDB cho persistent storage
2. **Vector Database**: Sử dụng Pinecone/Weaviate cho large-scale vector search
3. **Caching**: Redis cho conversation caching
4. **Queue System**: Background processing cho document upload

## 🆘 Troubleshooting

### Common Issues:

1. **API Key Error**: Kiểm tra Vercel environment variables
2. **Timeout**: Tăng maxDuration trong vercel.json
3. **Memory Issues**: Giảm MAX_DOCUMENTS hoặc CHUNK_SIZE
4. **Upload Fails**: Kiểm tra file size và type

### Debug Commands:
```bash
# Local development
npm run dev

# Check logs
vercel logs

# Test health
curl https://your-app.vercel.app/health
```

---

**Built with ❤️ for FTC Team**