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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
            Diễn đàn FTC
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối với nhau
          </p>
        </div>

        {/* Auth Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-[#003663]/30 backdrop-blur-xl rounded-2xl p-2 border border-blue-400/30">
            <button 
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                tab==="login" 
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg" 
                  : "text-blue-200 hover:text-white hover:bg-[#004a7c]/50"
              }`} 
              onClick={()=>setTab("login")}
            >
              Đăng nhập
            </button>
            <button 
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                tab==="register" 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg" 
                  : "text-blue-200 hover:text-white hover:bg-[#004a7c]/50"
              }`} 
              onClick={()=>setTab("register")}
            >
              Đăng ký
            </button>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="flex justify-center">
          {tab==="login" && (
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-3xl border border-blue-400/30 p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🔐</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Đăng nhập</h3>
                  <p className="text-blue-200 text-lg">Chào mừng bạn quay trở lại</p>
                </div>
                <LoginForm />
              </div>
            </div>
          )}
          {tab==="register" && (
            <div className="w-full max-w-2xl">
              <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-3xl border border-blue-400/30 p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Đăng ký</h3>
                  <p className="text-blue-200 text-lg">Tham gia cộng đồng FTC</p>
                </div>
                <RegisterForm />
              </div>
            </div>
          )}
        </div>

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