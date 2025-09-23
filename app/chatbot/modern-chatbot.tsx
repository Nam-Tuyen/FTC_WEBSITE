import React, { useState, useRef, useEffect, useMemo } from "react"
import {
  Bot,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Send,
  Users,
  Heart,
  Share2,
  Copy,
  Sparkles,
  Settings,
  Mic,
  Zap,
  Brain,
  Globe,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Trash2,
  Info
} from "lucide-react"

// ===== Types =====
type ChatMode = "club" | "industry"
type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  mode?: ChatMode
  ts?: number
  reactions?: { likes?: number; shares?: number }
  isLiked?: boolean
  isTyping?: boolean
}

// ===== Advanced Brand Palette - Modern Color System =====
const BRAND = {
  // Primary Colors
  primary: "#003663",        // Deep Navy
  secondary: "#0e1117",      // Dark Blue-Black
  
  // Tonal Variations
  primary50: "#f0f4f8",      // Very light blue
  primary100: "#d1e0eb",     // Light blue
  primary200: "#a3c2d6",    // Medium light blue
  primary300: "#7498b3",    // Medium blue
  primary400: "#456a8a",    // Medium dark blue
  primary500: "#003663",    // Main primary
  primary600: "#002a4f",    // Darker primary
  primary700: "#001f3b",    // Very dark primary
  primary800: "#001426",    // Extremely dark
  primary900: "#0e1117",    // Secondary (darkest)
  
  // Accent & Complementary
  accent: "#1a5490",         // Bright navy
  accentLight: "#2563eb",    // Lighter accent
  warm: "#f59e0b",          // Golden yellow for highlights
  warmLight: "#fbbf24",     // Light warm
  
  // Gradients - Modern & Sophisticated
  gradients: {
    primary: "bg-gradient-to-r from-[#003663] to-[#0e1117]",
    primaryReverse: "bg-gradient-to-r from-[#0e1117] to-[#003663]",
    radial: "bg-gradient-to-br from-[#003663] via-[#1a5490] to-[#0e1117]",
    soft: "bg-gradient-to-br from-[#003663]/10 via-[#1a5490]/5 to-[#0e1117]/10",
    text: "bg-gradient-to-r from-[#003663] via-[#1a5490] to-[#0e1117] bg-clip-text text-transparent",
    glow: "bg-gradient-to-r from-[#003663]/20 via-[#1a5490]/30 to-[#0e1117]/20",
    glass: "bg-gradient-to-br from-white/10 via-[#003663]/5 to-[#0e1117]/10",
    surface: "bg-gradient-to-br from-white via-[#f0f4f8] to-white",
    ethereal: "bg-gradient-to-br from-[#003663]/5 via-transparent to-[#0e1117]/5",
    ambient: "bg-gradient-to-r from-[#003663]/10 via-[#1a5490]/5 to-[#0e1117]/10"
  },
  
  // Surfaces & Backgrounds
  surfaces: {
    primary: "bg-white",
    secondary: "bg-gradient-to-br from-[#f0f4f8] to-white",
    glass: "bg-white/80 backdrop-blur-xl",
    darkGlass: "bg-[#0e1117]/90 backdrop-blur-xl",
    card: "bg-white/95 backdrop-blur-sm",
    panel: "bg-gradient-to-br from-[#003663]/5 via-white to-[#0e1117]/5",
    hover: "hover:bg-gradient-to-br hover:from-[#003663]/10 hover:to-[#0e1117]/10",
    interactive: "bg-gradient-to-br from-white/90 to-[#f0f4f8]/90 backdrop-blur-sm"
  },
  
  // Borders & Outlines
  borders: {
    light: "border-gray-100",
    medium: "border-gray-200",
    primary: "border-[#003663]/20",
    glass: "border-white/20",
    glow: "border-[#003663]/30 shadow-[0_0_20px_rgba(0,54,99,0.15)]",
    accent: "border-[#1a5490]/30"
  },
  
  // Text Colors
  text: {
    primary: "text-[#0e1117]",
    secondary: "text-[#003663]",
    muted: "text-gray-600",
    light: "text-gray-500",
    gradient: "bg-gradient-to-r from-[#003663] via-[#1a5490] to-[#0e1117] bg-clip-text text-transparent",
    white: "text-white",
    whiteAlpha: "text-white/90"
  },
  
  // Shadows & Effects
  shadows: {
    soft: "shadow-sm",
    medium: "shadow-md",
    large: "shadow-lg shadow-[#003663]/10",
    xl: "shadow-xl shadow-[#003663]/15",
    glow: "shadow-2xl shadow-[#003663]/25",
    inner: "shadow-inner shadow-[#0e1117]/10",
    ambient: "shadow-2xl shadow-[#003663]/20"
  },
  
  // Interactive States
  states: {
    hover: "hover:shadow-lg hover:shadow-[#003663]/20 hover:scale-[1.02]",
    active: "active:scale-[0.98]",
    focus: "focus:ring-2 focus:ring-[#003663]/30 focus:border-[#003663]",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed"
  }
}

