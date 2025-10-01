'use client'

import { useEffect } from 'react'
import { useLenis } from '@/hooks/use-lenis'
import { useDropdownState } from './dropdown-state-context'

/**
 * Client component that closes header dropdowns when user scrolls
 * Uses Lenis smooth scroll events for optimal performance
 */
export function ScrollDropdownCloser() {
  const lenis = useLenis()
  const { closeDropdown, openDropdownId } = useDropdownState()

  useEffect(() => {
    if (!lenis) return

    // Function to close dropdowns on scroll
    const handleScroll = () => {
      // Only close if there's actually a dropdown open
      if (openDropdownId) {
        closeDropdown()
      }
    }

    // Listen to Lenis scroll events for smooth performance
    lenis.on('scroll', handleScroll)

    // Cleanup
    return () => {
      lenis.off('scroll', handleScroll)
    }
  }, [lenis, closeDropdown, openDropdownId])

  // This component doesn't render anything
  return null
}


