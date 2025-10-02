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
    <div className="min-h-screen bg-gradient-to-br from-[#003663] via-[#004a7c] to-[#003663] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Auth Tabs */}
        <div className="flex mb-8 bg-[#003663]/30 backdrop-blur-xl rounded-2xl p-2 border border-blue-400/30">
          <button 
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              tab==="login" 
                ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg" 
                : "text-blue-200 hover:text-white hover:bg-[#004a7c]/50"
            }`} 
            onClick={()=>setTab("login")}
          >
            Đăng nhập
          </button>
          <button 
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              tab==="register" 
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg" 
                : "text-blue-200 hover:text-white hover:bg-[#004a7c]/50"
            }`} 
            onClick={()=>setTab("register")}
          >
            Đăng ký
          </button>
        </div>

        {/* Auth Forms */}
        {tab==="login" && (
          <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Đăng nhập</h3>
              <p className="text-blue-200 mt-2">Chào mừng bạn quay trở lại</p>
            </div>
            <LoginForm />
          </div>
        )}
        {tab==="register" && (
          <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Đăng ký</h3>
              <p className="text-blue-200 mt-2">Tham gia cộng đồng FTC</p>
            </div>
            <RegisterForm />
          </div>
        )}

        {/* User Dashboard - Show after login */}
        {user && (
          <div className="mt-8">
            <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6 shadow-2xl mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-lg">👋</span>
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Xin chào,</p>
                    <p className="font-semibold text-white">{user.full_name}</p>
                    <p className="text-xs text-blue-300">({user.mssv})</p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Đăng xuất
                </button>
              </div>
            </div>

            {/* New Question Form */}
            <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6 shadow-2xl mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>💬</span>
                Tạo câu hỏi mới
              </h3>
              <NewQuestionForm onCreated={load} />
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
                  <p className="text-blue-200 mt-2">Đang tải câu hỏi...</p>
                </div>
              ) : (
                <>
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💬</div>
                      <p className="text-blue-200 text-lg">Chưa có câu hỏi nào</p>
                      <p className="text-blue-300">Hãy là người đầu tiên đặt câu hỏi!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map(q => <QuestionCard key={q.id} q={q} />)}
                    </div>
                  )}
                </>
              )}
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