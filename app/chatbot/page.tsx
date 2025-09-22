"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import {
  Bot,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Send,
  Users,
  Heart,
  Repeat2,
  Share2,
  MoreHorizontal,
  CheckCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Navigation động (giữ như project)
const Navigation = dynamic(() => import("@/components/navigation"), { ssr: false })

// --- Types ---
type ChatMode = "club" | "industry"
type ChatMessage = { id: string; role: "user" | "assistant"; content: string; mode?: ChatMode; ts?: number }

// --- ENV & constants ---
const NEXT_PUBLIC_FTC_WEBSITE = process.env.NEXT_PUBLIC_FTC_WEBSITE || ""
const FTC_FANPAGE = "https://www.facebook.com/clbfintechuel"

const SUGGESTED_QUESTIONS: string[] = [
  "Câu lạc bộ có những hoạt động gì?",
  "Làm thế nào để tham gia câu lạc bộ?",
  "Các ban trong câu lạc bộ làm gì?",
  "Thời gian sinh hoạt diễn ra khi nào?",
  "Cần kỹ năng gì để ứng tuyển?",
  "Câu lạc bộ được thành lập khi nào?",
  "Câu lạc bộ có những thành tích gì?",
]

const CHAT_MODES: Array<{ mode: ChatMode; label: string; description: string; color: string; icon: React.ComponentType<any> }> = [
  {
    mode: "club",
    label: "Hỏi về câu lạc bộ",
    description: "Ưu tiên FAQ FTC; ngoài danh sách dùng Gemini (vai cố vấn tân sinh viên).",
    color: "bg-blue-600",
    icon: Users,
  },
  {
    mode: "industry",
    label: "Hỏi về ngành",
    description: "Tổng hợp từ Google (API thật hoặc mô phỏng), có trích nguồn ngắn gọn.",
    color: "bg-green-600",
    icon: BookOpen,
  },
]

// --- FAQ cố định cho FTC (khóa không dấu) ---
const FAQ_MAP: Record<string, string> = {
  "cac ban trong cau lac bo lam gi":
    "Ban Học thuật: Thiết kế nội dung cho workshop và talkshow, chuẩn bị câu hỏi cho tọa đàm, xây dựng ngân hàng câu hỏi, ra đề và chấm cuộc thi ATTACKER.\nBan Sự kiện: Lập kế hoạch và hồ sơ tổ chức, xây dựng kịch bản MC và timeline, điều phối hậu cần và giám sát thực thi tại hiện trường.\nBan Truyền thông: Thiết kế ấn phẩm, quản lý các kênh truyền thông, lập kế hoạch nội dung và phát triển hình ảnh thương hiệu của câu lạc bộ.\nBan Tài chính cá nhân: Tổ chức đào tạo về quản lý tài chính cá nhân cho sinh viên, phát triển và cập nhật bộ bài MoneyWe, hỗ trợ giảng viên ở các học phần liên quan.\nBan Nhân sự: Phân công và theo dõi tiến độ, bảo đảm nguồn lực, triển khai hoạt động gắn kết và gìn giữ văn hóa tổ chức.",
  "cau lac bo co nhung hoat dong gi":
    "FTC triển khai hệ sinh thái hoạt động học thuật và trải nghiệm thực tế gồm hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn và quản trị rủi ro. Bên cạnh đó là cuộc thi học thuật ATTACKER, chuỗi talkshow và workshop, các buổi training nội bộ, tham quan doanh nghiệp như VNG, sự kiện hướng nghiệp Web3 Career Innovation và hoạt động gắn kết cộng đồng FTC Trip.",
  "lam the nao de tham gia cau lac bo":
    `Bạn theo dõi Fanpage để cập nhật đợt tuyển thành viên và hướng dẫn nộp hồ sơ. Link Fanpage: ${FTC_FANPAGE} . Thông báo sẽ nêu rõ mốc thời gian, điều kiện và quy trình.`,
  "thoi gian sinh hoat dien ra khi nao":
    "Lịch sinh hoạt được công bố trước trên các kênh nội bộ và Fanpage để mọi thành viên nắm bắt kịp thời. Tùy chương trình, câu lạc bộ sẽ thông báo rõ thời gian, hình thức tham gia và yêu cầu chuẩn bị cho từng hoạt động như talkshow, workshop, training hoặc sự kiện theo mùa.",
  "can ky nang gi de ung tuyen":
    "FTC chào đón đa dạng chuyên ngành. Tinh thần học hỏi, kỷ luật và chủ động là nền tảng quan trọng. Kiến thức nền về Excel, SQL hoặc Python là lợi thế khi tham gia các nội dung dữ liệu và công nghệ tài chính. Kỹ năng viết và thuyết trình giúp bạn đóng góp hiệu quả cho học thuật và truyền thông. Kỹ năng làm việc nhóm và quản lý thời gian hỗ trợ bạn theo kịp tiến độ dự án và sự kiện. Ứng viên quan tâm mảng sự kiện nên có tư duy tổ chức và khả năng phối hợp nhiều đầu việc. Ứng viên thiên về truyền thông cần khả năng xây dựng nội dung và thẩm mỹ thị giác.",
  "cau lac bo duoc thanh lap khi nao":
    "FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM. Câu lạc bộ được thành lập vào tháng mười một năm 2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm cùng đội ngũ sinh viên ngành công nghệ tài chính.",
  "cau lac bo co nhung thanh tich gi":
    "Năm học 2024–2025, FTC được Ban Cán sự Đoàn ĐHQG-HCM tặng Giấy khen vì đóng góp tích cực cho công tác Đoàn và phong trào thanh niên. Câu lạc bộ đồng thời vào Top 10 Nhóm 4 của Giải thưởng Đổi mới sáng tạo và Khởi nghiệp TP.HCM I-STAR, được cấp Giấy chứng nhận ghi nhận nỗ lực và đóng góp trong hoạt động đổi mới sáng tạo.",
}

