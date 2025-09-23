import { useEffect, useRef } from 'react'

/**
 * Custom hook for handling automatic scroll to bottom in chat
 */
export function useChatScroll<T extends HTMLElement = HTMLDivElement>(dependency?: any) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      })
    }
  }, [dependency])

  return ref
}

/**
 * Custom hook for smooth scroll to element
 */
export function useScrollToElement() {
  const scrollToElement = (
    element: HTMLElement | null,
    options: ScrollIntoViewOptions = { behavior: "smooth" }
  ) => {
    if (element) {
      element.scrollIntoView(options)
    }
  }

  const scrollToTop = (container?: HTMLElement | null) => {
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const scrollToBottom = (container?: HTMLElement | null) => {
    if (container) {
      container.scrollTo({ 
        top: container.scrollHeight, 
        behavior: "smooth" 
      })
    } else {
      window.scrollTo({ 
        top: document.documentElement.scrollHeight, 
        behavior: "smooth" 
      })
    }
  }

  return {
    scrollToElement,
    scrollToTop,
    scrollToBottom
  }
}
