'use client'

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Target, Users, BookOpen, TrendingUp, Award, Network, Facebook, Instagram, Linkedin, Sparkles, ArrowRight, Eye, Heart, Lightbulb, Rocket, Globe, Trophy, Coffee, MessageCircle, Calendar } from "lucide-react"

const infoSections = [
  {
    title: "GIỚI THIỆU CHUNG",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    cardGradient: "from-blue-500 to-cyan-500",
    quickFeatures: [
      { icon: Globe, text: "Đại học Quốc gia TP.HCM", color: "text-blue-400" },
      { icon: Calendar, text: "Thành lập tháng 11/2020", color: "text-cyan-400" },
      { icon: Users, text: "Khoa Tài chính - Ngân hàng", color: "text-indigo-400" }
    ],
    content: "Câu lạc bộ Công nghệ Tài chính (FTC) trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế – Luật, ĐHQG TPHCM (UEL), được thành lập vào tháng 11 năm 2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm cùng đội ngũ sinh viên đam mê lĩnh vực công nghệ tài chính. FTC là một cộng đồng học thuật và trải nghiệm thực tiễn, nơi sinh viên có cơ hội tiếp cận kiến thức hiện đại về FinTech, dữ liệu và sản phẩm số, đồng thời rèn luyện kỹ năng thông qua các cuộc thi, workshop, talkshow và dự án thực tế. Với định hướng gắn kết học tập, nghiên cứu và phát triển nghề nghiệp, FTC không chỉ tạo môi trường nuôi dưỡng tri thức mà còn kết nối sinh viên với giảng viên, chuyên gia và doanh nghiệp, góp phần xây dựng thế hệ sinh viên UEL năng động, sáng tạo và sẵn sàng hội nhập."
  },
  {
    title: "SỨ MỆNH & GIÁ TRỊ",
    icon: Target,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    cardGradient: "from-green-500 to-emerald-500",
    quickFeatures: [
      { icon: Heart, text: "Giá trị thiết thực", color: "text-green-400" },
      { icon: Network, text: "Hệ sinh thái học thuật", color: "text-emerald-400" },
      { icon: Rocket, text: "Thống nhất, vượt trội, tiên phong", color: "text-teal-400" }
    ],
    missions: [
      {
        title: "Sứ mệnh",
        description: "Mang lại giá trị thiết thực cho sinh viên thông qua hệ sinh thái học thuật, thực hành và kết nối nghề nghiệp trong lĩnh vực công nghệ tài chính.",
        icon: Target
      },
      {
        title: "Giá trị cốt lõi",
        description: "Câu lạc bộ đề cao các giá trị cốt lõi giáo dục, kết nối, chia sẻ và hoạt động theo phương châm thống nhất, vượt trội, tiên phong.",
        icon: Award
      }
    ]
  },
  {
    title: "TẦM NHÌN & MỤC TIÊU",
    icon: Eye,
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    cardGradient: "from-purple-500 to-violet-500",
    quickFeatures: [
      { icon: Trophy, text: "Cộng đồng lớn nhất Việt Nam", color: "text-purple-400" },
      { icon: Globe, text: "Mở rộng Đông Nam Á", color: "text-violet-400" },
      { icon: Network, text: "Kết nối sinh viên - doanh nghiệp", color: "text-fuchsia-400" }
    ],
    vision: "FTC đặt mục tiêu trở thành cộng đồng sinh viên yêu thích công nghệ tài chính lớn nhất Việt Nam và mở rộng mạng lưới hợp tác giữa sinh viên và doanh nghiệp trong khu vực Đông Nam Á.",
    objectives: [
      {
        icon: BookOpen,
        text: "Cập nhật và truyền đạt kiến thức về tài chính định lượng, dữ liệu và sản phẩm số."
      },
      {
        icon: Network,
        text: "Kết nối sinh viên với giảng viên, chuyên gia, doanh nghiệp và nhà tuyển dụng."
      },
      {
        icon: Users,
        text: "Xây dựng cộng đồng học thuật cởi mở: cùng học, cùng làm, cùng chia sẻ."
      }
    ]
  },
  {
    title: "HOẠT ĐỘNG TIÊU BIỂU",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    cardGradient: "from-amber-500 to-orange-500",
    quickFeatures: [
      { icon: MessageCircle, text: "Hội thảo & Tọa đàm", color: "text-amber-400" },
      { icon: Trophy, text: "Cuộc thi học thuật", color: "text-orange-400" },
      { icon: Coffee, text: "Cộng đồng học thuật", color: "text-yellow-400" }
    ],
    activities: [
      {
        title: "Hội thảo, toạ đàm, chuyên đề",
        description: "Các chủ đề trọng tâm gồm xu hướng công nghệ tài chính, ứng dụng dữ liệu và trí tuệ nhân tạo trong hoạt động tài chính, phát triển sản phẩm ngân hàng số và các phương pháp quản trị rủi ro hiện đại.",
        icon: MessageCircle
      },
      {
        title: "Cuộc thi học thuật và dự án thực tế",
        description: "Thiết kế mô hình, phát triển công cụ phân tích và kiểm tra dựa trên dữ liệu thực tế.",
        icon: Trophy
      },
      {
        title: "Kết nối nghề nghiệp",
        description: "Kết nối và trao đổi cùng chuyên gia, người hướng dẫn giúp tiếp cận cơ hội việc làm đồng thời thăm quan doanh nghiệp để hiểu rõ môi trường làm việc thực tế.",
        icon: Network
      },
      {
        title: "Cộng đồng học thuật",
        description: "Môi trường học tập và nghiên cứu cởi mở, thân thiện, khuyến khích sáng tạo và đổi mới.",
        icon: Coffee
      }
    ]
  }
]

