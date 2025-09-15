'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SidebarWidgetsProps {
  currentStudentId: string
  setCurrentStudentId: (value: string) => void
}

export function SidebarWidgets({ currentStudentId, setCurrentStudentId }: SidebarWidgetsProps) {
  const STORAGE_KEY = 'forum.widgetOrder'

  // Local editable student id field
  const [localId, setLocalId] = useState<string>(currentStudentId || '')
  useEffect(() => setLocalId(currentStudentId || ''), [currentStudentId])

  function handleSaveId() {
    setCurrentStudentId(localId.trim())
    try { localStorage.setItem('forum.studentId', localId.trim()) } catch {}
  }

  function handleClear() {
    setLocalId('')
    setCurrentStudentId('')
    try { localStorage.removeItem('forum.studentId') } catch {}
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl transition-all bg-card/60 backdrop-blur-sm border border-border/50">
        <CardHeader className="px-4 py-4 bg-transparent border-b border-border/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-sm font-medium">
              <User className="h-5 w-5 text-accent" />
              <span>Hồ sơ</span>
            </CardTitle>
            <div className="text-xs text-muted-foreground">{currentStudentId ? 'Đã đăng nhập' : 'Chưa đăng nhập'}</div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-accent/20">
              <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
              <AvatarFallback>FTC</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold truncate">{currentStudentId || 'Khách'}</h4>
                <span className="ml-auto text-xs text-muted-foreground">ID</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{currentStudentId ? 'Thành viên FTC' : 'Ẩn danh / Khách'}</p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs text-muted-foreground mb-1">MSSV (K#########)</label>
            <div className="flex items-center gap-2">
              <Input
                value={localId}
                onChange={(e) => setLocalId(e.target.value)}
                placeholder="Nhập MSSV hoặc để trống"
                className="h-9 text-sm bg-background/50 border-border/50 focus:ring-2 focus:ring-accent/20 rounded-md"
              />
              <Button size="sm" onClick={handleSaveId} className="px-3 py-1">Lưu</Button>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-sm">Xóa</Button>
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            <p>Bạn có thể đăng bài với MSSV hoặc ẩn danh. Lưu MSSV để điền nhanh hơn khi tương tác.</p>
          </div>
        </CardContent>
      </Card>

      {/* Keep a small quick-stat card for visual balance */}
      <Card className="overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-accent">—</div>
            <div className="text-xs text-muted-foreground">Số liệu nhanh</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">—</div>
            <div className="text-xs text-muted-foreground">Cập nhật</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
