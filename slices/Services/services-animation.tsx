"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ServicesAnimationProps {
  children: React.ReactNode;
}

export default function ServicesAnimation({ children }: ServicesAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector("[data-animate='header']");
      const leftColumn = sectionRef.current?.querySelector("[data-animate='left-column']");
      const cards = sectionRef.current?.querySelectorAll("[data-animate='card']");
      const specialties = sectionRef.current?.querySelectorAll("[data-animate='specialty']");
      const button = sectionRef.current?.querySelector("[data-animate='button']");
      const images = sectionRef.current?.querySelectorAll("[data-animate='image']");
      const statisticCard = sectionRef.current?.querySelector("[data-animate='statistic']");

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

      // Animate left column (content) - for grid variation
      if (leftColumn && leftColumn.children.length > 0) {
        const leftTween = gsap.from(leftColumn.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: leftColumn,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none none",
            once: true,
            markers: false,
            invalidateOnRefresh: false,
          },
        });
        if (leftTween.scrollTrigger) {
          scrollTriggersRef.current.push(leftTween.scrollTrigger);
          leftTween.eventCallback("onComplete", () => {
            if (leftTween.scrollTrigger) {
              leftTween.scrollTrigger.kill();
            }
          });
        }
      }

      // Animate individual images - for twoColumn variation
      if (images && images.length > 0) {
        const imagesTween = gsap.from(images, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: images[0],
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none none",
            once: true,
            markers: false,
            invalidateOnRefresh: false,
          },
        });
        if (imagesTween.scrollTrigger) {
          scrollTriggersRef.current.push(imagesTween.scrollTrigger);
          imagesTween.eventCallback("onComplete", () => {
            if (imagesTween.scrollTrigger) {
              imagesTween.scrollTrigger.kill();
            }
          });
        }
      }

      // Animate statistic card
      if (statisticCard) {
        const statisticTween = gsap.from(statisticCard, {
          scale: 0.9,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statisticCard,
            start: "top 90%",
            end: "top 60%",
            toggleActions: "play none none none",
            once: true,
            markers: false,
            invalidateOnRefresh: false,
          },
        });
        if (statisticTween.scrollTrigger) {
          scrollTriggersRef.current.push(statisticTween.scrollTrigger);
          statisticTween.eventCallback("onComplete", () => {
            if (statisticTween.scrollTrigger) {
              statisticTween.scrollTrigger.kill();
            }
          });
        }
      }

      // Animate cards with stagger
      if (cards && cards.length > 0) {
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

      // Animate specialties list
      if (specialties && specialties.length > 0) {
        const specialtiesTween = gsap.from(specialties, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: specialties[0],
            start: "top 90%",
            end: "top 60%",
            toggleActions: "play none none none",
            once: true,
            markers: false,
            invalidateOnRefresh: false,
          },
        });
        if (specialtiesTween.scrollTrigger) {
          scrollTriggersRef.current.push(specialtiesTween.scrollTrigger);
          specialtiesTween.eventCallback("onComplete", () => {
            if (specialtiesTween.scrollTrigger) {
              specialtiesTween.scrollTrigger.kill();
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

