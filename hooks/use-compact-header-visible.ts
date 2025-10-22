'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to track if the compact header is visible
 * This allows other components (like sticky navs) to adjust their positioning
 */
export function useCompactHeaderVisible() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Same threshold as compact header
  const SCROLL_THRESHOLD = 300;

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsVisible(currentScrollY > SCROLL_THRESHOLD);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isVisible;
}

