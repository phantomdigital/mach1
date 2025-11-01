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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const leftColumn = sectionRef.current?.querySelector("[data-animate='left-column']");
      const rightColumn = sectionRef.current?.querySelector("[data-animate='right-column']");

      if (!leftColumn || !rightColumn) return;

      // Animate left column elements
      gsap.from(leftColumn.children, {
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
        },
      });

      // Animate right column (warehouse image)
      gsap.from(rightColumn, {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}

