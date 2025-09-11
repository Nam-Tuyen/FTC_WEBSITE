"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "../_lib/use-chat"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Settings, Search } from "lucide-react"

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
  const [showInfo, setShowInfo] = useState(false)
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
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[1100px] h-[88vh] grid grid-cols-[260px_minmax(760px,1fr)] gap-6 items-stretch mx-auto">

        {/* Left column - quick nav */}
        <div className="hidden lg:flex flex-col gap-4">
          <div className="rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-800/40 p-4 border border-slate-800 text-slate-200 shadow">
            <div className="text-sm font-semibold mb-2">Nhanh</div>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/50">🧭 Khám phá</button>
              <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/50">📚 Tài liệu</button>
              <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/50">📝 Tuyển dụng</button>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-800/40 p-4 border border-slate-800 text-slate-200 shadow flex-1">
            <div className="text-sm font-semibold mb-3">Câu hỏi gợi ý</div>
            <div className="flex flex-col gap-2 overflow-auto max-h-[56vh]">
              {SUGGESTED.map((q, i) => (
                <button key={i} onClick={() => handleSuggestion(q)} className="text-left text-sm px-3 py-2 rounded-lg hover:bg-slate-800/50 text-slate-200">{q}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Center chat card */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-6 py-4 bg-[linear-gradient(90deg,rgba(255,255,255,0.02),transparent)] border-b border-slate-800">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
              </Avatar>
              <div>
                <div className="text-lg font-semibold">FTC Chatbot</div>
                <div className="text-xs text-slate-300">Cố vấn tân sinh viên • {loading || isSending ? 'Đang soạn...' : 'Online'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-md hover:bg-slate-800/50"><Search className="h-4 w-4 text-slate-300" /></button>
              <button onClick={() => setShowInfo((s) => !s)} className="p-2 rounded-md hover:bg-slate-800/50"><Settings className="h-4 w-4 text-slate-300" /></button>
            </div>
          </div>

          {/* Message area */}
          <div className="flex-1 overflow-hidden">
            <div ref={containerRef} className="p-8 h-full overflow-y-auto flex flex-col gap-5">
              {messages.map((m) => (
                <div key={m.id} className={`flex items-end ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="mr-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  <div className={`max-w-[70%]`}> 
                    <div className={`relative inline-block px-5 py-3 text-sm leading-6 ${m.role === 'user' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl rounded-br-none shadow-xl' : 'bg-slate-700/90 text-white rounded-3xl rounded-bl-none shadow-sm'}`}>
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white"><User className="h-4 w-4"/></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-8 py-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] border-t border-slate-800">
            <form className="flex items-center gap-4" onSubmit={onSubmit}>
              <input id="chat-input" value={value} onChange={(e)=>setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Nhập câu hỏi hoặc gõ @ để bắt đầu..." autoComplete="off" className="flex-1 rounded-full px-5 py-2 bg-slate-800/70 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 text-sm" />
              <button type="submit" disabled={isSending || loading} className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-xl disabled:opacity-50">
                <Send className="h-5 w-5" /> <span className="text-sm font-semibold">Gửi</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right column - info panel */}
        <div className={`hidden lg:flex flex-col gap-4 ${showInfo ? '' : 'opacity-90'}`}>
          <div className="rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-800/40 p-4 border border-slate-800 text-slate-200 shadow">
            <div className="text-sm font-semibold mb-2">Thông tin nhanh</div>
            <div className="text-xs text-slate-300">Fanpage: https://www.facebook.com/clbfintechuel</div>
            <div className="text-xs text-slate-300 mt-2">Email: clbcongnghetaichinh@st.uel.edu.vn</div>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-800/40 p-4 border border-slate-800 text-slate-200 shadow">
            <div className="text-sm font-semibold mb-2">Gợi ý tiếp theo</div>
            <div className="flex flex-col gap-2 text-xs text-slate-300">
              <button onClick={()=>handleSuggestion('Làm thế nào để ứng tuyển?')} className="text-left px-3 py-2 rounded hover:bg-slate-800/50">Làm thế nào để ứng tuyển?</button>
              <button onClick={()=>handleSuggestion('Thời gian sinh hoạt khi nào?')} className="text-left px-3 py-2 rounded hover:bg-slate-800/50">Thời gian sinh hoạt khi nào?</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
