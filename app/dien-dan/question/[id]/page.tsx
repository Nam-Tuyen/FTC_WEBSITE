"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  MessageSquare,
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  Clock,
  User,
  Star,
  ThumbsUp,
  Reply,
  Trash2,
  Edit,
  Loader2,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Types based on Google Apps Script API
interface Question {
  id: string
  title: string
  category: string
  user: string
  content: string
  like_count: number
  createdAt: string | Date
  isDeleted: boolean
  anonymous: boolean
  responses?: Response[]
}

interface Response {
  id: string
  user: string
  anonymous: boolean
  content: string
  questionId: string
  reaction: number
  createdAt: string | Date
  isDeleted: boolean
}

interface User {
  mssv: string
  full_name: string
  email: string
}

// API functions
const API_BASE = '/api/forum'
const API_TOKEN = 'ftc-2025-secret'

async function apiCall(functionName: string, payload: any) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      function: functionName,
      body: {
        ...payload,
        token: API_TOKEN
      }
    }),
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

async function fetchQuestions(payload: any = {}) {
  return apiCall('fetchQuestions', payload)
}

async function createResponse(payload: any) {
  return apiCall('createResponse', payload)
}

async function toggleLike(payload: any) {
  return apiCall('toggleLike', payload)
}

async function deleteResponse(payload: any) {
  return apiCall('deleteResponse', payload)
}

export default function QuestionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const questionId = params.id as string

  // State
  const [question, setQuestion] = useState<Question | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Response form state
  const [responseForm, setResponseForm] = useState({
    content: "",
    anonymous: false,
  })

  // User state (simplified for demo)
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage (simplified)
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Error parsing user:', e)
      }
    }
  }, [])

  const handleFetchQuestion = async () => {
    setIsLoading(true)
    try {
      const response = await fetchQuestions({
        take: 1,
        search: questionId, // This will need to be modified in the API
        includeDeleted: false
      })
      
      if (response.ok && response.data && response.data.items.length > 0) {
        const foundQuestion = response.data.items[0]
        setQuestion(foundQuestion)
        setResponses(foundQuestion.responses || [])
      } else {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy câu hỏi",
          variant: "destructive",
        })
        router.push('/dien-dan')
      }
    } catch (error) {
      console.error("Error fetching question:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải câu hỏi. Vui lòng thử lại.",
        variant: "destructive",
      })
      router.push('/dien-dan')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (questionId) {
      handleFetchQuestion()
    }
  }, [questionId])

  const handleCreateResponse = async () => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để trả lời",
        variant: "destructive",
      })
      return
    }

    if (!responseForm.content.trim()) {
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
        anonymous: responseForm.anonymous,
        content: responseForm.content,
        questionId: questionId,
      })

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Phản hồi đã được gửi thành công!",
        })
        setResponseForm({ content: "", anonymous: false })
        await handleFetchQuestion() // Refresh to get new responses
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Có lỗi xảy ra khi gửi phản hồi",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating response:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi gửi phản hồi",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleLike = async () => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thích câu hỏi",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await toggleLike({
        questionId,
        mssv: user.mssv,
        like: 1, // Always like for now
      })

      if (response.ok) {
        await handleFetchQuestion()
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Có lỗi xảy ra khi thích câu hỏi",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi thích câu hỏi",
        variant: "destructive",
      })
    }
  }

  const handleDeleteResponse = async (responseId: string) => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để xóa phản hồi",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await deleteResponse({
        responseId,
        mssv: user.mssv,
      })

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Phản hồi đã được xóa thành công!",
        })
        await handleFetchQuestion()
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Có lỗi xảy ra khi xóa phản hồi",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting response:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa phản hồi",
        variant: "destructive",
      })
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Vừa xong"
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    return `${days} ngày trước`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#003663] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">Đang tải câu hỏi...</h3>
          <p className="text-white/80">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-[#003663] text-white flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-white/50" />
          <h3 className="text-2xl font-bold mb-3">Không tìm thấy câu hỏi</h3>
          <p className="text-white/80 mb-4">Câu hỏi có thể đã bị xóa hoặc không tồn tại</p>
          <Link href="/dien-dan">
            <Button>Quay lại diễn đàn</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#003663] text-white">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dien-dan">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{question.category}</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{question.anonymous ? "Ẩn danh" : question.user}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {formatTime(
                  typeof question.createdAt === "number"
                    ? question.createdAt
                    : new Date(question.createdAt).getTime(),
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>{question.like_count} thích</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{responses.length} phản hồi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question Content */}
        <div className="bg-white/10 rounded-2xl border border-white/20 p-6 backdrop-blur-xl mb-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{question.content}</p>
          </div>
          
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/15">
            <button
              onClick={handleToggleLike}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              <Heart className="h-5 w-5" />
              <span className="font-semibold">{question.like_count}</span>
            </button>
          </div>
        </div>

        {/* Responses */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Phản hồi ({responses.length})
          </h2>

          {responses.length > 0 ? (
            <div className="space-y-4">
              {responses.map((response) => (
                <div
                  key={response.id}
                  className="bg-white/10 rounded-2xl border border-white/20 p-6 backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-green-300" />
                      </div>
                      <div>
                        <div className="font-bold">
                          {response.anonymous ? "Ẩn danh" : response.user}
                        </div>
                        <div className="text-sm text-white/70 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {formatTime(
                            typeof response.createdAt === "number"
                              ? response.createdAt
                              : new Date(response.createdAt).getTime(),
                          )}
                        </div>
                      </div>
                    </div>
                    {user && user.mssv === response.user && (
                      <button
                        onClick={() => handleDeleteResponse(response.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Xóa phản hồi"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    )}
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="leading-relaxed whitespace-pre-wrap">{response.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/10 rounded-2xl border border-white/20 p-12 text-center backdrop-blur-xl">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-white/50" />
              <h3 className="text-xl font-bold mb-2">Chưa có phản hồi</h3>
              <p className="text-white/80">Hãy là người đầu tiên trả lời câu hỏi này!</p>
            </div>
          )}

          {/* Response Form */}
          <div className="bg-white/10 rounded-2xl border border-white/20 p-6 backdrop-blur-xl">
            <h3 className="text-xl font-bold mb-4">Trả lời câu hỏi</h3>
            
            {user ? (
              <div className="space-y-4">
                <textarea
                  value={responseForm.content}
                  onChange={(e) => setResponseForm({ ...responseForm, content: e.target.value })}
                  rows={4}
                  placeholder="Nhập phản hồi của bạn..."
                  className="w-full rounded-xl bg-white/10 border-2 border-white/30 p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
                />
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={responseForm.anonymous}
                      onChange={(e) => setResponseForm({ ...responseForm, anonymous: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Ẩn danh</span>
                  </label>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleCreateResponse}
                    disabled={!responseForm.content.trim() || isSubmitting}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Gửi phản hồi
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/80 mb-4">Vui lòng đăng nhập để trả lời câu hỏi</p>
                <Button onClick={() => router.push("/auth/login")}>
                  Đăng nhập
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}