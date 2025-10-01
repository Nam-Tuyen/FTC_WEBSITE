'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Menu, X, Home, Info, Award, Calendar, Users, MessageSquare, FileText, Bot, ChevronDown } from 'lucide-react'

// Using simple <img> for external FTC logo URL to avoid next/image domain restrictions
const FTC_LOGO_URL = "https://cdn.builder.io/api/v1/image/assets%2F28c01978106541d5baa7b8a043c11d9b%2Fa73c2f3c74b94de7814f011b7387bea0?format=webp&width=800"

interface NavigationItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  shortLabel?: string
}

// Static, deterministic labels to avoid SSR/CSR mismatch
const NAV: NavigationItem[] = [
  { label: 'TRANG CHỦ', shortLabel: 'TRANG CHỦ', href: '/', icon: Home },
  { label: 'THÔNG TIN', shortLabel: 'THÔNG TIN', href: '/thong-tin', icon: Info },
  { label: 'THÀNH TÍCH', shortLabel: 'THÀNH TÍCH', href: '/thanh-tich', icon: Award },
  { label: 'HOẠT ĐỘNG', shortLabel: 'HOẠT ĐỘNG', href: '/hoat-dong', icon: Calendar },
  { label: 'CƠ CẤU', shortLabel: 'CƠ CẤU', href: '/co-cau', icon: Users },
  { label: 'DIỄN ĐÀN', shortLabel: 'DIỄN ĐÀN', href: '/dien-dan', icon: MessageSquare },
  { label: 'ỨNG TUYỂN', shortLabel: 'ỨNG TUYỂN', href: '/ung-tuyen', icon: FileText },
  { label: 'CHATBOT', shortLabel: 'CHATBOT', href: '/chatbot', icon: Bot },
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <nav className="sticky top-0 z-50 w-full">
        {/* Main navigation bar - Modern Glass Effect */}
        <div className="relative bg-background/80 backdrop-blur-xl border-b border-accent/10 shadow-lg shadow-black/5">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/3 via-transparent to-primary/3" />
          
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Logo - Enhanced */}
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group z-10 flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
                  <img
                    src={FTC_LOGO_URL}
                    alt="FTC Logo"
                    className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover border border-accent/20 group-hover:border-accent/40 transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center">
                  <span className="font-heading text-2xl sm:text-3xl font-black text-foreground group-hover:text-accent transition-colors duration-300">FTC</span>
                </div>
              </Link>

              {/* Desktop Navigation - Modern Pill Design */}
              <div className="hidden lg:flex flex-1 justify-center max-w-4xl mx-6">
                <div className="flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-background/60 border border-accent/10 backdrop-blur-sm shadow-sm">
                  {NAV.map(({ href, label, icon: Icon }) => {
                    const active = isActive(href)
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 min-w-fit ${
                          active
                            ? 'bg-accent/15 text-accent shadow-sm border border-accent/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 transition-all duration-200 flex-shrink-0 ${active ? 'text-accent' : 'group-hover:text-accent'}`} />
                        <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                        {label === 'CHATBOT' && !active && (
                          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Mobile/Tablet menu button - Modern */}
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden relative p-2 rounded-xl bg-background/60 border border-accent/10 hover:border-accent/20 transition-all duration-200 group flex-shrink-0"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-5 relative">
                  <Menu className={`absolute inset-0 text-foreground transition-all duration-200 ${open ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                  <X className={`absolute inset-0 text-foreground transition-all duration-200 ${open ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Modern Slide Down */}
        {mounted && (
          <div className={`lg:hidden fixed top-14 sm:top-16 left-0 right-0 z-50 transition-all duration-300 ease-out ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
            <div className="mx-3 mt-1 bg-background/95 backdrop-blur-xl rounded-2xl border border-accent/10 shadow-2xl shadow-black/10 overflow-hidden">
              {/* Mobile Grid Layout - Responsive */}
              <div className="p-3 sm:p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {NAV.map(({ href, label, shortLabel, icon: Icon }) => {
                    const active = isActive(href)
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`group relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                          active
                            ? 'bg-accent/15 text-accent shadow-sm border border-accent/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/5 border border-transparent hover:border-accent/10'
                        }`}
                      >
                        <div className="relative">
                          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${active ? 'text-accent' : 'group-hover:text-accent'}`} />
                          {label === 'CHATBOT' && !active && (
                            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-center leading-tight">{shortLabel || label}</span>
                        {active && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full" />}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Footer - Compact */}
              <div className="border-t border-accent/5 p-3 bg-accent/3">
                <div className="text-center">
                  <span className="text-xs text-muted-foreground">Financial Technology Club</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tablet Horizontal Navigation - Modern Scroll */}
        <div className="hidden md:block lg:hidden">
          <div className="bg-background/90 backdrop-blur-sm border-b border-accent/5">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
                {NAV.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                        active
                          ? 'bg-accent/15 text-accent shadow-sm border border-accent/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-all duration-200 flex-shrink-0 ${active ? 'text-accent' : 'group-hover:text-accent'}`} />
                      <span className="text-sm font-medium">{label}</span>
                      {label === 'CHATBOT' && !active && (
                        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
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