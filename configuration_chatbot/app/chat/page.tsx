'use client'
import { useEffect, useState } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function ChatPage() {
  const [showPreface, setShowPreface] = useState(false)
  const [preface, setPreface] = useState('')
  const [mode, setMode] = useState<'club' | 'major'>('club')
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setShowPreface(true)
  }, [])

  async function ask(q: string) {
    setLoading(true)
    try {
      const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''
      const endpoints = ['/api/chat/gemini', API ? `${API}/chat` : null].filter(Boolean) as string[]
      let res: Response | null = null
      let lastErr: any = null
      for (const url of endpoints) {
        try {
          res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode, message: q, history: messages }),
          })
          if (!res.ok) {
            const txt = await res.text().catch(() => null)
            console.warn('Server returned non-ok', url, res.status, txt)
            throw new Error(`Server ${res.status}: ${txt ?? res.statusText}`)
          }
          break
        } catch (err) {
          lastErr = err
          res = null
        }
      }

      if (!res) throw lastErr || new Error('Failed to fetch')

      const data = await res.json()
      if (data.preface && !preface) setPreface(data.preface)
      if (data.reply) setMessages((m) => [...m, { role: 'user', content: q }, { role: 'assistant', content: data.reply }])
      else setMessages((m) => [...m, { role: 'user', content: q }, { role: 'assistant', content: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại.' }])
    } catch (err) {
      console.error('Chat ask error:', err)
      setMessages((m) => [...m, { role: 'user', content: q }, { role: 'assistant', content: 'Đã xảy ra lỗi. Vui lòng thử lại.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      {showPreface && (
        <div className="fixed inset-0 grid place-items-center z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPreface(false)} />
          <div className="relative bg-white max-w-lg w-[92%] rounded-2xl shadow-xl p-5">
            <div className="text-lg font-semibold mb-2">FTC AI Assistant</div>
            <pre className="text-sm whitespace-pre-wrap">{preface || `Xin chào! Tôi là FTC AI Assistant.\n\nTôi có thể giúp bạn:\n• Trả lời câu hỏi về câu lạc bộ\n• Giải thích khái niệm Fintech\n• Hướng dẫn tham gia hoạt động\n• Tìm thông tin trên website\n\n📮 Liên hệ: clbcongnghetaichinh@st.uel.edu.vn\n📘 Fanpage: https://www.facebook.com/clbfintechuel`}</pre>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <label className="font-medium">Ch��� độ:</label>
              <select className="border rounded-md px-2 py-1" value={mode} onChange={(e) => setMode(e.target.value as any)}>
                <option value="club">Hỏi về câu lạc bộ</option>
                <option value="major">Hỏi về ngành</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 rounded-lg border bg-slate-50 text-sm" onClick={() => setShowPreface(false)}>Bắt đầu</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={m.role === 'user' ? 'inline-block bg-indigo-600 text-white px-3 py-2 rounded-xl' : 'inline-block bg-slate-100 px-3 py-2 rounded-xl'}>
              {m.content}
            </div>
          </div>
        ))}
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault()
            const input = e.currentTarget.elements.namedItem('q') as HTMLInputElement
            const q = input.value
            if (!q.trim() || loading) return
            await ask(q)
            input.value = ''
          }}
        >
          <input name="q" placeholder="Nhập câu hỏi..." className="flex-1 border rounded-md px-3 py-2" />
          <button className="px-4 py-2 rounded-md bg-indigo-600 text-white" disabled={loading}>{loading ? 'Đang gửi…' : 'Gửi'}</button>
        </form>
      </div>
    </div>
  )
}
