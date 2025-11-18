"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NewsOverviewAnimationProps {
  children: React.ReactNode;
}

export default function NewsOverviewAnimation({ children }: NewsOverviewAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Batch DOM queries for better performance
      const animateElements = {
        header: section.querySelector("[data-animate='header']"),
        sidebar: section.querySelector("[data-animate='sidebar']"),
        featuredArticle: section.querySelector("[data-animate='featured-article']"),
        previewCards: section.querySelectorAll("[data-animate='preview-card']"),
        button: section.querySelector("[data-animate='button']")
      };

      // Create optimized timeline with reduced complexity
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 90%", // Later trigger for better performance
          toggleActions: "play none none none",
          once: true,
          markers: false,
          invalidateOnRefresh: false,
        },
      });

      // Simplified animations with proper type checking
      const animationsConfig = [
        { element: animateElements.header?.children, props: { y: 20, opacity: 0, duration: 0.4 }, time: 0 },
        { element: animateElements.sidebar, props: { x: -20, opacity: 0, duration: 0.4 }, time: 0.05 },
        { element: animateElements.featuredArticle, props: { y: 20, opacity: 0, duration: 0.4 }, time: 0.1 },
        { element: animateElements.previewCards, props: { y: 20, opacity: 0, duration: 0.4, stagger: 0.05 }, time: 0.15 },
        { element: animateElements.button, props: { y: 15, opacity: 0, duration: 0.3 }, time: 0.2 }
      ];

      animationsConfig.forEach(({ element, props, time }) => {
        if (element) {
          // Check if it's a NodeList or HTMLCollection
          const isCollection = 'length' in element;
          if (isCollection && (element as NodeListOf<Element>).length > 0) {
            masterTimeline.from(element, { ...props, ease: "power1.out" }, time);
          } else if (!isCollection && element.nodeType) {
            masterTimeline.from(element, { ...props, ease: "power1.out" }, time);
          }
        }
      });

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

