'use client'

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Shield, BookOpen, Calendar, Megaphone, Wallet, Users, Handshake, Star, TrendingUp, Target, Sparkles, Zap, ArrowRight, Search, FileText, Settings, Palette, Video, GraduationCap, DollarSign, UserCheck, Calculator, Heart, Image as ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react"
import React, { useState, useEffect } from "react"

const organizationData = [
  {
    title: "BAN ĐIỀU HÀNH",
    icon: Shield,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    cardGradient: "from-red-500 to-pink-500",
    category: "Điều hành câu lạc bộ ",
    photos: [], // No photos for Ban Điều Hành
    quickFeatures: [
      { icon: Target, text: "Chiến lược", color: "text-red-400" },
      { icon: Zap, text: "Lãnh đạo", color: "text-pink-400" },
      { icon: TrendingUp, text: "Đối ngoại", color: "text-orange-400" }
    ],
    responsibilities: [
      "Định hướng phát triển và đưa ra chiến lược dài hạn",
      "Điều phối và giám sát hoạt động của các ban, bảo đảm vận hành hiệu quả",
      "Phê duyệt kế hoạch, ngân sách và nhân sự",
      "Đại diện câu lạc bộ làm việc với các doanh nghiệp và đối tác"
    ],
  },
  {
    title: "BAN HỌC THUẬT",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    cardGradient: "from-blue-500 to-cyan-500",
    category: "Phụ trách chuyên môn học thuật",
    photos: ["/BAN HỌC THUẬT.JPG"],
    quickFeatures: [
      { icon: Search, text: "Nghiên cứu về lĩnh vực Fintech", color: "text-blue-400" },
      { icon: Target, text: "Đảm bảo chuyên môn", color: "text-cyan-400" },
      { icon: BookOpen, text: "Trau dồi kiến thức học thuật", color: "text-indigo-400" }
    ],
    responsibilities: [
      "Phụ trách nội dung chuyên môn cho các buổi workshop, talkshow",
      "Chuẩn bị câu hỏi cho các buổi tọa đàm và chuyên đề, xây dựng ngân hàng câu hỏi",
      "Ra đề và đánh giá đề cho cuộc thi ATTACKER",
      "Nghiên cứu và cập nhật xu hướng FinTech mới nhất"
    ],
  },
  {
    title: "BAN SỰ KIỆN",
    icon: Calendar,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    cardGradient: "from-green-500 to-emerald-500",
    category: "Phụ trách xử lý hồ sơ giấy tờ",
    photos: ["/BAN SỰ KIỆN.JPG"],
    quickFeatures: [
      { icon: FileText, text: "Chuẩn bị hồ sơ", color: "text-green-400" },
      { icon: Settings, text: "Xử lý giấy tờ", color: "text-emerald-400" },
      { icon: Calendar, text: "Lên kịch bản và timeline sự kiện", color: "text-teal-400" }
    ],
    responsibilities: [
      "Viết kế hoạch, báo cáo và các giấy tờ liên quan tới câu lạc bộ",
      "Xây dựng kịch bản MC và timeline cho sự kiện",
      "Điều phối logistics và venue cho các hoạt động",
      "Quản lý chất lượng và tiến độ thực hiện sự kiện"
    ],
  },
  {
    title: "BAN TRUYỀN THÔNG",
    icon: Megaphone,
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    cardGradient: "from-purple-500 to-violet-500",
    category: "Phụ trách mảng truyền thông",
    photos: ["/BAN TRUYỀN THÔNG.JPG"],
    quickFeatures: [
      { icon: TrendingUp, text: "Phát triển truyền thông", color: "text-purple-400" },
      { icon: Palette, text: "Thiết kế ấn phẩm", color: "text-violet-400" },
      { icon: Video, text: "Sản xuất nội dung truyền thông", color: "text-fuchsia-400" }
    ],
    responsibilities: [
      "Thiết kế ấn phẩm và truyền thông cho câu lạc bộ",
      "Quản lý các kênh truyền thông của câu lạc bộ và lên kế hoạch đăng bài truyền thông",
      "Phát triển hình ảnh và thương hiệu của câu lạc bộ",
      "Sản xuất nội dung video, podcast và multimedia"
    ],
  },
  {
    title: "BAN TÀI CHÍNH CÁ NHÂN",
    icon: Wallet,
    color: "from-amber-700 to-yellow-800",
    bgColor: "bg-amber-700/10",
    borderColor: "border-amber-700/20",
    cardGradient: "from-amber-700 to-yellow-800",
    category: "Phụ trách chuyên môn về mảng tài chính cá nhân",
    photos: ["/BAN TÀI CHÍNH CÁ NHÂN.JPG"],
    quickFeatures: [
      { icon: GraduationCap, text: "Giáo dục về tài chính cá nhân", color: "text-amber-400" },
      { icon: Wallet, text: "Làm việc với bộ bài MoneyWe", color: "text-yellow-400" },
      { icon: DollarSign, text: "Hỗ trợ giảng dạy về tài chính cá nhân", color: "text-orange-400" }
    ],
    responsibilities: [
      "Tổ chức đào tạo, nâng cao hiểu biết tài chính cá nhân cho sinh viên",
      "Phát triển và cập nhật nội dung cho bộ bài MoneyWe",
      "Hỗ trợ giảng viên giảng dạy các môn học liên quan đến mảng tài chính cá nhân",
      "Tư vấn và hướng dẫn quản lý tài chính cho sinh viên"
    ],
  },
  {
    title: "BAN NHÂN SỰ",
    icon: Users,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    cardGradient: "from-indigo-500 to-blue-500",
    category: "Phụ trách quản lý phân công nhân sự",
    photos: ["/BAN NHÂN SỰ.JPG"],
    quickFeatures: [
      { icon: UserCheck, text: "Quản lý nhân sự", color: "text-indigo-400" },
      { icon: Calculator, text: "Xây dựng dự trù kinh phí", color: "text-blue-400" },
      { icon: Heart, text: "Duy trì văn hóa câu lạc bộ", color: "text-cyan-400" }
    ],
    responsibilities: [
      "Phân công công việc và quản lý tiến độ công việc",
      "Triển khai hoạt động gắn kết, gìn giữ văn hóa tổ chức",
      "Lập dự trù kinh phí cho từng hoạt động",
      "Tuyển dụng, đào tạo và phát triển nhân lực"
    ],
  }
]

