"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const animations = {
  fadeIn: "animate-in fade-in duration-500",
  slideUp: "animate-in slide-in-from-bottom-3",
  slideDown: "animate-in slide-in-from-top-3",
  scaleIn: "animate-in zoom-in-50 duration-300",
}
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Commented out to avoid conflict
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ChatMode, FAQ_MAP, SUGGESTED_QUESTIONS, FTC_CONTACTS, normalize, faqMatchOrNull, withCTA } from "../api/chat/gemini/route"
import { BRAND } from "./constants/brand"

// Navigation động (giữ như project)
const Navigation = dynamic(() => import("@/components/navigation"), { ssr: false })

// --- Types ---
type ChatMessage = { 
  id: string; 
  role: "user" | "assistant"; 
  content: string; 
  mode?: ChatMode; 
  ts?: number;
  reactions?: {
    likes?: number;
    shares?: number;
  };
  isLiked?: boolean;
}

// --- ENV & constants ---
const NEXT_PUBLIC_FTC_WEBSITE = process.env.NEXT_PUBLIC_FTC_WEBSITE || ""
const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""
// const FTC_FANPAGE = "https://www.facebook.com/clbfintechuel" // Moved to FTC_CONTACTS

// const SUGGESTED_QUESTIONS: string[] = [ // Moved to backend route
//   "Câu lạc bộ có những hoạt động gì?",
//   "Làm thế nào để tham gia câu lạc bộ?",
//   "Các ban trong câu lạc bộ làm gì?",
//   "Thời gian sinh hoạt diễn ra khi nào?",
//   "Cần kỹ năng gì để ứng tuyển?",
//   "Câu lạc bộ được thành lập khi nào?",
//   "Câu lạc bộ có những thành tích gì?",
// ]

const CHAT_MODES: Array<{ mode: ChatMode; label: string; description: string; gradient: string; lightGradient: string; icon: string }> = [
  {
    mode: "club",
    label: "Hỏi về câu lạc bộ",
    description: "Ưu tiên FAQ FTC; ngoài danh sách dùng Gemini (vai cố vấn tân sinh viên).",
    gradient: BRAND.gradients.primary,
    lightGradient: BRAND.gradients.soft,
    icon: "👥",
  },
  {
    mode: "industry",
    label: "Hỏi về ngành",
    description: "Tổng hợp từ Google (API thật hoặc mô phỏng), có trích nguồn ngắn gọn.",
    gradient: BRAND.gradients.primaryReverse,
    lightGradient: BRAND.gradients.ambient,
    icon: "📚",
  },
]

