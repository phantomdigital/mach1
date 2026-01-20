"use client";

import type { Content } from "@prismicio/client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, getPaddingTopClassMobileOnly } from "@/lib/spacing";
import NetworkTabs from "./network-tabs";
import NetworkDefaultAnimation from "./network-default-animation";
import { SliceHeader } from "@/components/slice-header";
import { Loader2 } from "lucide-react";
import React from "react";

// Dynamically import Globe3D to avoid SSR issues with Three.js
const Globe3D = dynamic(() => import("./globe-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square flex items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
      <p className="text-neutral-600 text-lg">Loading globe...</p>
    </div>
  ),
});

/**
 * Props for `NetworkDefault`.
 */
export type NetworkDefaultProps = {
  slice: Content.NetworkSliceDefault;
};

/**
 * Client component for "Network" Default variation (3D Globe).
 */
const NetworkDefault = ({ slice }: NetworkDefaultProps): React.ReactElement => {
  const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
  // Use mobile-only padding when padding_top is "none" to add spacing on mobile
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
      data-slice-variation="default"
      className={`w-full bg-[var(--bg-color)] ${marginTop} ${paddingTop} ${paddingBottom}`}
      style={{ '--bg-color': backgroundColor } as React.CSSProperties & { '--bg-color': string }}
    >
      <NetworkDefaultAnimation>
        <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8 overflow-visible">
          {/* Header with SliceHeader */}
          <div data-animate="header">
            <SliceHeader 
              subheading={slice.primary.subheading} 
              textColor="text-neutral-800"
              variant="badge"
              badgeVariant="green"
            />
            {slice.primary.heading && (
              <h2 className="text-neutral-800 text-3xl lg:text-5xl font-bold leading-tight tracking-tight mb-6 lg:mb-8">
                {slice.primary.heading}
              </h2>
            )}
            {slice.primary.description && (
              <p className="text-neutral-600 text-base leading-relaxed max-w-3xl mb-12 lg:mb-16">
                {slice.primary.description}
              </p>
            )}

            {/* Top Statistics Row (optional) */}
            {Array.isArray(stats) && stats.length > 0 && (
              <div className="mb-12 lg:mb-16">
                <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 text-center">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-2 pt-4 border-t border-neutral-200"
                    >
                      <div className="h-0.5 w-10 bg-mach1-green" />
                      {stat.number && (
                        <dd className="text-neutral-800 text-2xl lg:text-3xl font-semibold leading-none tracking-tight">
                          {stat.number}
                          {stat.suffix && (
                            <span className="text-mach1-green">{stat.suffix}</span>
                          )}
                        </dd>
                      )}
                      {stat.label && (
                        <p className="text-neutral-600 text-xs uppercase tracking-wider m-0">
                          {stat.label}
                        </p>
                      )}
                      {stat.sub_label && (
                        <p className="text-neutral-500 text-xs m-0">
                          {stat.sub_label}
                        </p>
                      )}
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Main Content Grid: Globe + Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start overflow-visible relative">
            {/* 3D Globe - reduced size, overflow left for design */}
            <div className="order-1 relative overflow-visible" data-animate="globe">
              {/* Gradient background box on left side - fades from left to right, extends to viewport edge */}
              <div 
                className="absolute inset-y-0 pointer-events-none" 
                style={{
                  left: '-100vw',
                  width: 'calc(100vw + 60%)',
                  background: 'linear-gradient(to right, rgba(229, 229, 229, 0.9) 0%, rgba(229, 229, 229, 0.9) 50%, rgba(229, 229, 229, 0) 100%)',
                  zIndex: -1
                }}
              />
              <Globe3D 
                activeRegion={activeRegion} 
                allLocations={allLocations}
                activeLocations={activeLocations}
                canvasHeight={slice.primary.canvas_height || 700}
              />
            </div>

            {/* Region Tabs and Information */}
            <div className="order-2 lg:pl-4" data-animate="tabs">
              {regionsArray && regionsArray.length > 0 && (
                <NetworkTabs
                  regions={regionsArray}
                  onRegionChange={setActiveRegion}
                />
              )}
            </div>
          </div>
        </div>
      </NetworkDefaultAnimation>
    </section>
  );
};

export default NetworkDefault;

