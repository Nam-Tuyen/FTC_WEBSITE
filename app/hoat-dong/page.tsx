"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    title: "Cuộc thi ATTACKER",
    body:
      "ATTACKER là cuộc thi học thuật thường niên do FTC tổ chức, thu hút đông đảo sinh viên yêu thích và đam mê công nghệ tài chính. Mỗi mùa thi mang đến một chủ đề mới gắn liền với các xu hướng công nghệ hiện đại, giúp thí sinh rèn luyện tư duy sáng tạo, trải nghiệm thực tế và chinh phục những giải thưởng giá trị. Năm 2025, ATTACKER đã bước vào vòng 3 và đang diễn ra vô cùng kịch tính.",
    img: IMAGES.attacker,
    alt: "Cuộc thi ATTACKER của FTC",
  },
  {
    title: "Talkshow chuyên đề",
    body:
      "Hằng năm, FTC tổ chức nhiều buổi Talkshow xoay quanh các chủ đề FinTech và công nghệ số. Đây là cơ hội để sinh viên giao lưu, lắng nghe chia sẻ từ các chuyên gia đầu ngành và đặt câu hỏi trực tiếp. Một s��� chương trình tiêu biểu có thể kể đến như: Blockchain & AI: Con đường sự nghiệp trong kỷ nguyên số hóa; Chứng khoán thời công nghệ – Tư duy tiếp cận phù hợp.",
    img: IMAGES.talkshow,
    alt: "Talkshow chuyên đề FinTech",
    rotate: true,
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
    img: IMAGES.career,
    alt: "Career Day Web3 Career Innovation",
  },
  {
    title: "WORKSHOP CHUYÊN SÂU",
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

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 text-glow pulse">
            HOẠT ĐỘNG <span className="bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent">CÂU LẠC BỘ</span>
          </h1>
          <p className="text-[18px] text-foreground/80 max-w-4xl mx-auto text-pretty leading-relaxed italic">
            FTC không chỉ là nơi học tập về công nghệ tài chính mà còn là cộng đồng năng động với nhiều hoạt động đa dạng, mang lại kiến thức, kỹ năng và cơ hội kết nối thực tế cho sinh viên.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto space-y-8">
          {activities.map((item, idx) => {
            const isEven = idx % 2 === 1
            return (
              <Card
                key={item.title}
                className="bg-card/30 border-accent/20 backdrop-blur-sm hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-0">
                  <CardTitle className="text-2xl font-bold text-foreground text-center uppercase">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div
                    className={`grid gap-6 items-center justify-items-center ${item.img ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}
                  >
                    {item.img && (
                      <div className={`rounded-xl overflow-hidden border border-accent/20 glow w-full max-w-xl ${isEven ? "md:order-2" : "md:order-1"}`}>
                        <img
                          src={item.img}
                          alt={item.alt}
                          loading="lazy"
                          className={`w-full h-64 md:h-56 object-cover ${item.rotate ? "rotate-180" : ""}`}
                        />
                      </div>
                    )}

                    <div className={`text-foreground/90 leading-relaxed text-pretty max-w-2xl ${isEven ? "md:order-1" : "md:order-2"}`}>
                      <p className="text-justify mx-auto">{item.body}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

    </div>
  )
}
