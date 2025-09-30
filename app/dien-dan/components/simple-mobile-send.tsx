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
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-1">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Viết phản hồi..."
          className="w-full px-5 py-4 rounded-3xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 backdrop-blur-xl hover:bg-white/15 hover:border-white/30 mobile-input"
          disabled={disabled}
          style={{
            fontSize: '16px', // Prevent zoom on iOS
            WebkitAppearance: 'none',
            borderRadius: '20px'
          }}
        />
        {/* Subtle glow effect on focus */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 pointer-events-none focus-within:opacity-100" />
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className={`
          relative w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-300 ease-out
          focus:outline-none focus:ring-4 focus:ring-blue-400/30
          active:scale-95 transform-gpu overflow-hidden
          ${!isDisabled 
            ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 hover:-translate-y-1' 
            : 'bg-gradient-to-br from-gray-500/50 to-gray-600/50 shadow-md shadow-gray-500/20 cursor-not-allowed'
          }
          mobile-send-button
        `}
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          minWidth: '56px',
          minHeight: '56px'
        }}
        onTouchStart={(e) => {
          if (!isDisabled && 'vibrate' in navigator) {
            navigator.vibrate(10) // Light haptic feedback
          }
        }}
      >
        {/* Animated background gradient */}
        {!isDisabled && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
        )}
        
        {/* Shimmer effect */}
        {!isDisabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 rounded-3xl" />
        )}
        
        {/* Icon container */}
        <div className="relative z-10 flex items-center justify-center">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="h-6 w-6 text-white drop-shadow-sm" />
          )}
        </div>
        
        {/* Ripple effect on click */}
        {!isDisabled && (
          <div className="absolute inset-0 rounded-3xl bg-white/20 scale-0 active:scale-100 transition-transform duration-150 ease-out" />
        )}
      </button>
    </div>
  )
}
