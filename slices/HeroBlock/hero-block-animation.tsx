"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroBlockAnimationProps {
  children: React.ReactNode;
}

/**
 * HeroBlock Animation - Component-scoped GSAP ScrollTrigger animation.
 * Animation logic lives within this component, following React best practices.
 */
export default function HeroBlockAnimation({ children }: HeroBlockAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector("[data-animate='header']");
      const image = section.querySelector("[data-animate='image']");
      const heading = section.querySelector("[data-animate='heading']");
      const statCards = section.querySelectorAll("[data-animate='stat-card']");
      const button = section.querySelector("[data-animate='button']");

      if (!image && !header && !heading) return;

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Animate image (slide in from left)
      if (image) {
        tl.from(image, {
          x: -30,
          opacity: 0,
          duration: 0.5,
          ease: "power1.out",
        }, 0);
      }

      // Animate header children
      if (header?.children.length) {
        tl.from(header.children, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power1.out",
        }, 0.05);
      }

      // Animate heading
      if (heading) {
        tl.from(heading, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          ease: "power1.out",
        }, 0.1);
      }

      // Animate stat cards with stagger
      if (statCards.length) {
        tl.from(statCards, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "power1.out",
        }, 0.15);
      }

      // Animate button
      if (button) {
        tl.from(button, {
          y: 15,
          opacity: 0,
          duration: 0.3,
          ease: "power1.out",
        }, 0.2);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}

