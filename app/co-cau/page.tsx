import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Linkedin, Github, Users, Target, Briefcase } from "lucide-react"

const leadership = [
  {
    id: 1,
    name: "Nguyễn Minh Anh",
    position: "Chủ tịch",
    department: "Ban Chủ nhiệm",
    bio: "Sinh viên năm 4 ngành Công nghệ Thông tin, có 3 năm kinh nghiệm trong lĩnh vực fintech và blockchain.",
    image: "/club-president-professional-portrait.png",
    email: "president@fintechclub.vn",
    linkedin: "linkedin.com/in/nguyen-minh-anh",
    github: "github.com/minhanh-nguyen",
    achievements: ["Giải nhất Hackathon FinTech 2023", "Chứng chỉ Blockchain Developer"],
  },
  {
    id: 2,
    name: "Trần Thị Hương",
    position: "Phó Chủ tịch",
    department: "Ban Chủ nhiệm",
    bio: "Chuyên gia về AI và Machine Learning trong tài chính, có kinh nghiệm làm việc tại các startup fintech.",
    image: "/club-vice-president-professional-portrait.png",
    email: "vicepresident@fintechclub.vn",
    linkedin: "linkedin.com/in/tran-thi-huong",
    github: "github.com/huong-tran",
    achievements: ["Giải ba AI in Finance Competition", "Chứng chỉ AWS Machine Learning"],
  },
]

const departments = [
  {
    id: 1,
    name: "Ban Kỹ thuật",
    description: "Phát triển các dự án công nghệ, ứng dụng fintech và nghiên cứu công nghệ mới",
    icon: Target,
    color: "bg-primary/10 text-primary",
    members: [
      {
        name: "Lê Văn Đức",
        position: "Trưởng ban",
        image: "/tech-lead-developer-portrait.png",
        specialties: ["Blockchain", "Smart Contracts", "DeFi"],
      },
      {
        name: "Phạm Thị Mai",
        position: "Phó ban",
        image: "/tech-deputy-developer-portrait.png",
        specialties: ["Mobile Development", "Payment Integration", "API Design"],
      },
      {
        name: "Hoàng Minh Tuấn",
        position: "Thành viên",
        image: "/tech-member-developer-portrait.png",
        specialties: ["Frontend", "React", "TypeScript"],
      },
    ],
  },
  {
    id: 2,
    name: "Ban Truyền thông",
    description: "Quản lý nội dung, marketing, social media và các hoạt động truyền thông của câu lạc bộ",
    icon: Users,
    color: "bg-accent/10 text-accent",
    members: [
      {
        name: "Vũ Thị Lan",
        position: "Trưởng ban",
        image: "/marketing-lead-portrait.png",
        specialties: ["Content Marketing", "Social Media", "Brand Strategy"],
      },
      {
        name: "Đỗ Minh Khôi",
        position: "Phó ban",
        image: "/marketing-deputy-portrait.png",
        specialties: ["Graphic Design", "Video Production", "Photography"],
      },
    ],
  },
  {
    id: 3,
    name: "Ban Sự kiện",
    description: "Tổ chức các workshop, hackathon, seminar và các hoạt động giao lưu của câu lạc bộ",
    icon: Briefcase,
    color: "bg-chart-3/10 text-chart-3",
    members: [
      {
        name: "Ngô Thành Long",
        position: "Trưởng ban",
        image: "/events-lead-organizer-portrait.png",
        specialties: ["Event Planning", "Project Management", "Partnership"],
      },
      {
        name: "Bùi Thị Hoa",
        position: "Phó ban",
        image: "/events-deputy-organizer-portrait.png",
        specialties: ["Logistics", "Venue Management", "Catering"],
      },
    ],
  },
  {
    id: 4,
    name: "Ban Đối ngoại",
    description: "Xây dựng mối quan hệ với các doanh nghiệp, tổ chức và tìm kiếm cơ hội hợp tác",
    icon: Target,
    color: "bg-chart-4/10 text-chart-4",
    members: [
      {
        name: "Lý Minh Hải",
        position: "Trưởng ban",
        image: "/external-relations-lead-portrait.png",
        specialties: ["Business Development", "Partnership", "Networking"],
      },
      {
        name: "Trịnh Thị Thu",
        position: "Phó ban",
        image: "/external-relations-deputy-portrait.png",
        specialties: ["Corporate Relations", "Sponsorship", "Communication"],
      },
    ],
  },
]

const advisors = [
  {
    name: "TS. Nguyễn Văn Hùng",
    position: "Cố vấn học thuật",
    organization: "Đại học Bách Khoa Hà Nội",
    image: "/academic-advisor-professor-portrait.png",
    expertise: "Blockchain, Cryptocurrency, Financial Technology",
  },
  {
    name: "Ông Trần Minh Quân",
    position: "Cố vấn doanh nghiệp",
    organization: "CEO - VietFintech Solutions",
    image: "/business-advisor-ceo-portrait.png",
    expertise: "Digital Banking, Payment Systems, Startup Strategy",
  },
]

export default function OrganizationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-foreground mb-6">
            Cơ cấu <span className="text-primary">Tổ chức</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Đội ngũ lãnh đạo và các ban chức năng của Câu lạc bộ Công nghệ Tài chính, cùng nhau xây dựng cộng đồng
            fintech mạnh mẽ
          </p>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-foreground mb-8 text-center">Ban Chủ nhiệm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leadership.map((leader) => (
              <Card key={leader.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={leader.image || "/placeholder.svg"}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-xl font-heading">{leader.name}</CardTitle>
                  <Badge className="mx-auto w-fit bg-primary text-primary-foreground">{leader.position}</Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 text-center">{leader.bio}</p>

                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-sm">Thành tích nổi bật:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {leader.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-center space-x-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${leader.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://${leader.linkedin}`} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://${leader.github}`} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-foreground mb-8 text-center">Các Ban Chức năng</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {departments.map((dept) => (
              <Card key={dept.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${dept.color}`}>
                      <dept.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-heading">{dept.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {dept.members.length} thành viên
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{dept.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {dept.members.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{member.name}</h4>
                          <p className="text-xs text-muted-foreground mb-1">{member.position}</p>
                          <div className="flex flex-wrap gap-1">
                            {member.specialties.slice(0, 2).map((specialty, specIndex) => (
                              <Badge key={specIndex} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-foreground mb-8 text-center">Ban Cố vấn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {advisors.map((advisor, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <img
                    src={advisor.image || "/placeholder.svg"}
                    alt={advisor.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="font-heading font-semibold text-lg mb-1">{advisor.name}</h3>
                  <p className="text-primary font-medium text-sm mb-1">{advisor.position}</p>
                  <p className="text-muted-foreground text-sm mb-3">{advisor.organization}</p>
                  <p className="text-xs text-muted-foreground">{advisor.expertise}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Tham gia đội ngũ của chúng tôi
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Chúng tôi luôn tìm kiếm những thành viên tài năng và đam mê để cùng xây dựng cộng đồng fintech
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href="/ung-tuyen">Ứng tuyển ngay</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/hoat-dong">Xem hoạt động</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
