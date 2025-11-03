"use client";

import { useMemo } from "react";
import type { Content } from "@prismicio/client";
import TestimonialCard from "./testimonial-card";

interface TestimonialsAnimationProps {
  testimonials: Content.TestimonialsSliceDefaultItem[];
  numberOfRows: number | null;
  scrollSpeed: number | null;
  gap: number | null;
}

export default function TestimonialsAnimation({
  testimonials,
  numberOfRows = 2,
  scrollSpeed = 1,
  gap = 32,
}: TestimonialsAnimationProps) {
  const rows = numberOfRows || 2;
  const durationSeconds = useMemo(() => {
    const speed = scrollSpeed || 1; // higher speed => shorter duration
    const base = 40; // seconds
    const d = base / speed;
    return Math.max(12, Math.min(120, d));
  }, [scrollSpeed]);
  
  // Distribute testimonials across rows
  const distributeTestimonials = () => {
    const distributed: Content.TestimonialsSliceDefaultItem[][] = Array.from(
      { length: rows },
      () => []
    );

    testimonials.forEach((testimonial, index) => {
      distributed[index % rows].push(testimonial);
    });

    return distributed;
  };

  const rowsData = distributeTestimonials();

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1920;

  return (
    <div className="w-full overflow-hidden">
      <div className="space-y-8">
        {rowsData.map((rowTestimonials, rowIndex) => {
          const cardWidth = 400;
          const gapPx = gap || 32;
          const itemsInRow = rowTestimonials.length || 1;
          const baseSetWidth = itemsInRow * cardWidth + Math.max(0, itemsInRow - 1) * gapPx;
          const cycles = Math.max(1, Math.ceil((viewportWidth + cardWidth) / Math.max(1, baseSetWidth)));
          const computedSetWidth = cycles * (itemsInRow * cardWidth) + ((cycles * itemsInRow) - 1) * gapPx;
          const loopDistance = computedSetWidth + gapPx; // add one gap between sets

          return (
          <div
            key={rowIndex}
            className="relative overflow-hidden marquee"
            // Use CSS custom properties; TS doesn't understand string index on style, so cast
            style={{
              ["--gap" as any]: `${gapPx}px`,
              ["--duration" as any]: `${durationSeconds}s`,
              ["--set-width" as any]: `${computedSetWidth}px`,
              ["--loop-distance" as any]: `${loopDistance}px`,
            } as React.CSSProperties}
          >
            <div className={`track ${rowIndex % 2 !== 0 ? "reverse" : ""}`}>
              {/* first set */}
              <div className="track-set">
                {Array.from({ length: cycles }).map((_, cycleIdx) =>
                  rowTestimonials.map((testimonial, cardIndex) => (
                    <TestimonialCard 
                      key={`a-${cycleIdx}-${cardIndex}`}
                      testimonial={testimonial}
                    />
                  ))
                )}
              </div>
              {/* second set - exact duplicate for seamless wrap */}
              <div className="track-set">
                {Array.from({ length: cycles }).map((_, cycleIdx) =>
                  rowTestimonials.map((testimonial, cardIndex) => (
                    <TestimonialCard 
                      key={`b-${cycleIdx}-${cardIndex}`}
                      testimonial={testimonial}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>
      <style jsx>{`
        .marquee {
          --gap: 2rem;
          --duration: 40s;
          --epsilon: 2px; /* wrap slightly earlier to hide rounding issues */
          user-select: none;
        }
        .track {
          display: flex;
          gap: 0; /* avoid extra gap between duplicated sets */
          align-items: center;
          width: max-content;
          animation: marquee var(--duration) linear infinite;
          will-change: transform;
        }
        .track.reverse {
          animation-name: marquee-reverse;
        }
        .track-set {
          display: flex;
          gap: var(--gap);
        }
        /* add exactly one gap between the two sets */
        .track-set + .track-set { margin-left: var(--gap); }
        /* Move one set-width plus a single gap, minus epsilon for early wrap */
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-1 * (var(--loop-distance) - var(--epsilon)))); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(calc(-1 * (var(--loop-distance) - var(--epsilon)))); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

