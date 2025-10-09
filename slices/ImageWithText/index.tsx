import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { TeamClippedShape } from "../OurTeam/team-clipped-shape";
import { HeaderSeparator } from "@/components/ui/header-separator";

/**
 * Props for `ImageWithText`.
 */
export type ImageWithTextProps = SliceComponentProps<Content.ImageWithTextSlice>;

/**
 * Component for "ImageWithText" Slices.
 */
const ImageWithText = ({ slice }: ImageWithTextProps): JSX.Element => {
  // Get flex direction based on selection
  const getFlexDirection = () => {
    return slice.primary.layout_direction === 'text-left' 
      ? 'lg:flex-row-reverse' 
      : 'lg:flex-row';
  };

  // Get margin top class based on selection
  const getMarginTopClass = () => {
    switch (slice.primary.margin_top) {
      case 'none':
        return 'mt-0';
      case 'small':
        return 'mt-12';
      case 'medium':
        return 'mt-24';
      case 'large':
        return 'mt-48';
      case 'extra-large':
        return 'mt-64';
      default:
        return 'mt-48'; // Default to large (mt-48)
    }
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-white">
      <div className={`w-full ${getMarginTopClass()} mx-auto px-4 lg:px-20`}>
        {/* Content Layout */}
        <div className={`flex flex-col ${getFlexDirection()} gap-12 lg:gap-16 items-center`}>
          
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            {slice.primary.image && slice.primary.image.url ? (
              <TeamClippedShape className="aspect-square bg-neutral-100">
                <PrismicNextImage
                  field={slice.primary.image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </TeamClippedShape>
            ) : (
              // Placeholder when no image is provided
              <TeamClippedShape className="aspect-square bg-neutral-200">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    <svg 
                      className="w-8 h-8 text-neutral-400" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                </div>
              </TeamClippedShape>
            )}
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            {slice.primary.subheading && (
              <div 
                className="text-neutral-800 text-sm font-medium mb-4"
                style={{ fontFamily: '"space-mono", monospace', fontWeight: 400, fontStyle: 'normal' }}
              >
                {slice.primary.subheading}
              </div>
            )}
            
            {slice.primary.heading && (
              <h2 className="text-neutral-800 text-4xl lg:text-5xl font-bold leading-tight mb-6" style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 700' }}>
                {slice.primary.heading}
              </h2>
            )}
            
            {slice.primary.description && (
              <div className="text-neutral-600 text-base font-normal leading-relaxed space-y-4" style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}>
                {slice.primary.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Separator */}
        {slice.primary.show_bottom_separator && (
          <div className="mt-16">
            <HeaderSeparator />
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageWithText;
