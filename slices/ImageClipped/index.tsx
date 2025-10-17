import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

/**
 * Props for `ImageClipped`.
 */
export type ImageClippedProps = SliceComponentProps<Content.ImageClippedSlice> & {
  maxWidth?: string; // Tailwind max-width class (e.g., "max-w-6xl", "max-w-full")
};

/**
 * Component for "ImageClipped" Slices.
 */
const ImageClipped = ({ slice, maxWidth = "max-w-[110rem]" }: ImageClippedProps): React.ReactElement => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full pt-8 lg:pt-12 pb-0 bg-slate-50"
    >
      {/* Optional heading above the image */}
      {slice.primary.heading && (
        <div className="w-full max-w-[90rem] mx-auto px-4 lg:px-8 mb-12 ">
          <div className="text-center">
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900"
              style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 700' }}
            >
              {slice.primary.heading}
            </h2>
          </div>
        </div>
      )}

      {/* Clipped Image Container with Adjustable Width */}
      {slice.primary.image && (
        <div className={`relative w-full ${maxWidth} mx-auto`}>
          {/* SVG with clipPath definition */}
          <svg 
            width="0" 
            height="0" 
            className="absolute"
            style={{ position: 'absolute', width: 0, height: 0 }}
          >
            <defs>
              <clipPath id="geometric-clip" clipPathUnits="objectBoundingBox">
                <path d="M1 0.269L0.84 0.0126C0.835 0.00525 0.829 0 0.823 0H0.496V0.0000607L0 0V0.731L0.16 0.987C0.165 0.995 0.171 1 0.177 1H0.504V0.9999L1 1V0.269Z"/>
              </clipPath>
            </defs>
          </svg>

          {/* Image with clipping applied */}
          <div 
            className="relative w-full aspect-[1279/579] overflow-hidden"
            style={{ 
              clipPath: 'url(#geometric-clip)',
              WebkitClipPath: 'url(#geometric-clip)'
            }}
          >
            <PrismicNextImage
              field={slice.primary.image}
              className="w-full h-full object-cover"
              alt=""
              priority={slice.primary.priority_loading}
            />
            
            {/* Scanlines Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-100"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0, 0, 0, 0.1) 2px,
                  rgba(0, 0, 0, 0.1) 4px
                )`,
                mixBlendMode: 'overlay'
              }}
            />
          </div>
        </div>
      )}

      {/* Optional caption below the image */}
      {slice.primary.caption && (
        <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8 mt-8">
          <div className="text-center">
            <p 
              className="text-lg text-gray-600 max-w-3xl mx-auto"
              style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}
            >
              {slice.primary.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageClipped;
