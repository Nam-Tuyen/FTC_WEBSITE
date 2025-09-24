'use client'

"use client"
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
  const menuScrollRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const pathname = usePathname()

  const handleScroll = React.useCallback((e: React.WheelEvent) => {
    if (!menuScrollRef.current) return
    e.preventDefault()
    menuScrollRef.current.scrollTop += e.deltaY * 2
  }, [])

  // Icon wrapper for consistent styling
  const IconWrapper = ({
    Icon,
    isActive,
    className = "",
    showPulse = false
  }: {
    Icon: React.ComponentType<{ className?: string }>,
    isActive?: boolean,
    className?: string,
    showPulse?: boolean
  }) => (
    <div className={`relative flex items-center justify-center w-6 h-6 ${className}`}>
      <Icon 
        className={`
          w-full h-full 
          text-accent 
          transition-all duration-200 
          group-hover:scale-110 
          ${isActive ? 'nav-icon-active' : 'nav-icon-glow'} 
          ${showPulse ? 'nav-icon-pulse' : ''}
        `} 
      />
      {isActive && (
        <div className="absolute inset-0 bg-accent/10 rounded-full blur-md -z-10 animate-pulse" />
      )}
    </div>
  )

  return (
    <>
      <nav suppressHydrationWarning className="gradient-bg border-b border-accent/30 sticky top-0 z-50 backdrop-blur-xl">
        <div suppressHydrationWarning className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/80 to-background/90 backdrop-blur-xl" />
        <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 sm:h-18">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 sm:space-x-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-lg animate-pulse" />
                  <img
                    src={FTC_LOGO_URL}
                    alt="Financial Technology Club Logo"
                    width={44}
                    height={44}
                    className="relative rounded-full glow transition-all object-cover w-11 h-11 group-hover:scale-110 duration-300"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-accent/50 group-hover:border-accent transition-colors" aria-hidden="true" />
                </div>
                <div className="flex items-center gap-2">
                  <span suppressHydrationWarning className="font-heading text-foreground font-extrabold tracking-wide leading-none text-[44px] group-hover:text-accent transition-colors duration-300">FTC</span>
                  <span className="text-xs sm:text-sm text-accent tracking-wide">&nbsp;</span>
                </div>
              </Link>
            </div>

            {/* Desktop nav - Modern horizontal scroll */}
            <div className="hidden md:block flex-1 max-w-4xl mx-4">
              <div 
                ref={menuScrollRef}
                onWheel={handleScroll}
                className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {NAV.map(({ href, label, icon: Icon }) => {
                  const isActive = (() => {
                    try {
                      if (!pathname) return false
                      if (href === '/') return pathname === '/'
                      return pathname.startsWith(href)
                    } catch (_) { return false }
                  })()

                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`nav-link group inline-flex items-center gap-2 py-2 px-4 rounded-xl transition-all duration-300 whitespace-nowrap min-w-fit ${
                        isActive 
                          ? 'bg-gradient-to-r from-accent/20 to-primary/20 text-foreground shadow-lg shadow-accent/10 border border-accent/30' 
                          : 'text-foreground/80 hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 hover:text-foreground hover:shadow-md hover:shadow-accent/5'
                      }`}
                    >
                      <IconWrapper 
                        Icon={Icon} 
                        isActive={isActive} 
                        showPulse={label === 'CHATBOT' && !isActive}
                        className="w-5 h-5"
                      />
                      <span className="nav-label font-medium tracking-wide text-sm">{label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Mobile toggle - Modern design */}
            <div className="md:hidden">
              <button
                type="button"
                aria-label="Toggle menu"
                onClick={() => setOpen((v) => !v)}
                className="group inline-flex items-center justify-center h-12 w-12 rounded-2xl border border-accent/30 hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 transition-all duration-300 hover:scale-105"
              >
                <div className="relative w-6 h-6">
                  <Menu className={`absolute text-accent transition-all duration-300 group-hover:scale-110 ${open ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} aria-hidden={open} />
                  <X className={`absolute text-accent transition-all duration-300 group-hover:scale-110 ${open ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} aria-hidden={!open} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile menu - Modern scrollable design */}
          {mounted && (
            <div className={`md:hidden transition-all duration-500 overflow-hidden ${open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-3 pt-4 pb-6 space-y-3 rounded-2xl mt-4 border border-accent/20 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl shadow-2xl shadow-black/20">
                {/* Mobile scrollable nav */}
                <div className="overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="flex gap-2 min-w-max">
                    {NAV.map(({ href, label, icon: Icon }) => {
                      const isActive = (() => {
                        try {
                          if (!pathname) return false
                          if (href === '/') return pathname === '/'
                          return pathname.startsWith(href)
                        } catch (_) { return false }
                      })()

                      return (
                        <Link 
                          key={href} 
                          href={href} 
                          className={`group flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 min-w-fit ${
                            isActive 
                              ? 'bg-gradient-to-r from-accent/20 to-primary/20 text-foreground shadow-lg shadow-accent/10 border border-accent/30' 
                              : 'text-foreground/80 hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 hover:text-foreground'
                          }`}
                          onClick={() => setOpen(false)}
                        >
                          <IconWrapper 
                            Icon={Icon} 
                            isActive={isActive}
                            showPulse={label === 'CHATBOT' && !isActive}
                            className="w-5 h-5"
                          />
                          <span className="font-medium text-sm whitespace-nowrap">{label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navigation