// Department Photo Carousel Component with Advanced Animations
function DepartmentPhotoCarousel({ departments }: { departments: typeof organizationData }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right' | 'none'>('none')
  
  // Get all departments with photos
  const departmentsWithPhotos = departments.filter(dept => dept.photos && dept.photos.length > 0)
  
  if (departmentsWithPhotos.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl border border-white/20">
        <div className="text-center">
          <ImageIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 text-lg">Chưa có hình ảnh hoạt động</p>
        </div>
      </div>
    )
  }

  const currentDepartment = departmentsWithPhotos[currentIndex]
  const currentPhoto = currentDepartment.photos[0] // Using first photo for now

  const nextPhoto = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDirection('right')
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % departmentsWithPhotos.length)
      setDirection('none')
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  const prevPhoto = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDirection('left')
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + departmentsWithPhotos.length) % departmentsWithPhotos.length)
      setDirection('none')
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  const goToPhoto = (index: number) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setDirection(index > currentIndex ? 'right' : 'left')
    setTimeout(() => {
      setCurrentIndex(index)
      setDirection('none')
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextPhoto()
      }
    }, 5000) // Auto-advance every 5 seconds

    return () => clearInterval(interval)
  }, [currentIndex, isTransitioning])

  return (
    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden group max-w-4xl mx-auto">
          {/* Simple Progress Indicator */}
          <div className="absolute top-4 right-4 z-20">
            <div className="text-white/70 text-xs bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
              {currentIndex + 1} / {departmentsWithPhotos.length}
            </div>
          </div>

      {/* Compact image display */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {/* Image container with slide animation */}
        <div 
          className={`relative w-full h-full transition-all duration-500 ease-out ${
            direction === 'right' ? 'transform translate-x-full opacity-0' :
            direction === 'left' ? 'transform -translate-x-full opacity-0' :
            'transform translate-x-0 opacity-100'
          }`}
        >
          <img
            src={currentPhoto}
            alt={`${currentDepartment.title} - Hoạt động`}
            className="w-full h-full object-cover transition-all duration-500 ease-out hover:scale-105"
          />
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
        
        {/* Compact navigation buttons */}
        <button
          onClick={prevPhoto}
          disabled={isTransitioning}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group/btn sm:left-4 sm:w-12 sm:h-12"
        >
          <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-x-0.5 sm:w-5 sm:h-5" />
        </button>
        
        <button
          onClick={nextPhoto}
          disabled={isTransitioning}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group/btn sm:right-4 sm:w-12 sm:h-12"
        >
          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 sm:w-5 sm:h-5" />
        </button>

        {/* Compact loading indicator */}
        {isTransitioning && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

          {/* Modern department indicators with responsive grid */}
          <div className="p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {departmentsWithPhotos.map((dept, index) => (
                <button
                  key={dept.title}
                  onClick={() => goToPhoto(index)}
                  disabled={isTransitioning}
                  className={`px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl text-xs font-semibold transition-all duration-500 ease-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-lg scale-105 shadow-cyan-500/25'
                      : 'bg-gradient-to-r from-white/10 to-white/5 text-white/80 hover:from-white/20 hover:to-white/10 hover:text-white hover:shadow-md border border-white/20'
                  }`}
                >
                  {/* Gradient background animation for active state */}
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 animate-pulse" />
                  )}

                  {/* Shimmer effect for active state */}
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  )}

                  <span className="relative z-10 text-center block truncate">
                    {dept.title}
                  </span>
                </button>
              ))}
            </div>
        
        {/* Modern auto-play indicator with gradient */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/30" />
          <span className="text-white/70 text-xs font-medium">Tự động chuyển ảnh</span>
        </div>
      </div>
    </div>
  )
}

