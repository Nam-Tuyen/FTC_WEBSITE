"use client"

import { type NextPage } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/Button"
import { ApplicationDeadlineCheck } from "./countdown-timer"
import { RECRUITMENT_CONFIG } from "./constants"
import { UserPlus, ArrowRight } from "lucide-react"

const RecruitmentPage: NextPage = () => {
  // Sử dụng getStatus để kiểm tra trạng thái
  const status = RECRUITMENT_CONFIG.getStatus()
  const isApplicationOpen = status === "OPEN"

  return (
    <div className="min-h-screen bg-[#003663] text-white overflow-hidden">
      <Navigation />
      
      {/* Page Header */}
      <PageHeader
        title="ỨNG TUYỂN FTC"
        subtitle="Gia nhập câu lạc bộ Công nghệ Tài chính và trở thành một phần của cộng đồng fintech hàng đầu"
        showSocialMedia={false}
        badgeText="Cơ hội nghề nghiệp"
        badgeIcon={UserPlus}
        badgeColor="from-purple-500/20 to-pink-500/20"
        badgeBorderColor="border-purple-400/30"
        badgeIconColor="text-purple-400"
        badgeTextColor="text-purple-100"
        badgeShadowColor="shadow-purple-500/10"
      />

      {/* Call to Action Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6 sm:space-y-8">
            {status === "OPEN" ? (
              <>
                <a 
                  href={RECRUITMENT_CONFIG.formUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block group w-full sm:w-auto"
                >
                  <div className="relative w-full">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <Button 
                      size="lg" 
                      className="relative w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-background hover:bg-background/90 border-0 shadow-xl"
                    >
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                        Nộp đơn ngay
                      </span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
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
      </section>

      {/* Features Section with Modern Cards */}
      <section className="relative py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/80 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1: Networking */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="relative p-6 sm:p-8 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 sm:h-8 sm:w-8 text-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">NETWORKING</h3>
                <p className="text-sm sm:text-base text-muted-foreground/80 leading-relaxed">
                  Kết nối với cộng đồng sinh viên và chuyên gia trong lĩnh vực Fintech
                </p>
              </div>
            </div>

            {/* Feature 2: Learning */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="relative p-6 sm:p-8 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 sm:h-8 sm:w-8 text-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">HỌC TẬP & PHÁT TRIỂN</h3>
                <p className="text-sm sm:text-base text-muted-foreground/80 leading-relaxed">
                  Cơ hội học hỏi qua các workshop, training và dự án thực tế
                </p>
              </div>
            </div>

            {/* Feature 3: Career */}
            <div className="group relative sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="relative p-6 sm:p-8 bg-background/40 backdrop-blur-lg rounded-2xl border border-primary/10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative w-full h-full bg-background/50 rounded-xl flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 sm:h-8 sm:w-8 text-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CƠ HỘI NGHỀ NGHIỆP</h3>
                <p className="text-sm sm:text-base text-muted-foreground/80 leading-relaxed">
                  Tiếp cận với các cơ hội thực tập và việc làm trong ngành Fintech
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add animation keyframes */}
      <Footer />

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
