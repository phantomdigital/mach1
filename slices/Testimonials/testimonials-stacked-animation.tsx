"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsStackedAnimationProps {
  children: React.ReactNode;
}

export default function TestimonialsStackedAnimation({ children }: TestimonialsStackedAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector("[data-animate='header']");
      const carousel = sectionRef.current?.querySelector("[data-animate='carousel']");

      if (!header && !carousel) {
        return;
      }

      // Animate header (subheading, heading, description)
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
            once: true,
          },
        });
      }

      // Animate carousel
      if (carousel) {
        gsap.from(carousel, {
          x: 50,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: carousel,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}