const cooperationPrinciples = [
  {
    step: "01",
    title: "Ban Học thuật",
    description: "Chuẩn bị và bàn giao nội dung học thuật phù hợp theo yêu cầu của sự kiện",
    icon: BookOpen,
    color: "from-blue-600 to-blue-400"
  },
  {
    step: "02", 
    title: "Ban Sự kiện",
    description: "Lập kế hoạch và giải quyết các giấy tờ cần có để tổ chức sự kiện",
    icon: Calendar,
    color: "from-emerald-600 to-emerald-400"
  },
  {
    step: "03",
    title: "Ban Truyền thông", 
    description: "Thiết kế ấn phẩm và lên bài truyền thông về sự kiện",
    icon: Megaphone,
    color: "from-purple-600 to-purple-400"
  },
  {
    step: "04",
    title: "Ban Tài chính cá nhân",
    description: "Phụ trách mảng giáo dục tài chính cá nhân độc lập", 
    icon: Wallet,
    color: "from-orange-600 to-orange-400"
  },
  {
    step: "05",
    title: "Ban Nhân sự",
    description: "Bảo đảm nguồn lực được phân công hiệu quả và kịp tiến độ công việc đề ra",
    icon: Users,
    color: "from-rose-600 to-rose-400"
  }
]

export default function CoPage() {
  return (
    <div className="min-h-screen bg-[#003663] text-white overflow-hidden">
      <Navigation />

      <PageHeader 
        title="CƠ CẤU TỔ CHỨC"
        subtitle="Khám phá cấu trúc tổ chức và vai trò của các ban trong câu lạc bộ"
        showSocialMedia={false}
        badgeText="Tổ chức chuyên nghiệp"
        badgeIcon={Sparkles}
        badgeColor="from-emerald-500/20 to-teal-500/20"
        badgeBorderColor="border-emerald-400/30"
        badgeIconColor="text-emerald-400"
        badgeTextColor="text-emerald-100"
        badgeShadowColor="shadow-emerald-500/10"
      />

      {/* Department Photo Carousel Section - Mobile Optimized */}
      <section className="py-8 sm:py-12 px-3 sm:px-4 lg:px-8 mb-6 sm:mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
              <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">HÌNH ẢNH HOẠT ĐỘNG</h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed italic max-w-2xl mx-auto px-4">
              Khám phá các hoạt động và thành viên của từng ban trong câu lạc bộ
            </p>
          </div>
          
          <DepartmentPhotoCarousel departments={organizationData} />
        </div>
      </section>

      {/* Modern Organization Cards - Mobile Optimized */}
      <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">CÁC BAN CHUYÊN MÔN</h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed italic max-w-3xl mx-auto px-4">
              Tìm hiểu chi tiết về vai trò và trách nhiệm của từng ban
            </p>
          </div>
          
          <div className="grid gap-6 sm:gap-8 lg:gap-12">
            {organizationData.map((dept, idx) => {
              const IconComponent = dept.icon
              
              return (
                <div key={dept.title} className="group relative">
                  {/* Modern Glassmorphism Card */}
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-400/30">
                    
                    {/* Animated Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                      {/* Header Section - Mobile Optimized */}
                      <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                        {/* Category Info */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                          <div className={`px-3 sm:px-4 py-2 rounded-full text-xs font-bold backdrop-blur-xl border shadow-lg text-white bg-gradient-to-r ${dept.cardGradient}`}>
                            {dept.category}
                          </div>
                        </div>

                        {/* Title with Icon - Mobile Layout */}
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl flex-shrink-0">
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg" />
                          </div>
                          <h2 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight flex-1">
                            {dept.title}
                          </h2>
                        </div>

                        {/* Quick Features - Mobile Optimized */}
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {dept.quickFeatures?.map((feature, index) => {
                            const IconComponent = feature.icon
                            return (
                              <div key={index} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/80 bg-white/5 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-white/20">
                                <IconComponent className={`w-3 h-3 sm:w-4 sm:h-4 ${feature.color}`} />
                                <span className="truncate">{feature.text}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Content Section - Responsibilities - Mobile Optimized */}
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                          <h3 className="text-base sm:text-lg font-bold text-white">Nhiệm vụ và trách nhiệm</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                          {dept.responsibilities.map((responsibility, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-400/20 border border-blue-400/30 flex items-center justify-center mt-0.5 sm:mt-1 flex-shrink-0">
                                <span className="text-xs font-bold text-blue-300">{index + 1}</span>
                              </div>
                              <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                                {responsibility}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modern Compact Cooperation Principles */}
      <section className="py-6 sm:py-8 px-3 sm:px-4 lg:px-8 mt-4 sm:mt-6">
        <div className="max-w-5xl mx-auto">
          {/* Compact Section Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="relative inline-block mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-cyan-400/20 to-blue-400/20 animate-pulse" />
                <Handshake className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" />
              </div>
              <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-xl sm:rounded-2xl blur-lg animate-pulse" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 relative">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                NGUYÊN TẮC PHỐI HỢP
              </span>
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl mx-auto px-2">
              Quy trình phối hợp chuyên nghiệp giữa các ban để đảm bảo hiệu quả tối đa
            </p>
          </div>

          {/* Compact Process Flow */}
          <div className="relative">
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/3 via-cyan-500/3 to-blue-500/3 rounded-xl sm:rounded-2xl blur-2xl" />
            
            {/* Connection Line - Desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-500 to-blue-500 transform -translate-x-1/2 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/40 via-cyan-500/40 to-blue-500/40 animate-pulse" />
            </div>
            
            <div className="space-y-4 sm:space-y-6 relative z-10">
              {cooperationPrinciples.map((principle, index) => {
                const IconComponent = principle.icon
                const isEven = index % 2 === 0
                
                return (
                  <div key={index} className={`relative flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Compact Step Circle - Desktop */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-20 hidden lg:block">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-white/25 to-white/15 backdrop-blur-xl border border-white/40 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-r ${principle.color} opacity-30 animate-pulse`} />
                          <span className="text-sm font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent relative z-10">
                            {principle.step}
                          </span>
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-blue-500/15 rounded-xl blur-lg animate-pulse" />
                      </div>
                    </div>

                    {/* Compact Content Card */}
                    <div className={`lg:w-5/12 ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
                      <div className="group relative bg-gradient-to-br from-white/12 to-white/8 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/25 p-4 sm:p-5 shadow-lg hover:scale-[1.02] transition-all duration-500 hover:shadow-emerald-500/20 overflow-hidden">
                        {/* Subtle Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${principle.color} opacity-8 group-hover:opacity-12 transition-opacity duration-500`} />
                        
                        {/* Card Content */}
                        <div className="relative z-10">
                          {/* Mobile Step Number */}
                          <div className="lg:hidden flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="relative">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 animate-pulse" />
                                <span className="text-xs sm:text-sm font-bold text-white relative z-10">
                                  {principle.step}
                                </span>
                              </div>
                              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 rounded-lg sm:rounded-xl blur-md animate-pulse" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                                {principle.title}
                              </h3>
                            </div>
                          </div>

                          {/* Desktop Header */}
                          <div className="hidden lg:block mb-3 sm:mb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">
                              {principle.title}
                            </h3>
                          </div>
                          
                          {/* Icon and Description */}
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r ${principle.color} flex items-center justify-center shadow-md flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                              <div className="absolute inset-0 bg-gradient-to-r from-white/25 to-white/15 animate-pulse" />
                              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10" />
                            </div>
                            <p className="text-white/85 leading-relaxed text-xs sm:text-sm group-hover:text-white transition-colors">
                              {principle.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Compact Connection Arrow - Mobile */}
                    {index < cooperationPrinciples.length - 1 && (
                      <div className="lg:hidden flex justify-center my-4 sm:my-6">
                        <div className="relative">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center border border-emerald-400/30 backdrop-blur-sm">
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300 rotate-90" />
                          </div>
                          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-lg blur-md animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Mobile Optimized */}
      <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 p-6 sm:p-8 lg:p-12 shadow-2xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 px-2">THAM GIA ĐỘI NGŨ FTC</h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed italic px-4">
              Khám phá cơ hội phát triển bản thân và đóng góp cho cộng đồng FinTech
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <a 
                href="https://ftc-websites.vercel.app/ung-tuyen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl text-white font-bold hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-sm sm:text-base"
              >
                Đăng ký tham gia
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 20px) rotate(5deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(-5deg); }
        }
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.8; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes slideOutLeft {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes fadeInUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(147, 51, 234, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 5px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.6), 0 0 30px rgba(147, 51, 234, 0.4); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 20s ease-in-out infinite;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out;
        }
        .animate-slide-out-right {
          animation: slideOutRight 0.3s ease-in;
        }
        .animate-slide-out-left {
          animation: slideOutLeft 0.3s ease-in;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        .carousel-transition {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .carousel-transition-fast {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  )
}