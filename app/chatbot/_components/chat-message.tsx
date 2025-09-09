"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import type { Message } from "@/app/chatbot/_lib/types"
import { formatMessageContent } from "@/app/chatbot/_lib/message-formatter"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  // Chuyển đổi timestamp string thành Date object nếu cần
  const timestamp = message.timestamp instanceof Date 
    ? message.timestamp 
    : new Date(message.timestamp)

  return (
    <div
      key={message.id}
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div className="flex items-start space-x-2 max-w-[80%]">
        {message.role === "assistant" && (
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={`rounded-2xl px-4 py-3 overflow-hidden break-words ${
            message.role === "user"
              ? "bg-primary text-primary-foreground glow"
              : "bg-secondary/20 text-foreground border border-accent/20"
          }`}
          dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
        />
        <p className="text-xs opacity-70 mt-1">
          {timestamp.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {message.role === "user" && (
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-accent text-accent-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
}
