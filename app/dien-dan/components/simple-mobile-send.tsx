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
    <div className={`flex items-center gap-2 p-2 bg-[#001a2e] rounded-xl border border-[#003663]/30 backdrop-blur-sm ${className}`}>
      <div className="flex-1">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Viết phản hồi..."
          className="w-full px-3 py-2 bg-[#001122] border border-[#003663]/40 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#003663]/50 focus:border-[#003663]/60 transition-all duration-200 text-sm"
          disabled={disabled}
          style={{
            fontSize: '14px', // Smaller font size
            WebkitAppearance: 'none',
            borderRadius: '8px'
          }}
        />
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className={`
          w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
          focus:outline-none focus:ring-1 focus:ring-[#003663]/50
          active:scale-95
          ${!isDisabled 
            ? 'bg-[#003663] hover:bg-[#004d7a] text-white shadow-sm hover:shadow-md' 
            : 'bg-[#001122] text-slate-600 cursor-not-allowed'
          }
        `}
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          minWidth: '32px',
          minHeight: '32px'
        }}
        onTouchStart={(e) => {
          if (!isDisabled && 'vibrate' in navigator) {
            navigator.vibrate(10) // Light haptic feedback
          }
        }}
      >
        {isLoading ? (
          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Send className="h-3 w-3" />
        )}
      </button>
    </div>
  )
}
