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
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Viết phản hồi..."
        className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all mobile-input backdrop-blur-sm hover:bg-white/15"
        disabled={disabled}
        style={{
          fontSize: '16px', // Prevent zoom on iOS
          WebkitAppearance: 'none',
          borderRadius: '12px'
        }}
      />
      
      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className={`
          w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ease-out
          focus:outline-none focus:ring-4 focus:ring-blue-500/30
          active:scale-95 transform-gpu
          ${!isDisabled 
            ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105' 
            : 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-md shadow-gray-400/20 cursor-not-allowed'
          }
          mobile-send-button
        `}
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          minWidth: '44px',
          minHeight: '44px'
        }}
        onTouchStart={(e) => {
          if (!isDisabled && 'vibrate' in navigator) {
            navigator.vibrate(10) // Light haptic feedback
          }
        }}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Send className="h-5 w-5 text-white" />
        )}
      </button>
    </div>
  )
}
