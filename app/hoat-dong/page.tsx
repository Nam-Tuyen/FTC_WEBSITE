import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, ChevronRight, Zap, Rocket, ArrowRight } from "lucide-react"
import Link from "next/link"

const activities = [
  {
    id: 1,
    title: "Workshop: Blockchain và Cryptocurrency",
    description:
      "Khám phá công nghệ blockchain và ứng dụng trong cryptocurrency. Thực hành tạo smart contract đơn giản và hiểu về DeFi.",
    date: "2024-04-15",
    time: "14:00 - 17:00",
    location: "Phòng hội thảo A, Tầng 5",
    type: "Workshop",
    status: "upcoming",
    attendees: 45,
    maxAttendees: 50,
    image: "/blockchain-workshop-presentation-screen.png",
    tags: ["Blockchain", "Cryptocurrency", "Smart Contract"],
  },
  {
    id: 2,
    title: "Hackathon FinTech Innovation 2024",
    description:
      "Cuộc thi phát triển ứng dụng fintech trong 48 giờ. Các đội thi sẽ giải quyết các thách thức thực tế trong ngành tài chính.",
    date: "2024-03-22",
    time: "09:00 - 18:00",
    location: "Trung tâm Đổi mới Sáng tạo",
    type: "Hackathon",
    status: "completed",
    attendees: 120,
    maxAttendees: 120,
    image: "/hackathon-teams-coding-competition.png",
    tags: ["Hackathon", "Innovation", "Competition"],
  },
  {
    id: 3,
    title: "Seminar: AI trong Phân tích Tài chính",
    description:
      "Tìm hiểu cách ứng dụng trí tuệ nhân tạo trong phân tích dữ liệu tài chính, dự đoán thị trường và quản lý rủi ro.",
    date: "2024-03-08",
    time: "19:00 - 21:00",
    location: "Hội trường chính",
    type: "Seminar",
    status: "completed",
    attendees: 85,
    maxAttendees: 100,
    image: "/ai-finance-seminar-speaker-presentation.png",
    tags: ["AI", "Machine Learning", "Financial Analysis"],
  },
  {
    id: 4,
    title: "Networking Night: Kết nối Cộng đồng FinTech",
    description:
      "Buổi gặp gỡ, kết nối giữa các thành viên, alumni và các chuyên gia trong ngành fintech. Chia sẻ kinh nghiệm và cơ hội hợp tác.",
    date: "2024-02-20",
    time: "18:30 - 21:30",
    location: "Sky Lounge, Tầng 20",
    type: "Networking",
    status: "completed",
    attendees: 65,
    maxAttendees: 80,
    image: "/networking-event-professionals-mingling.png",
    tags: ["Networking", "Community", "Career"],
  },
  {
    id: 5,
    title: "Workshop: Payment Gateway Integration",
    description:
      "Hướng dẫn tích hợp các cổng thanh toán phổ biến vào ứng dụng web và mobile. Thực hành với Stripe, PayPal và VNPay.",
    date: "2024-02-05",
    time: "13:00 - 16:00",
    location: "Phòng Lab B, Tầng 3",
    type: "Workshop",
    status: "completed",
    attendees: 35,
    maxAttendees: 40,
    image: "/payment-integration-coding-workshop.png",
    tags: ["Payment", "Integration", "Development"],
  },
  {
    id: 6,
    title: "Hội thảo: Tương lai của Digital Banking",
    description:
      "Thảo luận về xu hướng ngân hàng số, open banking, và những thay đổi trong hành vi khách hàng thời đại số.",
    date: "2024-01-18",
    time: "14:30 - 17:30",
    location: "Auditorium chính",
    type: "Conference",
    status: "completed",
    attendees: 150,
    maxAttendees: 200,
    image: "/digital-banking-conference-panel-discussion.png",
    tags: ["Digital Banking", "Open Banking", "Future Trends"],
  },
]

const upcomingActivities = activities.filter((activity) => activity.status === "upcoming")
const pastActivities = activities.filter((activity) => activity.status === "completed")

