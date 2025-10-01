import * as React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Suspense } from "react"
import Script from "next/script"
import { ClientWrapper } from "@/app/providers/client-wrapper"
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
  generator: "v0.app",
  keywords: ["fintech", "công nghệ tài chính", "FTC", "câu lạc bộ", "finance", "technology"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://cdn.builder.io/api/v1/image/assets%2F28c01978106541d5baa7b8a043c11d9b%2Fa73c2f3c74b94de7814f011b7387bea0?format=webp&width=800" />
      </head>
      <body className={`${montserrat.className} ${montserrat.variable}`} suppressHydrationWarning>
        <ClientWrapper>
          <Suspense fallback={null}>{children}</Suspense>
          {process.env.NODE_ENV === "development" && (
            <Script id="suppress-clipboard-policy-error" strategy="afterInteractive">
              {`
                (function(){
                  try {
                    window.addEventListener('unhandledrejection', function(e){
                      var msg = String((e && e.reason && (e.reason.message || e.reason)) || '');
                      if (msg.includes('Clipboard API has been blocked') || msg.includes('permissions policy') || msg.includes('NotAllowedError')) {
                        e.preventDefault();
                      }
                      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('ECONNREFUSED')) {
                        if (location && location.hostname && (location.hostname.endsWith('.fly.dev') || location.hostname === 'localhost' || location.hostname.includes('vercel'))) {
                          console.warn('Suppressed dev network error:', msg);
                          e.preventDefault();
                        }
                      }
                    });
                  } catch(_) {}
                })();
              `}
            </Script>
          )}
        </ClientWrapper>
      </body>
    </html>
  )
}
