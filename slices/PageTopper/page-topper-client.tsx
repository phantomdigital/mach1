"use client";

import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface PageTopperClientProps {
  children: ReactNode;
}

/**
 * Wrapper component that handles viewport height calculation.
 * Separated from visibility logic to avoid Suspense requirement.
 * Sets the height ONCE on load to prevent jumping when mobile browser UI shows/hides.
 */
export function PageTopperClient({ children }: PageTopperClientProps): React.ReactElement {
  // Set viewport height ONCE on initial load only
  useEffect(() => {
    const setViewportHeight = () => {
      // Get the largest possible viewport height (when browser UI is hidden)
      // This ensures the hero doesn't jump when address bar appears
      const vh = Math.max(window.innerHeight, document.documentElement.clientHeight) * 0.01;
      document.documentElement.style.setProperty('--page-topper-vh', `${vh}px`);
    };

    // Set initial value only once
    setViewportHeight();

    // Only update on orientation change (not on resize which includes browser UI changes)
    const handleOrientationChange = () => {
      // Small delay to let the orientation change complete
      setTimeout(setViewportHeight, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return <>{children}</>;
}

/**
 * Visibility controller that checks URL params.
 * Must be wrapped in Suspense due to useSearchParams().
 */
export function PageTopperVisibilityController({ children }: PageTopperClientProps): React.ReactElement | null {
  const searchParams = useSearchParams();
  
  // Hide PageTopper when in quote flow (step query param exists)
  const hasStepParam = searchParams.has("step");
  
  if (hasStepParam) {
    return null;
  }

  return <>{children}</>;
}

