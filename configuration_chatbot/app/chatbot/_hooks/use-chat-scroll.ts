"use client"

import { useEffect, useRef } from "react"
import type { Message } from "../_lib/types"

export function useChatScroll(messages: Message[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return messagesEndRef
}
