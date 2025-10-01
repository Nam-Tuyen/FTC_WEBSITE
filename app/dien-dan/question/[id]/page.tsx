"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { MessageSquare, Clock, Heart, MessageCircle, ArrowLeft, Loader2, Send, Trash2, Star } from "lucide-react"
import {
  fetchQuestions,
  createResponse,
  toggleLike,
  deleteQuestion,
  deleteResponse,
  type QuestionItem,
} from "@/lib/api"
import { formatTime } from "@/lib/utils/format"
import { useAuthStore } from "@/lib/auth-store"
import { useToast } from "@/hooks/use-toast"

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const { toast } = useToast()

  const [question, setQuestion] = useState<QuestionItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [replyContent, setReplyContent] = useState("")
  const [replyAnonymous, setReplyAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const questionId = params.id as string

  const loadQuestion = async () => {
    setIsLoading(true)
    try {
      const response = await fetchQuestions({})
      if (response.ok && response.data) {
        const found = response.data.items.find((q) => q.id === questionId)
        if (found) {
          setQuestion(found)
        } else {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy câu hỏi",
            variant: "destructive",
          })
          router.push("/dien-dan")
        }
      }
    } catch (error) {
      console.error("Error loading question:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tải câu hỏi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadQuestion()
  }, [questionId])

  const handleToggleLike = async () => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thích câu hỏi",
        variant: "destructive",
      })
      setTimeout(() => router.push("/auth/login"), 1000)
      return
    }

    try {
      const response = await toggleLike({
        questionId,
        mssv: user.mssv,
        like: 1,
      })

      if (response.ok) {
        await loadQuestion()
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleAddReply = async () => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để phản hồi",
        variant: "destructive",
      })
      setTimeout(() => router.push("/auth/login"), 1000)
      return
    }

    if (!replyContent.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung phản hồi",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await createResponse({
        user: user.mssv,
        anonymous: replyAnonymous,
        content: replyContent,
        questionId,
      })

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Phản hồi đã được thêm thành công!",
        })
        setReplyContent("")
        setReplyAnonymous(false)
        await loadQuestion()
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Có lỗi xảy ra khi thêm phản hồi",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi thêm phản hồi",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteQuestion = async () => {
    if (!user || !question) return

    if (!confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return

    try {
      const response = await deleteQuestion({
        questionId: question.id,
        mssv: user.mssv,
      })

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Câu hỏi đã được xóa",
        })
        router.push("/dien-dan")
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Không thể xóa câu hỏi",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa câu hỏi",
        variant: "destructive",
      })
    }
  }

  const handleDeleteResponse = async (responseId: string) => {
    if (!user) return

    if (!confirm("Bạn có chắc chắn muốn xóa phản hồi này?")) return

    try {
      const response = await deleteResponse({
        responseId,
        mssv: user.mssv,
      })

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Phản hồi đã được xóa",
        })
        await loadQuestion()
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Không thể xóa phản hồi",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa phản hồi",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#003663] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4" />
          <p className="text-xl">Đang tải câu hỏi...</p>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-[#003663] text-white flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-white/50" />
          <p className="text-xl mb-4">Không tìm thấy câu hỏi</p>
          <Link href="/dien-dan">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại trang chủ
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = user && question.user === user.mssv

  return (
    <div className="min-h-screen bg-[#003663] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dien-dan" className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Quay lại diễn đàn
        </Link>

        {/* Question Card */}
        <div className="bg-white/10 rounded-2xl border border-white/20 p-8 backdrop-blur-xl mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg">{question.user === "anonymous" ? "Ẩn danh" : question.user}</span>
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
            {isOwner && (
              <Button variant="destructive" size="sm" onClick={handleDeleteQuestion}>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
          <p className="text-lg text-white/90 mb-6 whitespace-pre-wrap">{question.content}</p>

          <div className="flex items-center justify-between pt-6 border-t border-white/15">
            <div className="flex items-center gap-6">
              <button onClick={handleToggleLike} className="flex items-center gap-2 hover:opacity-80 transition-all">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-lg">{question.like_count}</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <span className="font-semibold text-lg">{question.responses?.length || 0}</span>
              </div>
            </div>
            <span className="text-sm font-bold px-4 py-2 bg-white/20 rounded-full">{String(question.category)}</span>
          </div>
        </div>

        {/* Reply Form */}
        <div className="bg-white/10 rounded-2xl border border-white/20 p-6 backdrop-blur-xl mb-8">
          <h3 className="text-xl font-bold mb-4">Thêm phản hồi</h3>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={4}
            placeholder="Nhập phản hồi của bạn..."
            className="w-full rounded-xl bg-white/10 border-2 border-white/30 p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none mb-4"
          />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={replyAnonymous}
                  onChange={(e) => setReplyAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Ẩn danh</span>
              </label>
              <Button 
                onClick={() => {
                  if (!user) {
                    toast({
                      title: "Yêu cầu đăng nhập",
                      description: "Vui lòng đăng nhập để phản hồi",
                      variant: "destructive",
                    })
                    setTimeout(() => router.push("/auth/login"), 1000)
                    return
                  }
                  handleAddReply()
                }} 
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Gửi phản hồi
                  </>
                )}
              </Button>
            </div>
        </div>

        {/* Responses */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold mb-4">Phản hồi ({question.responses?.length || 0})</h3>
          {question.responses && question.responses.length > 0 ? (
            question.responses.map((reply) => {
              const isReplyOwner = user && reply.user === user.mssv
              return (
                <div
                  key={reply.id}
                  className="bg-white/10 rounded-xl border border-white/20 p-6 backdrop-blur-xl hover:bg-white/15 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-blue-300" />
                      </div>
                      <div>
                        <span className="font-semibold">{reply.user === "anonymous" ? "Ẩn danh" : reply.user}</span>
                        <p className="text-xs text-white/70 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(new Date(reply.createdAt).getTime())}
                        </p>
                      </div>
                    </div>
                    {isReplyOwner && (
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteResponse(reply.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-white/90 whitespace-pre-wrap">{reply.content}</p>
                </div>
              )
            })
          ) : (
            <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center backdrop-blur-xl">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-white/50" />
              <p className="text-white/70">Chưa có phản hồi nào. Hãy là người đầu tiên!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

