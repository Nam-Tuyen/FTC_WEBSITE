'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Check } from 'lucide-react'

interface MobileSendButtonProps {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  success?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function MobileSendButton({ 
  onClick, 
  disabled = false, 
  isLoading = false, 
  success = false,
  className,
  size = 'md'
}: MobileSendButtonProps) {
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
        ${!isDisabled && !success ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/30' : ''}
        ${success ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25' : ''}
        ${isDisabled ? 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-md shadow-gray-400/20 cursor-not-allowed' : ''}
        ${isPressed ? 'scale-95 shadow-md' : ''}
        ${className || ''}
      `}
      style={{
        // iOS-style touch optimization
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
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
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : success ? (
          <Check className={`text-white ${sizeConfig[size].icon}`} />
        ) : (
          <Send className={`text-white ${sizeConfig[size].icon}`} />
        )}
      </div>

      {/* Success animation overlay */}
      {success && (
        <div className="absolute inset-0 bg-green-400/20 rounded-2xl animate-pulse" />
      )}

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

// Enhanced version with message-like behavior
export function MessengerStyleSendButton({
  onClick,
  disabled = false,
  isLoading = false,
  success = false,
  className,
  size = 'md'
}: MobileSendButtonProps) {
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
      <MobileSendButton
        onClick={handleClick}
        disabled={disabled}
        isLoading={isLoading}
        success={success}
        className={`
          transition-all duration-300
          ${isAnimating ? 'scale-110 shadow-2xl shadow-blue-500/40' : ''}
          ${className || ''}
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

// Quick reply send button specifically for forum
export function ForumSendButton({ 
  onSubmit, 
  disabled = false,
  className 
}: { 
  onSubmit: (content: string) => void
  disabled?: boolean
  className?: string 
}) {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim() || disabled) return
    
    setIsLoading(true)
    
    try {
      await onSubmit(content.trim())
      setContent('')
      setSuccess(true)
      
      // Reset success state
      setTimeout(() => setSuccess(false), 2000)
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

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Viết phản hồi..."
        className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
        disabled={disabled}
      />
      
      <MessengerStyleSendButton
        onClick={handleSubmit}
        disabled={!content.trim() || disabled}
        isLoading={isLoading}
        success={success}
        size="md"
      />
    </div>
  )
}
