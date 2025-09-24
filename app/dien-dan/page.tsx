'use client'

import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Search, Users, TrendingUp, Hash, Star, Clock, Eye, Heart, MessageCircle } from 'lucide-react'
import { createQuestion, fetchQuestions } from '../../googleSheetApi/sheet'
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
    <div className="min-h-screen bg-[#003663] text-white">
      <Navigation />

      {/* Hero Section với hiệu ứng nhấp nháy giống trang cơ cấu */}
      <section className="relative min-h-[60vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl animate-float-reverse" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold">
            <span className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-50 blur-2xl animate-pulse"></span>
            <span className="relative text-white animate-bounce" style={{
              animation: 'blink 1.5s infinite, gradient-shift 2s ease-in-out infinite, bounce 2s infinite'
            }}>
              DIỄN ĐÀN FTC
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto italic">
            Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối với nhau
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative mt-8">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-white/70" />
            </div>
            <Input
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Tìm kiếm câu hỏi..."
              className="pl-12 h-12 text-base bg-white/10 border border-white/20 placeholder-white/70 text-white rounded-full shadow-lg focus-visible:ring-2 focus-visible:ring-white/60"
            />
            {!!search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full bg-white/10 hover:bg-white/20"
                aria-label="Xóa tìm kiếm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Modern Layout với improved spacing và visual hierarchy */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Sidebar - Compact và Modern */}
          <aside className="xl:col-span-3 space-y-8">
            {/* Categories - Enhanced Design */}
            <div className="bg-gradient-to-br from-white/8 to-white/3 rounded-3xl border border-white/15 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Hash className="h-5 w-5 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-white">Danh mục</h3>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 group ${
                    selectedCategory === '' 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 shadow-lg shadow-blue-500/10' 
                      : 'hover:bg-white/10 border border-transparent hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Tất cả</span>
                    <span className="text-sm bg-white/15 px-3 py-1 rounded-full font-medium">{questions.length}</span>
                  </div>
                </button>
                {Object.entries(CATEGORIES).map(([key, label]) => {
                  const count = questions.filter((q) => q.category === key).length
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as ForumCategory)}
                      className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 group ${
                        selectedCategory === key 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 shadow-lg shadow-blue-500/10' 
                          : 'hover:bg-white/10 border border-transparent hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{label}</span>
                        <span className="text-sm bg-white/15 px-3 py-1 rounded-full font-medium">{count}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Stats - Modern Cards */}
            <div className="bg-gradient-to-br from-white/8 to-white/3 rounded-3xl border border-white/15 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-300" />
                </div>
                <h3 className="text-xl font-bold text-white">Thống kê</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/8 border border-white/10">
                  <span className="text-white/90 font-medium">Tổng câu hỏi</span>
                  <span className="font-bold text-xl text-white">{questions.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/8 border border-white/10">
                  <span className="text-white/90 font-medium">Hiển thị</span>
                  <span className="font-bold text-xl text-white">{sorted.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/8 border border-white/10">
                  <span className="text-white/90 font-medium">Trang hiện tại</span>
                  <span className="font-bold text-xl text-white">{pageSafe}/{totalPages}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Enhanced với better spacing */}
          <main className="xl:col-span-6 space-y-8">
            {/* Ask box - Modern Design */}
            <div className="bg-gradient-to-br from-white/8 to-white/3 rounded-3xl border border-white/15 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-orange-300" />
                </div>
                <h3 className="text-xl font-bold text-white">Đặt câu hỏi</h3>
              </div>
              <AskInline onSubmit={handleCreateQuestion} defaultStudentId={currentStudentId} onUpdateStudentId={(sid)=>{setCurrentStudentId(sid); localStorage.setItem(STORAGE_KEYS.studentId, sid)}} />
            </div>

            {/* Questions list - Enhanced Cards */}
            <div className="space-y-6">
              {paginated.map((question) => (
                <div key={question.id} className="bg-gradient-to-br from-white/8 to-white/3 rounded-3xl border border-white/15 hover:border-white/25 transition-all duration-500 overflow-hidden group hover:bg-white/10 shadow-2xl hover:shadow-3xl backdrop-blur-xl">
                  <div className="p-8">
                    {/* Header - Enhanced */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <MessageSquare className="h-6 w-6 text-blue-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-lg text-white">{question.studentId || 'Ẩn danh'}</span>
                            {/* Hot badge when many likes */}
                            {((Array.isArray(question.likes) ? question.likes.length : 0) >= 10) && (
                              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                <Star className="h-3 w-3 text-white" />
                                HOT
                              </div>
                            )}
                          </div>
                          <div className="text-sm flex items-center gap-2 text-white/70">
                            <Clock className="h-4 w-4" />
                            {formatTime(question.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content - Better Typography */}
                    <h3 className="text-2xl font-bold mb-4 leading-tight text-white">{question.title}</h3>
                    <p className="mb-8 line-clamp-3 text-lg leading-relaxed text-white/90">{question.content}</p>

                    {/* Actions - Enhanced */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/15">
                      <div className="flex items-center gap-8">
                        <button onClick={() => handleToggleLike(question.id)} className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 hover:scale-110 group">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                            <Heart className="h-5 w-5 text-white group-hover:text-red-400" />
                          </div>
                          <span className="font-semibold text-white">{Array.isArray(question.likes) ? question.likes.length : 0}</span>
                        </button>
                        <div className="flex items-center gap-3 opacity-90">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <MessageCircle className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-semibold text-white">{(question.replies || []).length}</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-90">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Eye className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-semibold text-white">{(question as any).views || 0}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 capitalize">
                        {CATEGORIES[question.category] || 'Khác'}
                      </span>
                    </div>

                    {/* Quick reply - Enhanced */}
                    <div className="mt-6">
                      <QuickReply onSubmit={(content)=>handleAddReply(question.id, content, '')} />
                    </div>
                  </div>
                </div>
              ))}

              {sorted.length === 0 && (
                <div className="bg-gradient-to-br from-white/8 to-white/3 rounded-3xl border border-white/15 p-20 text-center shadow-2xl backdrop-blur-xl">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-8">
                    <MessageSquare className="h-12 w-12 text-blue-300" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Chưa có câu hỏi nào</h3>
                  <p className="text-white/80 text-xl">Hãy là người đầu tiên đặt câu hỏi!</p>
                </div>
              )}
            </div>

            {/* Pagination - Enhanced */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 pt-8">
                <Button variant="outline" disabled={pageSafe <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-2xl border-white/30 text-white hover:bg-white/10 px-8 py-3 font-semibold">
                  Trang trước
                </Button>
                <span className="px-6 py-3 bg-white/10 rounded-2xl text-white font-semibold">{pageSafe} / {totalPages}</span>
                <Button variant="outline" disabled={pageSafe >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-2xl border-white/30 text-white hover:bg-white/10 px-8 py-3 font-semibold">
                  Trang sau
                </Button>
              </div>
            )}
          </main>

          {/* Right Sidebar - Enhanced */}
          <aside className="xl:col-span-3 space-y-8">
            <div className="bg-gradient-to-br from-white/8 to-white/3 rounded-3xl border border-white/15 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-300" />
                </div>
                <h3 className="text-xl font-bold text-white">Hoạt động gần đây</h3>
              </div>
              <div className="space-y-6">
                {questions.slice(0, 5).map((q) => (
                  <div key={q.id} className="border-l-4 border-gradient-to-b from-blue-400 to-purple-400 pl-6 py-2">
                    <p className="text-sm font-semibold line-clamp-2 mb-2 leading-relaxed text-white">{q.title}</p>
                    <p className="text-xs text-white/70 flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {formatTime(q.createdAt)} • {(q.replies || []).length} phản hồi
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .line-clamp-2 { 
          display: -webkit-box; 
          -webkit-line-clamp: 2; 
          -webkit-box-orient: vertical; 
          overflow: hidden; 
        }
        .line-clamp-3 { 
          display: -webkit-box; 
          -webkit-line-clamp: 3; 
          -webkit-box-orient: vertical; 
          overflow: hidden; 
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        .border-gradient-to-b {
          border-image: linear-gradient(to bottom, #60a5fa, #a78bfa) 1;
        }
      `}</style>
    </div>
  )
}

// --- Inline helpers to keep page self-contained ---
function AskInline({ onSubmit, defaultStudentId, onUpdateStudentId }: { onSubmit: (d: { title: string; content: string; studentId: string; category: string }) => void; defaultStudentId?: string; onUpdateStudentId: (sid: string)=>void }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [studentId, setStudentId] = useState(defaultStudentId || '')
  const [category, setCategory] = useState<string>('thao-luan')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input value={studentId} onChange={(e)=>{ setStudentId(e.target.value); onUpdateStudentId(e.target.value) }} placeholder="MSSV (ví dụ: K21520001)" className="bg-white/10 border-white/20 text-white placeholder-white/60" />
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="bg-white/10 border border-white/20 rounded-xl px-3 py-2">
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <option key={key} value={key} className="bg-[#003663] text-white">{label}</option>
          ))}
        </select>
        <Input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Tiêu đề câu hỏi" className="bg-white/10 border-white/20 text-white placeholder-white/60" />
      </div>
      <textarea value={content} onChange={(e)=>setContent(e.target.value)} rows={4} placeholder="Nội dung câu hỏi" className="w-full rounded-xl bg-white/10 border border-white/20 p-3 placeholder-white/60" />
      <div className="flex justify-end">
        <Button disabled={!title.trim() || !content.trim()} onClick={()=>onSubmit({ title, content, studentId, category })} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl">
          Gửi câu hỏi
        </Button>
      </div>
    </div>
  )
}

function QuickReply({ onSubmit }: { onSubmit: (content: string)=>void }) {
  const [content, setContent] = useState('')
  return (
    <div className="mt-4 flex items-center gap-2">
      <Input value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Viết phản hồi nhanh..." className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/60" />
      <Button onClick={()=>{ if(content.trim()){ onSubmit(content); setContent('') } }} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl">
        Trả lời
      </Button>
    </div>
  )
}
