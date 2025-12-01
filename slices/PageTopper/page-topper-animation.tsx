"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Home } from "lucide-react";
import Link from "next/link";

interface PageTopperAnimationProps {
  subheading?: string;
  heading?: string;
  paragraph?: string;
}

/**
 * Client component that handles text animations for PageTopper.
 * 
 * Progressive Enhancement Strategy:
 * - Content is visible by default (opacity: 1)
 * - When JS loads, we add 'js-ready' class to hide content
 * - Then animate it back to visible
 * - If JS fails, content remains visible (good for SEO and accessibility)
 */
export function PageTopperAnimation({ subheading, heading, paragraph }: PageTopperAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const homeIconRef = useRef<HTMLAnchorElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const splitsRef = useRef<SplitText[]>([]);
  const hasAnimatedRef = useRef(false);
  const [jsReady, setJsReady] = useState(false);

  // Memoized cleanup function
  const cleanup = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    
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
    
    gsap.registerPlugin(SplitText);
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

    timelineRef.current = gsap.timeline({
      defaults: {
        ease: "expo.out",
        force3D: true,
      }
    });

    const tl = timelineRef.current;

    // Animate home icon
    if (homeIconRef.current) {
      gsap.set(homeIconRef.current, { 
        opacity: 0, 
        y: 20,
        willChange: "transform, opacity"
      });
      
      tl.to(homeIconRef.current, {
        duration: 0.6,
        opacity: 1,
        y: 0,
        onComplete: () => {
          gsap.set(homeIconRef.current, { willChange: "auto" });
        }
      });
    }

    // Animate text elements
    if (textElements.length > 0) {
      gsap.set(textElements, { 
        opacity: 1,
        willChange: "transform, opacity"
      });

      textElements.forEach((element, index) => {
        const split = new SplitText(element, {
          type: "words,lines",
          linesClass: "line",
        });
        
        splitsRef.current.push(split);

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
            gsap.set(split.lines, { willChange: "auto" });
            gsap.set(element, { willChange: "auto" });
          }
        }, delay + (index * 0.1));
      });
    }

    hasAnimatedRef.current = true;
  }, [subheading, heading, paragraph, cleanup]);

  useEffect(() => {
    // Mark JS as ready - this will hide content before animation
    setJsReady(true);
    
    // Small delay to ensure the hide class is applied before animation starts
    const animationFrame = requestAnimationFrame(() => {
      if (document.fonts.status === 'loaded') {
        animate();
      } else {
        document.fonts.ready.then(animate);
      }
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      cleanup();
      hasAnimatedRef.current = false;
    };
  }, [animate, cleanup]);

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 mb-5">
        {/* Home Breadcrumb - hidden initially, animated in */}
        <Link 
          ref={homeIconRef}
          href="/"
          className="text-red-200 text-xs font-bold tracking-wider uppercase px-3 py-1.5 lg:px-4 lg:py-2 bg-mach1-red rounded-2xl w-fit flex items-center hover:bg-red-700 transition-colors transform-gpu"
          style={{ 
            // Start invisible, animate will set opacity
            opacity: jsReady ? 0 : 1 
          }}
        >
          <Home className="w-3 h-3 lg:w-4 lg:h-4" />
        </Link>
        
        {/* Current Page Breadcrumb */}
        {subheading && (
          <h5 
            ref={subheadingRef}
            className="text-red-200 text-xs font-bold tracking-wider uppercase px-3 py-1.5 lg:px-4 lg:py-2 bg-mach1-red rounded-2xl w-fit transform-gpu overflow-hidden"
            style={{ 
              // Visible by default, animation handles the reveal
              opacity: jsReady ? 1 : 1 
            }}
          >
            {subheading}
          </h5>
        )}
      </nav>

      {/* Heading - visible by default, animated when JS loads */}
      {heading && (
        <h2 
          ref={headingRef}
          className="text-neutral-100 text-3xl md:text-4xl lg:text-6xl font-bold leading-tight transform-gpu overflow-hidden"
          style={{ 
            opacity: jsReady ? 1 : 1 
          }}
        >
          {heading}
        </h2>
      )}

      {/* Paragraph - visible by default, animated when JS loads */}
      {paragraph && (
        <p 
          ref={paragraphRef}
          className="text-neutral-200 text-xs md:text-sm lg:text-lg max-w-3xl transform-gpu mt-6 overflow-hidden"
          style={{ 
            opacity: jsReady ? 1 : 1 
          }}
        >
          {paragraph}
        </p>
      )}
    </div>
  );
}
