"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SolutionsAnimationProps {
  children: React.ReactNode;
}

/**
 * Solutions Animation - Component-scoped GSAP ScrollTrigger animation.
 * Animation logic lives within this component, following React best practices.
 */
export default function SolutionsAnimation({ children }: SolutionsAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector("[data-animate='header']");
      const cards = section.querySelectorAll("[data-animate='card']");
      const button = section.querySelector("[data-animate='button']");

      if (!header && cards.length === 0 && !button) return;

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Animate header children
      if (header?.children.length) {
        tl.from(header.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        }, 0);
      }

      // Animate cards with stagger
      if (cards.length) {
        tl.from(cards, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        }, 0.2);
      }

      // Animate button
      if (button) {
        tl.from(button, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
        }, 0.4);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}
