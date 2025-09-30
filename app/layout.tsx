import * as React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import Script from "next/script"
import { AuthProvider } from "@/app/providers/auth-provider"
import { ToastProvider } from "@/contexts/ToastContext"
import "./globals.css"

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  display: "swap",
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
        <link rel="icon" href="https://cdn.builder.io/api/v1/image/assets%2F28c01978106541d5baa7b8a043c11d9b%2Fa73c2f3c74b94de7814f011b7387bea0?format=webp&width=800" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </ToastProvider>
          <Analytics />
          <SpeedInsights />
          {process.env.NODE_ENV === "development" && (
            <Script id="suppress-clipboard-policy-error" strategy="beforeInteractive">
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

                    // Also catch global error events with network failure messages
                    window.addEventListener('error', function(ev){
                      try {
                        var m = String((ev && ev.message) || '')
                        if (m && (m.includes('Failed to fetch') || m.includes('NetworkError') || m.includes('ECONNREFUSED'))) {
                          if (location && location.hostname && (location.hostname.endsWith('.fly.dev') || location.hostname === 'localhost' || location.hostname.includes('vercel'))) {
                            console.warn('Suppressed dev runtime error:', m)
                            ev.preventDefault && ev.preventDefault()
                          }
                        }
                      } catch(_) {}
                    });

                    // Wrap window.fetch in development to suppress noisy third-party fetch errors
                    // This is only active on preview/dev domains (fly.dev, localhost, vercel) to avoid masking production issues.
                    try {
                      var __origFetch = window.fetch.bind(window)
                      window.fetch = async function(input, init){
                        try {
                          return await __origFetch(input, init)
                        } catch (err) {
                          try {
                            var url = typeof input === 'string' ? input : (input && input.url) || '<request>'
                            var shouldSuppress = location && location.hostname && (location.hostname.endsWith('.fly.dev') || location.hostname === 'localhost' || location.hostname.includes('vercel'))
                            if (shouldSuppress) {
                              console.warn('Suppressed dev fetch error to', url, err)
                              try {
                                return new Response(JSON.stringify({ error: 'Dev suppressed fetch error' }), { status: 503, headers: { 'Content-Type': 'application/json' } })
                              } catch (_) {
                                return new Response('', { status: 503 })
                              }
                            }
                          } catch (_) {}
                          throw err
                        }
                      }
                    } catch(_) {}

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
