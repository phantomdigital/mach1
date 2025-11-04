"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Centralized Scroll Animation Provider
 * 
 * Uses IntersectionObserver (native browser API) instead of ScrollTrigger
 * for better performance. All animated elements register themselves via
 * data-animate attributes and get animated automatically.
 * 
 * Benefits:
 * - Single observer checks all elements (not multiple ScrollTriggers)
 * - Native browser optimization
 * - Lighter weight than ScrollTrigger
 * - Automatic cleanup
 */
export default function ScrollAnimationProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animatedElementsRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    // Create a single IntersectionObserver for all animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedElementsRef.current.has(entry.target)) {
            const element = entry.target as HTMLElement;
            const animationType = element.dataset.animate;
            const staggerDelay = element.dataset.staggerDelay ? parseFloat(element.dataset.staggerDelay) : 0.1;
            
            // Mark as animated
            animatedElementsRef.current.add(element);

            // Check if this is a parent container with children to stagger
            const children = element.querySelectorAll("[data-animate-child]");
            const childrenType = element.dataset.animateChildren; // e.g., "header", "card", etc.
            
            if (children.length > 0) {
              // Stagger animation for children
              const staggerAmount = staggerDelay;
              const yOffset = element.dataset.animateY ? parseFloat(element.dataset.animateY) : 30;
              
              gsap.from(children, {
                y: yOffset,
                opacity: 0,
                duration: childrenType === "specialty" ? 0.5 : 0.6,
                stagger: staggerAmount,
                ease: "power2.out",
              });
            } else {
              // Check if element has children that should animate (like header children)
              const directChildren = Array.from(element.children).filter(
                (child) => !(child as HTMLElement).dataset.animateChild
              );
              
              if (directChildren.length > 0 && animationType === "header") {
                // Animate header children with stagger
                gsap.from(directChildren, {
                  y: 30,
                  opacity: 0,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: "power2.out",
                });
              } else {
                // Apply animation based on type
                switch (animationType) {
                  case "fade-up":
                    gsap.from(element, {
                      y: 30,
                      opacity: 0,
                      duration: 0.7,
                      ease: "power2.out",
                    });
                    break;
                  
                  case "fade-in":
                    gsap.from(element, {
                      opacity: 0,
                      duration: 0.6,
                      ease: "power2.out",
                    });
                    break;
                  
                  case "scale-up":
                    gsap.from(element, {
                      scale: 0.95,
                      opacity: 0,
                      duration: 0.5,
                      ease: "power2.out",
                    });
                    break;
                  
                  case "slide-left":
                    gsap.from(element, {
                      x: -30,
                      opacity: 0,
                      duration: 0.7,
                      ease: "power2.out",
                    });
                    break;
                  
                  case "slide-right":
                    gsap.from(element, {
                      x: 30,
                      opacity: 0,
                      duration: 0.7,
                      ease: "power2.out",
                    });
                    break;
                  
                  default:
                    // Default fade-up animation
                    gsap.from(element, {
                      y: 30,
                      opacity: 0,
                      duration: 0.7,
                      ease: "power2.out",
                    });
                }
              }
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px", // Start animation slightly before element enters viewport
      }
    );

    // Observe all elements with data-animate attribute
    const observeElements = () => {
      const elements = document.querySelectorAll("[data-animate]");
      elements.forEach((el) => {
        if (!animatedElementsRef.current.has(el)) {
          const element = el as HTMLElement;
          const animationType = element.dataset.animate;
          
          // Check if this has children to animate
          const children = element.querySelectorAll("[data-animate-child]");
          
          if (children.length > 0) {
            // Set initial state for children
            const yOffset = element.dataset.animateY ? parseFloat(element.dataset.animateY) : 30;
            gsap.set(children, { y: yOffset, opacity: 0 });
          } else {
            // Set initial state for element itself
            if (animationType === "scale-up") {
              gsap.set(element, { scale: 0.95, opacity: 0 });
            } else if (animationType?.includes("slide-left")) {
              gsap.set(element, { x: -30, opacity: 0 });
            } else if (animationType?.includes("slide-right")) {
              gsap.set(element, { x: 30, opacity: 0 });
            } else {
              const yOffset = element.dataset.animateY ? parseFloat(element.dataset.animateY) : 30;
              gsap.set(element, { y: yOffset, opacity: 0 });
            }
          }
          
          observerRef.current?.observe(element);
        }
      });
    };

    // Initial observation
    observeElements();

    // Observe new elements added dynamically (e.g., via SliceZone)
    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observerRef.current?.disconnect();
      mutationObserver.disconnect();
      animatedElementsRef.current.clear();
    };
  }, []);

  return <>{children}</>;
}

