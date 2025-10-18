'use client';

import { useEffect } from 'react';

/**
 * Client component that tracks and updates the header height as a CSS variable.
 * This allows the mobile menu to position itself correctly below the header.
 */
export function HeaderHeightTracker() {
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    // Initial measurement
    updateHeaderHeight();

    // Update on resize
    window.addEventListener('resize', updateHeaderHeight);

    // Use ResizeObserver for more accurate tracking (in case header content changes)
    const header = document.querySelector('header');
    let resizeObserver: ResizeObserver | null = null;
    
    if (header && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateHeaderHeight);
      resizeObserver.observe(header);
    }

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return null;
}

