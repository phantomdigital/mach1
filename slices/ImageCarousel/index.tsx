import { Content } from "@prismicio/client";
import React from "react";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { CarouselAnimation } from "./carousel-animation";
import { 
  getContainerClass, 
  getMarginTopClass, 
  getPaddingTopClass,
  getPaddingBottomClass,
  type MarginTopSize,
  type PaddingSize 
} from "@/lib/spacing";

/**
 * Props for `ImageCarousel`.
 */
export type ImageCarouselProps = SliceComponentProps<Content.ImageCarouselSlice>;

/**
 * Component for "ImageCarousel" Slices.
 */
const ImageCarousel = ({ slice }: ImageCarouselProps): React.ReactElement => {
  const imageWidth = slice.primary.image_width || 400;
  const gap = slice.primary.gap || 32;
  const scrollSpeed = slice.primary.scroll_speed || 1;
  const primary = slice.primary as any;
  const marginTop = (primary.margin_top as MarginTopSize) || "large";
  const paddingTop = (primary.padding_top as PaddingSize) || "large";
  const paddingBottom = (primary.padding_bottom as PaddingSize) || "large";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full bg-white ${getMarginTopClass(marginTop)} ${getPaddingTopClass(paddingTop)} ${getPaddingBottomClass(paddingBottom)}`}
    >
      {/* Header */}
      {(slice.primary.heading || slice.primary.description) && (
        <div className={getContainerClass()}>
          <div className="max-w-3xl mb-16">
            {slice.primary.heading && (
              <h2 className="text-neutral-800 mb-4">
                {slice.primary.heading}
              </h2>
            )}
            {slice.primary.description && (
              <div className="prose max-w-none">
                <PrismicRichText field={slice.primary.description} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full-width carousel - breaks out of container */}
      <div className="w-full">
        <CarouselAnimation
          items={slice.items}
          imageWidth={imageWidth}
          gap={gap}
          scrollSpeed={scrollSpeed}
        />
      </div>
    </section>
  );
};

export default ImageCarousel;

