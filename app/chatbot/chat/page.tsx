"use client"

import React, { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, MessageSquare, HelpCircle, Zap, Users, BookOpen } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { getDefaultWelcomeMessage, CONTACT_EMAIL, FANPAGE_URL } from "@/lib/club-faq"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  source?: string
  mode?: "club" | "industry"
}

const suggestedQuestions = [
  "Câu lạc bộ có những hoạt động gì?",
  "Làm thế nào để tham gia câu lạc bộ?",
  "Các ban trong câu lạc bộ làm gì?",
  "Thời gian sinh hoạt diễn ra khi nào?",
  "Cần kỹ năng gì để ứng tuyển?",
  "Câu lạc bộ được thành lập khi nào?",
  "Câu lạc bộ có những thành tích gì?",
]

const suggestionAnswers: Record<string, string> = {
  "Câu lạc bộ có những hoạt động gì?":
    "FTC tổ chức: 1) Workshop/Tech-talk Fintech, 2) Cuộc thi/Thử thách công nghệ, 3) Dự ��n nội bộ (data, blockchain, web/app), 4) Hoạt động gắn kết và mentoring. Xem mục Hoạt động để biết lịch chi tiết.",
  "Làm thế nào để tham gia câu lạc bộ?":
    "Vào trang Ứng tuyển, điền biểu mẫu theo hướng dẫn và hoàn tất phỏng vấn ngắn. Khi có đợt mở đơn, thông báo sẽ đăng trên website/fanpage.",
  "Các ban trong câu lạc bộ làm gì?":
    "CLB có các ban: Học thuật (nội dung/giảng dạy), Sự kiện (tổ chức), Truyền thông (hình ảnh/nội dung), Tài chính cá nhân (giáo dục tài chính), Nhân sự (văn hóa & vận hành).",
  "Thời gian sinh hoạt diễn ra khi n��o?":
    "Sinh hoạt định kỳ buổi tối trong tuần hoặc cuối tuần (tùy giai đoạn). Lịch cụ thể sẽ thông báo trước trên nhóm nội bộ/website.",
  "Cần kỹ năng gì để ứng tuyển?":
    "Cần tinh thần chủ động học, kỹ năng cơ bản về công nghệ/kinh tế tùy vị trí; biết Git/Excel/Python/Thiết kế là lợi thế. Đọc kỹ mô tả ở trang Ứng tuyển.",
}

