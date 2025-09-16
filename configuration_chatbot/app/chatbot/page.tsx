"use client"

/// <reference path="../../types/react-extensions.d.ts" />
/// <reference path="../../types/shadcn-ui.d.ts" />

import React from 'react'
import dynamic from 'next/dynamic'
import { Bot } from "lucide-react"

const Navigation = dynamic(() => import("@/components/navigation"), { ssr: false })
const ChatInterface = dynamic(() => import("./_components/chat-interface"), { ssr: false })

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-hidden" suppressHydrationWarning>
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
          <h1 className="relative" style={{letterSpacing: '-1.2px', position: 'relative', font: '800 48px/60px Inter, ui-sans-serif, system-ui, -apple-system'}}>
            <div className="inline-block" style={{backgroundClip: 'text', backgroundImage: 'linear-gradient(to right, oklch(0.673 0.182 276.935) 0%, oklch(0.845 0.143 164.978) 100%)', fontFamily: 'Montserrat, "Montserrat Fallback", sans-serif', fontWeight: 800}}>
              <p>TRỢ LÝ HỖ TRỢ </p>
            </div>
          </h1>
          <div className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            <p>
              Trợ lý AI thân thiện giúp tân sinh viên tìm hiểu thông tin về
              câu lạc bộ và kiến thức về ngành công nghệ tài chính
            </p>
          </div>
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
