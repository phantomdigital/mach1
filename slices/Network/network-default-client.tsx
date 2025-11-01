"use client";

import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass } from "@/lib/spacing";
import NetworkTabs from "./network-tabs";
import { Loader2 } from "lucide-react";

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
const NetworkDefault = ({ slice }: NetworkDefaultProps): JSX.Element => {
  const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
  const paddingTop = getPaddingTopClass(slice.primary.padding_top || "large");
  const paddingBottom = getPaddingBottomClass(slice.primary.padding_bottom || "large");

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


  return (
    <section
      data-slice-type="network"
      data-slice-variation="default"
      className={`w-full bg-white ${marginTop} ${paddingTop} ${paddingBottom}`}
    >
      <div className="w-full max-w-[100rem] mx-auto px-4 lg:px-8">
        {/* Header Section */}
        {(slice.primary.subheading || slice.primary.heading || slice.primary.description) && (
          <div className="text-center mb-16">
            {slice.primary.subheading && (
              <h5 className="text-neutral-800 text-sm uppercase tracking-wider mb-4">
                {slice.primary.subheading}
              </h5>
            )}
            {slice.primary.heading && (
              <h2 className="text-neutral-800 text-4xl lg:text-6xl mb-6 max-w-4xl mx-auto">
                {slice.primary.heading}
              </h2>
            )}
            {slice.primary.description && (
              <p className="text-neutral-600 text-lg max-w-3xl mx-auto">
                {slice.primary.description}
              </p>
            )}
          </div>
        )}

        {/* Main Content Grid: Globe + Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start pt-32">
          {/* 3D Globe - independent positioning with overflow */}
          <div className="order-2 lg:order-1 relative overflow-visible" style={{ minHeight: "1000px" }}>
            <Globe3D 
            activeRegion={activeRegion} 
            allLocations={allLocations}
            activeLocations={activeLocations}
          />
          </div>

          {/* Region Tabs and Information */}
          <div className="order-1 lg:order-2">
            {regionsArray && regionsArray.length > 0 && (
              <NetworkTabs
                regions={regionsArray}
                onRegionChange={setActiveRegion}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkDefault;

