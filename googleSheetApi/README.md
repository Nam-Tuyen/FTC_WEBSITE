# Google Sheets API Client

Client library for connecting to Google Apps Script Web App backend.

## Backend Architecture

### Google Sheets Structure

1. **Info_user**: User authentication and profiles
   - Columns: `id | mssv | password | full_name | email | isDeleted | sec_q1 | sec_a1 | sec_q2 | sec_a2 | sec_q3 | sec_a3`

2. **Questions**: Forum questions
   - Columns: `id | title | category | user | content | like_count | createdAt | isDeleted | anonymous`

3. **Responses**: Replies to questions
   - Columns: `id | user | anonymous | content | questionId | reaction | createdAt | isDeleted`

4. **React**: Like tracking
   - Columns: `id | mssv | like`
   - `id` = questionId

### Categories

Only these categories are allowed:
- "Hỏi về ngành học"
- "Hỏi về câu lạc bộ"
- "Thảo luận"

### MSSV Format

Valid MSSV format: `K` + 9 digits (e.g., `K225123456`)

## API Functions

### Authentication

#### `registerUser(payload)`
Register a new user with security questions.

**Payload:**
```typescript
{
  mssv: string          // K+9 digits
  password: string      // Will be hashed with SHA-256
  full_name: string
  email: string
  sec_q1: string        // Security question 1
  sec_a1: string        // Answer 1 (will be hashed, lowercased)
  sec_q2: string        // Security question 2
  sec_a2: string        // Answer 2
  sec_q3: string        // Security question 3
  sec_a3: string        // Answer 3
}
```

**Returns:**
```typescript
{ userId: string, mssv: string }
```

#### `login(payload)`
Login with MSSV and password.

**Payload:**
```typescript
{
  mssv: string
  password: string
}
```

**Returns:**
```typescript
{
  userId: string
  mssv: string
  full_name: string
  email: string
}
```

#### `forgotPasswordGetQuestions(payload)`
Get security questions for password reset.

**Payload:**
```typescript
{
  mssv: string
}
```

**Returns:**
```typescript
{
  mssv: string
  questions: string[]  // Array of 3 questions
}
```

#### `forgotPasswordReset(payload)`
Reset password by answering security questions.

**Payload:**
```typescript
{
  mssv: string
  answers: {
    a1: string
    a2: string
    a3: string
  }
  new_password: string
}
```

### Forum

#### `createQuestion(payload)`
Create a new question.

**Payload:**
```typescript
{
  title: string
  category: Category       // One of allowed categories
  user: string            // MSSV (K+9 digits)
  content: string
  anonymous?: boolean     // If true, displayed as 'anonymous'
}
```

**Returns:**
```typescript
{
  id: string
  createdAt: string | Date
}
```

#### `createResponse(payload)`
Reply to a question.

**Payload:**
```typescript
{
  user: string           // MSSV
  anonymous?: boolean
  content: string
  questionId: string
}
```

**Returns:**
```typescript
{
  id: string
  createdAt: string | Date
}
```

#### `toggleLike(payload)`
Like or unlike a question.

**Payload:**
```typescript
{
  questionId: string
  mssv: string
  like: 0 | 1           // 1 = like, 0 = unlike
}
```

**Returns:**
```typescript
{
  like_count: number    // Updated total like count
}
```

#### `deleteQuestion(payload)`
Soft delete a question and all its responses.

**Payload:**
```typescript
{
  questionId: string
  mssv: string         // Must be question owner
}
```

#### `deleteResponse(payload)`
Soft delete a response.

**Payload:**
```typescript
{
  responseId: string
  mssv: string        // Must be response owner
}
```

#### `fetchQuestions(payload)`
Fetch questions with filters.

**Payload:**
```typescript
{
  take?: number              // Limit results
  category?: Category        // Filter by category
  search?: string           // Search in title/content
  includeDeleted?: boolean  // Include deleted (default: false)
}
```

**Returns:**
```typescript
{
  items: QuestionItem[]     // Sorted by like_count desc, then createdAt desc
}
```

**QuestionItem structure:**
```typescript
{
  id: string
  title: string
  category: Category
  user: string              // 'anonymous' or MSSV
  content: string
  like_count: number
  createdAt: string | Date
  responses: ResponseItem[] // Sorted by reaction desc, then createdAt desc
}
```

**ResponseItem structure:**
```typescript
{
  id: string
  user: string             // 'anonymous' or MSSV
  content: string
  questionId: string
  reaction: number
  createdAt: string | Date
}
```

## Response Format

All API calls return a standardized response:

```typescript
{
  ok: boolean           // true if success, false if error
  message: string       // Vietnamese message for user
  data?: T             // Payload (varies by endpoint)
  timestamp: string    // ISO 8601 timestamp
  error?: string       // Error details (when ok=false)
}
```

## Error Handling

The client handles two types of errors:

1. **Network errors**: Connection failures, timeout
2. **Parse errors**: Invalid JSON response

Both return a standardized error response:
```typescript
{
  ok: false,
  message: "Lỗi: ...",
  error: "...",
  timestamp: "..."
}
```

## Usage Example

```typescript
import { login, fetchQuestions, createQuestion } from '@/googleSheetApi/sheet'

// Login
const loginResp = await login({ 
  mssv: 'K225123456', 
  password: 'mypassword' 
})

if (loginResp.ok) {
  console.log('Logged in:', loginResp.data)
}

// Fetch questions
const questionsResp = await fetchQuestions({ 
  category: 'Hỏi về ngành học',
  take: 10 
})

if (questionsResp.ok) {
  console.log('Questions:', questionsResp.data.items)
}

// Create question
const createResp = await createQuestion({
  title: 'Câu hỏi về AI',
  category: 'Hỏi về ngành học',
  user: 'K225123456',
  content: 'AI có những ứng dụng gì?',
  anonymous: false
})

if (createResp.ok) {
  console.log('Created:', createResp.data)
}
```

## Security Notes

- Passwords are hashed with SHA-256 on server
- Security answers are normalized (trimmed, lowercased) and hashed
- Soft deletes: Items are marked `isDeleted=true`, not physically removed
- Owner validation: Only owners can delete their questions/responses
- MSSV validation: All user identifiers must match K+9 digits format

