import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, HelpCircle, Shuffle } from 'lucide-react'

export function SidebarWidgets({ currentStudentId, setCurrentStudentId }: { currentStudentId: string; setCurrentStudentId: (v:string)=>void }) {
  const [reversed, setReversed] = React.useState(false)

  const ProfileCard = (
    <Card className="widget-card overflow-hidden">
      <CardHeader className="px-4 py-3 bg-gradient-to-r from-background/60 to-background/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Hồ sơ của bạn</CardTitle>
          <button className="text-xs text-muted-foreground" onClick={() => { /* placeholder for edit action */ }}>{currentStudentId ? 'Chỉnh sửa' : 'Thêm MSSV'}</button>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-4">
        <p className="text-sm text-muted-foreground mb-2">Hãy nhập MSSV</p>
        <Input
          value={currentStudentId}
          onChange={(e) => setCurrentStudentId(e.target.value)}
          placeholder="K#########"
          className="mb-3"
        />
        <div className="text-xs text-muted-foreground">MSSV giúp tăng độ tin cậy khi hỏi và trả lời trong diễn đàn.</div>
      </CardContent>
    </Card>
  )

  const ActionsCard = (
    <Card className="widget-card overflow-hidden">
      <CardHeader className="px-4 py-3 bg-gradient-to-r from-background/60 to-background/40">
        <CardTitle className="text-sm font-medium">Hành động nhanh</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4 space-y-3">
        <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => {
          const el = document.getElementById('ask-question-form')
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }}>
          <MessageSquare size={16} className="mr-3" /> Đặt câu hỏi
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <HelpCircle size={16} className="mr-3" /> Lên đầu trang
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">Tiện ích</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setReversed((s) => !s)}>
            <Shuffle className="mr-2" /> Đổi vị trí
          </Button>
        </div>
      </div>

      <div className="space-y-3">
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
