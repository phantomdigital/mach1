"use client";

import { useRef, useEffect } from "react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import type { Content } from "@prismicio/client";
import gsap from "gsap";

interface SolutionCardProps {
  item: Content.SolutionsSliceDefaultItem;
  index: number;
}

export default function SolutionCard({ item, index }: SolutionCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const titleBorderRef = useRef<HTMLSpanElement>(null);
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Set initial state - arrow is hidden
    if (arrowRef.current) {
      gsap.set(arrowRef.current, { opacity: 0, scale: 1 });
    }

    const handleMouseEnter = () => {
      // Kill any existing timeline
      if (hoverTimelineRef.current) {
        hoverTimelineRef.current.kill();
      }

      hoverTimelineRef.current = gsap.timeline();

      // Show underline instantly (no transition)
      if (titleBorderRef.current) {
        gsap.set(titleBorderRef.current, { borderColor: "white" });
      }

      // Animate arrow icon
      if (arrowRef.current) {
        hoverTimelineRef.current.to(
          arrowRef.current,
          {
            opacity: 1,
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out",
          },
          0
        );
      }
    };

    const handleMouseLeave = () => {
      // Kill any existing timeline
      if (hoverTimelineRef.current) {
        hoverTimelineRef.current.kill();
      }

      hoverTimelineRef.current = gsap.timeline();

      // Hide underline instantly (no transition)
      if (titleBorderRef.current) {
        gsap.set(titleBorderRef.current, { borderColor: "transparent" });
      }

      // Hide arrow icon
      if (arrowRef.current) {
        hoverTimelineRef.current.to(
          arrowRef.current,
          {
            opacity: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          0
        );
      }
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      if (hoverTimelineRef.current) {
        hoverTimelineRef.current.kill();
      }
    };
  }, []);

  return (
    <article ref={cardRef} className="relative overflow-hidden aspect-[4/3] lg:aspect-[16/7] rounded-xs">
      <PrismicNextLink field={item.link} className="block w-full h-full">
        {/* Background Image */}
        {item.image?.url && (
          <div className="absolute inset-0">
            <PrismicNextImage
              field={item.image}
              fill
              className="object-cover rounded-xs"
              priority={index < 2}
              loading={index < 2 ? undefined : "lazy"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={index < 2 ? 90 : 80}
            />
            {/* Base overlay to dull the image */}
            <div className="absolute inset-0 bg-black/20" />
            {/* Gradient overlay - visible by default */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 from-0% via-black/30 via-60% to-transparent" />
          </div>
        )}

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-between p-6 lg:p-8">
          {/* Title and Description at bottom-left - visible by default */}
          <div className="mt-auto flex flex-col gap-3">
            <h3 className="text-neutral-100 text-xl lg:text-2xl font-bold leading-tight">
              <span ref={titleBorderRef} className="inline border-b-2 border-transparent">
                {item.title}
              </span>
            </h3>
            
            {/* Description - visible by default */}
            {item.description && (
              <p className="text-neutral-100 font-medium text-[12px] lg:text-xs leading-relaxed max-w-md">
                {item.description}
              </p>
            )}
          </div>

          {/* Arrow Circle - Top Right */}
          <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
            <div ref={arrowRef} className="w-10 h-10 lg:w-12 lg:h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-neutral-800"
              >
                <path
                  d="M3 13L13 3M13 3H3M13 3V13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </PrismicNextLink>
    </article>
  );
}
