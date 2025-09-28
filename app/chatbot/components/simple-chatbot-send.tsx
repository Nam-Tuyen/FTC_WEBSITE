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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isLoading) return
    setIsPressed(true)
    
    // Haptic feedback for iOS
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
    
    // Prevent default to avoid double-tap zoom
    e.preventDefault()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPressed(false)
    
    // Trigger click on touch end for better mobile experience
    if (!disabled && !isLoading) {
      e.preventDefault()
      e.stopPropagation()
      onClick()
    }
  }

  const handleTouchCancel = () => {
    setIsPressed(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || isLoading) return
    e.preventDefault()
    onClick()
  }

  const isDisabled = disabled || isLoading

  return (
    <button
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
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
        minHeight: '44px',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
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
