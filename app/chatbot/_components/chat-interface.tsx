"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "../_lib/use-chat"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null)
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
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800 p-4 border border-slate-800 text-slate-200 shadow flex-1">
            <div className="text-sm font-semibold mb-3" style={{textAlign: 'center'}}><p className="uppercase">CÂU HỎI GỢI Ý</p></div>
            <div className="grid gap-3">
              {SUGGESTED.map((q, i) => {
                const selected = selectedSuggestion === i
                return (
                  <button
                    key={i}
                    onClick={() => { setSelectedSuggestion(i); handleSuggestion(q) }}
                    aria-pressed={selected}
                    className={`text-left text-sm px-3 py-2 rounded-md transition-all duration-150 ${selected ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-md' : 'bg-slate-800/50 hover:bg-slate-800/40 text-slate-100 shadow-sm'}`}
                  >
                    {q}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Center chat card */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">

          {/* Header - centered uppercase title with effect */}
    <div className="px-6 py-4 bg-[linear-gradient(90deg,rgba(255,255,255,0.02),transparent)] border-b border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 w-28">
          <Avatar className="w-12 h-12 ring-1 ring-indigo-500/30 shadow-md overflow-hidden">
                <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
        </div>

        <div className="flex-1 text-center">
          <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-extrabold uppercase tracking-widest leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-emerald-300 to-indigo-200 animate-pulse" style={{fontWeight:800, letterSpacing: '3px'}}>
            <p>CHATBOT NHÀ ÉP</p>
          </h2>
          <div className="mt-1 text-xs text-slate-300">Online</div>
        </div>

        <div className="flex items-center gap-3 w-28 justify-end">
          <button className="p-2 rounded-md hover:bg-slate-800/50"><Search className="h-4 w-4 text-slate-300" /></button>
          <button onClick={() => setShowInfo((s) => !s)} className="p-2 rounded-md hover:bg-slate-800/50"><Settings className="h-4 w-4 text-slate-300" /></button>
        </div>
      </div>

      <div className="mt-3 flex justify-center">
        <div className="h-1 w-36 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 animate-pulse" />
      </div>
    </div>

          {/* Message area */}
          <div className="flex-1 overflow-hidden">
            <div ref={containerRef} className="p-8 h-full overflow-y-auto flex flex-col gap-5">
              {messages.map((m) => (
                <div key={m.id} className={`flex items-end ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="mr-4">
                      <Avatar className="w-10 h-10 ring-1 ring-indigo-400/25 shadow-sm overflow-hidden">
                        <AvatarImage src="/placeholder-logo.svg" alt="FTC" className="object-cover" />
                        <AvatarFallback className="bg-primary text-primary-foreground">FTC</AvatarFallback>
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


      </div>
    </div>
  )
}
