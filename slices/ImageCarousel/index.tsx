import { Content } from "@prismicio/client";
import React from "react";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { CarouselAnimation } from "./carousel-animation";
import { 
  getMarginTopClass, 
  getPaddingYClass,
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
  const primary = slice.primary as any;
  const imageWidth = slice.primary.image_width || 400;
  const imageHeight = primary.image_height ?? undefined;
  const gap = slice.primary.gap || 32;
  const scrollSpeed = slice.primary.scroll_speed || 1;
  const marginTop = (primary.margin_top as MarginTopSize) || "large";
  const padding = (primary.padding as PaddingSize) || "large";
  const backgroundColor = slice.primary.background_color || "#ffffff";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full flex flex-col items-start ${getMarginTopClass(marginTop)} ${getPaddingYClass(padding)}`}
      style={{ backgroundColor }}
    >
      {/* Header */}
      {(slice.primary.heading || slice.primary.description) && (
        <div className="w-full p-0 m-0 h-0">
          <div className="max-w-3xl mx-auto mb-16">
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
          imageHeight={imageHeight}
          gap={gap}
          scrollSpeed={scrollSpeed}
        />
      </div>
    </section>
  );
};

export default ImageCarousel;

