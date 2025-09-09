// @ts-nocheck
"use client"

import PropTypes from "prop-types"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function ChatInput({ value, onChange, onSend, onKeyDown }) {
  return (
    <div className="relative z-10 p-4 border-t border-accent/20">
      <div className="flex gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Nhập tin nhắn của bạn..."
          className="min-h-[50px] max-h-[200px] resize-none bg-background/50 backdrop-blur-sm"
        />
        <Button
          onClick={onSend}
          className="px-3 bg-primary hover:bg-primary/90"
          disabled={!value.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

ChatInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
}
