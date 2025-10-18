"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ImageAnimationProps {
  children: ReactNode;
}

interface TextAnimationProps {
  children: ReactNode;
  delay?: number;
}

/**
 * Image animation using GSAP with IntersectionObserver
 * - Container fades in from opacity 0 to 1
 * - Image element inside scales from 1.05 to 1 (zoom-in effect)
 * - Both animations happen simultaneously when scrolled into view
 * Triggers when element comes into view for multiple slices on same page
 * 
 * The container should have the clipped shape, and children should contain
 * an element with data-image-scale attribute that will receive the scale animation
 */
export function ImageAnimation({ children }: ImageAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const imageElement = container.querySelector('[data-image-scale]') as HTMLElement;

    if (!imageElement) return;

    // Set initial states immediately
    gsap.set(container, {
      opacity: 0,
      willChange: "opacity",
    });
    
    gsap.set(imageElement, {
      scale: 1.05,
      willChange: "transform",
    });

    // Use IntersectionObserver to trigger animation when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            
            // Animate container fade in
            gsap.to(container, {
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              onComplete: () => {
                gsap.set(container, { willChange: "auto" });
              },
            });
            
            // Animate image scale (with slight delay)
            gsap.to(imageElement, {
              scale: 1,
              duration: 1.2,
              ease: "power2.out",
              delay: 0.1,
              onComplete: () => {
                gsap.set(imageElement, { willChange: "auto" });
              },
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "-50px",
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}

/**
 * Text animation using Framer Motion - scroll-triggered fade-up
 * Matches Services slice animation pattern
 */
export function TextAnimation({ children, delay = 0 }: TextAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px", amount: 0.3 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

