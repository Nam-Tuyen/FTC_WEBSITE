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
      <head>
        <link rel="icon" href="/placeholder-logo.svg" />
      </head>
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
                    // Wrap navigator.clipboard.writeText to avoid uncaught NotAllowedError in restricted iframes/previews
                    try {
                      var nav = window.navigator || {}
                      if (nav && nav.clipboard && typeof nav.clipboard.writeText === 'function') {
                        var original = nav.clipboard.writeText.bind(nav.clipboard)
                        nav.clipboard.writeText = async function(text) {
                          try {
                            return await original(text)
                          } catch (e) {
                            try {
                              var msg = String((e && (e.message || e)) || '')
                              if (msg.includes('Clipboard API has been blocked') || msg.includes('permissions policy') || msg.includes('NotAllowedError')) {
                                // Swallow permission/NotAllowed errors in preview/dev to avoid noisy unhandledrejection
                                return Promise.resolve()
                              }
                            } catch (_) {}
                            return Promise.reject(e)
                          }
                        }
                      }
                    } catch (_) {}

                    window.addEventListener('unhandledrejection', function(e){
                      var msg = String((e && e.reason && (e.reason.message || e.reason)) || '');
                      if (msg.includes('Clipboard API has been blocked') || msg.includes('permissions policy') || msg.includes('NotAllowedError')) {
                        e.preventDefault();
                        return
                      }

                      // Suppress noisy dev/preview network errors from HMR or third-party analytics (FullStory)
                      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('ECONNREFUSED')) {
                        // only suppress in development/preview to avoid masking production issues
                        if (location && location.hostname && (location.hostname.endsWith('.fly.dev') || location.hostname === 'localhost' || location.hostname.includes('vercel'))) {
                          console.warn('Suppressed dev network error:', msg)
                          e.preventDefault()
                        }
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
