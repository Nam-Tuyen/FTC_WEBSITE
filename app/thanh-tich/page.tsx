'use client'

import { Navigation } from "@/components/navigation"

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-[#003663] text-white overflow-hidden">
      <Navigation />

      {/* Mobile Responsive Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
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
        </div>

        <div className="relative max-w-6xl mx-auto text-center space-y-4 sm:space-y-6 lg:space-y-8">
          <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold">
            <span className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-50 blur-2xl animate-pulse"></span>
            <span className="relative text-white animate-bounce" style={{
              animation: 'blink 1.5s infinite, gradient-shift 2s ease-in-out infinite, bounce 2s infinite'
            }}>
              THÀNH TÍCH NỔI BẬT
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground leading-relaxed max-w-4xl mx-auto italic px-4">
            Thành tích nổi bật của câu lạc bộ trong thời gian qua
          </p>
        </div>
      </section>

      {/* Main Content Sections (giữ lại) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Niềm Tự Hào Section */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all"></div>
            <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    NIỀM TỰ HÀO CỦA TUỔI TRẺ UEL
                  </h3>
                  <div className="space-y-4">
                    <p className="text-lg text-muted-foreground/90 leading-relaxed text-justify">
                      Câu lạc bộ Công nghệ tài chính (FTC) luôn gắn liền hành trình phát triển của tuổi trẻ Trường Đại học Kinh tế – Luật với những trải nghiệm đáng nhớ và thành tích nổi bật. Trong năm học 2024 – 2025, FTC đã vinh dự được Ban Cán sự Đoàn Đại học Quốc gia TP.HCM trao tặng Giấy khen vì những đóng góp tích cực trong công tác Đoàn và phong trào thanh niên.
                    </p>
                    <p className="text-lg text-muted-foreground/90 leading-relaxed text-justify">
                      FTC không chỉ tổ chức các hoạt động học thuật và ngoại khóa bổ ích mà còn tạo dựng một môi trường rèn luyện, kết nối và lan tỏa tinh thần tích cực.
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 rounded-2xl overflow-hidden border border-primary/10 hover:shadow-lg transition-shadow duration-300">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2F4540def63fb249718e9bbaf2d10ebfdc?format=webp&width=1600"
                    alt="Giấy khen ĐHQG"
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* I-Star Section */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all"></div>
            <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-8">
              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="flex-1 space-y-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    DẤU ẤN TẠI GIẢI THƯỞNG I-STAR
                  </h3>
                  <div className="space-y-4">
                    <p className="text-lg text-muted-foreground/90 leading-relaxed text-justify">
                      FTC vinh dự nằm trong Top 10 tổ chức, cá nhân tiêu biểu Nhóm 4 tại Giải thưởng Đổi mới sáng tạo và Khởi nghiệp TP.HCM (I-Star). Đây là giải thưởng uy tín do Ủy ban Nhân dân TP.HCM chủ trì và Sở Khoa học và Công nghệ TP.HCM tổ chức.
                    </p>
                    <p className="text-lg text-muted-foreground/90 leading-relaxed text-justify">
                      Với định hướng "bệ phóng cho những ý tưởng đổi mới", FTC triển khai nhiều chương trình thiết thực như cuộc thi học thuật, đào tạo, workshop và talkshow để giúp sinh viên tiếp cận kiến thức chuyên sâu về công nghệ tài chính và khởi nghiệp sáng tạo.
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 rounded-2xl overflow-hidden border border-primary/10 hover:shadow-lg transition-shadow duration-300">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fa0639610e72c4f2e81f569a8823b8f03%2Ff2b809cb40ef46d9867dc037c5d33b65?format=webp&width=1600"
                    alt="I-Star Top10"
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* I-Star Certificate Image (added) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform transition-all"></div>
            <div className="relative bg-background/40 backdrop-blur-lg rounded-3xl border border-primary/10 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2 rounded-2xl overflow-hidden border border-primary/10 hover:shadow-lg transition-shadow duration-300">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F28c01978106541d5baa7b8a043c11d9b%2F7345f41f834d4a34b2ad9918af6fb722?format=webp&width=1600"
                    alt="Giấy chứng nhận I-Star Top 10"
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">GIẤY CHỨNG NHẬN I-STAR</h3>
                  <p className="text-lg text-muted-foreground/90 leading-relaxed text-justify">Giấy chứng nhận Top 10 I-Star ghi nhận thành tích và đóng góp của FTC trong hoạt động đổi mới sáng tạo và khởi nghiệp. Đây là minh chứng cho nỗ lực của câu lạc bộ trong việc thúc đẩy sáng tạo và hỗ trợ sinh viên thực hiện dự án thực tế.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
        .animate-text-shine {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
