# 🤖 Hướng dẫn Dual-Mode Chatbot Implementation

## Tổng quan
Hệ thống chatbot với 2 chế độ hoạt động:
- **Chế độ 1**: "Hỏi về câu lạc bộ" - FAQ matching + Gemini fallback
- **Chế độ 2**: "Hỏi về ngành" - Google Search + AI summarization

## 🎯 Kiến trúc tổng thể

```
User Question → Mode Selection → Router → Processing → Response
     ↓              ↓            ↓         ↓          ↓
   "FTC là gì?"   "club"    Club Mode   FAQ Match   Predefined
   "Blockchain?"  "industry" Industry   Google API  AI Summary
```

## 1️⃣ UI/State Management

### Frontend Mode Selection
```typescript
// app/chatbot/chat/page.tsx
interface ChatMode {
  mode: "club" | "industry";
  label: string;
  description: string;
  icon: React.ComponentType;
}

const CHAT_MODES: ChatMode[] = [
  {
    mode: "club",
    label: "Hỏi về câu lạc bộ",
    description: "Thông tin về FTC, hoạt động, cách tham gia",
    icon: Users
  },
  {
    mode: "industry", 
    label: "Hỏi về ngành",
    description: "Kiến thức FinTech, blockchain, ngân hàng số",
    icon: BookOpen
  }
];

// State management
const [selectedMode, setSelectedMode] = useState<"club" | "industry">("club");
const [messages, setMessages] = useState<Message[]>([]);

// Mode selector component
const ModeSelector = () => (
  <div className="flex gap-2 mb-4">
    {CHAT_MODES.map((mode) => (
      <Button
        key={mode.mode}
        variant={selectedMode === mode.mode ? "default" : "outline"}
        onClick={() => setSelectedMode(mode.mode)}
        className="flex items-center gap-2"
      >
        <mode.icon className="h-4 w-4" />
        {mode.label}
      </Button>
    ))}
  </div>
);
```

### Message Payload Structure
```typescript
interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  mode: "club" | "industry";
  source?: "faq" | "gemini" | "google";
}

// API payload
interface ChatRequest {
  mode: "club" | "industry";
  message: string;
  history?: ChatMessage[];
}
```

## 2️⃣ Router Implementation

