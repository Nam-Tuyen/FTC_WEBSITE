# 🔄 Chatbot Refactoring Guide - Consolidate Everything

## 🎯 Mục tiêu
Gom toàn bộ logic chat vào duy nhất thư mục `app/chatbot` để:
- ✅ Dễ bảo trì và phát triển
- ✅ Không tản mát file rải rác
- ✅ Cấu trúc rõ ràng, một nhìn là hiểu
- ✅ Tránh duplicate code và conflict

## 📁 Cấu trúc thư mục chuẩn

```
app/
├── chatbot/                          # 🎯 THƯ MỤC CHÍNH CHO CHAT
│   ├── page.tsx                      # Trang UI chính (đã gộp)
│   ├── _components/                  # UI components riêng cho chat
│   │   ├── MessageList.tsx
│   │   ├── ModeSelector.tsx
│   │   ├── InputBar.tsx
│   │   ├── SuggestedQuestions.tsx
│   │   └── ChatBanner.tsx
│   ├── _lib/                         # Logic, services, utilities
│   │   ├── api.ts                    # Gọi API /api/chat/gemini
│   │   ├── faq.ts                    # FAQ matching logic
│   │   ├── prompts.ts                # System prompts
│   │   ├── types.ts                  # TypeScript types
│   │   ├── constants.ts              # Constants & config
│   │   └── utils.ts                  # Helper functions
│   └── _state/                       # State management (optional)
│       └── store.ts                  # Zustand/Context store
├── api/
│   └── chat/
│       └── gemini/
│           └── route.ts              # 🎯 ROUTE DUY NHẤT
└── public/
    └── knowledge_base/
        └── faq.json                  # FAQ data (optional)
```

## 🚫 Quy tắc bắt buộc

### ❌ KHÔNG ĐƯỢC
- Tạo file chat ngoài `app/chatbot/*`
- Tạo route chat khác ngoài `/api/chat/gemini`
- Import từ `@/lib/chat/*` hoặc `@/components/chat/*`
- Duplicate logic giữa FE và BE

### ✅ ĐƯỢC PHÉP
- Import từ `@/components/ui/*` (shared UI)
- Import từ `@/lib/utils` (nếu thực sự shared)
- Tạo file shared toàn site ở `@/lib/*`

## 🔧 Các bước refactor

### Bước 1: Tạo cấu trúc thư mục
```bash
# Tạo thư mục cần thiết
mkdir -p app/chatbot/_components
mkdir -p app/chatbot/_lib
mkdir -p app/chatbot/_state
mkdir -p public/knowledge_base
```

### Bước 2: Di chuyển file rải rác
```bash
# Di chuyển components chat
git mv components/chat/MessageList.tsx app/chatbot/_components/ 2>/dev/null || true
git mv components/chat/ModeSelector.tsx app/chatbot/_components/ 2>/dev/null || true
git mv components/chat/InputBar.tsx app/chatbot/_components/ 2>/dev/null || true
git mv components/chat/Suggested*.tsx app/chatbot/_components/ 2>/dev/null || true

# Di chuyển logic chat
git mv lib/chat/api.ts app/chatbot/_lib/ 2>/dev/null || true
git mv lib/chat/faq.ts app/chatbot/_lib/ 2>/dev/null || true
git mv lib/chat/prompts.ts app/chatbot/_lib/ 2>/dev/null || true
git mv lib/chat/types.ts app/chatbot/_lib/ 2>/dev/null || true
git mv lib/chat/constants.ts app/chatbot/_lib/ 2>/dev/null || true
git mv lib/chat/utils.ts app/chatbot/_lib/ 2>/dev/null || true

# Di chuyển state management
git mv lib/chat/store.ts app/chatbot/_state/ 2>/dev/null || true
```

### Bước 3: Xóa route thừa
```bash
# Xóa các route chat không cần thiết
git rm -rf configuration_chatbot/app/api/chat 2>/dev/null || true
git rm -f app/api/chat/route.ts 2>/dev/null || true
find app -type f -path "*/api/chat/*" ! -path "*/api/chat/gemini/*" -exec git rm -f {} + 2>/dev/null || true
```

