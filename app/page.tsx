"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/Input"
import { 
  ArrowRight, 
  Users, 
  Database, 
  Zap, 
  Brain, 
  Rocket, 
  Globe, 
  Star, 
  TrendingUp, 
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Linkedin
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState({ members: 0, projects: 0, partners: 0, events: 0 })

  useEffect(() => {
    setIsVisible(true)
    
    // Animate counters
    const animateCounter = (key: keyof typeof counters, target: number) => {
      let current = 0
      const increment = target / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setCounters((prev: any) => ({ ...prev, [key]: Math.floor(current) }))
      }, 30)
    }

    setTimeout(() => {
      animateCounter('members', 100)
      animateCounter('projects', 10)
      animateCounter('partners', 50)
      animateCounter('events', 100)
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      {/* Hero Section - Modern with Video Background Effect */}
      <section className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 overflow-hidden">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0">
          {/* Gradient Mesh Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,191,255,0.3) 1px, transparent 0)`,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
          </div>
          
          {/* Floating Geometric Shapes - Responsive */}
          <div className="absolute top-20 left-4 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 bg-accent/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-4 sm:right-20 w-12 h-12 sm:w-24 sm:h-24 bg-secondary/20 rounded-full blur-xl animate-float delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 sm:w-40 sm:h-40 bg-accent/15 rounded-full blur-xl animate-float delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-14 h-14 sm:w-28 sm:h-28 bg-secondary/15 rounded-full blur-xl animate-float delay-3000"></div>
          
          {/* Rotating Rings - Responsive */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] border border-accent/10 rounded-full animate-spin" style={{ animationDuration: "30s" }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] border border-accent/20 rounded-full animate-spin" style={{ animationDuration: "20s", animationDirection: "reverse" }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] lg:w-[200px] lg:h-[200px] border border-accent/30 rounded-full animate-spin" style={{ animationDuration: "10s" }}></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge - Responsive */}
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-accent/20 to-secondary/20 border border-accent/40 mb-6 sm:mb-8 glow hover:scale-105 transition-transform duration-300">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-accent mr-2 sm:mr-3 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider">TƯƠNG LAI CỦA FINTECH</span>
            </div>

            {/* Main Heading - Responsive */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground mb-6 sm:mb-8 text-balance text-glow leading-tight">
              <span className="block">CÂU LẠC BỘ</span>
              <span className="block bg-gradient-to-r from-accent via-white to-secondary bg-clip-text text-transparent animate-gradient-x">
                CÔNG NGHỆ TÀI CHÍNH
              </span>
            </h1>
            
            {/* Subtitle - Responsive */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/90 mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto text-pretty font-medium leading-relaxed italic px-4">
              Nơi kết nối những người đam mê công nghệ tài chính, học hỏi kiến thức mới và phát triển sự nghiệp trong lĩnh vực Fintech
            </p>
            
            {/* CTA Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              <Button
                asChild
                size="lg"
                className="btn-futuristic text-lg sm:text-xl px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 font-bold shadow-2xl hover:shadow-accent/50 transition-all duration-300 group w-full sm:w-auto"
              >
                <Link href="/thong-tin" className="flex items-center justify-center">
                  KHÁM PHÁ NGAY <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stats Section - Enhanced with Animated Counters */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-card/5 via-card/10 to-card/5 backdrop-blur-sm"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-accent/10 border border-accent/30 mb-4 sm:mb-6">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent mr-2" />
              <span className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider">Thành tựu nổi bật</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4 text-glow">
              SỐ LIỆU ẤN TƯỢNG
            </h2>
            <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto font-medium italic px-4">
              Những con số biết nói về sự phát triển và tác động của câu lạc bộ
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { key: 'members', number: counters.members, suffix: '+', label: "THÀNH VIÊN", icon: Users, color: "from-accent to-cyan-400" },
              { key: 'projects', number: counters.projects, suffix: '+', label: "DỰ ÁN", icon: Rocket, color: "from-secondary to-purple-400" },
              { key: 'partners', number: counters.partners, suffix: '+', label: "ĐỐI TÁC", icon: Globe, color: "from-accent to-blue-400" },
              { key: 'events', number: counters.events, suffix: '+', label: "SỰ KIỆN", icon: Zap, color: "from-secondary to-pink-400" },
            ].map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center group relative">
                  <div className="relative mb-6">
                    <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center glow group-hover:scale-110 transition-all duration-500 shadow-2xl`}>
                      <IconComponent className="h-12 w-12 text-white" />
                    </div>
                    <div className={`absolute inset-0 w-24 h-24 mx-auto border-2 border-gradient-to-r ${stat.color} rounded-3xl animate-pulse`}></div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-ping"></div>
                  </div>
                  <div className="text-5xl font-black text-accent mb-3 text-glow group-hover:scale-110 transition-transform duration-300">
                    {stat.number}{stat.suffix}
                  </div>
                  <div className="text-sm font-bold text-foreground/80 uppercase tracking-widest group-hover:text-accent transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced with Modern Cards */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-accent/10 border border-accent/30 mb-4 sm:mb-6">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-accent mr-2" />
              <span className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider">Lợi ích khi tham gia</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground mb-4 sm:mb-6 text-glow leading-tight">
              TẠI SAO CHỌN<br />
              <span className="bg-gradient-to-r from-accent via-white to-secondary bg-clip-text text-transparent">
                CÂU LẠC BỘ FINTECH?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-foreground/70 max-w-4xl mx-auto font-medium leading-relaxed italic px-4">
              Câu lạc bộ mang đến môi trường gần gũi, đầy đủ công cụ hữu ích và nhiều cơ hội mới để bạn học hỏi, trải nghiệm và phát triển.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                icon: Brain,
                title: "HỌC & HƯỚNG DẪN",
                description: "Chuỗi hội thảo, chuyên đề, lớp bồi dưỡng về công nghệ tài chính, trí tuệ nhân tạo trong tài chính, giao dịch theo thuật toán, chuỗi khối, tài chính cá nhân.",
                gradient: "from-accent/30 to-cyan-400/30",
                iconColor: "from-accent to-cyan-400",
                features: ["AI & Machine Learning", "Blockchain Technology", "Algorithmic Trading", "Personal Finance"]
              },
              {
                icon: Database,
                title: "DỰ ÁN THỰC TẾ",
                description: "Thực hành trên dữ liệu và thị trường thực tế, rèn kỷ luật quản trị rủi ro, tư duy sản phẩm và cải tiến mô hình.",
                gradient: "from-secondary/30 to-purple-400/30",
                iconColor: "from-secondary to-purple-400",
                features: ["Real Market Data", "Risk Management", "Product Thinking", "Model Improvement"]
              },
              {
                icon: Rocket,
                title: "NGHỀ NGHIỆP & HỒ SƠ",
                description: "Tham quan doanh nghiệp, ngày hội việc làm, thực tập và xây dựng hồ sơ học thuật. Giúp tăng năng lực ứng tuyển và kết nối với đơn vị tuyển dụng.",
                gradient: "from-accent/30 to-blue-400/30",
                iconColor: "from-accent to-blue-400",
                features: ["Company Visits", "Job Fairs", "Internships", "Academic Portfolio"]
              },
              {
                icon: Users,
                title: "KỸ NĂNG & CỘNG ĐỒNG",
                description: "Phát triển giao tiếp, làm việc nhóm, quản lý dự án, sáng tạo nội dung và truyền thông. Môi trường cởi mở, gắn kết, chia sẻ và hỗ trợ lẫn nhau.",
                gradient: "from-secondary/30 to-pink-400/30",
                iconColor: "from-secondary to-pink-400",
                features: ["Communication", "Teamwork", "Project Management", "Content Creation"]
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="relative group bg-card/10 backdrop-blur-sm border-accent/20 hover:border-accent/50 transition-all duration-700 hover:glow overflow-hidden h-full"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                  <CardContent className="relative z-10 p-8 h-full flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${feature.iconColor} rounded-2xl flex items-center justify-center glow group-hover:scale-110 transition-all duration-500 shadow-xl`}>
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-accent/30 rounded-2xl animate-pulse"></div>
                    </div>
                    
                    <h3 className="font-heading font-bold text-lg mb-4 text-foreground uppercase tracking-wide group-hover:text-accent transition-colors duration-300 text-center">
                      {feature.title}
                    </h3>
                    
                    <p className="text-foreground/70 font-medium leading-relaxed mb-6 flex-grow text-sm text-justify px-4">
                      {feature.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center text-xs text-foreground/60 group-hover:text-accent/80 transition-colors duration-300 bg-card/20 rounded-lg p-2 border border-accent/10">
                          <CheckCircle className="h-3 w-3 mr-2 text-accent flex-shrink-0" />
                          <span className="text-center flex-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-card/5 via-card/10 to-card/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-accent/10 border border-accent/30 mb-4 sm:mb-6">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-accent mr-2" />
              <span className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider">Cảm nhận từ thành viên</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4 text-glow">
              THÀNH VIÊN NÓI GÌ VỀ FTC?
            </h2>
            <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto font-medium italic px-4">
              Những chia sẻ chân thực từ các thành viên đã và đang tham gia câu lạc bộ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                name: "Nguyễn Văn A",
                role: "Sinh viên năm 3 - Khoa Công nghệ thông tin",
                content: "FTC đã giúp tôi hiểu sâu hơn về fintech và có cơ hội thực hành với dữ liệu thực tế. Cộng đồng rất hỗ trợ và nhiệt tình!",
                rating: 5
              },
              {
                name: "Trần Thị B",
                role: "Sinh viên năm 2 - Khoa Tài chính",
                content: "Tham gia FTC, tôi đã học được nhiều kỹ năng mới về blockchain và AI trong tài chính. Các workshop rất bổ ích!",
                rating: 5
              },
              {
                name: "Lê Văn C",
                role: "Cựu sinh viên - Software Engineer",
                content: "FTC đã mở ra cho tôi nhiều cơ hội nghề nghiệp trong lĩnh vực fintech. Tôi rất biết ơn câu lạc bộ!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="relative group bg-card/20 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-500 hover:glow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-accent fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground/80 font-medium leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t border-accent/20 pt-4">
                    <div className="font-bold text-foreground text-lg">{testimonial.name}</div>
                    <div className="text-foreground/60 text-sm">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section - Enhanced */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-accent/20 via-transparent to-secondary/20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] md:w-[900px] md:h-[900px] lg:w-[1000px] lg:h-[1000px] border border-accent/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[700px] md:h-[700px] lg:w-[800px] lg:h-[800px] border border-accent/5 rounded-full animate-pulse delay-1000"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full bg-accent/20 border border-accent/40 mb-6 sm:mb-8 glow hover:scale-105 transition-transform duration-300">
            <Rocket className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-accent mr-2 sm:mr-3" />
            <span className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider">Tham gia câu lạc bộ</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 sm:mb-6 text-glow leading-tight">
            THAM GIA ĐỂ TRỞ THÀNH<br />
            <span className="bg-gradient-to-r from-accent via-white to-secondary bg-clip-text text-transparent">
              FTCer NGAY HÔM NAY
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-foreground/80 mb-8 sm:mb-10 md:mb-12 font-medium leading-relaxed max-w-3xl mx-auto italic px-4">
            Đăng ký ngay hôm nay để cùng FTC khám phá bản thân, học điều mới, tham gia hoạt động thực tế và kết nối với cộng đồng FINTECH
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <Button
              asChild
              size="lg"
              className="btn-futuristic text-lg sm:text-xl px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 font-bold shadow-2xl hover:shadow-accent/50 transition-all duration-300 group w-full sm:w-auto"
            >
              <Link href="/ung-tuyen" className="flex items-center justify-center">
                BẮT ĐẦU NGAY HÔM NAY <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg sm:text-xl px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 font-bold border-2 border-accent/50 text-accent hover:bg-accent/10 transition-all duration-300 group w-full sm:w-auto"
            >
              <Link href="/dien-dan" className="flex items-center justify-center">
                <Users className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
                THAM GIA DIỄN ĐÀN
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}


