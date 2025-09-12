# Hướng dẫn Deploy RAG Chatbot Backend lên Vercel

## 1. Chuẩn bị Environment Variables

### Bước 1: Truy cập Vercel Dashboard
1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn hoặc tạo project mới

### Bước 2: Cấu hình Environment Variables
Trong Vercel Dashboard, vào **Settings** → **Environment Variables** và thêm các biến sau:

#### Required Variables (Bắt buộc):
```
GEMINI_API_KEY=AIzaSyCM4LsYsE6adRq1A5u4ros6yRJpBG7YMSw
```

#### Optional Variables (Tùy chọn):
```
GEMINI_MODEL=gemini-1.5-flash
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
MAX_DOCUMENTS=1000
CHUNK_SIZE=500
CHUNK_OVERLAP=50
MAX_CONTEXT_LENGTH=4000
SIMILARITY_THRESHOLD=0.7
LOG_LEVEL=info
```

### Bước 3: Cấu hình cho các môi trường
- **Production**: Áp dụng cho branch `main` hoặc `master`
- **Preview**: Áp dụng cho các branch khác (optional)
- **Development**: Chỉ dành cho local development

## 2. Deploy qua Vercel CLI

### Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### Login vào Vercel
```bash
vercel login
```

### Deploy lần đầu
```bash
# Trong thư mục dự án
vercel

# Hoặc deploy trực tiếp production
vercel --prod
```

### Deploy các lần sau
```bash
# Deploy preview
vercel

# Deploy production
vercel --prod
```

## 3. Deploy qua Git Integration

### Bước 1: Kết nối Repository
1. Trong Vercel Dashboard, chọn **"New Project"**
2. Import repository từ GitHub/GitLab/Bitbucket
3. Chọn repository chứa code backend

### Bước 2: Cấu hình Build Settings
- **Framework Preset**: Other
- **Root Directory**: `./` (nếu code ở root)
- **Build Command**: `npm run build` (có thể để trống)
- **Output Directory**: `./` (để trống)
- **Install Command**: `npm install`

### Bước 3: Deploy
- Mỗi khi push code lên branch main → auto deploy production
- Push lên branch khác → deploy preview

## 4. Kiểm tra Deployment

### Health Check
Sau khi deploy, kiểm tra endpoint:
```
GET https://your-app.vercel.app/health
```

Response mong muốn:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "RAG Chatbot Backend",
  "environment": {
    "nodeEnv": "production",
    "apiKeyConfigured": true,
    "geminiModel": "gemini-1.5-flash"
  },
  "geminiService": {
    "status": "healthy",
    "apiKeyConfigured": true,
    "model": "gemini-1.5-flash",
    "testResponse": "success"
  }
}
```

### Test Chat API
```bash
curl -X POST https://your-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "useRag": false
  }'
```

## 5. Troubleshooting

### Lỗi API Key
```
Error: GEMINI_API_KEY is required
```
**Giải pháp**: Kiểm tra Environment Variables trong Vercel Dashboard

### Lỗi 401 Unauthorized
```
Error: Invalid or expired API key
```
**Giải pháp**: 
1. Kiểm tra API key có đúng format không (bắt đầu với "AIza")
2. Kiểm tra API key có còn hiệu lực không
3. Redeploy sau khi cập nhật API key

### Lỗi Timeout
```
Error: Request timeout
```
**Giải pháp**: 
1. Kiểm tra network connectivity
2. Gemini API có thể bị rate limit
3. Tăng timeout trong code nếu cần

### Lỗi Memory/Performance
**Giải pháp**:
1. Giảm `MAX_DOCUMENTS`
2. Giảm `CHUNK_SIZE`
3. Upgrade Vercel plan nếu cần

## 6. Monitoring và Logs

### Xem Logs
1. Vào Vercel Dashboard → Project → Functions tab
2. Click vào function để xem logs
3. Hoặc dùng CLI: `vercel logs`

### Monitoring
- Vercel Analytics: Theo dõi performance
- Error tracking: Sentry integration (optional)
- Custom logging: Winston logs

## 7. Security Best Practices

### Environment Variables
- ✅ KHÔNG commit API key vào code
- ✅ Sử dụng Vercel Environment Variables
- ✅ Phân biệt env cho development/production
- ✅ Regularly rotate API keys

### API Security
- ✅ Rate limiting đã được cấu hình
- ✅ CORS policy
- ✅ Input validation
- ✅ Error handling không expose sensitive info

## 8. Custom Domain (Optional)

### Thêm Custom Domain
1. Vào Vercel Dashboard → Project → Settings → Domains
2. Thêm domain của bạn
3. Cấu hình DNS records theo hướng dẫn
4. Cập nhật `FRONTEND_URL` trong Environment Variables

## 9. Scaling và Performance

### Vercel Limits
- Function execution: 30 seconds (đã cấu hình)
- Memory: 1024MB (default)
- Concurrent executions: Depends on plan

### Optimization Tips
1. Implement caching cho embeddings
2. Sử dụng streaming responses cho long texts
3. Optimize chunk sizes
4. Consider database for persistent storage

## 10. Backup và Recovery

### Code Backup
- Repository trên Git platform
- Multiple branches cho different versions

### Data Backup
- Documents được store in-memory (sẽ mất khi restart)
- Consider external storage cho production:
  - Supabase
  - MongoDB Atlas
  - Redis

## Commands Tóm tắt

```bash
# Setup
npm install -g vercel
vercel login

# Deploy
vercel --prod

# Logs
vercel logs

# Environment variables
vercel env add GEMINI_API_KEY
vercel env ls
```

## Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong Vercel Dashboard
2. Test local trước khi deploy
3. Verify environment variables
4. Check Gemini API status

---

**Lưu ý**: Đây là hệ thống RAG chatbot sử dụng in-memory storage. Trong production environment, nên consider sử dụng persistent storage cho documents và conversation history.