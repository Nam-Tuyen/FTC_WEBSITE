"use client"

import { useState } from "react"
import type { KeyboardEvent } from "react"
import { getDefaultWelcomeMessage, CONTACT_EMAIL, FANPAGE_URL } from "@/lib/club-faq"
import type { Message } from "@/app/chatbot/_lib/types"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: getDefaultWelcomeMessage(),
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const isSendingRef = { current: false }
  const lastSentRef = { current: { text: "", time: 0 } }

  // Listen for suggested question selections from other components
  React.useEffect(() => {
    function onSelect(e: any) {
      try {
        const q = e?.detail
        if (typeof q === 'string') setInputValue(q)
      } catch (err) {}
    }
    window.addEventListener('chat:selectQuestion', onSelect as EventListener)
    return () => window.removeEventListener('chat:selectQuestion', onSelect as EventListener)
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
      role: "user",
      timestamp: new Date(),
    }

    const history: ChatMessage[] = messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }))

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text, 
          history
        }),
      })

      let reply = ""
      if (res.ok) {
        const data = await res.json()
        reply = data?.response || ""
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          reply || `Xin lỗi, hiện chưa có thông tin phù hợp. Liên hệ: ${CONTACT_EMAIL} hoặc fanpage: ${FANPAGE_URL}.`,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (e) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Xin lỗi, hiện không thể kết nối tới AI. Vui lòng thử lại sau.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsTyping(false)
      isSendingRef.current = false
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const nativeEvent = e.nativeEvent as unknown as { isComposing?: boolean }
      if (nativeEvent?.isComposing) return
      e.preventDefault()
      e.stopPropagation()
      handleSendMessage()
    }
  }

  return {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleKeyDown,
  }
}
