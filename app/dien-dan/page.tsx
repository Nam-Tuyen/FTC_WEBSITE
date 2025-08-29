import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageSquare,
  Users,
  Search,
  Plus,
  TrendingUp,
  Code,
  Briefcase,
  Lightbulb,
  HelpCircle,
  Pin,
  Heart,
  Reply,
} from "lucide-react"

const categories = [
  {
    id: 1,
    name: "Thảo luận chung",
    description: "Thảo luận về các chủ đề fintech tổng quát",
    icon: MessageSquare,
    color: "bg-primary/10 text-primary",
    threads: 45,
    posts: 234,
    lastActivity: "2 phút trước",
  },
  {
    id: 2,
    name: "Câu hỏi kỹ thuật",
    description: "Hỏi đáp về lập trình, blockchain, AI trong fintech",
    icon: Code,
    color: "bg-accent/10 text-accent",
    threads: 32,
    posts: 156,
    lastActivity: "15 phút trước",
  },
  {
    id: 3,
    name: "Cơ hội việc làm",
    description: "Chia sẻ thông tin tuyển dụng và cơ hội nghề nghiệp",
    icon: Briefcase,
    color: "bg-chart-3/10 text-chart-3",
    threads: 18,
    posts: 67,
    lastActivity: "1 giờ trước",
  },
  {
    id: 4,
    name: "Showcase dự án",
    description: "Trình bày và thảo luận về các dự án fintech",
    icon: Lightbulb,
    color: "bg-chart-4/10 text-chart-4",
    threads: 25,
    posts: 89,
    lastActivity: "3 giờ trước",
  },
]

const featuredThreads = [
  {
    id: 1,
    title: "Xu hướng DeFi 2024: Những điều cần biết",
    author: {
      name: "Nguyễn Minh Anh",
      avatar: "/forum-user-avatar-1.png",
      role: "Chủ tịch CLB",
    },
    category: "Thảo luận chung",
    replies: 23,
    views: 156,
    likes: 45,
    lastReply: "5 phút trước",
    isPinned: true,
    excerpt:
      "DeFi đang phát triển mạnh mẽ với nhiều xu hướng mới. Hãy cùng thảo luận về những cơ hội và thách thức trong năm 2024...",
  },
  {
    id: 2,
    title: "Cách tích hợp API thanh toán VNPay vào React app",
    author: {
      name: "Lê Văn Đức",
      avatar: "/forum-user-avatar-2.png",
      role: "Trưởng ban Kỹ thuật",
    },
    category: "Câu hỏi kỹ thuật",
    replies: 12,
    views: 89,
    likes: 18,
    lastReply: "1 giờ trước",
    isPinned: false,
    excerpt: "Mình đang gặp khó khăn khi tích hợp VNPay API. Có ai đã làm qua có thể chia sẻ kinh nghiệm không?",
  },
  {
    id: 3,
    title: "[Tuyển dụng] Frontend Developer - Startup Fintech",
    author: {
      name: "Trần Thị Hương",
      avatar: "/forum-user-avatar-3.png",
      role: "Phó Chủ tịch CLB",
    },
    category: "Cơ hội việc làm",
    replies: 8,
    views: 67,
    likes: 12,
    lastReply: "2 giờ trước",
    isPinned: false,
    excerpt:
      "Startup fintech đang tìm Frontend Developer có kinh nghiệm React/Next.js. Lương hấp dẫn, môi trường năng động...",
  },
  {
    id: 4,
    title: "Demo: Ứng dụng quản lý chi tiêu cá nhân với AI",
    author: {
      name: "Phạm Thị Mai",
      avatar: "/forum-user-avatar-4.png",
      role: "Thành viên",
    },
    category: "Showcase dự án",
    replies: 15,
    views: 134,
    likes: 28,
    lastReply: "4 giờ trước",
    isPinned: false,
    excerpt:
      "Mình vừa hoàn thành ứng dụng quản lý chi tiêu sử dụng AI để phân loại và dự đoán. Mọi người xem và góp ý nhé!",
  },
]

const recentActivity = [
  {
    user: "Hoàng Minh Tuấn",
    action: "đã trả lời trong",
    thread: "Smart Contract Security Best Practices",
    time: "2 phút trước",
    avatar: "/forum-user-avatar-5.png",
  },
  {
    user: "Vũ Thị Lan",
    action: "đã tạo chủ đề mới",
    thread: "Marketing Strategy cho FinTech Startup",
    time: "15 phút trước",
    avatar: "/forum-user-avatar-6.png",
  },
  {
    user: "Đỗ Minh Khôi",
    action: "đã like bài viết",
    thread: "Blockchain trong Banking",
    time: "30 phút trước",
    avatar: "/forum-user-avatar-7.png",
  },
]

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-foreground mb-6">
              Diễn đàn <span className="text-primary">Thảo luận</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối với nhau
            </p>
          </div>

          {/* Search and New Thread */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm chủ đề, bài viết..." className="pl-10" />
            </div>
            <Button className="sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Tạo chủ đề mới
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Categories */}
            <section>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-6">Danh mục thảo luận</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                          <category.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-lg mb-1">{category.name}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{category.threads} chủ đề</span>
                            <span>{category.posts} bài viết</span>
                            <span>Hoạt động: {category.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Featured Threads */}
            <section>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-6">Chủ đề nổi bật</h2>
              <div className="space-y-4">
                {featuredThreads.map((thread) => (
                  <Card key={thread.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={thread.author.avatar || "/placeholder.svg"} alt={thread.author.name} />
                          <AvatarFallback>{thread.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {thread.isPinned && <Pin className="h-4 w-4 text-primary" />}
                            <h3 className="font-heading font-semibold text-lg hover:text-primary transition-colors">
                              {thread.title}
                            </h3>
                          </div>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{thread.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <span className="text-sm font-medium">{thread.author.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {thread.author.role}
                                </Badge>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {thread.category}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Reply className="h-4 w-4" />
                                <span>{thread.replies}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{thread.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4" />
                                <span>{thread.likes}</span>
                              </div>
                              <span>{thread.lastReply}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Forum Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading">Thống kê diễn đàn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tổng chủ đề</span>
                  <span className="font-semibold">120</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tổng bài viết</span>
                  <span className="font-semibold">546</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Thành viên tích cực</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hoạt động hôm nay</span>
                  <span className="font-semibold">23</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading">Hoạt động gần đây</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                      <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        <span className="font-medium hover:text-primary cursor-pointer">{activity.thread}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading">Hành động nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Tạo chủ đề mới
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Đặt câu hỏi
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Xem xu hướng
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
