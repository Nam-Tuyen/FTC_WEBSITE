'use client'

import { useEffect, useMemo, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, Search, Plus, HelpCircle, Heart, Reply } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type ReplyItem = {
  id: string
  authorId: string
  authorName: string
  content: string
  createdAt: number
}

type QuestionItem = {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  studentId: string
  category: string
  createdAt: number
  likes: string[]
  replies: ReplyItem[]
}

const STORAGE_KEYS = {
  userId: 'forum.currentUserId',
  studentId: 'forum.currentStudentId',
  questions: 'forum.questions',
}

const CATEGORIES = [
  'Hỏi đáp về câu lạc bộ',
  'Hỏi đáp thông tin về ngành học',
  'Thảo luận',
]

function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function formatTime(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return `${diff}s trước`
  if (diff < 3600) return `${Math.floor(diff / 60)}m trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h trước`
  return new Date(ts).toLocaleString()
}

export default function ForumPage() {
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [currentStudentId, setCurrentStudentId] = useState<string>('')
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const id = localStorage.getItem(STORAGE_KEYS.userId) || uuid()
    const sid = localStorage.getItem(STORAGE_KEYS.studentId) || ''
    setCurrentUserId(id)
    setCurrentStudentId(sid)
    localStorage.setItem(STORAGE_KEYS.userId, id)
    localStorage.setItem(STORAGE_KEYS.studentId, sid)

    const saved = localStorage.getItem(STORAGE_KEYS.questions)
    if (saved) {
      try {
        setQuestions(JSON.parse(saved))
      } catch {
        setQuestions([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(questions))
  }, [questions])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return questions
    return questions.filter((item) =>
      [item.title, item.content, item.authorName, item.studentId, item.category].some((f) =>
        f.toLowerCase().includes(q)
      )
    )
  }, [questions, search])

  async function handleCreateQuestion(data: {
    title: string
    content: string
    studentId: string
    category: string
  }) {
    const newId = uuid()
    const authorName = data.studentId ? data.studentId : 'Ẩn danh'
    const newQ: QuestionItem = {
      id: newId,
      title: data.title,
      content: data.content,
      authorId: currentUserId,
      authorName,
      studentId: data.studentId,
      category: data.category,
      createdAt: Date.now(),
      likes: [],
      replies: [],
    }

    setQuestions((prev) => [newQ, ...prev])

    try {
      await Promise.allSettled([
        fetch('/api/forum/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: data.studentId,
            name: authorName,
            title: data.title,
            content: data.content,
            category: data.category,
            questionId: newId,
          }),
        }),
        fetch('/api/forum/notion/question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: data.studentId,
            name: authorName,
            title: data.title,
            content: data.content,
            category: data.category,
            questionId: newId,
            authorId: currentUserId,
          }),
        }),
      ])
    } catch (e) {}
  }

  function handleToggleLike(qid: string) {
    if (!currentUserId) return
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qid) return q
        const has = q.likes.includes(currentUserId)
        return { ...q, likes: has ? q.likes.filter((x) => x !== currentUserId) : [...q.likes, currentUserId] }
      })
    )
  }

  function handleAddReply(qid: string, content: string, authorName: string) {
    if (!content.trim()) return
    const reply: ReplyItem = {
      id: uuid(),
      authorId: currentUserId,
      authorName,
      content,
      createdAt: Date.now(),
    }
    setQuestions((prev) => prev.map((q) => (q.id === qid ? { ...q, replies: [...q.replies, reply] } : q)))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-foreground mb-6 text-glow pulse uppercase">
              Diễn đàn <span className="text-primary">Thảo luận</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty italic">
              Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối với nhau
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm câu hỏi, nội dung..."
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <AskQuestionCard
              currentStudentId={currentStudentId}
              onUpdateStudentId={(sid) => {
                setCurrentStudentId(sid)
                localStorage.setItem(STORAGE_KEYS.studentId, sid)
              }}
              onSubmit={handleCreateQuestion}
            />

            <section>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-6 uppercase">Câu hỏi gần đây</h2>
              <div className="space-y-4">
                {filtered.map((q) => (
                  <QuestionCard
                    key={q.id}
                    q={q}
                    defaultStudentId={currentStudentId}
                    onLike={() => handleToggleLike(q.id)}
                    onReply={(content, authorName) => handleAddReply(q.id, content, authorName)}
                  />
                ))}
                {filtered.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-sm text-muted-foreground">Không có kết quả phù hợp.</CardContent>
                  </Card>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading uppercase">Hồ sơ của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">Mã số sinh viên</div>
                <Input
                  value={currentStudentId}
                  onChange={(e) => {
                    setCurrentStudentId(e.target.value)
                    localStorage.setItem(STORAGE_KEYS.studentId, e.target.value)
                  }}
                  placeholder="K#########"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading uppercase">Hành động nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    const el = document.getElementById('ask-question-form')
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Đặt câu hỏi
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Lên đầu trang
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function AskQuestionCard({
  currentStudentId,
  onUpdateStudentId,
  onSubmit,
}: {
  currentStudentId: string
  onUpdateStudentId: (sid: string) => void
  onSubmit: (data: { title: string; content: string; studentId: string; category: string }) => void
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [studentId, setStudentId] = useState('')
  const [category, setCategory] = useState<string>(CATEGORIES[0])
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
    <Card id="ask-question-form">
      <CardHeader>
        <CardTitle className="text-lg font-heading uppercase">Đặt câu hỏi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Tiêu đề</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề câu hỏi" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Chủ đề</label>
            <div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Chế độ đăng</label>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="text-sm text-muted-foreground">Mã số sinh viên</label>
                <Input
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
          <label className="text-sm text-muted-foreground">Nội dung</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Mô tả chi tiết vấn đề, bối cảnh, bạn đã thử gì..."
          />
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}

        <div className="flex justify-end">
          <Button
            onClick={() => {
              if (!validate()) return
              const sid = mode === 'mssv' ? (studentId || currentStudentId).trim() : ''
              onSubmit({ title: title.trim(), content: content.trim(), studentId: sid, category })
              setTitle('')
              setContent('')
              setStudentId('')
              setCategory(CATEGORIES[0])
              setMode('anonymous')
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Đăng câu hỏi
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function QuestionCard({
  q,
  defaultStudentId,
  onLike,
  onReply,
}: {
  q: QuestionItem
  defaultStudentId: string
  onLike: () => void
  onReply: (content: string, authorName: string) => void
}) {
  const [reply, setReply] = useState('')
  const [replyMode, setReplyMode] = useState<'anonymous' | 'mssv'>('anonymous')
  const [replyStudentId, setReplyStudentId] = useState('')

  const authorDisplay = q.studentId ? q.studentId : 'Ẩn danh'

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={'/placeholder.svg'} alt={q.authorName} />
            <AvatarFallback>{q.authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-heading font-semibold text-lg">{q.title}</h3>
              <Badge variant="outline" className="text-xs">{q.category}</Badge>
              <span className="text-xs text-muted-foreground">{formatTime(q.createdAt)}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">{q.content}</p>
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
                <div key={r.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">{r.authorName}</div>
                    <div className="text-xs text-muted-foreground">{formatTime(r.createdAt)}</div>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">{r.content}</div>
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
                      <Input
                        value={replyStudentId}
                        onChange={(e) => setReplyStudentId(e.target.value)}
                        placeholder="K#########"
                      />
                      {!replyStudentId && defaultStudentId && (
                        <div className="text-xs text-muted-foreground mt-1">Sẽ dùng MSSV đã lưu: {defaultStudentId}</div>
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
                    className="md:w-full ml-auto"
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
                    Gửi phản hồi
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
