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
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power1.out",
        }, 0);
      }

      // Animate sidebar
      if (sidebar) {
        tl.from(sidebar, {
          x: -20,
          opacity: 0,
          duration: 0.4,
          ease: "power1.out",
        }, 0.05);
      }

      // Animate featured article
      if (featuredArticle) {
        tl.from(featuredArticle, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          ease: "power1.out",
        }, 0.1);
      }

      // Animate preview cards
      if (previewCards.length) {
        tl.from(previewCards, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
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