// --- FAQ cố định cho FTC (khóa không dấu) ---
// const FAQ_MAP: Record<string, string> = { // Moved to backend route
//   "cac ban trong cau lac bo lam gi":
//     "Ban Học thuật: Thiết kế nội dung cho workshop và talkshow, chuẩn bị câu hỏi cho tọa đàm, xây dựng ngân hàng câu hỏi, ra đề và chấm cuộc thi ATTACKER.\nBan Sự kiện: Lập kế hoạch và hồ sơ tổ chức, xây dựng kịch bản MC và timeline, điều phối hậu cần và giám sát thực thi tại hiện trường.\nBan Truyền thông: Thiết kế ấn phẩm, quản lý các kênh truyền thông, lập kế hoạch nội dung và phát triển hình ảnh thương hiệu của câu lạc bộ.\nBan Tài chính cá nhân: Tổ chức đào tạo về quản lý tài chính cá nhân cho sinh viên, phát triển và cập nhật bộ bài MoneyWe, hỗ trợ giảng viên ở các học phần liên quan.\nBan Nhân sự: Phân công và theo dõi tiến độ, bảo đảm nguồn lực, triển khai hoạt động gắn kết và gìn giữ văn hóa tổ chức.",
//   "cau lac bo co nhung hoat dong gi":
//     "FTC triển khai hệ sinh thái hoạt động học thuật và trải nghiệm thực tế gồm hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn và quản trị rủi ro. Bên cạnh đó là cuộc thi học thuật ATTACKER, chuỗi talkshow và workshop, các buổi training nội bộ, tham quan doanh nghiệp như VNG, sự kiện hướng nghiệp Web3 Career Innovation và hoạt động gắn kết cộng đồng FTC Trip.",
//   "lam the nao de tham gia cau lac bo":
//     `Bạn theo dõi Fanpage để cập nhật đợt tuyển thành viên và hướng dẫn nộp hồ sơ. Link Fanpage: ${FTC_FANPAGE} . Thông báo sẽ nêu rõ mốc thời gian, điều kiện và quy trình.`,
//   "thoi gian sinh hoat dien ra khi nao":
//     "Lịch sinh hoạt được công bố trước trên các kênh nội bộ và Fanpage để mọi thành viên nắm bắt kịp thời. Tùy chương trình, câu lạc bộ sẽ thông báo rõ thời gian, hình thức tham gia và yêu cầu chuẩn bị cho từng hoạt động như talkshow, workshop, training hoặc sự kiện theo mùa.",
//   "can ky nang gi de ung tuyen":
//     "FTC chào đón đa dạng chuyên ngành. Tinh thần học hỏi, kỷ luật và chủ động là nền tảng quan trọng. Kiến thức nền về Excel, SQL hoặc Python là lợi thế khi tham gia các nội dung dữ liệu và công nghệ tài chính. Kỹ năng viết và thuyết trình giúp bạn đóng góp hiệu quả cho học thuật và truyền thông. Kỹ năng làm việc nhóm và quản lý thời gian hỗ trợ bạn theo kịp tiến độ dự án và sự kiện. Ứng viên quan tâm mảng sự kiện nên có tư duy tổ chức và khả năng phối hợp nhiều đầu việc. Ứng viên thiên về truyền thông cần khả năng xây dựng nội dung và thẩm mỹ thị giác.",
//   "cau lac bo duoc thanh lap khi nao":
//     "FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM. Câu lạc bộ được thành lập vào tháng mười một năm 2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm cùng đội ngũ sinh viên ngành công nghệ tài chính.",
//   "cau lac bo co nhung thanh tich gi":
//     "Năm học 2024–2025, FTC được Ban Cán sự Đoàn ĐHQG-HCM tặng Giấy khen vì đóng góp tích cực cho công tác Đoàn và phong trào thanh niên. Câu lạc bộ đồng thời vào Top 10 Nhóm 4 của Giải thưởng Đổi mới sáng tạo và Khởi nghiệp TP.HCM I-STAR, được cấp Giấy chứng nhận ghi nhận nỗ lực và đóng góp trong hoạt động đổi mới sáng tạo.",
// }

// --- Helpers ---
// function normalize(text: string) { // Moved to backend route
//   return (text || "")
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/[^a-z0-9\s]/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
// }

// function faqMatchOrNull(q: string): string | null { // Moved to backend route
//   const nx = normalize(q)
//   for (const [k, v] of Object.entries(FAQ_MAP)) {
//     if (nx.includes(k) || k.includes(nx)) return v
//   }
//   return null
// }

