import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Award, Users, Calendar, Star, Target, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

const achievements = [
  {
    id: 1,
    title: "Giải Nhất Hackathon FinTech 2024",
    description:
      "Đội thi của câu lạc bộ đã giành giải nhất cuộc thi Hackathon FinTech quốc gia với ứng dụng thanh toán di động sáng tạo.",
    date: "Tháng 3, 2024",
    category: "Cuộc thi",
    icon: Trophy,
    image: "/fintech-hackathon-trophy-award-ceremony.png",
    tags: ["Hackathon", "Giải nhất", "Thanh toán"],
  },
  {
    id: 2,
    title: "Chứng nhận Đối tác Chiến lược",
    description:
      "Được công nhận là đối tác chiến lược bởi Hiệp hội FinTech Việt Nam trong việc phát triển nhân lực công nghệ tài chính.",
    date: "Tháng 1, 2024",
    category: "Chứng nhận",
    icon: Award,
    image: "/partnership-certificate-fintech-vietnam.png",
    tags: ["Đối tác", "Chứng nhận", "Hiệp hội"],
  },
  {
    id: 3,
    title: "500+ Thành viên Tích cực",
    description:
      "Câu lạc bộ đã phát triển thành cộng đồng với hơn 500 thành viên tích cực từ các trường đại học và doanh nghiệp.",
    date: "Tháng 12, 2023",
    category: "Cộng đồng",
    icon: Users,
    image: "/large-group-fintech-community-meeting.png",
    tags: ["Thành viên", "Cộng đồng", "Phát triển"],
  },
  {
    id: 4,
    title: "Dự án Blockchain Banking",
    description:
      "Phát triển thành công ứng dụng ngân hàng số sử dụng công nghệ blockchain, được triển khai thí điểm tại 3 ngân hàng.",
    date: "Tháng 10, 2023",
    category: "Dự án",
    icon: Target,
    image: "/blockchain-banking-application-interface.png",
    tags: ["Blockchain", "Ngân hàng", "Ứng dụng"],
  },
  {
    id: 5,
    title: "Giải Ba Cuộc thi AI trong Tài chính",
    description:
      "Đạt giải ba trong cuộc thi ứng dụng AI trong lĩnh vực tài chính với giải pháp phân tích rủi ro tín dụng thông minh.",
    date: "Tháng 8, 2023",
    category: "Cuộc thi",
    icon: Star,
    image: "/ai-finance-competition-award-ceremony.png",
    tags: ["AI", "Giải ba", "Tín dụng"],
  },
  {
    id: 6,
    title: "Hội thảo Quốc tế FinTech",
    description:
      "Tổ chức thành công hội thảo quốc tế về FinTech với sự tham gia của hơn 1000 người và 50 diễn giả từ 15 quốc gia.",
    date: "Tháng 6, 2023",
    category: "Sự kiện",
    icon: Calendar,
    image: "/international-fintech-conference-speakers-stage.png",
    tags: ["Hội thảo", "Quốc tế", "Diễn giả"],
  },
]

const stats = [
  { label: "Giải thưởng", value: "15+", icon: Trophy },
  { label: "Dự án hoàn thành", value: "25+", icon: Target },
  { label: "Thành viên", value: "500+", icon: Users },
  { label: "Đối tác", value: "30+", icon: Award },
]

