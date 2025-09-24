'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, Info, Award, Calendar, Users, MessageSquare, FileText, Bot } from 'lucide-react'

// Using simple <img> for external FTC logo URL to avoid next/image domain restrictions
const FTC_LOGO_URL = "https://cdn.builder.io/api/v1/image/assets%2F28c01978106541d5baa7b8a043c11d9b%2Fa73c2f3c74b94de7814f011b7387bea0?format=webp&width=800"

interface NavigationItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

// Static, deterministic labels to avoid SSR/CSR mismatch
const NAV: NavigationItem[] = [
  { label: 'TRANG CHỦ', href: '/', icon: Home },
  { label: 'THÔNG TIN', href: '/thong-tin', icon: Info },
  { label: 'THÀNH TÍCH', href: '/thanh-tich', icon: Award },
  { label: 'HOẠT ĐỘNG', href: '/hoat-dong', icon: Calendar },
  { label: 'CƠ CẤU', href: '/co-cau', icon: Users },
  { label: 'DIỄN ĐÀN', href: '/dien-dan', icon: MessageSquare },
  { label: 'ỨNG TUYỂN', href: '/ung-tuyen', icon: FileText },
  { label: 'CHATBOT', href: '/chatbot', icon: Bot },
]

export function Navigation() {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (!mounted) return
    document.body.style.overflow = open ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [open, mounted])

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Backdrop for mobile menu */}
      {mounted && open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <nav className="sticky top-0 z-50 w-full">
        {/* Main navigation bar */}
        <div className="relative bg-gradient-to-r from-background/95 via-background/90 to-background/95 border-b border-accent/20 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group z-10 flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-primary/30 rounded-full blur-md animate-pulse" />
                  <img
                    src={FTC_LOGO_URL}
                    alt="FTC Logo"
                    className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-accent/30 group-hover:border-accent transition-all duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-lg sm:text-2xl font-black text-foreground group-hover:text-accent transition-colors duration-300">FTC</span>
                  <span className="hidden sm:block text-xs text-muted-foreground -mt-1">Financial Technology Club</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex flex-1 justify-center max-w-5xl mx-4">
                <div className="flex items-center justify-center gap-1 px-4 py-2 rounded-2xl bg-gradient-to-r from-background/80 to-background/60 border border-accent/20 backdrop-blur-sm">
                  {NAV.map(({ href, label, icon: Icon }) => {
                    const active = isActive(href)
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`group relative flex items-center gap-2 px-3 xl:px-4 py-2 rounded-xl transition-all duration-300 min-w-fit ${
                          active
                            ? 'bg-gradient-to-r from-accent/20 to-primary/20 text-foreground shadow-lg'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                        }`}
                      >
                        <Icon className={`w-4 h-4 transition-all duration-300 flex-shrink-0 ${active ? 'text-accent' : 'group-hover:text-accent group-hover:scale-110'}`} />
                        <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                        {active && <div className="absolute inset-0 bg-accent/5 rounded-xl blur-sm" />}
                        {label === 'CHATBOT' && !active && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Mobile/Tablet menu button */}
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden relative p-2 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 hover:border-accent/40 transition-all duration-300 group flex-shrink-0"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 relative">
                  <Menu className={`absolute inset-0 text-accent transition-all duration-300 ${open ? 'opacity-0 rotate-45' : 'opacity-100 rotate-0'}`} />
                  <X className={`absolute inset-0 text-accent transition-all duration-300 ${open ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-45'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Navigation - Dropdown Style */}
        {mounted && (
          <div className={`lg:hidden fixed top-16 left-0 right-0 z-50 transition-all duration-300 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            <div className="mx-4 mt-2 bg-gradient-to-br from-background/95 to-background/85 rounded-2xl border border-accent/20 shadow-2xl shadow-black/20 backdrop-blur-xl overflow-hidden">
              {/* Mobile Grid Layout */}
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {NAV.map(({ href, label, icon: Icon }) => {
                    const active = isActive(href)
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                          active
                            ? 'bg-gradient-to-b from-accent/20 to-primary/20 text-foreground shadow-lg border border-accent/30'
                            : 'text-muted-foreground hover:text-foreground hover:bg-gradient-to-b hover:from-accent/10 hover:to-primary/10 border border-transparent hover:border-accent/20'
                        }`}
                      >
                        <div className="relative">
                          <Icon className={`w-6 h-6 transition-all duration-300 ${active ? 'text-accent' : 'group-hover:text-accent group-hover:scale-110'}`} />
                          {label === 'CHATBOT' && !active && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-center leading-tight">{label}</span>
                        {active && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full" />}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-accent/10 p-3 bg-gradient-to-r from-accent/5 to-primary/5">
                <div className="text-center">
                  <span className="text-xs text-muted-foreground">Financial Technology Club - FTC</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tablet Horizontal Navigation (md screens only) */}
        <div className="hidden md:block lg:hidden">
          <div className="bg-gradient-to-r from-background/90 to-background/80 border-b border-accent/10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
                {NAV.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                        active
                          ? 'bg-gradient-to-r from-accent/20 to-primary/20 text-foreground shadow-lg border border-accent/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                      }`}
                    >
                      <Icon className={`w-5 h-5 transition-all duration-300 flex-shrink-0 ${active ? 'text-accent' : 'group-hover:text-accent group-hover:scale-110'}`} />
                      <span className="text-sm font-medium">{label}</span>
                      {label === 'CHATBOT' && !active && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style jsx global>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}

export default Navigation