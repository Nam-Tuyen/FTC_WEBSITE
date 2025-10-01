import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#003663] text-white overflow-hidden">
      <Navigation />
      <main className="relative">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}