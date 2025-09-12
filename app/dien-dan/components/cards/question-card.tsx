import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageSquare, Share2 } from 'lucide-react'
import moment from 'moment'

export function QuestionCard({ q, children, onLike, onReply, defaultStudentId }: { q: any; children?: React.ReactNode; onLike?: () => void; onReply?: (content: string, authorName: string) => void; defaultStudentId?: string }) {
  const created = typeof q.createdAt === 'number' ? new Date(q.createdAt) : new Date(q.createdAt || Date.now())
  const likes = typeof q.likes === 'number' ? q.likes : Array.isArray(q.likes) ? q.likes.length : 0
  const repliesCount = typeof q.repliesCount === 'number' ? q.repliesCount : Array.isArray(q.replies) ? q.replies.length : 0

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

  const formatTime = (time: any) => moment(time).fromNow()

  return (
    <article className="group relative border border-transparent hover:border-primary/30 hover:shadow-lg transition p-4 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/40 text-slate-100">
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-primary to-accent" />
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-white font-semibold">{String((q.authorName || 'A').charAt(0)).toUpperCase()}</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{q.authorName || (q.studentId || 'Ẩn danh')}</span>
              <span className="text-xs text-muted-foreground">{q.studentId ? q.studentId : ''}</span>
            </div>
            <div className="ml-auto text-xs text-muted-foreground">{formatTime(q.createdAt)}</div>
          </div>

          <h3 className="mt-2 text-lg font-semibold truncate">{q.title}</h3>
          <p className="mt-2 text-sm text-slate-700 max-h-24 overflow-hidden text-ellipsis whitespace-pre-wrap">{q.content}</p>

          <div className="mt-4 flex items-center gap-3">
            <button onClick={onLike} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-600 transition">
              <Heart className={`w-4 h-4 ${likes ? 'fill-rose-600 text-rose-600' : ''}`} /> <span>{likes}</span>
            </button>

            <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition">
              <MessageSquare className="w-4 h-4" /> <span>{repliesCount}</span>
            </button>

            <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition ml-auto">
              <Share2 className="w-4 h-4" /> <span>Chia sẻ</span>
            </button>
          </div>

          {onReply && (
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm"><input type="radio" name={`reply-mode-${q.id}`} checked={replyMode === 'anonymous'} onChange={() => setReplyMode('anonymous')} /> <span className="ml-1">Ẩn danh</span></label>
                  <label className="text-sm ml-4"><input type="radio" name={`reply-mode-${q.id}`} checked={replyMode === 'mssv'} onChange={() => setReplyMode('mssv')} /> <span className="ml-1">MSSV</span></label>
                </div>
                {replyMode === 'mssv' && (
                  <div className="text-xs text-muted-foreground ml-auto">{defaultStudentId ? `Sẽ dùng: ${defaultStudentId}` : 'Chưa có MSSV'}</div>
                )}
              </div>
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} className="w-full p-3 border rounded-md text-sm" placeholder="Viết phản hồi của bạn" />
              <div className="flex justify-end mt-2">
                <button className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg" onClick={sendReply}>Gửi</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
