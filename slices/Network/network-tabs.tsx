"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrismicNextLink } from "@prismicio/next";
import { isFilled } from "@prismicio/client";

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onRegionChange(value);
  };

  if (!regions || regions.length === 0) {
    return null;
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
      {/* Tab Buttons */}
      <TabsList className="w-full justify-start border-b border-neutral-200 bg-transparent rounded-none h-auto p-0 mb-12 flex-wrap gap-2">
        {regions.map((region) => (
          <TabsTrigger
            key={region.region_id}
            value={region.region_id || ""}
            className="px-4 py-2 text-sm font-medium text-neutral-600 data-[state=active]:text-neutral-800 data-[state=active]:border-b-2 data-[state=active]:border-neutral-800 rounded-none bg-transparent transition-colors"
          >
            {region.region_name}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab Content */}
      {regions.map((region) => (
        <TabsContent
          key={region.region_id}
          value={region.region_id || ""}
          className="mt-0"
        >
          <div className="space-y-10">
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
              <div className="grid grid-cols-1 gap-8">
                {region.locations.map((location, idx) => (
                  location.location_name && (
                    <div key={idx} className="space-y-2">
                      <h5 className="text-neutral-800 text-xs uppercase tracking-wider">
                        {location.location_name}
                      </h5>
                      {location.location_value && (
                        <h4 className="text-neutral-800 text-2xl lg:text-3xl">
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
              <div className="pt-2">
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
    </Tabs>
  );
}

