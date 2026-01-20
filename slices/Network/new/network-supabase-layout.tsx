"use client";

import type { Content } from "@prismicio/client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, getPaddingTopClassMobileOnly } from "@/lib/spacing";
import NetworkSupabaseAnimation from "./network-supabase-animation";
import NetworkStats from "./network-stats";
import NetworkContentBlocks from "./network-content-blocks";
import { SliceHeader } from "@/components/slice-header";
import { Loader2 } from "lucide-react";
import React from "react";

// Dynamically import Globe3D to avoid SSR issues with Three.js
const Globe3D = dynamic(() => import("../globe-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square flex items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
      <p className="text-neutral-600 text-lg">Loading globe...</p>
    </div>
  ),
});

/**
 * Props for `NetworkSupabaseLayout`.
 */
export type NetworkSupabaseLayoutProps = {
  slice: Content.NetworkSliceDefault;
};

/**
 * Supabase-style Network layout
 * - Centered stats row at top
 * - Full-width section with globe on left, content blocks on right
 * - Tab-driven globe rotation preserved
 */
const NetworkSupabaseLayout = ({ slice }: NetworkSupabaseLayoutProps): React.ReactElement => {
  const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
  const paddingTopSetting = slice.primary.padding_top || "large";
  const paddingTop = paddingTopSetting === "none" 
    ? getPaddingTopClassMobileOnly("medium") 
    : getPaddingTopClass(paddingTopSetting);
  const paddingBottom = getPaddingBottomClass(slice.primary.padding_bottom || "large");
  const backgroundColor = slice.primary.background_color || "#ffffff";

  // Group items by region
  const regions = slice.items.reduce((acc, item) => {
    if (!item.region_id) return acc;
    
    if (!acc[item.region_id]) {
      acc[item.region_id] = {
        region_id: item.region_id,
        region_name: item.region_name,
        region_description: item.region_description,
        see_more_link: item.see_more_link,
        see_more_text: item.see_more_text,
        locations: []
      };
    }
    
    // Add location if it has coordinates
    if (item.location_coordinates) {
      acc[item.region_id].locations.push({
        location_name: item.location_name,
        location_coordinates: item.location_coordinates,
        location_value: item.location_value,
        location_description: item.location_description
      });
    }
    
    return acc;
  }, {} as Record<string, any>);

  const regionsArray = Object.values(regions);

  // Set initial active region
  const [activeRegion, setActiveRegion] = useState(
    regionsArray[0]?.region_id || "asia-pacific"
  );

  // Get all locations across all regions for the globe
  const allLocations = regionsArray.flatMap(region => region.locations || []);
  
  // Get locations for the active region (for camera focus)
  const activeRegionData = regions[activeRegion];
  const activeLocations = activeRegionData?.locations || [];

  const stats = slice.primary.statistics || [];

  return (
    <section
      data-slice-type="network"
      data-slice-variation="supabase"
      className={`w-full bg-[var(--bg-color)] ${marginTop} ${paddingTop} ${paddingBottom}`}
      style={{ '--bg-color': backgroundColor } as React.CSSProperties & { '--bg-color': string }}
    >
      <NetworkSupabaseAnimation>
        {/* Full-width container - everything on same background */}
        <div className="w-full">
          
          {/* Centered Header & Stats */}
          <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12 lg:mb-16" data-animate="header">
              {slice.primary.subheading && (
                <div className="mb-6">
                  <SliceHeader 
                    subheading={slice.primary.subheading} 
                    textColor="text-white"
                    variant="badge"
                    badgeVariant="green"
                    textAlign="center"
                  />
                </div>
              )}
              {slice.primary.heading && (
                <h2 className="text-white text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight mb-6">
                  {slice.primary.heading}
                </h2>
              )}
              {slice.primary.description && (
                <p className="text-neutral-300 text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
                  {slice.primary.description}
                </p>
              )}
            </div>

            {/* Stats Row - Supabase style */}
            {Array.isArray(stats) && stats.length > 0 && (
              <div data-animate="stats">
                <NetworkStats statistics={stats} />
              </div>
            )}
          </div>

          {/* Globe + Content Section - sits below stats on same background */}
          <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8 py-16 lg:py-24">
            <div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              data-animate="globe-section"
            >
              {/* Globe - Left Side */}
              <div className="order-2 lg:order-1 relative" data-animate="globe">
                <Globe3D 
                  activeRegion={activeRegion} 
                  allLocations={allLocations}
                  activeLocations={activeLocations}
                  canvasHeight={slice.primary.canvas_height || 700}
                />
              </div>

              {/* Content Blocks - Right Side */}
              <div className="order-1 lg:order-2" data-animate="content">
                {regionsArray && regionsArray.length > 0 && (
                  <NetworkContentBlocks
                    regions={regionsArray}
                    activeRegion={activeRegion}
                    onRegionChange={setActiveRegion}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </NetworkSupabaseAnimation>
    </section>
  );
};

export default NetworkSupabaseLayout;

