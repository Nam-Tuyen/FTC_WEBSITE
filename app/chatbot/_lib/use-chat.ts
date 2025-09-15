"use client"
import { useState } from "react"

type Msg = { id: string; role: "user" | "assistant"; content: string }

function withTimeout<T>(p: Promise<T>, ms = 20000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms)
    p.then(v => { clearTimeout(t); resolve(v) })
     .catch(e => { clearTimeout(t); reject(e) })
  })
}

export function useChat() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)

  async function send(content: string) {
    const user: Msg = { id: crypto.randomUUID(), role: "user", content }
    setMessages(m => [...m, user])
    setLoading(true)
    try {
      const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
      const endpoints = ["/api/chat/gemini", API ? `${API}/chat` : null].filter(Boolean) as string[]

      let res: Response | null = null
      let lastErr: any = null
      for (const url of endpoints) {
        try {
          res = await withTimeout(fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: content }),
          }), 20000)
          if (!res.ok) {
            const txt = await res.text().catch(() => null)
            throw new Error(`Server ${res.status}: ${txt ?? res.statusText}`)
          }
          break
        } catch (e) {
          lastErr = e
          res = null
        }
      }

      if (!res) throw lastErr || new Error("Failed to fetch")

      let text = "Xin lỗi, hiện chưa thể trả lời."
      try {
        const data = await res.json()
        text = data?.answer ?? data?.reply ?? data?.response ?? text
      } catch (e) {
        text = `Không đọc được phản hồi từ server. (status ${res.status})`
      }

      const bot: Msg = { id: crypto.randomUUID(), role: "assistant", content: text }
      setMessages(m => [...m, bot])
    } catch (e: any) {
      const msg = e?.message === "timeout"
        ? "Kết nối quá hạn (timeout). Kiểm tra mạng hoặc backend."
        : `Kết nối server lỗi: ${e?.message ?? e}`
      setMessages(m => [...m, { id: crypto.randomUUID(), role: "assistant", content: msg }])
    } finally {
      setLoading(false)
    }
  }

  return { messages, loading, send }
}
