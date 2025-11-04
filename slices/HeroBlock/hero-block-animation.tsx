"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroBlockAnimationProps {
  children: React.ReactNode;
}

export default function HeroBlockAnimation({ children }: HeroBlockAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Collect all elements to animate
      const header = section.querySelector("[data-animate='header']");
      const image = section.querySelector("[data-animate='image']");
      const heading = section.querySelector("[data-animate='heading']");
      const statCards = section.querySelectorAll("[data-animate='stat-card']");
      const button = section.querySelector("[data-animate='button']");

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

      // Animate image (slide in from left)
      if (image) {
        masterTimeline.from(image, {
          x: -50,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
        }, 0);
      }

      // Animate header (subheading)
      if (header && header.children.length > 0) {
        masterTimeline.from(header.children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }, 0.1);
      }

      // Animate heading
      if (heading) {
        masterTimeline.from(heading, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        }, 0.2);
      }

      // Animate stat cards with stagger
      if (statCards && statCards.length > 0) {
        masterTimeline.from(statCards, {
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
        }, 0.3);
      }

      // Animate button
      if (button) {
        masterTimeline.from(button, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        }, 0.4);
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