### Bước 4: Cập nhật imports
```typescript
// Trong app/chatbot/page.tsx và các components
// ❌ CŨ
import { askServer } from "@/lib/chat/api";
import { faqMatch } from "@/lib/chat/faq";
import { ChatMode } from "@/lib/chat/types";

// ✅ MỚI
import { askServer } from "./_lib/api";
import { faqMatch } from "./_lib/faq";
import { ChatMode } from "./_lib/types";
```

## 📝 File templates

### `app/chatbot/_lib/api.ts`
```typescript
export interface ChatRequest {
  mode: "club" | "industry";
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface ChatResponse {
  reply?: string;
  response?: string;
  text?: string;
  answer?: string;
  mode?: string;
  source?: string;
  faq_id?: string;
}

export async function askServer({
  mode,
  question,
  history
}: {
  mode: "club" | "industry";
  question: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}): Promise<ChatResponse> {
  const res = await fetch("/api/chat/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode,
      message: question,
      messages: [...(history || []), { role: "user", content: question }],
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json().catch(() => ({}));
  return data;
}
```

### `app/chatbot/_lib/faq.ts`
```typescript
export interface FAQItem {
  id: string;
  canonical_question: string;
  answer: string;
}

export const FAQ_DATASET: { faq: FAQItem[] } = {
  faq: [
    {
      id: "faq-ban-lam-gi",
      canonical_question: "các ban trong câu lạc bộ làm gì",
      answer: "Ban Học thuật: Thiết kế nội dung cho workshop và talkshow..."
    },
    // ... 6 câu còn lại
  ]
};

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function faqMatchOrNull(userQuestion: string): FAQItem | null {
  const normalizedQuestion = normalizeText(userQuestion);
  
  for (const item of FAQ_DATASET.faq) {
    const normalizedCanonical = normalizeText(item.canonical_question);
    
    // Direct match
    if (normalizedQuestion === normalizedCanonical) {
      return item;
    }
    
    // Contains match
    if (normalizedQuestion.includes(normalizedCanonical) || 
        normalizedCanonical.includes(normalizedQuestion)) {
      return item;
    }
    
    // Keyword match (2+ keywords)
    const questionWords = normalizedQuestion.split(' ').filter(w => w.length > 2);
    const canonicalWords = normalizedCanonical.split(' ').filter(w => w.length > 2);
    const keywordMatches = questionWords.filter(w => canonicalWords.includes(w)).length;
    
    if (keywordMatches >= 2) {
      return item;
    }
  }
  
  return null;
}
```

### `app/chatbot/_lib/prompts.ts`
```typescript
export const CLUB_MODE_SYSTEM_PROMPT = `Bạn là trợ lý FTC. Nhiệm vụ:
1) Nếu câu hỏi trùng/giống 1 trong 7 "Câu hỏi gợi ý", phải trả nguyên văn "answer" tương ứng.
2) Nếu không khớp, chuyển sang chế độ cố vấn tân sinh viên và trả lời tự nhiên, mạch lạc.
3) Chỉ chào ở lượt trả lời đầu tiên; các lượt sau trả lời thẳng trọng tâm.`;

export const GEMINI_ADVISOR_ROLE = `Bạn là cố vấn học tập dành cho tân sinh viên. Hãy giới thiệu ngắn gọn, thân thiện và dễ hiểu về Câu lạc bộ Công nghệ tài chính FTC cùng định hướng ngành học liên quan...`;

export const INDUSTRY_MODE_SYSTEM_PROMPT = `Bạn là trợ lý học thuật. Tóm tắt ngắn gọn, chính xác, dễ hiểu về chủ đề mà người dùng hỏi liên quan tới ngành FinTech và các lĩnh vực sát cạnh...`;
```

### `app/chatbot/_lib/types.ts`
```typescript
export type ChatMode = "club" | "industry";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: ChatMode;
  source?: "faq" | "gemini" | "google";
  timestamp?: Date;
}

export interface ChatRequest {
  mode: ChatMode;
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  reply?: string;
  response?: string;
  text?: string;
  answer?: string;
  mode?: string;
  source?: string;
  faq_id?: string;
  search_results?: any[];
  sources?: string;
}
```

