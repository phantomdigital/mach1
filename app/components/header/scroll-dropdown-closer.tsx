'use client'

import { useEffect, useRef } from 'react'
import { useLenis } from '@/hooks/use-lenis'
import { useDropdownState } from './dropdown-state-context'

/**
 * Client component that closes header dropdowns when user scrolls
 * Uses both Lenis and native scroll events for comprehensive coverage
 * Reopens dropdown if mouse is still over navigation item after scroll
 */
export function ScrollDropdownCloser() {
  const lenis = useLenis()
  const { closeDropdown, openDropdown, openDropdownId } = useDropdownState()
  const reopenTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastMousePositionRef = useRef<{ x: number; y: number } | null>(null)
  const isScrollingRef = useRef(false)

  useEffect(() => {
    // Track mouse position to check what's under cursor after scroll
    // Throttle mousemove events to improve performance
    let mouseMoveTicking = false
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseMoveTicking) {
        window.requestAnimationFrame(() => {
          lastMousePositionRef.current = { x: e.clientX, y: e.clientY }
          mouseMoveTicking = false
        })
        mouseMoveTicking = true
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Function to check if mouse is over a navigation dropdown and reopen it
    const checkAndReopenDropdown = () => {
      // Don't reopen if still scrolling
      if (isScrollingRef.current) return
      
      if (!lastMousePositionRef.current) return

      const { x, y } = lastMousePositionRef.current
      const elementUnderMouse = document.elementFromPoint(x, y)
      
      if (!elementUnderMouse) return

      // Find the closest navigation dropdown container
      const dropdownContainer = elementUnderMouse.closest('[data-dropdown-id]')
      
      if (dropdownContainer) {
        const dropdownId = dropdownContainer.getAttribute('data-dropdown-id')
        if (dropdownId) {
          // Programmatically reopen the dropdown
          // The navigation dropdown's useEffect will clear any pending timeout
          openDropdown(dropdownId)
        }
      }
    }

    // Function to close dropdowns on scroll
    const handleScroll = () => {
      // Mark that we're scrolling
      isScrollingRef.current = true
      
      // Clear any pending reopen timeout
      if (reopenTimeoutRef.current) {
        clearTimeout(reopenTimeoutRef.current)
        reopenTimeoutRef.current = null
      }
      
      // Clear any pending scroll check timeout
      if (scrollCheckTimeoutRef.current) {
        clearTimeout(scrollCheckTimeoutRef.current)
        scrollCheckTimeoutRef.current = null
      }

      // Only close if there's actually a dropdown open
      if (openDropdownId) {
        closeDropdown()
      }
      
      // After scrolling stops, check if mouse is still over a navigation item
      // Debounce: wait for scroll to stop before checking
      scrollCheckTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
        // Small delay to ensure DOM has updated after dropdown closed
        reopenTimeoutRef.current = setTimeout(() => {
          checkAndReopenDropdown()
        }, 100) // Increased delay to ensure DOM is ready
      }, 200) // Wait 200ms after last scroll event before checking
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
      window.removeEventListener('mousemove', handleMouseMove)
      if (lenis && typeof lenis.off === 'function') {
        lenis.off('scroll', handleScroll)
      }
      if (reopenTimeoutRef.current) {
        clearTimeout(reopenTimeoutRef.current)
      }
      if (scrollCheckTimeoutRef.current) {
        clearTimeout(scrollCheckTimeoutRef.current)
      }
    }
  }, [lenis, closeDropdown, openDropdown, openDropdownId])

  // This component doesn't render anything
  return null
}


