import React from "react";
import type { Content } from "@prismicio/client";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, getPaddingTopClassMobileOnly } from "@/lib/spacing";
import { SliceHeader } from "@/components/slice-header";
import { NetworkOverviewClient } from "./network-overview-client";

/**
 * Props for `NetworkOverview`.
 */
export type NetworkOverviewProps = {
  slice: Content.NetworkSliceNetworkOverview;
};

/**
 * Component for "Network" Network Overview variation.
 */
const NetworkOverview = ({ slice }: NetworkOverviewProps): React.ReactElement => {
  const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
  const paddingTopSetting = slice.primary.padding_top || "large";
  const paddingTop = paddingTopSetting === "none" 
    ? getPaddingTopClassMobileOnly("medium") 
    : getPaddingTopClass(paddingTopSetting);
  const paddingBottom = getPaddingBottomClass(slice.primary.padding_bottom || "large");
  const backgroundColor = slice.primary.background_color || "#ffffff";

  return (
    <section
      data-slice-type="network"
      data-slice-variation="networkOverview"
      className={`w-full bg-[var(--bg-color)] ${marginTop} ${paddingTop} ${paddingBottom}`}
      style={{ '--bg-color': backgroundColor } as React.CSSProperties & { '--bg-color': string }}
    >
      <div className="w-full max-w-[80rem] mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <SliceHeader 
          subheading={slice.primary.subheading} 
          variant="badge"
          badgeVariant="green"
        />
        
        {slice.primary.heading && (
          <h2 className="text-neutral-800 text-3xl lg:text-5xl mb-6">
            {slice.primary.heading}
          </h2>
        )}

        {/* Intro Description - Prominent text explaining what MACH1 is */}
        {slice.primary.description && (
          <p className="text-neutral-600 text-xl lg:text-2xl leading-relaxed max-w-full mb-12 lg:mb-16">
            {slice.primary.description}
          </p>
        )}

        {/* Client Component with stats */}
        <NetworkOverviewClient slice={slice} />
      </div>
    </section>
  );
};

export default NetworkOverview;

