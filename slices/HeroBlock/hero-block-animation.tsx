"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroBlockAnimationProps {
  children: React.ReactNode;
}

export default function HeroBlockAnimation({ children }: HeroBlockAnimationProps) {
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
            // Collect all elements to animate
            const header = section.querySelector("[data-animate='header']");
            const image = section.querySelector("[data-animate='image']");
            const heading = section.querySelector("[data-animate='heading']");
            const statCards = section.querySelectorAll("[data-animate='stat-card']");
            const button = section.querySelector("[data-animate='button']");

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
            // Animate image (slide in from left) - reduced distance for smoother animation
            if (image) {
              masterTimeline.from(image, {
                x: -30,
                opacity: 0,
                duration: 0.5,
                ease: "power1.out", // Lighter easing for better performance
              }, 0);
            }

            // Animate header (subheading) - reduced stagger for faster animation
            if (header && header.children.length > 0) {
              masterTimeline.from(header.children, {
                y: 20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05,
                ease: "power1.out",
              }, 0.05);
            }

            // Animate heading - reduced movement for smoother animation
            if (heading) {
              masterTimeline.from(heading, {
                y: 20,
                opacity: 0,
                duration: 0.4,
                ease: "power1.out",
              }, 0.1);
            }

            // Animate stat cards with stagger - optimized for performance
            if (statCards && statCards.length > 0) {
              masterTimeline.from(statCards, {
                y: 20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.03, // Reduced stagger for faster completion
                ease: "power1.out",
              }, 0.15);
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

