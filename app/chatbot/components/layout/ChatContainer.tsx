import React from 'react'
import { BRAND } from '../../constants'
import { cn } from '../../lib'

interface ChatContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * Chat Container Component
 * Provides the main layout structure for the chat interface
 */
export function ChatContainer({ children, className }: ChatContainerProps) {
  return (
    <div className={cn(
      "relative flex flex-col h-[600px] sm:h-[700px] rounded-3xl overflow-hidden",
      BRAND.borders.glow,
      "border",
      BRAND.surfaces.darkGlass,
      BRAND.shadows.glow,
      className
    )}>
      {children}
    </div>
  )
}

/**
 * Chat Header Component
 */
interface ChatHeaderProps {
  title?: string
  subtitle?: string
  onlineStatus?: boolean
}

export function ChatHeader({ 
  title = "FTC Chatbot", 
  subtitle = "AI Assistant",
  onlineStatus = true
}: ChatHeaderProps) {
  return (
    <div className={cn(
      "shrink-0 px-4 py-3 flex items-center justify-between",
      BRAND.borders.glass,
      "border-b",
      BRAND.surfaces.glass
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center",
          BRAND.gradients.radial
        )}>
          <span className="text-white text-lg">🤖</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-xs text-white/70">{subtitle}</p>
        </div>
      </div>
      
      <div className="text-sm text-white/70 flex items-center gap-1">
        {onlineStatus && <span className="text-green-400">🟢</span>}
        {onlineStatus ? "Online" : "Offline"}
      </div>
    </div>
  )
}

/**
 * Chat Messages Area Component
 */
interface ChatMessagesProps {
  children: React.ReactNode
  isEmpty?: boolean
}

export function ChatMessages({ children, isEmpty = false }: ChatMessagesProps) {
  return (
    <div className={cn(
      "flex-1 overflow-y-auto px-6 py-4",
      BRAND.gradients.surface
    )} id="chat-scroll-area">
      {isEmpty ? (
        <WelcomeMessage />
      ) : (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </div>
  )
}

/**
 * Welcome Message Component
 */
function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <div className={cn(
        "w-24 h-24 rounded-3xl flex items-center justify-center mb-6",
        BRAND.gradients.radial,
        BRAND.shadows.glow
      )}>
        <span className="text-white text-4xl">✨</span>
      </div>
      <h3 className={cn("text-2xl font-bold mb-2", BRAND.text.primary)}>
        Chào mừng đến với FTC Assistant! 👋
      </h3>
      <p className={cn("max-w-md leading-relaxed", BRAND.text.muted)}>
        Tôi là trợ lý AI, sẵn sàng giúp bạn tìm hiểu về câu lạc bộ FTC và kiến thức công nghệ tài chính.
      </p>
    </div>
  )
}
