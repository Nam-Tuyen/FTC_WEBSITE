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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <PageHeader 
        title="DIỄN ĐÀN FTC"
        subtitle="Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối với nhau"
        showSocialMedia={false}
        badgeText="Cộng đồng học thuật"
        badgeIcon={MessageSquare}
        badgeColor="from-orange-500/20 to-red-500/20"
        badgeBorderColor="border-orange-400/30"
        badgeIconColor="text-orange-400"
        badgeTextColor="text-orange-100"
        badgeShadowColor="shadow-orange-500/10"
      />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header với gradient background */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl border border-slate-600/30 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Diễn đàn FTC
              </h1>
              <p className="text-slate-300 mt-1">Nơi chia sẻ kiến thức và kết nối cộng đồng</p>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">Xin chào,</p>
                    <p className="font-semibold text-white">{user.full_name}</p>
                    <p className="text-xs text-slate-400">({user.mssv})</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <button 
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      tab==="login" 
                        ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg" 
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                    }`} 
                    onClick={()=>setTab("login")}
                  >
                    Đăng nhập
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      tab==="register" 
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg" 
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                    }`} 
                    onClick={()=>setTab("register")}
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        {tab==="login" && (
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl border border-slate-600/30 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Đăng nhập</h3>
            <LoginForm />
          </div>
        )}
        {tab==="register" && (
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl border border-slate-600/30 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Đăng ký</h3>
            <RegisterForm />
          </div>
        )}

        {/* New Question Form */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl border border-slate-600/30 p-6 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Tạo câu hỏi mới</h3>
          <NewQuestionForm onCreated={load} />
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
              <p className="text-slate-300 mt-2">Đang tải câu hỏi...</p>
            </div>
          ) : (
            <>
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-slate-300 text-lg">Chưa có câu hỏi nào</p>
                  <p className="text-slate-400">Hãy là người đầu tiên đặt câu hỏi!</p>
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
    </div>
  )
}

export default function ForumPage() {
  return <AuthProvider><ForumHome /></AuthProvider>;
}