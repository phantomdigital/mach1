"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { KeyTextField } from "@prismicio/client";

interface HomepageHeroAnimationProps {
  subheading?: KeyTextField;
  heading?: KeyTextField;
  description?: KeyTextField;
  textColors: {
    subheading: string;
    heading: string;
    description: string;
  };
  badgeButtonText?: KeyTextField;
  badgeButtonLink?: string;
}

export function HomepageHeroAnimation({
  subheading,
  heading,
  description,
  textColors,
}: HomepageHeroAnimationProps) {
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const textElements: HTMLElement[] = [];

    if (subheadingRef.current && subheading) {
      textElements.push(subheadingRef.current);
    }
    if (headingRef.current && heading) {
      textElements.push(headingRef.current);
    }
    if (descriptionRef.current && description) {
      textElements.push(descriptionRef.current);
    }

    if (textElements.length === 0) return;

    // Set initial state
    gsap.set(textElements, {
      y: 30,
      opacity: 0,
    });

    // Create simple timeline animation
    timelineRef.current = gsap.timeline({
      defaults: {
        ease: "power2.out",
      },
    });

    // Animate each element with stagger
    timelineRef.current.to(textElements, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.15,
      ease: "power2.out",
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [subheading, heading, description]);

  return (
    <div className="space-y-6">
      {/* Heading */}
      {heading && (
        <h1
          ref={headingRef}
          className={`${textColors.heading} font-bold text-3xl lg:text-5xl xl:text-6xl`}
          style={{ 
            lineHeight: '1.15'
          }}
        >
          {heading}
        </h1>
      )}

      {/* Description */}
      {description && (
        <p
          ref={descriptionRef}
          className={`${textColors.description} text-sm md:text-base lg:text-lg max-w-full lg:max-w-lg xl:max-w-xl`}
          style={{ 
            lineHeight: '1.7'
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

