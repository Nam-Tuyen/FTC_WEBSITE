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
      
      let questions = res.data?.items || [];
      
      // Ensure liked_by is an array for each question
      questions = questions.map(q => ({
        ...q,
        liked_by: q.liked_by || []
      }));
      
      // Apply client-side sorting
      questions = sortQuestions(questions, selectedSort);
      
      setItems(questions);
      
      // Calculate stats
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

  // Enhanced sorting function with more accurate algorithms
  function sortQuestions(questions: QuestionItem[], sortBy: string): QuestionItem[] {
    const sortedQuestions = [...questions];
    
    switch (sortBy) {
      case 'newest':
        return sortedQuestions.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        
      case 'oldest':
        return sortedQuestions.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA.getTime() - dateB.getTime();
        });
        
      case 'most_liked':
        return sortedQuestions.sort((a, b) => {
          const likesA = a.like_count || 0;
          const likesB = b.like_count || 0;
          if (likesA !== likesB) {
            return likesB - likesA; // Descending order
          }
          // If likes are equal, sort by newest
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        
      case 'most_responses':
        return sortedQuestions.sort((a, b) => {
          const responsesA = a.responses?.length || 0;
          const responsesB = b.responses?.length || 0;
          if (responsesA !== responsesB) {
            return responsesB - responsesA; // Descending order
          }
          // If responses are equal, sort by newest
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        
      case 'alphabetical':
        return sortedQuestions.sort((a, b) => {
          const titleA = (a.title || '').toLowerCase();
          const titleB = (b.title || '').toLowerCase();
          return titleA.localeCompare(titleB, 'vi'); // Vietnamese locale support
        });
        
      case 'trending':
        return sortedQuestions.sort((a, b) => {
          // Calculate trending score: (likes + responses * 2) / days_since_creation
          const now = new Date();
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          
          const daysA = Math.max(1, (now.getTime() - dateA.getTime()) / (1000 * 60 * 60 * 24));
          const daysB = Math.max(1, (now.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24));
          
          const scoreA = ((a.like_count || 0) + (a.responses?.length || 0) * 2) / daysA;
          const scoreB = ((b.like_count || 0) + (b.responses?.length || 0) * 2) / daysB;
          
          if (scoreA !== scoreB) {
            return scoreB - scoreA; // Descending order
          }
          // If scores are equal, sort by newest
          return dateB.getTime() - dateA.getTime();
        });
        
      default:
        return sortedQuestions;
    }
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Modern Tech-Style Header Section - Mobile Optimized */}
        <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center py-6 sm:py-8 lg:py-12 px-2 sm:px-4 lg:px-6 overflow-hidden">
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
        
          <div className="relative max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 lg:space-y-8 z-10">
            {/* Logo Section - Mobile Optimized */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h1 className="relative text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-wider sm:tracking-widest text-white px-2">
                <span className="absolute inset-0 filter blur-lg sm:blur-xl opacity-50 text-cyan-400 animate-glow">DIỄN ĐÀN FTC</span>
                <span className="relative animate-glow" style={{
                  textShadow: '0 0 20px rgba(0, 174, 239, 0.6), 0 0 40px rgba(0, 174, 239, 0.4), 0 2px 15px rgba(0, 0, 0, 0.6)'
                }}>
                DIỄN ĐÀN FTC
              </span>
            </h1>
              
              {/* Animated Line - Mobile Responsive */}
              <div className="w-24 sm:w-32 lg:w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto animate-line-expand"></div>
            </div>
            
            {/* Subtitle - Mobile Optimized */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto italic font-light tracking-wide px-2">
              Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối
            </p>
            
            {/* Feature Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 lg:gap-4 mt-6 sm:mt-8 lg:mt-12 px-2">
              <button className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-xl border border-cyan-400/30 text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400/60">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center gap-1 sm:gap-2 lg:gap-3">
                  <span className="text-sm sm:text-base lg:text-lg filter drop-shadow-lg drop-shadow-cyan-400/80">💬</span>
                  <span className="text-xs sm:text-sm lg:text-base">Thảo luận</span>
                </div>
              </button>
              
              <button className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-xl border border-cyan-400/30 text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400/60">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center gap-1 sm:gap-2 lg:gap-3">
                  <span className="text-sm sm:text-base lg:text-lg filter drop-shadow-lg drop-shadow-cyan-400/80">🤝</span>
                  <span className="text-xs sm:text-sm lg:text-base">Kết nối</span>
                </div>
              </button>
              
              <button className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-xl border border-cyan-400/30 text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400/60">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center gap-1 sm:gap-2 lg:gap-3">
                  <span className="text-sm sm:text-base lg:text-lg filter drop-shadow-lg drop-shadow-cyan-400/80">🚀</span>
                  <span className="text-xs sm:text-sm lg:text-base">Xu hướng</span>
                </div>
              </button>
          </div>

            {/* Community Badge - Mobile Optimized */}
            <div className="mt-6 sm:mt-8 lg:mt-12 px-2">
              <button className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full font-bold text-xs sm:text-sm lg:text-base transition-all duration-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40 uppercase tracking-wider sm:tracking-widest">
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-600"></div>
                <div className="relative flex items-center justify-center gap-1 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-xs sm:text-sm lg:text-base">CỘNG ĐỒNG FINTECH</span>
            </div>
              </button>
          </div>
        </div>
      </section>

        {/* Modern Centered Auth Section - Mobile Optimized */}
        {!user && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] px-2 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16">
            {/* Auth Container - Centered & Modern */}
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl xl:max-w-4xl">
              {/* Auth Tabs - Modern Design */}
              <div className="flex justify-center mb-6 sm:mb-8 lg:mb-12">
                <div className="flex bg-gradient-to-r from-[#003663]/50 to-[#004a7c]/50 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 border border-blue-400/50 shadow-2xl shadow-blue-500/30 w-full max-w-sm sm:max-w-md">
                <button
                    className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-500 ${
                      tab==="login" 
                        ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-2xl scale-105 border-2 border-blue-400/60" 
                        : "text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-cyan-500/30 hover:scale-105 hover:border hover:border-blue-400/40"
                    }`} 
                    onClick={()=>setTab("login")}
                  >
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      <span className="text-base sm:text-lg lg:text-xl">🔐</span>
                      <span>Đăng nhập</span>
                    </span>
                </button>
                    <button
                    className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-500 ${
                      tab==="register" 
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl scale-105 border-2 border-green-400/60" 
                        : "text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-green-500/30 hover:to-emerald-500/30 hover:scale-105 hover:border hover:border-green-400/40"
                    }`} 
                    onClick={()=>setTab("register")}
                  >
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      <span className="text-base sm:text-lg lg:text-xl">👤</span>
                      <span>Đăng ký</span>
                    </span>
                    </button>
              </div>
            </div>

              {/* Auth Forms - Centered & Modern */}
              <div className="flex justify-center">
                {tab==="login" && (
                  <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                    <div className="bg-gradient-to-br from-[#003663]/95 to-[#004a7c]/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-blue-400/40 p-6 sm:p-8 lg:p-10 shadow-2xl shadow-blue-500/20">
                      {/* Login Header - Modern */}
                      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                        <div className="relative mb-4 sm:mb-6">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30">
                            <span className="text-2xl sm:text-3xl lg:text-4xl">🔐</span>
                </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-xs sm:text-sm lg:text-base">✓</span>
                </div>
              </div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">Đăng nhập</h3>
                        <p className="text-blue-200 text-sm sm:text-base lg:text-lg">Chào mừng bạn quay trở lại cộng đồng FTC</p>
                        <div className="w-16 sm:w-20 lg:w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-3 sm:mt-4"></div>
                </div>
                      <LoginForm />
                </div>
              </div>
                )}
                {tab==="register" && (
                  <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                    <div className="bg-gradient-to-br from-[#003663]/95 to-[#004a7c]/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-green-400/40 p-6 sm:p-8 lg:p-10 shadow-2xl shadow-green-500/20">
                      {/* Register Header - Modern */}
                      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                        <div className="relative mb-4 sm:mb-6">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30">
                            <span className="text-2xl sm:text-3xl lg:text-4xl">👤</span>
            </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-xs sm:text-sm lg:text-base">+</span>
                  </div>
                </div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">Đăng ký</h3>
                        <p className="text-blue-200 text-sm sm:text-base lg:text-lg">Tham gia cộng đồng FinTech hàng đầu</p>
                        <div className="w-16 sm:w-20 lg:w-24 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto mt-3 sm:mt-4"></div>
                  </div>
                      <RegisterForm />
                      </div>
                             </div>
                           )}
                        </div>

              {/* Additional Info - Modern */}
              <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-blue-400/30 p-4 sm:p-6 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="text-lg sm:text-xl lg:text-2xl">💡</span>
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-white">Mẹo nhỏ</h4>
                  </div>
                  <p className="text-blue-200 text-xs sm:text-sm lg:text-base leading-relaxed">
                    {tab === "login" 
                      ? "Nếu quên mật khẩu, hãy sử dụng tính năng 'Quên mật khẩu' để khôi phục tài khoản của bạn."
                      : "Hãy tạo câu hỏi bảo mật dễ nhớ để có thể khôi phục tài khoản khi cần thiết."
                    }
                  </p>
                        </div>
                      </div>
                    </div>
                  </div>
        )}

        {/* User Dashboard - Mobile Optimized */}
        {user && (
          <div className="mt-4 sm:mt-6 lg:mt-8">
            {/* User Info Card - Mobile Responsive */}
            <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-lg sm:rounded-xl lg:rounded-2xl border border-blue-400/30 p-3 sm:p-4 lg:p-5 shadow-2xl mb-3 sm:mb-4 lg:mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 lg:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm sm:text-base lg:text-lg">👋</span>
                  </div>
                  <div className="text-center sm:text-left min-w-0 flex-1">
                    <p className="text-xs sm:text-sm lg:text-base text-blue-200">Xin chào,</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">{user.full_name}</p>
                    <p className="text-xs sm:text-sm lg:text-base text-blue-300 truncate">({user.mssv})</p>
                  </div>
                </div>
                      <button 
                  onClick={logout}
                  className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg text-white font-semibold text-xs sm:text-sm lg:text-base hover:shadow-lg transition-all duration-200 flex-shrink-0"
                >
                  Đăng xuất
                      </button>
                      </div>
                  </div>

            {/* Main Content Grid - Mobile Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {/* New Question Form - Mobile Responsive */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-blue-400/30 p-3 sm:p-4 lg:p-6 shadow-2xl sticky top-2 sm:top-4">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                    <span className="text-base sm:text-lg lg:text-xl">💬</span>
                    <span className="text-sm sm:text-base lg:text-lg">Tạo câu hỏi mới</span>
                  </h3>
                  <NewQuestionForm onCreated={load} />
                             </div>
                           </div>

              {/* Questions List - Mobile Responsive */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {/* Search and Filter - Mobile Optimized */}
                  <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-blue-400/30 p-3 sm:p-4 lg:p-6 shadow-2xl">
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
                        <div className="text-center py-6 sm:py-8 lg:py-12">
                          <div className="text-3xl sm:text-4xl lg:text-6xl mb-3 sm:mb-4">💬</div>
                          <p className="text-blue-200 text-base sm:text-lg lg:text-xl mb-2">Chưa có câu hỏi nào</p>
                          <p className="text-blue-300 text-sm sm:text-base lg:text-lg">Hãy là người đầu tiên đặt câu hỏi!</p>
                  </div>
              ) : (
                        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
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