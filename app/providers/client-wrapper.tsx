"use client"

import { AuthProvider } from "@/app/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

/**
 * Client Wrapper Component
 * Wraps all client-side providers and components to prevent hydration mismatch
 */
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  )
}

