'use client'

import { Navigation } from "@/components/navigation"
import { Shield, BookOpen, Calendar, Megaphone, Wallet, Users, Handshake } from "lucide-react"

export default function CoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl animate-float-reverse" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold">
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-50 blur-2xl animate-pulse"></span>
            <span className="relative bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text animate-text-shine">
              CƠ CẤU TỔ CHỨC
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto italic">
            Thành phần và vai trò của các ban trong câu lạc bộ 
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Ban Điều Hành */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
            <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-8 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  BAN ĐIỀU HÀNH
                </h2>
              </div>
              
              <div className="space-y-4">
                <ul className="list-disc pl-5 space-y-2.5 text-lg text-muted-foreground/90">
                  <li>Định hướng phát triển và đưa ra chiến lược dài hạn</li>
                  <li>Điều phối và giám sát hoạt động của các ban, bảo đảm vận hành hiệu quả</li>
                  <li>Phê duyệt kế hoạch, ngân sách và nhân sự</li>
                  <li>Đại diện câu lạc bộ làm việc với các doanh nghiệp và đối tác</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Các Ban Chuyên Môn */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
            <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-8 space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  CÁC BAN CHUYÊN MÔN
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Ban Học thuật */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl transform transition-all" />
                  <div className="relative p-6 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold text-foreground">Ban Học thuật</h3>
                    </div>
                    <div className="space-y-4">
                      <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                        <li>Phụ trách nội dung chuyên môn cho các buổi workshop, talkshow</li>
                        <li>Chuẩn bị câu hỏi cho các buổi tọa đàm và chuyên đề, xây dựng ngân hàng câu hỏi</li>
                        <li>Ra đề và đánh giá đề cho cuộc thi ATTACKER</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ban Sự kiện */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl transform transition-all" />
                  <div className="relative p-6 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold text-foreground">Ban Sự kiện</h3>
                    </div>
                    <div className="space-y-4">
                      <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                        <li>Viết kế hoạch, báo cáo và các giấy tờ liên quan tới câu lạc bộ</li>
                        <li>Xây dựng kịch bản MC và timeline cho sự kiện</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ban Truyền thông */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl transform transition-all" />
                  <div className="relative p-6 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <Megaphone className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold text-foreground">Ban Truyền thông</h3>
                    </div>
                    <div className="space-y-4">
                      <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                        <li>Thiết kế ấn phẩm và truyền thông cho câu lạc bộ</li>
                        <li>Quản lý các kênh truyền thông của câu lạc bộ và lên kế hoạch đăng bài truyền thông</li>
                        <li>Phát triển hình ảnh và thương hiệu của câu lạc bộ</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ban Tài chính cá nhân */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl transform transition-all" />
                  <div className="relative p-6 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <Wallet className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold text-foreground">Ban Tài chính cá nhân</h3>
                    </div>
                    <div className="space-y-4">
                      <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                        <li>Tổ chức đào tạo, nâng cao hiểu biết tài chính cá nhân cho sinh viên</li>
                        <li>Phát triển và cập nhật nội dung cho bộ bài MoneyWe</li>
                        <li>Hỗ trợ giảng viên giảng dạy các môn học liên quan đến mảng tài chính cá nhân</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ban Nhân sự */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl transform transition-all" />
                  <div className="relative p-6 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold text-foreground">Ban Nhân sự</h3>
                    </div>
                    <div className="space-y-4">
                      <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                        <li>Phân công công việc và quản lý tiến độ công việc</li>
                        <li>Triển khai hoạt động gắn kết, gìn giữ văn hóa tổ chức</li>
                        <li>Lập dự trù kinh phí cho từng hoạt động</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nguyên tắc Phối hợp */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all" />
            <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-8 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                    <Handshake className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  NGUYÊN TẮC PHỐI HỢP
                </h2>
              </div>
              
              <div className="space-y-4">
                <ul className="list-disc pl-5 space-y-2.5 text-lg text-muted-foreground/90">
                  <li>Ban Học thuật chuẩn bị và bàn giao nội dung</li>
                  <li>Ban Sự kiện lập kế hoạch và giải quyết các giấy tờ cần có để tổ chức sự kiện</li>
                  <li>Ban Truyền thông thiết kế ấn phẩm và lên bài quảng bá sự kiện</li>
                  <li>Ban Tài chính ccá nhân phụ trách mảng giáo dục tài chính cá nhân</li>
                  <li>Ban Nhân sự bảo đảm nguồn lực được phân công hiệu quả và kịp tiến độ công việc đề ra</li>
                </ul>
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
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
        .animate-text-shine {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
