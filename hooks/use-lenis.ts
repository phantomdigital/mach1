import { useEffect, useRef } from 'react'

interface ScrollInstance {
  scrollTo: (target: string | number | HTMLElement, options?: { immediate?: boolean; duration?: number; offset?: number }) => void
  scroll: number
  stop?: () => void
  start?: () => void
  destroy?: () => void
}

interface UseLenisOptions {
  /**
   * Enable or disable scroll instance
   * @default true
   */
  enabled?: boolean
  /**
   * Priority level for scroll instance
   * @default 0
   */
  priority?: number
}

/**
 * Hook to get the current scroll instance (compatible with Lenis API)
 * Uses native scrolling with GSAP for programmatic scrollTo
 */
export function useLenis({ enabled = true, priority = 0 }: UseLenisOptions = {}) {
  const lenisRef = useRef<ScrollInstance | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Get the global scroll instance (provided by GSAPSmoothScrollProvider)
    const scrollInstance = (window as any).__lenis as ScrollInstance | undefined
    
    if (scrollInstance) {
      lenisRef.current = scrollInstance
    }

    return () => {
      lenisRef.current = null
    }
  }, [enabled])

  return lenisRef.current
}

/**
 * Hook to scroll to a specific element or position
 */
export function useScrollTo() {
  const lenis = useLenis()

  const scrollTo = (target: string | number | HTMLElement, options?: any) => {
    if (lenis) {
      lenis.scrollTo(target, options)
    }
  }

  const scrollToTop = (options?: any) => {
    scrollTo(0, options)
  }

  const scrollToElement = (selector: string, options?: any) => {
    const element = document.querySelector(selector)
    if (element) {
      scrollTo(element as HTMLElement, options)
    }
  }

  return {
    scrollTo,
    scrollToTop,
    scrollToElement,
    lenis
  }
}
