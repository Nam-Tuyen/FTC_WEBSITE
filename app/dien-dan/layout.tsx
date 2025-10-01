import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Diễn đàn FTC - Cộng đồng Fintech",
  description: "Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối với nhau",
}

export default function ForumLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <Suspense fallback={null}>{children}</Suspense>
}

