"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { PrismicNextImage } from "@prismicio/next";
import { ImageField } from "@prismicio/client";

interface HomepageHeroImageProps {
  image: ImageField;
}

export function HomepageHeroImage({ image }: HomepageHeroImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current) return;

    // Set initial scale for zoom-in effect
    gsap.set(containerRef.current, {
      scale: 1.05,
      willChange: "transform",
    });

    // Animate to scale 1
    gsap.to(containerRef.current, {
      scale: 1,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.2,
      onComplete: () => {
        if (containerRef.current) {
          gsap.set(containerRef.current, { willChange: "auto" });
        }
      },
    });

    hasAnimatedRef.current = true;
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full transform-gpu overflow-hidden"
    >
      <PrismicNextImage
        field={image}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 1024px) 100vw, 75vw"
        quality={90}
      />
    </div>
  );
}

