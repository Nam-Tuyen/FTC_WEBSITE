"use client"

import { type NextPage } from "next"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { ApplicationDeadlineCheck } from "./countdown-timer"
import { RECRUITMENT_CONFIG } from "./constants"

const RecruitmentPage: NextPage = () => {
  // Sử dụng getStatus để kiểm tra trạng thái
  const status = RECRUITMENT_CONFIG.getStatus()
  const isApplicationOpen = status === "OPEN"

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-hidden">
      <Navigation />
      
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[80vh] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl" 
            style={{ animation: "float 20s ease-in-out infinite" }}
          />
          <div 
            className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl"
            style={{ animation: "float 20s ease-in-out infinite reverse" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.05),transparent)] pointer-events-none"
            style={{ animation: "pulse 8s infinite" }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center space-y-8">
            {/* Main Title with Co Cau Page Style */}
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-50 blur-2xl animate-pulse"></span>
              <span className="relative text-white animate-bounce" style={{
                animation: 'blink 1.5s infinite, gradient-shift 2s ease-in-out infinite, bounce 2s infinite'
              }}>
                GIA NHẬP CÂU LẠC BỘ FTC
              </span>
            </h1>
            
            {/* Simple Italicized Subtitle */}
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto italic">
              Chúng mình đang tìm kiếm những người bạn đam mê công nghệ và tài chính, 
              sẵn sàng học hỏi và phát triển cùng FTC.
            </p>

            {/* Call to Action Section */}
            <div className="mt-12 space-y-8">
              {status === "OPEN" ? (
                <>
                  <a 
                    href={RECRUITMENT_CONFIG.formUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block group"
                  >
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <Button 
                        size="lg" 
                        className="relative px-8 py-6 text-lg bg-background hover:bg-background/90 border-0 shadow-xl"
                      >
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
                          Nộp đơn ngay
                        </span>
                      </Button>
                    </div>
                  </a>
                  <ApplicationDeadlineCheck recruitmentStatus={status} />
                </>
              ) : (
                <ApplicationDeadlineCheck recruitmentStatus={status} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Modern Cards */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/80 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Networking */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="relative p-8 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10">
                <div className="w-16 h-16 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8 text-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">NETWORKING</h3>
                <p className="text-muted-foreground/80">
                  Kết nối với cộng đồng sinh viên và chuyên gia trong lĩnh vực Fintech
                </p>
              </div>
            </div>

            {/* Feature 2: Learning */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="relative p-8 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10">
                <div className="w-16 h-16 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8 text-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">HỌC TẬP & PHÁT TRIỂN</h3>
                <p className="text-muted-foreground/80">
                  Cơ hội học hỏi qua các workshop, training và dự án thực tế
                </p>
              </div>
            </div>

            {/* Feature 3: Career */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="relative p-8 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10">
                <div className="w-16 h-16 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8 text-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CƠ HỘI NGHỀ NGHIỆP</h3>
                <p className="text-muted-foreground/80">
                  Tiếp cận với các cơ hội thực tập và việc làm trong ngành Fintech
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes shimmer {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  )
}

export default RecruitmentPage
