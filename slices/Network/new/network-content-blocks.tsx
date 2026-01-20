"use client";

import React from "react";
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

interface NetworkContentBlocksProps {
  regions: Region[];
  activeRegion: string;
  onRegionChange: (regionId: string) => void;
}

/**
 * Supabase-style content blocks for network information
 * Displays as static text blocks stacked vertically on the right side
 */
export default function NetworkContentBlocks({ 
  regions, 
  activeRegion,
  onRegionChange 
}: NetworkContentBlocksProps) {
  if (!regions || regions.length === 0) {
    return null;
  }

  const activeRegionData = regions.find(r => r.region_id === activeRegion) || regions[0];

  return (
    <div className="flex flex-col gap-12 lg:gap-16">
      {/* Region selector tabs - horizontal pills */}
      {regions.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {regions.map((region) => (
            <button
              key={region.region_id}
              onClick={() => onRegionChange(region.region_id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeRegion === region.region_id
                  ? 'bg-mach1-green text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {region.region_name}
            </button>
          ))}
        </div>
      )}

      {/* Main content block 1 - Region description */}
      {activeRegionData && (
        <div className="space-y-6">
          <h3 className="text-white text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight">
            {activeRegionData.region_name}
          </h3>
          
          {activeRegionData.region_description && (
            <p className="text-neutral-300 text-base lg:text-lg leading-relaxed">
              {activeRegionData.region_description}
            </p>
          )}

          {/* Locations list */}
          {activeRegionData.locations && activeRegionData.locations.length > 0 && (
            <div className="space-y-6 mt-8">
              {activeRegionData.locations.map((location, idx) => (
                location.location_name && (
                  <div key={idx} className="space-y-2">
                    <h5 className="text-mach1-green text-xs uppercase tracking-wider font-semibold">
                      {location.location_name}
                    </h5>
                    {location.location_value && (
                      <h4 className="text-white text-xl lg:text-2xl font-bold leading-tight">
                        {location.location_value}
                      </h4>
                    )}
                    {location.location_description && (
                      <p className="text-neutral-300 text-sm lg:text-base leading-relaxed">
                        {location.location_description}
                      </p>
                    )}
                  </div>
                )
              ))}
            </div>
          )}

          {/* See more link */}
          {isFilled.link(activeRegionData.see_more_link) && (
            <div className="pt-4">
              <PrismicNextLink
                field={activeRegionData.see_more_link}
                className="inline-flex items-center text-sm font-medium text-mach1-green hover:text-white transition-colors duration-150 group"
              >
                {activeRegionData.see_more_text || "See More"}
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
      )}
    </div>
  );
}

