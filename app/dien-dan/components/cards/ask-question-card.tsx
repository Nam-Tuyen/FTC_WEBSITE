import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

  const handlePostQuestion = () => {
    if (!validate()) return
    const sid = mode === 'mssv' ? (studentId || currentStudentId).trim() : ''
    onSubmit({ title: title.trim(), content: content.trim(), studentId: sid, category })
    setTitle('')
    setContent('')
    setStudentId('')
    setCategory('DISCUSSION' as keyof typeof CATEGORIES)
    setMode('anonymous')
  }

  return (
    <Card id="ask-question-form" className="relative overflow-hidden rounded-2xl border border-transparent hover:shadow-2xl transition">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 blur-lg" />
      <CardHeader className="relative p-6">
        <CardTitle className="text-lg font-semibold">Đặt câu hỏi</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Chia sẻ câu hỏi của bạn với cộng đồng FTC</p>
      </CardHeader>

      <CardContent className="relative p-6 bg-white/70 backdrop-blur-sm rounded-b-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs text-muted-foreground">Tiêu đề</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề ngắn gọn" className="mt-2" />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground">Chủ đề</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full mt-2">
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
        </div>

        <div className="mt-4">
          <label className="block text-xs text-muted-foreground">Nội dung</label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Mô tả chi tiết, kèm bối cảnh và bước bạn đã thử" className="mt-2 min-h-[140px]" />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm">Chế độ</label>
            <div className="inline-flex items-center gap-3">
              <label className="inline-flex items-center gap-2"><input type="radio" checked={mode === 'anonymous'} onChange={() => setMode('anonymous')} /> <span className="text-sm">Ẩn danh</span></label>
              <label className="inline-flex items-center gap-2"><input type="radio" checked={mode === 'mssv'} onChange={() => setMode('mssv')} /> <span className="text-sm">MSSV</span></label>
            </div>
          </div>

          <div className="ml-auto text-sm text-muted-foreground">MSSV: {currentStudentId || 'Chưa lưu'}</div>
        </div>

        {error && <div className="text-sm text-destructive mt-2">{error}</div>}

        <div className="mt-6 flex justify-end">
          <Button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white" onClick={handlePostQuestion}>
            <Plus className="w-4 h-4" />
            Đăng câu hỏi
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
