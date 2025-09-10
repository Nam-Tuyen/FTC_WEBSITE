import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, HelpCircle, Shuffle } from 'lucide-react'

export function SidebarWidgets({ currentStudentId, setCurrentStudentId }: { currentStudentId: string; setCurrentStudentId: (v:string)=>void }) {
  const [reversed, setReversed] = React.useState(false)

  const ProfileCard = (
    <Card className="widget-card overflow-hidden rounded-xl">
      <CardHeader className="px-3 py-2 bg-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Hồ sơ của bạn</CardTitle>
          <button className="text-xs text-muted-foreground" onClick={() => { /* placeholder for edit action */ }}>{currentStudentId ? 'Chỉnh sửa' : 'Thêm'}</button>
        </div>
      </CardHeader>

      <CardContent className="px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              value={currentStudentId}
              onChange={(e) => setCurrentStudentId(e.target.value)}
              placeholder="K#########"
              className="h-9 text-sm"
            />
            <div className="text-xs text-muted-foreground mt-2">MSSV giúp tăng độ tin cậy khi hỏi/đăng.</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ActionsCard = (
    <Card className="widget-card overflow-hidden rounded-xl">
      <CardHeader className="px-3 py-2 bg-transparent">
        <CardTitle className="text-sm font-medium">Hành động nhanh</CardTitle>
      </CardHeader>

      <CardContent className="px-3 py-3">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="flex items-center justify-center text-sm h-9">
            <MessageSquare className="mr-2" /> Đặt
          </Button>
          <Button variant="outline" className="flex items-center justify-center text-sm h-9" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <HelpCircle className="mr-2" /> Lên
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Tiện ích</div>
        <Button variant="ghost" size="sm" onClick={() => setReversed((s) => !s)} className="px-2 py-1">
          <Shuffle />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {reversed ? (
          <>
            {ActionsCard}
            {ProfileCard}
          </>
        ) : (
          <>
            {ProfileCard}
            {ActionsCard}
          </>
        )}
      </div>
    </div>
  )
}
