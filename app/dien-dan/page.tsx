"use client"

import { useEffect, useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import type { QuestionItem } from "@/types/forum";
import QuestionCard from "@/components/forum/QuestionCard";
import NewQuestionForm from "@/components/forum/NewQuestionForm";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import LoadingSpinner from "@/components/forum/LoadingSpinner";
import SearchAndFilter from "@/components/forum/SearchAndFilter";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/page-header"
import { MessageSquare } from "lucide-react"

function ForumHome() {
  const [items, setItems] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"forum"|"login"|"register">("forum");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalResponses: 0,
    totalLikes: 0,
    activeUsers: 0
  });
  const { user, logout } = useAuth();

  async function load() {
    setLoading(true);
    try {
      const res = await ForumApi.fetchQuestions({ 
        take: 50,
        category: selectedCategory || undefined,
        search: searchQuery || undefined
      });
      setItems(res.data?.items || []);
      
      // Calculate stats
      const questions = res.data?.items || [];
      const totalResponses = questions.reduce((sum, q) => sum + (q.responses?.length || 0), 0);
      const totalLikes = questions.reduce((sum, q) => sum + (q.like_count || 0), 0);
      const uniqueUsers = new Set(questions.map(q => q.user)).size;
      
      setStats({
        totalQuestions: questions.length,
        totalResponses,
        totalLikes,
        activeUsers: uniqueUsers
      });
    } catch (error) {
      console.error("Error loading questions:", error);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [searchQuery, selectedCategory, selectedSort]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003663] via-[#004a7c] to-[#003663] text-white">
      <style jsx>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.8; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .feature-card {
          animation: float 6s ease-in-out infinite;
        }
        .feature-card:nth-child(2) {
          animation-delay: 2s;
        }
        .feature-card:nth-child(3) {
          animation-delay: 4s;
        }
        .floating-particle {
          animation: float-particle 8s ease-in-out infinite;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section - Similar to Chatbot */}
        <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
          {/* Enhanced Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Geometric Shapes */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-2xl floating-particle"></div>
            <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-purple-500/25 to-pink-500/25 rounded-full blur-3xl floating-particle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl floating-particle" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-gradient-to-br from-green-500/25 to-emerald-500/25 rounded-full blur-2xl floating-particle" style={{ animationDelay: '0.5s' }}></div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#003663]/40 via-[#004a7c]/30 to-[#002244]/50"></div>
            
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`,
                backgroundSize: '100px 100px'
              }}></div>
            </div>
          </div>

          <div className="relative max-w-6xl mx-auto text-center space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Main Title */}
            <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight">
              <span className="absolute inset-0 bg-gradient-to-r from-white via-blue-100 to-cyan-200 opacity-60 blur-3xl animate-pulse"></span>
              <span className="relative bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent animate-bounce" style={{ animation: 'blink 2s infinite, gradient-shift 3s ease-in-out infinite, bounce 3s infinite' }}>
                DIỄN ĐÀN FTC
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-200 leading-relaxed max-w-5xl mx-auto italic font-light px-4">
              Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối
            </p>
            
            {/* Enhanced Feature Cards */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-lg sm:text-xl text-blue-200 mt-16">
              <div className="group feature-card flex items-center gap-4 bg-gradient-to-r from-orange-500/15 to-red-500/15 backdrop-blur-xl border border-orange-400/30 rounded-3xl px-8 py-6 hover:scale-110 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">💬</span>
                <span className="font-bold">Thảo luận chuyên môn</span>
              </div>
              <div className="group feature-card flex items-center gap-4 bg-gradient-to-r from-green-500/15 to-emerald-500/15 backdrop-blur-xl border border-green-400/30 rounded-3xl px-8 py-6 hover:scale-110 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">🤝</span>
                <span className="font-bold">Kết nối cộng đồng</span>
              </div>
              <div className="group feature-card flex items-center gap-4 bg-gradient-to-r from-purple-500/15 to-pink-500/15 backdrop-blur-xl border border-purple-400/30 rounded-3xl px-8 py-6 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">🚀</span>
                <span className="font-bold">Xu hướng mới nhất</span>
              </div>
            </div>

            {/* Enhanced Modern Badge */}
            <div className="mt-16 relative">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-500/25 to-cyan-500/25 backdrop-blur-2xl border border-blue-400/50 rounded-full px-10 py-5 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-bold text-blue-100 uppercase tracking-wider">Cộng đồng FinTech</span>
              </div>
            </div>
          </div>
        </section>

        {/* Auth Tabs - Only show when not logged in */}
        {!user && (
          <>
            <div className="flex justify-center mb-20">
              <div className="flex bg-gradient-to-r from-[#003663]/40 to-[#004a7c]/40 backdrop-blur-2xl rounded-3xl p-4 border border-blue-400/40 shadow-2xl shadow-blue-500/20">
                <button 
                  className={`px-16 py-6 rounded-2xl font-black text-xl transition-all duration-500 ${
                    tab==="login" 
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-2xl scale-110 border-2 border-blue-400/50" 
                      : "text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 hover:scale-105 hover:border hover:border-blue-400/30"
                  }`} 
                  onClick={()=>setTab("login")}
                >
                  <span className="flex items-center gap-4">
                    <span className="text-2xl">🔐</span>
                    <span>Đăng nhập</span>
                  </span>
                </button>
                <button 
                  className={`px-16 py-6 rounded-2xl font-black text-xl transition-all duration-500 ${
                    tab==="register" 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl scale-110 border-2 border-green-400/50" 
                      : "text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/20 hover:scale-105 hover:border hover:border-green-400/30"
                  }`} 
                  onClick={()=>setTab("register")}
                >
                  <span className="flex items-center gap-4">
                    <span className="text-2xl">👤</span>
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
                  {/* Search and Filter */}
                  <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-3xl border border-blue-400/30 p-6 shadow-2xl">
                    <SearchAndFilter
                      onSearch={setSearchQuery}
                      onCategoryFilter={setSelectedCategory}
                      onSortChange={setSelectedSort}
                      searchQuery={searchQuery}
                      selectedCategory={selectedCategory}
                      selectedSort={selectedSort}
                      stats={stats}
                    />
                  </div>

                  {/* Loading State */}
                  {loading ? (
                    <LoadingSpinner 
                      message="Đang tải câu hỏi..." 
                      showEncouragement={true}
                      size="lg"
                    />
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