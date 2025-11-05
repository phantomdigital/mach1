"use client";

import { useState, useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { TabsContent } from "@/components/ui/tabs";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";

/**
 * Tab Content Component that maintains fixed height
 * Renders both tab contents always to prevent layout shift
 */
export function TabContentWithFixedHeight({ slice }: { slice: Content.HomepageHeroSlice }) {
  const [activeTab, setActiveTab] = useState("freight_solutions");
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);
  const freightItems = slice.items.filter((item) => (item as any).service_category === "freight_solutions");
  const specialtyItems = slice.items.filter((item) => (item as any).service_category === "specialties");
  const freightRef = useRef<HTMLDivElement>(null);
  const specialtyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('tab-change', handleTabChange as EventListener);
    return () => window.removeEventListener('tab-change', handleTabChange as EventListener);
  }, []);

  useEffect(() => {
    // Measure both tabs and set container height to the tallest
    const measureHeights = () => {
      if (freightRef.current && specialtyRef.current) {
        // Temporarily make both visible and in normal flow to measure
        const freightOriginalClasses = freightRef.current.className;
        const specialtyOriginalClasses = specialtyRef.current.className;
        
        // Make both visible and in normal flow for measurement
        freightRef.current.className = "opacity-100 visible relative";
        specialtyRef.current.className = "opacity-100 visible relative";
        
        // Force reflow
        void freightRef.current.offsetHeight;
        
        const freightHeight = freightRef.current.offsetHeight;
        const specialtyHeight = specialtyRef.current.offsetHeight;
        const maxHeight = Math.max(freightHeight, specialtyHeight);
        setContainerHeight(maxHeight);
        
        // Restore original classes
        freightRef.current.className = freightOriginalClasses;
        specialtyRef.current.className = specialtyOriginalClasses;
      }
    };

    // Measure after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(measureHeights, 100);
    // Also measure on window resize
    window.addEventListener('resize', measureHeights);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', measureHeights);
    };
  }, [freightItems, specialtyItems, activeTab]);

  const renderServiceItem = (item: any, index: number) => (
    <div key={index} className="group flex items-start gap-3 cursor-pointer">
      {/* Service Icon */}
      {item.service_icon && item.service_icon.url ? (
        <PrismicNextImage
          field={item.service_icon}
          className="w-6 h-6 object-contain flex-shrink-0 mt-0.5"
          alt={item.service_title || "icon"}
          loading="lazy"
        />
      ) : (
        <svg className="w-6 h-6 text-neutral-800 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
      
      {/* Service Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {item.service_title && (
            <h6 className="text-lg font-semibold text-neutral-800 m-0 group-hover:underline">
              {item.service_title}
            </h6>
          )}
          {/* External Link Icon - appears on hover, no transition */}
          <div className="hidden group-hover:block">
            <ExternalLinkIcon className="w-[11px] h-[11px]" color="#262626" />
          </div>
        </div>
        {item.service_description && (
          <p className="text-base text-neutral-600 leading-relaxed mt-1 mb-0">
            {item.service_description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Use TabsContent to sync with Radix state */}
      <TabsContent value="freight_solutions" className="hidden" />
      <TabsContent value="specialties" className="hidden" />
      
      {/* Both contents rendered always - Freight in flow, Specialties absolutely positioned */}
      <div className="relative overflow-hidden" style={{ minHeight: containerHeight ? `${containerHeight}px` : undefined }}>
        {/* Freight Solutions - always rendered in normal flow to contribute to height */}
        <div 
          ref={freightRef}
          className={`${activeTab === "freight_solutions" ? "opacity-100 visible relative z-10" : "opacity-0 invisible absolute pointer-events-none"}`}
        >
          <div className="space-y-4">
            {freightItems.length > 0 ? (
              freightItems.map((item, index) => renderServiceItem(item, index))
            ) : (
              <p className="text-sm text-neutral-500">No freight solutions configured</p>
            )}
          </div>
        </div>

        {/* Specialties - always rendered, absolutely positioned to overlap */}
        <div 
          ref={specialtyRef}
          className={`absolute top-0 left-0 right-0 ${activeTab === "specialties" ? "opacity-100 visible z-10" : "opacity-0 invisible pointer-events-none"}`}
        >
          <div className="space-y-4">
            {specialtyItems.length > 0 ? (
              specialtyItems.map((item, index) => renderServiceItem(item, index))
            ) : (
              <p className="text-sm text-neutral-500">No specialties configured</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

