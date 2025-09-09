"use client"

import React, { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, MessageSquare, HelpCircle, Zap } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { getDefaultWelcomeMessage, CONTACT_EMAIL, FANPAGE_URL } from "@/lib/club-faq"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  source?: string
  citations?: string[]
}

const suggestedQuestions = [
  "Câu lạc bộ có những hoạt động gì?",
  "Làm thế nào để tham gia câu lạc bộ?",
  "Các ban trong câu lạc bộ làm gì?",
  "Thời gian sinh hoạt diễn ra khi nào?",
  "Cần kỹ năng gì để ứng tuyển?",
]

const suggestionAnswers: Record<string, string> = {
  "Câu lạc bộ có những hoạt động gì?":
    "FTC tổ chức: 1) Workshop/Tech-talk Fintech, 2) Cuộc thi/Thử thách công nghệ, 3) Dự án nội bộ (data, blockchain, web/app), 4) Hoạt động gắn kết và mentoring. Xem mục Hoạt động để biết lịch chi tiết.",
  "Làm thế nào để tham gia câu lạc bộ?":
    "Vào trang Ứng tuyển, điền biểu mẫu theo hướng dẫn và hoàn tất phỏng vấn ngắn. Khi có đợt mở đơn, thông báo sẽ đăng trên website/fanpage.",
  "Các ban trong câu lạc bộ làm gì?":
    "CLB có các ban: Học thuật (nội dung/giảng dạy), Sự kiện (tổ chức), Truyền thông (hình ảnh/nội dung), Tài chính cá nhân (giáo dục tài chính), Nhân sự (văn hóa & vận hành).",
  "Thời gian sinh hoạt diễn ra khi nào?":
    "Sinh hoạt định kỳ buổi tối trong tuần hoặc cuối tuần (tùy giai đoạn). Lịch cụ thể sẽ thông báo trước trên nhóm nội bộ/website.",
  "Cần kỹ năng gì để ứng tuyển?":
    "Cần tinh thần chủ động học, kỹ năng cơ bản về công nghệ/kinh tế tùy vị trí; biết Git/Excel/Python/Thiết kế là lợi thế. Đọc kỹ mô tả ở trang Ứng tuyển.",
}

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
  const [mode, setMode] = useState<'auto' | 'club' | 'domain'>('auto')
  const [showCitations, setShowCitations] = useState(true)
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

  const handleSendMessage = async () => {
    const text = inputValue.trim()
    if (!text) return

    if (isSendingRef.current) return
    const now = Date.now()
    if (lastSentRef.current.text === text && now - lastSentRef.current.time < 800) return
    lastSentRef.current = { text, time: now }
    isSendingRef.current = true

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date(),
    }

    const history = messages.map((m) => ({
      role: m.sender === "bot" ? "model" : "user",
      content: m.content,
    }))

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history, mode, showCitations }),
      })

      let reply = ""
      let backendContext: string | undefined
      let source: string | undefined
      if (res.ok) {
        const data = await res.json()
        reply = typeof data?.response === "string" && data.response.trim() ? data.response : ""
        backendContext = typeof data?.backendContext === 'string' ? data.backendContext : undefined
        source = typeof data?.source === 'string' ? data.source : undefined
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          reply || `Xin lỗi, hiện chưa có thông tin phù hợp. Liên hệ: ${CONTACT_EMAIL} hoặc fanpage: ${FANPAGE_URL}.`,
        sender: "bot",
        timestamp: new Date(),
        source,
        citations: backendContext ? backendContext.split('\n').slice(0,5) : undefined,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (e) {
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
    let out = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
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

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-foreground mb-6">
            <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent animate-pulse uppercase tracking-wide">
              AI CHATBOT
            </span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty">
            <em>Tr��� lý AI giúp bạn tìm hiểu về câu lạc bộ và các kiến thức Fintech</em>
          </p>
        </div>
      </section>

      {/* Main layout */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 overflow-x-auto">
        <div className="min-w-[1200px] grid grid-cols-[1fr_minmax(720px,800px)_360px_1fr] grid-rows-[auto_auto] gap-8">
          {/* Chat Interface */}
          <div className="col-start-2 col-span-1 row-span-2">
            <Card className="h-full min-h-[70vh] flex flex-col bg-card/20 backdrop-blur-sm border-accent/20 ring-1 ring-accent/10 hover:border-accent/40 transition-all duration-500 hover:glow">
              <CardHeader className="border-b border-accent/20">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/ai-chatbot-avatar.png" alt="AI Assistant" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">FinTech AI Assistant</CardTitle>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        Luôn sẵn sàng hỗ trợ bạn
                        <span className="inline-flex items-center text-xs">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-1" />
                          Online
                        </span>
                      </p>

                      <div className="ml-4 flex items-center gap-3">
                        <Label className="text-xs">Chế độ:</Label>
                        <RadioGroup value={mode} onValueChange={(v) => setMode(v as any)} className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <RadioGroupItem value="club" />
                            <span className="text-xs">Hỏi về câu lạc bộ</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <RadioGroupItem value="domain" />
                            <span className="text-xs">Hỏi về ngành</span>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="ml-4 flex items-center gap-2">
                        <Checkbox checked={showCitations} onCheckedChange={(v: any) => setShowCitations(!!v)} />
                        <Label className="text-xs">Hiển thị trích dẫn backend</Label>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">Grounding: <strong>Hybrid</strong> (mặc định)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

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
                      <div
                        className={`rounded-2xl px-4 py-3 overflow-hidden break-words ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground glow"
                            : "bg-secondary/20 text-foreground border border-accent/20"
                        }`}
                        dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                      />
                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground bg-background/20 p-2 rounded-md border border-primary/10">
                          <div className="font-semibold text-[12px] mb-1">Trích dẫn backend:</div>
                          <ul className="list-disc pl-4">
                            {message.citations.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {hasMounted
                          ? message.timestamp.toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>
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
              <div className="border-t border-accent/20 p-4 bg-card/10 backdrop-blur-sm sticky bottom-0 mt-auto">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập câu hỏi của bạn..."
                    className="flex-1"
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
              </CardHeader>
              <CardContent className="space-y-2 flex-1 overflow-y-auto">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-3 bg-transparent whitespace-normal break-words"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm break-words">{question}</span>
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
