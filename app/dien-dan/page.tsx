'use client'

/// <reference path="../../types/react-extensions.d.ts" />
/// <reference path="../../types/shadcn-ui.d.ts" />

import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Navigation } from '@/components/navigation'

// Import UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, HelpCircle, Search, Shuffle, Users, TrendingUp, Hash } from 'lucide-react'

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
    try {
      const questions = await fetchQuestions({})
      console.log('fetchQuestions -> queries:', {})
      console.log('Response:', questions)
      console.log('Response status: 200')
      console.log('Response headers: Headers')
      console.log('Result:', questions)
      console.log('questions Array(' + (Array.isArray(questions) ? questions.length : 0) + ')')
      
      if (Array.isArray(questions) && questions.length > 0) {
        setQuestions(questions)
      } else {
        setQuestions([])
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      setQuestions([])
    }
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
      const aLikes = Array.isArray(a.likes) ? a.likes.length : (typeof a.likes === 'number' ? a.likes : 0)
      const bLikes = Array.isArray(b.likes) ? b.likes.length : (typeof b.likes === 'number' ? b.likes : 0)
      const likeDiff = bLikes - aLikes
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
      authorId: currentUserId,
      authorName: authorName,
      studentId: data.studentId,
      category: data.category as ForumCategory,
      createdAt: Date.now(),
      likes: [],
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
        const likesArray = Array.isArray(q.likes) ? q.likes : []
        const has = likesArray.includes(currentUserId)
        return { ...q, likes: has ? likesArray.filter((x) => x !== currentUserId) : [...likesArray, currentUserId] }
      })
    )
  }

  function handleAddReply(qid: string, content: string, authorName: string) {
    if (!content.trim()) return
    const reply: Reply = {
      id: uuid(),
      content,
      createdAt: Date.now(),
      authorId: currentUserId,
      authorName: authorName,
    }
    setQuestions((prev) => prev.map((q) => {
      if (q.id !== qid) return q
      const repliesArray = Array.isArray(q.replies) ? q.replies : []
      return { ...q, replies: [...repliesArray, reply] }
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 text-foreground">
      <Navigation />

      {/* Hero Section - Twitter-style minimal */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-3xl transform translate-x-24 -translate-y-8" />
          <div className="absolute bottom-0 left-0 w-[35%] h-[50%] bg-gradient-to-tr from-accent/10 to-primary/20 rounded-full blur-3xl -translate-x-24 translate-y-8" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-primary to-accent rounded-full shadow-lg mb-6">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            DIỄN ĐÀN SINH VIÊN
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Nơi sinh viên chia sẻ, thảo luận và tìm kiếm giải đáp cho mọi thắc mắc
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm câu hỏi..."
              className="pl-12 h-12 text-base bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Main Layout - Twitter-style 3-column */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Navigation */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Danh mục
              </h3>
              <div className="space-y-2">
                <button
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === '' 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setSelectedCategory('')}
                >
                  <div className="flex items-center justify-between">
                    <span>Tất cả</span>
                    <span className="text-sm">{questions.length}</span>
                  </div>
                </button>
                {CATEGORIES && Object.entries(CATEGORIES).map(([key, label]) => {
                  const count = questions.filter(q => q.category === key).length;
                  return (
                    <button
                      key={key}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedCategory === key 
                          ? 'bg-primary text-primary-foreground shadow-lg' 
                          : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setSelectedCategory(key as any)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{label}</span>
                        <span className="text-sm">{count}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Thống kê
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tổng câu hỏi</span>
                  <span className="font-semibold">{questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hiển thị</span>
                  <span className="font-semibold">{sorted.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Trang hiện tại</span>
                  <span className="font-semibold">{pageSafe}/{totalPages}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Feed */}
          <main className="lg:col-span-6 space-y-6">
            {/* Create Question Card */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
              <AskQuestionCard
                currentStudentId={currentStudentId}
                onUpdateStudentId={(sid) => {
                  setCurrentStudentId(sid)
                  localStorage.setItem(STORAGE_KEYS.studentId, sid)
                }}
                onSubmit={handleCreateQuestion}
              />
            </div>

            {/* Questions Feed */}
            <div className="space-y-4">
              {paginated.map((q) => (
                <div key={q.id} className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-border transition-all">
                  <QuestionCard
                    q={q}
                    defaultStudentId={currentStudentId}
                    onLike={() => handleToggleLike(q.id)}
                    onReply={(content, authorName) => handleAddReply(q.id, content, authorName)}
                  />
                </div>
              ))}
              
              {sorted.length === 0 && (
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Chưa có câu hỏi nào</h3>
                  <p className="text-muted-foreground">Hãy là người đầu tiên đặt câu hỏi!</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <Button 
                  variant="outline" 
                  disabled={pageSafe <= 1} 
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-full"
                >
                  Trang trước
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  {pageSafe} / {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  disabled={pageSafe >= totalPages} 
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-full"
                >
                  Trang sau
                </Button>
              </div>
            )}
          </main>

          {/* Right Sidebar - Widgets */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Hoạt động gần đây
              </h3>
              <div className="space-y-3">
                {questions.slice(0, 5).map((q) => (
                  <div key={q.id} className="border-l-2 border-primary/30 pl-3">
                    <p className="text-sm font-medium truncate">{q.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(q.createdAt)} • {Array.isArray(q.replies) ? q.replies.length : 0} phản hồi
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <SidebarWidgets
              currentStudentId={currentStudentId}
              setCurrentStudentId={(v: string) => { 
                setCurrentStudentId(v); 
                localStorage.setItem(STORAGE_KEYS.studentId, v) 
              }}
            />
          </aside>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 30px) scale(1.05); }
        }
        .animate-gradient-slow {
          animation: gradient 15s ease infinite;
          background-size: 200% 200%;
        }
        .animate-blob {
          animation: blob 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
