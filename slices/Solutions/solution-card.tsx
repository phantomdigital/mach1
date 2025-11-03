"use client";

import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import type { Content } from "@prismicio/client";

interface SolutionCardProps {
  item: Content.SolutionsSliceDefaultItem;
  index: number;
}

export default function SolutionCard({ item, index }: SolutionCardProps) {
  return (
    <article className="group relative overflow-hidden aspect-[4/3] lg:aspect-[16/7] rounded-xs">

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
            {/* Gradient overlay - shorter by default, expands on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 from-0% via-transparent via-40% to-transparent group-hover:from-black/60 group-hover:from-0% group-hover:via-black/30 group-hover:via-60% transition-all duration-300 ease-out" />
          </div>
        )}

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-between p-6 lg:p-8">
          {/* Title and Description at bottom-left */}
          <div className="mt-auto flex flex-col gap-0 group-hover:gap-3 transition-all duration-300 ease-out">
            <h3 className="text-neutral-100 text-xl lg:text-2xl font-bold leading-tight">
              <span className="inline border-b-2 border-transparent group-hover:border-white transition-all duration-200">
                {item.title}
              </span>
            </h3>
            
            {/* Description - shows on hover */}
            {item.description && (
              <div className="max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-300 ease-out">
                <p className="text-neutral-100 font-medium text-[12px] lg:text-xs leading-relaxed opacity-0 group-hover:opacity-100 group-hover:delay-75 transition-opacity duration-300 max-w-md">
                  {item.description}
                </p>
              </div>
            )}
          </div>

          {/* Arrow Circle - Top Right */}
          <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-neutral-100 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-110 transition-all duration-300 ease-out">
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
