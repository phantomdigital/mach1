"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrismicNextLink } from "@prismicio/next";
import { isFilled } from "@prismicio/client";
import gsap from "gsap";

interface Location {
  location_name: string | null;
  location_coordinates: {
    latitude: number;
    longitude: number;
  } | null;
  location_value: string | null;
  location_description: string | null;
}

interface Region {
  region_id: string;
  region_name: string | null;
  region_description: string | null;
  see_more_link: any;
  see_more_text: string | null;
  locations: Location[];
}

interface NetworkTabsProps {
  regions: Region[];
  onRegionChange: (regionId: string) => void;
}

export default function NetworkTabs({ regions, onRegionChange }: NetworkTabsProps) {
  const [activeTab, setActiveTab] = useState(regions[0]?.region_id || "");
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const handleTabChange = (value: string) => {
    if (value === activeTab) return;

    // Kill any existing animation
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const container = contentContainerRef.current;
    if (!container) {
      setActiveTab(value);
      onRegionChange(value);
      return;
    }

    // Find the active and new content elements
    const previousContent = container.querySelector(`[data-tab-content="${activeTab}"]`) as HTMLElement;
    const newContent = container.querySelector(`[data-tab-content="${value}"]`) as HTMLElement;

    // Create animation timeline
    timelineRef.current = gsap.timeline({
      onComplete: () => {
        setActiveTab(value);
        onRegionChange(value);
      },
    });

    // Fade out previous content
    if (previousContent) {
      timelineRef.current.to(previousContent, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: "power2.in",
      });
    }

    // Fade in new content
    if (newContent) {
      gsap.set(newContent, { opacity: 0, y: 10 });
      timelineRef.current.to(
        newContent,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        previousContent ? "-=0.1" : 0
      );
    } else {
      // If no animation needed, just update immediately
      setActiveTab(value);
      onRegionChange(value);
    }
  };

  // Initialize active tab on mount
  useEffect(() => {
    const container = contentContainerRef.current;
    if (container && activeTab) {
      const activeContent = container.querySelector(`[data-tab-content="${activeTab}"]`) as HTMLElement;
      if (activeContent) {
        gsap.set(activeContent, { opacity: 1, y: 0 });
      }
    }
  }, []);

  if (!regions || regions.length === 0) {
    return null;
  }

  return (
    <div className="lg:pr-8">
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
        {/* Tab Buttons */}
        <TabsList className="mb-6 bg-transparent p-0 h-auto border-b border-neutral-200 rounded-none gap-6 flex-wrap">
          {regions.map((region) => (
            <TabsTrigger
              key={region.region_id}
              value={region.region_id || ""}
              className="pt-0 px-0 pb-2 text-sm font-medium text-neutral-600 data-[state=active]:text-neutral-800 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-neutral-800 data-[state=active]:shadow-none rounded-none border-0 border-b-2 border-transparent"
            >
              {region.region_name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content Container with fixed height for smooth transitions */}
        <div ref={contentContainerRef} className="relative min-h-[200px]">
          {regions.map((region) => (
            <TabsContent
              key={region.region_id}
              value={region.region_id || ""}
              className="mt-0"
            >
              <div
                data-tab-content={region.region_id}
                className="space-y-6"
              >
              {/* Region Description Header */}
              {region.region_description && (
                <div>
                  <p className="text-neutral-600 text-base leading-relaxed">
                    {region.region_description}
                  </p>
                </div>
              )}

              {/* Locations Grid */}
              {region.locations && region.locations.length > 0 && (
                <div className="grid grid-cols-1 gap-6">
                  {region.locations.map((location, idx) => (
                    location.location_name && (
                      <div key={idx} className="space-y-2">
                        <h5 className="text-neutral-800 text-xs uppercase tracking-wider font-medium">
                          {location.location_name}
                        </h5>
                        {location.location_value && (
                          <h4 className="text-neutral-800 text-xl lg:text-2xl font-bold leading-tight tracking-tight">
                            {location.location_value}
                          </h4>
                        )}
                        {location.location_description && (
                          <p className="text-neutral-600 text-sm leading-relaxed">
                            {location.location_description}
                          </p>
                        )}
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* See More Link */}
              {isFilled.link(region.see_more_link) && (
                <div className="pt-2 inline-flex">
                  <PrismicNextLink
                    field={region.see_more_link}
                    className="inline-flex items-center text-sm font-medium text-neutral-800 border-b-2 border-transparent hover:border-neutral-800 transition-all duration-150 ease-out group pb-0.5"
                  >
                    {region.see_more_text || "See More"}
                    <svg
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-150"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </PrismicNextLink>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
        </div>
      </Tabs>
    </div>
  );
}

