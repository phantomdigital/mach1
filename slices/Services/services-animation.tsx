"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ServicesAnimationProps {
  children: React.ReactNode;
}

export default function ServicesAnimation({ children }: ServicesAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Collect all elements to animate
      const header = section.querySelector("[data-animate='header']");
      const leftColumn = section.querySelector("[data-animate='left-column']");
      const cards = section.querySelectorAll("[data-animate='card']");
      const specialties = section.querySelectorAll("[data-animate='specialty']");
      const images = section.querySelectorAll("[data-animate='image']");
      const statisticCard = section.querySelector("[data-animate='statistic']");

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

      // Animate header
      if (header && header.children.length > 0) {
        masterTimeline.from(header.children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }, 0);
      }

      // Animate left column
      if (leftColumn && leftColumn.children.length > 0) {
        masterTimeline.from(leftColumn.children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }, 0.1);
      }

      // Animate images (grouped together)
      if (images && images.length > 0) {
        masterTimeline.from(images, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }, 0.1);
      }

      // Animate statistic card
      if (statisticCard) {
        masterTimeline.from(statisticCard, {
          scale: 0.95,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        }, 0.2);
      }

      // Animate cards
      if (cards && cards.length > 0) {
        masterTimeline.from(cards, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }, 0.2);
      }

      // Animate specialties
      if (specialties && specialties.length > 0) {
        masterTimeline.from(specialties, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
        }, 0.3);
      }

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

