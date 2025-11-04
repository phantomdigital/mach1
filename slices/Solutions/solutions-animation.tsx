"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SolutionsAnimationProps {
  children: React.ReactNode;
}

export default function SolutionsAnimation({ children }: SolutionsAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const startTimeRef = useRef<number>(0);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();
    console.log("[Solutions] Animation component mounted");

    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector("[data-animate='header']");
      const cards = sectionRef.current?.querySelectorAll("[data-animate='card']");
      const button = sectionRef.current?.querySelector("[data-animate='button']");

      console.log("[Solutions] Elements found:", {
        header: !!header,
        cardsCount: cards?.length || 0,
        button: !!button,
      });

      if (!header && !cards && !button) {
        console.warn("[Solutions] No elements to animate");
        return;
      }

      // Track active ScrollTriggers
      const activeScrollTriggers = new Set<ScrollTrigger>();

      // Animate header (subheading and heading)
      if (header && header.children.length > 0) {
        console.log("[Solutions] Creating header animation");
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
            onEnter: () => {
              console.log("[Solutions] Header animation started");
            },
          },
        });
        tweensRef.current.push(headerTween);
        if (headerTween.scrollTrigger) {
          activeScrollTriggers.add(headerTween.scrollTrigger);
          console.log("[Solutions] Header ScrollTrigger created. Total active:", activeScrollTriggers.size);
        }
        // Kill ScrollTrigger after animation completes to prevent ongoing checks
        headerTween.eventCallback("onComplete", () => {
          console.log("[Solutions] Header animation completed");
          if (headerTween.scrollTrigger) {
            activeScrollTriggers.delete(headerTween.scrollTrigger);
            headerTween.scrollTrigger.kill();
            console.log("[Solutions] Header ScrollTrigger killed. Remaining active:", activeScrollTriggers.size);
          }
        });
      }

      // Animate cards with stagger
      if (cards && cards.length > 0) {
        console.log("[Solutions] Creating cards animation for", cards.length, "cards");
        const cardsTween = gsap.from(cards, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none none",
            once: true,
            markers: false,
            invalidateOnRefresh: false,
            onEnter: () => {
              console.log("[Solutions] Cards animation started at", performance.now() - startTimeRef.current, "ms");
            },
          },
        });
        tweensRef.current.push(cardsTween);
        if (cardsTween.scrollTrigger) {
          activeScrollTriggers.add(cardsTween.scrollTrigger);
          console.log("[Solutions] Cards ScrollTrigger created. Total active:", activeScrollTriggers.size);
        }
        // Kill ScrollTrigger after animation completes to prevent ongoing checks
        cardsTween.eventCallback("onComplete", () => {
          const completionTime = performance.now() - startTimeRef.current;
          console.log("[Solutions] Cards animation completed at", completionTime, "ms");
          if (cardsTween.scrollTrigger) {
            activeScrollTriggers.delete(cardsTween.scrollTrigger);
            cardsTween.scrollTrigger.kill();
            console.log("[Solutions] Cards ScrollTrigger killed. Remaining active:", activeScrollTriggers.size);
            
            // Log all remaining ScrollTriggers
            const allTriggers = ScrollTrigger.getAll();
            console.log("[Solutions] Total ScrollTriggers in GSAP:", allTriggers.length);
            console.log("[Solutions] Active ScrollTriggers in this component:", activeScrollTriggers.size);
          }
        });
      }

      // Animate button
      if (button) {
        console.log("[Solutions] Creating button animation");
        const buttonTween = gsap.from(button, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: button,
            start: "top 90%",
            end: "top 60%",
            toggleActions: "play none none none",
            once: true,
            markers: false,
            invalidateOnRefresh: false,
            onEnter: () => {
              console.log("[Solutions] Button animation started");
            },
          },
        });
        tweensRef.current.push(buttonTween);
        if (buttonTween.scrollTrigger) {
          activeScrollTriggers.add(buttonTween.scrollTrigger);
          console.log("[Solutions] Button ScrollTrigger created. Total active:", activeScrollTriggers.size);
        }
        // Kill ScrollTrigger after animation completes to prevent ongoing checks
        buttonTween.eventCallback("onComplete", () => {
          console.log("[Solutions] Button animation completed");
          if (buttonTween.scrollTrigger) {
            activeScrollTriggers.delete(buttonTween.scrollTrigger);
            buttonTween.scrollTrigger.kill();
            console.log("[Solutions] Button ScrollTrigger killed. Remaining active:", activeScrollTriggers.size);
          }
        });
      }

      // Periodic check for remaining ScrollTriggers
      checkIntervalRef.current = setInterval(() => {
        const allTriggers = ScrollTrigger.getAll();
        // Filter out killed ScrollTriggers from our Set (killed ones won't be in getAll())
        const actuallyActive = Array.from(activeScrollTriggers).filter(st => 
          allTriggers.includes(st)
        );
        
        if (allTriggers.length > 0 || activeScrollTriggers.size > 0) {
          console.log("[Solutions] ⚠️ Still", allTriggers.length, "ScrollTriggers active globally");
          console.log("[Solutions] ⚠️ Active in this component (Set):", activeScrollTriggers.size);
          console.log("[Solutions] ⚠️ Actually active (not killed):", actuallyActive.length);
          
          // Clean up killed ScrollTriggers from Set
          if (activeScrollTriggers.size !== actuallyActive.length) {
            activeScrollTriggers.clear();
            actuallyActive.forEach(st => activeScrollTriggers.add(st));
            console.log("[Solutions] Cleaned up killed ScrollTriggers from Set");
          }
        }
      }, 2000);
    }, sectionRef);

    return () => {
      console.log("[Solutions] Component unmounting, cleaning up...");
      const allTriggersBefore = ScrollTrigger.getAll().length;
      
      // Clear interval if it exists
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      
      // Kill all ScrollTriggers first
      tweensRef.current.forEach((tween) => {
        if (tween && tween.scrollTrigger) {
          tween.scrollTrigger.kill();
        }
      });
      tweensRef.current = [];
      
      // Revert GSAP context (this cleans up all tweens and remaining ScrollTriggers)
      ctx.revert();
      
      const allTriggersAfter = ScrollTrigger.getAll().length;
      console.log("[Solutions] Cleanup complete. ScrollTriggers before:", allTriggersBefore, "after:", allTriggersAfter);
    };
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}

