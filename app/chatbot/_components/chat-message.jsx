// @ts-nocheck
"use client"

import PropTypes from "prop-types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import remarkGfm from "remark-gfm"

export function ChatMessage({ message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex items-start gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar>
        {isUser ? (
          <>
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/ai-chatbot-avatar.png" alt="AI Assistant" />
            <AvatarFallback>
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className={`group flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`
            rounded-lg px-4 py-2 max-w-[85%] break-words
            ${
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }
          `}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-sm dark:prose-invert max-w-none"
            components={{
              a: ({ node, ...props }) => (
                <a {...props} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="mb-0 leading-normal whitespace-pre-wrap" />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc list-inside my-2" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal list-inside my-2" />
              ),
              li: ({ node, ...props }) => (
                <li {...props} className="mb-1" />
              ),
              code: ({ node, inline, ...props }) => (
                inline ? (
                  <code {...props} className="px-1 py-0.5 rounded-sm bg-muted-foreground/20" />
                ) : (
                  <code {...props} className="block p-2 my-2 rounded-md bg-muted-foreground/20 overflow-x-auto" />
                )
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          {format(new Date(message.timestamp), "HH:mm, dd/MM/yyyy", { locale: vi })}
        </span>
      </div>
    </div>
  )
}

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
}
