import React from "react"
import { Navigation } from "@/components/navigation"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 text-foreground">
      <Navigation />

      <main className="max-w-6xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <section className="relative rounded-3xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-md border border-white/10 p-10 shadow-xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Câu lạc bộ Công nghệ Tài chính</h1>
            <p className="text-lg text-muted-foreground mb-6">Chào mừng đến với website chính thức của FTC — nơi kết nối những người đam mê FinTech, chia sẻ kiến thức và tổ chức sự kiện chuyên sâu.</p>
            <div className="flex flex-wrap gap-3">
              <a href="/co-cau" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow hover:scale-[1.02] transition-transform">Tìm hiểu cơ cấu</a>
              <a href="/ung-tuyen" className="inline-block px-6 py-3 border border-white/10 text-white/90 rounded-2xl hover:bg-white/5 transition-colors">Đăng ký tham gia</a>
            </div>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-2">Hoạt động</h2>
            <p className="text-sm text-white/80">Workshop, talkshow, và các dự án thực tế nhằm giúp thành viên phát triển kỹ năng.</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-2">Thành tích</h2>
            <p className="text-sm text-white/80">Các cuộc thi, dự án và thành tựu của câu lạc bộ trong và ngoài nước.</p>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 text-center text-white/70">©2025. Câu lạc bộ Công nghệ Tài chính</div>
      </footer>
    </div>
  )
}