// ===== Content =====
const CHAT_MODES = [
  {
    mode: "club" as ChatMode,
    label: "Câu lạc bộ",
    description: "Tìm hiểu về FTC, hoạt động và cách tham gia",
    gradient: BRAND.gradients.primary,
    lightGradient: BRAND.gradients.soft
  },
  {
    mode: "industry" as ChatMode,
    label: "FinTech",
    description: "Khám phá kiến thức công nghệ tài chính",
    gradient: BRAND.gradients.primaryReverse,
    lightGradient: BRAND.gradients.ambient
  }
]

const SUGGESTED_QUESTIONS = [
  "Câu lạc bộ có những hoạt động gì?",
  "Làm thế nào để tham gia câu lạc bộ?",
  "Các ban trong câu lạc bộ làm gì?",
  "Thời gian sinh hoạt diễn ra khi nào?",
  "Cần kỹ năng gì để ứng tuyển?",
  "Câu lạc bộ được thành lập khi nào?",
  "Câu lạc bộ có những thành tích gì?"
]

// ===== Mock API =====
const askServer = async ({ mode, question, history }: any) => {
  await new Promise((r) => setTimeout(r, 1000))
  const responses = {
    club: [
      "FTC triển khai hệ sinh thái hoạt động học thuật và trải nghiệm thực tế gồm workshop, talkshow, training dự án dữ liệu, AI trong tài chính, ngân hàng số… thành viên được mentor theo lộ trình.",
      "Để tham gia, theo dõi Fanpage để cập nhật đợt tuyển và điền form ứng tuyển. Ban Nhân sự sẽ liên hệ, định hướng và hướng dẫn các bước tiếp theo.",
      "Cơ cấu gồm 5 ban: Học thuật (nội dung, đào tạo), Sự kiện (kế hoạch & vận hành), Truyền thông (kênh số, thiết kế), Tài chính cá nhân (đào tạo MoneyWe), Nhân sự (tuyển & phát triển)."
    ],
    industry: [
      "FinTech là việc ứng dụng công nghệ để cải thiện và tự động hóa dịch vụ tài chính: thanh toán số, eKYC, ngân hàng mở, dữ liệu lớn, AI, blockchain và bảo mật.",
      "Blockchain là sổ cái phân tán, bất biến theo khối — giúp ghi nhận giao dịch minh bạch, giảm chi phí đối soát và mở ra các mô hình tài chính phi tập trung.",
      "Ngân hàng số đưa dịch vụ lên di động/web với trải nghiệm end-to-end: mở tài khoản eKYC, chuyển tiền tức thì, tiết kiệm/đầu tư online, tích hợp hóa đơn, QR, ví."
    ]
  }
  const pool = responses[mode] || responses.club
  return pool[Math.floor(Math.random() * pool.length)]
}

