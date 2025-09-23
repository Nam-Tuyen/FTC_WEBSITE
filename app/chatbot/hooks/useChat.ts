import { useState, useCallback } from 'react'
import { ChatMessage, ChatMode, ChatConfig } from '../types'
import { ENV_CONFIG, UI_CONFIG } from '../constants'

/**
 * Custom hook for managing chat functionality
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedMode, setSelectedMode] = useState<ChatMode>("club")
  const [inputValue, setInputValue] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showModeChangeNotification, setShowModeChangeNotification] = useState(false)

  /**
   * Send message to chat server
   */
  const askServer = useCallback(async ({ mode, question, history }: ChatConfig) => {
    const endpoints = [
      "/api/chat/gemini",
      ENV_CONFIG.BACKEND_URL ? `${ENV_CONFIG.BACKEND_URL}/chat` : null,
    ].filter(Boolean) as string[]

    let lastErr: any = null
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            message: question,
            messages: [...(history || []), { role: "user", content: question }],
          }),
        })
        
        if (!res.ok) {
          const txt = await res.text().catch(() => null)
          console.warn("Server returned non-ok", url, res.status, txt)
          throw new Error(`Server ${res.status}: ${txt ?? res.statusText}`)
        }
        
        const data = await res.json().catch(() => ({}))
        return data.reply || data.response || data.text || data.answer || ""
      } catch (err) {
        lastErr = err
      }
    }
    
    console.error("All chat endpoints failed:", lastErr)
    return "Xin lỗi, có lỗi kết nối. Vui lòng thử lại sau."
  }, [])

  /**
   * Handle sending a message
   */
  const handleSendMessage = useCallback(async (messageOverride?: string) => {
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

    // Add typing indicator
    const typingMsg: ChatMessage = {
      id: "typing",
      role: "assistant",
      content: "Đang suy nghĩ...",
      isTyping: true,
      ts: Date.now()
    }
    setMessages((prev) => [...prev, typingMsg])

    try {
      const history = messages
        .slice(-UI_CONFIG.HISTORY_CONTEXT_LIMIT)
        .map((m) => ({ role: m.role, content: m.content }))
      
      const response = await askServer({ mode: selectedMode, question: q, history })
      
      // Remove typing indicator
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
    } catch (error) {
      // Remove typing indicator
      setMessages((prev) => prev.filter((m) => m.id !== "typing"))
      
      setMessages((prev) => [
        ...prev,
        { 
          id: crypto.randomUUID(), 
          role: "assistant", 
          content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.", 
          ts: Date.now() 
        }
      ])
    } finally {
      setIsSending(false)
    }
  }, [inputValue, isSending, selectedMode, messages, askServer])

  /**
   * Handle mode change with notification
   */
  const handleModeChange = useCallback((mode: ChatMode) => {
    setSelectedMode(mode)
    setShowModeChangeNotification(true)
    setTimeout(() => setShowModeChangeNotification(false), 2000)
  }, [])

  /**
   * Handle message actions (like, copy, share)
   */
  const handleLike = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              isLiked: !m.isLiked,
              reactions: { 
                ...m.reactions, 
                likes: (m.reactions?.likes || 0) + (m.isLiked ? -1 : 1) 
              }
            }
          : m
      )
    )
  }, [])

  const handleCopy = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.warn("Failed to copy to clipboard:", error)
    }
  }, [])

  /**
   * Clear all messages
   */
  const clearChat = useCallback(() => {
    setMessages([])
  }, [])

  return {
    // State
    messages,
    selectedMode,
    inputValue,
    isSending,
    showModeChangeNotification,
    
    // Actions
    setInputValue,
    handleSendMessage,
    handleModeChange,
    handleLike,
    handleCopy,
    clearChat,
  }
}
