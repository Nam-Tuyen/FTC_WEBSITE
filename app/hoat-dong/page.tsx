'use client'

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, BookOpen, TrendingUp, Award, Network, Facebook, Instagram, Calendar, MapPin, Clock, Star, ArrowRight, Sparkles, Zap, Eye, Heart } from "lucide-react"

const IMAGES = {
  attacker:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2F0e6acd0c2f93488b84a94aad542df58f?format=webp&width=800",
  talkshow:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2F103c7d4023d24b4ebd5c0ec4044c1575?format=webp&width=800",
  company:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2Ffa6a124528964743a92c39b17982f140?format=webp&width=800",
  training:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2Fcd52833fa8d84f4f80071cc3932cb03d?format=webp&width=800",
  workshop:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2F6e7ddea0b8b8423ba4da6f1fb2d9a04f?format=webp&width=800",
  trip:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2F731ef307e97742e3acbaac1f0825407c?format=webp&width=800",
  career:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2Fded3c9a981234736972e8d736567ed0a?format=webp&width=800",
}

const activities = [
  {
    title: "CUỘC THI ATTACKER",
    body:
      "ATTACKER là cuộc thi học thuật thường niên do FTC tổ chức, thu hút đông đảo sinh viên yêu thích và đam mê công nghệ tài chính. Mỗi mùa thi mang đến một chủ đề mới gắn liền với các xu hướng công nghệ hiện đại, giúp thí sinh rèn luyện tư duy sáng tạo, trải nghiệm thực tế và chinh phục những giải thưởng giá trị. Năm 2025, ATTACKER đã bước vào vòng 3 và đang diễn ra vô cùng kịch tính.",
    img: IMAGES.attacker,
    alt: "Cuộc thi ATTACKER của FTC",
    category: "Học thuật",
    duration: "3 tháng",
    participants: "1500+ sinh viên",
    icon: Award,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    status: "Đang diễn ra",
    statusColor: "bg-red-500/20 text-red-300 border-red-400/30",
    highlights: [
      "Sân chơi năng động",
      "Kiến thức FinTech chuyên sâu",
      "Cơ hội nghề nghiệp hấp dẫn"
    ]
  },
  {
    title: "TALKSHOW CHUYÊN ĐỀ",
    body:
      "Hằng năm, FTC tổ chức nhiều buổi Talkshow xoay quanh các chủ đề FinTech và công nghệ số. Đây là cơ hội để sinh viên giao lưu, lắng nghe chia sẻ từ các chuyên gia đầu ngành và đặt câu hỏi trực tiếp. Một số chương trình tiêu biểu có thể kể đến như: \"Blockchain & AI: Con đường sự nghiệp trong kỷ nguyên số hóa\", \"Chứng khoán thời công nghệ – Tư duy tiếp cận phù hợp\".",
    img: IMAGES.talkshow,
    alt: "Talkshow chuyên đề FinTech",
    category: "Học thuật",
    duration: "2-3 giờ",
    participants: "100+ sinh viên",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    status: "Thường niên",
    statusColor: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    highlights: [
      "Chuyên gia hàng đầu",
      "Xu hướng công nghệ mới",
      "Kết nối mạng lưới"
    ]
  },
  {
    title: "THAM QUAN DOANH NGHIỆP",
    body:
      "FTC hợp tác cùng nhiều doanh nghiệp để tổ chức chương trình tham quan thực tế. Tiêu biểu là chuyến tham quan VNG, nơi các thành viên có cơ hội trải nghiệm môi trường làm việc, tìm hiểu hoạt động công ty và khám phá tiềm năng nghề nghiệp trong lĩnh vực công nghệ tài chính.",
    img: IMAGES.company,
    alt: "Chương trình tham quan doanh nghiệp",
    category: "Trải nghiệm",
    duration: "1 ngày",
    participants: "30-50 sinh viên",
    icon: MapPin,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    status: "Sắp diễn ra",
    statusColor: "bg-green-500/20 text-green-300 border-green-400/30",
    highlights: [
      "Trải nghiệm thực tế",
      "Môi trường làm việc chuyên nghiệp",
      "Cơ hội nghề nghiệp"
    ]
  },
  {
    title: "FTC TRAINING & SHARING",
    body:
      "Là một câu lạc bộ học thuật, FTC đặc biệt chú trọng hoạt động training nội bộ và chia sẻ kiến thức. Thành viên sẽ được trang bị kiến thức FinTech từ cơ bản đến nâng cao, rèn luyện kỹ năng nghề nghiệp và giải đáp thắc mắc về cơ hội việc làm trong ngành. Ngoài ra, fanpage FTC cũng thường xuyên đăng tải các bài viết hữu ích phục vụ cộng đồng sinh viên.",
    img: IMAGES.training,
    alt: "FTC Training & Sharing",
    category: "Đào tạo",
    duration: "2-4 giờ",
    participants: "50+ thành viên",
    icon: Target,
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    status: "Hằng tuần",
    statusColor: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    highlights: [
      "Kiến thức từ cơ bản đến nâng cao",
      "Kỹ năng nghề nghiệp thực tế",
      "Cộng đồng học tập"
    ]
  },
  {
    title: "CAREER DAY",
    body:
      "Chuỗi sự kiện Web3 Career Innovation gồm ba hoạt động chính: Talkshow, doanh nghiệp đặt booth và phỏng vấn trực tiếp. Chương trình hướng đến việc giúp sinh viên tiếp cận công nghệ Blockchain & Web3, thay đổi góc nhìn tiêu cực về Crypto và mở ra cơ hội nghề nghiệp sáng tạo trong lĩnh vực công nghệ - tài chính.",
    img: IMAGES.career,
    alt: "Career Day Web3 Career Innovation",
    category: "Nghề nghiệp",
    duration: "1 ngày",
    participants: "3000+ sinh viên",
    icon: TrendingUp,
    color: "from-orange-500 to-yellow-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    status: "Thành công",
    statusColor: "bg-orange-500/20 text-orange-300 border-orange-400/30",
    highlights: [
      "Web3 & Blockchain",
      "Phỏng vấn trực tiếp",
      "Cơ hội nghề nghiệp sáng tạo"
    ]
  },
  {
    title: "WORKSHOP CHUYÊN SÂU",
    body:
      "FTC phối hợp cùng các đối tác để tổ chức các buổi workshop và tập huấn. Đây là dịp để sinh viên vừa nâng cao kiến thức chuyên môn, vừa rèn kỹ năng quản lý - tổ chức sự kiện.",
    img: IMAGES.workshop,
    alt: "Workshop chuyên sâu của FTC",
    category: "Đào tạo",
    duration: "3-4 giờ",
    participants: "100+ sinh viên",
    icon: Users,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    status: "Hằng tháng",
    statusColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
    highlights: [
      "Kiến thức chuyên môn",
      "Kỹ năng quản lý sự kiện",
      "Đối tác uy tín"
    ]
  },
  {
    title: "FTC TRIP",
    body:
      "Bên cạnh các hoạt động học thuật, FTC còn tổ chức các chuyến đi gắn kết cộng đồng. FTC Trip là hoạt động thường niên được mong chờ nhất, nơi các thành viên và cựu thành viên cùng nhau tham gia những chuyến đi 'chữa lành', xả stress và tạo kỷ niệm đáng nhớ. Ngoài ra, còn có nhiều mini trip định kỳ hàng tháng hoặc hàng quý giúp các thành viên kết nối chặt chẽ hơn.",
    img: IMAGES.trip,
    alt: "FTC Trip gắn kết cộng đồng",
    category: "Gắn kết",
    duration: "2-3 ngày",
    participants: "30+ thành viên",
    icon: Network,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    status: "Sắp tới",
    statusColor: "bg-pink-500/20 text-pink-300 border-pink-400/30",
    highlights: [
      "Gắn kết cộng đồng",
      "Kỷ niệm đáng nhớ",
      "Thư giãn và giải tỏa stress"
    ]
  },
]

