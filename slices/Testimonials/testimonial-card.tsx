"use client";

import { PrismicNextImage } from "@prismicio/next";
import type { TestimonialsSliceDefaultItem } from "@/types.generated";

interface TestimonialCardProps {
  testimonial: TestimonialsSliceDefaultItem;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="testimonial-card flex-shrink-0 w-[400px]" style={{ height: "240px" }}>
      {/* Card with rounded corners - Split design */}
      <div className="relative w-full h-full flex flex-col rounded-sm border overflow-hidden">
         {/* Top half - Neutral background */}
         <div className="bg-dark-blue py-6 pl-6 pr-28 flex-1 flex flex-col relative">
           {/* Decorative quotation marks - top left */}
           <div className="absolute top-1 left-4 text-slate-700 pointer-events-none select-none">
             <svg 
               width="60" 
               height="60" 
               viewBox="0 0 24 24" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="0.20"
               strokeLinecap="square"
               className="w-14 h-14 lg:w-32 lg:h-32"
             >
               <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
               <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
             </svg>
           </div>
           {testimonial.testimonial_text && (
             <p className="text-neutral-100 text-sm leading-relaxed flex-1 relative z-10 pl-8 pt-2">
               {testimonial.testimonial_text}
             </p>
           )}
         </div>
        {/* Bottom half - Mach1 green */}
        <div className="bg-mach1-green px-6 py-3 flex-shrink-0">
          <div className="flex items-center gap-4">
            {testimonial.client_photo && testimonial.client_photo.url && (
              <div className="flex-shrink-0 w-12 h-12 rounded-sm overflow-hidden border border-white/20">
                <PrismicNextImage
                  field={testimonial.client_photo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {testimonial.client_name && (
                <p className="text-white font-semibold text-sm">
                  {testimonial.client_name}
                </p>
              )}
              {(testimonial.client_title || testimonial.company_name) && (
                <p className="text-green-200 text-xs">
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
  );
}

