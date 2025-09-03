import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, BookOpen, Calendar, Megaphone, Wallet, Users, Handshake } from "lucide-react"

export default function OrganizationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden gradient-bg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-[300px] w-[300px] rounded-full bg-accent/20 blur-3xl absolute -top-10 -left-10" />
          <div className="h-[260px] w-[260px] rounded-full bg-primary/20 blur-3xl absolute bottom-0 right-0" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-4">
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-foreground text-glow pulse">
              DANH SÁCH CÁC BAN
            </h1>
          </div>

        </div>
      </section>

      {/* Structure map */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-card/30 border-accent/20 backdrop-blur-sm ring-1 ring-accent/10 hover:ring-accent/30 transition lg:col-span-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <Shield className="h-7 w-7 text-accent" /> Ban Chủ nhiệm
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-foreground/90 leading-relaxed">
                <p className="text-base">Điều phối toàn diện hoạt động, định hình chiến lược phát triển, phê duyệt kế hoạch, ngân sách và nhân sự, đồng thời làm đầu mối đối ngoại của Câu lạc bộ.</p>
              </CardContent>
            </Card>

            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {/* Ban Học thuật */}
              <Card className="group h-full bg-card/30 border-accent/20 backdrop-blur-sm transition hover:-translate-y-0.5 ring-1 ring-accent/10 hover:ring-accent/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-7 w-7 text-accent" />
                    <CardTitle className="text-2xl font-bold text-foreground">Ban Học thuật</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-foreground/90 leading-relaxed">
                  <p className="mb-3"><span className="font-semibold text-accent">Chức năng:</span></p>
                  <p className="mb-3">Phụ trách mảng kiến thức công nghệ tài chính của Câu lạc bộ, cập nhật tài liệu và biến kiến thức thành hoạt động dễ học, dễ áp dụng.</p>
                  <p className="mb-2"><span className="font-semibold text-accent">Nhiệm vụ:</span></p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Soạn giáo trình nội bộ, chuẩn bị tài liệu cho sự kiện và các ấn phẩm học thuật dùng chung.</li>
                    <li><p>Lên nội dung cho buổi talkshow, workshop. Trong các cuộc thi học thuật: Ban có nhiệm vụ xây bộ đề, tiêu chí chấm và đồng hành cùng đội thi.</p></li>
                    <li>Tổ chức các buổi rèn kỹ năng như xử lý dữ liệu, SQL, phân tích và giao dịch theo thuật toán.</li>
                    <li>Đại diện Câu lạc bộ tham gia các sân chơi về học thuật, công nghệ và đổi mới sáng tạo.</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Ban Sự kiện */}
              <Card className="group h-full bg-card/30 border-accent/20 backdrop-blur-sm transition hover:-translate-y-0.5 ring-1 ring-accent/10 hover:ring-accent/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-7 w-7 text-accent" />
                    <CardTitle className="text-2xl font-bold text-foreground">Ban Sự kiện</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-foreground/90 leading-relaxed">
                  <p className="mb-3"><span className="font-semibold text-accent">Chức năng:</span> Lên kế hoạch và tổ chức các chương trình của Câu lạc bộ, tập trung vào xây dựng kế hoạch, biên soạn kịch bản và tổng hợp báo cáo.</p>
                  <p className="mb-2"><span className="font-semibold text-accent">Nhiệm vụ:</span></p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Lên ý tưởng, thiết kế cấu trúc nội dung, soạn kịch bản tổng thể và kịch bản dẫn chương trình.</li>
                    <li><p>Viết kế hoạch chương trình: mục tiêu, nội dung chính, tiến độ tổng, ngân sách dự kiến và checklist phối hợp giữa các ban.</p></li>
                    <li>Soạn báo cáo tổng kết sau mỗi hoạt động, đánh giá hiệu quả và đề xuất cải tiến.</li>
                    <li>Trao đổi và trả lời email hợp tác với các đơn vị bên ngoài, ghi nhận lịch làm việc và lưu trữ thông tin trao đổi.</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Ban Truyền thông */}
              <Card className="group h-full bg-card/30 border-accent/20 backdrop-blur-sm transition hover:-translate-y-0.5 ring-1 ring-accent/10 hover:ring-accent/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Megaphone className="h-7 w-7 text-accent" />
                    <CardTitle className="text-2xl font-bold text-foreground">Ban Truyền thông</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-foreground/90 leading-relaxed">
                  <p className="mb-3"><span className="font-semibold text-accent">Chức năng:</span> Phụ trách hình ảnh, nội dung và các kênh trực tuyến của Câu lạc bộ.</p>
                  <p className="mb-2"><span className="font-semibold text-accent">Nhiệm vụ:</span></p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Quản trị trang chính thức trên các nền tảng, giữ nhận diện thống nhất.</li>
                    <li>Sáng tạo nội dung, thiết kế ấn phẩm: bài viết, đồ họa thông tin, áp phích, video.</li>
                    <li>Chụp ảnh, ghi hình, chọn và lưu trữ tư liệu, lên lịch và xuất bản theo kế hoạch.</li>
                    <li>Phối hợp truyền thông với đơn vị đồng hành và đối tác, bảo đảm thông tin chính xác và kịp thời.</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Ban Tài chính cá nhân */}
              <Card className="group h-full bg-card/30 border-accent/20 backdrop-blur-sm transition hover:-translate-y-0.5 ring-1 ring-accent/10 hover:ring-accent/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-7 w-7 text-accent" />
                    <CardTitle className="text-2xl font-bold text-foreground">Ban Tài chính cá nhân</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-foreground/90 leading-relaxed">
                  <p className="mb-3"><span className="font-semibold text-accent">Chức năng:</span> Giáo dục tài chính cá nhân gắn với ứng dụng công nghệ.</p>
                  <p className="mb-2"><span className="font-semibold text-accent">Nhiệm vụ:</span></p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Hỗ trợ giảng dạy bằng trò chơi MoneyWe, tổ chức các buổi chuyên đề và tọa đàm về tài chính cá nhân.</li>
                    <li>Biên soạn chuỗi FTCCN Sharing với bài viết hướng dẫn và bộ công cụ hỗ trợ quản lý chi tiêu, tiết kiệm, đầu tư.</li>
                    <li>Phối hợp với Ban Học thuật để tích hợp kiến thức công nghệ tài chính vào nội dung tài chính cá nhân.</li>
                    <li>Kết nối hoạt động giữa các ban nhằm bồi dưỡng kỹ năng mềm như giao tiếp, làm việc nhóm, thuyết trình và quản lý thời gian.</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Ban Nhân sự */}
              <Card className="group h-full bg-card/30 border-accent/20 backdrop-blur-sm transition hover:-translate-y-0.5 ring-1 ring-accent/10 hover:ring-accent/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-7 w-7 text-accent" />
                    <CardTitle className="text-2xl font-bold text-foreground">Ban Nhân sự</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-foreground/90 leading-relaxed">
                  <p className="mb-3"><span className="font-semibold text-accent">Chức năng:</span></p>
                  <p className="mb-3">Xây dựng văn hóa, hoàn thiện nội quy và vận hành nguồn lực của Câu lạc bộ.</p>
                  <p className="mb-2"><span className="font-semibold text-accent">Nhiệm vụ:</span></p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Soạn và cập nhật nội quy, giữ gìn văn hóa FTC, chăm lo đời sống tinh thần cho thành viên.</li>
                    <li>Tuyển chọn, phân công nhân sự và theo dõi hiệu quả làm việc cho từng chương trình.</li>
                    <li>Tổ chức hoạt động gắn kết nội bộ: định hướng thành viên mới, hoạt động gắn kết đội nhóm.</li>
                    <li>Lập dự trù kinh phí cho từng hoạt động, lập dự toán tổng, theo dõi chi phí và quản lý quỹ minh bạch.</li>
                    <li>Phối hợp các ban để cân đối nguồn lực theo kế hoạch và tiến độ.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/30 border-accent/20 backdrop-blur-sm ring-1 ring-accent/10 lg:col-span-3">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Handshake className="h-7 w-7 text-accent" />
                  <CardTitle className="text-2xl font-bold text-foreground text-left">Nguyên tắc phối hợp</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-foreground/90 leading-relaxed text-left">
                <p className="text-base leading-6">
                  Nguyên tắc phối hợp của Câu lạc bộ được vận hành theo chuỗi liên thông: Ban Học thuật xây dựng và bàn giao nội dung, Ban Sự kiện lập kế hoạch và tổ chức triển khai, còn Ban Truyền thông thiết kế ấn phẩm và lan tỏa thông tin. Song song đó, Ban Nhân sự bảo đảm bố trí con người, phân công công việc và gìn giữ văn hóa hoạt động, trong khi Ban Tài chính cá nhân phụ trách mảng giáo dục chuyên biệt về tài chính cá nhân và phối hợp nội dung khi cần. Tất cả được điều phối chung bởi Ban Chủ nhiệm với vai trò định hướng chiến lược, phê duyệt kế hoạch và làm đầu mối đối ngoại của Câu lạc bộ.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  )
}
