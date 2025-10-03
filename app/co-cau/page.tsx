'use client'

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Shield, BookOpen, Calendar, Megaphone, Wallet, Users, Handshake, Star, TrendingUp, Target, Sparkles, Zap, ArrowRight, Search, FileText, Settings, Palette, Video, GraduationCap, DollarSign, UserCheck, Calculator, Heart } from "lucide-react"
import Image from "next/image"

const organizationData = [
  {
    title: "BAN ĐIỀU HÀNH",
    icon: Shield,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    cardGradient: "from-red-500 to-pink-500",
    category: "Điều hành câu lạc bộ",
    image: "/BAN HỌC THUẬT.JPG", // Using placeholder - add actual image later
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
    image: "/BAN HỌC THUẬT.JPG",
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
    image: "/BAN SỰ KIỆN.JPG",
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
    image: "/BAN TRUYỀN THÔNG.JPG",
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
    image: "/BAN TÀI CHÍNH CÁ NHÂN.JPG",
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
    image: "/BAN NHÂN SỰ.JPG",
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

      {/* Department Image Gallery - Mobile First */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Đội Ngũ FTC
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Gặp gỡ các ban chuyên môn và đội ngũ điều hành của câu lạc bộ
            </p>
          </div>
          
          {/* Mobile-First Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {organizationData.map((dept, idx) => {
              const IconComponent = dept.icon
              
              return (
                <div key={dept.title} className="group relative">
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                    
                    {/* Image Section */}
                    <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                      <Image
                        src={dept.image}
                        alt={`${dept.title} - ${dept.category}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={idx < 3}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Department Info Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white drop-shadow-lg">{dept.title}</h3>
                            <p className="text-xs text-white/90 drop-shadow-lg">{dept.category}</p>
                          </div>
                        </div>
                        
                        {/* Quick Features */}
                        <div className="flex flex-wrap gap-1">
                          {dept.quickFeatures?.slice(0, 2).map((feature, index) => {
                            const FeatureIcon = feature.icon
                            return (
                              <div key={index} className="flex items-center gap-1 text-xs text-white/90 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                                <FeatureIcon className={`w-3 h-3 ${feature.color}`} />
                                <span>{feature.text}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-4 lg:p-6">
                      <div className="space-y-3">
                        {/* Responsibilities Preview */}
                        <div className="space-y-2">
                          {dept.responsibilities.slice(0, 2).map((responsibility, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 border border-blue-400/30 flex items-center justify-center mt-1 flex-shrink-0">
                                <span className="text-xs font-bold text-blue-300">{index + 1}</span>
                              </div>
                              <p className="text-white/80 text-xs leading-relaxed line-clamp-2">
                                {responsibility}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        {/* View More Indicator */}
                        <div className="pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/60">
                              +{dept.responsibilities.length - 2} nhiệm vụ khác
                            </span>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 flex items-center justify-center">
                              <ArrowRight className="w-3 h-3 text-blue-300" />
                            </div>
                          </div>
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

      {/* Detailed Organization Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Chi Tiết Các Ban
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Tìm hiểu sâu hơn về vai trò và trách nhiệm của từng ban
            </p>
          </div>
          
          <div className="grid gap-8 lg:gap-12">
            {organizationData.map((dept, idx) => {
              const IconComponent = dept.icon
              
              return (
                <div key={dept.title} className="group relative">
                  {/* Modern Glassmorphism Card */}
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-400/30">
                    
                    {/* Animated Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative z-10 p-6 lg:p-8">
                      {/* Header Section with Image */}
                      <div className="flex flex-col xl:flex-row gap-6 mb-8">
                        
                        {/* Department Image Section */}
                        <div className="xl:w-2/5">
                          <div className="relative group/image">
                            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
                              <Image
                                src={dept.image}
                                alt={`${dept.title} - ${dept.category}`}
                                width={600}
                                height={400}
                                className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover/image:scale-105"
                                priority={idx < 2}
                              />
                              {/* Image Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
                              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                                    <IconComponent className="w-5 h-5 text-white drop-shadow-lg" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-bold text-white drop-shadow-lg">{dept.title}</h3>
                                    <p className="text-sm text-white/90 drop-shadow-lg">{dept.category}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Department Info Section */}
                        <div className="xl:w-3/5">
                          <div className="space-y-6">
                            {/* Category Badge */}
                            <div className="flex flex-wrap items-center gap-3">
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
                                const FeatureIcon = feature.icon
                                return (
                                  <div key={index} className="flex items-center gap-2 text-xs text-white/80 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300">
                                    <FeatureIcon className={`w-3 h-3 ${feature.color}`} />
                                    <span>{feature.text}</span>
                                  </div>
                                )
                              })}
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}