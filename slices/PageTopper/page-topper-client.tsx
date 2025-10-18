"use client";

import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface PageTopperClientProps {
  children: ReactNode;
}

export function PageTopperClient({ children }: PageTopperClientProps): React.ReactElement | null {
  const searchParams = useSearchParams();
  
  // Hide PageTopper when in quote flow (step query param exists)
  const hasStepParam = searchParams.has("step");
  
  // Handle mobile viewport height changes
  useEffect(() => {
    const setViewportHeight = () => {
      // Get the actual viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial value
    setViewportHeight();

    // Update on resize (handles mobile browser UI changes)
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);
  
  if (hasStepParam) {
    return null;
  }

  return <>{children}</>;
}

