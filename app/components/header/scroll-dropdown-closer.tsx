'use client'

import { useEffect } from 'react'
import { useLenis } from '@/hooks/use-lenis'
import { useDropdownState } from './dropdown-state-context'

/**
 * Client component that closes header dropdowns when user scrolls
 * Uses both Lenis and native scroll events for comprehensive coverage
 */
export function ScrollDropdownCloser() {
  const lenis = useLenis()
  const { closeDropdown, openDropdownId } = useDropdownState()

  useEffect(() => {
    // Function to close dropdowns on scroll
    const handleScroll = () => {
      // Only close if there's actually a dropdown open
      if (openDropdownId) {
        closeDropdown()
      }
    }

    // Listen to native scroll events (catches all scroll scenarios)
    let ticking = false
    const handleNativeScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleNativeScroll, { passive: true })

    // Also listen to Lenis scroll events if available and it supports event listeners
    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', handleScroll)
    }

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleNativeScroll)
      if (lenis && typeof lenis.off === 'function') {
        lenis.off('scroll', handleScroll)
      }
    }
  }, [lenis, closeDropdown, openDropdownId])

  // This component doesn't render anything
  return null
}