// --- Helpers ---
function normalize(text: string) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function faqMatchOrNull(q: string): string | null {
  const nx = normalize(q)
  for (const [k, v] of Object.entries(FAQ_MAP)) {
    if (nx.includes(k) || k.includes(nx)) return v
  }
  return null
}

function websiteAnchor(): string {
  if (NEXT_PUBLIC_FTC_WEBSITE) {
    return `Bạn có thể xem thêm tại website chính thức: <a href="${NEXT_PUBLIC_FTC_WEBSITE}" target="_blank" rel="noopener noreferrer">${NEXT_PUBLIC_FTC_WEBSITE}</a>.`
  }
  return `Theo dõi Fanpage: <a href="${FTC_FANPAGE}" target="_blank" rel="noopener noreferrer">${FTC_FANPAGE}</a>.`
}

async function askServer({
  mode,
  question,
  history,
}: {
  mode: ChatMode
  question: string
  history?: Array<{ role: "user" | "assistant"; content: string }>
}) {
  const res = await fetch("/api/chat/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode,
      message: question,
      messages: [...(history || []), { role: "user", content: question }],
    }),
  })
  const data = await res.json().catch(() => ({}))
  return data.reply || data.response || data.text || data.answer || ""
}

// --- Small UI atoms ---
function Avatar({ who }: { who: "user" | "assistant" }) {
  // IG story-like ring + gradient avatar
  const isUser = who === "user"
  return (
    <div
      className={cn(
        "relative h-10 w-10 rounded-full p-[2px]",
        isUser ? "bg-gradient-to-tr from-fuchsia-500 to-amber-400" : "bg-gradient-to-tr from-indigo-500 to-emerald-400"
      )}
    >
      <div className="h-full w-full rounded-full bg-background flex items-center justify-center text-xs font-semibold">
        {isUser ? "Bạn" : "FTC"}
      </div>
    </div>
  )
}

function Handle({ who }: { who: "user" | "assistant" }) {
  const name = who === "user" ? "Bạn" : "FTC Bot"
  const handle = who === "user" ? "@student" : "@ftc_official"
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold">{name}</span>
      <span className="text-xs text-muted-foreground">{handle}</span>
      <CheckCheck className="h-3.5 w-3.5 text-primary/80" />
    </div>
  )
}

function PrettyTime({ ts }: { ts?: number }) {
  const [text, setText] = useState("•")
  useEffect(() => {
    if (!ts) return
    const d = new Date(ts)
    const pad = (n: number) => String(n).padStart(2, "0")
    setText(`${pad(d.getHours())}:${pad(d.getMinutes())}`)
  }, [ts])
  return <span className="text-xs text-muted-foreground">· {text}</span>
}

function MessageCard({ m }: { m: ChatMessage }) {
  const isUser = m.role === "user"
  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && <Avatar who="assistant" />}
      <div
        className={cn(
          "rounded-2xl border border-accent/30 w-full max-w-[720px] shadow-sm",
          "bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/70"
        )}
      >
        {/* Header like tweet */}
        <div className="px-3 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Handle who={isUser ? "user" : "assistant"} />
            <PrettyTime ts={m.ts} />
          </div>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Body */}
        <div
          className={cn(
            "px-3 py-3 text-[15px] leading-6",
            isUser ? "text-foreground" : "text-foreground"
          )}
          // Cho phép xuống dòng + anchor
          dangerouslySetInnerHTML={{ __html: (m.content || "").replace(/\n/g, "<br/>") }}
        />

        {/* Footer actions like Twitter */}
        <div className="px-3 pb-2 flex items-center gap-5 text-muted-foreground/90">
          <button className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">Trả lời</span>
          </button>
          <button className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Repeat2 className="h-4 w-4" />
            <span className="text-xs">Chia sẻ</span>
          </button>
          <button className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Heart className="h-4 w-4" />
            <span className="text-xs">Hữu ích</span>
          </button>
          <button className="ml-auto inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Sao chép</span>
          </button>
        </div>
      </div>
      {isUser && <Avatar who="user" />}
    </div>
  )
}

