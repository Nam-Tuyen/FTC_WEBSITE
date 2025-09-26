import { useState, useEffect } from 'react'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export function useResponsive() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs')
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setWindowSize({ width, height })

      // Determine current breakpoint
      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl')
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl')
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg')
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md')
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint('sm')
      } else {
        setCurrentBreakpoint('xs')
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const isMobile = currentBreakpoint === 'xs' || currentBreakpoint === 'sm'
  const isTablet = currentBreakpoint === 'md'
  const isDesktop = currentBreakpoint === 'lg' || currentBreakpoint === 'xl' || currentBreakpoint === '2xl'
  const isLargeScreen = currentBreakpoint === 'xl' || currentBreakpoint === '2xl'

  return {
    currentBreakpoint,
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    breakpoints
  }
}
