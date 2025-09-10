import * as React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Script from "next/script"
import { FloatingChatbotGate } from "@/components/floating-chatbot-gate"
import { AuthProvider } from "@/app/providers/auth-provider"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Câu lạc bộ Công nghệ Tài chính",
  description: "Website chính thức của Câu lạc bộ Công nghệ Tài chính - Nơi kết nối những người đam mê fintech",
  generator: "v0.app"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${montserrat.className} ${montserrat.variable}`}>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <FloatingChatbotGate />
          <Analytics />
          {process.env.NODE_ENV === "development" && (
            <Script id="suppress-clipboard-policy-error" strategy="afterInteractive">
              {`
                (function(){
                  try {
                    window.addEventListener('unhandledrejection', function(e){
                      var msg = String((e && e.reason && (e.reason.message || e.reason)) || '');
                      if (msg.includes('Clipboard API has been blocked because of a permissions policy')) {
                        e.preventDefault();
                      }
                    });
                  } catch(_) {}
                })();
              `}
            </Script>
          )}
        </AuthProvider>
      </body>
    </html>
  )
}
