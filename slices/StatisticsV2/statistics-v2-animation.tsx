"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StatisticsV2AnimationProps {
  children: React.ReactNode;
}

export default function StatisticsV2Animation({ children }: StatisticsV2AnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;

    // Use requestAnimationFrame to ensure DOM is fully ready
    requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        // Collect all elements to animate
        const header = section.querySelector("[data-animate='header']");
        const statCards = section.querySelectorAll("[data-animate='stat-card']");

        // Debug: Log found elements
        console.log("[StatisticsV2] Elements found:", {
          header: !!header,
          headerChildren: header?.children.length || 0,
          statCardsCount: statCards?.length || 0,
        });

        // Create a single master timeline with all animations (following rules.yaml pattern)
        const masterTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none none",
            once: true,
            markers: false,
            invalidateOnRefresh: false,
            onEnter: () => {
              console.log("[StatisticsV2] ScrollTrigger fired - animation starting");
            },
            onEnterBack: () => {
              console.log("[StatisticsV2] ScrollTrigger onEnterBack");
            },
          },
        });

        // Set initial state for header children
        if (header && header.children.length > 0) {
          gsap.set(header.children, { y: 30, opacity: 0 });
          masterTimeline.to(header.children, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          }, 0);
        }

        // Set initial state for stat cards and animate them
        if (statCards && statCards.length > 0) {
          console.log("[StatisticsV2] Animating", statCards.length, "stat cards");
          gsap.set(statCards, { y: 40, opacity: 0, scale: 0.95 });
          masterTimeline.to(statCards, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          }, 0.1);
        } else {
          console.warn("[StatisticsV2] No stat cards found to animate!");
        }

        // Store the ScrollTrigger for cleanup
        const scrollTrigger = masterTimeline.scrollTrigger;
        if (scrollTrigger) {
          scrollTriggersRef.current.push(scrollTrigger);
          console.log("[StatisticsV2] ScrollTrigger created, isActive:", scrollTrigger.isActive);
          
          // Refresh ScrollTrigger to ensure it calculates positions correctly
          ScrollTrigger.refresh();
          
          // Check if section is already in view and trigger animation manually if needed
          const rect = section.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const triggerPoint = viewportHeight * 0.85;
          
          if (rect.top < triggerPoint && rect.bottom > 0) {
            console.log("[StatisticsV2] Section already in view, forcing animation");
            masterTimeline.play(0);
          }
          
          // Kill ScrollTrigger after animation completes
          masterTimeline.eventCallback("onComplete", () => {
            console.log("[StatisticsV2] Animation completed");
            if (scrollTrigger) {
              const index = scrollTriggersRef.current.indexOf(scrollTrigger);
              if (index > -1) {
                scrollTriggersRef.current.splice(index, 1);
              }
              scrollTrigger.kill();
            }
          });
        }
      }, sectionRef);
    });

    return () => {
      // Kill all ScrollTrigger instances
      scrollTriggersRef.current.forEach((st) => {
        if (st) {
          st.kill();
        }
      });
      scrollTriggersRef.current = [];
      // Revert GSAP context (this also cleans up any remaining ScrollTriggers)
      if (ctx) {
        ctx.revert();
      }
    };
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}

