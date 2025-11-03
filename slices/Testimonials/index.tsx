import React from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, type MarginTopSize, type PaddingSize } from "@/lib/spacing";
import { SliceHeader } from "@/components/slice-header";
import TestimonialsAnimation from "./testimonials-animation";
import HeadingWithUnderline from "./heading-with-underline";

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

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full ${marginTop} ${paddingTop} ${paddingBottom}`}
      style={{ backgroundColor }}
    >
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

      {/* Testimonials Carousel - Edge to edge */}
      {slice.items && slice.items.length > 0 && (
        <div className="w-full -mx-4 lg:-mx-8">
          <TestimonialsAnimation
            testimonials={slice.items}
            numberOfRows={slice.primary.number_of_rows || 2}
            scrollSpeed={slice.primary.scroll_speed || 1}
            gap={slice.primary.gap || 32}
          />
        </div>
      )}
    </section>
  );
};

export default Testimonials;

