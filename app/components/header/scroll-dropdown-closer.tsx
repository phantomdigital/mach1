'use client'

import { useEffect, useRef } from 'react'
import { useDropdownStore } from './dropdown-store'

/**
 * Client component that closes header dropdowns when user scrolls
 * Uses native scroll events for optimal performance
 * 
 * Key fix: Tracks scroll start time to avoid closing dropdowns that were
 * opened AFTER scrolling started (prevents stale scroll events from closing
 * newly opened dropdowns in the compact header)
 */
export function ScrollDropdownCloser() {
  const { forceClose, openDropdown, openDropdownId, openedAt } = useDropdownStore()
  const reopenTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastMousePositionRef = useRef<{ x: number; y: number } | null>(null)
  const isScrollingRef = useRef(false)
  const scrollStartTimeRef = useRef<number | null>(null)

  useEffect(() => {
    // Track mouse position to check what's under cursor after scroll
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
      if (isScrollingRef.current) return
      if (!lastMousePositionRef.current) return

      const { x, y } = lastMousePositionRef.current
      const elementUnderMouse = document.elementFromPoint(x, y)
      
      if (!elementUnderMouse) return

      const dropdownContainer = elementUnderMouse.closest('[data-dropdown-id]')
      
      if (dropdownContainer) {
        const dropdownId = dropdownContainer.getAttribute('data-dropdown-id')
        if (dropdownId) {
          openDropdown(dropdownId)
        }
      }
    }

    // Function to close dropdowns on scroll
    const handleScroll = () => {
      const now = Date.now()
      
      // Record when this scroll sequence started
      if (!isScrollingRef.current) {
        scrollStartTimeRef.current = now
      }
      
      isScrollingRef.current = true
      
      // Clear any pending timeouts
      if (reopenTimeoutRef.current) {
        clearTimeout(reopenTimeoutRef.current)
        reopenTimeoutRef.current = null
      }
      if (scrollCheckTimeoutRef.current) {
        clearTimeout(scrollCheckTimeoutRef.current)
        scrollCheckTimeoutRef.current = null
      }

      // Only close if:
      // 1. There's a dropdown open
      // 2. The dropdown was opened BEFORE this scroll sequence started
      //    (prevents stale scroll events from closing newly opened dropdowns)
      if (openDropdownId && scrollStartTimeRef.current) {
        const dropdownOpenedBeforeScroll = !openedAt || openedAt < scrollStartTimeRef.current
        if (dropdownOpenedBeforeScroll) {
          forceClose()
        }
      }
      
      // After scrolling stops, check if mouse is over a navigation item
      scrollCheckTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
        scrollStartTimeRef.current = null
        reopenTimeoutRef.current = setTimeout(() => {
          checkAndReopenDropdown()
        }, 100)
      }, 200)
    }

    // Throttled scroll handler
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

    return () => {
      window.removeEventListener('scroll', handleNativeScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      if (reopenTimeoutRef.current) {
        clearTimeout(reopenTimeoutRef.current)
      }
      if (scrollCheckTimeoutRef.current) {
        clearTimeout(scrollCheckTimeoutRef.current)
      }
    }
  }, [forceClose, openDropdown, openDropdownId, openedAt])

  // This component doesn't render anything
  return null
}


