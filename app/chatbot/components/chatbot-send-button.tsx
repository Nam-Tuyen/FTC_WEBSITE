'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface ChatbotSendButtonProps {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ChatbotSendButton({ 
  onClick, 
  disabled = false, 
  isLoading = false,
  className = '',
  size = 'md'
}: ChatbotSendButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [rippleEffect, setRippleEffect] = useState<{ x: number; y: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'w-10 h-10',
      icon: 'h-4 w-4',
      text: 'text-sm'
    },
    md: {
      button: 'w-12 h-12',
      icon: 'h-5 w-5', 
      text: 'text-base'
    },
    lg: {
      button: 'w-14 h-14',
      icon: 'h-6 w-6',
      text: 'text-lg'
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isLoading) return
    
    setIsPressed(true)
    
    // Create ripple effect
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      setRippleEffect({ x, y })
    }

    // Haptic feedback for iOS
    if ('vibrate' in navigator) {
      navigator.vibrate(10) // Light haptic feedback
    }
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
    setRippleEffect(null)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || isLoading) return
    
    // Create ripple effect for mouse clicks
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setRippleEffect({ x, y })
    }

    onClick()
  }

  // Auto-clear ripple effect
  useEffect(() => {
    if (rippleEffect) {
      const timer = setTimeout(() => setRippleEffect(null), 600)
      return () => clearTimeout(timer)
    }
  }, [rippleEffect])

  const isDisabled = disabled || isLoading

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={isDisabled}
      className={`
        relative overflow-hidden rounded-2xl flex items-center justify-center transition-all duration-200 ease-out
        focus:outline-none focus:ring-4 focus:ring-blue-500/30
        active:scale-95 transform-gpu
        ${sizeConfig[size].button}
        ${!isDisabled 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/30' 
          : 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-md shadow-gray-400/20 cursor-not-allowed'
        }
        ${isPressed ? 'scale-95 shadow-md' : ''}
        ${className}
      `}
      style={{
        // iOS-style touch optimization
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        minWidth: '44px',
        minHeight: '44px'
      }}
    >
      {/* Ripple Effect */}
      {rippleEffect && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            transform: `translate(${rippleEffect.x - 20}px, ${rippleEffect.y - 20}px)`,
            animation: 'ripple 0.6s ease-out',
          }}
        />
      )}

      {/* Icon Content */}
      <div className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <Loader2 className={`text-white animate-spin ${sizeConfig[size].icon}`} />
        ) : (
          <Send className={`text-white ${sizeConfig[size].icon}`} />
        )}
      </div>

      {/* Loading state overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-blue-500/20 rounded-2xl" />
      )}

      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: translate(${rippleEffect?.x || 0}px, ${rippleEffect?.y || 0}px) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(${rippleEffect?.x || 0}px, ${rippleEffect?.y || 0}px) scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  )
}

// Enhanced version with Messenger-style behavior
export function MessengerStyleChatbotButton({
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
  size = 'md'
}: ChatbotSendButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    if (disabled || isLoading) return
    
    setIsAnimating(true)
    onClick()
    
    // Reset animation after completion
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <div className="relative">
      <ChatbotSendButton
        onClick={handleClick}
        disabled={disabled}
        isLoading={isLoading}
        className={`
          transition-all duration-300
          ${isAnimating ? 'scale-110 shadow-2xl shadow-blue-500/40' : ''}
          ${className}
        `}
        size={size}
      />
      
      {/* Messenger-style send animation */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-2xl bg-blue-500/30 animate-ping" />
      )}
    </div>
  )
}