### Main API Route
```typescript
// app/api/chat/route.ts
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const mode = (body.mode || "club").toLowerCase();
  const userQ = extractUserQuestion(body);
  const history = body.history || [];

  if (!userQ) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  try {
    if (mode === "club") {
      return await handleClubMode(userQ, history);
    } else if (mode === "industry") {
      return await handleIndustryMode(userQ, history);
    } else {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }
  } catch (error) {
    console.error('Chat processing error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

## 3️⃣ Chế độ "Hỏi về câu lạc bộ"

### 3.1 FAQ Dataset
```typescript
// lib/faq-dataset.ts
export const FAQ_DATASET = {
  "faq": [
    {
      "id": "faq-ban-lam-gi",
      "canonical_question": "các ban trong câu lạc bộ làm gì",
      "answer": "Ban Học thuật: Thiết kế nội dung cho workshop và talkshow, chuẩn bị câu hỏi cho tọa đàm, xây dựng ngân hàng câu hỏi, ra đề và chấm cuộc thi ATTACKER.\nBan Sự kiện: Lập kế hoạch và hồ sơ tổ chức, xây dựng kịch bản MC và timeline, điều phối hậu cần và giám sát thực thi tại hiện trường.\nBan Truyền thông: Thiết kế ấn phẩm, quản lý các kênh truyền thông, lập kế hoạch nội dung và phát triển hình ảnh thương hiệu của câu lạc bộ.\nBan Tài chính cá nhân: Tổ chức đào tạo về quản lý tài chính cá nhân cho sinh viên, phát triển và cập nhật bộ bài MoneyWe, hỗ trợ giảng viên ở các học phần liên quan.\nBan Nhân sự: Phân công và theo dõi tiến độ, bảo đảm nguồlực, triển khai hoạt động gắn kết và gìn giữ văn hóa tổ chức."
    },
    {
      "id": "faq-hoat-dong",
      "canonical_question": "câu lạc bộ có những hoạt động gì",
      "answer": "FTC triển khai hệ sinh thái hoạt động học thuật và trải nghiệm thực tế gồm hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn và quản trị rủi ro. Bên cạnh đó là cuộc thi học thuật ATTACKER, chuỗi talkshow và workshop, các buổi training nội bộ, tham quan doanh nghiệp như VNG, sự kiện hướng nghiệp Web3 Career Innovation và hoạt động gắn kết cộng đồng FTC Trip."
    },
    {
      "id": "faq-tham-gia",
      "canonical_question": "làm thế nào để tham gia câu lạc bộ",
      "answer": "Bạn theo dõi Fanpage để cập nhật đợt tuyển thành viên và hướng dẫn nộp hồ sơ. Link Fanpage: https://www.facebook.com/clbfintechuel . Thông báo sẽ nêu rõ mốc thời gian, điều kiện và quy trình."
    },
    {
      "id": "faq-lich",
      "canonical_question": "thời gian sinh hoạt diễn ra khi nào",
      "answer": "Lịch sinh hoạt được công bố trước trên các kênh nội bộ và Fanpage để mọi thành viên nắm bắt kịp thời. Tùy chương trình, câu lạc bộ sẽ thông báo rõ thời gian, hình thức tham gia và yêu cầu chuẩn bị cho từng hoạt động như talkshow, workshop, training hoặc sự kiện theo mùa."
    },
    {
      "id": "faq-ky-nang",
      "canonical_question": "cần kỹ năng gì để ứng tuyển",
      "answer": "FTC chào đón đa dạng chuyên ngành. Tinh thần học hỏi, kỷ luật và chủ động là nền tảng quan trọng. Kiến thức nền về Excel, SQL hoặc Python là lợi thế khi tham gia các nội dung dữ liệu và công nghệ tài chính. Kỹ năng viết và thuyết trình giúp bạn đóng góp hiệu quả cho học thuật và truyền thông. Kỹ năng làm việc nhóm và quản lý thời gian hỗ trợ bạn theo kịp tiến độ dự án và sự kiện. Ứng viên quan tâm mảng sự kiện nên có tư duy tổ chức và khả năng phối hợp nhiều đầu việc. Ứng viên thiên về truyền thông cần khả năng xây dựng nội dung và thẩm mỹ thị giác."
    },
    {
      "id": "faq-thanh-lap",
      "canonical_question": "câu lạc bộ được thành lập khi nào",
      "answer": "FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM. Câu lạc bộ được thành lập vào tháng mười một năm 2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm cùng đội ngũ sinh viên ngành công nghệ tài chính."
    },
    {
      "id": "faq-thanh-tich",
      "canonical_question": "câu lạc bộ có những thành tích gì",
      "answer": "Năm học 2024–2025, FTC được Ban Cán sự Đoàn ĐHQG-HCM tặng Giấy khen vì đóng góp tích cực cho công tác Đoàn và phong trào thanh niên. Câu lạc bộ đồng thời vào Top 10 Nhóm 4 của Giải thưởng Đổi mới sáng tạo và Khởi nghiệp TP.HCM I-STAR, được cấp Giấy chứng nhận ghi nhận nỗ lực và đóng góp trong hoạt động đổi mới sáng tạo."
    }
  ]
};
```

### 3.2 FAQ Matching Algorithm
```typescript
// lib/faq-matcher.ts
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateJaccardSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(' '));
  const words2 = new Set(str2.split(' '));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
}

function calculateLevenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

