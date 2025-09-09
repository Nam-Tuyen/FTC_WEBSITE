'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, HelpCircle } from 'lucide-react'

interface SidebarProps {
  currentStudentId: string
  onUpdateStudentId: (studentId: string) => void
}

export function Sidebar({ currentStudentId, onUpdateStudentId }: SidebarProps) {
  return (
    <div className="space-y-6">
      <Card className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-500" />
        <CardHeader className="relative px-[30px] bg-background/40 backdrop-blur-lg rounded-t-2xl">
          <CardTitle className="text-[19px] leading-[35px] font-heading uppercase whitespace-nowrap text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Hồ sơ của bạn
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-2 px-[30px] bg-background/40 backdrop-blur-lg rounded-b-2xl">
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            <p>Hãy nhập MSSV</p>
          </div>
          <input
            className="mt-1"
            value={currentStudentId}
            onChange={(e) => onUpdateStudentId(e.target.value)}
            placeholder="K#########"
          />
        </CardContent>
      </Card>

      <Card className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-500" />
        <CardHeader className="relative px-[30px] bg-background/40 backdrop-blur-lg rounded-t-2xl">
          <CardTitle className="text-[19px] leading-[35px] font-heading uppercase whitespace-nowrap text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Hành động nhanh
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-3 px-[30px] bg-background/40 backdrop-blur-lg rounded-b-2xl">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent group"
            onClick={() => {
              const el = document.getElementById('ask-question-form')
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg opacity-0 transition group-hover:opacity-100" />
            <div className="relative flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Đặt câu hỏi
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg opacity-0 transition group-hover:opacity-100" />
            <div className="relative flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              Lên đầu trang
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
