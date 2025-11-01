import type { Content } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass } from "@/lib/spacing";
import { HeroButton } from "@/components/ui/hero-button";
import NetworkOverviewAnimation from "./network-overview-animation";

/**
 * Props for `NetworkOverview`.
 */
export type NetworkOverviewProps = {
  slice: Content.NetworkSliceNetworkOverview;
};

/**
 * Component for "Network" Network Overview variation.
 */
const NetworkOverview = ({ slice }: NetworkOverviewProps): JSX.Element => {
  const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
  const paddingTop = getPaddingTopClass(slice.primary.padding_top || "large");
  const paddingBottom = getPaddingBottomClass(slice.primary.padding_bottom || "large");

  return (
    <section
      data-slice-type="network"
      data-slice-variation="networkOverview"
      className={`w-full bg-white ${marginTop} ${paddingTop} ${paddingBottom}`}
    >
      <div className="w-full max-w-[100rem] mx-auto px-4 lg:px-8">
        {/* Header Section */}
        {(slice.primary.subheading || slice.primary.heading) && (
          <div className="mb-16">
            {slice.primary.subheading && (
              <h5 className="text-neutral-800 text-sm uppercase tracking-wider mb-4">
                {slice.primary.subheading}
              </h5>
            )}
            {slice.primary.heading && (
              <h2 className="text-neutral-800 text-4xl lg:text-6xl mb-6">
                {slice.primary.heading}
              </h2>
            )}
          </div>
        )}

        {/* Main Content Flex Row */}
        <NetworkOverviewAnimation>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-28">
            {/* Left Column - Globe with Overlay, Text, and Button */}
            <div className="flex flex-col flex-shrink-0 w-full lg:w-[40%] gap-12" data-animate="left-column">
            {/* Map/Globe Image with Statistic Overlay */}
            {slice.primary.map_image?.url && (
              <div className="relative w-full max-h-[300px] lg:max-h-[350px]">
                <PrismicNextImage
                  field={slice.primary.map_image}
                  className="w-full h-full object-contain"
                  priority
                />
                
                {/* Statistic Overlay - Bottom Left */}
                {(slice.primary.statistic_number || slice.primary.statistic_label) && (
                  <div className="absolute bottom-0 left-0">
                    {slice.primary.statistic_number && (
                      <div className="text-neutral-300 text-5xl lg:text-6xl font-bold leading-none tracking-tight">
                        {slice.primary.statistic_number}
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
              <p className="text-neutral-600 text-base0. leading-relaxed m-0 max-w-full lg:max-w-sm">
                {slice.primary.description}
              </p>
            )}

            {/* Button */}
            {slice.primary.button_text && slice.primary.button_link && (
              <div className="mt-auto">
                <HeroButton asChild className="w-fit">
                  <PrismicNextLink field={slice.primary.button_link}>
                    {slice.primary.button_text}
                  </PrismicNextLink>
                </HeroButton>
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
                    priority
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
        </NetworkOverviewAnimation>
      </div>
    </section>
  );
};

export default NetworkOverview;

