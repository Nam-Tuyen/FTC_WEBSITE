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
    <div className={`flex items-center gap-3 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/40 backdrop-blur-sm ${className}`}>
      <div className="flex-1">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Viết phản hồi..."
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200"
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
          w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-sky-500/50
          active:scale-95
          ${!isDisabled 
            ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md hover:shadow-lg' 
            : 'bg-slate-600 text-slate-400 cursor-not-allowed'
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
