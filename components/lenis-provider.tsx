'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface LenisProviderProps {
  children: React.ReactNode
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
      orientation: 'vertical', // vertical, horizontal
      gestureOrientation: 'vertical', // vertical, horizontal, both
      smoothWheel: true, // Smooth scrolling for mouse wheel events
      wheelMultiplier: 1, // Multiply wheel delta by this value
      touchMultiplier: 2, // Multiply touch delta by this value
      infinite: false, // Enable infinite scrolling
    })

    lenisRef.current = lenis

    // Make Lenis instance globally available
    ;(window as typeof window & { __lenis?: unknown }).__lenis = lenis

    // Animation frame function
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    // Start the animation frame
    requestAnimationFrame(raf)

    // Cleanup function
    return () => {
      lenis.destroy()
      lenisRef.current = null
      ;(window as typeof window & { __lenis?: unknown }).__lenis = null
    }
  }, [])

  return <>{children}</>
}