// --- Page component ---
export default function ChatbotPage() {
  const [selectedMode, setSelectedMode] = useState<ChatMode>("club")
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [showModeChangeNotification, setShowModeChangeNotification] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const dynamicPlaceholder = useMemo(
    () => (selectedMode === "club" ? "Hỏi về FTC, hoạt động, cách tham gia…" : "Hỏi về FinTech, blockchain, ngân hàng số…"),
    [selectedMode]
  )

  const handleModeChange = (m: ChatMode) => {
    setSelectedMode(m)
    setShowModeChangeNotification(true)
    setTimeout(() => setShowModeChangeNotification(false), 2000)
  }

  async function handleSendMessage() {
    const q = inputValue.trim()
    if (!q || isSending) return

    const newUserMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: q, mode: selectedMode, ts: Date.now() }
    setMessages((prev) => [...prev, newUserMsg])
    setInputValue("")
    setIsSending(true)

    try {
      let botText: string | null = null

      // Club-mode: nếu trùng câu gợi ý → trả lời cố định FTC
      if (selectedMode === "club") {
        const quick = faqMatchOrNull(q)
        if (quick) botText = quick
      }

      // Không khớp thì gọi backend (Gemini / Google-mode)
      if (!botText) {
        const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
        const out = await askServer({ mode: selectedMode, question: q, history })
        botText = out || "Xin lỗi, hiện chưa thể trả lời."
      }

      // Nếu hỏi link/website trong club-mode → gợi ý website/Fanpage
      if (selectedMode === "club") {
        const keys = ["link", "website", "trang web", "web", "thông tin", "thong tin", "tuyển", "tuyen"]
        if (keys.some((k) => normalize(q).includes(normalize(k)))) {
          botText = `${botText}\n\n${websiteAnchor()}`
        }
      }

      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: botText!,
        mode: selectedMode,
        ts: Date.now(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Xin lỗi, hiện chưa thể trả lời.", mode: selectedMode, ts: Date.now() },
      ])
    } finally {
      setIsSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-hidden">
      <Navigation />

      {/* Hero Section với hiệu ứng nhấp nháy hiện đại */}
      <section className="relative min-h-[50vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl animate-float-reverse" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Title với hiệu ứng shimmer */}
          <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold">
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-50 blur-2xl animate-pulse"></span>
            <span className="relative bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text animate-text-shine">
              FTC CHATBOT
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto italic">
            Trợ lý AI thông minh cho tân sinh viên · Hỗ trợ thông tin câu lạc bộ và kiến thức ngành
          </p>

          {/* Mode selector với hiệu ứng hiện đại */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
            <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg animate-pulse" />
                    <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Chọn chế độ</h2>
                    <p className="text-sm text-muted-foreground">Tùy chỉnh trải nghiệm chat</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {CHAT_MODES.map((mc) => {
                    const Icon = mc.icon
                    const active = selectedMode === mc.mode
                    return (
                      <button
                        key={mc.mode}
                        onClick={() => handleModeChange(mc.mode)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105",
                          active 
                            ? `${mc.color} text-white shadow-lg scale-105` 
                            : "bg-muted/50 hover:bg-accent/30 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {mc.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {showModeChangeNotification && (
                <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground animate-in slide-in-from-top-2 duration-300">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Đã chuyển sang chế độ: <span className="font-semibold text-primary">{CHAT_MODES.find((m) => m.mode === selectedMode)?.label}</span>
          </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content với glassmorphism design */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Chat Area (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Input Composer với hiệu ứng hiện đại */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
                <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                      <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                        <div className="text-sm font-semibold text-primary">Bạn</div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {selectedMode === "club" ? (
                          <>
                            <Users className="h-4 w-4 text-blue-500" />
                            <span>Chế độ CLB · Trả lời dựa trên thông tin FTC</span>
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-4 w-4 text-green-600" />
                            <span>Chế độ Ngành · Tổng hợp từ Google</span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={selectedMode === "club" ? "Hỏi về FTC, hoạt động, cách tham gia…" : "Hỏi về FinTech, blockchain, ngân hàng số…"}
                          className="flex-1 border-primary/20 focus:border-primary/40 transition-colors"
                        />
                        <Button 
                          onClick={handleSendMessage} 
                          disabled={!inputValue.trim() || isSending} 
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg transform hover:scale-105 transition-all"
                        >
                          <Send className="h-4 w-4 mr-2" /> Gửi
                        </Button>
                      </div>
                    </div>
          </div>
        </div>
      </div>

              {/* Messages với hiệu ứng hiện đại */}
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
                    <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-4">
                      <MessageCard m={m} />
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Sidebar với hiệu ứng hiện đại */}
            <div className="lg:col-span-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
                <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                      <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                        <HelpCircle className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Câu hỏi gợi ý
                      </h3>
                      <p className="text-sm text-muted-foreground">Luôn dùng chế độ CLB</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedMode("club")
                          setInputValue(q)
                        }}
                        className="w-full text-left rounded-2xl border border-primary/20 px-4 py-3 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 transform hover:scale-105 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <MessageSquare className="h-4 w-4 text-primary group-hover:text-primary/80" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {q}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <Users className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-blue-600 font-medium">Chế độ CLB</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
