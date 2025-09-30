import React from 'react'
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { ChatInputProps } from '../../types'
import { BRAND, CHAT_MODES } from '../../constants'
import { cn } from '../../lib'

/**
 * Chat Input Component
 * Handles message input with send button and mode indicator
 */
export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  disabled = false,
  placeholder = "Nhập tin nhắn..."
}: ChatInputProps) {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const handleSendClick = () => {
    onSend()
  }

  return (
    <div className={`shrink-0 ${BRAND.borders.glass} border-t px-6 py-4 ${BRAND.surfaces.glass} sticky bottom-0`}>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <div className="relative">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={`w-full ${BRAND.gradients.ethereal} ${BRAND.borders.glass} border text-white placeholder:text-white/50 ${BRAND.states.focus} outline-none transition-all rounded-2xl pr-12`}
              disabled={disabled}
              aria-label="Ô nhập tin nhắn"
            />
            {disabled && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 flex items-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleSendClick} 
          disabled={!value.trim() || disabled}
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all text-white",
            BRAND.shadows.medium,
            BRAND.states.hover,
            value.trim() && !disabled 
              ? `${BRAND.gradients.primary} hover:scale-105` 
              : `${BRAND.surfaces.interactive} ${BRAND.text.light} cursor-not-allowed`
          )}
          aria-label="Gửi tin nhắn"
        >
          {disabled ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="text-lg">➤</span>
          )}
        </Button>
      </div>
      
      {disabled && (
        <div className={`mt-3 flex items-center gap-2 text-sm ${BRAND.text.muted}`}>
          <span className={`animate-pulse text-[${BRAND.primary}]`}>🧠</span>
          <span>AI đang phân tích câu hỏi của bạn...</span>
        </div>
      )}
    </div>
  )
}
