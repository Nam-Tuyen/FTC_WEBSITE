// @ts-nocheck
"use client"

import { useEffect, useRef } from "react"

export function useChatScroll(messages) {
  const endRef = useRef(null)

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return endRef
}
