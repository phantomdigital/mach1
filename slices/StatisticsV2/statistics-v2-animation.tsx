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
    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector("[data-animate='header']");
      const statCards = sectionRef.current?.querySelectorAll("[data-animate='stat-card']");

      // Animate header (subheading)
      if (header && header.children.length > 0) {
        const headerTween = gsap.from(header.children, {
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
            markers: false,
            invalidateOnRefresh: false,
          },
        });
        if (headerTween.scrollTrigger) {
          scrollTriggersRef.current.push(headerTween.scrollTrigger);
          headerTween.eventCallback("onComplete", () => {
            if (headerTween.scrollTrigger) {
              headerTween.scrollTrigger.kill();
            }
          });
        }
      }

      // Animate stat cards with stagger
      if (statCards && statCards.length > 0) {
        const cardsTween = gsap.from(statCards, {
          y: 40,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statCards[0],
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none none",
            once: true,
            markers: false,
            invalidateOnRefresh: false,
          },
        });
        if (cardsTween.scrollTrigger) {
          scrollTriggersRef.current.push(cardsTween.scrollTrigger);
          cardsTween.eventCallback("onComplete", () => {
            if (cardsTween.scrollTrigger) {
              cardsTween.scrollTrigger.kill();
            }
          });
        }
      }
    }, sectionRef);

    return () => {
      // Kill all ScrollTrigger instances
      scrollTriggersRef.current.forEach((st) => {
        if (st) {
          st.kill();
        }
      });
      scrollTriggersRef.current = [];
      // Revert GSAP context (this also cleans up any remaining ScrollTriggers)
      ctx.revert();
    };
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}

