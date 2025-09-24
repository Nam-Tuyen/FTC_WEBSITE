'use client'

import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Users, BookOpen, TrendingUp, Award, Network, Facebook, Instagram } from "lucide-react"

export default function ThongTinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-hidden">
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
              THÔNG TIN VỀ CÂU LẠC BỘ
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground leading-relaxed max-w-4xl mx-auto italic px-4">
            Trường Đại học Kinh tế – Luật, ĐHQG-HCM
          </p>
          <div className="flex justify-center gap-6 pt-4">
            <a
              href="https://www.facebook.com/clbfintechuel"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-3 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10 hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <span className="text-lg font-medium text-foreground">FANPAGE FTC</span>
                <Facebook className="h-6 w-6 text-primary" />
              </div>
            </a>

            <a
              href="https://www.instagram.com/ftcers/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-3 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10 hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <span className="text-lg font-medium text-foreground">INSTAGRAM FTC</span>
                <Instagram className="h-6 w-6 text-primary" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Giới thiệu chung */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
            <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-8 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  GIỚI THIỆU CHUNG
                </h2>
              </div>
              <p className="text-lg text-muted-foreground/90 leading-relaxed text-justify">
                Câu lạc bộ Công nghệ tài chính FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, Đại học Quốc gia Thành phố Hồ Chí Minh, được thành lập vào tháng mười một năm 2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm (Giảng viên Khoa Tài chính - Ngân hàng) cùng đội ngũ sinh viên ngành công nghệ tài chính. UEL là một trong tám đơn vị thành viên của Đại học Quốc gia Thành phố Hồ Chí Minh, là trung tâm đào tạo và nghiên cứu đa ngành, đa lĩnh vực, có uy tín hàng đầu phía Nam trong các khối Kinh tế, Luật, Quản lý công.
              </p>
            </div>
          </div>

          {/* Sứ mệnh & Giá trị */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sứ mệnh */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
              <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-8 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                    <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    SỨ MỆNH
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground/90 leading-relaxed text-justify">
                  Mang lại giá trị thiết thực cho sinh viên thông qua hệ sinh thái học thuật, thực hành và kết nối nghề nghiệp trong lĩnh vực công nghệ tài chính.
                </p>
              </div>
            </div>

            {/* Giá trị */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
              <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-8 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                    <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    GIÁ TRỊ CỐT LÕI
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground/90 leading-relaxed text-justify">
                  Câu lạc bộ đề cao các giá trị cốt lõi giáo dục, kết nối, chia sẻ và hoạt động theo phương châm thống nhất, vượt trội, tiên phong.
                </p>
              </div>
            </div>
          </div>

          {/* Mục tiêu */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
            <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-8 space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  MỤC TIÊU HOẠT ĐỘNG
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: BookOpen,
                    text: "Cập nhật và truyền đạt kiến thức về tài chính định lượng, dữ liệu và sản phẩm số.",
                  },
                  {
                    icon: Network,
                    text: "Kết nối sinh viên với giảng viên, chuyên gia, doanh nghiệp và nhà tuyển dụng.",
                  },
                  {
                    icon: Users,
                    text: "Xây dựng cộng đồng học thuật cởi mở: cùng học, cùng làm, cùng chia sẻ.",
                  },
                ].map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl transform transition-all" />
                    <div className="relative p-6 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10">
                      <div className="w-12 h-12 mb-4 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                        <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <p className="text-lg text-muted-foreground/90 leading-relaxed text-justify">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tầm nhìn */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
            <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-8 space-y-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TẦM NHÌN
              </h2>
              <p className="text-lg text-muted-foreground/90 leading-relaxed text-center max-w-4xl mx-auto">
                FTC đặt mục tiêu trở thành cộng đồng sinh viên yêu thích công nghệ tài chính lớn nhất Việt Nam và mở rộng mạng lưới hợp tác giữa sinh viên và doanh nghiệp trong khu vực Đông Nam Á.
              </p>
            </div>
          </div>

          {/* Hoạt động */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
            <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-8 space-y-8">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                HOẠT ĐỘNG TIÊU BIỂU
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Hội thảo, toạ đàm, chuyên đề",
                    text: "Các chủ đề trọng tâm gồm xu hướng công nghệ tài chính, ứng dụng dữ liệu và trí tuệ nhân tạo trong hoạt động tài chính, phát triển sản phẩm ngân hàng số, diễn biến thị trường vốn và các phương pháp quản trị rủi ro hiện đại.",
                  },
                  {
                    title: "Cuộc thi học thuật và dự án thực tế",
                    text: "Thiết kế mô hình, phát triển công cụ phân tích và kiểm thử trên dữ liệu thực tế.",
                  },
                  {
                    title: "Kết nối nghề nghiệp",
                    text: "Kết nối và trao đổi cùng chuyên gia, người hướng dẫn, tiếp cận cơ hội thực tập và ngày hội việc làm, đồng thời tham quan doanh nghiệp để hiểu rõ môi trường làm việc thực tế.",
                  },
                  {
                    title: "Cộng đồng học thuật",
                    text: "Môi trường học tập và nghiên cứu cởi mở, thân thiện, khuyến khích sáng tạo và đổi mới.",
                  },
                ].map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl transform transition-all" />
                    <div className="relative p-6 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10 h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                      </div>
                      <p className="text-lg text-muted-foreground/90 leading-relaxed pl-6 text-justify">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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