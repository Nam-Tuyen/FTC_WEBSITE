'use client'

/// <reference path="../../types/react-extensions.d.ts" />
/// <reference path="../../types/shadcn-ui.d.ts" />

import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Navigation } from '@/components/navigation'

// Import UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, HelpCircle, Search, Shuffle } from 'lucide-react'

// Import custom components
import { Hero } from './components/sections/hero'
import { Sidebar } from './components/sections/sidebar'
import { SearchBar } from './components/cards/search-bar'
import { AskQuestionCard } from './components/cards/ask-question-card'
import { QuestionCard } from './components/cards/question-card'
import { SidebarWidgets } from './components/sidebar-widgets'

import { createQuestion, fetchQuestions } from '../../googleSheetApi/sheet'

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

  const handleFetchQuestions = async () => {
    const questions = await fetchQuestions({})
    console.log('questions', questions)
    if (questions.length) setQuestions(questions)
  }

  useEffect(() => {
    const id = localStorage.getItem(STORAGE_KEYS.userId) || uuid()
    const sid = localStorage.getItem(STORAGE_KEYS.studentId) || ''
    setCurrentUserId(id)
    setCurrentStudentId(sid)
    localStorage.setItem(STORAGE_KEYS.userId, id)

    // Fetch questions from the server instead of localStorage
    // const fetchQuestions = async () => {
    //   try {
    //     const response = await fetch('/api/forum/questions')
    //     if (response.ok) {
    //       const data = await response.json()
    //       // Sort by creation time, newest first
    //       const sortedData = data.sort((a: QuestionItem, b: QuestionItem) => b.createdAt - a.createdAt);
    //       setQuestions(sortedData)
    //     } else {
    //       // Fallback to localStorage if API fails
    //       const saved = localStorage.getItem(STORAGE_KEYS.questions)
    //       setQuestions(saved ? JSON.parse(saved) : [])
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch questions, falling back to localStorage", error)
    //     const saved = localStorage.getItem(STORAGE_KEYS.questions)
    //     setQuestions(saved ? JSON.parse(saved) : [])
    //   }
    // }
    handleFetchQuestions()
    // fetchQuestions()
  }, []) // Re-fetch when questions length changes

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
      likes: 0,
      replies: [],
    }

    // Optimistically update the UI
    // setQuestions((prev: QuestionItem[]) => [newQ, ...prev])

    // Save student ID if it's valid and not already saved
    if (data.studentId && data.studentId !== currentStudentId) {
      localStorage.setItem(STORAGE_KEYS.studentId, data.studentId)
      setCurrentStudentId(data.studentId)
    }

    const hasValidMssv = data.studentId && /^K\d{9}$/.test(data.studentId)
    if (data.studentId && !hasValidMssv) {
      window.alert("MSSV không hợp lệ!")
      return
    }

    await createQuestion(newQ)

    // if (!hasValidMssv) {
    //   // Still save to localStorage for non-logged-in users
    //   const currentQuestions = JSON.parse(localStorage.getItem(STORAGE_KEYS.questions) || '[]')
    //   localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify([newQ, ...currentQuestions]))
    //   return
    // }

    // const newBody = JSON.stringify({
    //   studentId: data.studentId,
    //   name: authorName,
    //   title: data.title,
    //   content: data.content,
    //   category: data.category,
    //   questionId: newId,
    // })

    // console.log('newBOdy', newBody)
    // return

    // try {
    //   const tasks: Promise<any>[] = []
    //   tasks.push((async () => {
    //     try {
    //       await fetch('/api/forum/questions', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //           studentId: data.studentId,
    //           name: authorName,
    //           title: data.title,
    //           content: data.content,
    //           category: data.category,
    //           questionId: newId,
    //         }),
    //       })
    //     } catch (_) { }
    //   })())
    //   tasks.push((async () => {
    //     try {
    //       await fetch('/api/forum/notion/question', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //           studentId: data.studentId,
    //           name: authorName,
    //           title: data.title,
    //           content: data.content,
    //           category: data.category,
    //           questionId: newId,
    //           authorId: currentUserId,
    //         }),
    //       })
    //     } catch (_) { }
    //   })())
    //   await Promise.allSettled(tasks)
    // } catch (e) { }
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

      {/* Hero Section */}
      <Hero search={search} onSearchChange={(v) => setSearch(v)} />

      {/* Category chips */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md flex gap-3 items-center overflow-auto">
          <button
            className={`px-3 py-1 rounded-full text-sm ${selectedCategory === '' ? 'bg-gradient-to-r from-primary to-accent text-white' : 'bg-transparent text-muted-foreground border'}`}
            onClick={() => setSelectedCategory('')}
          >
            Tất cả
          </button>
          {CATEGORIES && Object.entries(CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              className={`px-3 py-1 rounded-full text-sm ${selectedCategory === key ? 'bg-gradient-to-r from-primary to-accent text-white' : 'bg-transparent text-muted-foreground border'}`}
              onClick={() => setSelectedCategory(key as any)}
            >
              {label}
            </button>
          ))}
          <div className="ml-auto text-sm text-muted-foreground">{sorted.length} câu hỏi</div>
        </div>
      </div>



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
              <h2 className="font-heading font-semibold text-lg leading-6 text-foreground mb-4 uppercase tracking-wide">CÂU HỎI GẦN ĐÂY</h2>
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

          <aside className="space-y-6 lg:col-start-4 lg:col-span-1 lg:sticky lg:top-24">
            {/* Right sticky utilities */}
            <SidebarWidgets
              currentStudentId={currentStudentId}
              setCurrentStudentId={(v: string) => { setCurrentStudentId(v); localStorage.setItem(STORAGE_KEYS.studentId, v) }}
            />
          </aside>

          {/* inline component to allow swapping widgets */}
          <style jsx>{`
            .widget-card { border-radius: 12px; box-shadow: 0 6px 18px rgba(13, 27, 62, 0.06); }
          `}</style>


        </div>
      </div>
    </div>
  )
}
