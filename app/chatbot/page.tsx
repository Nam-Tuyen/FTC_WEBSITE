"use client"

/// <reference path="../../types/react-extensions.d.ts" />
/// <reference path="../../types/shadcn-ui.d.ts" />

import React from 'react'
import { Navigation } from "@/components/navigation"
import { Bot } from "lucide-react"
import ChatInterface from "./_components/chat-interface"
import { SuggestedQuestions } from "./_components/suggested-questions"
import { FeaturesSidebar } from "./_components/features-sidebar"

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-accent/20 via-primary/20 to-transparent rounded-full blur-3xl animate-float-reverse" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold">
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-50 blur-2xl animate-pulse"></span>
            <span className="relative bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text animate-text-shine">
              AI CHATBOT
            </span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty">
            <em>Trợ lý AI giúp bạn tìm hiểu về câu lạc bộ và các kiến thức Fintech</em>
          </p>
        </div>
      </section>

      {/* Main layout */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="flex justify-center">
          <div className="w-full max-w-[1100px]">
            <ChatInterface />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 30px) scale(1.05); }
        }
        .animate-gradient-slow {
          animation: gradient 15s ease infinite;
          background-size: 200% 200%;
        }
        .animate-blob {
          animation: blob 20s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
