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
    <article className="border-b border-slate-200 py-3">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-700">{String((q.authorName||'A').charAt(0)).toUpperCase()}</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-medium text-sm">{q.authorName || (q.studentId || 'Ẩn danh')}</div>
            <div className="text-xs text-muted-foreground">{q.studentId ? q.studentId : ''}</div>
            <div className="ml-auto text-xs text-muted-foreground">{formatTime(q.createdAt)}</div>
          </div>

          <h3 className="mt-1 font-semibold text-sm">{q.title}</h3>
          <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{q.content}</p>

          <div className="mt-3 flex items-center gap-6 text-xs text-muted-foreground">
            <button onClick={undefined} className="inline-flex items-center gap-2 hover:text-primary transition-colors">
              <MessageSquare className="w-4 h-4" /> <span>{repliesCount}</span>
            </button>
            <button onClick={onLike} className="inline-flex items-center gap-2 hover:text-rose-600 transition-colors">
              <Heart className={`w-4 h-4 ${q.likes.length ? 'fill-rose-600 text-rose-600' : ''}`} /> <span>{likes}</span>
            </button>
            <button className="inline-flex items-center gap-2 hover:text-primary transition-colors">CHIA SẺ</button>
          </div>

          {onReply && (
            <div className="mt-3">
              <div className="flex items-center gap-3 mb-2">
                <label className="text-sm">Chế độ</label>
                <div className="flex items-center gap-2">
                  <label className="text-sm"><input type="radio" name={`reply-mode-${q.id}`} checked={replyMode === 'anonymous'} onChange={() => setReplyMode('anonymous')} /> Ẩn danh</label>
                  <label className="text-sm"><input type="radio" name={`reply-mode-${q.id}`} checked={replyMode === 'mssv'} onChange={() => setReplyMode('mssv')} /> MSSV</label>
                </div>
                {replyMode === 'mssv' && (
                  <div className="text-xs text-muted-foreground ml-auto">{defaultStudentId ? `Sẽ dùng: ${defaultStudentId}` : 'Chưa có MSSV'}</div>
                )}
              </div>
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} className="w-full p-2 border rounded-md text-sm" placeholder="Viết phản hồi của bạn" />
              <div className="flex justify-end mt-2">
                <button className="px-3 py-1 bg-primary text-white rounded-md text-sm" onClick={sendReply}>Gửi</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
