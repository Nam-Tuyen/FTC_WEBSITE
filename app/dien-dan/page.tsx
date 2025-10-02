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
        {/* Modern Tech-Style Header Section - Mobile Optimized */}
        <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-6 overflow-hidden">
          {/* Hexagon Pattern Background */}
          <div className="absolute inset-0 opacity-50 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 174, 239, 0.1) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(0, 174, 239, 0.1) 0%, transparent 50%)`
            }}></div>
          </div>

          {/* Digital Rain Effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-24 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-30 animate-rain"
                style={{
                  left: `${5 + i * 10}%`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>

          {/* Animated Tech Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(0, 174, 239, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 174, 239, 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/80 animate-float-particle"
                style={{
                  left: `${10 + i * 10}%`,
                  animationDelay: `${i * 2}s`
                }}
              />
            ))}
          </div>

          {/* Circuit Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-15">
            <div className="absolute top-1/5 left-1/10 w-48 h-px bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
            <div className="absolute top-1/6 right-1/6 w-px h-36 bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
            <div className="absolute bottom-1/4 left-1/5 w-48 h-px bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
            <div className="absolute bottom-1/5 right-1/10 w-px h-36 bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
          </div>

          <div className="relative max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 lg:space-y-10 z-10">
            {/* Logo Section - Mobile Optimized */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-wider sm:tracking-widest text-white px-2">
                <span className="absolute inset-0 filter blur-xl sm:blur-2xl opacity-50 text-cyan-400 animate-glow">DIỄN ĐÀN FTC</span>
                <span className="relative animate-glow" style={{
                  textShadow: '0 0 20px rgba(0, 174, 239, 0.6), 0 0 40px rgba(0, 174, 239, 0.4), 0 2px 15px rgba(0, 0, 0, 0.6)'
                }}>
                  DIỄN ĐÀN FTC
                </span>
              </h1>
              
              {/* Animated Line - Mobile Responsive */}
              <div className="w-32 sm:w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto animate-line-expand"></div>
            </div>
            
            {/* Subtitle - Mobile Optimized */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/85 leading-relaxed max-w-3xl mx-auto italic font-light tracking-wide px-4">
              Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối
            </p>
            
            {/* Feature Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6 mt-8 sm:mt-12 lg:mt-16 px-2">
              <button className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-xl border border-cyan-400/30 text-white px-4 py-3 sm:px-6 sm:py-4 lg:px-10 lg:py-5 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400/60">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                  <span className="text-lg sm:text-xl lg:text-2xl filter drop-shadow-lg drop-shadow-cyan-400/80">💬</span>
                  <span className="text-xs sm:text-sm lg:text-base">Thảo luận chuyên môn</span>
                </div>
              </button>
              
              <button className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-xl border border-cyan-400/30 text-white px-4 py-3 sm:px-6 sm:py-4 lg:px-10 lg:py-5 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400/60">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                  <span className="text-lg sm:text-xl lg:text-2xl filter drop-shadow-lg drop-shadow-cyan-400/80">🤝</span>
                  <span className="text-xs sm:text-sm lg:text-base">Kết nối cộng đồng</span>
                </div>
              </button>
              
              <button className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-xl border border-cyan-400/30 text-white px-4 py-3 sm:px-6 sm:py-4 lg:px-10 lg:py-5 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400/60">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                  <span className="text-lg sm:text-xl lg:text-2xl filter drop-shadow-lg drop-shadow-cyan-400/80">🚀</span>
                  <span className="text-xs sm:text-sm lg:text-base">Xu hướng mới nhất</span>
                </div>
              </button>
            </div>

            {/* Community Badge - Mobile Optimized */}
            <div className="mt-8 sm:mt-12 lg:mt-16 px-2">
              <button className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-5 rounded-full font-bold text-xs sm:text-sm lg:text-lg transition-all duration-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40 uppercase tracking-wider sm:tracking-widest">
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-600"></div>
                <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-xs sm:text-sm lg:text-base">CỘNG ĐỒNG FINTECH</span>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Auth Tabs - Mobile Optimized */}
        {!user && (
          <>
            <div className="flex justify-center mb-12 sm:mb-16 lg:mb-20 px-4">
              <div className="flex flex-col sm:flex-row bg-gradient-to-r from-[#003663]/40 to-[#004a7c]/40 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-2 sm:p-4 border border-blue-400/40 shadow-2xl shadow-blue-500/20 w-full max-w-md sm:max-w-none">
                <button 
                  className={`px-6 py-4 sm:px-12 sm:py-5 lg:px-16 lg:py-6 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-xl transition-all duration-500 ${
                    tab==="login" 
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-2xl scale-105 sm:scale-110 border-2 border-blue-400/50" 
                      : "text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 hover:scale-105 hover:border hover:border-blue-400/30"
                  }`} 
                  onClick={()=>setTab("login")}
                >
                  <span className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                    <span className="text-lg sm:text-xl lg:text-2xl">🔐</span>
                    <span>Đăng nhập</span>
                  </span>
                </button>
                <button 
                  className={`px-6 py-4 sm:px-12 sm:py-5 lg:px-16 lg:py-6 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-xl transition-all duration-500 ${
                    tab==="register" 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl scale-105 sm:scale-110 border-2 border-green-400/50" 
                      : "text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/20 hover:scale-105 hover:border hover:border-green-400/30"
                  }`} 
                  onClick={()=>setTab("register")}
                >
                  <span className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                    <span className="text-lg sm:text-xl lg:text-2xl">👤</span>
                    <span>Đăng ký</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Auth Forms - Mobile Optimized */}
            <div className="flex justify-center px-4">
              {tab==="login" && (
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-4xl">
                  <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-blue-400/30 p-6 sm:p-8 lg:p-10 shadow-2xl">
                    <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8">
                        <span className="text-2xl sm:text-3xl lg:text-4xl">🔐</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">Đăng nhập</h3>
                      <p className="text-blue-200 text-sm sm:text-base lg:text-xl">Chào mừng bạn quay trở lại</p>
                    </div>
                    <LoginForm />
                  </div>
                </div>
              )}
              {tab==="register" && (
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-4xl">
                  <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-blue-400/30 p-6 sm:p-8 lg:p-10 shadow-2xl">
                    <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8">
                        <span className="text-2xl sm:text-3xl lg:text-4xl">👤</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">Đăng ký</h3>
                      <p className="text-blue-200 text-sm sm:text-base lg:text-xl">Tham gia cộng đồng FTC</p>
                    </div>
                    <RegisterForm />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* User Dashboard - Mobile Optimized */}
        {user && (
          <div className="mt-8 sm:mt-12 lg:mt-16 px-4">
            {/* User Info Card - Mobile Responsive */}
            <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-blue-400/30 p-4 sm:p-6 lg:p-8 shadow-2xl mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-lg sm:text-xl lg:text-2xl">👋</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm sm:text-base lg:text-lg text-blue-200">Xin chào,</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{user.full_name}</p>
                    <p className="text-xs sm:text-sm lg:text-base text-blue-300">({user.mssv})</p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg sm:rounded-xl text-white font-semibold text-sm sm:text-base hover:shadow-lg transition-all duration-200"
                >
                  Đăng xuất
                </button>
              </div>
            </div>

            {/* Main Content Grid - Mobile Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* New Question Form - Mobile Responsive */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-blue-400/30 p-4 sm:p-6 lg:p-8 shadow-2xl sticky top-4 sm:top-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl lg:text-2xl">💬</span>
                    <span className="text-sm sm:text-base lg:text-lg">Tạo câu hỏi mới</span>
                  </h3>
                  <NewQuestionForm onCreated={load} />
                </div>
              </div>

              {/* Questions List - Mobile Responsive */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="space-y-4 sm:space-y-6">
                  {/* Search and Filter - Mobile Optimized */}
                  <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-blue-400/30 p-4 sm:p-6 shadow-2xl">
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

                  {/* Loading State - Mobile Responsive */}
                  {loading ? (
                    <LoadingSpinner 
                      message="Đang tải câu hỏi..." 
                      showEncouragement={true}
                      size="md"
                    />
                  ) : (
                    <>
                      {items.length === 0 ? (
                        <div className="text-center py-8 sm:py-12 lg:py-16">
                          <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6">💬</div>
                          <p className="text-blue-200 text-lg sm:text-xl lg:text-2xl mb-2">Chưa có câu hỏi nào</p>
                          <p className="text-blue-300 text-sm sm:text-base lg:text-lg">Hãy là người đầu tiên đặt câu hỏi!</p>
                        </div>
                      ) : (
                        <div className="space-y-4 sm:space-y-6">
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