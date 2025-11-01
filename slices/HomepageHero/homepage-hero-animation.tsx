"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Badge } from "@/components/ui/badge";

interface HomepageHeroAnimationProps {
  subheading?: string;
  heading?: string;
  description?: string;
  textColors: {
    subheading: string;
    heading: string;
    description: string;
  };
  badgeButtonText?: string;
  badgeButtonLink?: any;
}

export function HomepageHeroAnimation({
  subheading,
  heading,
  description,
  textColors,
  badgeButtonText,
  badgeButtonLink,
}: HomepageHeroAnimationProps) {
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
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

    if (descriptionRef.current && description) {
      textElements.push(descriptionRef.current);
    }

    // Create timeline with performance optimizations
    timelineRef.current = gsap.timeline({
      defaults: {
        ease: "expo.out",
        force3D: true, // Force GPU acceleration
      },
    });

    const tl = timelineRef.current;

    // Animate text elements with optimizations
    if (textElements.length > 0) {
      // Set initial state with GPU acceleration hints
      gsap.set(textElements, {
        opacity: 1,
        willChange: "transform, opacity",
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
          willChange: "transform, opacity",
        });

        // Stagger animation for each element
        tl.to(
          split.lines,
          {
            duration: 0.8,
            yPercent: 0,
            opacity: 1,
            stagger: 0.08,
            onComplete: () => {
              // Remove will-change after animation
              gsap.set(split.lines, { willChange: "auto" });
              gsap.set(element, { willChange: "auto" });
            },
          },
          index * 0.15
        );
      });
    }

    hasAnimatedRef.current = true;
  }, [subheading, heading, description, cleanup]);

  useEffect(() => {
    // Use requestAnimationFrame for better performance
    const animationFrame = requestAnimationFrame(() => {
      // Check if fonts are already loaded, otherwise wait
      if (document.fonts.status === "loaded") {
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
    <div className="space-y-6">

      {/* Heading */}
      {heading && (
        <h1
          ref={headingRef}
          className={`${textColors.heading} font-bold opacity-0 transform-gpu`}
          style={{ 
            willChange: "auto",
            fontSize: '52px',
            lineHeight: '1.15'
          }}
        >
          {heading}
        </h1>
      )}

      {/* Description */}
      {description && (
        <p
          ref={descriptionRef}
          className={`${textColors.description} opacity-0 transform-gpu`}
          style={{ 
            willChange: "auto",
            fontSize: '16px',
            lineHeight: '1.7',
            maxWidth: '540px'
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

