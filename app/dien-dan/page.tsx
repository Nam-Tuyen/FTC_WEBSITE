'use client'

import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Navigation } from '@/components/navigation'

// Import UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, HelpCircle, Search } from 'lucide-react'

// Import custom components
import { Hero } from './components/sections/hero'
import { Sidebar } from './components/sections/sidebar'
import { SearchBar } from './components/cards/search-bar'
import { AskQuestionCard } from './components/cards/ask-question-card'
import { QuestionCard } from './components/cards/question-card'

// Import types and utils
import { CATEGORIES, STORAGE_KEYS, QuestionItem, Reply, ForumCategory } from './types'
import { uuid, formatTime } from './utils/index'

export default function ForumPage() {
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [currentStudentId, setCurrentStudentId] = useState<string>('')
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | ''>('')
  const [page, setPage] = useState(1)
  const pageSize = 6

  // Animation styles are now moved to components/sections/hero.tsx

  useEffect(() => {
    const id = localStorage.getItem(STORAGE_KEYS.userId) || uuid()
    const sid = localStorage.getItem(STORAGE_KEYS.studentId) || ''
    setCurrentUserId(id)
    setCurrentStudentId(sid)
    localStorage.setItem(STORAGE_KEYS.userId, id)

    // Fetch questions from the server instead of localStorage
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/forum/questions')
        if (response.ok) {
          const data = await response.json()
          // Sort by creation time, newest first
          const sortedData = data.sort((a: QuestionItem, b: QuestionItem) => b.createdAt - a.createdAt);
          setQuestions(sortedData)
        } else {
          // Fallback to localStorage if API fails
          const saved = localStorage.getItem(STORAGE_KEYS.questions)
          setQuestions(saved ? JSON.parse(saved) : [])
        }
      } catch (error) {
        console.error("Failed to fetch questions, falling back to localStorage", error)
        const saved = localStorage.getItem(STORAGE_KEYS.questions)
        setQuestions(saved ? JSON.parse(saved) : [])
      }
    }

    fetchQuestions()
  }, [questions.length]) // Re-fetch when questions length changes

  useEffect(() => {
    setPage(1)
  }, [search, selectedCategory])

  const filtered = useMemo(() => {
    let result = questions

    // Filter by search text
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter((item: QuestionItem) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((item) => item.category === selectedCategory)
    }

    return result
  }, [questions, search, selectedCategory])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const likeDiff = b.likes.length - a.likes.length
      if (likeDiff !== 0) return likeDiff
      return b.createdAt - a.createdAt
    })
  }, [filtered])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const pageSafe = Math.min(page, totalPages)
  const paginated = useMemo(() => {
    const start = (pageSafe - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, pageSafe, pageSize])

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
      userId: currentUserId,
      studentId: data.studentId,
      category: data.category as ForumCategory,
      createdAt: Date.now(),
      likes: [],
      replies: [],
    }

    // Optimistically update the UI
    setQuestions((prev: QuestionItem[]) => [newQ, ...prev])

    // Save student ID if it's valid and not already saved
    if (data.studentId && data.studentId !== currentStudentId) {
      localStorage.setItem(STORAGE_KEYS.studentId, data.studentId)
      setCurrentStudentId(data.studentId)
    }

    const hasValidMssv = !!data.studentId && /^K\d{9}$/.test(data.studentId)

    if (!hasValidMssv) {
      // Still save to localStorage for non-logged-in users
      const currentQuestions = JSON.parse(localStorage.getItem(STORAGE_KEYS.questions) || '[]')
      localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify([newQ, ...currentQuestions]))
      return
    }

    try {
      const tasks: Promise<any>[] = []
      tasks.push((async () => {
        try {
          await fetch('/api/forum/questions', {
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
          })
        } catch (_) {}
      })())
      tasks.push((async () => {
        try {
          await fetch('/api/forum/notion/question', {
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
          })
        } catch (_) {}
      })())
      await Promise.allSettled(tasks)
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
    const reply: Reply = {
      id: uuid(),
      content,
      createdAt: Date.now(),
      userId: currentUserId,
      likes: [],
    }
    setQuestions((prev) => prev.map((q) => (q.id === qid ? { ...q, replies: [...q.replies, reply] } : q)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes shimmer {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
      
      <Navigation />

      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[50vh] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl" 
            style={{ animation: "float 20s ease-in-out infinite" }}
          />
          <div 
            className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl"
            style={{ animation: "float 20s ease-in-out infinite reverse" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.05),transparent)] pointer-events-none"
            style={{ animation: "pulse 8s infinite" }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center space-y-8">
            {/* Main Title with Gradient Style */}
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-50 blur-2xl animate-pulse"></span>
              <span className="relative bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text animate-text-shine">
                DIỄN ĐÀN
              </span>
            </h1>
            
            {/* Simple Italicized Subtitle */}
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto italic">
              Nơi thảo luận và giải đáp thắc mắc cho các bạn tân sinh viên
            </p>

            {/* Search Bar with Modern Style */}
            <div className="relative max-w-3xl mx-auto mt-12">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-75"></div>
                <div className="relative bg-background/40 backdrop-blur-sm rounded-lg">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm câu hỏi, nội dung..."
                    className="pl-12 bg-transparent border-primary/20 h-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Main content section */}
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
              <h2 className="font-heading font-semibold text-2xl leading-8 text-foreground mb-6">Câu hỏi gần đây</h2>
              <div className="space-y-4">
                {paginated.map((q) => (
                  <QuestionCard
                    key={q.id}
                    q={q}
                    defaultStudentId={currentStudentId}
                    onLike={() => handleToggleLike(q.id)}
                    onReply={(content, authorName) => handleAddReply(q.id, content, authorName)}
                  />
                ))}
                {sorted.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-sm text-muted-foreground">Không có kết quả phù hợp.</CardContent>
                  </Card>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">Trang {pageSafe}/{totalPages}</div>
                  <div className="inline-flex gap-2">
                    <Button variant="outline" size="sm" disabled={pageSafe <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                      Trang trước
                    </Button>
                    <Button variant="outline" size="sm" disabled={pageSafe >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                      Trang sau
                    </Button>
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="px-[30px]">
                <CardTitle className="text-[19px] leading-[35px] font-heading uppercase whitespace-nowrap text-center">Hồ sơ của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-[30px]">
                <div className="text-sm text-muted-foreground whitespace-nowrap"><p>Hãy nhập MSSV</p></div>
                <Input className="mt-1"
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
              <CardHeader className="px-[30px]">
                <CardTitle className="text-[19px] leading-[35px] font-heading uppercase whitespace-nowrap text-center">Hành động nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-[30px]">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    const el = document.getElementById('ask-question-form')
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                >
                  <MessageSquare size={16} className="mr-2" />
                  Đặt câu hỏi
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <HelpCircle size={16} className="mr-2" />
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