// ===== Component =====
export default function ModernFTCChatbot() {
  const [selectedMode, setSelectedMode] = useState<ChatMode>("club")
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const currentMode = useMemo(
    () => CHAT_MODES.find((m) => m.mode === selectedMode) || CHAT_MODES[0],
    [selectedMode]
  )

  const handleSendMessage = async (messageOverride?: string) => {
    const q = (messageOverride || inputValue).trim()
    if (!q || isSending) return

    const newUserMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: q,
      mode: selectedMode,
      ts: Date.now()
    }
    setMessages((prev) => [...prev, newUserMsg])
    if (!messageOverride) setInputValue("")
    setIsSending(true)

    const typingMsg: ChatMessage = {
      id: "typing",
      role: "assistant",
      content: "Đang suy nghĩ...",
      isTyping: true,
      ts: Date.now()
    }
    setMessages((prev) => [...prev, typingMsg])

    try {
      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
      const response = await askServer({ mode: selectedMode, question: q, history })
      setMessages((prev) => prev.filter((m) => m.id !== "typing"))
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
        mode: selectedMode,
        ts: Date.now(),
        reactions: { likes: 0, shares: 0 }
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== "typing"))
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.", ts: Date.now() }
      ])
    } finally {
      setIsSending(false)
    }
  }

  const handleLike = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              isLiked: !m.isLiked,
              reactions: { ...m.reactions, likes: (m.reactions?.likes || 0) + (m.isLiked ? -1 : 1) }
            }
          : m
      )
    )
  }

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch {
      // no-op
    }
  }

  const clearChat = () => setMessages([])

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

  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.role === "user"
    const isTyping = message.isTyping
    return (
      <div className={`flex gap-4 mb-6 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-3xl flex items-center justify-center ${BRAND.shadows.medium} ${
              isUser 
                ? `${BRAND.surfaces.glass} ${BRAND.borders.primary} border` 
                : BRAND.gradients.radial
            }`}
          >
            {isUser ? (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${BRAND.gradients.primary}`}>
                <span className="text-sm font-bold text-white">U</span>
              </div>
            ) : (
              <Bot className="h-6 w-6 text-white" />
            )}
          </div>
        </div>

        <div className={`flex-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
          <div
            className={`relative rounded-3xl px-6 py-4 ${BRAND.shadows.large} ${
              isUser
                ? `text-white ${BRAND.gradients.radial}`
                : `${BRAND.surfaces.card} ${BRAND.borders.glow} border`
            }`}
          >
            {isTyping ? <TypingIndicator /> : <div className="text-sm leading-relaxed">{message.content}</div>}

            <div className={`text-xs mt-3 ${isUser ? "text-white/70" : BRAND.text.light}`}>
              {message.ts
                ? new Date(message.ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                : ""}
            </div>
          </div>

          {!isUser && !isTyping && (
            <div className="flex items-center gap-2 mt-3 ml-2">
              <button
                aria-label="Thích"
                onClick={() => handleLike(message.id)}
                className={`p-2 rounded-full transition-all ${BRAND.states.hover} group ${BRAND.surfaces.hover}`}
              >
                <Heart
                  className={`h-4 w-4 ${message.isLiked ? "text-red-500" : `${BRAND.text.light} group-hover:text-red-500`}`}
                  fill={message.isLiked ? "currentColor" : "none"}
                />
              </button>
              <button
                aria-label="Sao chép"
                onClick={() => handleCopy(message.content)}
                className={`p-2 rounded-full transition-all ${BRAND.states.hover} group ${BRAND.surfaces.hover}`}
              >
                <Copy className={`h-4 w-4 ${BRAND.text.light} group-hover:text-[${BRAND.primary}]`} />
              </button>
              <button 
                aria-label="Chia sẻ" 
                className={`p-2 rounded-full transition-all ${BRAND.states.hover} group ${BRAND.surfaces.hover}`}
              >
                <Share2 className={`h-4 w-4 ${BRAND.text.light} group-hover:text-[${BRAND.secondary}]`} />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ 
      background: `linear-gradient(140deg, ${BRAND.primary50} 0%, #ffffff 40%, ${BRAND.primary100} 100%)` 
    }}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl ${BRAND.borders.light} border-b ${BRAND.shadows.soft} ${BRAND.surfaces.glass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-3xl flex items-center justify-center ${BRAND.shadows.medium} ${BRAND.gradients.radial}`}>
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${BRAND.text.gradient}`}>FTC Assistant</h1>
                <p className={`text-sm ${BRAND.text.muted}`}>AI-Powered Chatbot</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {CHAT_MODES.map((mode) => {
                const Icon = mode.mode === "club" ? Users : BookOpen
                const isActive = selectedMode === mode.mode
                return (
                  <button
                    key={mode.mode}
                    onClick={() => setSelectedMode(mode.mode)}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all duration-300 ${BRAND.states.hover} ${
                      isActive 
                        ? `${mode.gradient} text-white ${BRAND.shadows.medium} scale-105` 
                        : `${BRAND.surfaces.interactive} ${BRAND.text.muted} hover:${BRAND.text.secondary}`
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {mode.label}
                  </button>
                )
              })}

              <div className="relative">
                <button
                  onClick={() => setShowQuickActions((v) => !v)}
                  className={`ml-2 p-2 rounded-2xl transition-colors ${BRAND.surfaces.hover}`}
                  aria-label="Tùy chọn"
                >
                  <Settings className={`h-4 w-4 ${BRAND.text.muted}`} />
                </button>
                {showQuickActions && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-3xl ${BRAND.borders.medium} border ${BRAND.surfaces.glass} ${BRAND.shadows.xl} p-2`}>
                    <button
                      onClick={clearChat}
                      className={`w-full flex items-center gap-2 p-2 rounded-2xl ${BRAND.surfaces.hover} text-sm ${BRAND.text.primary}`}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                      Xóa hội thoại
                    </button>
                    <div className={`mt-1 p-2 rounded-2xl ${BRAND.gradients.soft} text-xs ${BRAND.text.muted} flex items-start gap-2`}>
                      <Info className={`h-4 w-4 text-[${BRAND.primary}]`} />
                      Ở chế độ FinTech, câu trả lời định hướng theo kiến thức tổng quan (mock data demo).
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Chat */}
          <div className="lg:col-span-8">
            <div className={`rounded-3xl ${BRAND.shadows.xl} overflow-hidden ${BRAND.borders.glow} border ${BRAND.surfaces.card}`}>
              {/* Chat Header */}
              <div className={`px-6 py-4 ${BRAND.borders.light} border-b ${currentMode.lightGradient}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${currentMode.gradient} animate-pulse`} />
                    <div>
                      <h2 className={`font-semibold ${BRAND.text.primary}`}>Chế độ {currentMode.label}</h2>
                      <p className={`text-sm ${BRAND.text.muted}`}>{currentMode.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className={`h-[600px] overflow-y-auto p-6 ${BRAND.gradients.surface}`}>
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 ${BRAND.shadows.glow} ${BRAND.gradients.radial}`}>
                      <Sparkles className="h-12 w-12 text-white" />
                    </div>
                    <h3 className={`text-2xl font-bold ${BRAND.text.primary} mb-2`}>Chào mừng bạn đến với FTC Assistant! 👋</h3>
                    <p className={`${BRAND.text.muted} max-w-md leading-relaxed`}>
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
                ) : (
                  <div className="space-y-1">
                    {messages.map((m) => (
                      <MessageBubble key={m.id} message={m} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className={`px-6 py-4 ${BRAND.borders.light} border-t ${BRAND.surfaces.primary}`}>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        placeholder={`Hỏi về ${currentMode.label.toLowerCase()}...`}
                        className={`w-full px-4 py-3 rounded-2xl ${BRAND.borders.medium} border ${BRAND.states.focus} outline-none transition-all ${BRAND.gradients.ethereal} ${BRAND.text.primary} placeholder-gray-500`}
                        disabled={isSending}
                        aria-label="Ô nhập câu hỏi"
                      />
                      <button
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl ${BRAND.surfaces.hover} transition-colors`}
                        aria-label="Ghi âm"
                      >
                        <Mic className={`h-4 w-4 ${BRAND.text.muted}`} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isSending}
                    className={`p-3 rounded-2xl transition-all ${BRAND.shadows.medium} ${BRAND.states.hover} ${
                      inputValue.trim() && !isSending 
                        ? `${currentMode.gradient} text-white hover:scale-105` 
                        : `${BRAND.surfaces.interactive} ${BRAND.text.light} cursor-not-allowed`
                    }`}
                    aria-label="Gửi"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {isSending && (
                  <div className={`mt-3 flex items-center gap-2 text-sm ${BRAND.text.muted}`}>
                    <Brain className={`h-4 w-4 animate-pulse text-[${BRAND.primary}]`} />
                    <span>AI đang phân tích câu hỏi của bạn...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Questions */}
            <div className={`rounded-3xl ${BRAND.shadows.xl} overflow-hidden ${BRAND.borders.glow} border ${BRAND.surfaces.card}`}>
              <div className={`px-6 py-4 ${BRAND.borders.light} border-b ${BRAND.gradients.ambient}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-3xl flex items-center justify-center ${BRAND.gradients.radial}`}>
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${BRAND.text.primary}`}>Câu hỏi gợi ý</h3>
                    <p className={`text-sm ${BRAND.text.muted}`}>Bấm để hỏi ngay</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  {SUGGESTED_QUESTIONS.slice(0, isExpanded ? SUGGESTED_QUESTIONS.length : 5).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedMode("club")
                        handleSendMessage(q)
                      }}
                      className={`w-full text-left p-4 rounded-2xl ${BRAND.gradients.ethereal} hover:${BRAND.gradients.ambient} hover:${BRAND.borders.accent} ${BRAND.borders.light} border transition-all group`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${BRAND.gradients.soft} flex items-center justify-center flex-shrink-0`}>
                          <span className={`text-sm font-semibold text-[${BRAND.primary}]`}>{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${BRAND.text.primary} group-hover:text-[${BRAND.primary}] leading-relaxed`}>{q}</p>
                        </div>
                        <ArrowRight className={`h-4 w-4 ${BRAND.text.light} group-hover:text-[${BRAND.primary}] opacity-0 group-hover:opacity-100 transition-all`} />
                      </div>
                    </button>
                  ))}
                </div>

                {SUGGESTED_QUESTIONS.length > 5 && (
                  <button
                    onClick={() => setIsExpanded((v) => !v)}
                    className={`w-full mt-4 p-3 rounded-2xl ${BRAND.borders.medium} border ${BRAND.surfaces.hover} transition-colors flex items-center justify-center gap-2 text-sm font-medium ${BRAND.text.muted}`}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Thu gọn
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Xem thêm {SUGGESTED_QUESTIONS.length - 5} câu hỏi
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Features */}
            <div className={`rounded-3xl ${BRAND.shadows.xl} ${BRAND.borders.glow} border ${BRAND.surfaces.card} p-6`}>
              <h3 className={`font-semibold ${BRAND.text.primary} mb-4 flex items-center gap-2`}>
                <Zap className={`h-5 w-5 text-[${BRAND.primary}]`} />
                Tính năng nổi bật
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${BRAND.gradients.soft} flex items-center justify-center flex-shrink-0`}>
                    <Brain className={`h-5 w-5 text-[${BRAND.primary}]`} />
                  </div>
                  <div>
                    <p className={`font-medium ${BRAND.text.primary} text-sm`}>AI thông minh</p>
                    <p className={`text-xs ${BRAND.text.muted}`}>Hiểu ngữ cảnh và phản hồi mạch lạc</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${BRAND.gradients.ambient} flex items-center justify-center flex-shrink-0`}>
                    <Globe className={`h-5 w-5 text-[${BRAND.secondary}]`} />
                  </div>
                  <div>
                    <p className={`font-medium ${BRAND.text.primary} text-sm`}>Cập nhật kịp thời</p>
                    <p className={`text-xs ${BRAND.text.muted}`}>Kiến thức FinTech tổng quan (demo)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${BRAND.gradients.soft} flex items-center justify-center flex-shrink-0`}>
                    <MessageSquare className={`h-5 w-5 text-[${BRAND.primary}]`} />
                  </div>
                  <div>
                    <p className={`font-medium ${BRAND.text.primary} text-sm`}>Đa chế độ chat</p>
                    <p className={`text-xs ${BRAND.text.muted}`}>Câu lạc bộ & FinTech</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className={`rounded-3xl ${BRAND.shadows.glow} text-white p-6 ${BRAND.gradients.radial}`}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Thống kê hoạt động
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">1,234+</div>
                  <div className="text-sm text-white/80">Câu hỏi đã giải đáp</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm text-white/80">Độ hài lòng</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <p className="text-sm text-center">🚀 Tối ưu hóa bởi AI hiện đại</p>
              </div>
            </div>
          </div>
        </div>
      </main>

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
  )
}