// Category color mapping
const categoryColors = {
  "Học thuật": {
    gradient: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-400/30",
    icon: "text-blue-400",
    dots: ["bg-blue-400", "bg-cyan-400", "bg-indigo-400"]
  },
  "Trải nghiệm": {
    gradient: "from-green-500/10 to-emerald-500/10",
    border: "border-green-400/30",
    icon: "text-green-400",
    dots: ["bg-green-400", "bg-emerald-400", "bg-teal-400"]
  },
  "Đào tạo": {
    gradient: "from-purple-500/10 to-violet-500/10",
    border: "border-purple-400/30",
    icon: "text-purple-400",
    dots: ["bg-purple-400", "bg-violet-400", "bg-fuchsia-400"]
  },
  "Nghề nghiệp": {
    gradient: "from-orange-500/10 to-yellow-500/10",
    border: "border-orange-400/30",
    icon: "text-orange-400",
    dots: ["bg-orange-400", "bg-yellow-400", "bg-amber-400"]
  },
  "Gắn kết": {
    gradient: "from-pink-500/10 to-rose-500/10",
    border: "border-pink-400/30",
    icon: "text-pink-400",
    dots: ["bg-pink-400", "bg-rose-400", "bg-red-400"]
  }
}

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-[#003663] text-white overflow-hidden">
      <Navigation />

      {/* Mobile Responsive Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl animate-float-reverse" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center space-y-4 sm:space-y-6 lg:space-y-8">
          <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold">
            <span className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-50 blur-2xl animate-pulse"></span>
            <span className="relative text-white animate-bounce" style={{
              animation: 'blink 1.5s infinite, gradient-shift 2s ease-in-out infinite, bounce 2s infinite'
            }}>
              HOẠT ĐỘNG CỦA FTC
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto italic px-4">
            Khám phá những sự kiện đặc sắc và hoạt động thú vị của câu lạc bộ
          </p>

          {/* Modern Badge */}
          <div className="mt-8 relative">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-blue-400/30 rounded-full px-6 py-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-blue-100">Hoạt động nổi bật</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Activities Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:gap-12">
            {activities.map((activity, idx) => {
              const IconComponent = activity.icon
              
              return (
                <div key={activity.title} className="group relative">
                  {/* Modern Glassmorphism Card */}
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-400/30">
                    
                    {/* Animated Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative z-10 p-6 lg:p-8">
                      {/* Header Section - Redesigned Layout */}
                      <div className="flex flex-col lg:flex-row gap-6 mb-8">
                        
                        {/* Enhanced Image Section */}
                        {activity.img && (
                          <div className="lg:w-2/5">
                            <div className="relative h-[280px] lg:h-[320px] overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-700">
                              <img
                                src={activity.img}
                                alt={activity.alt}
                                loading="lazy"
                                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${activity.title === "TALKSHOW CHUYÊN ĐỀ" ? "rotate-180" : ""}`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced Info Section */}
                        <div className="lg:w-3/5 flex flex-col justify-center space-y-4">
                          {/* Category and Meta Info */}
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-xl border shadow-lg text-white ${
                            activity.category === "Học thuật" ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                            activity.category === "Trải nghiệm" ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                            activity.category === "Đào tạo" ? "bg-gradient-to-r from-purple-500 to-violet-500" :
                            activity.category === "Nghề nghiệp" ? "bg-gradient-to-r from-orange-500 to-yellow-500" :
                            activity.category === "Gắn kết" ? "bg-gradient-to-r from-pink-500 to-rose-500" :
                            "bg-gradient-to-r from-blue-500 to-purple-600"
                          }`}>
                            {activity.category}
                          </div>
                            <div className="flex items-center gap-2 text-white/80 bg-white/10 backdrop-blur-xl px-3 py-2 rounded-full border border-white/20 shadow-lg">
                              <Clock className="w-4 h-4" />
                              <span className="text-xs font-medium">{activity.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80 bg-white/10 backdrop-blur-xl px-3 py-2 rounded-full border border-white/20 shadow-lg">
                              <Users className="w-4 h-4" />
                              <span className="text-xs font-medium">{activity.participants}</span>
                            </div>
                          </div>
                          
                          {/* Modern Compact Title with Icon */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-lg">
                              <IconComponent className="w-4 h-4 text-white drop-shadow-lg" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight">
                              {activity.title}
                            </h2>
                          </div>
                          
                          {/* Quick Features */}
                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-2 text-xs text-white/80 bg-white/5 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/20">
                              <Star className="w-3 h-3 text-blue-400" />
                              <span>Chuyên môn</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/80 bg-white/5 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/20">
                              <Users className="w-3 h-3 text-purple-400" />
                              <span>Cộng đồng</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/80 bg-white/5 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/20">
                              <TrendingUp className="w-3 h-3 text-green-400" />
                              <span>Phát triển</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Content Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Main Description - Larger Column */}
                        <div className="lg:col-span-3">
                          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                              <h3 className="text-lg font-bold text-white">Mô tả chi tiết</h3>
                            </div>
                            <p className="text-white/90 leading-relaxed text-base font-light text-justify">
                              {activity.body}
                            </p>
                          </div>
                        </div>
                        
                        {/* Enhanced Sidebar */}
                        <div className="space-y-4">
                          {/* Highlights Card */}
                          <div className={`bg-gradient-to-br ${categoryColors[activity.category as keyof typeof categoryColors]?.gradient || 'from-blue-500/10 to-purple-500/10'} backdrop-blur-xl rounded-2xl p-6 border ${categoryColors[activity.category as keyof typeof categoryColors]?.border || 'border-blue-400/30'} shadow-xl h-full`}>
                            <div className="flex items-center gap-2 mb-4">
                              <Star className={`w-5 h-5 ${categoryColors[activity.category as keyof typeof categoryColors]?.icon || 'text-blue-400'}`} />
                              <span className={`text-sm font-bold ${categoryColors[activity.category as keyof typeof categoryColors]?.icon || 'text-blue-300'}`}>Điểm nổi bật</span>
                            </div>
                            <div className="space-y-3">
                              {activity.highlights?.map((highlight, index) => {
                                const colors = categoryColors[activity.category as keyof typeof categoryColors]?.dots || ['bg-blue-400', 'bg-purple-400', 'bg-green-400'];
                                return (
                                  <div key={index} className="flex items-center gap-2 text-white/90">
                                    <div className={`w-1.5 h-1.5 ${colors[index % colors.length]} rounded-full animate-pulse`} />
                                    <span className="text-xs">{highlight}</span>
                                  </div>
                                );
                              })}
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

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">THAM GIA CÙNG FTC</h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed italic">
              Đăng ký để không bỏ lỡ các hoạt động thú vị và cơ hội học hỏi quý báu
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://www.facebook.com/clbfintechuel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-bold hover:shadow-xl hover:scale-105 transition-all"
              >
                Theo dõi Fanpage
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg text-white/70 italic">
            ©2025. Câu lạc bộ Công nghệ Tài chính
          </p>
        </div>
      </footer>

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
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 20s ease-in-out infinite;
        }
        .animate-float-particle {
          animation: float-particle 3s ease-in-out infinite;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  )
}