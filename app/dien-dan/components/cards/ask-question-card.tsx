'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CATEGORIES } from '@/app/dien-dan/types'

interface AskQuestionCardProps {
  currentStudentId: string
  onUpdateStudentId: (sid: string) => void
  onSubmit: (data: { title: string; content: string; studentId: string; category: string }) => void
}

export function AskQuestionCard({
  currentStudentId,
  onSubmit,
}: AskQuestionCardProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [studentId, setStudentId] = useState('')
  const [category, setCategory] = useState<keyof typeof CATEGORIES>('CLUB')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'anonymous' | 'mssv'>('anonymous')

  function validate() {
    if (!title.trim() || !content.trim()) {
      setError('Vui lòng nhập đầy đủ tiêu đề và nội dung')
      return false
    }
    if (mode === 'mssv') {
      const id = (studentId || currentStudentId).trim()
      if (!/^K\d{9}$/.test(id)) {
        setError('MSSV phải có dạng K#########')
        return false
      }
    }
    setError('')
    return true
  }

  return (
    <Card id="ask-question-form" className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-500" />
      <CardHeader>
        <CardTitle className="text-lg font-heading uppercase whitespace-nowrap">Đặt câu hỏi</CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-3 bg-background/40 backdrop-blur-lg rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Tiêu đề</label>
            <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề câu hỏi" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Chủ đề</label>
            <div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Chế độ đăng</label>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'anonymous' | 'mssv')} className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="mode-anonymous" value="anonymous" />
                  <label htmlFor="mode-anonymous" className="text-sm">Ẩn danh</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="mode-mssv" value="mssv" />
                  <label htmlFor="mode-mssv" className="text-sm">MSSV</label>
                </div>
              </RadioGroup>
            </div>
            {mode === 'mssv' && (
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground whitespace-nowrap">Mã số sinh viên</label>
                <Input
                  className="mt-1"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="K#########"
                />
                {!studentId && currentStudentId && (
                  <div className="text-xs text-muted-foreground mt-1">Sẽ dùng MSSV đã lưu: {currentStudentId}</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground whitespace-nowrap">Nội dung</label>
          <Textarea
            className="mt-1"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Mô tả chi tiết vấn đề, bối cảnh, bạn đã thử gì..."
          />
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}

        <div className="flex justify-end">
          <Button
            className="relative group"
            onClick={() => {
              if (!validate()) return
              const sid = mode === 'mssv' ? (studentId || currentStudentId).trim() : ''
              onSubmit({ title: title.trim(), content: content.trim(), studentId: sid, category })
              setTitle('')
              setContent('')
              setStudentId('')
                            setCategory('CLUB' as keyof typeof CATEGORIES)
              setMode('anonymous')
            }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent opacity-75 rounded-lg blur transition group-hover:opacity-100"></div>
            <div className="relative flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Đăng câu hỏi
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
