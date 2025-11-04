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
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 50%",
          toggleActions: "play none none none",
          once: true,
          markers: false,
          invalidateOnRefresh: false,
        },
      });

      // Animate left column elements
      if (leftColumn.children.length > 0) {
        masterTimeline.from(leftColumn.children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }, 0);
      }

      // Animate right column (warehouse image)
      masterTimeline.from(rightColumn, {
        x: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      }, 0.1);

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

