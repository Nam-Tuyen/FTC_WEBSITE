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
    <div className="min-h-[70vh] h-full flex items-center justify-center p-6">
      <div className="w-full max-w-[1200px] h-[85vh] flex bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800">

        {/* Centered chat area (focused) */}
        <div className="flex-1 flex flex-col">
          {/* Header with suggestion chips */}
          <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-800">
            <Avatar className="w-11 h-11">
              <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-xl font-semibold">FTC Chatbot</div>
              <div className="text-xs text-slate-300">Cố vấn tân sinh viên • {loading || isSending ? 'Đang soạn...' : 'Online'}</div>
            </div>
            <div className="text-xs text-slate-400">UEL • FTC</div>
          </div>

          <div className="px-6 py-3 border-b border-slate-800 bg-slate-900">
            <div className="flex gap-2 flex-wrap">
              {SUGGESTED.map((q, i) => (
                <button key={i} onClick={() => handleSuggestion(q)} className="text-sm px-3 py-1 rounded-full bg-slate-800/60 hover:bg-slate-800/40 text-slate-200">{q}</button>
              ))}
            </div>
          </div>
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-800">
            <Avatar className="w-11 h-11">
              <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-xl font-semibold">FTC Chatbot</div>
              <div className="text-xs text-slate-300">Cố vấn tân sinh viên • {loading || isSending ? 'Đang soạn...' : 'Online'}</div>
            </div>
            <div className="text-xs text-slate-400">UEL • FTC</div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
            <div ref={containerRef} className="p-6 h-full overflow-y-auto space-y-6">
              {messages.map((m) => (
                <div key={m.id} className={`flex items-end ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="mr-4">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  <div className={`max-w-[75%]`}> 
                    <div className={`relative inline-block px-6 py-4 text-base leading-7 ${m.role === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-br-none shadow-lg' : 'bg-slate-700 text-white rounded-2xl rounded-bl-none shadow-sm'}`}>
                      {m.role === 'user' ? (
                        <svg className="absolute -right-3 bottom-0" width="18" height="18" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M0 10 L10 0 L6 10 Z" fill="#3B82F6" /></svg>
                      ) : (
                        <svg className="absolute -left-3 bottom-0" width="18" height="18" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 L0 0 L4 10 Z" fill="#374151" /></svg>
                      )}

                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                    <div className="text-xs text-slate-400 mt-2 ml-2">
                      {typeof (m as any).timestamp !== 'undefined' ? new Date((m as any).timestamp).toLocaleTimeString('vi-VN',{hour:'2-digit', minute:'2-digit'}) : ''}
                    </div>
                  </div>

                  {m.role === 'user' && (
                    <div className="ml-4 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white"><User className="h-4 w-4"/></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="px-6 py-5 bg-slate-900 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <input id="chat-input" value={value} onChange={(e)=>setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Nhập câu hỏi hoặc gõ @ để bắt đầu..." autoComplete="off" className="flex-1 rounded-full px-6 py-3 bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button onClick={(e)=>onSubmit(e)} disabled={isSending || loading} className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-md disabled:opacity-50">
                <Send className="h-5 w-5" /> <span className="text-sm font-medium">Gửi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
