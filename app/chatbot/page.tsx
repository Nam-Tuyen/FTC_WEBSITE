"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { cn } from "@/lib/utils"

const animations = {
  fadeIn: "animate-in fade-in duration-500",
  slideUp: "animate-in slide-in-from-bottom-3",
  slideDown: "animate-in slide-in-from-top-3",
  scaleIn: "animate-in zoom-in-50 duration-300",
}
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Commented out to avoid conflict
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ChatMode } from "@/chatbot/types"
import { SUGGESTED_QUESTIONS } from "./constants/suggested-questions"
import { SimpleChatbotSend } from "./components/simple-chatbot-send"
import "./components/chatbot-mobile-optimizations.css"
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
    "/api/chat",
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
          input: question,
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
      // Gọi API mới với mode trong payload
      const history = messages.slice(-6).map((m: ChatMessage) => ({ role: m.role, content: m.content }))
      console.log("Sending to API:", { mode: selectedMode, question: q, history })
      const out = await askServer({ mode: selectedMode, question: q, history })
      console.log("API Response:", out)
      const botText = out || "Xin lỗi, hiện chưa thể trả lời."

      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: botText,
        mode: selectedMode,
        ts: Date.now(),
      }
      setMessages((prev: ChatMessage[]) => [...prev, botMsg])
    } catch (error) {
      console.error("API Error:", error)
      setMessages((prev: ChatMessage[]) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Xin lỗi, hiện chưa thể trả lời.", mode: selectedMode, ts: Date.now() },
      ])
    } finally {
      setIsSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Trên mobile, Enter sẽ xuống dòng, không gửi tin nhắn
    // Chỉ gửi tin nhắn khi bấm nút "➤" 
    if (e.key === "Enter" && !e.shiftKey) {
      // Không preventDefault để cho phép xuống dòng trên mobile
      return
    }
  }

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`
    }
  }, [inputValue])

  return (
    <>
      <div className="min-h-screen bg-[#003663] text-white overflow-hidden">
        <Navigation />

        {/* Mobile Responsive Hero Section */}
        <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl animate-float-reverse" />
          </div>

          <div className="relative max-w-6xl mx-auto text-center space-y-4 sm:space-y-6 lg:space-y-8">
            <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold">
              <span className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-50 blur-2xl animate-pulse"></span>
              <span className="relative text-white animate-bounce" style={{
                animation: 'blink 1.5s infinite, gradient-shift 2s ease-in-out infinite, bounce 2s infinite'
              }}>
                FTC CHATBOT
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground leading-relaxed max-w-4xl mx-auto italic px-4">
              Trợ lý AI thông minh, hỗ trợ giải đáp thông tin về câu lạc bộ và ngành Fintech cho các bạn tân sinh viên
            </p>

            {/* Mode selector với hiệu ứng hiện đại */}
            <div className="mt-8 relative">
              <div className={`absolute inset-0 ${BRAND.gradients.ethereal} rounded-3xl transform transition-all`} />
              {/* Modern Mode Selection Card */}
              <div className="relative group">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 rounded-3xl transform transition-all duration-500 group-hover:scale-[1.02] group-hover:from-blue-500/15 group-hover:via-purple-500/10 group-hover:to-cyan-500/15" />
                
                {/* Glassmorphism Card */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl shadow-black/20 transition-all duration-500 group-hover:shadow-3xl group-hover:shadow-blue-500/10">
                  
                  {/* Modern Header Section */}
                  <div className="text-center mb-8">
                    {/* Animated Icon */}
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-3xl blur-2xl animate-pulse opacity-60 scale-110" />
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
                        <span className="text-3xl sm:text-4xl animate-bounce">🤖</span>
                      </div>
                      {/* Enhanced Floating particles */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-float-particle opacity-80" />
                      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-float-particle opacity-80 animation-delay-300" />
                      <div className="absolute top-1/2 -left-3 w-2 h-2 bg-cyan-400 rounded-full animate-float-particle opacity-70 animation-delay-600" />
                      <div className="absolute top-1/2 -right-3 w-2 h-2 bg-green-400 rounded-full animate-float-particle opacity-70 animation-delay-900" />
                    </div>
                    
                    {/* Title Section */}
                    <div className="space-y-4">
                      <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm mb-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3" />
                        <span className="text-sm font-bold text-blue-300 uppercase tracking-wider">
                          AI CHATBOT
                        </span>
                      </div>
                      
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-glow mb-4">
                        CHỌN CHẾ ĐỘ
                      </h2>
                      
                      <p className="text-lg sm:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
                        Tùy chỉnh trải nghiệm chat của bạn với các chế độ chuyên biệt
                      </p>
                      
                      {/* Status Indicator */}
                      <div className="flex items-center justify-center gap-3 mt-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-400/30">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-sm font-medium text-green-300">Hệ thống sẵn sàng</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                          <span className="text-sm font-medium text-blue-300">AI Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Mode Selection Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {CHAT_MODES.map((mc, index) => {
                      const active = selectedMode === mc.mode
                      return (
                        <button
                          key={mc.mode}
                          onClick={() => handleModeChange(mc.mode)}
                          className={cn(
                            "group/btn relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-500 transform",
                            "flex flex-col items-center text-center gap-3",
                            "border backdrop-blur-sm shadow-lg",
                            "hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]",
                            "animate-slide-in-up",
                            active 
                              ? "bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-cyan-500/30 border-blue-400/50 shadow-blue-500/20 scale-[1.01]"
                              : "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30 hover:shadow-white/5"
                          )}
                          style={{
                            animationDelay: `${index * 150}ms`
                          }}
                        >
                          {/* Simplified Background */}
                          <div className={cn(
                            "absolute inset-0 transition-all duration-500 rounded-2xl",
                            active 
                              ? "bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-cyan-500/15" 
                              : "group-hover/btn:bg-gradient-to-br group-hover/btn:from-white/5 group-hover/btn:to-white/10"
                          )} />
                          
                          {/* Icon Container - Smaller */}
                          <div className={cn(
                            "relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300",
                            "border backdrop-blur-sm shadow-md",
                            active
                              ? "bg-gradient-to-br from-blue-400/30 to-purple-400/30 border-blue-300/50 shadow-blue-500/20 scale-105"
                              : "bg-white/15 border-white/25 group-hover/btn:bg-white/20 group-hover/btn:border-white/35 group-hover/btn:scale-102"
                          )}>
                            <span className="relative text-lg sm:text-xl transition-all duration-300 group-hover/btn:scale-110">
                              {mc.icon}
                            </span>
                            
                            {/* Active Status Indicator - Smaller */}
                            {active && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center shadow-md">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                              </div>
                            )}
                          </div>
                          
                          {/* Content Section - Compact */}
                          <div className="relative space-y-1">
                            <h3 className={cn(
                              "font-bold text-sm sm:text-base transition-all duration-300",
                              active ? "text-white text-glow" : "text-white/90 group-hover/btn:text-white"
                            )}>
                              {mc.label}
                            </h3>
                            <p className={cn(
                              "text-xs sm:text-sm transition-all duration-300 leading-relaxed",
                              active ? "text-white/80" : "text-white/60 group-hover/btn:text-white/80"
                            )}>
                              {mc.mode === 'club' ? 'Thông tin câu lạc bộ FTC' : 'Kiến thức FinTech'}
                            </p>
                            
                            {/* Feature Tags - Smaller */}
                            <div className="flex flex-wrap gap-1 justify-center mt-2">
                              {mc.mode === 'club' ? (
                                <>
                                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30">
                                    CLB
                                  </span>
                                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-400/30">
                                    Hoạt động
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-400/30">
                                    FinTech
                                  </span>
                                  <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-400/30">
                                    Kiến thức
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {/* Selection Indicator - Smaller */}
                          <div className={cn(
                            "absolute bottom-2 left-1/2 transform -translate-x-1/2 transition-all duration-300",
                            active 
                              ? "w-6 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-md" 
                              : "w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full group-hover/btn:w-4"
                          )} />
                        </button>
                      )
                    })}
                  </div>

                  {/* Enhanced Status Notification */}
                  {showModeChangeNotification && (
                    <div className="mt-8 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/10 to-purple-500/20 rounded-3xl blur-sm" />
                      <div className="relative flex items-center gap-4 p-6 bg-gradient-to-r from-green-500/15 to-blue-500/15 rounded-3xl border border-green-400/40 backdrop-blur-xl shadow-2xl animate-in slide-in-from-top-2 duration-700">
                        <div className="relative">
                          <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
                          <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping" />
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-bold text-white mb-1">
                            ✅ Đã chuyển sang chế độ: 
                            <span className="ml-2 text-green-400 text-glow">
                              {CHAT_MODES.find((m) => m.mode === selectedMode)?.label}
                            </span>
                          </p>
                          <p className="text-sm text-white/80">
                            Bạn có thể bắt đầu trò chuyện ngay bây giờ
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-300" />
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-600" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
                          {(SUGGESTED_QUESTIONS || []).slice(0, 4).map((q, i) => (
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
                          <Textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => handleKeyDown(e)}
                            placeholder={selectedMode === "club" ? "Hãy nhập nội dung câu hỏi của bạn về FTC" : "Hỏi nhập nội dung câu hỏi ccuar bạn về ngành Fintech"}
                            className={`w-full min-h-[48px] max-h-32 resize-none ${BRAND.surfaces.interactive} ${BRAND.borders.primary} border ${BRAND.text.primary} placeholder:${BRAND.text.placeholder} ${BRAND.states.focus} outline-none transition-all rounded-2xl pr-14 text-sm py-3`}
                            disabled={isSending}
                            rows={1}
                          />
                          {isSending && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 flex items-center">
                              <div className={`w-5 h-5 border-2 border-gray-400 border-t-blue-400 rounded-full animate-spin`}></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <SimpleChatbotSend
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isSending}
                        isLoading={isSending}
                        className="chatbot-send-button"
                      />
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

              {/* Sidebar (4 columns) - Updated layout */}
              <div className="xl:col-span-4 flex flex-col gap-6 min-h-[600px]">
                {/* Quick Questions - flex-1 để thẳng đáy */}
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden flex-1 flex flex-col">
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="space-y-3 flex-1 overflow-auto">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-3xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                          <span className="text-white text-2xl">❔</span>
                    </div>
                    <div>
                          <h3 className="font-semibold text-white">Câu hỏi gợi ý</h3>
                          <p className="text-sm text-gray-300">Bấm để hỏi ngay</p>
                    </div>
                  </div>
                  
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedMode("club")
                          handleSendMessage(q)
                        }}
                          className="w-full text-left p-4 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-blue-400/50 transition-all group backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                              <span className="text-sm font-semibold text-white">{idx + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white group-hover:text-blue-300 leading-relaxed">{q}</p>
                            </div>
                            <span className="text-gray-400 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">➤</span>
                        </div>
                      </button>
                    ))}
                    </div>
                  </div>
                </div>

                {/* Features - flex-none để cố định */}
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-6 flex-none">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-3xl flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 shadow-lg">
                      <span className="text-white text-2xl">⚡</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Tính năng nổi bật</h3>
                      <p className="text-sm text-gray-300">Khám phá khả năng AI</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-800/50 transition-all backdrop-blur-sm">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white text-lg">🧠</span>
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">AI thông minh</p>
                        <p className="text-xs text-gray-300">Hiểu ngữ cảnh và phản hồi mạch lạc</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-800/50 transition-all backdrop-blur-sm">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white text-lg">🌍</span>
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">Cập nhật kịp thời</p>
                        <p className="text-xs text-gray-300">Kiến thức FinTech tổng quan</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-800/50 transition-all backdrop-blur-sm">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white text-lg">💬</span>
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">Đa chế độ chat</p>
                        <p className="text-xs text-gray-300">Câu lạc bộ & FinTech</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  )
}
