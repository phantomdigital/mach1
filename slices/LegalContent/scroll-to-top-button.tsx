'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Scroll to top button that appears in the bottom right corner
 * and stays fixed while scrolling
 */
export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkScrollPosition = () => {
      const scrollY = window.scrollY ?? document.documentElement.scrollTop
      setIsVisible(scrollY > 300)
    }

    // Initial check
    checkScrollPosition()

    // Listen to scroll events
    window.addEventListener('scroll', checkScrollPosition, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', checkScrollPosition)
    }
  }, [])

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <Button
      onClick={handleClick}
      variant="default"
      className={cn(
        'fixed bottom-6 right-6 z-50 rounded-lg shadow-lg transition-all duration-300',
        'bg-dark-blue text-white hover:bg-dark-blue/80',
        'border-2 border-neutral-200',
        'w-14 h-14 p-0',
        'hover:shadow-md',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      aria-label="Scroll to top"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300"
      >
        <path
          d="M10 15V5M10 5L5 10M10 5L15 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        />
      </svg>
    </Button>
  )
}

