import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, MessageSquare } from 'lucide-react'
import { CATEGORIES } from '@/app/dien-dan/types'

export function QuestionCard({ q, children, onLike, onReply, defaultStudentId }: { q: any; children?: React.ReactNode; onLike?: () => void; onReply?: (content: string, authorName: string) => void; defaultStudentId?: string }) {
  const created = typeof q.createdAt === 'number' ? new Date(q.createdAt) : new Date(q.createdAt || Date.now())
  const likes = typeof q.likes === 'number' ? q.likes : Array.isArray(q.likes) ? q.likes.length : 0
  const repliesCount = typeof q.repliesCount === 'number' ? q.repliesCount : Array.isArray(q.replies) ? q.replies.length : 0

  // reply state
  const [reply, setReply] = React.useState('')
  const [replyMode, setReplyMode] = React.useState<'anonymous' | 'mssv'>('anonymous')
  const [replyStudentId, setReplyStudentId] = React.useState('')

  React.useEffect(() => {
    if (replyMode === 'mssv' && !replyStudentId && defaultStudentId) setReplyStudentId(defaultStudentId)
  }, [replyMode, defaultStudentId, replyStudentId])

  function sendReply() {
    const c = reply.trim()
    if (!c) return
    const sid = replyMode === 'mssv' ? (replyStudentId || defaultStudentId || '').trim() : ''
    if (replyMode === 'mssv' && !/^K\d{9}$/.test(sid)) return
    const authorName = sid ? sid : 'Ẩn danh'
    onReply?.(c, authorName)
    setReply('')
    setReplyStudentId('')
    setReplyMode('anonymous')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{q.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-slate-500">Chủ đề: {CATEGORIES[q.category] ?? q.category} • {created.toLocaleString()}</div>
        <p className="text-sm whitespace-pre-wrap">{q.content}</p>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <button className="inline-flex items-center gap-1" onClick={onLike} aria-label="Like">
            <Heart className="w-4 h-4" /> {likes}
          </button>
          <span className="inline-flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {repliesCount}</span>
        </div>

        {children}

        {/* Reply box */}
        {onReply && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-4">
              <label className="text-sm">Chế độ phản hồi</label>
              <div className="flex items-center gap-2">
                <label className="text-sm"><input type="radio" name={`reply-mode-${q.id}`} checked={replyMode === 'anonymous'} onChange={() => setReplyMode('anonymous')} /> Ẩn danh</label>
                <label className="text-sm"><input type="radio" name={`reply-mode-${q.id}`} checked={replyMode === 'mssv'} onChange={() => setReplyMode('mssv')} /> MSSV</label>
              </div>
            </div>
            {replyMode === 'mssv' && (
              <div className="text-xs text-muted-foreground">{defaultStudentId ? `Sẽ dùng MSSV đã lưu: ${defaultStudentId}` : 'Chưa có MSSV đã lưu'}</div>
            )}
            <textarea value={reply} onChange={(e) => setReply(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Viết phản hồi của bạn" />
            <div className="flex justify-end">
              <button className="px-3 py-2 bg-primary text-white rounded-md" onClick={sendReply}>Gửi phản hồi</button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
