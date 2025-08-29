import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, BookOpen, Briefcase, Users, Share2, Handshake, Settings, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function OrganizationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 leading-9">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-foreground mb-6 text-glow">
            CƠ CẤU CÁC BAN
            <br />
            <span className="bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent leading-[5rem]">CÂU LẠC BỘ CÔNG NGHỆ TÀI CHÍNH</span>
          </h1>
        </div>
      </section>

      {/* Departments */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1) Ban Chủ nhiệm */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Shield className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Ban Chủ nhiệm</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-foreground/90 leading-relaxed space-y-3">
              <p><span className="font-semibold text-accent">Thành phần:</span> Chủ nhiệm, Phó Chủ nhiệm.</p>
              <p>
                <span className="font-semibold text-accent">Chức năng:</span> Điều hành chung, hoạch định chiến lược; phê duyệt kế hoạch – ngân sách – nhân sự; đối ngoại cấp Câu lạc bộ.
              </p>
            </CardContent>
          </Card>

          {/* 2) Ban Học thuật */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Ban Học thuật</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-foreground/90 leading-relaxed">
              <p className="mb-3"><span className="font-semibold text-accent">Chức năng:</span> Trung tâm nội dung chuyên môn Fintech.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Thiết kế giáo trình nội bộ, tài liệu sự kiện, ấn phẩm học thuật.</li>
                <li>Xây dựng nội dung workshop, tọa đàm, cuộc thi (đề bài, chấm điểm, cố vấn).</li>
                <li>Tổ chức tập huấn kỹ năng (xử lý dữ liệu, SQL, phân tích – thuật toán giao dịch).</li>
                <li>Đại diện CLB tham gia/thi đấu học thuật, công nghệ, đổi mới sáng tạo.</li>
              </ul>
            </CardContent>
          </Card>

          {/* 3) Ban Sự kiện */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Briefcase className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Ban Sự kiện</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-foreground/90 leading-relaxed">
              <p className="mb-3"><span className="font-semibold text-accent">Chức năng:</span> Lên kế hoạch và vận hành chương trình.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Thiết kế concept, cấu trúc chương trình; kịch bản tổng, kịch bản MC.</li>
                <li>Lập kế hoạch – timeline, điều phối hiện trường, hậu cần.</li>
                <li>Soạn báo cáo tổng kết, đánh giá hiệu quả.</li>
                <li>Quản lý hộp thư CLB và làm đầu mối liên hệ trong sự kiện.</li>
              </ul>
            </CardContent>
          </Card>

          {/* 4) Ban Truyền thông */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Share2 className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Ban Truyền thông</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-foreground/90 leading-relaxed">
              <p className="mb-3"><span className="font-semibold text-accent">Chức năng:</span> Hình ảnh – nội dung – kênh số của CLB.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Quản trị fanpage/kênh chính thức, đảm bảo nhận diện nhất quán.</li>
                <li>Sáng tạo nội dung, thiết kế ấn phẩm (bài viết, infographic, poster, video).</li>
                <li>Chụp ảnh, ghi hình, lựa chọn tư liệu; xuất bản theo kế hoạch.</li>
                <li>Phối hợp – kết nối truyền thông với đối tác, đơn vị đồng hành.</li>
              </ul>
            </CardContent>
          </Card>

          {/* 5) Ban Tài chính cá nhân */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Handshake className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Ban Tài chính cá nhân</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-foreground/90 leading-relaxed">
              <p className="mb-3"><span className="font-semibold text-accent">Chức năng:</span> Giáo dục tài chính cá nhân ứng dụng công nghệ.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Trợ giảng qua boardgame MoneyWe; tổ chức workshop/talkshow chuyên đề.</li>
                <li>Biên soạn chuỗi FTCCN Sharing (bài viết, công cụ hỗ trợ quản lý tài chính).</li>
                <li>Phối hợp Học thuật tích hợp kiến thức Fintech vào nội dung tài chính cá nhân.</li>
                <li>Kết nối hoạt động liên ban để phát triển kỹ năng mềm.</li>
              </ul>
            </CardContent>
          </Card>

          {/* 6) Ban Nhân sự */}
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Settings className="h-7 w-7 text-accent" />
                <CardTitle className="text-2xl font-bold text-foreground">Ban Nhân sự</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-foreground/90 leading-relaxed">
              <p className="mb-3"><span className="font-semibold text-accent">Chức năng:</span> Văn hóa – nội quy – vận hành nguồn lực.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Xây dựng nội quy, gìn giữ văn hóa FTC; chăm lo đời sống tinh thần.</li>
                <li>Tuyển – phân công – theo dõi hiệu quả nhân sự cho từng chương trình.</li>
                <li>Tổ chức gắn kết nội bộ (onboarding, teambuilding, mentoring).</li>
                <li>Lập dự toán chi phí, theo dõi và quản lý quỹ minh bạch.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Nguyên tắc phối hợp */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-foreground">Nguyên tắc phối hợp</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-foreground/90 leading-relaxed space-y-3">
              <p>
                <span className="font-semibold text-accent">Chuỗi phối hợp:</span> Học thuật cung cấp nội dung → Sự kiện vận hành → Truyền thông lan tỏa.
              </p>
              <p>
                <span className="font-semibold text-accent">Bảo đảm nguồn lực:</span> Nhân sự phụ trách người – việc – văn hóa; Ban Tài chính cá nhân triển khai mảng giáo dục chuyên biệt, đóng góp nội dung và hoạt động cho toàn CLB.
              </p>
              <p>
                <span className="font-semibold text-accent">Điều phối chung:</span> Ban Chủ nhiệm điều phối, phê duyệt và làm đầu mối đối ngoại cấp Câu lạc bộ.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Tham gia đội câu lạc bộ FTC
          </h2>
          <p className="text-lg text-foreground/80 mb-8">
            Trở thành một phần của cộng đồng Công nghệ – Tài chính để học sâu – làm thật – kết nối rộng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-futuristic">
              <Link href="/ung-tuyen"> Tham gia ngay <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10">
              <Link href="/hoat-dong">Hoạt động của câu lạc bộ</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
