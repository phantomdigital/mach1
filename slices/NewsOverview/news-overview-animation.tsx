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
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector("[data-animate='header']");
      const sidebar = sectionRef.current?.querySelector("[data-animate='sidebar']");
      const featuredArticle = sectionRef.current?.querySelector("[data-animate='featured-article']");
      const previewCards = sectionRef.current?.querySelectorAll("[data-animate='preview-card']");
      const button = sectionRef.current?.querySelector("[data-animate='button']");

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

      // Animate sidebar (header info)
      if (sidebar) {
        const sidebarTween = gsap.from(sidebar, {
          x: -30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sidebar,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none none",
            once: true,
            markers: false,
            invalidateOnRefresh: false,
          },
        });
        if (sidebarTween.scrollTrigger) {
          scrollTriggersRef.current.push(sidebarTween.scrollTrigger);
          sidebarTween.eventCallback("onComplete", () => {
            if (sidebarTween.scrollTrigger) {
              sidebarTween.scrollTrigger.kill();
            }
          });
        }
      }

      // Animate featured article
      if (featuredArticle) {
        const featuredTween = gsap.from(featuredArticle, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuredArticle,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none none",
            once: true,
            markers: false,
            invalidateOnRefresh: false,
          },
        });
        if (featuredTween.scrollTrigger) {
          scrollTriggersRef.current.push(featuredTween.scrollTrigger);
          featuredTween.eventCallback("onComplete", () => {
            if (featuredTween.scrollTrigger) {
              featuredTween.scrollTrigger.kill();
            }
          });
        }
      }

      // Animate preview cards with stagger
      if (previewCards && previewCards.length > 0) {
        const cardsTween = gsap.from(previewCards, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: previewCards[0],
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

      // Animate button
      if (button) {
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
          },
        });
        if (buttonTween.scrollTrigger) {
          scrollTriggersRef.current.push(buttonTween.scrollTrigger);
          buttonTween.eventCallback("onComplete", () => {
            if (buttonTween.scrollTrigger) {
              buttonTween.scrollTrigger.kill();
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

