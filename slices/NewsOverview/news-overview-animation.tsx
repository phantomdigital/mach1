"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NewsOverviewAnimationProps {
  children: React.ReactNode;
}

/**
 * NewsOverview Animation - Component-scoped GSAP ScrollTrigger animation.
 * Animation logic lives within this component, following React best practices.
 */
export default function NewsOverviewAnimation({ children }: NewsOverviewAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector("[data-animate='header']");
      const sidebar = section.querySelector("[data-animate='sidebar']");
      const featuredArticle = section.querySelector("[data-animate='featured-article']");
      const previewCards = section.querySelectorAll("[data-animate='preview-card']");
      const button = section.querySelector("[data-animate='button']");

      if (!header && !sidebar) return;

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

      // Animate sidebar
      if (sidebar) {
        tl.from(sidebar, {
          x: -30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        }, 0.1);
      }

      // Animate featured article
      if (featuredArticle) {
        tl.from(featuredArticle, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        }, 0.2);
      }

      // Animate preview cards
      if (previewCards.length) {
        tl.from(previewCards, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        }, 0.3);
      }

      // Animate button
      if (button) {
        tl.from(button, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
        }, 0.5);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}

