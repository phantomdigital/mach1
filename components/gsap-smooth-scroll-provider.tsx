'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface GSAPSmoothScrollProviderProps {
  children: React.ReactNode
}

/**
 * Scroll provider that uses native browser scrolling for optimal performance.
 * ScrollTrigger works perfectly with native scrolling.
 * Only provides programmatic scrollTo functionality for compatibility.
 */
export default function GSAPSmoothScrollProvider({ children }: GSAPSmoothScrollProviderProps) {
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    // Initialize ScrollTrigger - it works perfectly with native scrolling
    ScrollTrigger.refresh()

    // Handle resize events
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    // Expose scroll methods globally for compatibility with existing code
    // Uses GSAP for smooth programmatic scrolling when needed
    const smoothScroll = {
      scrollTo: (target: string | number | HTMLElement, options?: { immediate?: boolean; duration?: number; offset?: number; easing?: (t: number) => number }) => {
        let scrollTarget = 0
        
        if (typeof target === 'number') {
          scrollTarget = target
        } else if (typeof target === 'string') {
          const element = document.querySelector(target) as HTMLElement
          if (element) {
            scrollTarget = window.scrollY + element.getBoundingClientRect().top
          }
        } else if (target instanceof HTMLElement) {
          scrollTarget = window.scrollY + target.getBoundingClientRect().top
        }

        // Apply offset if provided
        if (options?.offset) {
          scrollTarget += options.offset
        }

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        scrollTarget = Math.max(0, Math.min(maxScroll, scrollTarget))

        if (options?.immediate) {
          window.scrollTo(0, scrollTarget)
          ScrollTrigger.update()
        } else {
          const duration = options?.duration || 1.2
          scrollTweenRef.current?.kill()
          
          const startScroll = window.scrollY
          
          // Use custom easing if provided, otherwise default to power2.out
          const ease = options?.easing 
            ? options.easing 
            : 'power2.out'
          
          scrollTweenRef.current = gsap.to({ value: startScroll }, {
            value: scrollTarget,
            duration,
            ease,
            onUpdate: function() {
              const val = this.targets()[0].value
              window.scrollTo(0, val)
              // ScrollTrigger automatically updates on scroll events
            },
            onComplete: () => {
              ScrollTrigger.update()
              scrollTweenRef.current = null
            }
          })
        }
      },
      get scroll() {
        return window.scrollY
      },
      stop: () => {
        scrollTweenRef.current?.kill()
        scrollTweenRef.current = null
      },
      start: () => {
        // No-op - native scrolling is always active
      },
      destroy: () => {
        // Cleanup handled in useEffect return
      }
    }

    ;(window as typeof window & { __lenis?: typeof smoothScroll }).__lenis = smoothScroll

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      scrollTweenRef.current?.kill()
      ;(window as typeof window & { __lenis?: unknown }).__lenis = undefined
    }
  }, [])

  return <>{children}</>
}
