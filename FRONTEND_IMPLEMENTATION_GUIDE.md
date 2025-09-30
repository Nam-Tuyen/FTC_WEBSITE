# Hướng dẫn triển khai Frontend - FTC Forum

## Tổng quan
Frontend đã được xây dựng hoàn chỉnh theo đúng API Apps Script với các tính năng:
- Authentication (Đăng ký, đăng nhập, quên mật khẩu)
- Forum (Tạo câu hỏi, phản hồi, like/unlike, xóa)
- UI/UX hiện đại với Tailwind CSS
- Validation với Zod
- State management với React Context

## Cấu trúc thư mục

```
app/
├── auth/
│   ├── register/page.tsx      # Đăng ký tài khoản
│   ├── login/page.tsx         # Đăng nhập
│   └── forgot/page.tsx        # Quên mật khẩu (3 bước)
├── account/
│   └── profile/page.tsx       # Thông tin cá nhân
├── admin/
│   └── page.tsx               # Trang quản trị
├── ask/
│   └── page.tsx               # Tạo câu hỏi
├── q/
│   └── [id]/page.tsx          # Chi tiết câu hỏi
├── page.tsx                   # Trang chủ (danh sách câu hỏi)
└── layout.tsx                 # Layout chính

components/
├── forum/
│   ├── QuestionCard.tsx       # Card hiển thị câu hỏi
│   ├── QuestionList.tsx       # Danh sách câu hỏi
│   ├── QuestionForm.tsx       # Form tạo câu hỏi
│   ├── ResponseItem.tsx       # Item phản hồi
│   └── ResponseForm.tsx       # Form gửi phản hồi
└── ui/
    ├── Button.tsx             # Component button
    ├── Input.tsx              # Component input
    ├── Textarea.tsx           # Component textarea
    ├── Select.tsx             # Component select
    └── Spinner.tsx            # Component loading

contexts/
├── AuthContext.tsx            # Quản lý authentication
└── ToastContext.tsx           # Quản lý thông báo

lib/
├── api-client.ts              # API client cho Apps Script
└── validation.ts              # Validation schemas với Zod

types/
└── api.ts                     # TypeScript types
```

## Tính năng đã triển khai

### A) Authentication
- ✅ **Đăng ký**: Form đầy đủ với validation MSSV, email, câu hỏi bảo mật
- ✅ **Đăng nhập**: Form đơn giản với MSSV và mật khẩu
- ✅ **Quên mật khẩu**: 3 bước (MSSV → Câu hỏi → Đặt lại mật khẩu)
- ✅ **State management**: AuthContext với localStorage persistence

### B) Forum Features
- ✅ **Trang chủ**: Danh sách câu hỏi với search, filter, sort
- ✅ **Tạo câu hỏi**: Form với validation, hỗ trợ ẩn danh
- ✅ **Chi tiết câu hỏi**: Hiển thị đầy đủ, like/unlike, phản hồi
- ✅ **Phản hồi**: Gửi phản hồi, xóa phản hồi (chủ sở hữu)
- ✅ **Like/Unlike**: Tích hợp API, optimistic updates
- ✅ **Xóa mềm**: Xóa câu hỏi và phản hồi (chủ sở hữu)

### C) UI/UX
- ✅ **Responsive**: Mobile-first design với Tailwind CSS
- ✅ **Loading states**: Spinner và skeleton loading
- ✅ **Error handling**: Toast notifications cho mọi thao tác
- ✅ **Form validation**: Real-time validation với Zod
- ✅ **Accessibility**: Proper ARIA labels và keyboard navigation

## API Integration

### Base URL
```typescript
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec';
```

### API Calls
Tất cả API calls đều được wrap trong `api-client.ts`:
- `registerUser()` - Đăng ký
- `login()` - Đăng nhập
- `forgotPasswordGetQuestions()` - Lấy câu hỏi bảo mật
- `forgotPasswordReset()` - Đặt lại mật khẩu
- `createQuestion()` - Tạo câu hỏi
- `fetchQuestions()` - Lấy danh sách câu hỏi
- `createResponse()` - Tạo phản hồi
- `toggleLike()` - Like/unlike
- `deleteQuestion()` - Xóa câu hỏi
- `deleteResponse()` - Xóa phản hồi

## Validation Rules

### MSSV
- Format: `K` + 9 số (ví dụ: K225123456)
- Regex: `/^K\d{9}$/i`

### Categories
Chỉ 3 giá trị được phép:
- "Hỏi về ngành học"
- "Hỏi về câu lạc bộ" 
- "Thảo luận"

### Form Validation
- **Đăng ký**: MSSV, password (min 6), full_name (min 2), email, 3 câu hỏi/đáp án
- **Đăng nhập**: MSSV, password
- **Tạo câu hỏi**: title (min 5), category, content (min 10)
- **Phản hồi**: content (min 1)

## State Management

### AuthContext
```typescript
interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### ToastContext
```typescript
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}
```

## Cách chạy

1. **Cài đặt dependencies**:
```bash
npm install
```

2. **Chạy development server**:
```bash
npm run dev
```

3. **Truy cập**: http://localhost:3000

## Testing

### Manual Testing Checklist
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập với tài khoản đã tạo
- [ ] Quên mật khẩu (3 bước)
- [ ] Tạo câu hỏi mới
- [ ] Tìm kiếm câu hỏi
- [ ] Filter theo category
- [ ] Like/unlike câu hỏi
- [ ] Gửi phản hồi
- [ ] Xóa câu hỏi/phản hồi (chủ sở hữu)
- [ ] Responsive trên mobile

### API Testing
```bash
# Test API trực tiếp
curl -X POST https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec \
  -H "Content-Type: application/json" \
  -d '{"function":"fetchQuestions","body":{}}'
```

## Troubleshooting

### Lỗi thường gặp
1. **MSSV không hợp lệ**: Kiểm tra format K + 9 số
2. **API không phản hồi**: Kiểm tra BASE URL và kết nối mạng
3. **Validation errors**: Kiểm tra console logs
4. **Authentication issues**: Kiểm tra localStorage

### Debug
- Mở Developer Tools → Console
- Kiểm tra Network tab cho API calls
- Verify AuthContext state trong React DevTools

## Production Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec
```

### Build
```bash
npm run build
npm start
```

## Tính năng nâng cao (Future)

- [ ] Real-time updates với WebSocket
- [ ] Push notifications
- [ ] File upload cho câu hỏi/phản hồi
- [ ] Advanced search với filters
- [ ] User profiles với avatar
- [ ] Moderation tools cho admin
- [ ] Analytics dashboard
- [ ] Mobile app với React Native

## Kết luận

Frontend đã được triển khai hoàn chỉnh theo đúng đặc tả Apps Script với:
- ✅ Tất cả tính năng authentication
- ✅ Tất cả tính năng forum
- ✅ UI/UX hiện đại và responsive
- ✅ Validation và error handling đầy đủ
- ✅ State management và persistence
- ✅ TypeScript types đầy đủ
- ✅ Code structure rõ ràng và maintainable

Ứng dụng sẵn sàng để deploy và sử dụng trong production.
