import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "../globals.css"

export const metadata: Metadata = {
  title: "Diễn đàn FTC - Cộng đồng Fintech",
  description: "Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối với nhau",
  generator: "v0.app",
  openGraph: {
    title: "Diễn đàn FTC - Cộng đồng Fintech",
    description: "Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối với nhau",
    type: "website",
  },
}

export default function ForumLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`min-h-screen font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>
      <main className="pt-16">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
