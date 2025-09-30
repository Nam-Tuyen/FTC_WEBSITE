'use client'

import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { 
  MessageSquare, 
  Search, 
  Users, 
  TrendingUp, 
  Hash, 
  Star, 
  Clock, 
  Heart, 
  MessageCircle, 
  Send, 
  X 
} from 'lucide-react'
import { createQuestion, fetchQuestions } from '../../googleSheetApi/sheet'
import { CATEGORIES, STORAGE_KEYS, QuestionItem, Reply, ForumCategory } from './types'
import { uuid, formatTime } from './utils/index'
import { SimpleMobileSend } from './components/simple-mobile-send'
import './components/mobile-optimizations.css'


// Simple Button Component
const Button = ({ children, onClick, disabled, variant = 'default', className = '' }: any) => {
  const baseClass = 'px-4 py-2 rounded-xl font-semibold transition-all duration-300'
  const variantClass = variant === 'outline' 
    ? 'border-2 border-white/30 bg-transparent hover:bg-white/10 disabled:opacity-50' 
    : 'bg-white/20 hover:bg-white/30 disabled:opacity-50'
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${className}`}
    >
      {children}
    </button>
  )
}

// Simple Input Component
const Input = ({ value, onChange, placeholder, className = '' }: any) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all ${className}`}
    />
  )
}

// Navigation Component
const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#003663]/95 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FTC Forum</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Ask Question Component
const AskInline = ({ onSubmit, defaultStudentId, onUpdateStudentId }: any) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [studentId, setStudentId] = useState(defaultStudentId || '')
  const [category, setCategory] = useState<string>('DISCUSSION')

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return
    onSubmit({ title, content, studentId, category })
    setTitle('')
    setContent('')
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input 
          value={studentId} 
          onChange={(e: any) => { 
            setStudentId(e.target.value)
            onUpdateStudentId(e.target.value)
          }} 
          placeholder="MSSV (K21520001)" 
          className="bg-white/10 border-white/30 text-white placeholder-white/60"
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <option key={key} value={key} className="bg-[#003663] text-white">{label}</option>
          ))}
        </select>
        <Input 
          value={title} 
          onChange={(e: any) => setTitle(e.target.value)} 
          placeholder="Tiêu đề câu hỏi" 
          className="bg-white/10 border-white/30 text-white placeholder-white/60"
        />
      </div>
      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        rows={4} 
        placeholder="Nội dung câu hỏi..." 
        className="w-full rounded-xl bg-white/10 border-2 border-white/30 p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
      />
      <div className="flex justify-end">
        <Button 
          disabled={!title.trim() || !content.trim()} 
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3"
        >
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Gửi câu hỏi
          </div>
        </Button>
      </div>
    </div>
  )
}

