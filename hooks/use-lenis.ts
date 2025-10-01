import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface UseLenisOptions {
  /**
   * Enable or disable Lenis
   * @default true
   */
  enabled?: boolean
  /**
   * Priority level for Lenis instance
   * @default 0
   */
  priority?: number
}

/**
 * Hook to get the current Lenis instance
 * Use this to programmatically control scrolling
 */
export function useLenis({ enabled = true, priority = 0 }: UseLenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Get the global Lenis instance
    const lenis = (window as any).__lenis as Lenis | undefined
    
    if (lenis) {
      lenisRef.current = lenis
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
