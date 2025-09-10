import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { CATEGORIES } from '@/app/dien-dan/types'

interface AskQuestionCardProps {
  currentStudentId: string
  onUpdateStudentId: (sid: string) => void
  onSubmit: (data: { title: string; content: string; studentId: string; category: string }) => void
}

export function AskQuestionCard({
  currentStudentId,
  onUpdateStudentId,
  onSubmit,
}: AskQuestionCardProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [studentId, setStudentId] = useState('')
  const [category, setCategory] = useState<keyof typeof CATEGORIES>('DISCUSSION')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'anonymous' | 'mssv'>('anonymous')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [modalInput, setModalInput] = useState(currentStudentId || '')

  useEffect(() => {
    if (mode === 'mssv' && !studentId && currentStudentId) {
      setStudentId(currentStudentId)
    }
  }, [mode, currentStudentId, studentId])

  function validate() {
    if (!title.trim() || !content.trim()) {
      setError('Vui lòng nhập đầy đủ tiêu đề và nội dung')
      return false
    }
    if (mode === 'mssv') {
      const id = (studentId || currentStudentId || '').trim()
      if (!id) {
        setModalInput(currentStudentId || '')
        setShowProfileModal(true)
        return false
      }
      if (!/^K\d{9}$/.test(id)) {
        setModalInput(id)
        setShowProfileModal(true)
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
        <CardTitle className="text-2xl font-heading whitespace-nowrap">Đặt câu hỏi</CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-4 bg-background/40 backdrop-blur-lg rounded-2xl p-6">
        {/* Title */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-muted-foreground">Tiêu đề</label>
          <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề câu hỏi" />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-muted-foreground">Chủ đề</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORIES).map(([key, label]) => (
                // @ts-ignore
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Posting mode */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-muted-foreground">Chế độ đăng</label>
          <div className="flex items-center gap-6 mt-2">
            <label className="inline-flex items-center gap-2">
              <input type="radio" checked={mode === 'anonymous'} onChange={() => setMode('anonymous')} className="form-radio" />
              <span className="text-sm">Ẩn danh</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" checked={mode === 'mssv'} onChange={() => setMode('mssv')} className="form-radio" />
              <span className="text-sm">MSSV</span>
            </label>

            {mode === 'mssv' && (
              <div className="ml-4">
                <label className="text-sm text-muted-foreground">Mã số sinh viên</label>
                <div className="mt-1 text-sm">{currentStudentId || <span className="text-xs text-muted-foreground">Chưa có MSSV đã lưu</span>}</div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-muted-foreground">Nội dung</label>
          <Textarea
            className="mt-1 min-h-[140px]"
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
              setCategory('DISCUSSION' as keyof typeof CATEGORIES)
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

        <Dialog open={showProfileModal} onOpenChange={(v) => setShowProfileModal(v)}>
          <DialogContent showCloseButton>
            <DialogHeader>
              <DialogTitle>Yêu cầu cập nhật hồ sơ</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Bạn đã chọn chế độ MSSV nhưng chưa có MSSV hợp lệ. Vui lòng nhập MSSV (dạng K#########) để tiếp tục.</p>
              <Input value={modalInput} onChange={(e) => setModalInput(e.target.value)} placeholder="K#########" />
            </div>
            <DialogFooter>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowProfileModal(false)}>Hủy</Button>
                <Button onClick={() => {
                  const v = (modalInput || '').trim()
                  if (!/^K\d{9}$/.test(v)) return
                  onUpdateStudentId(v)
                  setShowProfileModal(false)
                }}>Lưu MSSV</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
