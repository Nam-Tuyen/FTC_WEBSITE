"use client"

import { useState, useEffect, useMemo, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
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
  X,
  Loader2,
  Send,
} from "lucide-react"
import { fetchQuestions, createQuestion, toggleLike, type QuestionItem, type Category } from "@/lib/api"
import { CATEGORIES } from "@/lib/constants"
import { formatTime } from "@/lib/utils/format"
import { useAuthStore } from "@/lib/auth-store"
import { useToast } from "@/hooks/use-toast"

export default function ForumPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { toast } = useToast()

  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("")
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 6

  // Ask question form state
  const [showAskForm, setShowAskForm] = useState(false)
  const [askForm, setAskForm] = useState({
    title: "",
    content: "",
    category: "Thảo luận" as Category,
    anonymous: false,
  })

  const handleFetchQuestions = async () => {
    setIsLoading(true)
    try {
      const response = await fetchQuestions({})
      if (response.ok && response.data) {
        setQuestions(response.data.items)
      } else {
        setQuestions([])
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
      setQuestions([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleFetchQuestions()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search, selectedCategory])

  const filtered = useMemo(() => {
    let result = questions

    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.content.toLowerCase().includes(q) ||
          item.user.toLowerCase().includes(q),
      )
    }

    if (selectedCategory) {
      result = result.filter((item) => item.category === selectedCategory)
    }

    return result
  }, [questions, search, selectedCategory])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const likeDiff = b.like_count - a.like_count
      if (likeDiff !== 0) return likeDiff
      const aTime = typeof a.createdAt === "number" ? a.createdAt : new Date(a.createdAt).getTime()
      const bTime = typeof b.createdAt === "number" ? b.createdAt : new Date(b.createdAt).getTime()
      return bTime - aTime
    })
  }, [filtered])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const pageSafe = Math.min(page, totalPages)
  const paginated = useMemo(() => {
    const start = (pageSafe - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, pageSafe])

  const handleCreateQuestion = async () => {
    if (!user) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để đặt câu hỏi",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (!askForm.title.trim() || !askForm.content.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ tiêu đề và nội dung",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await createQuestion({
        title: askForm.title,
        content: askForm.content,
        category: askForm.category,
        user: user.mssv,
        anonymous: askForm.anonymous,
      })

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Câu hỏi đã được tạo thành công!",
        })
        setAskForm({ title: "", content: "", category: "Thảo luận", anonymous: false })
        setShowAskForm(false)
        await handleFetchQuestions()
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Có lỗi xảy ra khi tạo câu hỏi",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo câu hỏi",
        variant: "destructive",
      })
    }
  }

  const handleToggleLike = async (questionId: string) => {
    if (!user) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để thích câu hỏi",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await toggleLike({
        questionId,
        mssv: user.mssv,
        like: 1,
      })

      if (response.ok) {
        await handleFetchQuestions()
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  return (
    <div className="min-h-screen bg-[#003663] text-white">
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
                onClick={() => setSearch("")}
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
                  onClick={() => setSelectedCategory("")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === "" ? "bg-white/20 border border-white/30" : "hover:bg-white/10"
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
                      onClick={() => setSelectedCategory(key as Category)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedCategory === key ? "bg-white/20 border border-white/30" : "hover:bg-white/10"
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
                  <span className="font-bold text-xl">
                    {pageSafe}/{totalPages}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6 space-y-6">
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
                  <div className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  Làm mới
                </button>
              </div>

              {showAskForm ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      value={askForm.category}
                      onChange={(e) => setAskForm({ ...askForm, category: e.target.value as Category })}
                      className="bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                    >
                      {Object.entries(CATEGORIES).map(([key, label]) => (
                        <option key={key} value={key} className="bg-[#003663] text-white">
                          {label}
                        </option>
                      ))}
                    </select>
                    <Input
                      value={askForm.title}
                      onChange={(e) => setAskForm({ ...askForm, title: e.target.value })}
                      placeholder="Tiêu đề câu hỏi"
                      className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    />
                  </div>
                  <textarea
                    value={askForm.content}
                    onChange={(e) => setAskForm({ ...askForm, content: e.target.value })}
                    rows={4}
                    placeholder="Nội dung câu hỏi..."
                    className="w-full rounded-xl bg-white/10 border-2 border-white/30 p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={askForm.anonymous}
                        onChange={(e) => setAskForm({ ...askForm, anonymous: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">Ẩn danh</span>
                    </label>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowAskForm(false)}>
                      Hủy
                    </Button>
                    <Button
                      onClick={handleCreateQuestion}
                      disabled={!askForm.title.trim() || !askForm.content.trim()}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Gửi câu hỏi
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowAskForm(true)} className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Đặt câu hỏi mới
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="bg-white/10 rounded-2xl border border-white/20 p-20 text-center backdrop-blur-xl">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-3">Đang tải câu hỏi...</h3>
                  <p className="text-white/80">Vui lòng chờ trong giây lát</p>
                </div>
              ) : paginated.length > 0 ? (
                paginated.map((question) => (
                  <Link
                    key={question.id}
                    href={`/dien-dan/question/${question.id}`}
                    className="block bg-white/10 rounded-2xl border border-white/20 hover:border-white/30 p-6 backdrop-blur-xl transition-all hover:bg-white/15"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-blue-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold">
                              {question.user === "anonymous" ? "Ẩn danh" : question.user}
                            </span>
                            {question.like_count >= 5 && (
                              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 rounded-full text-xs font-bold">
                                <Star className="h-3 w-3" />
                                HOT
                              </div>
                            )}
                          </div>
                          <div className="text-sm flex items-center gap-2 text-white/70">
                            <Clock className="h-4 w-4" />
                            {formatTime(
                              typeof question.createdAt === "number"
                                ? question.createdAt
                                : new Date(question.createdAt).getTime(),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3">{question.title}</h3>
                    <p className="mb-6 text-white/90 line-clamp-2">{question.content}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/15">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleToggleLike(question.id)
                          }}
                          className="flex items-center gap-2 hover:opacity-80 transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Heart className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-semibold">{question.like_count}</span>
                        </button>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <MessageCircle className="h-5 w-5" />
                          </div>
                          <span className="font-semibold">{question.responses?.length || 0}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold px-4 py-2 bg-white/20 rounded-full">{question.category}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="bg-white/10 rounded-2xl border border-white/20 p-20 text-center backdrop-blur-xl">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-white/50" />
                  <h3 className="text-2xl font-bold mb-3">Chưa có câu hỏi</h3>
                  <p className="text-white/80 mb-4">Hãy là người đầu tiên đặt câu hỏi!</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <Button variant="outline" disabled={pageSafe <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Trang trước
                </Button>
                <span className="px-6 py-2 bg-white/10 rounded-xl font-semibold">
                  {pageSafe} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={pageSafe >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
                  <Link
                    key={q.id}
                    href={`/dien-dan/question/${q.id}`}
                    className="block border-l-4 border-blue-400 pl-4 py-2 hover:bg-white/5 rounded transition-colors"
                  >
                    <p className="text-sm font-semibold mb-2 line-clamp-2">{q.title}</p>
                    <p className="text-xs text-white/70 flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {formatTime(typeof q.createdAt === "number" ? q.createdAt : new Date(q.createdAt).getTime())} •{" "}
                      {q.responses?.length || 0} phản hồi
                    </p>
                  </Link>
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
