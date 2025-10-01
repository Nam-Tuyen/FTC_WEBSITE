'use client'

import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Navigation } from '@/components/navigation'
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
  X,
  Plus
} from 'lucide-react'
import { createQuestion, fetchQuestions, createResponse, toggleLike } from '../../googleSheetApi/sheet'
import { CATEGORIES, STORAGE_KEYS, QuestionItem, Reply, ForumCategory } from './types'
import { uuid, formatTime } from './utils/index'
import { SimpleMobileSend } from './components/simple-mobile-send'
import { QuestionCard } from './components/cards/question-card'
import './components/mobile-optimizations.css'

// Import UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'




// Ask Question Component - Twitter-style
const AskQuestionCard = ({ onSubmit, defaultStudentId, onUpdateStudentId }: any) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [studentId, setStudentId] = useState(defaultStudentId || '')
  const [category, setCategory] = useState<string>('DISCUSSION')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'anonymous' | 'mssv'>('anonymous')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [modalInput, setModalInput] = useState(defaultStudentId || '')

  useEffect(() => {
    if (mode === 'mssv' && !studentId && defaultStudentId) {
      setStudentId(defaultStudentId)
    }
  }, [mode, defaultStudentId, studentId])

  function validate() {
    if (!title.trim() || !content.trim()) {
      setError('Vui lòng nhập đầy đủ tiêu đề và nội dung')
      return false
    }
    if (mode === 'mssv') {
      const id = (studentId || defaultStudentId || '').trim()
      if (!id) {
        setModalInput(defaultStudentId || '')
        setShowProfileModal(true)
        return false
      }
      if (!/^K\d{9}$/.test(id)) {
        setModalInput(id)
        setShowProfileModal(true)
        return false
      }
    }
    setError('')
    return true
  }

  const handlePostQuestion = () => {
    if (!validate()) return
    const sid = mode === 'mssv' ? (studentId || defaultStudentId).trim() : ''
    onSubmit({ title: title.trim(), content: content.trim(), studentId: sid, category })
    setTitle('')
    setContent('')
    setStudentId('')
    setCategory('DISCUSSION')
    setMode('anonymous')
  }

  return (
    <div id="ask-question-form" className="p-6 border-b border-border/50">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-foreground font-semibold border border-border/30">
            {defaultStudentId ? defaultStudentId.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-2">
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Bạn đang thắc mắc điều gì?" 
                className="text-base sm:text-lg border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:ring-0 font-medium"
              />
            </div>

            <div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-border/50 rounded-full text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Mô tả chi tiết câu hỏi của bạn..." 
              className="min-h-[120px] border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:ring-0 resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border/50 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input 
                    type="radio" 
                    checked={mode === 'anonymous'} 
                    onChange={() => setMode('anonymous')}
                    className="text-primary focus:ring-primary"
                  />
                  <span>Ẩn danh</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input 
                    type="radio" 
                    checked={mode === 'mssv'} 
                    onChange={() => setMode('mssv')}
                    className="text-primary focus:ring-primary"
                  />
                  <span>MSSV</span>
                </label>
              </div>
              
              {defaultStudentId && (
                <div className="text-sm text-muted-foreground">
                  MSSV: {defaultStudentId}
                </div>
              )}
            </div>

            <Button 
              onClick={handlePostQuestion}
              className="rounded-full px-6 w-full sm:w-auto"
              disabled={!title.trim() || !content.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Đăng câu hỏi
            </Button>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showProfileModal} onOpenChange={(v) => setShowProfileModal(v)}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Yêu cầu cập nhật hồ sơ</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Bạn đã chọn chế độ MSSV nhưng chưa có MSSV hợp lệ. Vui lòng nhập MSSV (dạng K#########) để tiếp tục.</p>
            <Input value={modalInput} onChange={(e) => setModalInput(e.target.value)} placeholder="K#########" />
          </div>
          <DialogFooter>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowProfileModal(false)}>Hủy</Button>
              <Button onClick={() => {
                const v = (modalInput || '').trim()
                if (!/^K\d{9}$/.test(v)) return
                onUpdateStudentId(v)
                setShowProfileModal(false)
              }}>Lưu MSSV</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
    
    // Load student ID from localStorage
    const savedStudentId = localStorage.getItem(STORAGE_KEYS.studentId)
    if (savedStudentId) {
      setCurrentStudentId(savedStudentId)
    }
    
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
      const aLikes = Array.isArray(a.likes) ? a.likes.length : (typeof a.likes === 'number' ? a.likes : 0)
      const bLikes = Array.isArray(b.likes) ? b.likes.length : (typeof b.likes === 'number' ? b.likes : 0)
      const likeDiff = bLikes - aLikes
      if (likeDiff !== 0) return likeDiff
      const aTime = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime()
      const bTime = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime()
      return bTime - aTime
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
    const hasValidMssv = data.studentId && /^K\d{9}$/.test(data.studentId)
    if (data.studentId && !hasValidMssv) {
      window.alert("MSSV không hợp lệ!")
      return
    }

    try {
      const newQ: QuestionItem = {
        id: '', // Will be set by the API
        title: data.title,
        content: data.content,
        userId: currentUserId,
        studentId: data.studentId,
        category: data.category as ForumCategory,
        createdAt: Date.now(),
        likes: 0,
        replies: [],
      }

      // Save student ID if it's valid and not already saved
      if (data.studentId && data.studentId !== currentStudentId) {
        localStorage.setItem(STORAGE_KEYS.studentId, data.studentId)
        setCurrentStudentId(data.studentId)
      }

      const response = await createQuestion(newQ)
      
      if (response && response.ok) {
        // Refresh questions from server
        await handleFetchQuestions()
        window.alert("Câu hỏi đã được tạo thành công!")
      } else {
        window.alert("Có lỗi xảy ra khi tạo câu hỏi: " + (response?.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating question:', error)
      window.alert("Có lỗi xảy ra khi tạo câu hỏi!")
    }
  }


  async function handleToggleLike(qid: string) {
    if (!currentStudentId) {
      window.alert("Vui lòng nhập MSSV để thực hiện chức năng này!")
      return
    }

    try {
      const question = questions.find(q => q.id === qid)
      if (!question) return

      const isCurrentlyLiked = Array.isArray(question.likes) 
        ? question.likes.includes(currentUserId)
        : false

      const response = await toggleLike(qid, currentStudentId, !isCurrentlyLiked)
      
      if (response && response.ok) {
        // Refresh questions from server to get updated like count
        await handleFetchQuestions()
      } else {
        window.alert("Có lỗi xảy ra khi cập nhật like: " + (response?.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      window.alert("Có lỗi xảy ra khi cập nhật like!")
    }
  }

  async function handleAddReply(qid: string, content: string, authorName: string) {
    if (!content.trim()) return

    try {
      const response = await createResponse({
        questionId: qid,
        content: content,
        studentId: currentStudentId,
        anonymous: !currentStudentId
      })

      if (response && response.ok) {
        // Refresh questions from server to get updated replies
        await handleFetchQuestions()
        window.alert("Phản hồi đã được thêm thành công!")
      } else {
        window.alert("Có lỗi xảy ra khi thêm phản hồi: " + (response?.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error adding reply:', error)
      window.alert("Có lỗi xảy ra khi thêm phản hồi!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 text-foreground">
      <Navigation />

      {/* Hero Section - Twitter-style minimal */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-3xl transform translate-x-24 -translate-y-8" />
          <div className="absolute bottom-0 left-0 w-[35%] h-[50%] bg-gradient-to-tr from-accent/10 to-primary/20 rounded-full blur-3xl -translate-x-24 translate-y-8" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-tr from-primary to-accent rounded-full shadow-lg mb-4 lg:mb-6">
            <MessageSquare className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 lg:mb-4">
            DIỄN ĐÀN SINH VIÊN
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 lg:mb-8 px-4">
            Nơi sinh viên chia sẻ, thảo luận và tìm kiếm giải đáp cho mọi thắc mắc
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative px-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Tìm kiếm câu hỏi..."
              className="pl-12 h-12 text-base bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 rounded-full w-full"
            />
          </div>
        </div>
      </section>

      {/* Main Layout - Twitter-style 3-column */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
          
          {/* Left Sidebar - Navigation */}
          <aside className="lg:col-span-3 space-y-4 lg:space-y-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-4 lg:p-6">
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
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-4 lg:p-6">
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
          <main className="lg:col-span-6 space-y-4 lg:space-y-6">
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
              {isLoading ? (
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-20 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-muted/20 flex items-center justify-center mx-auto mb-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Đang tải câu hỏi...</h3>
                  <p className="text-muted-foreground">Vui lòng chờ trong giây lát</p>
                </div>
              ) : (
                paginated.map((question) => (
                  <div key={question.id} className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-border transition-all">
                    <QuestionCard
                      q={question}
                      defaultStudentId={currentStudentId}
                      onLike={() => handleToggleLike(question.id)}
                      onReply={(content, authorName) => handleAddReply(question.id, content, authorName)}
                    />
                  </div>
                ))
              )}
              
              {!isLoading && sorted.length === 0 && (
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
          <aside className="lg:col-span-3 space-y-4 lg:space-y-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-4 lg:p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Hoạt động gần đây
              </h3>
              <div className="space-y-3">
                {questions.slice(0, 5).map((q) => (
                  <div key={q.id} className="border-l-2 border-primary/30 pl-3">
                    <p className="text-sm font-medium truncate">{q.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(typeof q.createdAt === 'number' ? q.createdAt : new Date(q.createdAt).getTime())} • {(q.replies || []).length} phản hồi
                    </p>
                  </div>
                ))}
              </div>
            </div>
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

