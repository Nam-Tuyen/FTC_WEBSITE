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
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 backdrop-blur-xl mb-8">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-blue-200 uppercase tracking-wider">
                  Cộng đồng FinTech
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-6 leading-tight">
                Diễn đàn FTC
              </h1>
              
              <p className="text-xl sm:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed mb-8">
                Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối với nhau
              </p>
              
              {/* Feature highlights */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-300">
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
            </div>
          </div>
        </div>

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
                <div className="w-full max-w-lg">
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