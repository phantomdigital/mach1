"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ServicesAnimationProps {
  children: React.ReactNode;
}

/**
 * Services Animation - Component-scoped GSAP ScrollTrigger animation.
 * Animation logic lives within this component, following React best practices.
 */
export default function ServicesAnimation({ children }: ServicesAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector("[data-animate='header']");
      const leftColumn = section.querySelector("[data-animate='left-column']");
      const cards = section.querySelectorAll("[data-animate='card']");
      const specialties = section.querySelectorAll("[data-animate='specialty']");
      const images = section.querySelectorAll("[data-animate='image']");
      const statisticCard = section.querySelector("[data-animate='statistic']");

      if (!header && !leftColumn) return;

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
        onComplete: () => {
          // Clear any transforms on left column to ensure sticky works
          if (leftColumn) {
            gsap.set(leftColumn, { clearProps: "all" });
            if (leftColumn.children.length > 0) {
              gsap.set(leftColumn.children, { clearProps: "transform" });
            }
          }
        },
      });

      // Animate header children
      if (header?.children.length) {
        tl.from(header.children, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power1.out",
        }, 0);
      }

      // Animate left column
      if (leftColumn?.children.length) {
        tl.from(leftColumn.children, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power1.out",
        }, 0.05);
      }

      // Animate images
      if (images.length) {
        tl.from(images, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power1.out",
        }, 0.05);
      }

      // Animate statistic card
      if (statisticCard) {
        tl.from(statisticCard, {
          scale: 0.98,
          opacity: 0,
          duration: 0.4,
          ease: "power1.out",
        }, 0.1);
      }

      // Animate cards
      if (cards.length) {
        tl.from(cards, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power1.out",
        }, 0.1);
      }

      // Animate specialties
      if (specialties.length) {
        tl.from(specialties, {
          y: 15,
          opacity: 0,
          duration: 0.3,
          stagger: 0.03,
          ease: "power1.out",
        }, 0.15);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return <div ref={sectionRef} className="relative overflow-visible">{children}</div>;
}

