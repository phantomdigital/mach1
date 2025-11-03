'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface GSAPSmoothScrollProviderProps {
  children: React.ReactNode
}

export default function GSAPSmoothScrollProvider({ children }: GSAPSmoothScrollProviderProps) {
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null)
  const isScrollingRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    let currentScroll = typeof window !== 'undefined' ? window.scrollY : 0
    let targetScroll = currentScroll
    const smoothness = 0.1 // Lower = smoother but slower response
    const maxSpeed = 200 // Maximum pixels per frame

    // Adaptive throttling - update less frequently when many ScrollTriggers are active
    let lastScrollTriggerUpdate = 0
    let frameCount = 0
    let lastScrollPosition = 0
    const baseUpdateInterval = 16 // ~60fps
    const maxUpdateInterval = 80 // Much slower when many triggers (was 50ms)

    // Smooth scroll update function
    const updateScroll = () => {
      const diff = targetScroll - currentScroll
      const distance = Math.abs(diff)
      
      if (distance > 0.5) {
        // Use ease-out for natural deceleration
        const speed = Math.min(maxSpeed, distance * smoothness)
        currentScroll += diff > 0 ? speed : -speed
        
        // Update scroll position
        window.scrollTo(0, currentScroll)
        
        // Adaptive throttling - check ScrollTrigger count and adjust update frequency
        frameCount++
        const now = performance.now()
        const activeTriggers = ScrollTrigger.getAll().length
        const scrollDelta = Math.abs(currentScroll - lastScrollPosition)
        
        // Very aggressive throttling when many ScrollTriggers are active
        // Also require larger scroll delta to prevent micro-updates
        let updateInterval = baseUpdateInterval
        let minScrollDelta = 3 // Minimum pixels to scroll before updating
        
        if (activeTriggers > 15) {
          updateInterval = maxUpdateInterval // 80ms - very slow
          minScrollDelta = 10 // Require 10px scroll change
        } else if (activeTriggers > 10) {
          updateInterval = 60 // Moderate throttle
          minScrollDelta = 8 // Require 8px scroll change
        } else if (activeTriggers > 5) {
          updateInterval = 40 // Light throttle
          minScrollDelta = 5 // Require 5px scroll change
        }
        
        // Only update if enough time has passed AND scroll changed significantly
        // This prevents unnecessary updates when scrolling slowly
        const shouldUpdate = now - lastScrollTriggerUpdate > updateInterval && scrollDelta > minScrollDelta
        
        if (shouldUpdate) {
          ScrollTrigger.update()
          lastScrollTriggerUpdate = now
          lastScrollPosition = currentScroll
          
          // Debug logging
          if (frameCount % 30 === 0) { // Log every 30 frames to avoid spam
            console.log(`[Smooth Scroll] Active ScrollTriggers: ${activeTriggers}, Update Interval: ${updateInterval}ms, Min Delta: ${minScrollDelta}px, Current Scroll: ${Math.round(currentScroll)}, Scroll Delta: ${Math.round(scrollDelta)}`)
          }
        }
        
        // Continue animation
        rafIdRef.current = requestAnimationFrame(updateScroll)
      } else {
        currentScroll = targetScroll
        window.scrollTo(0, currentScroll)
        // Final update when scrolling stops
        ScrollTrigger.update()
        const finalTriggers = ScrollTrigger.getAll().length
        console.log(`[Smooth Scroll] Stopped. Final ScrollTriggers: ${finalTriggers}, Scroll Position: ${Math.round(currentScroll)}`)
        frameCount = 0
        lastScrollPosition = currentScroll
        isScrollingRef.current = false
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = null
        }
      }
    }

    // Handle wheel events for smooth scrolling
    const handleWheel = (e: WheelEvent) => {
      // Prevent default to enable smooth scrolling
      e.preventDefault()
      
      const delta = e.deltaY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + delta))
      
      // Update current scroll position from actual window scroll
      currentScroll = window.scrollY
      
      if (!isScrollingRef.current) {
        const triggers = ScrollTrigger.getAll().length
        console.log(`[Smooth Scroll] Started scrolling. Active ScrollTriggers: ${triggers}`)
        isScrollingRef.current = true
        rafIdRef.current = requestAnimationFrame(updateScroll)
      }
    }

    // Handle native scroll (for scrollbar) - ScrollTrigger handles this automatically,
    // but we need to sync our smooth scroll state
    const handleNativeScroll = () => {
      // If scrollbar is used, sync our state and let ScrollTrigger handle it naturally
      if (!isScrollingRef.current) {
        currentScroll = window.scrollY
        targetScroll = window.scrollY
      }
    }

    // Update ScrollTrigger on resize (refresh is needed here for layout changes)
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    // Only intercept wheel events for smooth scrolling
    // Let native scroll events work normally (for scrollbar)
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', handleNativeScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    // Initialize ScrollTrigger - it works fine with native scrolling
    ScrollTrigger.refresh()

    // Expose scroll methods globally for compatibility with existing code
    const smoothScroll = {
      scrollTo: (target: string | number | HTMLElement, options?: { immediate?: boolean; duration?: number }) => {
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

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        scrollTarget = Math.max(0, Math.min(maxScroll, scrollTarget))

        if (options?.immediate) {
          currentScroll = scrollTarget
          targetScroll = scrollTarget
          window.scrollTo(0, currentScroll)
          ScrollTrigger.update()
        } else {
          const duration = options?.duration || 1.5
          scrollTweenRef.current?.kill()
          
          // Cancel any ongoing smooth scroll
          if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current)
            rafIdRef.current = null
          }
          isScrollingRef.current = false
          
          const startScroll = window.scrollY
          currentScroll = startScroll
          
          // Throttle ScrollTrigger updates during programmatic scroll
          let lastUpdate = 0
          scrollTweenRef.current = gsap.to({ value: startScroll }, {
            value: scrollTarget,
            duration,
            ease: 'power2.out',
            onUpdate: function() {
              const val = this.targets()[0].value
              currentScroll = val
              targetScroll = val
              window.scrollTo(0, val)
              
              // Adaptive throttling based on active ScrollTrigger count
              const now = performance.now()
              const activeTriggers = ScrollTrigger.getAll().length
              const updateInterval = activeTriggers > 10 ? maxUpdateInterval : baseUpdateInterval
              
              if (now - lastUpdate > updateInterval) {
                ScrollTrigger.update()
                lastUpdate = now
              }
            },
            onComplete: () => {
              ScrollTrigger.update()
              scrollTweenRef.current = null
            }
          })
        }
      },
      get scroll() {
        return currentScroll
      },
      destroy: () => {
        // Cleanup handled in useEffect return
      }
    }

    ;(window as typeof window & { __lenis?: typeof smoothScroll }).__lenis = smoothScroll

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', handleNativeScroll)
      window.removeEventListener('resize', handleResize)
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      scrollTweenRef.current?.kill()
      ;(window as typeof window & { __lenis?: unknown }).__lenis = undefined
    }
  }, [])

  return <>{children}</>
}
