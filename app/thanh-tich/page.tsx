'use client'

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Trophy, Award, Star, Target, Sparkles, Users, Heart, Lightbulb, Rocket, Globe, Medal, Crown, Zap, ArrowRight, Calendar, Activity, MessageCircle, Network, Handshake } from "lucide-react"

const achievementSections = [
  {
    title: "NIỀM TỰ HÀO CỦA TUỔI TRẺ UEL",
    icon: Crown,
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    cardGradient: "from-yellow-500 to-amber-500",
    quickFeatures: [
      { icon: Award, text: "Giấy khen ĐHQG-HCM", color: "text-yellow-400" },
      { icon: Users, text: "Công tác Đoàn", color: "text-amber-400" },
      { icon: Heart, text: "Phong trào thanh niên", color: "text-orange-400" }
    ],
    content: "Câu lạc bộ Công nghệ tài chính (FTC) luôn gắn liền hành trình phát triển của tuổi trẻ Trường Đại học Kinh tế – Luật với những trải nghiệm đáng nhớ và thành tích nổi bật. Trong năm học 2024 – 2025, FTC đã vinh dự được Ban Cán sự Đoàn Đại học Quốc gia TP.HCM trao tặng Giấy khen vì những đóng góp tích cực trong công tác Đoàn và phong trào thanh niên. FTC không chỉ tổ chức các hoạt động học thuật và ngoại khóa bổ ích mà còn tạo dựng một môi trường rèn luyện, kết nối và lan tỏa tinh thần tích cực.",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2F4540def63fb249718e9bbaf2d10ebfdc?format=webp&width=1600",
    imageAlt: "Giấy khen ĐHQG",
    imagePosition: "right"
  },
  {
    title: "DẤU ẤN TẠI GIẢI THƯỞNG I-STAR",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    cardGradient: "from-blue-500 to-cyan-500",
    quickFeatures: [
      { icon: Trophy, text: "Top 10 I-Star", color: "text-blue-400" },
      { icon: Lightbulb, text: "Đổi mới sáng tạo", color: "text-cyan-400" },
      { icon: Rocket, text: "Khởi nghiệp", color: "text-indigo-400" }
    ],
    content: "FTC vinh dự nằm trong Top 10 tổ chức, cá nhân tiêu biểu Nhóm 4 tại Giải thưởng Đổi mới sáng tạo và Khởi nghiệp TP.HCM (I-Star). Đây là giải thưởng uy tín do Ủy ban Nhân dân TP.HCM chủ trì và Sở Khoa học và Công nghệ TP.HCM tổ chức. Với định hướng \"bệ phóng cho những ý tưởng đổi mới\", FTC triển khai nhiều chương trình thiết thực như cuộc thi học thuật, đào tạo, workshop và talkshow để giúp sinh viên tiếp cận kiến thức chuyên sâu về công nghệ tài chính và khởi nghiệp sáng tạo.",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2Ff2b809cb40ef46d9867dc037c5d33b65?format=webp&width=1600",
    imageAlt: "I-Star Top10",
    imagePosition: "left"
  },
  {
    title: "GIẤY CHỨNG NHẬN I-STAR",
    icon: Medal,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    cardGradient: "from-green-500 to-emerald-500",
    quickFeatures: [
      { icon: Award, text: "Chứng nhận chính thức", color: "text-green-400" },
      { icon: Target, text: "Dự án thực tế", color: "text-emerald-400" },
      { icon: Zap, text: "Thúc đẩy sáng tạo", color: "text-teal-400" }
    ],
    content: "Giấy chứng nhận Top 10 I-Star ghi nhận thành tích và đóng góp của FTC trong hoạt động đổi mới sáng tạo và khởi nghiệp. Đây là minh chứng cho nỗ lực của câu lạc bộ trong việc thúc đẩy sáng tạo và hỗ trợ sinh viên thực hiện dự án thực tế. Thành tích này khẳng định vị thế của FTC trong cộng đồng khởi nghiệp và đổi mới sáng tạo tại TP.HCM.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F28c01978106541d5baa7b8a043c11d9b%2F7345f41f834d4a34b2ad9918af6fb722?format=webp&width=1600",
    imageAlt: "Giấy chứng nhận I-Star Top 10",
    imagePosition: "right"
  }
]

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-[#003663] text-white overflow-hidden">
      <Navigation />

      <PageHeader 
        title="THÀNH TÍCH NỔI BẬT"
        subtitle="Những thành tựu đáng tự hào của câu lạc bộ trong hành trình phát triển"
        showSocialMedia={false}
        badgeText="Thành tích xuất sắc"
        badgeIcon={Trophy}
        badgeColor="from-yellow-500/20 to-amber-500/20"
        badgeBorderColor="border-yellow-400/30"
        badgeIconColor="text-yellow-400"
        badgeTextColor="text-yellow-100"
        badgeShadowColor="shadow-yellow-500/10"
      />

      {/* Modern Achievement Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:gap-12">
            {achievementSections.map((achievement, idx) => {
              const IconComponent = achievement.icon
              const isImageLeft = achievement.imagePosition === "left"
              
              return (
                <div key={achievement.title} className="group relative">
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
                                {achievement.title}
                              </h2>
                            </div>

                            {/* Quick Features */}
                            <div className="flex flex-wrap gap-2">
                              {achievement.quickFeatures?.map((feature, index) => {
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
                      
                      {/* Content Section with Image */}
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className={`flex flex-col ${isImageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center`}>
                          {/* Text Content */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                              <h3 className="text-lg font-bold text-white">Chi tiết thành tích</h3>
                            </div>
                            <p className="text-white/90 leading-relaxed text-justify">
                              {achievement.content}
                            </p>
                          </div>

                          {/* Image */}
                          <div className="lg:w-1/2 w-full">
                            <div className="relative group">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                                <img
                                  src={achievement.image}
                                  alt={achievement.imageAlt}
                                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              </div>
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

      {/* Achievement Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">TỔNG QUAN THÀNH TÍCH</h2>
            <p className="text-xl text-white/80 italic">Những con số ấn tượng của FTC</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                number: "2+",
                title: "Giải thưởng lớn",
                description: "Giấy khen ĐHQG và Top 10 I-Star",
                color: "from-yellow-500 to-amber-500"
              },
              {
                icon: Users,
                number: "100+",
                title: "Thành viên tích cực",
                description: "Cộng đồng sinh viên năng động",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Target,
                number: "50+",
                title: "Hoạt động tổ chức",
                description: "Workshop, talkshow và cuộc thi",
                color: "from-green-500 to-emerald-500"
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="group relative">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
                    <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${stat.color} rounded-3xl flex items-center justify-center shadow-xl`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
                      {stat.number}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{stat.title}</h3>
                    <p className="text-white/80 leading-relaxed">{stat.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section - Achievement Focus */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Achievement Stats */}
          <div className="relative bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-xl rounded-3xl border border-yellow-400/30 p-12 shadow-2xl overflow-hidden mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-400"></div>
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                    <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                      THÀNH TÍCH VINH DANH
                    </span>
                  </h2>
                  <p className="text-yellow-200 text-xl sm:text-2xl italic">Những thành tựu đáng tự hào của FTC</p>
                </div>
              </div>
              
              {/* Achievement Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-2">15+</div>
                  <div className="text-yellow-200 text-sm sm:text-base">Giải thưởng</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-2">8</div>
                  <div className="text-yellow-200 text-sm sm:text-base">Cuộc thi</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-2">3</div>
                  <div className="text-yellow-200 text-sm sm:text-base">Năm liên tiếp</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-2">100%</div>
                  <div className="text-yellow-200 text-sm sm:text-base">Thành công</div>
                </div>
              </div>
              
              <p className="text-white/90 text-lg sm:text-xl leading-relaxed italic max-w-4xl mx-auto">
                Từ những ngày đầu thành lập, FTC đã không ngừng phấn đấu và đạt được những thành tích xuất sắc, 
                khẳng định vị thế là câu lạc bộ FinTech hàng đầu tại UEL
              </p>
            </div>
          </div>

          {/* Achievement Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Giải thưởng học thuật */}
            <div className="group relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-8 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-blue-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Giải thưởng học thuật</h3>
                  <p className="text-blue-200 text-sm">Cuộc thi và nghiên cứu</p>
                </div>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed text-sm italic">
                Các giải thưởng trong các cuộc thi học thuật, hackathon và nghiên cứu khoa học
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-200 text-sm">
                  <Star className="w-4 h-4" />
                  <span>Hackathon FinTech 2023 - Giải Nhất</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200 text-sm">
                  <Star className="w-4 h-4" />
                  <span>Cuộc thi nghiên cứu khoa học - Giải Nhì</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200 text-sm">
                  <Star className="w-4 h-4" />
                  <span>FinTech Innovation Challenge - Top 3</span>
                </div>
              </div>
            </div>

            {/* Thành tích cộng đồng */}
            <div className="group relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl border border-green-400/30 p-8 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-green-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Thành tích cộng đồng</h3>
                  <p className="text-green-200 text-sm">Hoạt động xã hội</p>
                </div>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed text-sm italic">
                Các hoạt động và dự án cộng đồng, đóng góp cho xã hội và phát triển bền vững
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-200 text-sm">
                  <Heart className="w-4 h-4" />
                  <span>Dự án giáo dục tài chính - 500+ học sinh</span>
                </div>
                <div className="flex items-center gap-2 text-green-200 text-sm">
                  <Heart className="w-4 h-4" />
                  <span>Chương trình mentoring - 200+ sinh viên</span>
                </div>
                <div className="flex items-center gap-2 text-green-200 text-sm">
                  <Heart className="w-4 h-4" />
                  <span>Workshop miễn phí - 50+ sự kiện</span>
                </div>
              </div>
            </div>

            {/* Đối tác và hợp tác */}
            <div className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-purple-400/30 p-8 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-purple-500/20 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Network className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Đối tác & Hợp tác</h3>
                  <p className="text-purple-200 text-sm">Mạng lưới kết nối</p>
                </div>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed text-sm italic">
                Xây dựng mạng lưới đối tác và hợp tác với các tổ chức, doanh nghiệp trong lĩnh vực FinTech
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-200 text-sm">
                  <Handshake className="w-4 h-4" />
                  <span>10+ đối tác doanh nghiệp</span>
                </div>
                <div className="flex items-center gap-2 text-purple-200 text-sm">
                  <Handshake className="w-4 h-4" />
                  <span>5+ trường đại học</span>
                </div>
                <div className="flex items-center gap-2 text-purple-200 text-sm">
                  <Handshake className="w-4 h-4" />
                  <span>3+ tổ chức quốc tế</span>
                </div>
              </div>
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