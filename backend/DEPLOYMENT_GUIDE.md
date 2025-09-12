# 🚀 Hướng dẫn Deploy RAG Chatbot Backend lên Vercel

## 📋 Tóm tắt vấn đề đã fix

Các lỗi Vercel thường gặp đã được giải quyết:
- ✅ **Missing public directory** - Đã cấu hình đúng cho Node.js backend
- ✅ **Missing build script** - Đã thêm script phù hợp
- ✅ **Invalid vercel.json** - Đã cấu hình đúng cho serverless functions
- ✅ **Environment variables** - Đã setup secure API key handling

## 🛠️ Chuẩn bị trước khi deploy

### 1. Cấu trúc thư mục
Đảm bảo bạn có cấu trúc sau trong thư mục `backend/`:
```
backend/
├── package.json          ✅ Đã có build script
├── vercel.json           ✅ Đã cấu hình cho Node.js
├── index.js              ✅ Entry point
├── .env.example          ✅ Template
├── .gitignore            ✅ Bảo vệ sensitive files
├── routes/
├── services/
├── utils/
└── middleware/
```

### 2. Kiểm tra package.json
```json
{
  "scripts": {
    "start": "node index.js",
    "build": "echo 'No build step required for Node.js backend'",
    "vercel-build": "echo 'Backend ready for deployment'"
  }
}
```

## 🔧 Các bước deploy

### Bước 1: Chuẩn bị môi trường
```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Test local
npm run dev
```

### Bước 2: Deploy lên Vercel

#### Option A: Vercel CLI (Khuyến nghị)
```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy từ thư mục backend
cd backend
vercel

# Hoặc deploy production trực tiếp
vercel --prod
```

#### Option B: Git Integration
1. Push code lên GitHub/GitLab
2. Vào Vercel Dashboard → New Project
3. Import repository
4. **QUAN TRỌNG**: Set Root Directory = `backend`
5. Framework Preset: Other
6. Build Command: `npm run build`
7. Output Directory: (để trống)

### Bước 3: Cấu hình Environment Variables
Trong Vercel Dashboard → Settings → Environment Variables:

**Required:**
```
GEMINI_API_KEY = AIzaSyCM4LsYsE6adRq1A5u4ros6yRJpBG7YMSw
```

**Optional:**
```
NODE_ENV = production
GEMINI_MODEL = gemini-1.5-flash
FRONTEND_URL = https://your-frontend-domain.com
MAX_DOCUMENTS = 1000
LOG_LEVEL = info
```

## ✅ Kiểm tra deployment

### 1. Health Check
```bash
curl https://your-backend.vercel.app/health
```

Kết quả mong muốn:
```json
{
  "status": "OK",
  "service": "RAG Chatbot Backend",
  "geminiService": {
    "status": "healthy",
    "apiKeyConfigured": true
  }
}
```

### 2. Test API
```bash
# Test chat endpoint
curl -X POST https://your-backend.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "useRag": false
  }'
```

## 🔍 Troubleshooting các lỗi thường gặp

### 1. Missing public directory
**Lỗi:** `The build step will result in an error if the output directory is missing`
**Giải pháp:** ✅ Đã fix bằng cách cấu hình đúng `vercel.json` cho Node.js backend

### 2. Missing build script  
**Lỗi:** `Expected to provide a build script`
**Giải pháp:** ✅ Đã thêm build script trong `package.json`

### 3. Invalid vercel.json
**Lỗi:** Các lỗi cấu hình
**Giải pháp:** ✅ Đã cấu hình đúng với `@vercel/node` builder

### 4. API Key errors
**Lỗi:** `GEMINI_API_KEY is required`
**Giải pháp:** 
1. Kiểm tra Environment Variables trong Vercel Dashboard
2. Đảm bảo API key đúng format (bắt đầu với "AIza")
3. Redeploy sau khi cập nhật

### 5. Function timeout
**Lỗi:** Request timeout
**Giải pháp:** ✅ Đã set `maxDuration: 30` trong vercel.json

## 📊 Monitoring

### Xem logs
```bash
# Vercel CLI
vercel logs

# Hoặc vào Vercel Dashboard → Functions tab
```

### Performance monitoring
- Vercel Analytics tự động track
- Winston logs cho detailed debugging
- Health endpoint cho uptime monitoring

## 🔒 Security checklist

- ✅ API key không được commit vào code
- ✅ Environment variables được set qua Vercel Dashboard
- ✅ Rate limiting enabled
- ✅ CORS configured properly
- ✅ Input validation implemented
- ✅ Error messages không expose sensitive info

## 📝 Next steps sau khi deploy

1. **Test thoroughly** - Kiểm tra tất cả endpoints
2. **Setup monitoring** - Theo dõi performance và errors
3. **Configure custom domain** (optional)
4. **Setup CI/CD** - Auto deploy từ Git
5. **Scale planning** - Monitor usage và upgrade plan nếu cần

## 🆘 Support

Nếu vẫn gặp lỗi:
1. Kiểm tra Vercel Dashboard → Functions → View logs
2. Verify environment variables
3. Test local trước khi deploy
4. Check Gemini API quota và status

---

**🎉 Chúc mừng! Backend RAG chatbot của bạn đã sẵn sàng hoạt động trên Vercel!**