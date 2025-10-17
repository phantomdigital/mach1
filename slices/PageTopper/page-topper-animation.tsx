"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Home } from "lucide-react";
import Link from "next/link";

interface PageTopperAnimationProps {
  subheading?: string;
  heading?: string;
  paragraph?: string;
}

export function PageTopperAnimation({ subheading, heading, paragraph }: PageTopperAnimationProps) {
  const homeIconRef = useRef<HTMLAnchorElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const splitsRef = useRef<SplitText[]>([]);
  const hasAnimatedRef = useRef(false);

  // Memoized cleanup function
  const cleanup = useCallback(() => {
    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    
    // Revert all SplitText instances
    splitsRef.current.forEach((split) => {
      if (split && split.revert) {
        split.revert();
      }
    });
    splitsRef.current = [];
  }, []);

  // Optimized animation function
  const animate = useCallback(() => {
    if (hasAnimatedRef.current) return;
    
    // Register plugin once
    gsap.registerPlugin(SplitText);
    
    // Clean up any existing animations
    cleanup();
    
    const textElements: HTMLElement[] = [];
    
    if (subheadingRef.current && subheading) {
      textElements.push(subheadingRef.current);
    }
    
    if (headingRef.current && heading) {
      textElements.push(headingRef.current);
    }
    
    if (paragraphRef.current && paragraph) {
      textElements.push(paragraphRef.current);
    }

    // Create timeline with performance optimizations
    timelineRef.current = gsap.timeline({
      defaults: {
        ease: "expo.out",
        force3D: true, // Force GPU acceleration
      }
    });

    const tl = timelineRef.current;

    // Animate home icon with GPU acceleration
    if (homeIconRef.current) {
      gsap.set(homeIconRef.current, { 
        opacity: 0, 
        y: 20,
        willChange: "transform, opacity" // Optimize for animations
      });
      
      tl.to(homeIconRef.current, {
        duration: 0.6,
        opacity: 1,
        y: 0,
        onComplete: () => {
          // Remove will-change after animation
          gsap.set(homeIconRef.current, { willChange: "auto" });
        }
      });
    }

    // Animate text elements with optimizations
    if (textElements.length > 0) {
      // Set initial state with GPU acceleration hints
      gsap.set(textElements, { 
        opacity: 1,
        willChange: "transform, opacity"
      });

      // Create SplitText instances more efficiently
      textElements.forEach((element, index) => {
        const split = new SplitText(element, {
          type: "words,lines",
          linesClass: "line",
        });
        
        splitsRef.current.push(split);

        // Set initial state for lines
        gsap.set(split.lines, {
          yPercent: 100,
          opacity: 0,
          willChange: "transform, opacity"
        });

        const delay = homeIconRef.current ? 0.2 : 0;
        
        tl.to(split.lines, {
          duration: 0.6,
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          onComplete: () => {
            // Remove will-change after animation
            gsap.set(split.lines, { willChange: "auto" });
            gsap.set(element, { willChange: "auto" });
          }
        }, delay + (index * 0.1));
      });
    }

    hasAnimatedRef.current = true;
  }, [subheading, heading, paragraph, cleanup]);

  useEffect(() => {
    // Use requestAnimationFrame for better performance
    const animationFrame = requestAnimationFrame(() => {
      // Check if fonts are already loaded, otherwise wait
      if (document.fonts.status === 'loaded') {
        animate();
      } else {
        document.fonts.ready.then(animate);
      }
    });

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrame);
      cleanup();
      hasAnimatedRef.current = false;
    };
  }, [animate, cleanup]);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 mb-5">
        {/* Home Breadcrumb */}
        <Link 
          ref={homeIconRef}
          href="/"
          className="text-red-200 text-sm lg:text-xs font-bold tracking-wider uppercase px-4 py-2 bg-mach1-red rounded-2xl w-fit flex items-center hover:bg-red-700 transition-colors opacity-0 transform-gpu"
          style={{ willChange: 'auto' }}
        >
          <Home className="w-4 h-4" />
        </Link>
        
        {/* Separator */}
        {subheading && (
          <>
            {/* Current Page Breadcrumb */}
            <h5 
              ref={subheadingRef}
              className="text-red-200 text-sm lg:text-xs font-bold tracking-wider uppercase px-4 py-2 bg-mach1-red rounded-2xl w-fit opacity-0 transform-gpu"
              style={{ willChange: 'auto' }}
            >
              {subheading}
            </h5>
          </>
        )}
      </nav>

      {/* Heading */}
      {heading && (
        <h2 
          ref={headingRef}
          className="text-neutral-100 text-3xl md:text-4xl lg:text-6xl font-bold leading-tight opacity-0 transform-gpu"
          style={{ willChange: 'auto' }}
        >
          {heading}
        </h2>
      )}

      {/* Paragraph */}
      {paragraph && (
        <p 
          ref={paragraphRef}
          className="text-neutral-200 text-xs md:text-sm lg:text-lg max-w-3xl opacity-0 transform-gpu mt-6"
          style={{ willChange: 'auto' }}
        >
          {paragraph}
        </p>
      )}
    </div>
  );
}

