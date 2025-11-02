'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface LenisProviderProps {
  children: React.ReactNode
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Initialize Lenis with optimized settings
    const lenis = new Lenis({
      duration: 1.0, // Reduced from 1.2 for snappier response
      easing: (t) => 1 - Math.pow(1 - t, 3), // Optimized easing (cubic ease-out, faster than exponential)
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      // Performance optimizations
      syncTouch: true, // Sync touch events for better mobile performance
      syncTouchLerp: 0.075, // Smooth touch sync
    })

    lenisRef.current = lenis

    // Make Lenis instance globally available
    ;(window as typeof window & { __lenis?: unknown }).__lenis = lenis

    // Optimized animation frame function
    // Lenis needs RAF to run continuously, but we can optimize by checking internal state
    function raf(time: number) {
      lenis.raf(time)
      rafIdRef.current = requestAnimationFrame(raf)
    }

    // Start the animation frame
    rafIdRef.current = requestAnimationFrame(raf)

    // Cleanup function
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
      lenis.destroy()
      lenisRef.current = null
      ;(window as typeof window & { __lenis?: unknown }).__lenis = null
    }
  }, [])

  return <>{children}</>
}
