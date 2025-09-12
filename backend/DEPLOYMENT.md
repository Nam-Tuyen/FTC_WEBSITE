# 🚀 Hướng dẫn Deploy RAG Chatbot Backend lên Vercel

## 📋 Quick Start

### 1. Chuẩn bị Environment Variables
Trong Vercel Dashboard → Settings → Environment Variables:

```
GEMINI_API_KEY = AIzaSyCM4LsYsE6adRq1A5u4ros6yRJpBG7YMSw
NODE_ENV = production
GEMINI_MODEL = gemini-1.5-flash
```

### 2. Deploy Commands
```bash
cd backend
npm install
vercel --prod
```

### 3. Test Deployment
```bash
curl https://your-backend.vercel.app/health
```

## 🔧 Chi tiết Deploy

### Option A: Vercel CLI (Khuyến nghị)
```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy từ thư mục backend
cd backend
vercel

# Production deploy
vercel --prod
```

### Option B: Git Integration
1. Push code lên GitHub
2. Vercel Dashboard → New Project
3. Import repository  
4. **QUAN TRỌNG**: Set Root Directory = `backend`
5. Framework: Other
6. Build Command: `npm run build`
7. Deploy

## ⚙️ Vercel Configuration

File `vercel.json` đã được tối ưu:
```json
{
  "version": 2,
  "name": "rag-chatbot-backend",
  "functions": {
    "api/*.js": {
      "maxDuration": 30
    }
  }
}
```

**Không sử dụng `builds` property** để tránh conflict.

## 🔐 Environment Variables Setup

### Required Variables:
```bash
GEMINI_API_KEY=AIzaSyCM4LsYsE6adRq1A5u4ros6yRJpBG7YMSw
```

### Optional Variables:
```bash
GEMINI_MODEL=gemini-1.5-flash
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
MAX_DOCUMENTS=1000
CHUNK_SIZE=500
CHUNK_OVERLAP=50
MAX_CONTEXT_LENGTH=4000
SIMILARITY_THRESHOLD=0.7
LOG_LEVEL=info
```

### Cách set trong Vercel:
1. Vào Project Dashboard
2. Settings → Environment Variables
3. Add Variable:
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyCM4LsYsE6adRq1A5u4ros6yRJpBG7YMSw`
   - Environment: Production
4. Save

## ✅ Verification Steps

### 1. Health Check
```bash
curl https://your-backend.vercel.app/health
```

Expected response:
```json
{
  "status": "OK",
  "service": "RAG Chatbot Backend",
  "gemini": {
    "status": "healthy",
    "apiKeyConfigured": true,
    "model": "gemini-1.5-flash"
  },
  "version": "1.0.0"
}
```

### 2. Chat Test
```bash
curl -X POST https://your-backend.vercel.app/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "useRag": false
  }'
```

### 3. Document Upload Test
```bash
curl -X POST https://your-backend.vercel.app/documents/upload \
  -F "documents=@test.txt"
```

## 🐛 Troubleshooting

### Common Errors:

#### 1. "GEMINI_API_KEY is required"
**Cause**: Environment variable không được set
**Fix**: 
- Kiểm tra Vercel Dashboard → Settings → Environment Variables
- Đảm bảo API key đúng format (bắt đầu với "AIza")
- Redeploy sau khi set env var

#### 2. "The functions property cannot be used in conjunction with the builds property"
**Cause**: vercel.json có conflict
**Fix**: ✅ Đã fix - chỉ sử dụng `functions` property

#### 3. "ERR_PNPM_OUTDATED_LOCKFILE"
**Cause**: pnpm-lock.yaml không sync với package.json
**Fix**: 
```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "Update lockfile"
```

#### 4. Function Timeout
**Cause**: Gemini API calls quá lâu
**Fix**: ✅ Đã set `maxDuration: 30` trong vercel.json

#### 5. Memory Issues
**Cause**: Quá nhiều documents trong memory
**Fix**: Giảm `MAX_DOCUMENTS` trong env vars

### Debug Commands:
```bash
# Xem logs
vercel logs

# Local development
npm run dev

# Test với curl
curl -v https://your-app.vercel.app/health
```

## 📊 Monitoring

### Vercel Dashboard:
1. Functions tab → View function logs
2. Analytics → Performance metrics
3. Settings → Environment Variables

### Custom Monitoring:
- Health endpoint: `/health`
- Error logging: Winston
- Performance: Request timing

## 🔄 CI/CD Pipeline

### Auto Deploy:
1. Push to `main` branch → Production deploy
2. Push to other branches → Preview deploy
3. Environment variables → Inherited from settings

### Manual Deploy:
```bash
vercel --prod
```

## 🎯 Production Checklist

- ✅ Environment variables set trong Vercel
- ✅ API key không hardcode trong code
- ✅ vercel.json không có conflicts
- ✅ Dependencies đã install
- ✅ Health check returns 200
- ✅ Chat endpoint hoạt động
- ✅ Error handling implemented
- ✅ Rate limiting enabled
- ✅ Logging configured

## 📞 Support

Nếu gặp vấn đề:
1. Check Vercel Dashboard logs
2. Verify environment variables
3. Test health endpoint
4. Check Gemini API status
5. Review error messages

---

**🎉 Chúc mừng! RAG Chatbot Backend đã sẵn sàng hoạt động!**