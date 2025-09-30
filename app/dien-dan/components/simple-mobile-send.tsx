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
    <div className={`flex items-center gap-3 p-4 bg-gradient-to-r from-[#001a2e] to-[#002a4a] rounded-2xl border border-[#003663]/40 backdrop-blur-sm shadow-lg ${className}`}>
      <div className="flex-1">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Viết phản hồi..."
          className="w-full px-4 py-3 bg-[#001122] border border-[#003663]/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003663]/60 focus:border-[#003663]/70 transition-all duration-300"
          disabled={disabled}
          style={{
            fontSize: '16px', // Prevent zoom on iOS
            WebkitAppearance: 'none',
            borderRadius: '12px'
          }}
        />
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className={`
          w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-[#003663]/50
          active:scale-95 hover:scale-105
          ${!isDisabled 
            ? 'bg-gradient-to-r from-[#003663] to-[#004d7a] hover:from-[#004d7a] hover:to-[#005c8a] text-white shadow-lg hover:shadow-xl' 
            : 'bg-[#001122] text-slate-500 cursor-not-allowed'
          }
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
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </button>
    </div>
  )
}
