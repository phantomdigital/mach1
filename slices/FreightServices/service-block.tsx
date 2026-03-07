"use client";

import { useRef, useState } from "react";
import { PrismicNextImage } from "@prismicio/next";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";
import type { Content } from "@prismicio/client";

const UNHOVER_DELAY_MS = 350; // Wait for external icon fade (300ms) before icon slides back

export function ServiceBlock({
  icon,
  title,
  description,
}: {
  icon: Content.FreightServicesSlice["items"][number]["icon"];
  title: string | null | undefined;
  description: string | null | undefined;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      leaveTimeoutRef.current = null;
    }, UNHOVER_DELAY_MS);
  };

  const iconSize = "w-16 h-16 md:w-12 md:h-12 lg:w-14 lg:h-14";
  const hovered = isHovered;

  return (
    <div
      className="flex flex-col items-start gap-4 md:gap-3 lg:gap-4 min-w-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-hovered={hovered}
    >
      {/* Top row: icon slides right on hover, external icon fades in */}
      <div className="flex w-full items-center gap-4 overflow-visible">
        <div className={`relative flex-shrink-0 overflow-visible ${iconSize}`}>
          {icon?.url && (
            <div
              className={`w-full h-full transition-transform duration-300 ease-out ${
                hovered ? "translate-x-[calc(100%+1rem)] delay-0" : "translate-x-0 delay-300"
              }`}
            >
              <PrismicNextImage
                field={icon}
                className="w-full h-full object-contain"
                loading="lazy"
                quality={85}
                sizes="(max-width: 768px) 64px, 56px"
              />
            </div>
          )}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out pointer-events-none ${
              hovered ? "opacity-100 delay-250" : "opacity-0 delay-0"
            }`}
          >
            <ExternalLinkIcon className="w-6 h-6 md:w-5 md:h-5" color="#1e1e4a" />
          </div>
        </div>
        {icon?.url && <div className={`flex-shrink-0 ${iconSize}`} aria-hidden />}
      </div>
      {/* Title + description */}
      <div className="flex flex-col gap-3 md:gap-0.5 min-w-0 w-full">
        {title && (
          <h3
            className={`text-neutral-800 text-lg font-semibold leading-tight m-0 inline-block self-start border-b-2 transition-colors duration-300 ${
              hovered ? "border-neutral-800" : "border-transparent"
            }`}
          >
            {title}
          </h3>
        )}
        {description && (
          <p className="text-neutral-600 text-sm md:text-xs font-normal leading-relaxed m-0">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
