"use client";

import React, { Suspense } from "react";
import type { Content, ImageField } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";

const NetworkOverviewAnimation = React.lazy(() => import("./network-overview-animation"));

export type NetworkOverviewClientProps = {
  slice: Content.NetworkSliceNetworkOverview;
};

// Stat item component with optional icon
function StatItem({ 
  icon, 
  number, 
  label,
  description
}: { 
  icon?: ImageField | null;
  number: string | null | undefined; 
  label: string | null | undefined;
  description?: string | null;
}) {
  if (!number) return null;
  
  const fullNumber = String(number).trim();
  
  return (
    <div className="flex items-start gap-3 lg:gap-4">
      {/* Icon */}
      {icon?.url && (
        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14">
          <PrismicNextImage
            field={icon}
            className="w-full h-full object-contain"
            loading="lazy"
            quality={85}
            sizes="56px"
          />
        </div>
      )}
      
      {/* Number + Label (same line, same weight) | Description below */}
      <div className="flex flex-col gap-0.5">
        <p className="text-neutral-800 text-sm md:text-base font-medium leading-tight m-0">
          {fullNumber}{label ? ` ${label}` : ""}
        </p>
        {description && (
          <p className="text-neutral-600 text-[11px] md:text-xs font-normal leading-relaxed m-0">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function NetworkOverviewClient({ slice }: NetworkOverviewClientProps) {
  // Access statistics group with type assertion
  const primary = slice.primary as Content.NetworkSliceNetworkOverview["primary"] & {
    statistics?: Array<{
      stat_icon?: ImageField | null;
      stat_number?: string | null;
      stat_label?: string | null;
      stat_description?: string | null;
    }>;
  };
  
  const statistics = primary.statistics || [];
  const hasStats = statistics.length > 0;
  
  const networkContent = (
    <div className="flex flex-col gap-12">
      {/* Stats Row */}
      {hasStats && (
        <div className="flex flex-col lg:flex-row flex-wrap w-fit gap-6 lg:gap-8 xl:gap-12" data-animate="stats-row">
          {statistics.map((stat, index) => (
            <StatItem 
              key={index}
              icon={stat.stat_icon}
              number={stat.stat_number} 
              label={stat.stat_label}
              description={stat.stat_description}
            />
          ))}
        </div>
      )}

      {/* See Our Locations CTA */}
      {slice.primary.button_text && slice.primary.button_link && (
        <div data-animate="locations-cta">
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
  );

  return (
    <Suspense fallback={<div>{networkContent}</div>}>
      <NetworkOverviewAnimation>
        {networkContent}
      </NetworkOverviewAnimation>
    </Suspense>
  );
}
