'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, Reply } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { uuid, formatTime } from '../../utils'
import { QuestionItem, CATEGORIES } from '../../types'

interface QuestionCardProps {
  q: QuestionItem
  defaultStudentId: string
  onLike: () => void
  onReply: (content: string, authorName: string) => void
}

export function QuestionCard({
  q,
  defaultStudentId,
  onLike,
  onReply,
}: QuestionCardProps) {
  const [reply, setReply] = useState('')
  const [replyMode, setReplyMode] = useState<'anonymous' | 'mssv'>('anonymous')
  const [replyStudentId, setReplyStudentId] = useState('')

  useEffect(() => {
    if (replyMode === 'mssv' && !replyStudentId && defaultStudentId) {
      setReplyStudentId(defaultStudentId)
    }
  }, [replyMode, defaultStudentId, replyStudentId])

  const authorDisplay = q.studentId ? q.studentId : 'Ẩn danh'

  return (
    <Card className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-500" />
      <CardContent className="relative p-6 bg-background/40 backdrop-blur-lg rounded-2xl">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={'/placeholder.svg'} alt={q.authorName} />
            <AvatarFallback>{q.authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-heading font-semibold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{q.title}</h3>
              <Badge variant="outline" className="text-xs">{CATEGORIES[q.category] ?? q.category}</Badge>
              <span className="text-xs text-muted-foreground">{formatTime(q.createdAt)}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap break-words">{q.content}</p>
            <div className="text-xs text-muted-foreground mb-3">MSSV: {authorDisplay}</div>

            <div className="flex items-center gap-3 text-sm">
              <button
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                onClick={onLike}
                aria-label="Thích câu hỏi"
              >
                <Heart className={`h-4 w-4 ${q.likes.length ? 'fill-primary text-primary' : ''}`} /> {q.likes.length}
              </button>
              <div className="inline-flex items-center gap-1 text-muted-foreground">
                <Reply className="h-4 w-4" /> {q.replies.length}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {q.replies.map((r) => (
                <div key={r.id} className="rounded-lg border p-3 bg-background/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">{r.authorName}</div>
                    <div className="text-xs text-muted-foreground">{formatTime(r.createdAt)}</div>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{r.content}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <div>
                <label className="text-sm text-muted-foreground">Chế độ phản hồi</label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <RadioGroup value={replyMode} onValueChange={(v) => setReplyMode(v as 'anonymous' | 'mssv')} className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id={`reply-anonymous-${q.id}`} value="anonymous" />
                      <label htmlFor={`reply-anonymous-${q.id}`} className="text-sm">Ẩn danh</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id={`reply-mssv-${q.id}`} value="mssv" />
                      <label htmlFor={`reply-mssv-${q.id}`} className="text-sm">MSSV</label>
                    </div>
                  </RadioGroup>
                  {replyMode === 'mssv' && (
                    <div className="md:col-span-2">
                      {defaultStudentId ? (
                        <div className="text-xs text-muted-foreground">Sẽ dùng MSSV đã lưu: {defaultStudentId}</div>
                      ) : (
                        <div className="text-xs text-muted-foreground">Chưa có MSSV đã lưu</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-3">
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Viết phản hồi của bạn"
                  />
                </div>
                <div className="md:col-span-1 flex md:block">
                  <Button
                    className="relative md:w-full ml-auto group"
                    onClick={() => {
                      const c = reply.trim()
                      if (!c) return
                      const sid = replyMode === 'mssv' ? (replyStudentId || defaultStudentId).trim() : ''
                      if (replyMode === 'mssv' && !/^K\d{9}$/.test(sid)) return
                      const authorName = sid ? sid : 'Ẩn danh'
                      onReply(c, authorName)
                      setReply('')
                      setReplyStudentId('')
                      setReplyMode('anonymous')
                    }}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent opacity-75 rounded-lg blur transition group-hover:opacity-100"></div>
                    <span className="relative">Gửi phản hồi</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
