'use client'

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Shield, BookOpen, Calendar, Megaphone, Wallet, Users, Handshake, Star, TrendingUp, Target, Sparkles, Zap, ArrowRight, Search, FileText, Settings, Palette, Video, GraduationCap, DollarSign, UserCheck, Calculator, Heart } from "lucide-react"

// Department Photos - Using local images from public folder
const departmentPhotos = [
  {
    title: "BAN ĐIỀU HÀNH",
    photos: [
      "https://placeholder.com/600x400", // No image available for executive board
      "https://placeholder.com/600x400"
    ]
  },
  {
    title: "BAN HỌC THUẬT", 
    photos: [
      "/BAN HỌC THUẬT.JPG", // Local image from public folder
      "/BAN HỌC THUẬT.JPG"  // Same image for both slots
    ]
  },
  {
    title: "BAN SỰ KIỆN",
    photos: [
      "/BAN SỰ KIỆN.JPG", // Local image from public folder
      "/BAN SỰ KIỆN.JPG"  // Same image for both slots
    ]
  },
  {
    title: "BAN TRUYỀN THÔNG",
    photos: [
      "/BAN TRUYỀN THÔNG.JPG", // Local image from public folder
      "/BAN TRUYỀN THÔNG.JPG"  // Same image for both slots
    ]
  },
  {
    title: "BAN TÀI CHÍNH CÁ NHÂN",
    photos: [
      "/BAN TÀI CHÍNH CÁ NHÂN.JPG", // Local image from public folder
      "/BAN TÀI CHÍNH CÁ NHÂN.JPG"  // Same image for both slots
    ]
  },
  {
    title: "BAN NHÂN SỰ",
    photos: [
      "/BAN NHÂN SỰ.JPG", // Local image from public folder
      "/BAN NHÂN SỰ.JPG"  // Same image for both slots
    ]
  }
]

