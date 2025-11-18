"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsStackedAnimationProps {
  children: React.ReactNode;
}

/**
 * TestimonialsStacked Animation - Component-scoped GSAP ScrollTrigger animation.
 * Animation logic lives within this component, following React best practices.
 */
export default function TestimonialsStackedAnimation({ children }: TestimonialsStackedAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector("[data-animate='header']");
      const carousel = section.querySelector("[data-animate='carousel']");

      if (!header && !carousel) return;

      // Create timeline with ScrollTrigger - optimized for performance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
          markers: false,
          invalidateOnRefresh: false,
        },
      });

      // Animate header children - slower, more elegant animation
      if (header?.children.length) {
        tl.from(header.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        }, 0);
      }

      // Animate carousel - optimized with will-change hint
      if (carousel) {
        gsap.set(carousel, { willChange: "transform, opacity" });
        tl.from(carousel, {
          x: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(carousel, { willChange: "auto" });
          },
        }, 0.2);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}

