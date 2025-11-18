import React, { Suspense } from "react";
import type { Content } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, getPaddingTopClassMobileOnly } from "@/lib/spacing";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";
import { SliceHeader } from "@/components/slice-header";

// Lazy load animation component to improve initial page load
const NetworkOverviewAnimation = React.lazy(() => import("./network-overview-animation"));

/**
 * Props for `NetworkOverview`.
 */
export type NetworkOverviewProps = {
  slice: Content.NetworkSliceNetworkOverview;
};

// Helper function to split statistic number into number and suffix
function splitStatisticNumber(value: string | null | undefined): { number: string; suffix: string } {
  if (!value) return { number: "", suffix: "" };
  
  // Match digits (including decimals) followed by non-digit characters
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  
  if (match) {
    return {
      number: match[1],
      suffix: match[2]
    };
  }
  
  // If no match, return the whole value as number
  return { number: value, suffix: "" };
}

// Content component that renders immediately (no animation dependency)
function NetworkOverviewContent({ slice }: NetworkOverviewProps) {
  // Split statistic number into number and suffix
  const { number: statNumber, suffix: statSuffix } = splitStatisticNumber(slice.primary.statistic_number);
  
  const networkContent = (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-28 pt-12">
      {/* Left Column - Globe with Overlay, Text, and Button */}
      <div className="flex flex-col flex-shrink-0 w-full lg:w-[40%] gap-12" data-animate="left-column">
        {/* Map/Globe Image with Statistic Overlay */}
        {slice.primary.map_image?.url && (
          <div className="relative w-full max-h-[300px] lg:max-h-[350px]">
            <PrismicNextImage
              field={slice.primary.map_image}
              className="w-full h-full object-contain"
              loading="lazy"
              quality={85}
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            
            {/* Statistic Overlay - Bottom Left */}
            {(statNumber || slice.primary.statistic_label) && (
              <div className="absolute bottom-0 left-0">
                {statNumber && (
                  <div className="text-neutral-800 text-5xl lg:text-6xl font-bold leading-none tracking-tight">
                    {statNumber}
                    {statSuffix && (
                      <span className="text-mach1-green">{statSuffix}</span>
                    )}
                  </div>
                )}
                {slice.primary.statistic_label && (
                  <p className="text-neutral-600 text-sm font-medium mt-1 m-0">
                    {slice.primary.statistic_label}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Description Text */}
        {slice.primary.description && (
          <p className="text-neutral-600 text-base leading-relaxed m-0 max-w-full lg:max-w-sm">
            {slice.primary.description}
          </p>
        )}

        {/* Button */}
        {slice.primary.button_text && slice.primary.button_link && (
          <div className="mt-auto">
            <Button asChild variant="subtle" size="lg" className="w-fit">
              <PrismicNextLink 
                field={slice.primary.button_link}
                className="inline-flex items-center gap-1.5 text-neutral-800 px-0!"
              >
                <span>{slice.primary.button_text}</span>
                <ExternalLinkIcon className="w-2.5 h-2.5" color="currentColor" />
              </PrismicNextLink>
            </Button>
          </div>
        )}
      </div>

      {/* Right Column - Warehouse Image with Locations List */}
      <div className="relative flex-1" data-animate="right-column">
        {slice.primary.warehouse_image?.url && (
          <>
            <div className="relative w-full h-full min-h-[400px]">
              <PrismicNextImage
                field={slice.primary.warehouse_image}
                className="w-full h-full object-cover rounded-sm"
                loading="lazy"
                quality={85}
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            {/* Warehouse Locations List Overlay */}
            {slice.primary.warehouse_list_title && slice.items && slice.items.length > 0 && (
              <div className="absolute top-6 right-6 lg:top-8 lg:right-8 max-w-[160px]">
                <h5 className="text-white text-xs lg:text-sm mb-2">
                  {slice.primary.warehouse_list_title}
                </h5>
                <div className="flex flex-col gap-0.5">
                  {slice.items.map((item, index) => (
                    item.location_name && (
                      <p
                        key={index}
                        className="text-white text-xs m-0"
                      >
                        {item.location_name}
                      </p>
                    )
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <Suspense fallback={<div>{networkContent}</div>}>
      <NetworkOverviewAnimation>
        {networkContent}
      </NetworkOverviewAnimation>
    </Suspense>
  );
}

/**
 * Component for "Network" Network Overview variation.
 */
const NetworkOverview = ({ slice }: NetworkOverviewProps): React.ReactElement => {
  const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
  // Use mobile-only padding when padding_top is "none" to add spacing on mobile
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
      <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <SliceHeader 
          subheading={slice.primary.subheading} 
          variant="badge"
          badgeVariant="green"
        />
        
        {slice.primary.heading && (
          <h2 className="text-neutral-800 text-4xl lg:text-6xl mb-16">
            {slice.primary.heading}
          </h2>
        )}

        {/* Main Content Flex Row */}
        <NetworkOverviewContent slice={slice} />
      </div>
    </section>
  );
};

export default NetworkOverview;

