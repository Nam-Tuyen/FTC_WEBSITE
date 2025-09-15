import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, MessageSquare, Share2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

export function QuestionCard({ q, children, onLike, onReply, defaultStudentId }: { q: any; children?: React.ReactNode; onLike?: () => void; onReply?: (content: string, authorName: string) => void; defaultStudentId?: string }) {
  const created = typeof q.createdAt === 'number' ? new Date(q.createdAt) : new Date(q.createdAt || Date.now())
  const likes = typeof q.likes === 'number' ? q.likes : Array.isArray(q.likes) ? q.likes.length : 0
  const repliesCount = typeof q.repliesCount === 'number' ? q.repliesCount : Array.isArray(q.replies) ? q.replies.length : 0

  const [reply, setReply] = React.useState('')
  const [replyMode, setReplyMode] = React.useState<'anonymous' | 'mssv'>('anonymous')
  const [replyStudentId, setReplyStudentId] = React.useState('')
  const [expanded, setExpanded] = React.useState(false)

  React.useEffect(() => {
    if (replyMode === 'mssv' && !replyStudentId && defaultStudentId) setReplyStudentId(defaultStudentId)
  }, [replyMode, defaultStudentId, replyStudentId])

  function sendReply() {
    const c = reply.trim()
    if (!c) return
    const sid = replyMode === 'mssv' ? (replyStudentId || defaultStudentId || '').trim() : ''
    if (replyMode === 'mssv' && !/^K\\d{9}$/.test(sid)) return
    const authorName = sid ? sid : 'Ẩn danh'
    onReply?.(c, authorName)
    setReply('')
    setReplyStudentId('')
    setReplyMode('anonymous')
    setExpanded(true)
  }

  const formatTime = (time: any) => {
    try {
      const date = typeof time === 'number' ? new Date(time) : new Date(time || Date.now())
      return formatDistanceToNow(date, { addSuffix: true, locale: vi })
    } catch {
      return 'vừa xong'
    }
  }

  return (
    <article className="p-6 hover:bg-muted/20 transition-colors border-b border-border/50 last:border-b-0">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-foreground font-semibold border border-border/30">
            {String((q.authorName || 'A').charAt(0)).toUpperCase()}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{q.authorName || (q.studentId || 'Ẩn danh')}</span>
                  <span className="text-xs text-muted-foreground">{q.studentId ? q.studentId : ''}</span>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">{formatTime(q.createdAt)}</div>
              </div>

              <h3 className="text-lg font-semibold leading-tight text-foreground mb-3 hover:text-primary transition-colors cursor-pointer">
                {q.title}
              </h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed mb-4">
                {q.content}
              </div>

              <div className="flex items-center gap-6">
                <button 
                  onClick={onLike} 
                  className={`inline-flex items-center gap-2 text-sm transition-colors hover:text-rose-500 ${
                    likes ? 'text-rose-500' : 'text-muted-foreground'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likes ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{likes}</span>
                </button>

                <button 
                  onClick={() => setExpanded((v) => !v)} 
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{repliesCount} phản hồi</span>
                </button>

                <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Chia sẻ</span>
                </button>
              </div>

            </div>
          </div>

          {/* Replies as threaded bubbles */}
          {expanded && (
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="space-y-4">
                {Array.isArray(q.replies) && q.replies.length ? (
                  q.replies.map((r: any) => (
                    <div key={r.id || r.createdAt} className="flex gap-3 pl-4 border-l-2 border-primary/20">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-foreground font-medium text-xs border border-border/30">
                          {String((r.userId || r.authorName || 'U').charAt(0)).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">{r.authorName || r.userId || 'Ẩn danh'}</span>
                          <span className="text-xs text-muted-foreground">• {formatTime(r.createdAt)}</span>
                        </div>
                        <div className="bg-muted/30 border border-border/30 p-3 rounded-xl text-sm text-foreground">
                          {r.content}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Chưa có phản hồi nào. Hãy là người đầu tiên bình luận!
                  </div>
                )}

                {/* Reply form */}
                {onReply && (
                  <div className="mt-4 p-4 bg-muted/20 rounded-xl border border-border/30">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                          <input 
                            type="radio" 
                            name={`reply-mode-${q.id}`} 
                            checked={replyMode === 'anonymous'} 
                            onChange={() => setReplyMode('anonymous')}
                            className="text-primary focus:ring-primary"
                          />
                          <span>Ẩn danh</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                          <input 
                            type="radio" 
                            name={`reply-mode-${q.id}`} 
                            checked={replyMode === 'mssv'} 
                            onChange={() => setReplyMode('mssv')}
                            className="text-primary focus:ring-primary"
                          />
                          <span>MSSV</span>
                        </label>
                      </div>
                      {replyMode === 'mssv' && (
                        <div className="text-xs text-muted-foreground ml-auto">
                          {defaultStudentId ? `Sẽ dùng: ${defaultStudentId}` : 'Chưa có MSSV'}
                        </div>
                      )}
                    </div>
                    <textarea 
                      value={reply} 
                      onChange={(e) => setReply(e.target.value)} 
                      className="w-full p-3 border border-border/50 rounded-lg text-sm bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50" 
                      placeholder="Viết phản hồi của bạn..."
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <Button onClick={sendReply} className="rounded-full">
                        Gửi phản hồi
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </article>
  )
}
