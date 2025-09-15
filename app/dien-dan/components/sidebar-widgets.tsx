'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, ArrowUp, User, Plus, Settings, Shuffle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SidebarWidgetsProps {
  currentStudentId: string
  setCurrentStudentId: (value: string) => void
}

export function SidebarWidgets({ currentStudentId, setCurrentStudentId }: SidebarWidgetsProps) {
  const STORAGE_KEY = 'forum.widgetOrder'
  const [order, setOrder] = useState<Array<'profile' | 'actions'>>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) return JSON.parse(raw)
    } catch {}
    return ['profile', 'actions']
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(order)) } catch {}
  }, [order])

  function move(from: number, to: number) {
    const next = [...order]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setOrder(next)
  }

  // Drag handlers
  function onDragStart(e: DragEvent<HTMLDivElement>, idx: number) {
    e.dataTransfer.setData('text/plain', String(idx))
    e.dataTransfer.effectAllowed = 'move'
  }
  function onDragOver(e: DragEvent<HTMLDivElement>) { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }
  function onDrop(e: DragEvent<HTMLDivElement>, idx: number) {
    e.preventDefault()
    const from = Number(e.dataTransfer.getData('text/plain'))
    if (!Number.isNaN(from) && from !== idx) move(from, idx)
  }

  const ProfileCard = (
    <div draggable onDragStart={(e: DragEvent<HTMLDivElement>) => onDragStart(e, order.indexOf('profile'))} onDragOver={onDragOver} onDrop={(e: DragEvent<HTMLDivElement>) => onDrop(e, order.indexOf('profile'))}>
      <Card className="widget-card overflow-hidden rounded-xl transition-all hover:shadow-lg hover:border-primary/30 bg-card/50 backdrop-blur-sm border border-border/50">
        <CardHeader className="px-4 py-3 bg-transparent border-b border-border/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              <span>Hồ sơ người dùng</span>
            </CardTitle>
            <button 
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors" 
              onClick={() => { /* placeholder */ }}
            >
              {currentStudentId ? <Settings className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12 border-2 border-background">
              <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
              <AvatarFallback>FTC</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">
                {currentStudentId || 'Chưa đăng nhập'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {currentStudentId ? 'Thành viên' : 'Khách'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              value={currentStudentId}
              onChange={(e) => setCurrentStudentId(e.target.value)}
              placeholder="Nhập MSSV (K#########)"
              className="h-9 text-sm bg-background/50 text-foreground border-border/50 focus:border-primary/50"
            />
            <p className="text-xs text-muted-foreground">
              Bạn có thể đăng bài và trả lời với MSSV hoặc ẩn danh
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const ActionsCard = (
    <div draggable onDragStart={(e: DragEvent<HTMLDivElement>) => onDragStart(e, order.indexOf('actions'))} onDragOver={onDragOver} onDrop={(e: DragEvent<HTMLDivElement>) => onDrop(e, order.indexOf('actions'))}>
      <Card className="widget-card overflow-hidden rounded-xl transition-all hover:shadow-lg hover:border-primary/30 bg-card/50 backdrop-blur-sm border border-border/50">
        <CardHeader className="px-4 py-3 bg-transparent border-b border-border/10">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <MessageSquare className="h-4 w-4" />
            <span>Hành động nhanh</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          <Button 
            variant="default" 
            className="w-full h-10 gap-2 hover:shadow-md transition-all hover:translate-y-[-1px]"
            onClick={() => {
              const el = document.getElementById('ask-question-form')
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }}
          >
            <MessageSquare className="h-4 w-4" /> 
            <span>Đặt câu hỏi mới</span>
          </Button>

          <Button 
            variant="outline"
            className="w-full h-10 gap-2 bg-background/50 hover:bg-primary/5 hover:shadow-md transition-all hover:translate-y-[-1px]"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp className="h-4 w-4" />
            <span>Lên đầu trang</span>
          </Button>

          <div className="pt-2 border-t border-border/10">
            <h4 className="text-sm font-medium mb-3">Phím tắt</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 rounded bg-muted">N</kbd>
                <span>Câu hỏi mới</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 rounded bg-muted">⌘K</kbd>
                <span>Tìm kiếm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 rounded bg-muted">L</kbd>
                <span>Thích</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 rounded bg-muted">R</kbd>
                <span>Trả lời</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-4 sticky top-6">
      {order.map((k, idx) => (
        <div key={`${k}-${idx}`}>
          {k === 'profile' ? ProfileCard : ActionsCard}
        </div>
      ))}
    </div>
  )

  const elems = order.map((k, idx) => React.cloneElement(k === 'profile' ? ProfileCard : ActionsCard, { key: `${k}-${idx}` }))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground uppercase tracking-wide font-semibold"><p>TIỆN ÍCH</p></div>
        <Button variant="ghost" size="sm" onClick={() => setOrder((s) => [...s].reverse())} className="px-2 py-1 hover:bg-muted/50">
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {elems}
      </div>
    </div>
  )
}
