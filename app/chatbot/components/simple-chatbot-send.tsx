'use client'

import React, { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface SimpleChatbotSendProps {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  className?: string
}

export function SimpleChatbotSend({ 
  onClick, 
  disabled = false, 
  isLoading = false,
  className = ''
}: SimpleChatbotSendProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleTouchStart = () => {
    if (disabled || isLoading) return
    setIsPressed(true)
    
    // Haptic feedback for iOS
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
  }

  const handleClick = () => {
    if (disabled || isLoading) return
    onClick()
  }

  const isDisabled = disabled || isLoading

  return (
    <button
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={isDisabled}
      className={`
        w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ease-out
        focus:outline-none focus:ring-4 focus:ring-blue-500/30
        active:scale-95 transform-gpu
        ${!isDisabled 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/30' 
          : 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-md shadow-gray-400/20 cursor-not-allowed'
        }
        ${isPressed ? 'scale-95 shadow-md' : ''}
        ${className}
      `}
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        minWidth: '44px',
        minHeight: '44px'
      }}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 text-white animate-spin" />
      ) : (
        <Send className="h-5 w-5 text-white" />
      )}
    </button>
  )
}
