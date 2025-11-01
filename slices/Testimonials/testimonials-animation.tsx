"use client";

import { useMemo } from "react";
import { PrismicNextImage } from "@prismicio/next";
import type { Content } from "@prismicio/client";

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
          const cardWidth = 500;
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
                    <div
                      key={`a-${cycleIdx}-${cardIndex}`}
                      className="testimonial-card flex-shrink-0 w-[500px]"
                      style={{ height: "280px" }}
                    >
                      {/* Outer clipped shape with border */}
                      <div
                        className="relative bg-neutral-200 p-[1.25px] w-full h-full"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                        }}
                      >
                        {/* Inner clipped shape with content */}
                        <div
                          className="relative bg-neutral-50 w-full h-full p-8 flex flex-col"
                          style={{
                            clipPath:
                              "polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))",
                          }}
                        >
                          <div className="space-y-6 flex-1 flex flex-col">
                            {testimonial.testimonial_text && (
                              <p className="text-neutral-800 text-lg leading-relaxed flex-1">
                                "{testimonial.testimonial_text}"
                              </p>
                            )}
                            <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
                              {testimonial.client_photo && testimonial.client_photo.url && (
                                <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-neutral-200">
                                  <PrismicNextImage
                                    field={testimonial.client_photo}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                {testimonial.client_name && (
                                  <p className="text-neutral-800 font-semibold text-sm">
                                    {testimonial.client_name}
                                  </p>
                                )}
                                {(testimonial.client_title || testimonial.company_name) && (
                                  <p className="text-neutral-600 text-sm">
                                    {testimonial.client_title}
                                    {testimonial.client_title && testimonial.company_name && ", "}
                                    {testimonial.company_name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* second set - exact duplicate for seamless wrap */}
              <div className="track-set">
                {Array.from({ length: cycles }).map((_, cycleIdx) =>
                  rowTestimonials.map((testimonial, cardIndex) => (
                  <div
                    key={`b-${cycleIdx}-${cardIndex}`}
                    className="testimonial-card flex-shrink-0 w-[500px]"
                    style={{ height: "280px" }}
                  >
                    {/* Outer clipped shape with border */}
                    <div
                      className="relative bg-neutral-200 p-[1.25px] w-full h-full"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                      }}
                    >
                      {/* Inner clipped shape with content */}
                      <div
                        className="relative bg-neutral-50 w-full h-full p-8 flex flex-col"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))",
                        }}
                      >
                        <div className="space-y-6 flex-1 flex flex-col">
                          {testimonial.testimonial_text && (
                            <p className="text-neutral-800 text-lg leading-relaxed flex-1">
                              "{testimonial.testimonial_text}"
                            </p>
                          )}
                          <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
                            {testimonial.client_photo && testimonial.client_photo.url && (
                              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-neutral-200">
                                <PrismicNextImage
                                  field={testimonial.client_photo}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              {testimonial.client_name && (
                                <p className="text-neutral-800 font-semibold text-sm">
                                  {testimonial.client_name}
                                </p>
                              )}
                              {(testimonial.client_title || testimonial.company_name) && (
                                <p className="text-neutral-600 text-sm">
                                  {testimonial.client_title}
                                  {testimonial.client_title && testimonial.company_name && ", "}
                                  {testimonial.company_name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
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

