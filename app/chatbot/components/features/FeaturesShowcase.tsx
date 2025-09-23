import React from 'react'
import { BRAND } from '../../constants'
import { cn } from '../../lib'

/**
 * Features Showcase Component
 * Displays key features of the chatbot in the sidebar
 */
export function FeaturesShowcase() {
  const features = [
    {
      icon: "🧠",
      title: "AI thông minh",
      description: "Hiểu ngữ cảnh và phản hồi mạch lạc",
      color: BRAND.primary
    },
    {
      icon: "🌍",
      title: "Cập nhật kịp thời",
      description: "Kiến thức FinTech tổng quan (demo)",
      color: BRAND.secondary
    },
    {
      icon: "💬",
      title: "Đa chế độ chat",
      description: "Câu lạc bộ & FinTech",
      color: BRAND.primary
    }
  ]

  return (
    <div className={cn(
      "rounded-3xl border p-6",
      BRAND.shadows.xl,
      BRAND.borders.glow,
      BRAND.surfaces.card
    )}>
      <h3 className={cn(
        "font-semibold mb-4 flex items-center gap-2",
        BRAND.text.primary
      )}>
        <span className={`text-[${BRAND.primary}] text-lg`}>⚡</span>
        Tính năng nổi bật
      </h3>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </div>
    </div>
  )
}

/**
 * Individual Feature Item Component
 */
interface FeatureItemProps {
  icon: string
  title: string
  description: string
  color: string
}

function FeatureItem({ icon, title, description, color }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
        BRAND.gradients.soft
      )}>
        <span className={`text-[${color}] text-lg`}>{icon}</span>
      </div>
      <div>
        <p className={cn("font-medium text-sm", BRAND.text.primary)}>
          {title}
        </p>
        <p className={cn("text-xs", BRAND.text.muted)}>
          {description}
        </p>
      </div>
    </div>
  )
}

/**
 * Stats Component
 * Displays statistics about the chatbot usage
 */
export function StatsShowcase() {
  const stats = [
    { value: "1,234+", label: "Câu hỏi đã giải đáp" },
    { value: "98%", label: "Độ hài lòng" }
  ]

  return (
    <div className={cn(
      "rounded-3xl text-white p-6",
      BRAND.shadows.glow,
      BRAND.gradients.radial
    )}>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <span className="text-lg">✨</span>
        Thống kê hoạt động
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-white/80">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
        <p className="text-sm text-center">🚀 Tối ưu hóa bởi AI hiện đại</p>
      </div>
    </div>
  )
}
