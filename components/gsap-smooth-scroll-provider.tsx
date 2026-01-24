'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface GSAPSmoothScrollProviderProps {
  children: React.ReactNode
}

/**
 * GSAP ScrollTrigger provider.
 * Uses native browser scrolling.
 */
export default function GSAPSmoothScrollProvider({ children }: GSAPSmoothScrollProviderProps) {
  useEffect(() => {
    ScrollTrigger.refresh()

    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <>{children}</>
}
