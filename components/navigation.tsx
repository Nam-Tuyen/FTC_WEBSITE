'use client'

"use client"
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, Zap, Shield, Cpu, Info, Bot } from 'lucide-react'
import Image from 'next/image'

interface NavigationItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

// Static, deterministic labels to avoid SSR/CSR mismatch
const NAV: NavigationItem[] = [
  { label: 'TRANG CHỦ', href: '/', icon: Zap },
  { label: 'THÔNG TIN', href: '/thong-tin', icon: Info },
  { label: 'THÀNH TÍCH', href: '/thanh-tich', icon: Shield },
  { label: 'HOẠT ĐỘNG', href: '/hoat-dong', icon: Cpu },
  { label: 'CƠ CẤU', href: '/co-cau', icon: Shield },
  { label: 'DIỄN ĐÀN', href: '/dien-dan', icon: Zap },
  { label: 'ỨNG TUYỂN', href: '/ung-tuyen', icon: Cpu },
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

  return (
    <nav suppressHydrationWarning className="gradient-bg border-b border-accent/30 sticky top-0 z-50 backdrop-blur-md">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-4 group">
              <div className="relative">
                <Image
                  src="/ftc-logo.png"
                  alt="Financial Technology Club Logo"
                  width={40}
                  height={40}
                  className="rounded-full glow transition-all"
                  priority
                />
                <div className="absolute inset-0 rounded-full border-2 border-accent" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-foreground font-extrabold tracking-wide leading-none text-[28px]">FTC</span>
                <span className="text-[10px] sm:text-xs text-accent tracking-wide">&nbsp;</span>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:block">
            <div className="ml-4 lg:ml-10 flex items-center gap-3">
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
                    <Icon className="nav-icon h-4 w-4 text-accent" aria-hidden="true" />
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
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-accent/30"
            >
              <Menu className={`absolute h-6 w-6 transition ${open ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} aria-hidden={open} />
              <X className={`absolute h-6 w-6 transition ${open ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} aria-hidden={!open} />
            </button>
          </div>
        </div>

        {/* Mobile menu: only render after mount to avoid SSR differences */}
        {mounted && (
          <div className={`md:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-2 pt-4 pb-6 space-y-2 rounded-xl mt-4 border border-accent/20 bg-card/50">
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-base" onClick={() => setOpen(false)}>
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <span className="text-foreground/80">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