const organizationData = [
  {
    title: "BAN ĐIỀU HÀNH",
    icon: Shield,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    cardGradient: "from-red-500 to-pink-500",
    category: "Điều hành câu lạc bộ ",
    imageAlt: "Ban Điều hành FTC - Lãnh đạo câu lạc bộ",
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
    imageAlt: "Ban Học thuật FTC - Chuyên môn FinTech",
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
    imageAlt: "Ban Sự kiện FTC - Tổ chức sự kiện",
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
    imageAlt: "Ban Truyền thông FTC - Marketing và Design",
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
    imageAlt: "Ban Tài chính cá nhân FTC - Giáo dục tài chính",
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
    imageAlt: "Ban Nhân sự FTC - Quản lý nhân lực",
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

const cooperationPrinciples = [
  {
    step: "01",
    title: "Ban Học thuật",
    description: "Chuẩn bị và bàn giao nội dung học thuật phù hợp theo yêu cầu của sự kiện",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500"
  },
  {
    step: "02", 
    title: "Ban Sự kiện",
    description: "Lập kế hoạch và giải quyết các giấy tờ cần có để tổ chức sự kiện",
    icon: Calendar,
    color: "from-green-500 to-emerald-500"
  },
  {
    step: "03",
    title: "Ban Truyền thông", 
    description: "Thiết kế ấn phẩm và lên bài truyền thông về sự kiện",
    icon: Megaphone,
    color: "from-purple-500 to-violet-500"
  },
  {
    step: "04",
    title: "Ban Tài chính cá nhân",
    description: "Phụ trách mảng giáo dục tài chính cá nhân độc lập", 
    icon: Wallet,
    color: "from-amber-700 to-yellow-800"
  },
  {
    step: "05",
    title: "Ban Nhân sự",
    description: "Bảo đảm nguồn lực được phân công hiệu quả và kịp tiến độ công việc đề ra",
    icon: Users,
    color: "from-indigo-500 to-blue-500"
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

      {/* Department Photos Gallery */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">HÌNH ẢNH CÁC BAN</h2>
            <p className="text-xl text-white/80 leading-relaxed italic max-w-3xl mx-auto">
              Khám phá đội ngũ thành viên năng động và chuyên nghiệp của từng ban
            </p>
          </div>

          {/* Department Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizationData.map((dept, index) => {
              const IconComponent = dept.icon
              const deptPhotos = departmentPhotos.find(d => d.title === dept.title)
              
              return (
                <div key={dept.title} className="group relative">
                  {/* Photo Card */}
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-700 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-400/30">
                    
                    {/* Image Container */}
                    <div className="aspect-video relative overflow-hidden">
                      {/* Display first photo or placeholder */}
                      {deptPhotos && deptPhotos.photos[0] ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={deptPhotos.photos[0]} 
                            alt={dept.imageAlt || `${dept.title} - Hình ảnh nhóm`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              // Fallback to placeholder if image fails to load
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const nextElement = target.nextElementSibling as HTMLElement
                              if (nextElement) nextElement.style.display = 'flex'
                            }}
                          />
                          {/* Fallback placeholder */}
                          <div className="hidden absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 items-center justify-center">
                            <div className="text-center p-6">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                                <IconComponent className="w-8 h-8 text-white drop-shadow-lg" />
                              </div>
                              <h3 className="text-xl font-bold text-white mb-2">{dept.title}</h3>
                              <p className="text-white/60 text-sm">Hình ảnh sẽ được cập nhật sớm</p>
                            </div>
                          </div>
                          
                          {/* Image Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          
                          {/* Content Overlay */}
                          <div className="absolute inset-0 flex items-end justify-center p-6">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                                  <IconComponent className="w-6 h-6 text-white drop-shadow-lg" />
                                </div>
                              </div>
                              <h3 className="text-xl font-bold text-white drop-shadow-lg">
                                {dept.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Placeholder when no image */
                        <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
                          
                          <div className="relative z-10 text-center p-6">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl">
                              <IconComponent className="w-10 h-10 text-white drop-shadow-lg" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{dept.title}</h3>
                            <p className="text-white/60 text-sm mb-4">{dept.imageAlt}</p>
                            <div className="flex items-center justify-center gap-2 text-white/50 text-xs">
                              <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
                              <span>Hình ảnh sẽ được cập nhật sớm</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Department Badge */}
                    <div className={`absolute top-4 right-4 w-10 h-10 bg-gradient-to-r ${dept.cardGradient} rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-white text-sm font-bold">📸</span>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-xl border shadow-lg text-white bg-gradient-to-r ${dept.cardGradient}`}>
                        {dept.category}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modern Organization Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:gap-12">
            {organizationData.map((dept, idx) => {
              const IconComponent = dept.icon
              const deptPhotos = departmentPhotos.find(d => d.title === dept.title)
              
              return (
                <div key={dept.title} className="group relative">
                  {/* Modern Glassmorphism Card */}
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-400/30">
                    
                    {/* Animated Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative z-10 p-6 lg:p-8">
                      {/* Header Section */}
                      <div className="flex flex-col lg:flex-row gap-6 mb-8">
                        
                        {/* Department Info Section */}
                        <div className="lg:w-2/5">
              <div className="space-y-4">
                            {/* Category Info */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <div className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-xl border shadow-lg text-white bg-gradient-to-r ${dept.cardGradient}`}>
                                {dept.category}
            </div>
          </div>

                            {/* Title with Icon */}
              <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                                <IconComponent className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight">
                                {dept.title}
                </h2>
              </div>

                            {/* Quick Features */}
                            <div className="flex flex-wrap gap-2">
                              {dept.quickFeatures?.map((feature, index) => {
                                const IconComponent = feature.icon
                                return (
                                  <div key={index} className="flex items-center gap-2 text-xs text-white/80 bg-white/5 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/20">
                                    <IconComponent className={`w-3 h-3 ${feature.color}`} />
                                    <span>{feature.text}</span>
                                  </div>
                                )
                              })}
                    </div>
                        </div>

                        {/* Department Image Section */}
                        <div className="lg:w-3/5">
                          <div className="relative group/image">
                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
                              {deptPhotos && deptPhotos.photos[1] ? (
                                <div className="aspect-video">
                                  <img 
                                    src={deptPhotos.photos[1]} 
                                    alt={`${dept.title} - Team photo`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                      const target = e.target as HTMLImageElement
                                      target.style.display = 'none'
                                      const nextElement = target.nextElementSibling as HTMLElement
                                      if (nextElement) nextElement.style.display = 'flex'
                                    }}
                                  />
                                  {/* Fallback */}
                                  <div className="hidden aspect-video bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 items-center justify-center">
                                    <div className="text-center p-4">
                                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                                        <IconComponent className="w-8 h-8 text-white drop-shadow-lg" />
                                      </div>
                                      <p className="text-white/60 text-sm font-medium">{dept.imageAlt}</p>
                                      <p className="text-white/40 text-xs mt-1">Hình ảnh sẽ được cập nhật sớm</p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                                  <div className="text-center p-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                                      <IconComponent className="w-8 h-8 text-white drop-shadow-lg" />
                                    </div>
                                    <p className="text-white/60 text-sm font-medium">{dept.imageAlt}</p>
                                    <p className="text-white/40 text-xs mt-1">Hình ảnh sẽ được cập nhật sớm</p>
                                  </div>
                                </div>
                              )}
                              
                              {/* Overlay with department info */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500">
                                <div className="absolute bottom-4 left-4 right-4">
                                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    <span>Thành viên {dept.title}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Image Badge */}
                            <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${dept.cardGradient} rounded-full flex items-center justify-center shadow-lg border-2 border-white/20`}>
                              <span className="text-white text-xs font-bold">📸</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Section - Responsibilities */}
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                          <h3 className="text-lg font-bold text-white">Nhiệm vụ và trách nhiệm</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dept.responsibilities.map((responsibility, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-400/20 border border-blue-400/30 flex items-center justify-center mt-1 flex-shrink-0">
                                <span className="text-xs font-bold text-blue-300">{index + 1}</span>
                              </div>
                              <p className="text-white/90 leading-relaxed text-sm">
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

      {/* Modern Cooperation Principles */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Handshake className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">NGUYÊN TẮC PHỐI HỢP</h2>
            <p className="text-xl text-white/80 leading-relaxed italic max-w-3xl mx-auto">
              Quy trình phối hợp chuyên nghiệp giữa các ban để đảm bảo hiệu quả tối đa
            </p>
                </div>

          {/* Cooperation Flow */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2 opacity-30" />
            
            <div className="space-y-12 lg:space-y-16">
              {cooperationPrinciples.map((principle, index) => {
                const IconComponent = principle.icon
                const isEven = index % 2 === 0
                
                return (
                  <div key={index} className={`relative flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Step Number Circle */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-20 hidden lg:block">
                      <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                          {principle.step}
                        </span>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className={`lg:w-5/12 ${isEven ? 'lg:pr-16' : 'lg:pl-16'}`}>
                      <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:scale-105 transition-all duration-500 hover:shadow-blue-500/20">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${principle.color} flex items-center justify-center shadow-xl`}>
                            <IconComponent className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <div className="lg:hidden mb-2">
                              <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-sm font-bold text-blue-200 border border-blue-400/30">
                                Bước {principle.step}
                              </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                              {principle.title}
                            </h3>
                    </div>
                  </div>
                        <p className="text-white/80 leading-relaxed text-lg">
                          {principle.description}
                        </p>
                </div>
                    </div>

                    {/* Arrow for mobile */}
                    <div className="lg:hidden flex justify-center my-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                        <ArrowRight className="w-6 h-6 text-blue-300 rotate-90" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
                  </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Users className="w-10 h-10 text-white" />
              </div>
            <h2 className="text-4xl font-bold text-white mb-6">THAM GIA ĐỘI NGŨ FTC</h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed italic">
              Khám phá cơ hội phát triển bản thân và đóng góp cho cộng đồng FinTech
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://ftc-websites.vercel.app/ung-tuyen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-bold hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
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
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}