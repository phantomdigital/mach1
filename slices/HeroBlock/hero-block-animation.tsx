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
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector("[data-animate='header']");
      const image = sectionRef.current?.querySelector("[data-animate='image']");
      const heading = sectionRef.current?.querySelector("[data-animate='heading']");
      const statCards = sectionRef.current?.querySelectorAll("[data-animate='stat-card']");
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

      // Animate image (slide in from left)
      if (image) {
        const imageTween = gsap.from(image, {
          x: -50,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: image,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none none",
            once: true,
            markers: false,
            invalidateOnRefresh: false,
          },
        });
        if (imageTween.scrollTrigger) {
          scrollTriggersRef.current.push(imageTween.scrollTrigger);
          imageTween.eventCallback("onComplete", () => {
            if (imageTween.scrollTrigger) {
              imageTween.scrollTrigger.kill();
            }
          });
        }
      }

      // Animate heading
      if (heading) {
        const headingTween = gsap.from(heading, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none none",
            once: true,
            markers: false,
            invalidateOnRefresh: false,
          },
        });
        if (headingTween.scrollTrigger) {
          scrollTriggersRef.current.push(headingTween.scrollTrigger);
          headingTween.eventCallback("onComplete", () => {
            if (headingTween.scrollTrigger) {
              headingTween.scrollTrigger.kill();
            }
          });
        }
      }

      // Animate stat cards with stagger
      if (statCards && statCards.length > 0) {
        const cardsTween = gsap.from(statCards, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
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