### `app/chatbot/_lib/constants.ts`
```typescript
export const FTC_FANPAGE = "https://www.facebook.com/clbfintechuel";
export const WEBSITE = process.env.NEXT_PUBLIC_FTC_WEBSITE || "";

export const SUGGESTED_QUESTIONS: string[] = [
  "Câu lạc bộ có những hoạt động gì?",
  "Làm thế nào để tham gia câu lạc bộ?",
  "Các ban trong câu lạc bộ làm gì?",
  "Thời gian sinh hoạt diễn ra khi nào?",
  "Cần kỹ năng gì để ứng tuyển?",
  "Câu lạc bộ được thành lập khi nào?",
  "Câu lạc bộ có những thành tích gì?",
];

export const CHAT_MODES = [
  {
    mode: "club" as const,
    label: "Hỏi về câu lạc bộ",
    description: "Ưu tiên trả lời theo FAQ cố định của FTC",
    color: "bg-blue-600",
  },
  {
    mode: "industry" as const,
    label: "Hỏi về ngành",
    description: "Trả lời dựa trên kiến thức từ Google",
    color: "bg-green-600",
  },
];
```

### `app/chatbot/_lib/utils.ts`
```typescript
export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function formatMessageContent(text: string): string {
  if (!text) return "";
  const escaped = escapeHtml(text);
  
  let out = escaped
    .replace(/__(.+?)__/g, "<u>$1</u>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">$1</a>');

  // Handle line breaks and lists
  const lines = out.split(/\r?\n/);
  let inList = false;
  let res = "";
  
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("* ")) {
      if (!inList) {
        res += '<ul>';
        inList = true;
      }
      res += `<li>${line.slice(2)}</li>`;
    } else {
      if (inList) {
        res += "</ul>";
        inList = false;
      }
      if (line === "") {
        res += "<br/>";
      } else {
        res += `<p class="mb-1">${line}</p>`;
      }
    }
  }
  
  if (inList) res += "</ul>";
  return res;
}
```

## 🔍 Script kiểm tra CI

### `scripts/check-chat-structure.sh`
```bash
#!/bin/bash
# Script kiểm tra cấu trúc chat

echo "🔍 Checking chat file structure..."

# Kiểm tra file chat ngoài app/chatbot
if find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
   grep -v "app/chatbot" | \
   grep -v "node_modules" | \
   grep -v ".next" | \
   xargs grep -l "askServer\|CHAT_MODES\|SUGGESTED_QUESTIONS\|GEMINI_ADVISOR_ROLE\|CLUB_MODE_SYSTEM_PROMPT" 2>/dev/null; then
  echo "❌ Chat code found outside app/chatbot. Please move into app/chatbot/_lib or _components."
  exit 1
fi

# Kiểm tra route chat ngoài /api/chat/gemini
if find app -name "route.ts" -path "*/api/chat/*" ! -path "*/api/chat/gemini/*" 2>/dev/null; then
  echo "❌ Chat routes found outside /api/chat/gemini. Please consolidate."
  exit 1
fi

echo "✅ Chat structure is clean!"
```

### Cập nhật `package.json`
```json
{
  "scripts": {
    "check-chat": "bash scripts/check-chat-structure.sh",
    "prebuild": "npm run check-chat"
  }
}
```

## 🎯 Acceptance Checklist

- [ ] Không còn file chat ngoài `app/chatbot/*`
- [ ] Không còn route chat nào ngoài `/api/chat/gemini/route.ts`
- [ ] Tất cả import của page/chat components trỏ về `./_lib/*` hoặc `./_components/*`
- [ ] FE chỉ gọi `askServer()` trong `_lib/api.ts`
- [ ] Build & deploy chạy, UI `/chatbot` hoạt động đầy đủ
- [ ] Script CI không báo lỗi cấu trúc
- [ ] Không duplicate logic giữa FE và BE

## 🚀 Lợi ích sau refactor

1. **Dễ bảo trì**: Tất cả logic chat ở một chỗ
2. **Không conflict**: Không còn file rải rác
3. **Performance**: Import ngắn gọn, tree-shaking tốt
4. **Scalable**: Dễ thêm tính năng mới
5. **Clean**: Code structure rõ ràng, dễ hiểu

## 📞 Hỗ trợ

Nếu gặp vấn đề trong quá trình refactor:
1. Chạy `npm run check-chat` để kiểm tra
2. Kiểm tra imports trong `app/chatbot/page.tsx`
3. Đảm bảo API route `/api/chat/gemini` hoạt động
4. Test UI tại `/chatbot` sau khi refactor

---

**Lưu ý**: Refactor này sẽ làm sạch toàn bộ codebase chat, tạo foundation vững chắc cho phát triển tương lai! 🎯
