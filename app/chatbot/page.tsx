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
      <section className="relative min-h-[48vh] flex items-center justify-center py-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-gradient-to-br from-indigo-700/20 to-emerald-600/6 rounded-full blur-3xl transform translate-x-24 -translate-y-8" />
          <div className="absolute bottom-0 left-0 w-[35%] h-[50%] bg-gradient-to-tr from-emerald-500/10 to-indigo-600/6 rounded-full blur-3xl -translate-x-24 translate-y-8" />
        </div>

        <div className="relative responsive-container text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-600 to-emerald-500 rounded-full shadow-lg mb-6">
            <Bot className="h-9 w-9 text-white" />
          </div>
          <h1 className="relative text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight" style={{fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system'}}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-300">FTC AI Chatbot</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">Trợ lý AI thân thiện giúp tân sinh viên tìm hiểu về câu lạc bộ, hoạt động và kiến thức Fintech.</p>
        </div>
      </section>

      {/* Main layout */}
      <div className="responsive-container pt-6 pb-12">
        <div className="flex justify-center">
          <div className="w-full max-w-[1200px]">
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