// function websiteAnchor(): string { // Moved to backend route
//   if (NEXT_PUBLIC_FTC_WEBSITE) {
//     return `Bạn có thể xem thêm tại website chính thức: <a href="${NEXT_PUBLIC_FTC_WEBSITE}" target="_blank" rel="noopener noreferrer">${NEXT_PUBLIC_FTC_WEBSITE}</a>.`
//   }
//   return `Theo dõi Fanpage: <a href="${FTC_FANPAGE}" target="_blank" rel="noopener noreferrer">${FTC_FANPAGE}</a>.`
// }

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
function UserAvatar({ who }: { who: "user" | "assistant" }) {
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
    <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2">
      <span className="text-sm font-semibold">{name}</span>
      <span className="text-xs text-muted-foreground">{handle}</span>
      <span className="text-primary/80">✓</span>
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
  const isTyping = (m.content === "Đang suy nghĩ..." || m.content.includes("đang suy nghĩ"))
  
  const TypingIndicator = () => (
    <div className="flex items-center gap-1" aria-live="polite">
      <div className="flex gap-1">
        <span className={`w-2 h-2 rounded-full bg-[${BRAND.primary}] animate-bounce [animation-delay:-0.3s]`} />
        <span className={`w-2 h-2 rounded-full bg-[${BRAND.primary}] animate-bounce [animation-delay:-0.15s]`} />
        <span className={`w-2 h-2 rounded-full bg-[${BRAND.primary}] animate-bounce`} />
      </div>
      <span className={`text-sm ${BRAND.text.muted} ml-2`}>AI đang suy nghĩ</span>
    </div>
  )
  
  return (
    <div className={cn("flex gap-4 mb-6 animate-in slide-in-from-bottom-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={cn(
          "w-12 h-12 rounded-3xl flex items-center justify-center",
          BRAND.shadows.medium,
          isUser 
            ? `${BRAND.surfaces.glass} ${BRAND.borders.primary} border` 
            : BRAND.gradients.radial
        )}>
          {isUser ? (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${BRAND.gradients.primary}`}>
              <span className="text-sm font-bold text-white">U</span>
            </div>
          ) : (
            <span className="text-white text-lg">🤖</span>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className={cn("flex-1 max-w-[75%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "relative rounded-3xl px-6 py-4",
          BRAND.shadows.large,
          isUser
            ? `${BRAND.text.inverse} ${BRAND.surfaces.userBubble}`
            : `${BRAND.text.primary} ${BRAND.surfaces.chatBubble} ${BRAND.borders.light} border`
        )}>
          {/* Message content */}
          {isTyping ? (
            <TypingIndicator />
          ) : (
            <div 
              className="text-sm leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: (m.content || "").replace(/\n/g, "<br/>") }}
            />
          )}
          
          {/* Timestamp */}
          <div className={cn(
            "text-xs mt-3",
            isUser ? "text-white/70" : BRAND.text.light
          )}>
            {m.ts ? new Date(m.ts).toLocaleTimeString('vi-VN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : ''}
          </div>
        </div>

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

  // Auto-scroll to bottom when new messages arrive (smooth scroll)
  useEffect(() => {
    const chatArea = document.getElementById("chat-scroll-area")
    if (chatArea) {
      // Smooth scroll to bottom without jumping
      setTimeout(() => {
        chatArea.scrollTo({
          top: chatArea.scrollHeight,
          behavior: 'smooth'
        })
      }, 100)
    }
  }, [messages])
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    setMessages((prev: ChatMessage[]) => [...prev, newUserMsg])
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
      const history = messages.slice(-6).map((m: ChatMessage) => ({ role: m.role, content: m.content }))
      const out = await askServer({ mode: selectedMode, question: q, history })
      botText = out || "Xin lỗi, hiện chưa thể trả lời."

      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: withCTA(botText!, selectedMode),
        mode: selectedMode,
        ts: Date.now(),
      }
      setMessages((prev: ChatMessage[]) => [...prev, botMsg])
    } catch {
      setMessages((prev: ChatMessage[]) => [
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
    <>
      <div className={`min-h-screen overflow-hidden ${BRAND.surfaces.primary}`} style={{ 
        background: `linear-gradient(140deg, ${BRAND.primary50} 0%, ${BRAND.primary100} 40%, ${BRAND.primary200} 100%)` 
      }}>
      <Navigation />

        {/* Hero Section với hiệu ứng nhấp nháy hiện đại */}
        <section className="relative min-h-[50vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-1000">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl animate-float-reverse" />
          </div>

          <div className="relative max-w-5xl mx-auto text-center space-y-8">
            {/* Title với hiệu ứng nhấp nháy hiện đại */}
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold">
              <span className="absolute inset-0 bg-gradient-to-r from-[#003663] to-[#1a5490] opacity-50 blur-2xl animate-pulse"></span>
              <span className={`relative ${BRAND.text.gradient} animate-bounce`} style={{
                animation: 'blink 1.5s infinite, gradient-shift 2s ease-in-out infinite, bounce 2s infinite'
              }}>
                FTC CHATBOT
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className={`text-xl sm:text-2xl ${BRAND.text.secondary} leading-relaxed max-w-3xl mx-auto italic`}>
              Trợ lý AI thông minh, hỗ trợ giải đáp thông tin về câu lạc bộ và ngành Fintech cho các bạn tân sinh viên
            </p>

            {/* Mode selector với hiệu ứng hiện đại */}
            <div className="mt-8 relative">
              <div className={`absolute inset-0 ${BRAND.gradients.ethereal} rounded-3xl transform transition-all`} />
              <div className={`relative ${BRAND.surfaces.glass} rounded-3xl ${BRAND.borders.primary} border p-6`}>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative">
                      <div className={`absolute inset-0 ${BRAND.gradients.glow} rounded-xl blur-lg animate-pulse`} />
                      <div className={`relative w-full h-full ${BRAND.surfaces.glass} rounded-xl flex items-center justify-center`}>
                        <span className={`text-[${BRAND.primary}] text-lg`}>🤖</span>
                      </div>
                    </div>
                    <div>
                      <h2 className={`text-lg font-bold ${BRAND.text.primary}`}>Chọn chế độ</h2>
                      <p className={`text-sm ${BRAND.text.muted}`}>Tùy chỉnh trải nghiệm chat</p>
                    </div>
        </div>

                  <div className="flex gap-2">
                    {CHAT_MODES.map((mc) => {
                      const active = selectedMode === mc.mode
                      return (
                        <button
                          key={mc.mode}
                          onClick={() => handleModeChange(mc.mode)}
                          className={cn(
                            "px-4 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all duration-300 transform",
                            BRAND.states.hover,
                            active 
                              ? `${mc.gradient} text-white ${BRAND.shadows.medium} scale-105` 
                              : `${BRAND.surfaces.interactive} ${BRAND.text.muted} hover:${BRAND.text.secondary}`
                          )}
                        >
                          <span>{mc.icon}</span>
                          {mc.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {showModeChangeNotification && (
                  <div className={`mt-4 inline-flex items-center gap-2 text-sm ${BRAND.text.muted} animate-in slide-in-from-top-2 duration-300`}>
                    <div className={`w-2 h-2 rounded-full bg-[${BRAND.primary}] animate-pulse`} />
                    Đã chuyển sang chế độ: <span className={`font-semibold text-[${BRAND.primary}]`}>{CHAT_MODES.find((m) => m.mode === selectedMode)?.label}</span>
            </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content với glassmorphism design hiện đại */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Chat Area (8 columns - tối ưu hơn) */}
              <div className="xl:col-span-8">
                {/* Messages Container - Tăng chiều cao đáng kể */}
                <div className={`relative flex flex-col h-[800px] sm:h-[900px] lg:h-[1000px] xl:h-[1100px] rounded-3xl ${BRAND.borders.glow} border ${BRAND.surfaces.glass} overflow-hidden ${BRAND.shadows.glow} backdrop-blur-xl`}>
                  {/* Header hiện đại với gradient */}
                  <div className={`shrink-0 px-6 py-4 ${BRAND.borders.glass} border-b ${BRAND.gradients.ambient} flex items-center justify-between backdrop-blur-xl`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-3xl ${BRAND.gradients.radial} flex items-center justify-center ${BRAND.shadows.glow}`}>
                        <span className="text-white text-xl">🤖</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white animate-bounce" style={{
                          animation: 'blink 1.5s infinite, gradient-shift 2s ease-in-out infinite, bounce 2s infinite'
                        }}>FTC CHATBOT</h3>
                        <p className="text-sm text-white/80">AI Assistant • {selectedMode === "club" ? "Câu lạc bộ" : "FinTech"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-sm text-white/80 font-medium">Online</span>
                    </div>
                  </div>

                  {/* Vùng messages cuộn bên trong với scroll behavior tối ưu */}
                  <div className={`flex-1 overflow-y-auto px-6 py-4 ${BRAND.gradients.surface} scroll-smooth`} id="chat-scroll-area" style={{
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${BRAND.primary} transparent`
                  }}>
                    {/* Welcome Message */}
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className={`w-24 h-24 rounded-3xl ${BRAND.gradients.radial} flex items-center justify-center mb-6 ${BRAND.shadows.glow}`}>
                          <span className="text-white text-4xl">✨</span>
                        </div>
                        <h3 className={`text-2xl font-bold ${BRAND.text.primary} mb-2`}>Chào mừng đến với FTC Assistant! 👋</h3>
                        <p className={`${BRAND.text.muted} mb-6 max-w-md leading-relaxed`}>
                          Tôi là trợ lý AI, sẵn sàng giúp bạn tìm hiểu về câu lạc bộ FTC và kiến thức công nghệ tài chính.
                        </p>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                          {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendMessage(q)}
                              className={`p-3 text-left rounded-2xl ${BRAND.surfaces.card} ${BRAND.borders.medium} border hover:${BRAND.borders.primary} ${BRAND.states.hover} transition-all text-sm ${BRAND.text.primary} hover:text-[${BRAND.primary}]`}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    <div className="space-y-2">
                      {messages.map((m: ChatMessage) => (
                        <MessageCard key={m.id} m={m} />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Input hiện đại với glassmorphism */}
                  <div className={`shrink-0 ${BRAND.borders.light} border-t px-6 py-5 ${BRAND.surfaces.glass} backdrop-blur-xl sticky bottom-0`}>
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <div className={`flex items-center gap-3 mb-3 text-sm ${BRAND.text.light}`}>
                          {selectedMode === "club" ? (
                            <>
                              <div className={`w-6 h-6 rounded-full ${BRAND.gradients.soft} flex items-center justify-center`}>
                                <span className="text-xs">👥</span>
                              </div>
                              <span className="font-medium">Chế độ Câu lạc bộ</span>
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">FTC</span>
                            </>
                          ) : (
                            <>
                              <div className={`w-6 h-6 rounded-full ${BRAND.gradients.ambient} flex items-center justify-center`}>
                                <span className="text-xs">📚</span>
                              </div>
                              <span className="font-medium">Chế độ Ngành</span>
                              <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300">FinTech</span>
                            </>
                          )}
                        </div>
                        <div className="relative">
                          <Input
                            value={inputValue}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
                            placeholder={selectedMode === "club" ? "Hỏi về FTC, hoạt động, cách tham gia..." : "Hỏi về FinTech, blockchain, ngân hàng số..."}
                            className={`w-full h-12 ${BRAND.surfaces.interactive} ${BRAND.borders.primary} border ${BRAND.text.primary} placeholder:${BRAND.text.placeholder} ${BRAND.states.focus} outline-none transition-all rounded-2xl pr-14 text-sm`}
                            disabled={isSending}
                          />
                          {isSending && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 flex items-center">
                              <div className={`w-5 h-5 border-2 border-gray-400 border-t-blue-400 rounded-full animate-spin`}></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!inputValue.trim() || isSending}
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all text-white",
                          BRAND.shadows.medium,
                          BRAND.states.hover,
                          inputValue.trim() && !isSending 
                            ? `${CHAT_MODES.find(m => m.mode === selectedMode)?.gradient} hover:scale-105` 
                            : `${BRAND.surfaces.interactive} ${BRAND.text.light} cursor-not-allowed`
                        )}
                      >
                        <span className="text-lg">➤</span>
                      </Button>
                    </div>
                    {isSending && (
                      <div className={`mt-3 flex items-center gap-2 text-sm ${BRAND.text.muted}`}>
                        <span className={`animate-pulse text-[${BRAND.primary}]`}>🧠</span>
                        <span>AI đang phân tích câu hỏi của bạn...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar hiện đại (4 columns - cân đối hơn) */}
              <div className="xl:col-span-4 space-y-6">
                {/* Câu hỏi gợi ý - Card hiện đại */}
                <div className={`rounded-3xl ${BRAND.shadows.xl} overflow-hidden ${BRAND.borders.glow} border ${BRAND.surfaces.card} backdrop-blur-xl`}>
                  <div className={`px-6 py-4 ${BRAND.borders.light} border-b ${BRAND.gradients.ambient}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-3xl flex items-center justify-center ${BRAND.gradients.radial}`}>
                        <span className="text-white text-2xl">❔</span>
                      </div>
                      <div>
                        <h3 className={`font-semibold ${BRAND.text.primary}`}>Câu hỏi gợi ý</h3>
                        <p className={`text-sm ${BRAND.text.muted}`}>Bấm để hỏi ngay</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="space-y-3 flex-1 overflow-auto">
                      {SUGGESTED_QUESTIONS.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedMode("club")
                            handleSendMessage(q)
                          }}
                          className={`w-full text-left p-4 rounded-2xl ${BRAND.surfaces.interactive} ${BRAND.states.hover} ${BRAND.borders.light} border transition-all group`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${BRAND.gradients.soft} flex items-center justify-center flex-shrink-0`}>
                              <span className={`text-sm font-semibold text-[${BRAND.primary}]`}>{idx + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${BRAND.text.primary} group-hover:text-[${BRAND.primary}] leading-relaxed`}>{q}</p>
                            </div>
                            <span className={`${BRAND.text.light} group-hover:text-[${BRAND.primary}] opacity-0 group-hover:opacity-100 transition-all`}>➤</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tính năng nổi bật - Card riêng biệt */}
                <div className={`rounded-3xl ${BRAND.shadows.xl} overflow-hidden ${BRAND.borders.glow} border ${BRAND.surfaces.card} backdrop-blur-xl`}>
                  <div className={`px-6 py-4 ${BRAND.borders.light} border-b ${BRAND.gradients.ambient}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-3xl flex items-center justify-center ${BRAND.gradients.radial}`}>
                        <span className="text-white text-2xl">⚡</span>
                      </div>
                      <div>
                        <h3 className={`font-semibold ${BRAND.text.primary}`}>Tính năng nổi bật</h3>
                        <p className={`text-sm ${BRAND.text.muted}`}>Khám phá khả năng AI</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all">
                        <div className={`w-10 h-10 rounded-xl ${BRAND.gradients.soft} flex items-center justify-center flex-shrink-0`}>
                          <span className={`text-[${BRAND.primary}] text-lg`}>🧠</span>
                        </div>
                        <div>
                          <p className={`font-medium ${BRAND.text.primary} text-sm`}>AI thông minh</p>
                          <p className={`text-xs ${BRAND.text.muted}`}>Hiểu ngữ cảnh và phản hồi mạch lạc</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all">
                        <div className={`w-10 h-10 rounded-xl ${BRAND.gradients.ambient} flex items-center justify-center flex-shrink-0`}>
                          <span className={`text-[${BRAND.secondary}] text-lg`}>🌍</span>
                        </div>
                        <div>
                          <p className={`font-medium ${BRAND.text.primary} text-sm`}>Cập nhật kịp thời</p>
                          <p className={`text-xs ${BRAND.text.muted}`}>Kiến thức FinTech tổng quan</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all">
                        <div className={`w-10 h-10 rounded-xl ${BRAND.gradients.soft} flex items-center justify-center flex-shrink-0`}>
                          <span className={`text-[${BRAND.primary}] text-lg`}>💬</span>
                        </div>
                        <div>
                          <p className={`font-medium ${BRAND.text.primary} text-sm`}>Đa chế độ chat</p>
                          <p className={`text-xs ${BRAND.text.muted}`}>Câu lạc bộ & FinTech</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Footer */}
        {/* Footer */}
        <footer className={`mt-16 py-8 ${BRAND.borders.light} border-t ${BRAND.surfaces.glass}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className={`text-sm ${BRAND.text.muted}`}>
              Powered by ⚡ <span className={`font-semibold ${BRAND.text.gradient}`}>FTC AI</span>
              {selectedMode === "industry" && <span className="ml-2">• Demo FinTech Q&A</span>}
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
