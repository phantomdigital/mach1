import React, { Suspense, useMemo } from "react";
import type { TestimonialsSlice } from "@/types.generated";
import { SliceComponentProps } from "@prismicio/react";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, type MarginTopSize, type PaddingSize } from "@/lib/spacing";
import { SliceHeader } from "@/components/slice-header";
import HeadingWithUnderline from "./heading-with-underline";
import { Button } from "@/components/ui/button";
import { PrismicNextLink } from "@prismicio/next";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";

// Lazy load animation components to improve initial page load
const TestimonialsAnimation = React.lazy(() => import("./testimonials-animation"));
const TestimonialsStackedCarousel = React.lazy(() => import("./testimonials-stacked-carousel"));
const TestimonialsStackedAnimation = React.lazy(() => import("./testimonials-stacked-animation"));

/**
 * Props for `Testimonials`.
 */
export type TestimonialsProps = SliceComponentProps<TestimonialsSlice>;

// Loading fallback components
function TestimonialsLoading({ isStackedCards }: { isStackedCards: boolean }) {
  if (isStackedCards) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24">
        <div className="relative h-[380px] sm:h-[420px] lg:h-[520px] flex items-center justify-center">
          <div className="w-full max-w-2xl sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl animate-pulse">
            <div className="aspect-video bg-neutral-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full -mx-4 lg:-mx-8">
      <div className="space-y-8">
        {[1, 2].map((row) => (
          <div key={row} className="flex gap-8 animate-pulse">
            {[1, 2, 3].map((card) => (
              <div key={card} className="w-[400px] h-[280px] bg-neutral-200 rounded-lg flex-shrink-0"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Component for "Testimonials" Slices.
 */
const Testimonials = ({ slice }: TestimonialsProps): React.ReactElement => {
  // Memoize spacing calculations
  const spacingClasses = useMemo(() => {
    const marginTop = getMarginTopClass((slice.primary.margin_top as MarginTopSize) || "large");
    const paddingTop = getPaddingTopClass((slice.primary.padding_top as PaddingSize) || "large");
    const paddingBottom = getPaddingBottomClass((slice.primary.padding_bottom as PaddingSize) || "large");
    return { marginTop, paddingTop, paddingBottom };
  }, [slice.primary.margin_top, slice.primary.padding_top, slice.primary.padding_bottom]);
  
  // Memoize background color and theming
  const theme = useMemo(() => {
    const backgroundColor = slice.primary.background_color || "#ffffff";
    const normalizedColor = backgroundColor.replace(/#/g, "").replace(/\s/g, "").toLowerCase();
    
    const isDarkBlue = normalizedColor === "141433" ||
                       normalizedColor === "#141433" ||
                       normalizedColor === "rgb(20,20,51)" ||
                       normalizedColor === "rgba(20,20,51,1)" ||
                       backgroundColor.toLowerCase().includes("dark-blue") ||
                       backgroundColor.toLowerCase() === "#0f172a" ||
                       normalizedColor === "0f172a";
    
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

    return { backgroundColor, isDarkBlue, textColors };
  }, [slice.primary.background_color]);

  // Check if this is the stacked cards variant
  const isStackedCards = slice.variation === "stackedCards";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full ${spacingClasses.marginTop} ${spacingClasses.paddingTop} ${spacingClasses.paddingBottom}`}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {isStackedCards ? (
        // Stacked Cards Variant - With Suspense for progressive loading
        <Suspense fallback={<TestimonialsLoading isStackedCards={true} />}>
          <TestimonialsStackedAnimation>
            <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
              <div className="flex flex-col gap-4 lg:gap-0">
                {/* Header Content - Loads immediately */}
                <div className="w-full flex flex-col items-center text-center">
                  {(slice.primary.subheading || slice.primary.heading || slice.primary.description) && (
                    <div className="max-w-3xl mx-auto flex flex-col gap-6 lg:gap-8" data-animate="header">
                      {slice.primary.subheading && (
                        <SliceHeader 
                          subheading={slice.primary.subheading} 
                          textColor={theme.textColors.subheading}
                          lineColor={theme.textColors.lineColor}
                          textAlign="center"
                          variant="badge"
                          badgeVariant="green"
                        />
                      )}
                      {slice.primary.heading && (
                        <h2 className={`text-2xl lg:text-4xl xl:text-5xl font-bold leading-tight ${theme.textColors.heading}`}>
                          {slice.primary.heading}
                        </h2>
                      )}
                      {slice.primary.description && (
                        <p className={`${theme.textColors.description} text-base lg:text-lg leading-relaxed`}>
                          {slice.primary.description}
                        </p>
                      )}
                      
                      {/* Button */}
                      {slice.primary.button_text && slice.primary.button_link && (
                        <div className="flex justify-center pt-4">
                          <Button asChild variant="subtle" size="lg" className="!px-0">
                            <PrismicNextLink 
                              field={slice.primary.button_link}
                              className={`inline-flex items-center gap-1.5 ${theme.textColors.heading}`}
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

                {/* Stacked Carousel - Lazy loaded */}
                <div className="w-full -mx-4 lg:-mx-8" data-animate="carousel">
                  {slice.items && slice.items.length > 0 && (
                    <Suspense fallback={<TestimonialsLoading isStackedCards={true} />}>
                      <TestimonialsStackedCarousel
                        testimonials={slice.items}
                        isDarkBackground={theme.isDarkBlue}
                      />
                    </Suspense>
                  )}
                </div>
              </div>
            </div>
          </TestimonialsStackedAnimation>
        </Suspense>
      ) : (
        // Default Variant - With progressive loading
        <>
          {/* Header loads immediately */}
          <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
            {(slice.primary.subheading || slice.primary.heading || slice.primary.description) && (
              <div className="mb-16 lg:mb-24 max-w-3xl mx-auto text-center">
                {slice.primary.subheading && (
                  <SliceHeader 
                    subheading={slice.primary.subheading} 
                    textColor={theme.textColors.subheading}
                    lineColor={theme.textColors.lineColor}
                    textAlign="center"
                    variant="badge"
                    badgeVariant="green"
                  />
                )}
                {slice.primary.heading && (
                  <HeadingWithUnderline 
                    heading={slice.primary.heading}
                    textColor={theme.textColors.heading}
                  />
                )}
                {slice.primary.description && (
                  <p className={`${theme.textColors.description} text-base text-neutral-600 leading-relaxed max-w-sm mx-auto`}>
                    {slice.primary.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Testimonials Animation - Lazy loaded */}
          {slice.items && slice.items.length > 0 && (
            <div className="w-full -mx-4 lg:-mx-8">
              <Suspense fallback={<TestimonialsLoading isStackedCards={false} />}>
                <TestimonialsAnimation
                  testimonials={slice.items}
                  numberOfRows={slice.primary.number_of_rows || 2}
                  scrollSpeed={slice.primary.scroll_speed || 1}
                  gap={slice.primary.gap || 32}
                />
              </Suspense>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Testimonials;

