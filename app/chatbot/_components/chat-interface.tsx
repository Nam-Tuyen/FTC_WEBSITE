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
    setTimeout(() => (document.getElementById("chat-input") as HTMLInputElement | null)?.focus(), 50)
  }

  return (
    <div className="h-full flex items-stretch justify-center p-6">
      <div className="w-[420px] h-full flex flex-col bg-background/70 border border-accent/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header (like Messenger/IG) */}
        <div className="flex items-center gap-3 px-4 py-3 bg-background/80 border-b border-accent/10">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-medium">FTC Chatbot</div>
            <div className="text-xs text-muted-foreground">Cố vấn tân sinh viên • Online</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-muted/30"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-muted"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[url('/placeholder.svg')] bg-center/20 bg-no-repeat">
          <div ref={containerRef} className="p-4 flex-1 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-end ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="mr-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  </div>
                )}

                <div className={`max-w-[78%]`}>
                  <div className={`relative inline-block px-4 py-3 text-sm leading-6 ${m.role === "user" ? "bg-blue-600 text-white rounded-3xl rounded-br-none" : "bg-white/90 text-foreground rounded-3xl rounded-bl-none border border-accent/10"}`}>
                    {/* bubble tail */}
                    {m.role === "user" ? (
                      <svg className="absolute -right-2 bottom-0" width="14" height="14" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M0 10 L10 0 L6 10 Z" fill="#1E90FF" /></svg>
                    ) : (
                      <svg className="absolute -left-2 bottom-0" width="14" height="14" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 L0 0 L4 10 Z" fill="#ffffff" /></svg>
                    )}

                    <div>{m.content}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 ml-2">
                    {typeof (m as any).timestamp !== 'undefined' ? new Date((m as any).timestamp).toLocaleTimeString('vi-VN',{hour:'2-digit', minute:'2-digit'}) : ''}
                  </div>
                </div>

                {m.role === "user" && (
                  <div className="ml-3 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent-foreground"><User className="h-4 w-4"/></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="px-4 py-3 bg-white/80 border-t border-accent/10 flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-muted/20"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-muted"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          <input id="chat-input" value={value} onChange={(e)=>setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Nhập tin nhắn..." className="flex-1 rounded-full px-4 py-2 border border-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/20" />
          <button onClick={(e)=>onSubmit(e)} disabled={isSending || loading} className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md disabled:opacity-50 flex items-center gap-2">
            <Send className="h-4 w-4" /> Gửi
          </button>
        </div>
      </div>
    </div>
  )
}
