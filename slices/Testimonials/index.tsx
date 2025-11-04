import React from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, type MarginTopSize, type PaddingSize } from "@/lib/spacing";
import { SliceHeader } from "@/components/slice-header";
import TestimonialsAnimation from "./testimonials-animation";
import HeadingWithUnderline from "./heading-with-underline";
import TestimonialsStackedCarousel from "./testimonials-stacked-carousel";
import TestimonialsStackedAnimation from "./testimonials-stacked-animation";
import { HeroButton } from "@/components/ui/hero-button";
import { PrismicNextLink } from "@prismicio/next";

/**
 * Props for `Testimonials`.
 */
export type TestimonialsProps = SliceComponentProps<Content.TestimonialsSlice>;

/**
 * Component for "Testimonials" Slices.
 */
const Testimonials = ({ slice }: TestimonialsProps): React.ReactElement => {
  const marginTop = getMarginTopClass(((slice.primary.margin_top as any) as MarginTopSize) || "large");
  const paddingTop = getPaddingTopClass(((slice.primary.padding_top as any) as PaddingSize) || "large");
  const paddingBottom = getPaddingBottomClass(((slice.primary.padding_bottom as any) as PaddingSize) || "large");
  
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
        // Stacked Cards Variant - Side by side layout (mobile optimized)
        <TestimonialsStackedAnimation>
          <div className="w-full max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-center">
              {/* Left Side - Header Content */}
              <div className="w-full lg:w-2/5 flex-shrink-0 text-center lg:text-left">
                {(slice.primary.subheading || slice.primary.heading || slice.primary.description) && (
                  <div className="max-w-lg mx-auto lg:mx-0" data-animate="header">
                    {slice.primary.subheading && (
                      <SliceHeader 
                        subheading={slice.primary.subheading} 
                        textColor={textColors.subheading}
                        lineColor={textColors.lineColor}
                        textAlign="left"
                        className="lg:text-left"
                      />
                    )}
                    {slice.primary.heading && (
                      <h2 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 ${textColors.heading}`}>
                        {slice.primary.heading}
                      </h2>
                    )}
                    {slice.primary.description && (
                      <p className={`${textColors.description} text-sm sm:text-base lg:text-lg leading-relaxed mb-6 lg:mb-8`}>
                        {slice.primary.description}
                      </p>
                    )}
                    
                    {/* Button */}
                    {slice.primary.button_text && slice.primary.button_link && (
                      <div className="flex justify-center lg:justify-start">
                        <HeroButton asChild>
                          <PrismicNextLink field={slice.primary.button_link}>
                            {slice.primary.button_text}
                          </PrismicNextLink>
                        </HeroButton>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side - Stacked Carousel */}
              <div className="w-full lg:flex-1" data-animate="carousel">
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

