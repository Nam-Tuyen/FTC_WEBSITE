'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface HeroProps {
  search: string
  onSearchChange: (value: string) => void
}

export function Hero({ search, onSearchChange }: HeroProps) {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl"
          style={{ animation: 'float 20s ease-in-out infinite' }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl"
          style={{ animation: 'float 20s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.05),transparent)] pointer-events-none"
          style={{ animation: 'pulse 8s infinite' }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center space-y-8">
          <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-50 blur-2xl animate-pulse" />
            <span className="relative text-white animate-bounce" style={{
              animation: 'blink 1.5s infinite, gradient-shift 2s ease-in-out infinite, bounce 2s infinite'
            }}>
              DIỄN ĐÀN FTC
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto italic">
            Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối với nhau
          </p>

          <div className="relative max-w-3xl mx-auto mt-12">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-75" />
              <div className="relative bg-slate-800/40 backdrop-blur-sm rounded-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Tìm kiếm câu hỏi, nội dung..."
                  className="pl-12 bg-transparent border-primary/20 h-12"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