const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming":
      return "bg-accent text-accent-foreground"
    case "completed":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "Workshop":
      return "bg-primary/10 text-primary border-primary/20"
    case "Hackathon":
      return "bg-accent/10 text-accent border-accent/20"
    case "Seminar":
      return "bg-chart-3/10 text-chart-3 border-chart-3/20"
    case "Networking":
      return "bg-chart-4/10 text-chart-4 border-chart-4/20"
    case "Conference":
      return "bg-chart-5/10 text-chart-5 border-chart-5/20"
    default:
      return "bg-secondary/10 text-secondary-foreground border-secondary/20"
  }
}

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/20 border border-accent/40 mb-8 glow">
            <Rocket className="h-5 w-5 text-accent mr-3 animate-pulse" />
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Tech Events Hub</span>
          </div>
          <h1 className="font-heading font-black text-5xl sm:text-6xl text-foreground mb-6 text-glow">
            HOẠT ĐỘNG{" "}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">CÔNG NGHỆ</span>
          </h1>
          <p className="text-xl text-foreground/80 max-w-4xl mx-auto text-pretty leading-relaxed">
            Tham gia các workshop, hackathon, seminar và sự kiện networking để nâng cao kiến thức và mở rộng mạng lưới
            trong <span className="text-accent font-bold">lĩnh vực fintech tiên tiến</span>
          </p>
        </div>
      </section>

      {/* Upcoming Activities */}
      {upcomingActivities.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-card/10 backdrop-blur-sm"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-4">
                  <Zap className="h-4 w-4 text-accent mr-2" />
                  <span className="text-sm font-bold text-accent uppercase tracking-wider">Upcoming Events</span>
                </div>
                <h2 className="font-heading font-black text-4xl text-foreground text-glow">SỰ KIỆN SẮP TỚI</h2>
              </div>
              <Badge className="bg-accent/20 text-accent border-accent/30 font-bold px-4 py-2 text-lg glow">
                {upcomingActivities.length} SỰ KIỆN
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {upcomingActivities.map((activity) => (
                <Card
                  key={activity.id}
                  className="relative group bg-card/20 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-500 hover:glow overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={activity.image || "/placeholder.svg"}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge className={`${getTypeColor(activity.type)} font-bold`}>{activity.type}</Badge>
                        <Badge className="bg-accent/20 text-accent border-accent/30 font-bold animate-pulse">
                          SẮP TỚI
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-heading font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                        {activity.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-foreground/70 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {activity.description}
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-foreground/80">
                          <Calendar className="h-4 w-4 mr-3 text-accent" />
                          {new Date(activity.date).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center text-sm text-foreground/80">
                          <Clock className="h-4 w-4 mr-3 text-accent" />
                          {activity.time}
                        </div>
                        <div className="flex items-center text-sm text-foreground/80">
                          <MapPin className="h-4 w-4 mr-3 text-accent" />
                          {activity.location}
                        </div>
                        <div className="flex items-center text-sm text-foreground/80">
                          <Users className="h-4 w-4 mr-3 text-accent" />
                          {activity.attendees}/{activity.maxAttendees} người tham gia
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {activity.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button className="w-full btn-futuristic font-bold">
                        ĐĂNG KÝ THAM GIA <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-4">
                <Calendar className="h-4 w-4 text-accent mr-2" />
                <span className="text-sm font-bold text-accent uppercase tracking-wider">Event History</span>
              </div>
              <h2 className="font-heading font-black text-4xl text-foreground text-glow">HOẠT ĐỘNG ĐÃ DIỄN RA</h2>
            </div>
            <Badge
              variant="secondary"
              className="bg-accent/10 text-accent border-accent/30 font-bold px-4 py-2 text-lg"
            >
              {pastActivities.length} SỰ KIỆN
            </Badge>
          </div>

          <div className="relative">
            {/* Enhanced timeline line with glow effect */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent/50 via-accent/30 to-accent/50 transform md:-translate-x-0.5 glow"></div>

            <div className="space-y-12">
              {pastActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Enhanced timeline dot with animation */}
                  <div className="absolute left-4 md:left-1/2 w-6 h-6 bg-gradient-to-br from-accent to-secondary rounded-full transform -translate-x-1/2 z-10 glow animate-pulse border-2 border-accent/30"></div>

                  {/* Content */}
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                    <Card className="ml-12 md:ml-0 bg-card/20 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-500 hover:glow group">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                      <div className="relative z-10 flex flex-col sm:flex-row">
                        <div className="sm:w-1/3">
                          <img
                            src={activity.image || "/placeholder.svg"}
                            alt={activity.title}
                            className="w-full h-32 sm:h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="sm:w-2/3 p-6">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={`${getTypeColor(activity.type)} font-bold`}>{activity.type}</Badge>
                            <span className="text-sm text-foreground/60 font-mono">
                              {new Date(activity.date).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                          <h3 className="font-heading font-bold text-xl mb-3 line-clamp-2 text-foreground group-hover:text-accent transition-colors duration-300">
                            {activity.title}
                          </h3>
                          <p className="text-foreground/70 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {activity.description}
                          </p>

                          <div className="flex items-center text-sm text-foreground/80 mb-4">
                            <Users className="h-4 w-4 mr-2 text-accent" />
                            <span className="font-bold">{activity.attendees}</span> người tham gia
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {activity.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="outline"
                                className="text-xs bg-accent/10 border-accent/30 text-accent"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-accent/20 via-transparent to-secondary/20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent/10 rounded-full animate-pulse"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/20 border border-accent/40 mb-8 glow">
            <Rocket className="h-5 w-5 text-accent mr-3" />
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Join The Movement</span>
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-foreground mb-6 text-glow">
            ĐỪNG BỎ LỠ CÁC SỰ KIỆN TIẾP THEO
          </h2>
          <p className="text-xl text-foreground/80 mb-12 leading-relaxed max-w-2xl mx-auto">
            Theo dõi và đăng ký tham gia các hoạt động để cập nhật kiến thức và kết nối với
            <span className="text-accent font-bold"> cộng đồng fintech tiên phong</span>
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