export function matchFAQ(userQuestion: string, faqDataset: any): { answer: string; id: string } | null {
  const normalizedQuestion = normalizeText(userQuestion);
  let bestMatch = { score: 0, answer: '', id: '' };
  
  for (const item of faqDataset.faq) {
    const normalizedCanonical = normalizeText(item.canonical_question);
    let score = 0;
    
    // 1. Direct match
    if (normalizedQuestion === normalizedCanonical) {
      score = 1.0;
    }
    // 2. Contains match
    else if (normalizedQuestion.includes(normalizedCanonical) || normalizedCanonical.includes(normalizedQuestion)) {
      score = 0.9;
    }
    // 3. Keyword match (2+ keywords)
    else {
      const questionWords = normalizedQuestion.split(' ').filter(w => w.length > 2);
      const canonicalWords = normalizedCanonical.split(' ').filter(w => w.length > 2);
      const keywordMatches = questionWords.filter(w => canonicalWords.includes(w)).length;
      
      if (keywordMatches >= 2) {
        score = 0.7 + (keywordMatches * 0.05);
      }
      // 4. Jaccard similarity
      else {
        const jaccard = calculateJaccardSimilarity(normalizedQuestion, normalizedCanonical);
        if (jaccard >= 0.35) {
          score = 0.6 + jaccard * 0.3;
        }
        // 5. Levenshtein distance
        else if (normalizedQuestion.length > 30 || normalizedCanonical.length > 30) {
          const distance = calculateLevenshteinDistance(normalizedQuestion, normalizedCanonical);
          if (distance <= 10) {
            score = 0.5 + (10 - distance) * 0.05;
          }
        }
      }
    }
    
    if (score > bestMatch.score) {
      bestMatch = { score, answer: item.answer, id: item.id };
    }
  }
  
  return bestMatch.score >= 0.5 ? bestMatch : null;
}
```

### 3.3 Club Mode Handler
```typescript
// lib/club-mode-handler.ts
const CLUB_SYSTEM_PROMPT = `Bạn là cố vấn học tập dành cho tân sinh viên. Hãy giới thiệu ngắn gọn, thân thiện và dễ hiểu về Câu lạc bộ Công nghệ tài chính FTC cùng định hướng ngành học liên quan. Thông tin nền để dùng khi trả lời: FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM, thành lập tháng 11/2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm. Hoạt động tiêu biểu gồm hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn, quản trị rủi ro; cuộc thi học thuật ATTACKER; chuỗi talkshow và workshop; training nội bộ; tham quan doanh nghiệp như VNG; sự kiện hướng nghiệp Web3 Career Innovation; hoạt động gắn kết cộng đồng FTC Trip. Cơ cấu gồm 5 ban chuyên môn: Học thuật, Sự kiện, Truyền thông, Tài chính cá nhân, Nhân sự (Ban Điều hành giữ vai trò định hướng và phê duyệt, không tính là ban chuyên môn). Cách tham gia: theo dõi Fanpage để cập nhật đợt tuyển và hướng dẫn nộp hồ sơ (https://www.facebook.com/clbfintechuel ). Lịch sinh hoạt được công bố trước trên kênh nội bộ và Fanpage theo từng chương trình. Kỹ năng khuyến khích: tinh thần học hỏi, kỷ luật, chủ động; nền tảng Excel, SQL hoặc Python là lợi thế; kỹ năng viết, thuyết trình, làm việc nhóm và quản lý thời gian giúp theo kịp dự án và sự kiện; thiên về sự kiện cần tư duy tổ chức, thiên về truyền thông cần năng lực xây dựng nội dung và thẩm mỹ thị giác. Thành tích: Giấy khen của Ban Cán sự Đoàn ĐHQG-HCM năm học 2024–2025; Top 10 Nhóm 4 Giải thưởng I-STAR TP.HCM. Khi thiếu dữ liệu chi tiết, hãy nói rõ "tài liệu chưa nêu" và hướng người hỏi sang Fanpage. Trả lời bằng tiếng Việt, mạch lạc, không dùng dấu ";" hoặc gạch đầu dòng.`;

