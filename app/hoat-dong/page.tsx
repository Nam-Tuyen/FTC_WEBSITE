import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Trophy,
  Briefcase,
  Users,
  Share2,
  Handshake,
  Settings,
  BarChart3,
  Rocket,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/20 border border-accent/40 mb-8 glow">
            <Rocket className="h-5 w-5 text-accent mr-3 animate-pulse" />
            <span className="text-sm font-bold text-accent uppercase tracking-wider">FTC Activities</span>
          </div>
          <h1 className="font-heading font-black text-5xl sm:text-6xl text-foreground mb-6 text-glow">
            HOẠT ĐỘNG <span className="bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent">CÔNG NGHỆ</span>
          </h1>
          <p className="text-xl text-foreground/80 max-w-4xl mx-auto text-pretty leading-relaxed">
            Toàn cảnh hoạt động của Câu lạc bộ Công nghệ – Tài chính (FTC): học sâu – làm thật – kết nối rộng để tạo giá trị.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1) Đào tạo – học thuật */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Đào tạo – học thuật</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 text-foreground/90 leading-relaxed">
              <p>Chuỗi nền tảng Fintech: tổng quan công nghệ tài chính, Blockchain, tiền mã hóa.</p>
              <p>Chuyên đề kỹ thuật: xử lý dữ liệu, SQL cho phân tích, phân tích thuật toán giao dịch.</p>
              <p>Mời chuyên gia/đơn vị hàng đầu đào tạo thực chiến, cung cấp tài liệu học thuật chuẩn hóa.</p>
            </CardContent>
          </Card>

          {/* 2) Cuộc thi ATTACKER – Algorithmic Trading */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Cuộc thi ATTACKER – Algorithmic Trading</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 text-foreground/90 leading-relaxed">
              <p>Sân chơi học thuật về giao dịch thuật toán, áp dụng cho thị trường chứng khoán Việt Nam.</p>
              <p>Vòng chung kết cấp vốn 50 triệu đồng/đội để giao dịch thực tế trong 30 ngày.</p>
              <p>Sau 3 mùa: gần 2.000 thí sinh từ ~50 trường; nhiều ý tưởng được BGK gợi ý hợp tác, ươm mầm startup.</p>
            </CardContent>
          </Card>

          {/* 3) Trải nghiệm doanh nghiệp – thực tế nghề nghiệp */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Briefcase className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Trải nghiệm doanh nghiệp – thực tế nghề nghiệp</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 text-foreground/90 leading-relaxed">
              <p>Tham quan doanh nghiệp công nghệ/tài chính (ví dụ: VNG, Metub…).</p>
              <p>Trao đổi tuyển dụng, quy trình làm việc, định hướng kỹ năng; hỗ trợ kiến tập/thực tập theo chuẩn học phần.</p>
            </CardContent>
          </Card>

          {/* 4) Kết nối nghề nghiệp – hệ sinh thái đổi mới sáng tạo */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Users className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Kết nối nghề nghiệp – hệ sinh thái đổi mới sáng tạo</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 text-foreground/90 leading-relaxed">
              <p>Sự kiện lớn: Web3 Career Innovation (thu hút 3.000+ sinh viên) về xu hướng nghề nghiệp Web3/Blockchain.</p>
              <p>Talkshow định hướng nhân lực thời chuyển đổi số; kết nối mentor – cố vấn; ngày hội việc làm, networking.</p>
            </CardContent>
          </Card>

          {/* 5) Cộng đồng học thuật & chia sẻ */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Share2 className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Cộng đồng học thuật & chia sẻ</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 text-foreground/90 leading-relaxed">
              <p>Nhóm nghiên cứu sinh viên, diễn đàn tài liệu, coding hour, reading group.</p>
              <p>Chuỗi FTCCN Sharing: nội dung thực tiễn về quản lý tài chính cá nhân và công cụ công nghệ hỗ trợ.</p>
            </CardContent>
          </Card>

          {/* 6) Hợp tác doanh nghiệp – tài trợ */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Handshake className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Hợp tác doanh nghiệp – tài trợ</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 text-foreground/90 leading-relaxed">
              <p>Kết nối 50+ doanh nghiệp/đơn vị đồng hành (chứng khoán, công nghệ, dữ liệu…).</p>
              <p>Phối hợp tổ chức sự kiện, học bổng, tài trợ cuộc thi; xây dựng cầu nối sinh viên – nhà tuyển dụng.</p>
            </CardContent>
          </Card>

          {/* 7) Tổ chức – vận hành (các ban chuyên môn) */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Settings className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Tổ chức – vận hành (các ban chuyên môn)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 text-foreground/90 leading-relaxed">
              <p>Ban Học thuật: thiết kế nội dung, tài liệu, đại diện CLB dự thi học thuật/công nghệ.</p>
              <p>Ban Sự kiện: lên ý tưởng, kịch bản, điều phối, MC; quản trị thư điện tử đối ngoại.</p>
              <p>Ban Truyền thông: quản lý fanpage, sáng tạo nội dung/đồ họa/video, chụp ảnh – ghi hình, liên kết truyền thông.</p>
              <p>Ban Tài chính cá nhân: trợ giảng qua boardgame MoneyWe; viết nội dung, tổ chức workshop/talkshow.</p>
              <p>Ban Nhân sự: xây dựng văn hóa – nội quy; phân công nhân sự; hậu cần chương trình; theo dõi quỹ minh bạch.</p>
            </CardContent>
          </Card>

          {/* 8) Kết quả tiêu biểu */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Kết quả tiêu biểu</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-foreground/90 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="rounded-lg bg-accent/10 border border-accent/20 p-4 text-center">
                  <div className="text-3xl font-extrabold text-accent">~35</div>
                  <div className="text-sm text-foreground/80">chương trình trong 4 năm</div>
                </div>
                <div className="rounded-lg bg-accent/10 border border-accent/20 p-4 text-center">
                  <div className="text-3xl font-extrabold text-accent">3.000+</div>
                  <div className="text-sm text-foreground/80">sinh viên cộng đồng</div>
                </div>
                <div className="rounded-lg bg-accent/10 border border-accent/20 p-4 text-center">
                  <div className="text-3xl font-extrabold text-accent">52</div>
                  <div className="text-sm text-foreground/80">tổ chức đồng hành</div>
                </div>
              </div>
              <p>
                FTC hướng tới <span className="font-semibold text-accent">“Giáo dục – Kết nối – Chia sẻ”</span>: học sâu – làm thật – kết nối rộng, bệ phóng để ý tưởng đổi mới của sinh viên thành sản phẩm và cơ hội nghề nghiệp.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-accent/20 via-transparent to-accent/20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent/10 rounded-full animate-pulse"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/20 border border-accent/40 mb-8 glow">
            <Rocket className="h-5 w-5 text-accent mr-3" />
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Tham gia cùng FTC</span>
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-foreground mb-6 text-glow">
            Sẵn sàng học sâu – làm thật – kết nối rộng
          </h2>
          <p className="text-xl text-foreground/80 mb-12 leading-relaxed max-w-2xl mx-auto">
            Trở thành một phần của cộng đồng Công nghệ – Tài chính để phát triển kỹ năng, mở rộng mạng lưới và tạo ra giá trị thực.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="btn-futuristic text-lg px-10 py-4 font-bold shadow-2xl hover:shadow-accent/50 transition-all duration-300"
            >
              <Link href="/ung-tuyen">
                TRỞ THÀNH THÀNH VIÊN <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 bg-transparent font-bold border-2 border-accent text-accent hover:bg-accent/10 hover:glow transition-all duration-300"
            >
              <Link href="/dien-dan">THAM GIA THẢO LUẬN</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
