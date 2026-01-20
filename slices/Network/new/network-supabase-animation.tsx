"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NetworkSupabaseAnimationProps {
  children: React.ReactNode;
}

/**
 * Animation wrapper for Supabase-style network layout
 * Animates stats, globe, and content blocks on scroll
 */
export default function NetworkSupabaseAnimation({ children }: NetworkSupabaseAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector("[data-animate='header']");
      const stats = section.querySelector("[data-animate='stats']");
      const globeSection = section.querySelector("[data-animate='globe-section']");
      const globe = section.querySelector("[data-animate='globe']");
      const content = section.querySelector("[data-animate='content']");

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

      // Animate stats row
      if (stats) {
        const statItems = stats.querySelectorAll("[data-animate='stat-item']");
        if (statItems.length > 0) {
          masterTimeline.from(statItems, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          }, 0.2);
        }
      }

      // Animate globe section (background fade)
      if (globeSection) {
        masterTimeline.from(globeSection, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        }, 0.3);
      }

      // Animate globe
      if (globe) {
        masterTimeline.from(globe, {
          scale: 0.95,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        }, 0.4);
      }

      // Animate content blocks
      if (content) {
        masterTimeline.from(content, {
          x: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
        }, 0.5);
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