export async function handleClubMode(userQuestion: string, history: any[]): Promise<NextResponse> {
  // 1. Try FAQ matching first
  const faqMatch = matchFAQ(userQuestion, FAQ_DATASET);
  
  if (faqMatch) {
    return NextResponse.json({
      text: faqMatch.answer,
      reply: faqMatch.answer,
      response: faqMatch.answer,
      mode: "club",
      source: "faq",
      faq_id: faqMatch.id
    });
  }
  
  // 2. Fallback to Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: CLUB_SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    }
  });
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userQuestion }] }]
  });
  
  return NextResponse.json({
    text: result.response.text(),
    reply: result.response.text(),
    response: result.response.text(),
    mode: "club",
    source: "gemini"
  });
}
```

## 4️⃣ Chế độ "Hỏi về ngành"

### 4.1 Google Search Integration
```typescript
// lib/google-search.ts
interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

export async function searchGoogle(query: string): Promise<GoogleSearchResult[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  if (!apiKey || !searchEngineId) {
    throw new Error('Google Search API credentials not configured');
  }
  
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=5`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data.items?.map((item: any) => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet,
    displayLink: item.displayLink
  })) || [];
}
```

### 4.2 Industry Mode Handler
```typescript
// lib/industry-mode-handler.ts
const INDUSTRY_SYSTEM_PROMPT = `Bạn là trợ lý học thuật. Tóm tắt ngắn gọn, chính xác, dễ hiểu về chủ đề mà người dùng hỏi liên quan tới ngành FinTech và các lĩnh vực sát cạnh (ngân hàng số, dữ liệu, AI tài chính, blockchain, thị trường vốn, quản trị rủi ro). Chỉ sử dụng thông tin rút ra từ danh sách kết quả tìm kiếm kèm theo. Trả lời bằng tiếng Việt, mạch lạc, không dùng dấu ";" hoặc gạch đầu dòng. Kết thúc phần trả lời bằng một dòng "Nguồn: domain1, domain2, domain3".`;

export async function handleIndustryMode(userQuestion: string, history: any[]): Promise<NextResponse> {
  try {
    // 1. Search Google
    const searchResults = await searchGoogle(userQuestion);
    
    if (searchResults.length === 0) {
      return NextResponse.json({
        text: "Xin lỗi, không tìm thấy thông tin phù hợp về chủ đề này. Vui lòng thử câu hỏi khác hoặc liên hệ FTC để được hỗ trợ.",
        reply: "Xin lỗi, không tìm thấy thông tin phù hợp về chủ đề này. Vui lòng thử câu hỏi khác hoặc liên hệ FTC để được hỗ trợ.",
        response: "Xin lỗi, không tìm thấy thông tin phù hợp về chủ đề này. Vui lòng thử câu hỏi khác hoặc liên hệ FTC để được hỗ trợ.",
        mode: "industry",
        source: "google",
        search_results: []
      });
    }
    
    // 2. Format search results for AI
    const searchContext = searchResults.map((result, index) => 
      `${index + 1}) ${result.title} — ${result.displayLink}\n   Tóm tắt: ${result.snippet}`
    ).join('\n\n');
    
    const userPrompt = `Câu hỏi: "${userQuestion}"\n\nKết quả tìm kiếm (tối đa 5):\n${searchContext}\n\nYêu cầu: Dựa vào các tóm tắt trên để trả lời.`;
    
    // 3. Generate response with Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: INDUSTRY_SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }]
    });
    
    const sources = searchResults.map(r => r.displayLink).join(', ');
    
    return NextResponse.json({
      text: result.response.text(),
      reply: result.response.text(),
      response: result.response.text(),
      mode: "industry",
      source: "google",
      search_results: searchResults,
      sources: sources
    });
    
  } catch (error) {
    console.error('Industry mode error:', error);
    return NextResponse.json({
      text: "Xin lỗi, hiện không thể tìm kiếm thông tin. Vui lòng thử lại sau hoặc chuyển sang chế độ 'Hỏi về câu lạc bộ'.",
      reply: "Xin lỗi, hiện không thể tìm kiếm thông tin. Vui lòng thử lại sau hoặc chuyển sang chế độ 'Hỏi về câu lạc bộ'.",
      response: "Xin lỗi, hiện không thể tìm kiếm thông tin. Vui lòng thử lại sau hoặc chuyển sang chế độ 'Hỏi về câu lạc bộ'.",
      mode: "industry",
      source: "error"
    });
  }
}
```

