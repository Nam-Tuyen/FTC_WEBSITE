"use client"

import { Bot } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChatInput } from "./chat-input"
import { ChatMessage } from "./chat-message"
import { useChat } from "../_hooks/use-chat"
import { useChatScroll } from "../_hooks/use-chat-scroll"
import type { Message } from "@/app/chatbot/_lib/types"

export function ChatInterface() {
  const { messages, isTyping, inputValue, setInputValue, handleSendMessage, handleKeyDown } = useChat()
  const messagesEndRef = useChatScroll(messages)

  return (
    <Card className="relative h-full min-h-[70vh] flex flex-col bg-card/20 backdrop-blur-sm border-accent/20 ring-1 ring-accent/10 hover:border-accent/40 transition-all duration-500 hover:glow overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background/5 animate-gradient-slow" />
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/10 to-transparent rounded-full filter blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-accent/10 to-transparent rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-gradient-to-r from-primary/5 via-accent/5 to-transparent rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <CardHeader className="relative z-10 border-b border-accent/20">
        <div className="flex items-center space-x-3">
            <Avatar>
            <AvatarImage src="/ai-chatbot-avatar.png" alt="AI Assistant" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">FinTech AI Assistant</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Luôn sẵn sàng hỗ trợ bạn{" "}
              <span className="inline-flex items-center text-xs">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-1" />
                Online
              </span>
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4 max-h-[65vh]">
        {messages.map((message: Message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <div className="border-t border-accent/20 p-0 bg-gradient-to-r from-background/80 via-accent/5 to-background/80 backdrop-blur-md sticky bottom-0 mt-auto">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          onKeyDown={handleKeyDown}
        />
        {/* Mode selection removed as we now always use knowledge base */}
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
