"use client";

import type { SolutionDocument } from "@/types.generated";
import { PrismicLink } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";

interface SolutionCardProps {
  solution: SolutionDocument;
}

export default function SolutionCard({ solution }: SolutionCardProps) {
  return (
    <div 
      className="relative group cursor-pointer" 
      style={{ width: '294px', height: '400px' }}
      onMouseEnter={(e) => {
        const line = e.currentTarget.querySelector('[data-line="true"]') as HTMLElement;
        if (line) line.style.height = '23px';
      }}
      onMouseLeave={(e) => {
        const line = e.currentTarget.querySelector('[data-line="true"]') as HTMLElement;
        if (line) line.style.height = '0px';
      }}
    >
      {/* Background SVG Shape */}
      <div className="absolute inset-0" data-svg-wrapper data-layer="Vector">
        <svg width="294" height="400" viewBox="0 0 294 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M266.404 3.16968e-05L289.57 20.9404C291.841 24.1716 293.159 27.9689 293.382 31.8999L293.382 231.195L293.364 231.195L293.381 399.802L27.176 399.802L4.01047 378.861C1.73923 375.63 0.421019 371.833 0.198363 367.902L0.199364 225.499L0.217186 225.499L0.199356 4.3333e-05L266.404 3.16968e-05Z" fill="#2b2e7f"/>
        </svg>
      </div>

      {/* Bottom Section SVG - Increased height for text content */}
      <div className="absolute bottom-0 left-0" data-svg-wrapper data-layer="Vector">
        <svg width="294" height="180" viewBox="0 0 294 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M293.382 0.945786L293.382 22.0094L293.382 32.8872L293.382 63.4486L293.364 63.4486L293.381 179.802L27.176 179.802L4.0105 158.861C1.73926 155.63 0.42105 151.833 0.198393 147.902L0.199399 57.7527L0.217222 57.7527L8.64885e-05 0.945783L293.382 0.945786Z" fill="#ececec"/>
        </svg>
      </div>

      {/* Image Container - Blue Section */}
      {solution.data.featured_image.url && (
        <div className="absolute top-0 left-0 right-0 overflow-hidden" style={{ bottom: '177px', clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)' }}>
          <PrismicNextImage
            field={solution.data.featured_image}
            className="w-full h-full object-cover"
            sizes="294px"
          />
        </div>
      )}

      {/* Animated Line - grows down from image on hover */}
      <div 
        className="absolute bg-mach1-black transition-all duration-300 ease-out"
        style={{ 
          left: '14px', // Align with text padding (p-6 = 24px)
          top: '285px', // Moved down into the gray section
          width: '1.9px',
          height: '0px',
          transformOrigin: 'top'
        }}
        data-line="true"
      />

      {/* Text Content - Gray Section */}
      <PrismicLink document={solution} className="absolute bottom-0 left-0 w-full p-6 block" style={{ height: '180px' }}>
        {/* Category */}
        {solution.data.category && (
          <span 
            className="inline-block px-3 py-1 text-xs font-medium text-mach1-black bg-white rounded-full mb-3 uppercase tracking-wide"
            style={{ 
              fontFamily: '"space-mono", monospace',
              fontWeight: 400,
              fontStyle: 'normal',
            }}
          >
            {solution.data.category}
          </span>
        )}

        {/* Title with hover icon */}
        {solution.data.title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span>{solution.data.title}</span>
            <ExternalLinkIcon 
              className="w-[13px] h-[13px] opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
              color="#374151"
            />
          </h3>
        )}

        {/* Description */}
        {solution.data.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {solution.data.description}
          </p>
        )}
      </PrismicLink>
    </div>
  );
}
