import React from 'react'
import { MessageBubbleProps } from '../../types'
import { BRAND } from '../../constants'
import { cn, formatTime, isTypingMessage } from '../../lib'

/**
 * Typing Indicator Component
 */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1" aria-live="polite">
      <div className="flex gap-1">
        <span className={`w-2 h-2 rounded-full bg-[${BRAND.primary}] animate-bounce [animation-delay:-0.3s]`} />
        <span className={`w-2 h-2 rounded-full bg-[${BRAND.primary}] animate-bounce [animation-delay:-0.15s]`} />
        <span className={`w-2 h-2 rounded-full bg-[${BRAND.primary}] animate-bounce`} />
      </div>
      <span className={`text-sm ${BRAND.text.muted} ml-2`}>AI đang suy nghĩ</span>
    </div>
  )
}

/**
 * Message Bubble Component
 * Displays individual chat messages with styling based on role (user/assistant)
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"
  const isTyping = isTypingMessage(message.content)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
    } catch (error) {
      console.warn('Failed to copy message:', error)
    }
  }

  return (
    <div className={cn("flex gap-4 mb-6 animate-in slide-in-from-bottom-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={cn(
          "w-12 h-12 rounded-3xl flex items-center justify-center",
          BRAND.shadows.medium,
          isUser 
            ? `${BRAND.surfaces.glass} ${BRAND.borders.primary} border` 
            : BRAND.gradients.radial
        )}>
          {isUser ? (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${BRAND.gradients.primary}`}>
              <span className="text-sm font-bold text-white">U</span>
            </div>
          ) : (
            <span className="text-white text-lg">🤖</span>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className={cn("flex-1 max-w-[75%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "relative rounded-3xl px-6 py-4",
          BRAND.shadows.large,
          isUser
            ? `text-white ${BRAND.gradients.radial}`
            : `${BRAND.surfaces.card} ${BRAND.borders.glow} border`
        )}>
          {/* Message content */}
          {isTyping ? (
            <TypingIndicator />
          ) : (
            <div 
              className="text-sm leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, "<br/>") }}
            />
          )}
          
          {/* Timestamp */}
          <div className={cn(
            "text-xs mt-3",
            isUser ? "text-white/70" : BRAND.text.light
          )}>
            {formatTime(message.ts)}
          </div>
        </div>

        {/* Action buttons for bot messages */}
        {!isUser && !isTyping && (
          <div className="flex items-center gap-2 mt-3 ml-2">
            <button
              className={cn(
                "p-2 rounded-full transition-all group",
                BRAND.states.hover,
                BRAND.surfaces.hover
              )}
              aria-label="Thích tin nhắn"
            >
              <span className={cn("text-sm", BRAND.text.light, "group-hover:text-red-500")}>❤️</span>
            </button>
            <button
              className={cn(
                "p-2 rounded-full transition-all group",
                BRAND.states.hover,
                BRAND.surfaces.hover
              )}
              onClick={handleCopy}
              aria-label="Sao chép tin nhắn"
            >
              <span className={cn("text-sm", BRAND.text.light, `group-hover:text-[${BRAND.primary}]`)}>📋</span>
            </button>
            <button
              className={cn(
                "p-2 rounded-full transition-all group",
                BRAND.states.hover,
                BRAND.surfaces.hover
              )}
              aria-label="Chia sẻ tin nhắn"
            >
              <span className={cn("text-sm", BRAND.text.light, `group-hover:text-[${BRAND.secondary}]`)}>↗️</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
