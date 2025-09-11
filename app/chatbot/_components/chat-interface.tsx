"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "../_lib/use-chat"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"

const SUGGESTED = [
  "Câu lạc bộ có những hoạt động gì?",
  "Làm thế nào để tham gia câu lạc bộ?",
  "Các ban trong câu lạc bộ làm gì?",
  "Thời gian sinh hoạt diễn ra khi nào?",
  "Cần kỹ năng gì để ứng tuyển?",
]

export default function ChatInterface() {
  const { messages, loading, send } = useChat()
  const [value, setValue] = useState("")
  const [isSending, setIsSending] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // auto scroll to bottom when messages change
    const el = containerRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    }
  }, [messages, loading])

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (isSending || !value.trim()) return
    setIsSending(true)
    try {
      const text = value.trim()
      setValue("")
      await send(text)
    } catch (err) {
      // send handles errors and shows messages
    } finally {
      setIsSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  function handleSuggestion(q: string) {
    setValue(q)
    // focus input after set
    setTimeout(() => (document.getElementById("chat-input") as HTMLInputElement | null)?.focus(), 50)
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">FTC Chatbot</h2>
            <p className="text-sm text-muted-foreground">Cố vấn thân thiện cho tân sinh viên</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{loading || isSending ? "Đang soạn câu trả lời…" : "Online"}</div>
      </header>

      <main className="bg-background/60 border border-accent/10 rounded-2xl overflow-hidden shadow-sm">
        <div ref={containerRef} className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex items-end gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-[80%] break-words ${m.role === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block px-4 py-3 rounded-2xl text-sm leading-snug shadow-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary/20 text-foreground rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {/* Try to show a time if available */}
                  {typeof (m as any).timestamp === "string" || typeof (m as any).timestamp === "number"
                    ? new Date((m as any).timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                    : ""}
                </div>
              </div>

              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent-foreground">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-accent/10 p-3 bg-gradient-to-r from-background/30 to-background/10">
          <div className="flex gap-2 items-center mb-2 overflow-auto">
            {SUGGESTED.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(q)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-muted/40 text-sm text-foreground hover:bg-muted/60"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              id="chat-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi về CLB hoặc chủ đề bạn quan tâm…"
              autoComplete="off"
              className="flex-1 rounded-full px-4 py-2 border border-accent/10 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="submit"
              disabled={isSending || loading}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span className="text-sm">Gửi</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