export default function ForumPage() {
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [currentStudentId, setCurrentStudentId] = useState<string>('')
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | ''>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState(1)
  const [likingQuestions, setLikingQuestions] = useState<Set<string>>(new Set())
  const pageSize = 6

  const handleFetchQuestions = async () => {
    setIsLoading(true)
    try {
      const questions = await fetchQuestions({})
      console.log('Fetched questions from API:', questions)
      if (questions && questions.length > 0) {
        setQuestions(questions)
      } else {
        // No questions available
        console.log('No questions from API')
        setQuestions([])
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      // Set empty array on error
      setQuestions([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const id = uuid()
    setCurrentUserId(id)
    // Fetch questions from API on component mount
    handleFetchQuestions()
  }, [])

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
      const aLikes = Array.isArray(a.likes) ? a.likes.length : 0
      const bLikes = Array.isArray(b.likes) ? b.likes.length : 0
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

  const handleCreateQuestion = async (data: any) => {
    const newId = uuid()
    const authorName = data.studentId || 'Ẩn danh'
    
    // Validate MSSV format
    const hasValidMssv = data.studentId && /^K\d{9}$/.test(data.studentId)
    if (data.studentId && !hasValidMssv) {
      alert("MSSV không hợp lệ!")
      return
    }

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

    if (data.studentId && data.studentId !== currentStudentId) {
      setCurrentStudentId(data.studentId)
    }

    // Optimistically update UI first
    setQuestions((prev) => [newQ, ...prev])

    // Then send to API
    try {
      await createQuestion(newQ)
      console.log('Question created successfully in Google Sheets')
    } catch (error) {
      console.error('Error creating question:', error)
      // Show error message to user
      alert("Có lỗi xảy ra khi lưu câu hỏi. Vui lòng thử lại.")
      // Remove from UI if API call failed
      setQuestions((prev) => prev.filter(q => q.id !== newId))
    }
  }


  const handleToggleLike = (qid: string) => {
    if (!currentUserId || likingQuestions.has(qid)) return
    
    setLikingQuestions(prev => new Set(prev).add(qid))
    
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qid) return q
        const has = q.likes.includes(currentUserId)
        return { 
          ...q, 
          likes: has 
            ? q.likes.filter((x) => x !== currentUserId) 
            : [...q.likes, currentUserId] 
        }
      })
    )
    
    setTimeout(() => {
      setLikingQuestions(prev => {
        const newSet = new Set(prev)
        newSet.delete(qid)
        return newSet
      })
    }, 500)
  }

  const handleAddReply = (qid: string, content: string) => {
    if (!content.trim()) return
    const reply: Reply = {
      id: uuid(),
      content,
      createdAt: Date.now(),
      authorId: currentUserId,
      authorName: 'Ẩn danh',
    }
    setQuestions((prev) => 
      prev.map((q) => 
        q.id === qid ? { ...q, replies: [...q.replies, reply] } : q
      )
    )
  }

  return (
    <div className="min-h-screen bg-[#003663] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                DIỄN ĐÀN FTC
              </span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 leading-relaxed max-w-4xl mx-auto font-medium">
              Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối với nhau
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative mt-12">
            <div className="absolute left-6 top-1/2 -translate-y-1/2">
              <Search className="h-6 w-6 text-white/80" />
            </div>
            <Input
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Tìm kiếm câu hỏi, thảo luận..."
              className="pl-16 h-16 text-lg bg-white/15 border-white/25 placeholder-white/70 text-white rounded-2xl shadow-2xl focus:ring-white/40 backdrop-blur-xl"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-xl bg-white/20 hover:bg-white/30 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="h-16 bg-gradient-to-b from-transparent to-[#003663]/50" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Categories */}
            <div className="bg-white/10 rounded-2xl border border-white/20 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                  <Hash className="h-5 w-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Danh mục</h3>
                  <p className="text-sm text-white/70">Lọc theo chủ đề</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === '' 
                      ? 'bg-white/20 border border-white/30' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Tất cả</span>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{questions.length}</span>
                  </div>
                </button>
                {Object.entries(CATEGORIES).map(([key, label]) => {
                  const count = questions.filter((q) => q.category === key).length
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as ForumCategory)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedCategory === key 
                          ? 'bg-white/20 border border-white/30' 
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{label}</span>
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{count}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/10 rounded-2xl border border-white/20 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-200" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Thống kê</h3>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/10">
                  <span className="text-sm font-medium">Tổng câu hỏi</span>
                  <span className="font-bold text-xl">{questions.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/10">
                  <span className="text-sm font-medium">Hiển thị</span>
                  <span className="font-bold text-xl">{sorted.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/10">
                  <span className="text-sm font-medium">Trang</span>
                  <span className="font-bold text-xl">{pageSafe}/{totalPages}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6 space-y-6">
            {/* Ask Question */}
            <div className="bg-white/10 rounded-2xl border border-white/20 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-orange-200" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Đặt câu hỏi</h3>
                    <p className="text-sm text-white/70">Chia sẻ thắc mắc</p>
                  </div>
                </div>
                <button
                  onClick={handleFetchQuestions}
                  disabled={isLoading}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <div className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  Làm mới
                </button>
              </div>
              <AskInline 
                onSubmit={handleCreateQuestion} 
                defaultStudentId={currentStudentId}
                onUpdateStudentId={setCurrentStudentId}
              />
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="bg-white/10 rounded-2xl border border-white/20 p-20 text-center backdrop-blur-xl">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Đang tải câu hỏi...</h3>
                  <p className="text-white/80">Vui lòng chờ trong giây lát</p>
                </div>
              ) : (
                paginated.map((question) => (
                <div 
                  key={question.id} 
                  className="bg-white/10 rounded-2xl border border-white/20 hover:border-white/30 p-6 backdrop-blur-xl transition-all hover:bg-white/15"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-blue-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">{question.studentId || 'Ẩn danh'}</span>
                          {question.likes.length >= 5 && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 rounded-full text-xs font-bold">
                              <Star className="h-3 w-3" />
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

                  <h3 className="text-xl font-bold mb-3">{question.title}</h3>
                  <p className="mb-6 text-white/90">{question.content}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/15">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => handleToggleLike(question.id)} 
                        className="flex items-center gap-2 hover:opacity-80 transition-all"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          question.likes.includes(currentUserId) 
                            ? 'bg-red-500/20' 
                            : 'bg-white/10'
                        }`}>
                          <Heart className={`h-5 w-5 ${
                            question.likes.includes(currentUserId) 
                              ? 'text-red-500 fill-red-500' 
                              : 'text-white'
                          }`} />
                        </div>
                        <span className="font-semibold">{question.likes.length}</span>
                      </button>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <MessageCircle className="h-5 w-5" />
                        </div>
                        <span className="font-semibold">{question.replies.length}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold px-4 py-2 bg-white/20 rounded-full">
                      {CATEGORIES[question.category as ForumCategory]}
                    </span>
                  </div>

                  <div className="mt-4">
                    <SimpleMobileSend 
                      onSubmit={(content: string) => handleAddReply(question.id, content)} 
                    />
                  </div>
                </div>
                ))
              )}
              
              {!isLoading && sorted.length === 0 && (
                <div className="bg-white/10 rounded-2xl border border-white/20 p-20 text-center backdrop-blur-xl">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Chưa có câu hỏi</h3>
                  <p className="text-white/80 mb-4">Hãy là người đầu tiên đặt câu hỏi!</p>
                  <button
                    onClick={handleFetchQuestions}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all"
                  >
                    Làm mới
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <Button 
                  variant="outline" 
                  disabled={pageSafe <= 1} 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Trang trước
                </Button>
                <span className="px-6 py-2 bg-white/10 rounded-xl font-semibold">
                  {pageSafe} / {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  disabled={pageSafe >= totalPages} 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Trang sau
                </Button>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white/10 rounded-2xl border border-white/20 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-200" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Hoạt động</h3>
                  <p className="text-sm text-white/70">Mới nhất</p>
                </div>
              </div>
              <div className="space-y-4">
                {questions.slice(0, 5).map((q) => (
                  <div key={q.id} className="border-l-4 border-blue-400 pl-4 py-2">
                    <p className="text-sm font-semibold mb-2 line-clamp-2">{q.title}</p>
                    <p className="text-xs text-white/70 flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {formatTime(q.createdAt)} • {q.replies.length} phản hồi
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
      `}</style>
    </div>
  )
}

