'use client'

import { Facebook, Instagram, Linkedin, Sparkles } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle: string
  showSocialMedia?: boolean
  badgeText?: string
  badgeIcon?: React.ComponentType<{ className?: string }>
  badgeColor?: string
  badgeBorderColor?: string
  badgeIconColor?: string
  badgeTextColor?: string
  badgeShadowColor?: string
}

export function PageHeader({ 
  title, 
  subtitle, 
  showSocialMedia = true, 
  badgeText = "Cộng đồng FinTech hàng đầu",
  badgeIcon: BadgeIcon = Sparkles,
  badgeColor = "from-green-500/20 to-emerald-500/20",
  badgeBorderColor = "border-green-400/30",
  badgeIconColor = "text-green-400",
  badgeTextColor = "text-green-100",
  badgeShadowColor = "shadow-green-500/10"
}: PageHeaderProps) {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl animate-float-reverse" />
      </div>

      <div className="relative max-w-6xl mx-auto text-center space-y-4 sm:space-y-6 lg:space-y-8">
        <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold">
          <span className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-50 blur-2xl animate-pulse"></span>
          <span className="relative text-white animate-bounce" style={{
            animation: 'blink 1.5s infinite, gradient-shift 2s ease-in-out infinite, bounce 2s infinite'
          }}>
            {title}
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto italic px-4">
          {subtitle}
        </p>

        {/* Social Media Badges - 3 logos centered */}
        {showSocialMedia && (
          <div className="mt-8 flex justify-center items-center gap-6">
            <a
              href="https://www.facebook.com/clbfintechuel"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <Facebook className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://www.instagram.com/ftcers/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
            >
              <Instagram className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://www.linkedin.com/company/ftc-financial-technology-club/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-700/25"
            >
              <Linkedin className="w-6 h-6 text-white" />
            </a>
          </div>
        )}

        {/* Modern Badge */}
        <div className="mt-8 relative">
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${badgeColor} backdrop-blur-md border ${badgeBorderColor} rounded-full px-6 py-3 shadow-lg ${badgeShadowColor}`}>
            <BadgeIcon className={`w-5 h-5 ${badgeIconColor}`} />
            <span className={`text-sm font-semibold ${badgeTextColor}`}>{badgeText}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
