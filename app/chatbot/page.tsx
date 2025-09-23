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
const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""
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
  const endpoints = [
    "/api/chat/gemini",
    NEXT_PUBLIC_BACKEND_URL ? `${NEXT_PUBLIC_BACKEND_URL}/chat` : null,
  ].filter(Boolean) as string[]

  let lastErr: any = null
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          message: question,
          messages: [...(history || []), { role: "user", content: question }],
        }),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => null)
        console.warn("Server returned non-ok", url, res.status, txt)
        throw new Error(`Server ${res.status}: ${txt ?? res.statusText}`)
      }
      const data = await res.json().catch(() => ({}))
      return data.reply || data.response || data.text || data.answer || ""
    } catch (err) {
      lastErr = err
    }
  }
  console.error("All chat endpoints failed:", lastErr)
  return "Xin lỗi, có lỗi kết nối. Vui lòng thử lại sau."
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
    <div className={cn("flex gap-4 mb-6", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-lg",
          isUser 
            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" 
            : "bg-gradient-to-br from-green-500 to-teal-600 text-white"
        )}>
          {isUser ? "👤" : "🤖"}
        </div>
      </div>

      {/* Message Content */}
      <div className={cn("flex-1 max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "relative rounded-2xl px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl",
          isUser 
            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white ml-auto" 
            : "bg-white/10 backdrop-blur-lg border border-white/20 text-white"
        )}>
          {/* Message bubble arrow */}
          <div className={cn(
            "absolute top-3 w-0 h-0",
            isUser 
              ? "right-[-8px] border-l-[8px] border-l-blue-500 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"
              : "left-[-8px] border-r-[8px] border-r-white/20 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"
          )} />
          
          {/* Message text */}
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: (m.content || "").replace(/\n/g, "<br/>") }}
          />
          
          {/* Timestamp */}
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-blue-100" : "text-white/70"
          )}>
            {m.ts ? new Date(m.ts).toLocaleTimeString('vi-VN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : 'Vừa xong'}
          </div>
        </div>

        {/* Action buttons for bot messages */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-2 ml-2">
            <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors group">
              <Heart className="h-4 w-4 text-white/60 group-hover:text-red-400" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors group">
              <Repeat2 className="h-4 w-4 text-white/60 group-hover:text-blue-400" />
            </button>
            <button 
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors group"
              onClick={() => navigator.clipboard?.writeText(m.content)}
            >
              <Share2 className="h-4 w-4 text-white/60 group-hover:text-green-400" />
            </button>
          </div>
        )}
      </div>
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

  async function handleSendMessage(messageOverride?: string) {
    const q = (messageOverride || inputValue).trim()
    if (!q || isSending) return

    const newUserMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: q, mode: selectedMode, ts: Date.now() }
    setMessages((prev) => [...prev, newUserMsg])
    if (!messageOverride) setInputValue("")
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
            <div className="lg:col-span-8">
              {/* Messages Container */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-6 min-h-[500px] max-h-[600px] overflow-y-auto">
                {/* Welcome Message */}
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-2xl">
                      <Bot className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Chào mừng đến với FTC Chatbot!</h3>
                    <p className="text-white/70 mb-6 max-w-md">
                      Tôi có thể giúp bạn tìm hiểu về câu lạc bộ FTC và kiến thức về ngành công nghệ tài chính
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Đang hoạt động</span>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="space-y-2">
                  {messages.map((m) => (
                    <MessageCard key={m.id} m={m} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Composer hiện đại */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-sm text-white/70">
                      {selectedMode === "club" ? (
                        <>
                          <Users className="h-4 w-4 text-blue-400" />
                          <span>Chế độ CLB - Thông tin FTC</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 text-green-400" />
                          <span>Chế độ Ngành - Kiến thức FinTech</span>
                        </>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedMode === "club" ? "Hỏi về FTC, hoạt động, cách tham gia..." : "Hỏi về FinTech, blockchain, ngân hàng số..."}
                        className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl pr-12"
                        disabled={isSending}
                      />
                      {isSending && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!inputValue.trim() || isSending}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                {isSending && selectedMode === "industry" && (
                  <div className="flex items-center gap-2 mt-3 text-xs text-white/70">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-blue-300 rounded-full animate-spin"></div>
                    <span>🔍 Đang tìm kiếm thông tin từ Google...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

            {/* Sidebar với hiệu ứng hiện đại */}
            <div className="lg:col-span-4">
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Câu hỏi gợi ý
                    </h3>
                    <p className="text-sm text-white/70">Nhấp để hỏi ngay</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedMode("club")
                        handleSendMessage(q)
                      }}
                      className="w-full text-left rounded-2xl bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 px-4 py-4 transition-all duration-300 transform hover:scale-[1.02] group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm font-bold">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors leading-relaxed">
                            {q}
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-blue-400" />
                              <span className="text-xs text-blue-300 font-medium">Chế độ CLB</span>
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                              <Send className="h-3 w-3 text-white/50 group-hover:text-white/80" />
                              <span className="text-xs text-white/50 group-hover:text-white/80">Gửi</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Quick Tips */}
                <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    Mẹo sử dụng
                  </h4>
                  <ul className="text-xs text-white/70 space-y-1">
                    <li>• Chế độ CLB: Thông tin FTC chính xác</li>
                    <li>• Chế độ Ngành: Kiến thức FinTech tổng hợp</li>
                    <li>• Nhấp câu hỏi gợi ý để hỏi ngay</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <div className="pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-xs text-muted-foreground bg-background/40 backdrop-blur border border-primary/10 rounded-xl py-3">
            Powered by ⚡ <span className="font-semibold text-primary">FTC</span>
            {selectedMode === "industry" && <span className="ml-2">• Tích hợp Google Search</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
