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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector("[data-animate='header']");
      const cards = sectionRef.current?.querySelectorAll("[data-animate='card']");
      const button = sectionRef.current?.querySelector("[data-animate='button']");

      if (!header && !cards && !button) return;

      // Animate header (subheading and heading)
      if (header && header.children.length > 0) {
        gsap.from(header.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none none",
          },
        });
      }

      // Animate cards with stagger
      if (cards && cards.length > 0) {
        gsap.from(cards, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none none",
          },
        });
      }

      // Animate button
      if (button) {
        gsap.from(button, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: button,
            start: "top 90%",
            end: "top 60%",
            toggleActions: "play none none none",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}

