'use client';

import { useEffect } from 'react';

/**
 * Client component that tracks and updates the header height as a CSS variable.
 * This allows the mobile menu to position itself correctly below the header.
 * Uses getBoundingClientRect() to get the full height regardless of scroll position.
 */
export function HeaderHeightTracker() {
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        // Get the actual position relative to the viewport
        const rect = header.getBoundingClientRect();
        // Use the bottom position which accounts for scroll
        const bottomPosition = rect.bottom;
        document.documentElement.style.setProperty('--header-height', `${bottomPosition}px`);
      }
    };

    // Initial measurement - delay slightly to ensure header is fully rendered
    requestAnimationFrame(() => {
      updateHeaderHeight();
    });

    // Update on resize
    window.addEventListener('resize', updateHeaderHeight);
    
    // Update on scroll - this is critical for absolute positioned headers
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateHeaderHeight();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Use ResizeObserver for more accurate tracking (in case header content changes)
    const header = document.querySelector('header');
    let resizeObserver: ResizeObserver | null = null;
    
    if (header && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateHeaderHeight);
      resizeObserver.observe(header);
    }

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('scroll', handleScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return null;
}

