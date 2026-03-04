"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { PrismicNextImage } from "@prismicio/next";
import { isFilled } from "@prismicio/client";
import type { ImageField, LinkToMediaField, NumberField } from "@prismicio/client";

interface HomepageHeroImageProps {
  image?: ImageField;
  video?: LinkToMediaField;
  positionX?: NumberField;
  positionY?: NumberField;
}

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];

const isVideoFile = (url?: string | null, name?: string | null) => {
  if (!url && !name) return false;
  const candidate = `${name ?? ""} ${url ?? ""}`.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => candidate.includes(ext));
};

export function HomepageHeroImage({ image, video, positionX, positionY }: HomepageHeroImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  // Calculate object-position value from X and Y percentages
  // Default to center (50%, 50%) if not provided
  // Handle Prismic's NumberField which can be null
  const xPos = positionX ?? 50;
  const yPos = positionY ?? 50;
  const objectPosition = `${xPos}% ${yPos}%`;
  const hasVideo = isFilled.linkToMedia(video) && isVideoFile(video.url, video.name);

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
      {hasVideo ? (
        <video
          className="h-full w-full object-cover"
          style={{ objectPosition }}
          src={video.url}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        image?.url && (
          <PrismicNextImage
            field={image}
            fill
            className="object-cover"
            style={{ objectPosition }}
            priority
            sizes="(max-width: 1024px) 100vw, 75vw"
            quality={90}
          />
        )
      )}
    </div>
  );
}

