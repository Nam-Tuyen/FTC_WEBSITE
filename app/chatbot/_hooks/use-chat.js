// @ts-nocheck
"use client"

import { useState, useCallback, useRef } from "react"
import { nanoid } from "nanoid"

export function useChat() {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const abortControllerRef = useRef(null)

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: nanoid(),
      content: inputValue.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status)
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          content: data.response,
          role: "assistant",
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request was cancelled")
        return
      }
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
          role: "assistant",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }, [inputValue])

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage]
  )

  return {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleKeyDown,
  }
}
