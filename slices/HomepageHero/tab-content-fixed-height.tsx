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

  const renderServiceItem = (item: any, index: number, isLast: boolean, isFirst: boolean) => (
    <div key={index} className={`group flex items-start cursor-pointer relative pl-4 py-3 ${!isLast ? 'border-b border-neutral-200' : ''}`}>
      {/* Service Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {item.service_title && (
            <h6 className="text-lg font-semibold text-neutral-800 m-0 group-hover:underline">
              {item.service_title}
            </h6>
          )}
          {/* External Link Icon - appears on hover */}
          <ExternalLinkIcon 
            className="w-[11px] h-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
            color="#262626" 
          />
        </div>
        {item.service_description && (
          <p className="text-base text-neutral-600 leading-relaxed mt-1 mb-0">
            {item.service_description}
          </p>
        )}
      </div>
      
      {/* Hover line - matches header dropdown with bottom-up animation */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out origin-bottom scale-y-0 group-hover:scale-y-100" />
  </div>
  );
  
  const renderServiceList = (items: any[], listRef: React.RefObject<HTMLDivElement | null>) => (
    <div className="flex flex-col relative" ref={listRef}>
      {/* Continuous vertical line for entire list - matches header dropdown */}
      <div 
        className="absolute left-0 w-px" 
        style={{ 
          backgroundColor: '#DFDFDF',
          top: '-8px',
          bottom: '-8px'
        }}
      />
      
      {items.length > 0 ? (
        items.map((item, index) => renderServiceItem(item, index, index === items.length - 1, index === 0))
      ) : (
        <p className="text-sm text-neutral-500">No items configured</p>
      )}
    </div>
  );

  return (
    <>
      {/* Use TabsContent to sync with Radix state */}
      <TabsContent value="freight_solutions" className="hidden" />
      <TabsContent value="specialties" className="hidden" />
      
      {/* Both tab contents rendered always - Freight in flow, Specialties absolutely positioned */}
      <div className="relative overflow-hidden" style={{ minHeight: containerHeight ? `${containerHeight}px` : undefined }}>
        {/* Freight Solutions - always rendered in normal flow to contribute to height */}
        <div 
          className={`${activeTab === "freight_solutions" ? "opacity-100 visible relative z-10" : "opacity-0 invisible absolute pointer-events-none"}`}
        >
          {renderServiceList(freightItems, freightRef)}
        </div>

        {/* Specialties - always rendered, absolutely positioned to overlap */}
        <div 
          className={`absolute top-0 left-0 right-0 ${activeTab === "specialties" ? "opacity-100 visible z-10" : "opacity-0 invisible pointer-events-none"}`}
        >
          {renderServiceList(specialtyItems, specialtyRef)}
        </div>
      </div>
    </>
  );
}