## 5️⃣ Environment Configuration

### Required Environment Variables
```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_SEARCH_API_KEY=your_google_search_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
```

### Google Search Setup
1. Tạo Google Custom Search Engine tại: https://cse.google.com/
2. Lấy Search Engine ID
3. Tạo API Key tại: https://console.developers.google.com/
4. Enable Custom Search API

## 6️⃣ Testing & Validation

### Test Cases
```typescript
const testCases = [
  // Club mode tests
  {
    mode: "club",
    question: "Các ban trong câu lạc bộ làm gì?",
    expectedSource: "faq",
    expectedFaqId: "faq-ban-lam-gi"
  },
  {
    mode: "club", 
    question: "FTC có hoạt động gì không?",
    expectedSource: "faq",
    expectedFaqId: "faq-hoat-dong"
  },
  {
    mode: "club",
    question: "Làm sao để join FTC?",
    expectedSource: "faq", 
    expectedFaqId: "faq-tham-gia"
  },
  {
    mode: "club",
    question: "FTC có mentor không?",
    expectedSource: "gemini"
  },
  
  // Industry mode tests
  {
    mode: "industry",
    question: "Blockchain là gì?",
    expectedSource: "google"
  },
  {
    mode: "industry",
    question: "FinTech trends 2024",
    expectedSource: "google"
  }
];
```

## 7️⃣ UI Enhancements

### Mode Indicator
```typescript
const ModeIndicator = ({ mode, source }: { mode: string; source: string }) => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    <span className="px-2 py-1 bg-primary/10 rounded">
      {mode === "club" ? "🏛️ Câu lạc bộ" : "📚 Ngành học"}
    </span>
    {source === "faq" && <span className="px-2 py-1 bg-green-100 text-green-800 rounded">FAQ</span>}
    {source === "gemini" && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">AI</span>}
    {source === "google" && <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">Google</span>}
  </div>
);
```

### Source Links Display
```typescript
const SourceLinks = ({ sources, searchResults }: { sources?: string; searchResults?: any[] }) => {
  if (!sources && !searchResults) return null;
  
  return (
    <div className="mt-2 text-xs text-muted-foreground">
      <p>Nguồn: {sources}</p>
      {searchResults && (
        <div className="mt-1 space-y-1">
          {searchResults.slice(0, 3).map((result, index) => (
            <a 
              key={index}
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline truncate"
            >
              {result.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
```

## 8️⃣ Performance Optimization

### Caching Strategy
```typescript
// lib/cache.ts
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getCached(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

export function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}
```

### Rate Limiting
```typescript
// lib/rate-limit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= limit) {
    return false;
  }
  
  userLimit.count++;
  return true;
}
```

## 9️⃣ Monitoring & Analytics

### Logging
```typescript
// lib/analytics.ts
export function logChatInteraction(mode: string, source: string, question: string, responseTime: number) {
  console.log('Chat Analytics:', {
    timestamp: new Date().toISOString(),
    mode,
    source,
    questionLength: question.length,
    responseTime,
    userAgent: 'server'
  });
}
```

## 🚀 Deployment Checklist

- [ ] Set up Google Custom Search Engine
- [ ] Configure environment variables
- [ ] Implement FAQ matching algorithm
- [ ] Add mode selection UI
- [ ] Test both modes thoroughly
- [ ] Set up monitoring and logging
- [ ] Deploy to production
- [ ] Monitor performance and usage

## 📊 Expected Results

- **Club Mode**: Fast FAQ responses + intelligent Gemini fallback
- **Industry Mode**: Real-time Google search + AI summarization
- **User Experience**: Clear mode distinction, source attribution
- **Performance**: Cached responses, rate limiting, error handling
