"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, MessageCircle, X, Send, User, Loader2 } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

type HistItem = { role: "user" | "model"; content: string }

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Xin chào! Tôi là FTC AI Assistant. Tôi có thể giúp bạn về Câu lạc bộ Công nghệ Tài chính và các chủ đề Fintech. Bạn muốn hỏi gì?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const getBotResponse = async (userMessage: string): Promise<string> => {
    try {
      // Build history for context (last 10 messages)
      const history: HistItem[] = messages.slice(-10).map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        content: msg.content,
      }))

      const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
      const endpoints = ["/api/chat/gemini", API ? `${API}/chat` : null].filter(Boolean) as string[]
      let response: Response | null = null
      let lastError: any = null
      for (const url of endpoints) {
        try {
          response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage, history }),
          })
          if (!response.ok) {
            const txt = await response.text().catch(() => null)
            throw new Error(`Server ${response.status}: ${txt ?? response.statusText}`)
          }
          break
        } catch (err) {
          lastError = err
          console.warn("Fetch to", url, "failed:", err)
          response = null
        }
      }

      if (!response) {
        throw lastError || new Error("Failed to fetch")
      }

      let data: any = null
      try {
        data = await response.json()
      } catch (err) {
        // fallback to plain text
        try {
          const txt = await response.text()
          data = { text: txt }
        } catch (e) {
          data = null
        }
      }

      const candidate = data?.response ?? data?.reply ?? data?.text ?? data?.answer ?? data?.message ?? null
      const text = typeof candidate === 'string' ? candidate.trim() : null

      if (!text) {
        // server returned empty response — provide helpful fallback
        console.error('Empty or unexpected response from chat endpoint:', data)
        return 'Xin lỗi, hiện chưa có thông tin phù hợp. Vui lòng thử lại sau hoặc liên hệ: clbcongnghetaichinh@st.uel.edu.vn'
      }

      // Normalize whitespace and limit runaway repetitions
      const normalized = text.replace(/\s+/g, ' ').replace(/(\b\w+\b)(?:\s+\1){2,}/gi, (m, w) => `${w} ${w}`)
      return normalized
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      return "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ clbcongnghetaichinh@st.uel.edu.vn"
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const botResponse = await getBotResponse(inputValue)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSendMessage()
    }
  }

  function escapeHtml(str: string) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
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
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 h-96 flex flex-col shadow-lg">
          <CardHeader className="border-b p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm">FTC AI Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">{isLoading ? "Đang trả lời..." : "Online"}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start space-x-2 max-w-[85%]`}>
                  {message.sender === "bot" && (
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 text-xs whitespace-pre-wrap ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                  />
                  {message.sender === "user" && (
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-3 py-2 text-xs bg-muted text-foreground">Đang suy nghĩ...</div>
                </div>
              </div>
            )}
          </CardContent>

          <div className="border-t p-3">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 text-sm"
                disabled={isLoading}
              />
              <Button size="sm" onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
