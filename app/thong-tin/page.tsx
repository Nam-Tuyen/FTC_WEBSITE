import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, BookOpen, TrendingUp, Award, Network } from "lucide-react"
import Image from "next/image"

export default function ThongTinPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 px-6 py-2 text-lg bg-accent/20 text-accent border-accent/30">
            THÔNG TIN CÂU LẠC BỘ
          </Badge>
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-7xl text-foreground mb-8 text-balance tracking-tight text-glow">
            CÂU LẠC BỘ <br />
            <span className="bg-gradient-to-r from-accent via-accent to-accent bg-clip-text text-transparent animate-pulse">
              CÔNG NGHỆ - TÀI CHÍNH
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 mb-8 max-w-4xl mx-auto text-pretty font-medium leading-relaxed">
            Trường Đại học Kinh tế – Luật, ĐHQG-HCM
          </p>
        </div>

        {/* Hero Images */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-card/50 border-accent/20 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 group overflow-hidden">
            <CardContent className="p-0">
              <div className="relative overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/482266430_1041617031327391_4459620123367072825_n.jpg-RaWjvbXEsJhtThYouH797qRJwyhWFF.jpeg"
                  alt="Cuộc thi ATTACKER 2024 - Chung kết cuộc thi tìm hiểu về Fintech"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">CUỘC THI ATTACKER 2024</h3>
                  <p className="text-sm text-foreground/70">Chung kết cuộc thi tìm hiểu về Fintech</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-accent/20 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 group overflow-hidden">
            <CardContent className="p-0">
              <div className="relative overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/485306792_1049549157200845_3874215382928343520_n.jpg-U85q6reHFVluEm7M5BjSjpEYpaR8gz.jpeg"
                  alt="Tọa đàm Blockchain và AI - Con đường sự nghiệp trong kỷ nguyên số hóa"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">TỌA ĐÀMBLOCKCHAIN VÀ AI</h3>
                  <p className="text-sm text-foreground/70">Con đường sự nghiệp trong kỷ nguyên số hóa</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Introduction Section */}
        <Card className="bg-card/30 border-accent/20 backdrop-blur-sm mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-8 w-8 text-accent" />
              <h2 className="text-3xl font-bold text-foreground">Giới thiệu chung</h2>
            </div>
            <div className="space-y-4 text-foreground/90 leading-relaxed">
              <p>
                Câu lạc bộ Công nghệ – Tài chính (FTC) trực thuộc Khoa Tài chính – Ngân hàng, Trường Đại học Kinh tế –
                Luật, ĐHQG-HCM. FTC được thành lập vào tháng 11/2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm (Giảng
                viên Khoa Tài chính – Ngân hàng, Chủ nhiệm CLB) cùng đội ngũ sinh viên yêu thích lĩnh vực công nghệ tài
                chính.
              </p>
              <p>
                UEL là một trong tám đơn vị thành viên của ĐHQG-HCM, là trung tâm đào tạo và nghiên cứu đa ngành, đa
                lĩnh vực, uy tín hàng đầu phía Nam trong các khối Kinh tế – Luật – Quản lý công.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-8 w-8 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Sứ mệnh</h2>
              </div>
              <p className="text-foreground/90 leading-relaxed">
                Mang lại giá trị thiết thực cho sinh viên thông qua hệ sinh thái học thuật – thực hành – kết nối nghề
                nghiệp trong lĩnh vực công nghệ tài chính.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-accent/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-8 w-8 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Giá trị cốt lõi</h2>
              </div>
              <p className="text-foreground/90 leading-relaxed mb-4">
                <span className="font-semibold text-accent">Giáo dục – Kết nối – Chia sẻ</span>
              </p>
              <p className="text-foreground/80">
                Theo phương châm:{" "}
                <span className="font-semibold text-accent">Thống nhất – Vượt trội – Tiên phong</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Objectives */}
        <Card className="bg-card/30 border-accent/20 backdrop-blur-sm mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-8 w-8 text-accent" />
              <h2 className="text-3xl font-bold text-foreground">Mục tiêu hoạt động</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  Cập nhật và truyền đạt kiến thức về tài chính định lượng, dữ liệu và sản phẩm số.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Network className="h-6 w-6 text-accent" />
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  Kết nối sinh viên với giảng viên, chuyên gia, doanh nghiệp và nhà tuyển dụng.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  Xây dựng cộng đồng học thuật cởi mở: cùng học, cùng làm, cùng chia sẻ.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vision */}
        <Card className="bg-gradient-to-r from-accent/10 to-accent/10 border-accent/30 backdrop-blur-sm mb-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Tầm nhìn</h2>
            <div className="space-y-4 text-foreground/90 leading-relaxed max-w-4xl mx-auto">
              <p className="text-lg">
                <span className="font-semibold text-accent">Đến 2030</span>, FTC trở thành cộng đồng sinh viên yêu thích
                công nghệ tài chính lớn nhất Việt Nam
              </p>
              <p className="text-lg">
                <span className="font-semibold text-accent">Đến 2033</span>, mở rộng mạng lưới hợp tác sinh viên –
                doanh nghiệp trong khu vực Đông Nam Á
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Activities */}
        <Card className="bg-card/30 border-accent/20 backdrop-blur-sm mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Hoạt động tiêu biểu</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-3 h-3 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Hội thảo, toạ đàm, chuyên đề</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      Xu hướng công nghệ tài chính, dữ liệu và trí tuệ nhân tạo trong tài chính, sản phẩm ngân hàng số,
                      thị trường vốn, quản trị rủi ro…
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-3 h-3 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Cuộc thi học thuật và dự án thực hành</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      Thiết kế mô hình, xây dựng công cụ phân tích và thử nghiệm trên dữ liệu thực tế.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-3 h-3 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Kết nối nghề nghiệp</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      Gặp gỡ chuyên gia, cố vấn; giới thiệu thực tập, ngày hội việc làm; tham quan doanh nghiệp.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-3 h-3 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Cộng đồng học thuật</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      Nhóm nghiên cứu sinh viên, diễn đàn chia sẻ tài liệu, giờ lập trình, nhóm đọc tài liệu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Closing Statement */}
        <Card className="bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              FTC – Nơi sinh viên UEL học sâu, làm thật, kết nối rộng để tạo giá trị cho bản thân và cộng đồng.
            </h2>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
