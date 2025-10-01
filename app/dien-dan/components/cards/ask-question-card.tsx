import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
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
    <div id="ask-question-form" className="p-6 border-b border-border/50">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-foreground font-semibold border border-border/30">
            {currentStudentId ? currentStudentId.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Bạn đang thắc mắc điều gì?" 
                className="text-lg border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:ring-0 font-medium"
              />
            </div>

            <div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-border/50 rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{String(label)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Mô tả chi tiết câu hỏi của bạn..." 
              className="min-h-[120px] border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:ring-0 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input 
                    type="radio" 
                    checked={mode === 'anonymous'} 
                    onChange={() => setMode('anonymous')}
                    className="text-primary focus:ring-primary"
                  />
                  <span>Ẩn danh</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input 
                    type="radio" 
                    checked={mode === 'mssv'} 
                    onChange={() => setMode('mssv')}
                    className="text-primary focus:ring-primary"
                  />
                  <span>MSSV</span>
                </label>
              </div>
              
              {currentStudentId && (
                <div className="text-sm text-muted-foreground">
                  MSSV: {currentStudentId}
                </div>
              )}
            </div>

            <Button 
              onClick={handlePostQuestion}
              className="rounded-full px-6"
              disabled={!title.trim() || !content.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Đăng câu hỏi
            </Button>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>
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
    </div>
  )
}