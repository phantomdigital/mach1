"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PrismicNextImage } from "@prismicio/next";
import { ImageField } from "@prismicio/client";

interface PageTopperBgImageProps {
  heroImage: ImageField;
}

export function PageTopperBgImage({ heroImage }: PageTopperBgImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current || !isLoaded) return;

    // Set initial scale
    gsap.set(containerRef.current, {
      scale: 1.05,
      willChange: "transform",
    });

    // Animate scale down smoothly on mount
    gsap.to(containerRef.current, {
      scale: 1,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.1,
      onComplete: () => {
        // Remove will-change after animation completes
        if (containerRef.current) {
          gsap.set(containerRef.current, { willChange: "auto" });
        }
      },
    });

    hasAnimatedRef.current = true;
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 transform-gpu">
      <PrismicNextImage 
        field={heroImage} 
        fill
        className="object-cover"
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={85}
        loading="eager"
        onLoad={() => setIsLoaded(true)}
      />
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-dark-blue animate-pulse"
          style={{ 
            backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1))`,
            backgroundSize: '40px 40px'
          }}
        />
      )}
    </div>
  );
}