export default function ThongTinPage() {
  return (
    <div className="min-h-screen bg-[#003663] text-white overflow-hidden">
      <Navigation />

      {/* Modern Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl animate-float-reverse" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center space-y-4 sm:space-y-6 lg:space-y-8">
          <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold">
            <span className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-50 blur-2xl animate-pulse"></span>
            <span className="relative text-white animate-bounce" style={{
              animation: 'blink 1.5s infinite, gradient-shift 2s ease-in-out infinite, bounce 2s infinite'
            }}>
              THÔNG TIN VỀ CÂU LẠC BỘ
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto italic px-4">
            Giới thiệu tổng quan thông tin về FTC
          </p>

          {/* Social Media Badges - 3 logos centered */}
          <div className="mt-8 flex justify-center items-center gap-6">
            <a
              href="https://www.facebook.com/clbfintechuel"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <Facebook className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://www.instagram.com/ftcers/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
            >
              <Instagram className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://www.linkedin.com/company/ftc-financial-technology-club/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-700/25"
            >
              <Linkedin className="w-6 h-6 text-white" />
            </a>
          </div>

          {/* Modern Badge */}
          <div className="mt-8 relative">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-400/30 rounded-full px-6 py-3">
              <Sparkles className="w-5 h-5 text-green-400" />
              <span className="text-sm font-semibold text-green-100">Cộng đồng FinTech hàng đầu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Information Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:gap-12">
            {infoSections.map((section, idx) => {
              const IconComponent = section.icon
              
              return (
                <div key={section.title} className="group relative">
                  {/* Modern Glassmorphism Card */}
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-400/30">
                    
                    {/* Animated Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative z-10 p-6 lg:p-8">
                      {/* Header Section */}
                      <div className="flex flex-col lg:flex-row gap-6 mb-8">
                        <div className="lg:w-full">
                          <div className="space-y-4">
                            {/* Title with Icon */}
              <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                                <IconComponent className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight">
                                {section.title}
                </h2>
              </div>

                            {/* Quick Features */}
                            <div className="flex flex-wrap gap-2">
                              {section.quickFeatures?.map((feature, index) => {
                                const IconComponent = feature.icon
                                return (
                                  <div key={index} className="flex items-center gap-2 text-xs text-white/80 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                                    <IconComponent className={`w-3 h-3 ${feature.color}`} />
                                    <span>{feature.text}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
            </div>
          </div>

                      {/* Content Section */}
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                        {/* General Content */}
                        {section.content && (
                          <div className="mb-6">
                            <p className="text-white/90 leading-relaxed text-justify">
                              {section.content}
                            </p>
                    </div>
                        )}

                        {/* Missions */}
                        {section.missions && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {section.missions.map((mission, index) => {
                              const MissionIcon = mission.icon
                              return (
                                <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                                  <div className="flex items-start gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-400/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                                      <MissionIcon className="w-4 h-4 text-blue-300" />
                  </div>
                                    <h3 className="text-lg font-bold text-white">{mission.title}</h3>
                </div>
                                  <p className="text-white/80 leading-relaxed text-sm text-justify">
                                    {mission.description}
                </p>
              </div>
                              )
                            })}
            </div>
                        )}

                        {/* Vision */}
                        {section.vision && (
                          <div className="mb-6 p-6 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-xl border border-purple-400/20">
                            <div className="flex items-center gap-3 mb-4">
                              <Eye className="w-6 h-6 text-purple-400" />
                              <h3 className="text-xl font-bold text-white">Tầm nhìn</h3>
                            </div>
                            <p className="text-white/90 leading-relaxed text-justify italic">
                              {section.vision}
                            </p>
                    </div>
                        )}

                        {/* Objectives */}
                        {section.objectives && (
                          <div className="mb-6">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                              <h3 className="text-lg font-bold text-white">Mục tiêu hoạt động</h3>
                  </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {section.objectives.map((objective, index) => {
                                const ObjectiveIcon = objective.icon
                                return (
                                  <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-400/20 border border-blue-400/30 flex items-center justify-center mb-3">
                                      <ObjectiveIcon className="w-4 h-4 text-blue-300" />
                </div>
                                    <p className="text-white/80 leading-relaxed text-sm text-justify">
                                      {objective.text}
                </p>
              </div>
                                )
                              })}
            </div>
          </div>
                        )}

                        {/* Activities */}
                        {section.activities && (
                          <div>
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse" />
                              <h3 className="text-lg font-bold text-white">Các hoạt động chính</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {section.activities.map((activity, index) => {
                                const ActivityIcon = activity.icon
                                return (
                                  <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex items-start gap-3 mb-3">
                                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-orange-400/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0 mt-1">
                                        <ActivityIcon className="w-4 h-4 text-amber-300" />
                                      </div>
                                      <h4 className="text-base font-bold text-white leading-tight">{activity.title}</h4>
                  </div>
                                    <p className="text-white/80 leading-relaxed text-sm pl-11 text-justify">
                                      {activity.description}
                                    </p>
                </div>
                                )
                              })}
              </div>
                        </div>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">TÌM HIỂU VỀ THÀNH TÍCH CÂU LẠC BỘ FTC</h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed italic">
              Khám phá những thành tích mà nhà Ép đã đạt được thời gian qua
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://ftc-websites.vercel.app/thanh-tich" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-purple-600 rounded-2xl text-white font-bold hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                Thành tích của FTC
              </a>
              <a 
                href="https://www.facebook.com/clbfintechuel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-bold hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                Theo dõi Fanpage
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