export default function AchievementsPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 text-glow pulse">
            THÀNH TÍCH <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">NỔI BẬT</span>
          </h1>
          <p className="text-[18px] italic text-foreground/80 max-w-4xl mx-auto leading-relaxed">
            Những cột mốc quan trọng và thành tựu đáng tự hào trong hành trình chinh phục công nghệ tài chính tiên tiến
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading font-extrabold text-3xl text-foreground mb-4 text-glow">Thành tích của Câu lạc bộ Công nghệ Tài chính (FTC)</h2>
            <p className="text-[18px] text-foreground/80 mb-4">Niềm tự hào của tuổi trẻ UEL</p>
            <p className="text-foreground/90 mb-4 leading-relaxed text-justify">
              Câu lạc bộ Công nghệ Tài chính (FTC) luôn gắn liền hành trình phát triển của tuổi trẻ Trường Đại học Kinh tế – Luật với những trải nghiệm đáng nhớ và thành tích nổi bật. Trong năm học 2024 – 2025, FTC đã vinh dự được Ban Cán sự Đoàn Đại học Quốc gia TP.HCM trao tặng Giấy khen vì những đóng góp tích cực trong công tác Đoàn và phong trào thanh niên. Đây là sự ghi nhận xứng đáng cho một tập thể giàu nhiệt huyết, sáng tạo và đoàn kết.
            </p>
            <p className="text-foreground/90 mb-6 leading-relaxed text-justify">
              FTC không chỉ tổ chức các hoạt động học thuật và ngoại khóa bổ ích mà còn tạo dựng một môi trường rèn luyện, kết nối và lan tỏa tinh thần tích cực. Thành tích này là minh chứng rõ nét cho tinh thần cống hiến và trách nhiệm của tuổi trẻ Kinh tế – Luật, đồng thời khẳng định vai trò của FTC trong việc nuôi dưỡng và phát triển thế hệ sinh viên năng động.
            </p>
          </div>
          <div className="w-full rounded-xl overflow-hidden border border-accent/20 bg-card/10 p-6 flex items-center justify-center">
            <img src="https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2F4540def63fb249718e9bbaf2d10ebfdc?format=webp&width=1200" alt="Giấy khen ĐHQG" className="w-full h-auto object-contain max-h-[420px]" />
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img src="https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2Ff2b809cb40ef46d9867dc037c5d33b65?format=webp&width=1200" alt="I-Star Top10" className="w-full h-auto object-contain max-h-[420px] rounded-xl border border-accent/20 bg-card/10 p-4" />
          </div>
          <div className="order-1 lg:order-2">
            <h3 className="font-heading font-extrabold text-3xl text-foreground mb-4 text-glow">Dấu ấn tại Giải thưởng I-Star</h3>
            <p className="text-foreground/90 mb-4 leading-relaxed text-justify">
              Một trong những thành tích đáng tự hào khác của FTC là được vinh danh trong Top 10 tổ chức, cá nhân tiêu biểu Nhóm 4 (các tổ chức, cá nhân hỗ trợ khởi nghiệp) tại Giải thưởng Đổi mới sáng tạo và Khởi nghiệp TP.HCM (I-Star). Đây là giải thưởng uy tín do Ủy ban Nhân dân TP.HCM chủ trì và Sở Khoa học và Công nghệ TP.HCM tổ chức thường niên, nhằm tôn vinh các tập thể, cá nhân có đóng góp xuất sắc cho phong trào đổi mới sáng tạo và khởi nghiệp.
            </p>
            <p className="text-foreground/90 mb-4 leading-relaxed text-justify">
              Thành tích này khẳng định những nỗ lực bền bỉ của FTC trong việc xây dựng một hệ sinh thái học thuật – thực tiễn, nơi sinh viên có thể nuôi dưỡng ý tưởng, triển khai dự án và phát triển tinh thần khởi nghiệp. Với định hướng “bệ phóng cho những ý tưởng đổi mới”, FTC đã và đang triển khai nhiều chương trình thiết thực như các cuộc thi học thuật, các buổi đào tạo, workshop, talkshow… nhằm giúp sinh viên tiếp cận kiến thức chuyên sâu về công nghệ tài chính và khởi nghiệp sáng tạo.
            </p>
            <p className="text-foreground/90 leading-relaxed text-justify">
              Khẳng định bản lĩnh tiên phong: Những thành tích mà FTC đã đạt được không chỉ là sự công nhận từ các tổ chức uy tín mà còn là minh chứng cho tinh thần trách nhiệm, sự nỗ lực và sáng tạo của tập thể câu lạc bộ. Đây cũng chính là nền tảng để FTC tiếp tục phát huy sức trẻ, đổi mới và khẳng định bản lĩnh trong hành trình học tập, nghiên cứu và khởi nghiệp của sinh viên UEL nói riêng và cộng đồng sinh viên TP.HCM nói chung.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <Card
                key={achievement.id}
                className="relative group bg-card/20 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-500 hover:glow overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={achievement.image || "/placeholder.svg"}
                      alt={achievement.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 bg-accent/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-accent/30">
                        <achievement.icon className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-accent/20 text-accent border-accent/30 font-bold uppercase tracking-wide"
                      >
                        {achievement.category}
                      </Badge>
                      <span className="text-xs text-foreground/60 font-mono">{achievement.date}</span>
                    </div>
                    <CardTitle className="text-xl font-heading font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                      {achievement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-foreground/70 text-[18px] italic mb-6 line-clamp-3 leading-relaxed">
                      {achievement.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {achievement.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="outline"
                          className="text-xs bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
