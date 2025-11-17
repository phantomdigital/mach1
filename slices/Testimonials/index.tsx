import React from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, type MarginTopSize, type PaddingSize } from "@/lib/spacing";
import { SliceHeader } from "@/components/slice-header";
import TestimonialsAnimation from "./testimonials-animation";
import HeadingWithUnderline from "./heading-with-underline";
import TestimonialsStackedCarousel from "./testimonials-stacked-carousel";
import TestimonialsStackedAnimation from "./testimonials-stacked-animation";
import { Button } from "@/components/ui/button";
import { PrismicNextLink } from "@prismicio/next";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";

/**
 * Props for `Testimonials`.
 */
export type TestimonialsProps = SliceComponentProps<Content.TestimonialsSlice>;

/**
 * Component for "Testimonials" Slices.
 */
const Testimonials = ({ slice }: TestimonialsProps): React.ReactElement => {
  const marginTop = getMarginTopClass((slice.primary.margin_top as MarginTopSize) || "large");
  const paddingTop = getPaddingTopClass((slice.primary.padding_top as PaddingSize) || "large");
  const paddingBottom = getPaddingBottomClass((slice.primary.padding_bottom as PaddingSize) || "large");
  
  // Background color with white default
  const backgroundColor = slice.primary.background_color || "#ffffff";
  
  // Normalize color for comparison (remove #, spaces, convert to lowercase)
  const normalizedColor = backgroundColor.replace(/#/g, "").replace(/\s/g, "").toLowerCase();
  
  // Check if background is dark-blue (#141433) or similar dark color
  const isDarkBlue = normalizedColor === "141433" ||
                     normalizedColor === "#141433" ||
                     normalizedColor === "rgb(20,20,51)" ||
                     normalizedColor === "rgba(20,20,51,1)" ||
                     backgroundColor.toLowerCase().includes("dark-blue") ||
                     backgroundColor.toLowerCase() === "#0f172a" ||
                     normalizedColor === "0f172a";
  
  // Text colors based on background
  const textColors = isDarkBlue ? {
    subheading: "text-blue-300",
    heading: "text-neutral-100",
    description: "text-neutral-200",
    lineColor: "dark" as const,
  } : {
    subheading: "text-neutral-800",
    heading: "text-neutral-800",
    description: "text-neutral-600",
    lineColor: "light" as const,
  };

  // Check if this is the stacked cards variant
  const isStackedCards = slice.variation === "stackedCards";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full ${marginTop} ${paddingTop} ${paddingBottom}`}
      style={{ backgroundColor }}
    >
      {isStackedCards ? (
        // Stacked Cards Variant - Vertical layout with wider cards
        <TestimonialsStackedAnimation>
          <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
            <div className="flex flex-col gap-4 lg:gap-0">
              {/* Header Content */}
              <div className="w-full flex flex-col items-center text-center">
                {(slice.primary.subheading || slice.primary.heading || slice.primary.description) && (
                  <div className="max-w-3xl mx-auto flex flex-col gap-6 lg:gap-8" data-animate="header">
                    {slice.primary.subheading && (
                      <SliceHeader 
                        subheading={slice.primary.subheading} 
                        textColor={textColors.subheading}
                        lineColor={textColors.lineColor}
                        textAlign="center"
                        variant="badge"
                        badgeVariant="green"
                      />
                    )}
                    {slice.primary.heading && (
                      <h2 className={`text-2xl lg:text-4xl xl:text-5xl font-bold leading-tight ${textColors.heading}`}>
                        {slice.primary.heading}
                      </h2>
                    )}
                    {slice.primary.description && (
                      <p className={`${textColors.description} text-base lg:text-lg leading-relaxed`}>
                        {slice.primary.description}
                      </p>
                    )}
                    
                    {/* Button */}
                    {slice.primary.button_text && slice.primary.button_link && (
                      <div className="flex justify-center pt-4">
                        <Button asChild variant="subtle" size="lg" className="!px-0">
                          <PrismicNextLink 
                            field={slice.primary.button_link}
                            className={`inline-flex items-center gap-1.5 ${textColors.heading}`}
                          >
                            <span>{slice.primary.button_text}</span>
                            <ExternalLinkIcon className="w-2.5 h-2.5" color="currentColor" />
                          </PrismicNextLink>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stacked Carousel - Wider with more overlap */}
              <div className="w-full -mx-4 lg:-mx-8" data-animate="carousel">
                {slice.items && slice.items.length > 0 && (
                  <TestimonialsStackedCarousel
                    testimonials={slice.items}
                    isDarkBackground={isDarkBlue}
                  />
                )}
              </div>
            </div>
          </div>
        </TestimonialsStackedAnimation>
      ) : (
        // Default Variant - Original layout
        <>
          <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
            {/* Header Section - Centered */}
            {(slice.primary.subheading || slice.primary.heading || slice.primary.description) && (
              <div className="mb-16 lg:mb-24 max-w-3xl mx-auto text-center">
                {slice.primary.subheading && (
                  <SliceHeader 
                    subheading={slice.primary.subheading} 
                    textColor={textColors.subheading}
                    lineColor={textColors.lineColor}
                    textAlign="center"
                    variant="badge"
                    badgeVariant="green"
                  />
                )}
                {slice.primary.heading && (
                  <HeadingWithUnderline 
                    heading={slice.primary.heading}
                    textColor={textColors.heading}
                  />
                )}
                {slice.primary.description && (
                  <p className={`${textColors.description} text-base text-neutral-600 leading-relaxed max-w-sm mx-auto`}>
                    {slice.primary.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Testimonials Content */}
          {slice.items && slice.items.length > 0 && (
            <div className="w-full -mx-4 lg:-mx-8">
              <TestimonialsAnimation
                testimonials={slice.primary.number_of_rows ? slice.items : slice.items}
                numberOfRows={slice.primary.number_of_rows || 2}
                scrollSpeed={slice.primary.scroll_speed || 1}
                gap={slice.primary.gap || 32}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Testimonials;

