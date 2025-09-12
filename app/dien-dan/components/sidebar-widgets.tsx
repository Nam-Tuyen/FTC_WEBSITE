import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, HelpCircle, Shuffle } from 'lucide-react'

export function SidebarWidgets({ currentStudentId, setCurrentStudentId }: { currentStudentId: string; setCurrentStudentId: (v:string)=>void }) {
  const STORAGE_KEY = 'forum.widgetOrder'
  const [order, setOrder] = React.useState<string[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) return JSON.parse(raw)
    } catch {}
    return ['profile', 'actions']
  })

  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(order)) } catch {}
  }, [order])

  function move(from: number, to: number) {
    const next = [...order]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setOrder(next)
  }

  // Drag handlers
  function onDragStart(e: React.DragEvent, idx: number) {
    e.dataTransfer.setData('text/plain', String(idx))
    e.dataTransfer.effectAllowed = 'move'
  }
  function onDragOver(e: React.DragEvent) { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }
  function onDrop(e: React.DragEvent, idx: number) {
    e.preventDefault()
    const from = Number(e.dataTransfer.getData('text/plain'))
    if (!Number.isNaN(from) && from !== idx) move(from, idx)
  }

  const ProfileCard = (
    <div draggable onDragStart={(e) => onDragStart(e, order.indexOf('profile'))} onDragOver={onDragOver} onDrop={(e) => onDrop(e, order.indexOf('profile'))}>
      <Card className="widget-card overflow-hidden rounded-xl transition-shadow hover:shadow-lg">
        <CardHeader className="px-3 py-2 bg-transparent">
          <div className="flex items-center justify-between text-left">
            <CardTitle className="text-sm font-medium uppercase tracking-wide text-left">
              <p>HỒ SƠ NGƯỜI DÙNG</p>
            </CardTitle>
            <button className="text-xs text-muted-foreground" onClick={() => { /* placeholder */ }}>{currentStudentId ? 'Chỉnh sửa' : 'Thêm'}</button>
          </div>
        </CardHeader>

        <CardContent className="px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                value={currentStudentId}
                onChange={(e) => setCurrentStudentId(e.target.value)}
                placeholder="K#########"
                className="h-9 text-sm bg-slate-700 text-slate-100 border-slate-600"
              />
              <div className="text-xs text-muted-foreground mt-2 text-left">
                <p>Người dùng có thể đăng bài và trả lời câu hỏi bằng mã số sinh viên hoặc ẩn danh</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const ActionsCard = (
    <div draggable onDragStart={(e) => onDragStart(e, order.indexOf('actions'))} onDragOver={onDragOver} onDrop={(e) => onDrop(e, order.indexOf('actions'))}>
      <Card className="widget-card overflow-hidden rounded-xl transition-shadow hover:shadow-lg bg-gradient-to-br from-[#041426] to-[#071425] text-slate-100">
        <CardHeader className="px-3 py-2 bg-transparent">
          <CardTitle className="text-[20px] font-semibold text-center uppercase tracking-wide">HÀNH ĐỘNG NHANH</CardTitle>
        </CardHeader>

        <div className="px-3 pb-3 flex gap-2">
          <Button variant="default" className="flex-1 flex items-center justify-center gap-2 h-9 uppercase text-sm" onClick={() => {
            const el = document.getElementById('ask-question-form')
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }}>
            <MessageSquare className="mr-1" /> ĐẶT
          </Button>
          <Button variant="default" className="flex-1 flex items-center justify-center gap-2 h-9 uppercase text-sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <HelpCircle className="mr-1" /> LÊN
          </Button>
        </div>

        <CardContent className="px-3 py-3">
          <div className="grid grid-cols-2 gap-2" />
        </CardContent>
      </Card>
    </div>
  )

  const elems = order.map((k, idx) => React.cloneElement(k === 'profile' ? ProfileCard : ActionsCard, { key: `${k}-${idx}` }))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground uppercase tracking-wide"><p><strong>TIỆN ÍCH</strong></p></div>
        <Button variant="ghost" size="sm" onClick={() => setOrder((s) => [...s].reverse())} className="px-2 py-1">
          <Shuffle />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {elems}
      </div>
    </div>
  )
}
