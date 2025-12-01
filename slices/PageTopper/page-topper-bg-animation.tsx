"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";

interface PageTopperBgAnimationProps {
  children: ReactNode;
}

/**
 * Client wrapper that handles the scale animation for the background image.
 * The image is rendered server-side inside this wrapper, already in position.
 * This component only adds the animation enhancement.
 * 
 * Uses CSS to set initial scale state, so there's no flash if JS is slow.
 */
export function PageTopperBgAnimation({ children }: PageTopperBgAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current) return;
    
    hasAnimatedRef.current = true;

    // Animate from scaled state (set via CSS) to normal
    gsap.to(containerRef.current, {
      scale: 1,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.1,
      onComplete: () => {
        if (containerRef.current) {
          // Remove transform to let CSS handle final state
          containerRef.current.style.transform = '';
          containerRef.current.style.willChange = 'auto';
        }
      },
    });

    return () => {
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 transform-gpu"
      style={{ 
        // Initial scale set via inline style - image appears scaled immediately (no JS wait)
        // If JS fails, image is slightly zoomed but still visible
        transform: 'scale(1.05)',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
}

