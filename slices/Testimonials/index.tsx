import React from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass } from "@/lib/spacing";
import TestimonialsAnimation from "./testimonials-animation";

/**
 * Props for `Testimonials`.
 */
export type TestimonialsProps = SliceComponentProps<Content.TestimonialsSlice>;

/**
 * Component for "Testimonials" Slices.
 */
const Testimonials = ({ slice }: TestimonialsProps): React.ReactElement => {
  const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
  const paddingTop = getPaddingTopClass(slice.primary.padding_top || "large");
  const paddingBottom = getPaddingBottomClass(slice.primary.padding_bottom || "large");

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full bg-white mx-auto ${marginTop} ${paddingTop} ${paddingBottom}`}
    >
      {/* Header Section */}
      {(slice.primary.subheading || slice.primary.heading || slice.primary.description) && (
        <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8 mb-16">
          <div className="max-w-3xl">
            {slice.primary.subheading && (
              <h5 className="text-neutral-800 text-sm mb-4">
                {slice.primary.subheading}
              </h5>
            )}
            {slice.primary.heading && (
              <h2 className="text-neutral-800 text-4xl lg:text-6xl mb-6">
                {slice.primary.heading}
              </h2>
            )}
            {slice.primary.description && (
              <p className="text-neutral-600 text-lg">
                {slice.primary.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Testimonials Carousel */}
      {slice.items && slice.items.length > 0 && (
        <TestimonialsAnimation
          testimonials={slice.items}
          numberOfRows={slice.primary.number_of_rows || 2}
          scrollSpeed={slice.primary.scroll_speed || 1}
          gap={slice.primary.gap || 32}
        />
      )}
    </section>
  );
};

export default Testimonials;

