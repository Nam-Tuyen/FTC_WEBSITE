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
    <div className={`relative flex items-center justify-center ${className}`}>
      <Icon className={`text-accent transition-all duration-200 group-hover:scale-110 ${isActive ? 'nav-icon-active' : 'nav-icon-glow'} ${showPulse ? 'nav-icon-pulse' : ''}`} />
      {isActive && (
        <div className="absolute inset-0 bg-accent/10 rounded-full blur-md -z-10 animate-pulse" />
      )}
    </div>
  )

  return (
    <>
      <style jsx>{`
        .nav-link { font-size: 0.875rem; /* match text-sm */ }
        .nav-link svg, nav .nav-link svg { height: 1em; width: 1em; display: block; }
        .nav-label { line-height: 1; }

        .nav-icon-glow {
          filter: drop-shadow(0 0 2px rgba(var(--accent-rgb), 0.3));
        }
        .nav-icon-active {
          filter: drop-shadow(0 0 4px rgba(var(--accent-rgb), 0.5));
        }
        @keyframes iconPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .nav-icon-pulse {
          animation: iconPulse 2s ease-in-out infinite;
        }
      `}</style>
      <nav suppressHydrationWarning className="gradient-bg border-b border-accent/30 sticky top-0 z-50 backdrop-blur-md">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-4 group">
              <div className="relative">
                <img
                  src={FTC_LOGO_URL}
                  alt="Financial Technology Club Logo"
                  width={64}
                  height={64}
                  className="rounded-full glow transition-all object-cover w-16 h-16"
                />
                <div className="absolute inset-0 rounded-full border-2 border-accent" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-heading text-foreground font-extrabold tracking-wide leading-none text-[32px]">FTC</span>
                <span className="text-[12px] sm:text-sm text-accent tracking-wide">&nbsp;</span>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:block">
            <div className="ml-4 lg:ml-10 flex items-center gap-3 flex-nowrap overflow-visible">
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
                    className={`nav-link group inline-flex items-center gap-2 py-2 px-3 rounded-md transition-all duration-200 whitespace-nowrap ${isActive ? 'bg-accent/10 text-foreground shadow-sm' : 'text-foreground/80 hover:bg-accent/5'}`}
                  >
                    <IconWrapper 
                      Icon={Icon} 
                      isActive={isActive} 
                      showPulse={label === 'CHATBOT' && !isActive}
                    />
                    <span className="nav-label text-sm font-medium tracking-wide">{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="group inline-flex items-center justify-center h-10 w-10 rounded-lg border border-accent/30 hover:bg-accent/5 transition-colors duration-200"
            >
              <div className="relative">
                <Menu className={`absolute ${ICON_SIZE} text-accent transition-all duration-300 group-hover:scale-110 ${open ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} aria-hidden={open} />
                <X className={`absolute ${ICON_SIZE} text-accent transition-all duration-300 group-hover:scale-110 ${open ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} aria-hidden={!open} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu: only render after mount to avoid SSR differences */}
        {mounted && (
          <div className={`md:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-2 pt-4 pb-6 space-y-2 rounded-xl mt-4 border border-accent/20 bg-card/50 backdrop-blur-sm">
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
                    className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-all duration-200 ${
                      isActive ? 'bg-accent/10 text-foreground' : 'text-foreground/80 hover:bg-accent/5'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <IconWrapper 
                      Icon={Icon} 
                      isActive={isActive}
                      showPulse={label === 'CHATBOT' && !isActive}
                    />
                    <span className="font-medium">{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
        </div>
      </nav>
    </>
  )
}

export default Navigation
