"use client"

import { useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import type { KeyboardEvent } from "react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
}

export function ChatInput({ value, onChange, onSend, onKeyDown }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    function onSelect(e: any) {
      try {
        const q = e?.detail
        if (typeof q === 'string') {
          onChange(q)
          // focus the input after setting value
          setTimeout(() => inputRef.current?.focus(), 50)
        }
      } catch (err) {}
    }

    window.addEventListener('chat:selectQuestion', onSelect as EventListener)
    return () => window.removeEventListener('chat:selectQuestion', onSelect as EventListener)
  }, [onChange])

  return (
    <div className="border-t border-accent/20 p-4 bg-gradient-to-r from-background/80 via-accent/5 to-background/80 backdrop-blur-md sticky bottom-0 mt-auto">
      <div className="flex space-x-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Nhập câu hỏi của bạn..."
          className="flex-1 bg-background/60 border-accent/30 hover:border-accent/50 focus:border-accent/70 transition-colors placeholder:text-muted-foreground/50"
        />
        <Button
          onClick={onSend}
          disabled={!value.trim()}
          className="bg-gradient-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent transition-all duration-300 glow"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
