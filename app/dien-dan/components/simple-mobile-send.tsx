'use client'

import React, { useState } from 'react'
import { Send } from 'lucide-react'

interface SimpleMobileSendProps {
  onSubmit: (content: string) => void
  disabled?: boolean
  className?: string
}

export function SimpleMobileSend({ onSubmit, disabled = false, className = '' }: SimpleMobileSendProps) {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim() || disabled || isLoading) return
    
    setIsLoading(true)
    
    try {
      await onSubmit(content.trim())
      setContent('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isDisabled = !content.trim() || disabled || isLoading

  return (
    <div className={`relative ${className}`}>
      {/* Main container - Very subtle, almost invisible */}
      <div className="relative bg-transparent rounded-2xl p-2 transition-all duration-300">
        <div className="flex items-end gap-3">
          {/* Input area - Very subtle and unobtrusive */}
          <div className="flex-1 relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Viết phản hồi..."
              rows={1}
              className="w-full px-4 py-3 bg-transparent text-white placeholder-white/30 focus:outline-none resize-none transition-all duration-200 mobile-input-very-subtle"
              disabled={disabled}
              style={{
                fontSize: '16px', // Prevent zoom on iOS
                WebkitAppearance: 'none',
                minHeight: '44px',
                maxHeight: '120px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = Math.min(target.scrollHeight, 120) + 'px'
              }}
            />
            
            {/* Very subtle bottom border that appears on focus */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 transition-all duration-300 focus-within:from-blue-400/30 focus-within:via-blue-400/60 focus-within:to-blue-400/30" />
          </div>
          
          {/* Send button - Prominent and eye-catching */}
          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`
              relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ease-out
              focus:outline-none focus:ring-4 focus:ring-blue-400/30
              active:scale-95 transform-gpu overflow-hidden
              ${!isDisabled 
                ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-lg shadow-blue-500/40 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-110 hover:-translate-y-1' 
                : 'bg-gradient-to-br from-gray-500/40 to-gray-600/40 shadow-md shadow-gray-500/20 cursor-not-allowed'
              }
              mobile-send-button-prominent
            `}
            style={{
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              minWidth: '48px',
              minHeight: '48px'
            }}
            onTouchStart={(e) => {
              if (!isDisabled && 'vibrate' in navigator) {
                navigator.vibrate(10) // Light haptic feedback
              }
            }}
          >
            {/* Animated background gradient */}
            {!isDisabled && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            )}
            
            {/* Shimmer effect */}
            {!isDisabled && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 rounded-xl" />
            )}
            
            {/* Icon container */}
            <div className="relative z-10 flex items-center justify-center">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-5 w-5 text-white drop-shadow-sm" />
              )}
            </div>
            
            {/* Ripple effect on click */}
            {!isDisabled && (
              <div className="absolute inset-0 rounded-xl bg-white/30 scale-0 active:scale-100 transition-transform duration-150 ease-out" />
            )}
            
            {/* Pulse effect when enabled */}
            {!isDisabled && content.trim() && (
              <div className="absolute inset-0 rounded-xl bg-blue-400/20 animate-ping" />
            )}
          </button>
        </div>
        
        {/* Character count (optional) - Very subtle */}
        {content.length > 0 && (
          <div className="absolute -bottom-6 right-0 text-xs text-white/20">
            {content.length}/500
          </div>
        )}
      </div>
    </div>
  )
}
