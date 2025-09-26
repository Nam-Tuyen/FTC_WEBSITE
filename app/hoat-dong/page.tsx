'use client'

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, BookOpen, TrendingUp, Award, Network, Facebook, Instagram, Calendar, MapPin, Clock, Star, ArrowRight, Sparkles } from "lucide-react"

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
    participants: "1000+ sinh viên",
    icon: Award,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20"
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
    borderColor: "border-blue-500/20"
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
    borderColor: "border-green-500/20"
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
    borderColor: "border-purple-500/20"
  },
  {
    title: "CAREER DAY",
    body:
      "Chuỗi sự kiện Web3 Career Innovation gồm ba hoạt động chính: talkshow, doanh nghiệp đặt booth và phỏng vấn trực tiếp. Chương trình hướng đến việc giúp sinh viên tiếp cận công nghệ Blockchain & Web3, thay đổi góc nhìn tiêu cực về Crypto và mở ra cơ hội nghề nghiệp sáng tạo trong lĩnh vực công nghệ - tài chính.",
    img: IMAGES.career,
    alt: "Career Day Web3 Career Innovation",
    category: "Nghề nghiệp",
    duration: "1 ngày",
    participants: "150+ sinh viên",
    icon: TrendingUp,
    color: "from-orange-500 to-yellow-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20"
  },
  {
    title: "WORKSHOP CHUYÊN SÂU",
    body:
      "FTC phối hợp cùng các đối tác để tổ chức các buổi workshop và tập huấn. Đây là dịp để sinh viên vừa nâng cao kiến thức chuyên môn, vừa rèn kỹ năng quản lý - tổ chức sự kiện.",
    img: IMAGES.workshop,
    alt: "Workshop chuyên sâu của FTC",
    category: "Đào tạo",
    duration: "3-4 giờ",
    participants: "40+ sinh viên",
    icon: Users,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20"
  },
  {
    title: "FTC TRIP",
    body:
      "Bên cạnh các hoạt động học thuật, FTC còn tổ chức các chuyến đi gắn kết cộng đồng. FTC Trip là hoạt động thường niên được mong chờ nhất, nơi các thành viên và cựu thành viên cùng nhau tham gia những chuyến đi 'chữa lành', xả stress và tạo kỷ niệm đáng nhớ. Ngoài ra, còn có nhiều mini trip định kỳ hàng tháng hoặc hàng quý giúp các thành viên kết nối chặt chẽ hơn.",
    img: IMAGES.trip,
    alt: "FTC Trip gắn kết cộng đồng",
    category: "Gắn kết",
    duration: "2-3 ngày",
    participants: "60+ thành viên",
    icon: Network,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20"
  },
]

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <Navigation />

      {/* Modern Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Modern Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-blue-400/30 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-blue-100">Hoạt động nổi bật</span>
          </div>

          {/* Modern Title with Animation */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            HOẠT ĐỘNG CỦA FTC
          </h1>

          {/* Modern Description */}
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
            Khám phá những sự kiện đặc sắc và hoạt động thú vị của câu lạc bộ
          </p>
        </div>
      </section>

      {/* Modern Activities Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:gap-12">
            {activities.map((activity, idx) => {
              const IconComponent = activity.icon
              
              return (
                <div key={activity.title} className="group relative">
                  {/* Modern Card */}
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-0 overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                    
                    <div className="relative z-10">
                      {/* Modern Grid Layout */}
                      <div className="p-6 lg:p-8">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row gap-6 mb-8">
                          {/* Image Section */}
                          {activity.img && (
                            <div className="lg:w-1/3">
                              <div className="relative h-[200px] lg:h-[250px] overflow-hidden rounded-2xl">
                                <img
                                  src={activity.img}
                                  alt={activity.alt}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                              </div>
                            </div>
                          )}
                          
                          {/* Title and Info Section */}
                          <div className="lg:w-2/3 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-4">
                              <div className={`p-4 rounded-2xl ${activity.bgColor} border ${activity.borderColor} backdrop-blur-sm flex-shrink-0`}>
                                <IconComponent className={`w-8 h-8 bg-gradient-to-r ${activity.color} bg-clip-text text-transparent`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                  <span className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${activity.color} bg-clip-text text-transparent border border-white/30 backdrop-blur-sm`}>
                                    {activity.category}
                                  </span>
                                  <div className="flex items-center gap-2 text-slate-300 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">{activity.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-300 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm font-medium">{activity.participants}</span>
                                  </div>
                                </div>
                                
                                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                                  {activity.title}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Main Content */}
                          <div className="lg:col-span-2">
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                                <span className="text-sm font-semibold text-blue-300">Mô tả hoạt động</span>
                              </div>
                              <p className="text-slate-300 leading-relaxed text-lg font-light">
                                {activity.body}
                              </p>
                            </div>
                          </div>
                          
                          {/* Info Sidebar */}
                          <div className="space-y-4">
                            {/* Status Card */}
                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-4 border border-green-400/20">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-sm font-semibold text-green-300">Đang diễn ra</span>
                              </div>
                              <p className="text-xs text-green-200 mt-2">Hoạt động thường niên</p>
                            </div>
                            
                            {/* Features Card */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                              <div className="flex items-center gap-3 mb-3">
                                <Star className="w-5 h-5 text-yellow-400" />
                                <span className="text-sm font-semibold text-yellow-300">Đặc điểm nổi bật</span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-slate-300">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                  <span className="text-xs">Học thuật chuyên sâu</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                  <span className="text-xs">Thực hành thực tế</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                                  <span className="text-xs">Kết nối cộng đồng</span>
                                </div>
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

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 20px) rotate(5deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(-5deg); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 20s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
