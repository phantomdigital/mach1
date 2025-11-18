"use client";

import { useMemo } from "react";
import type { TestimonialsSliceDefaultItem } from "@/types.generated";
import TestimonialCard from "./testimonial-card";

// Extend CSSProperties to include CSS custom properties
interface CSSCustomProperties extends React.CSSProperties {
  '--gap'?: string;
  '--duration'?: string;
  '--set-width'?: string;
  '--loop-distance'?: string;
}

interface TestimonialsAnimationProps {
  testimonials: TestimonialsSliceDefaultItem[];
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
  // Memoize expensive calculations to prevent unnecessary recalculations
  const animationConfig = useMemo(() => {
    const rows = numberOfRows || 2;
    const speed = scrollSpeed || 1;
    const base = 40; // seconds
    const durationSeconds = Math.max(12, Math.min(120, base / speed));
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
    
    return { rows, durationSeconds, viewportWidth };
  }, [numberOfRows, scrollSpeed]);
  
  // Memoize testimonial distribution to avoid recalculating on every render
  const rowsData = useMemo(() => {
    const distributed: TestimonialsSliceDefaultItem[][] = Array.from(
      { length: animationConfig.rows },
      () => []
    );

    testimonials.forEach((testimonial, index) => {
      distributed[index % animationConfig.rows].push(testimonial);
    });

    return distributed;
  }, [testimonials, animationConfig.rows]);

  // Memoize row calculations to avoid expensive recalculations
  const rowCalculations = useMemo(() => {
    const cardWidth = 400;
    const gapPx = gap || 32;
    
    return rowsData.map((rowTestimonials) => {
      const itemsInRow = rowTestimonials.length || 1;
      const baseSetWidth = itemsInRow * cardWidth + Math.max(0, itemsInRow - 1) * gapPx;
      const cycles = Math.max(1, Math.ceil((animationConfig.viewportWidth + cardWidth) / Math.max(1, baseSetWidth)));
      const computedSetWidth = cycles * (itemsInRow * cardWidth) + ((cycles * itemsInRow) - 1) * gapPx;
      const loopDistance = computedSetWidth + gapPx;
      
      return {
        cycles,
        computedSetWidth,
        loopDistance,
        gapPx,
        itemsInRow
      };
    });
  }, [rowsData, gap, animationConfig.viewportWidth]);

  return (
    <div className="w-full overflow-hidden">
      <div className="space-y-8">
        {rowsData.map((rowTestimonials, rowIndex) => {
          const calculations = rowCalculations[rowIndex];

          return (
          <div
            key={rowIndex}
            className="relative overflow-hidden marquee"
            style={{
              '--gap': `${calculations.gapPx}px`,
              '--duration': `${animationConfig.durationSeconds}s`,
              '--set-width': `${calculations.computedSetWidth}px`,
              '--loop-distance': `${calculations.loopDistance}px`,
            } as CSSCustomProperties}
          >
            <div className={`track ${rowIndex % 2 !== 0 ? "reverse" : ""}`}>
              {/* first set */}
              <div className="track-set">
                {Array.from({ length: calculations.cycles }).map((_, cycleIdx) =>
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
                {Array.from({ length: calculations.cycles }).map((_, cycleIdx) =>
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

