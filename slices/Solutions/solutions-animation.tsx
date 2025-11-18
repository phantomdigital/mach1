"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SolutionsAnimationProps {
  children: React.ReactNode;
}

export default function SolutionsAnimation({ children }: SolutionsAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const animationInitializedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || animationInitializedRef.current) return;

    // Simple check: if element is far from viewport, delay ScrollTrigger initialization
    const initScrollTrigger = () => {
      if (animationInitializedRef.current) return;
      animationInitializedRef.current = true;

      const ctx = gsap.context(() => {
            const header = section.querySelector("[data-animate='header']");
            const cards = section.querySelectorAll("[data-animate='card']");
            const button = section.querySelector("[data-animate='button']");

            if (!header && !cards && !button) {
              return;
            }

            // Create a single master timeline with all animations
            // Optimized trigger point - starts later to reduce lag when scrolling
            const masterTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 95%", // Even later trigger for better performance
                end: "top 50%",
                toggleActions: "play none none none",
                once: true,
                markers: false,
                invalidateOnRefresh: false,
                refreshPriority: -1, // Lower priority to reduce checks
              },
            });

            // Optimized animations with reduced complexity for better performance
            // Animate header - reduced movement and faster duration
            if (header && header.children.length > 0) {
              masterTimeline.from(header.children, {
                y: 20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05,
                ease: "power1.out", // Lighter easing for better performance
              }, 0);
            }

            // Animate cards with stagger - optimized for performance
            if (cards && cards.length > 0) {
              masterTimeline.from(cards, {
                y: 20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05, // Reduced stagger for faster completion
                ease: "power1.out",
              }, 0.1);
            }

            // Animate button - reduced movement
            if (button) {
              masterTimeline.from(button, {
                y: 15,
                opacity: 0,
                duration: 0.3,
                ease: "power1.out",
              }, 0.2);
            }

            // Store ScrollTrigger reference and kill it after animation completes
            if (masterTimeline.scrollTrigger) {
              scrollTriggerRef.current = masterTimeline.scrollTrigger;
              masterTimeline.eventCallback("onComplete", () => {
                if (scrollTriggerRef.current) {
                  scrollTriggerRef.current.kill();
                  scrollTriggerRef.current = null;
                }
              });
            }
          }, section);
    };

    // Check if element is near viewport (within 200vh)
    const checkPosition = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const distanceFromTop = rect.top;
      
      // If within 200vh of viewport, initialize immediately
      if (distanceFromTop < viewportHeight * 2) {
        initScrollTrigger();
        return true;
      }
      return false;
    };

    // Throttled scroll handler for checking position
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (checkPosition()) {
            window.removeEventListener('scroll', handleScroll);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Check immediately on mount
    if (!checkPosition()) {
      // If far away, set up a throttled scroll listener to check periodically
      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          if (!animationInitializedRef.current) {
            window.addEventListener('scroll', handleScroll, true);
            requestAnimationFrame(checkPosition);
          }
        });
      } else {
        setTimeout(() => {
          if (!animationInitializedRef.current) {
            window.addEventListener('scroll', handleScroll, true);
            requestAnimationFrame(checkPosition);
          }
        }, 100);
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      // Kill ScrollTrigger if it exists
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}
