'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface LenisProviderProps {
  children: React.ReactNode
}

/**
 * Lenis smooth scroll provider optimized for performance.
 * Integrated with GSAP ScrollTrigger for seamless animations.
 */
export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Initialize Lenis with performance-optimized settings
    const lenis = new Lenis({
      duration: 1.0, // Faster duration for snappier feel and less lag
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.7, // Reduced for better control and performance
      touchMultiplier: 1.2, // Reduced for mobile performance
      infinite: false,
      // Performance optimizations
      syncTouch: true,
      syncTouchLerp: 0.15, // Faster sync for better responsiveness
    })

    lenisRef.current = lenis

    // Make Lenis instance globally available
    ;(window as typeof window & { __lenis?: unknown }).__lenis = lenis

    // Integrate Lenis with ScrollTrigger - optimized for performance
    // Only update ScrollTrigger when scroll position actually changes
    let lastScrollY = lenis.scroll
    
    function raf(time: number) {
      lenis.raf(time)
      
      // Only update ScrollTrigger if scroll position changed
      // This prevents unnecessary updates when animations are running
      const currentScrollY = lenis.scroll
      if (Math.abs(currentScrollY - lastScrollY) > 0.5) {
        ScrollTrigger.update()
        lastScrollY = currentScrollY
      }
      
      rafIdRef.current = requestAnimationFrame(raf)
    }

    // Start the animation frame
    rafIdRef.current = requestAnimationFrame(raf)

    // Initial ScrollTrigger refresh
    ScrollTrigger.refresh()

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
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