// Chat modes configuration
const CHAT_MODES = [
  {
    mode: "club" as const,
    label: "Hỏi về câu lạc bộ",
    description: "Thông tin về FTC, hoạt động, cách tham gia",
    icon: Users,
    color: "bg-blue-500"
  },
  {
    mode: "industry" as const,
    label: "Hỏi về ngành",
    description: "Kiến thức FinTech, blockchain, ngân hàng số",
    icon: BookOpen,
    color: "bg-green-500"
  }
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: getDefaultWelcomeMessage(),
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [selectedMode, setSelectedMode] = useState<"club" | "industry">("club")
  const [showModeChangeNotification, setShowModeChangeNotification] = useState(false)

  const handleModeChange = (newMode: "club" | "industry") => {
    setSelectedMode(newMode)
    setShowModeChangeNotification(true)
    setTimeout(() => setShowModeChangeNotification(false), 3000)
  }
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isSendingRef = useRef(false)
  const lastSentRef = useRef<{ text: string; time: number }>({ text: "", time: 0 })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleSendMessage = async (questionText?: string, forceMode?: "club" | "industry") => {
    const text = questionText || inputValue.trim()
    if (!text) return

    if (isSendingRef.current) return
    const now = Date.now()
    if (lastSentRef.current.text === text && now - lastSentRef.current.time < 800) return
    lastSentRef.current = { text, time: now }
    isSendingRef.current = true

    // Determine mode: suggested questions always use club mode, otherwise use selected mode
    const mode = forceMode || (suggestedQuestions.includes(text) ? "club" : selectedMode)

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date(),
      mode: mode
    }

    const history = messages.map((m) => ({
      role: m.sender === "bot" ? "model" : "user",
      content: m.content,
    }))

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
      const endpoints = ['/api/chat/gemini', API ? `${API}/chat` : null].filter(Boolean) as string[]
      let res: Response | null = null
      let lastErr: any = null
      for (const url of endpoints) {
        try {
          res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, history, mode }),
          })
          if (!res.ok) {
            const txt = await res.text().catch(() => null)
            console.warn('Server returned non-ok', url, res.status, txt)
            throw new Error(`Server ${res.status}: ${txt ?? res.statusText}`)
          }
          break
        } catch (err) {
          lastErr = err
          res = null
        }
      }

      if (!res) throw lastErr || new Error('Failed to fetch')

      let reply = ""
      let backendContext: string | undefined
      let source: string | undefined
      try {
        const data = await res.json()
        reply = (typeof data?.reply === "string" && data.reply.trim()) ? data.reply : ((typeof data?.answer === "string" && data.answer.trim()) ? data.answer : ((typeof data?.response === "string" && data.response.trim()) ? data.response : ""))
        backendContext = typeof data?.backendContext === 'string' ? data.backendContext : undefined
        source = typeof data?.source === 'string' ? data.source : undefined
      } catch (err) {
        console.warn('Failed parsing chatbot response JSON', err)
        reply = ""
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          reply || `Xin lỗi, hiện chưa có thông tin phù hợp. Liên hệ: ${CONTACT_EMAIL} hoặc fanpage: ${FANPAGE_URL}.`,
        sender: "bot",
        timestamp: new Date(),
        source,
        mode: mode
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (e) {
      console.error('Chatbot page fetch error:', e)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Xin lỗi, hiện không thể kết nối tới AI. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsTyping(false)
      isSendingRef.current = false
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
    // Auto-send suggested questions with club mode
    setTimeout(() => {
      handleSendMessage(question, "club")
    }, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // @ts-expect-error - browser nativeEvent
      if (e.nativeEvent?.isComposing) return
      e.preventDefault()
      e.stopPropagation()
      handleSendMessage()
    }
  }

  function escapeHtml(str: string) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
  }

  function formatMessageContent(text: string) {
    if (!text) return ""
    const escaped = escapeHtml(text)
    // Handle text formatting: bold, italic, underline
    let out = escaped
      .replace(/__(.+?)__/g, "<u>$1</u>")  // Underline
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")  // Bold
      .replace(/\*(.+?)\*/g, "<em>$1</em>")  // Italic
      // Convert URLs to clickable links
      .replace(/(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">$1</a>')
      // Handle the footer link separately
      .replace(/\[Fanpage\]\((https:\/\/www\.facebook\.com\/clbfintechuel)\)/g, '<a href="$1" target="_blank" class="text-accent hover:underline">Fanpage</a>')

    const lines = out.split(/\r?\n/)
    let inList = false
    let res = ""
    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (line.startsWith("* ")) {
        if (!inList) {
          res += '<ul>'
          inList = true
        }
        res += `<li>${line.slice(2)}</li>`
      } else {
        if (inList) {
          res += "</ul>"
          inList = false
        }
        if (line === "") {
          res += "<br/>"
        } else {
          res += `<p class="mb-1">${line}</p>`
        }
      }
    }
    if (inList) res += "</ul>"
    return res
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      {/* Hero Section (styled like Hoạt động) */}
      <section className="relative min-h-[60vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl animate-float-reverse" />
        </div>

        <div className="relative max-w-[1103px] mx-auto text-center space-y-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-50 blur-2xl animate-pulse"></span>
            <span className="relative bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text animate-text-shine">
              <p>FTC CHATBOT</p>
            </span>
          </h1>
          <div className="text-xl font-normal italic leading-relaxed max-w-[768px] mx-auto">
            <p>
              Giúp bạn tìm hiểu thông tin về câu lạc bộ và kiến thức trong
              lĩnh vực Fintech
            </p>
          </div>
        </div>
      </section>

      {/* Main layout */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 overflow-x-auto">
        <div className="min-w-[1200px] grid grid-cols-[1fr_minmax(720px,800px)_360px_1fr] grid-rows-[auto_auto] gap-8">
          {/* Chat Interface */}
          <div className="col-start-2 col-span-1 row-span-2">
            <Card className="h-full min-h-[70vh] flex flex-col bg-card/20 backdrop-blur-sm border-accent/20 ring-1 ring-accent/10 hover:border-accent/40 transition-all duration-500 hover:glow">
              <CardHeader className="border-b border-accent/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/ai-chatbot-avatar.png" alt="AI Assistant" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">FTC AI Assistant</CardTitle>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          Luôn sẵn sàng hỗ trợ bạn
                          <span className="inline-flex items-center text-xs">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-1" />
                            Online
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mode Selector */}
                  <div className="flex gap-1 bg-accent/10 p-1 rounded-lg">
                    {CHAT_MODES.map((modeConfig) => {
                      const Icon = modeConfig.icon
                      const isSelected = selectedMode === modeConfig.mode
                      return (
                        <Button
                          key={modeConfig.mode}
                          variant={isSelected ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleModeChange(modeConfig.mode)}
                          className={`flex items-center gap-2 transition-all duration-300 ${
                            isSelected 
                              ? `${modeConfig.color} text-white shadow-lg scale-105` 
                              : "hover:bg-accent/30 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="hidden sm:inline font-medium">{modeConfig.label}</span>
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          )}
                        </Button>
                      )
                    })}
                  </div>
                </div>
                
                {/* Mode Description */}
                <div className="mt-3 p-3 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg border border-accent/30">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedMode === "club" ? (
                      <Users className="h-4 w-4 text-blue-500" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm font-semibold text-foreground">
                      Chế độ: {CHAT_MODES.find(m => m.mode === selectedMode)?.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {CHAT_MODES.find(m => m.mode === selectedMode)?.description}
                  </p>
                </div>
              </CardHeader>

              {/* Mode Change Notification */}
              {showModeChangeNotification && (
                <div className="mx-4 mb-2 p-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-accent/30 rounded-lg animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-muted-foreground">
                      Đã chuyển sang chế độ: <strong>{CHAT_MODES.find(m => m.mode === selectedMode)?.label}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[65vh]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      {message.sender === "bot" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <div
                          className={`rounded-2xl px-4 py-3 overflow-hidden break-words ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground glow"
                              : "bg-secondary/20 text-foreground border border-accent/20"
                          }`}
                          dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                        />
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs opacity-70">
                            {hasMounted
                              ? message.timestamp.toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </p>
                          {message.mode && (
                            <div className="flex items-center gap-1 text-xs opacity-70">
                              {message.mode === "club" ? (
                                <>
                                  <Users className="h-3 w-3" />
                                  <span>CLB</span>
                                </>
                              ) : (
                                <>
                                  <BookOpen className="h-3 w-3" />
                                  <span>Ngành</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-accent text-accent-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input */}
              <div className="border-t border-accent/20 pt-4 px-4 pb-0 bg-card/10 backdrop-blur-sm sticky bottom-0 mt-auto">
                {/* Mode Indicator for Input */}
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  {selectedMode === "club" ? (
                    <>
                      <Users className="h-3 w-3 text-blue-500" />
                      <span>Chế độ CLB - Trả lời về thông tin câu lạc bộ</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-3 w-3 text-green-500" />
                      <span>Chế độ Ngành - Trả lời về kiến thức FinTech</span>
                    </>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      selectedMode === "club" 
                        ? "Hỏi về câu lạc bộ, hoạt động, cách tham gia..." 
                        : "Hỏi về FinTech, blockchain, ngân hàng số..."
                    }
                    className="flex-1 w-full"
                  />
                  <Button onClick={handleSendMessage} disabled={!inputValue.trim()} className="glow">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

              </div>
            </Card>
          </div>

          {/* Sidebar: Suggested Questions */}
          <div className="col-start-3 col-span-1">
            <Card className="flex flex-col bg-card/20 backdrop-blur-sm border-accent/20 ring-1 ring-accent/10 hover:border-accent/40 transition-all duration-500 hover:glow">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Câu hỏi gợi ý
                </CardTitle>
                <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-700 font-medium">Tự động dùng chế độ CLB</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Các câu hỏi này sẽ luôn trả lời về thông tin câu lạc bộ
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 flex-1 overflow-y-auto">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-3 bg-transparent whitespace-normal break-words hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-200 group"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex-shrink-0 mt-0.5">
                        <MessageSquare className="h-4 w-4 text-blue-500 group-hover:text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm break-words text-left block">{question}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3 text-blue-400" />
                          <span className="text-xs text-blue-500">Chế độ CLB</span>
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Features */}
          <div className="col-start-3 col-span-1 row-start-2">
            <Card className="bg-card/20 backdrop-blur-sm border-accent/20 ring-1 ring-accent/10 hover:border-accent/40 transition-all duration-500 hover:glow">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Tính năng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Bot className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">AI Thông minh</h4>
                    <p className="text-xs text-muted-foreground">Hiểu ngữ cảnh và trả lời chính xác</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Phản hồi nhanh</h4>
                    <p className="text-xs text-muted-foreground">Trả lời trong vài giây</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Hỗ trợ 24/7</h4>
                    <p className="text-xs text-muted-foreground">Luôn sẵn sàng giúp đỡ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
