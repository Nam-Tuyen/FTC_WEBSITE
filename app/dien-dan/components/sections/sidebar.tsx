'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { MessageSquare, HelpCircle, Bell } from 'lucide-react'

interface SidebarProps {
  currentStudentId: string
  onUpdateStudentId: (studentId: string) => void
}

export function Sidebar({ currentStudentId, onUpdateStudentId }: SidebarProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-xl">
        <CardHeader className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="text-sm font-semibold">Hồ sơ của bạn</CardTitle>
        </CardHeader>
        <CardContent className="p-4 bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">{(currentStudentId || 'A').charAt(0)}</div>
            <div>
              <div className="text-sm font-medium">{currentStudentId ? currentStudentId : 'Khách (Chưa đăng MSSV)'}</div>
              <div className="text-xs text-muted-foreground">Cập nhật MSSV để hiển thị tên</div>
            </div>
          </div>

          <div className="mt-4">
            <input value={currentStudentId} onChange={(e) => onUpdateStudentId(e.target.value)} placeholder="K#########" className="w-full p-2 border rounded-md" />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-xl">
        <CardHeader className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="text-sm font-semibold">Hành động nhanh</CardTitle>
        </CardHeader>
        <CardContent className="p-4 bg-white/70 space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => document.getElementById('ask-question-form')?.scrollIntoView({ behavior: 'smooth' })}>
            <MessageSquare className="mr-2" /> Đặt câu hỏi
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <HelpCircle className="mr-2" /> Lên đầu trang
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => alert('Đã bật thông báo (demo)')}>
            <Bell className="mr-2" /> Nhận thông báo
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
