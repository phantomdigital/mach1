"use client";

import { useState } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialsStackedCarouselProps {
  testimonials: Content.TestimonialsSliceDefaultItem[];
  isDarkBackground?: boolean;
}

export default function TestimonialsStackedCarousel({
  testimonials,
  isDarkBackground = false,
}: TestimonialsStackedCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24">
      {/* Stack Container */}
      <div className="relative h-[380px] sm:h-[420px] lg:h-[520px] flex items-center justify-center overflow-visible">
        {/* Navigation Arrows - Positioned much wider */}
        <button
          onClick={goToPrev}
          disabled={isAnimating}
          className={cn(
            "absolute left-0 sm:-left-24 lg:-left-48 xl:-left-64 z-50 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg flex items-center justify-center transition-all duration-200",
            isDarkBackground
              ? "bg-white/90 hover:bg-white text-dark-blue shadow-lg"
              : "bg-white hover:bg-neutral-50 text-neutral-700 shadow-md border border-neutral-200",
            isAnimating && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
        </button>

        <button
          onClick={goToNext}
          disabled={isAnimating}
          className={cn(
            "absolute right-0 sm:-right-24 lg:-right-48 xl:-right-64 z-50 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg flex items-center justify-center transition-all duration-200",
            isDarkBackground
              ? "bg-white/90 hover:bg-white text-dark-blue shadow-lg"
              : "bg-white hover:bg-neutral-50 text-neutral-700 shadow-md border border-neutral-200",
            isAnimating && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
        </button>

        {/* Stacked Cards - Wider with more overlap */}
        <div className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl h-full">
          {testimonials.map((testimonial, index) => {
            // Calculate position relative to current
            let position = index - current;
            if (position < -1) position = position + testimonials.length;
            if (position > testimonials.length - 2) position = position - testimonials.length;

            // Determine which layer this card is in
            const isCurrent = position === 0;
            const isNext = position === 1;
            const isPrev = position === -1;
            const isVisible = isCurrent || isNext || isPrev;

            return (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-all duration-600 ease-out",
                  !isVisible && "opacity-0 pointer-events-none"
                )}
                style={{
                  transform: isCurrent
                    ? "translateX(0%) scale(1) translateZ(0)"
                    : isNext
                    ? "translateX(18%) scale(0.88) translateZ(-100px)"
                    : isPrev
                    ? "translateX(-18%) scale(0.88) translateZ(-100px)"
                    : "translateX(0%) scale(0.8) translateZ(-200px)",
                  zIndex: isCurrent ? 30 : isNext || isPrev ? 20 : 10,
                  opacity: isVisible ? 1 : 0,
                }}
              >
                <StackedTestimonialCard
                  testimonial={testimonial}
                  isActive={isCurrent}
                />
              </div>
            );
          })}
        </div>
      </div>

   
    </div>
  );
}

// Individual card component with full-width image and overlay text
function StackedTestimonialCard({
  testimonial,
  isActive,
}: {
  testimonial: Content.TestimonialsSliceDefaultItem;
  isActive: boolean;
}) {
  return (
    <div 
      className={cn(
        "w-full h-full rounded-sm overflow-hidden bg-white transition-shadow duration-300",
        isActive && "shadow-2xl"
      )}
    >
      {/* Full width/height background image with text overlay */}
      <div className="relative w-full h-full">
        {/* Background Image */}
        {testimonial.client_photo && testimonial.client_photo.url ? (
          <div className="absolute inset-0">
            <PrismicNextImage
              field={testimonial.client_photo}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay for text contrast - extended coverage */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-blue via-dark-blue/85 to-dark-blue/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-blue/40 via-transparent to-dark-blue/40" />
          </div>
        ) : (
          // Fallback solid background if no photo
          <div className="absolute inset-0 bg-gradient-to-br from-dark-blue to-slate-800" />
        )}

        {/* Content Overlay - Text on top - Mobile optimized */}
        <div className="relative h-full flex flex-col justify-end p-5 sm:p-8 lg:p-12">
          {/* Testimonial Quote */}
          {testimonial.testimonial_text && (
            <div className="mb-4 sm:mb-6">
              {/* Quote Icon - Outlined Squares */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-mach1-green mb-2 sm:mb-3"
              >
                {/* Left quote mark - outlined square */}
                <rect x="2" y="5" width="8" height="8" />
                <path d="M6 13 L6 18" />
                
                {/* Right quote mark - outlined square */}
                <rect x="14" y="5" width="8" height="8" />
                <path d="M18 13 L18 18" />
              </svg>
              <p className="text-white text-sm lg:text-base leading-relaxed max-w-2xl line-clamp-4 sm:line-clamp-none">
                {testimonial.testimonial_text}
              </p>
            </div>
          )}

          {/* Name and Title */}
          <div className="border-t border-white/20 pt-3 sm:pt-4">
            {testimonial.client_name && (
              <h3 className="text-white font-bold text-base lg:text-lg mb-0.5">
                {testimonial.client_name}
              </h3>
            )}
            {(testimonial.client_title || testimonial.company_name) && (
              <p className="text-white/90 text-sm flex items-center gap-2">
                {testimonial.client_title && (
                  <span>{testimonial.client_title}</span>
                )}
                {testimonial.client_title && testimonial.company_name && (
                  <span className="text-white/50">·</span>
                )}
                {testimonial.company_name && (
                  <span className="text-mach1-green font-medium">{testimonial.company_name}</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

