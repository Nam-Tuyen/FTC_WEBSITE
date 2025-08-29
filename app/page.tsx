import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Code, Database, Shield, Zap, Brain, Rocket, Globe } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent/20 rounded-full animate-spin"
            style={{ animationDuration: "20s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/10 rounded-full animate-spin"
            style={{ animationDuration: "15s", animationDirection: "reverse" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/20 border border-accent/40 mb-8 glow">
              <Zap className="h-5 w-5 text-accent mr-3 animate-pulse" />
              <span className="text-sm font-bold text-accent uppercase tracking-wider">BẠN ĐÃ SẴN SÀNG CHƯA?</span>
            </div>

            <h1 className="font-heading font-black text-5xl sm:text-6xl text-foreground mb-8 text-balance text-glow lg:text-7xl tracking-wide leading-[6. rem] leading-[4.5.rem]">
              CÂU LẠC BỘ <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent animate-pulse">
                CÔNG NGHỆ - TÀI CHÍNH
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-foreground/80 mb-12 max-w-4xl mx-auto text-pretty font-medium leading-relaxed">
              {""}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                asChild
                size="lg"
                className="btn-futuristic text-lg px-10 py-4 font-bold shadow-2xl hover:shadow-accent/50 transition-all duration-300"
              >
                <Link href="/ung-tuyen">
                  THÔNG TIN VỀ CÂU LẠC BỘ <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-card/10 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "THÀNH VIÊN", icon: Users },
              { number: "50+", label: "DỰ ÁN", icon: Rocket },
              { number: "25+", label: "ĐỐI TÁC", icon: Globe },
              { number: "100+", label: "SỰ KIỆN", icon: Zap },
            ].map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl flex items-center justify-center glow group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="h-10 w-10 text-accent" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-accent/30 rounded-2xl animate-pulse"></div>
                  </div>
                  <div className="text-4xl font-black text-accent mb-2 text-glow">{stat.number}</div>
                  <div className="text-sm font-bold text-foreground/80 uppercase tracking-widest">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
              <Brain className="h-4 w-4 text-accent mr-2" />
              <span className="text-sm font-bold text-accent uppercase tracking-wider">Advanced Features</span>
            </div>
            <h2 className="font-heading font-black text-4xl sm:text-5xl text-foreground mb-6 text-glow">
              TẠI SAO CHỌN FTC?
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-medium leading-relaxed">
              Chúng tôi mang đến hệ sinh thái công nghệ tài chính hoàn chỉnh với những công cụ và cơ hội tiên tiến nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Code,
                title: "AI & BLOCKCHAIN",
                description: "Nghiên cứu và phát triển các giải pháp AI, blockchain và smart contracts tiên tiến",
                gradient: "from-accent/20 to-secondary/20",
              },
              {
                icon: Users,
                title: "CỘNG ĐỒNG ELITE",
                description: "Kết nối với các chuyên gia hàng đầu và startup unicorn trong lĩnh vực fintech",
                gradient: "from-secondary/20 to-accent/20",
              },
              {
                icon: Database,
                title: "REAL-TIME PROJECTS",
                description: "Tham gia các dự án thực tế với dữ liệu tài chính real-time và API banking",
                gradient: "from-accent/20 to-secondary/20",
              },
              {
                icon: Shield,
                title: "CAREER ACCELERATION",
                description: "Chương trình mentorship và kết nối trực tiếp với các công ty fintech hàng đầu",
                gradient: "from-secondary/20 to-accent/20",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="relative group bg-card/20 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-500 hover:glow overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${feature.gradient.replace("from-", "").replace("to-", ", ")})`,
                    }}
                  ></div>
                  <CardContent className="relative z-10 p-8 text-center">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 glow group-hover:scale-110 transition-all duration-300`}
                    >
                      <IconComponent className="h-10 w-10 text-accent" />
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-4 text-foreground uppercase tracking-wide">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/70 font-medium leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-accent/20 via-transparent to-secondary/20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-accent/10 rounded-full animate-pulse"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/20 border border-accent/40 mb-8 glow">
            <Rocket className="h-5 w-5 text-accent mr-3" />
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Join The Revolution</span>
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-foreground mb-6 text-glow">
            KHỞI ĐẦU HÀNH TRÌNH FINTECH
          </h2>
          <p className="text-xl text-foreground/80 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            Trở thành một phần của cộng đồng tiên phong trong việc định hình tương lai của công nghệ tài chính
          </p>
          <Button
            asChild
            size="lg"
            className="btn-futuristic text-xl px-12 py-6 font-bold shadow-2xl hover:shadow-accent/50 transition-all duration-300"
          >
            <Link href="/ung-tuyen">
              BẮT ĐẦU NGAY HÔM NAY <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/10 backdrop-blur-sm border-t border-accent/20 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-black text-lg">FT</span>
                </div>
                <span className="font-sans font-black text-xl text-foreground">FinTech Club</span>
              </div>
              <p className="text-muted-foreground mb-4 font-medium">
                Câu lạc bộ Công nghệ Tài chính - Nơi khởi nguồn của những ý tưởng fintech sáng tạo
              </p>
            </div>

            <div>
              <h3 className="font-sans font-bold text-foreground mb-4">Liên kết</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/thanh-tich"
                    className="text-muted-foreground hover:text-primary font-medium transition-colors"
                  >
                    Thành tích
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hoat-dong"
                    className="text-muted-foreground hover:text-primary font-medium transition-colors"
                  >
                    Hoạt động
                  </Link>
                </li>
                <li>
                  <Link
                    href="/co-cau"
                    className="text-muted-foreground hover:text-primary font-medium transition-colors"
                  >
                    Cơ cấu
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-sans font-bold text-foreground mb-4">Tham gia</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dien-dan"
                    className="text-muted-foreground hover:text-primary font-medium transition-colors"
                  >
                    Diễn đàn
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ung-tuyen"
                    className="text-muted-foreground hover:text-primary font-medium transition-colors"
                  >
                    Ứng tuyển
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chatbot"
                    className="text-muted-foreground hover:text-primary font-medium transition-colors"
                  >
                    Chatbot
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground font-medium">
              © 2024 Câu lạc bộ Công nghệ Tài chính. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
