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
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const leftColumn = sectionRef.current?.querySelector("[data-animate='left-column']");
      const rightColumn = sectionRef.current?.querySelector("[data-animate='right-column']");

      if (!leftColumn || !rightColumn) return;

      // Animate left column elements
      const leftTween = gsap.from(leftColumn.children, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none none",
          once: true, // Only trigger once
          markers: false, // Disable markers for performance
          invalidateOnRefresh: false, // Prevent recalculation on resize
        },
      });
      if (leftTween.scrollTrigger) {
        scrollTriggersRef.current.push(leftTween.scrollTrigger);
        // Kill ScrollTrigger after animation completes
        leftTween.eventCallback("onComplete", () => {
          if (leftTween.scrollTrigger) {
            leftTween.scrollTrigger.kill();
          }
        });
      }

      // Animate right column (warehouse image)
      const rightTween = gsap.from(rightColumn, {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none none",
          once: true, // Only trigger once
          markers: false, // Disable markers for performance
          invalidateOnRefresh: false, // Prevent recalculation on resize
        },
      });
      if (rightTween.scrollTrigger) {
        scrollTriggersRef.current.push(rightTween.scrollTrigger);
        // Kill ScrollTrigger after animation completes
        rightTween.eventCallback("onComplete", () => {
          if (rightTween.scrollTrigger) {
            rightTween.scrollTrigger.kill();
          }
        });
      }
    }, sectionRef);

    return () => {
      // Kill all ScrollTrigger instances
      scrollTriggersRef.current.forEach((st) => {
        if (st) {
          st.kill();
        }
      });
      scrollTriggersRef.current = [];
      // Revert GSAP context (this also cleans up any remaining ScrollTriggers)
      ctx.revert();
    };
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}

