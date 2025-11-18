"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NetworkOverviewAnimationProps {
  children: React.ReactNode;
}

export default function NetworkOverviewAnimation({ children }: NetworkOverviewAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const leftColumn = section.querySelector("[data-animate='left-column']");
      const rightColumn = section.querySelector("[data-animate='right-column']");

      if (!leftColumn || !rightColumn) return;

      // Create a single master timeline with all animations
      // Optimized trigger point - starts later to reduce lag when scrolling
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 90%", // Later trigger for better performance
          end: "top 50%",
          toggleActions: "play none none none",
          once: true,
          markers: false,
          invalidateOnRefresh: false,
          // Reduce animation complexity for better performance
          anticipatePin: 1,
        },
      });

      // Optimized animations with reduced complexity for better performance
      // Animate left column elements - reduced movement and faster duration
      if (leftColumn.children.length > 0) {
        masterTimeline.from(leftColumn.children, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power1.out", // Lighter easing for better performance
        }, 0);
      }

      // Animate right column (warehouse image) - reduced movement
      masterTimeline.from(rightColumn, {
        x: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power1.out",
      }, 0.05);

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

    return () => {
      // Kill ScrollTrigger if it exists
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      
      // Revert GSAP context
      ctx.revert();
    };
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}

