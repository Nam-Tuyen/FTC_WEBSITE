# Hướng dẫn tích hợp Diễn đàn với Google Sheets

## Tổng quan
Hệ thống diễn đàn đã được tích hợp với Google Sheets thông qua Google Apps Script để lưu trữ dữ liệu một cách bền vững.

## Cấu hình API

### BASE URL mới
```
https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec
```

### Cấu trúc Google Sheets
AppScript tự động tạo 4 sheets:
- **Info_user**: Thông tin người dùng (MSSV, password, email, câu hỏi bảo mật)
- **Questions**: Câu hỏi diễn đàn
- **Responses**: Phản hồi cho câu hỏi
- **React**: Thông tin like/unlike

## API Endpoints

### 1. Tạo câu hỏi
```javascript
POST /exec
{
  "function": "createQuestion",
  "body": {
    "title": "Tiêu đề câu hỏi",
    "category": "Thảo luận", // "Hỏi về ngành học", "Hỏi về câu lạc bộ", "Thảo luận"
    "user": "K225123456", // MSSV
    "content": "Nội dung câu hỏi",
    "anonymous": false
  }
}
```

### 2. Lấy danh sách câu hỏi
```javascript
POST /exec
{
  "function": "fetchQuestions",
  "body": {
    "take": 10, // Số lượng câu hỏi (optional)
    "category": "Thảo luận", // Lọc theo danh mục (optional)
    "search": "từ khóa", // Tìm kiếm (optional)
    "includeDeleted": false // Bao gồm câu hỏi đã xóa (optional)
  }
}
```

### 3. Tạo phản hồi
```javascript
POST /exec
{
  "function": "createResponse",
  "body": {
    "user": "K225123456", // MSSV
    "anonymous": false,
    "content": "Nội dung phản hồi",
    "questionId": "question-id"
  }
}
```

### 4. Like/Unlike câu hỏi
```javascript
POST /exec
{
  "function": "toggleLike",
  "body": {
    "questionId": "question-id",
    "mssv": "K225123456",
    "like": 1 // 1 = like, 0 = unlike
  }
}
```

## Mapping Categories

### Frontend → AppScript
- `CLUB` → `"Hỏi về câu lạc bộ"`
- `MAJOR` → `"Hỏi về ngành học"`
- `DISCUSSION` → `"Thảo luận"`

### AppScript → Frontend
- `"Hỏi về câu lạc bộ"` → `CLUB`
- `"Hỏi về ngành học"` → `MAJOR`
- `"Thảo luận"` → `DISCUSSION`

## Cấu trúc dữ liệu

### QuestionItem (Frontend)
```typescript
interface QuestionItem {
  id: string
  title: string
  content: string
  createdAt: number | string
  category: ForumCategory
  studentId?: string
  userId?: string
  likes: number | any[]
  replies?: any[]
  repliesCount?: number
  authorName?: string
}
```

### Response từ AppScript
```typescript
interface AppScriptQuestion {
  id: string
  title: string
  category: string
  user: string // MSSV hoặc "anonymous"
  content: string
  like_count: number
  createdAt: string
  responses: AppScriptResponse[]
}

interface AppScriptResponse {
  id: string
  user: string
  content: string
  questionId: string
  reaction: number
  createdAt: string
}
```

## Tính năng đã cập nhật

### 1. Tạo câu hỏi
- ✅ Mapping categories từ frontend sang AppScript
- ✅ Validation MSSV (format K + 9 số)
- ✅ Hỗ trợ ẩn danh khi không có MSSV
- ✅ Optimistic UI updates

### 2. Hiển thị câu hỏi
- ✅ Mapping dữ liệu từ AppScript sang frontend
- ✅ Hiển thị số lượng like và replies
- ✅ Sorting theo like count và thời gian
- ✅ Filter theo category và search

### 3. Like/Unlike
- ✅ Tích hợp với API toggleLike
- ✅ Optimistic UI updates
- ✅ Hiển thị trạng thái like

### 4. Phản hồi
- ✅ Tích hợp với API createResponse
- ✅ Hiển thị số lượng phản hồi
- ✅ Optimistic UI updates

## Lưu ý quan trọng

1. **MSSV Validation**: Hệ thống yêu cầu MSSV có format `K` + 9 số (ví dụ: K225123456)
2. **Anonymous Mode**: Khi không có MSSV hợp lệ, câu hỏi sẽ được đánh dấu là ẩn danh
3. **Error Handling**: Tất cả API calls đều có error handling và revert optimistic updates
4. **Data Persistence**: Dữ liệu được lưu trữ bền vững trong Google Sheets
5. **Real-time Updates**: Sau mỗi thao tác, hệ thống sẽ refresh dữ liệu từ server

## Test Results

✅ API accessibility test passed
✅ fetchQuestions test passed  
✅ createQuestion test passed
✅ Category mapping working correctly
✅ MSSV validation working correctly
✅ Data persistence confirmed

## Troubleshooting

### Lỗi thường gặp:
1. **MSSV không hợp lệ**: Kiểm tra format `K` + 9 số
2. **API không phản hồi**: Kiểm tra BASE URL và kết nối mạng
3. **Dữ liệu không cập nhật**: Kiểm tra console logs để debug

### Debug:
- Mở Developer Tools → Console để xem logs
- Kiểm tra Network tab để xem API calls
- Verify BASE URL trong `googleSheetApi/sheet.ts`
