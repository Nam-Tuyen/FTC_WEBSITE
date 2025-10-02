"use client"

import { useEffect, useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import type { QuestionItem } from "@/types/forum";
import QuestionCard from "@/components/forum/QuestionCard";
import NewQuestionForm from "@/components/forum/NewQuestionForm";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/page-header"
import { MessageSquare } from "lucide-react"

function ForumHome() {
  const [items, setItems] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"forum"|"login"|"register">("forum");
  const { user, logout } = useAuth();

  async function load() {
    setLoading(true);
    const res = await ForumApi.fetchQuestions({ take: 30 });
    setItems(res.data?.items || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003663] via-[#004a7c] to-[#003663] text-white">
      <style jsx>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.7; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section - Similar to Chatbot */}
        <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="relative max-w-6xl mx-auto text-center space-y-4 sm:space-y-6 lg:space-y-8">
            <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold">
              <span className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-50 blur-2xl animate-pulse"></span>
              <span className="relative text-white animate-bounce" style={{ animation: 'blink 1.5s infinite, gradient-shift 2s ease-in-out infinite, bounce 2s infinite' }}>
                Diễn đàn FTC
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto italic px-4">
              Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối với nhau
            </p>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-300 mt-8">
              <div className="flex items-center gap-2">
                <span className="text-orange-400">💬</span>
                <span>Thảo luận chuyên môn</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">🤝</span>
                <span>Kết nối cộng đồng</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">🚀</span>
                <span>Xu hướng mới nhất</span>
              </div>
            </div>

            {/* Modern Badge */}
            <div className="mt-8 relative">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md border border-blue-400/30 rounded-full px-6 py-3 shadow-lg shadow-blue-500/10">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-blue-100">Cộng đồng FinTech</span>
              </div>
            </div>
          </div>
        </section>

        {/* Auth Tabs - Only show when not logged in */}
        {!user && (
          <>
            <div className="flex justify-center mb-16">
              <div className="flex bg-[#003663]/30 backdrop-blur-xl rounded-3xl p-3 border border-blue-400/30 shadow-2xl">
                <button 
                  className={`px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    tab==="login" 
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-xl scale-105" 
                      : "text-blue-200 hover:text-white hover:bg-[#004a7c]/50 hover:scale-105"
                  }`} 
                  onClick={()=>setTab("login")}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">🔐</span>
                    <span>Đăng nhập</span>
                  </span>
                </button>
                <button 
                  className={`px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    tab==="register" 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl scale-105" 
                      : "text-blue-200 hover:text-white hover:bg-[#004a7c]/50 hover:scale-105"
                  }`} 
                  onClick={()=>setTab("register")}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">👤</span>
                    <span>Đăng ký</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Auth Forms */}
            <div className="flex justify-center">
              {tab==="login" && (
                <div className="w-full max-w-4xl">
                  <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-3xl border border-blue-400/30 p-10 shadow-2xl">
                    <div className="text-center mb-10">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <span className="text-4xl">🔐</span>
                      </div>
                      <h3 className="text-4xl font-bold text-white mb-3">Đăng nhập</h3>
                      <p className="text-blue-200 text-xl">Chào mừng bạn quay trở lại</p>
                    </div>
                    <LoginForm />
                  </div>
                </div>
              )}
              {tab==="register" && (
                <div className="w-full max-w-4xl">
                  <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-3xl border border-blue-400/30 p-10 shadow-2xl">
                    <div className="text-center mb-10">
                      <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <span className="text-4xl">👤</span>
                      </div>
                      <h3 className="text-4xl font-bold text-white mb-3">Đăng ký</h3>
                      <p className="text-blue-200 text-xl">Tham gia cộng đồng FTC</p>
                    </div>
                    <RegisterForm />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* User Dashboard - Show after login */}
        {user && (
          <div className="mt-16">
            {/* User Info Card */}
            <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-3xl border border-blue-400/30 p-8 shadow-2xl mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👋</span>
                  </div>
                  <div>
                    <p className="text-lg text-blue-200">Xin chào,</p>
                    <p className="text-2xl font-bold text-white">{user.full_name}</p>
                    <p className="text-blue-300">({user.mssv})</p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Đăng xuất
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* New Question Form - Left Column */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-3xl border border-blue-400/30 p-8 shadow-2xl sticky top-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    Tạo câu hỏi mới
                  </h3>
                  <NewQuestionForm onCreated={load} />
                </div>
              </div>

              {/* Questions List - Right Column */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center py-16">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
                      <p className="text-blue-200 mt-4 text-lg">Đang tải câu hỏi...</p>
                    </div>
                  ) : (
                    <>
                      {items.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="text-8xl mb-6">💬</div>
                          <p className="text-blue-200 text-2xl mb-2">Chưa có câu hỏi nào</p>
                          <p className="text-blue-300 text-lg">Hãy là người đầu tiên đặt câu hỏi!</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {items.map(q => <QuestionCard key={q.id} q={q} />)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ForumPage() {
  return <AuthProvider><ForumHome /></AuthProvider>;
}