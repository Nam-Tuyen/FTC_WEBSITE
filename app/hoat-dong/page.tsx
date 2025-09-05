import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, ArrowRight } from "lucide-react"
import Link from "next/link"

const IMAGES = {
  attacker:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2F9feb8cd50fe2408b95de0441ea04b6db?format=webp&width=800",
  talkshow:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2Fd9bc07b1b20f473fa7c4e67dfe0f4171?format=webp&width=800",
  company:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2Fc58c8142a48b4cf19cdaaa97a4ff29b7?format=webp&width=800",
  training:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2F0b7e7e182b494380baf0cadf0a930bb2?format=webp&width=800",
  workshop:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2F17ac3fbb64b248ffa3a7092b52cc2091?format=webp&width=800",
  trip:
    "https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2Fb6bc0875a1644767a21595c092d93438?format=webp&width=800",
}

const activities = [
  {
    title: "Cuộc thi ATTACKER",
    body:
      "ATTACKER là cuộc thi học thuật thường niên do FTC tổ chức, thu hút đông đảo sinh viên yêu thích và đam mê công nghệ tài chính. Mỗi mùa thi mang đến một chủ đề mới gắn liền với các xu hướng công nghệ hiện đại, giúp thí sinh rèn luyện tư duy sáng tạo, trải nghiệm thực tế và chinh phục những giải thưởng giá trị. Năm 2025, ATTACKER đã bước vào vòng 3 và đang diễn ra vô cùng kịch tính.",
    img: IMAGES.attacker,
    alt: "Cuộc thi ATTACKER của FTC",
  },
  {
    title: "Talkshow chuyên đề",
    body:
      "Hằng năm, FTC tổ chức nhiều buổi Talkshow xoay quanh các chủ đề FinTech và công nghệ số. Đây là cơ hội để sinh viên giao lưu, lắng nghe chia sẻ từ các chuyên gia đầu ngành và đặt câu hỏi trực tiếp. Một số chương trình tiêu biểu có thể kể đến như: Blockchain & AI: Con đường sự nghiệp trong kỷ nguyên số hóa; Chứng khoán thời công nghệ – Tư duy tiếp cận phù hợp.",
    img: IMAGES.talkshow,
    alt: "Talkshow chuyên đề FinTech",
  },
  {
    title: "Tham quan doanh nghiệp",
    body:
      "FTC hợp tác cùng nhiều doanh nghiệp để tổ chức chương trình tham quan thực tế. Tiêu biểu là chuyến tham quan VNG, nơi các thành viên có cơ hội trải nghiệm môi trường làm việc, tìm hiểu hoạt động công ty và khám phá tiềm năng nghề nghiệp trong lĩnh vực công nghệ tài chính.",
    img: IMAGES.company,
    alt: "Chương trình tham quan doanh nghiệp",
  },
  {
    title: "FTC Training & Sharing",
    body:
      "Là một câu lạc bộ học thuật, FTC đặc biệt chú trọng hoạt động training nội bộ và chia sẻ kiến thức. Thành viên sẽ được trang bị kiến thức FinTech từ cơ bản đến nâng cao, rèn luyện kỹ năng nghề nghiệp và giải đáp thắc mắc về cơ hội việc làm trong ngành. Ngoài ra, fanpage FTC cũng thường xuyên đăng tải các bài viết hữu ích phục vụ cộng đồng sinh viên.",
    img: IMAGES.training,
    alt: "FTC Training & Sharing",
  },
  {
    title: "Career Day",
    body:
      "Chuỗi sự kiện Web3 Career Innovation gồm ba hoạt động chính: talkshow, doanh nghiệp đặt booth và phỏng vấn trực tiếp. Chương trình hướng đến việc giúp sinh viên tiếp cận công nghệ Blockchain & Web3, thay đổi góc nhìn tiêu cực về Crypto và mở ra cơ hội nghề nghiệp sáng tạo trong lĩnh vực tài chính – công nghệ.",
    img: undefined,
    alt: "Career Day Web3 Career Innovation",
  },
  {
    title: "Workshop chuyên sâu",
    body:
      "FTC phối hợp cùng các đối tác để tổ chức các buổi workshop và tập huấn. Đây là dịp để sinh viên vừa nâng cao kiến thức chuyên môn, vừa rèn kỹ năng quản lý – tổ chức sự kiện. Hoạt động nổi bật là Workshop Training: VC Selection Criteria, thuộc chuỗi sự kiện ATTACKER 2025, mang đến cái nhìn toàn diện về cách quỹ đầu tư mạo hiểm lựa chọn dự án khởi nghiệp.",
    img: IMAGES.workshop,
    alt: "Workshop chuyên sâu của FTC",
  },
  {
    title: "FTC Trip",
    body:
      "Bên cạnh các hoạt động học thuật, FTC còn tổ chức các chuyến đi gắn kết cộng đồng. FTC Trip là hoạt động thường niên được mong chờ nhất, nơi các thành viên và cựu thành viên cùng nhau tham gia những chuyến đi “chữa lành”, xả stress và tạo kỷ niệm đáng nhớ. Ngoài ra, còn có nhiều mini trip định kỳ hàng tháng hoặc hàng quý giúp các thành viên kết nối chặt chẽ hơn.",
    img: IMAGES.trip,
    alt: "FTC Trip gắn kết cộng đồng",
  },
]

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
            HOẠT ĐỘNG <span className="bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent">CÂU LẠC BỘ</span>
          </h1>
          <p className="text-xl text-foreground/80 max-w-4xl mx-auto text-pretty leading-relaxed">
            FTC không chỉ là nơi học tập về công nghệ tài chính mà còn là cộng đồng năng động với nhiều hoạt động đa dạng, mang lại kiến thức, kỹ năng và cơ hội kết nối thực tế cho sinh viên.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto space-y-10">
          {activities.map((item, idx) => (
            <Card key={item.title} className="bg-card/30 border-accent/20 backdrop-blur-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-2xl font-bold text-foreground">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-start ${idx % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}>
                  {item.img ? (
                    <div className="rounded-xl overflow-hidden border border-accent/20 glow">
                      <img
                        src={item.img}
                        alt={item.alt}
                        loading="lazy"
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-accent/20 bg-accent/10 h-64 md:h-full flex items-center justify-center text-accent text-center px-6">
                      <p>Vui lòng cung cấp ảnh minh họa cho hoạt động này để hiển thị đầy đủ.</p>
                    </div>
                  )}

                  <div className="text-foreground/90 leading-relaxed text-pretty">
                    <p>{item.body}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
