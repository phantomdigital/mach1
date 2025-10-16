import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { HeaderSeparator } from "@/components/ui/header-separator";

/**
 * Props for `ImageWithText`.
 */
export type ImageWithTextProps = SliceComponentProps<Content.ImageWithTextSlice>;

/**
 * Component for "ImageWithText" Slices.
 */
const ImageWithText = ({ slice }: ImageWithTextProps): React.ReactElement => {
  // Get flex direction based on selection
  const getFlexDirection = () => {
    return slice.primary.layout_direction === 'text-left' 
      ? 'lg:flex-row-reverse' 
      : 'lg:flex-row';
  };

  // Get margin top class based on selection (responsive: smaller on mobile)
  const getMarginTopClass = () => {
    switch (slice.primary.margin_top) {
      case 'none':
        return 'mt-0';
      case 'small':
        return 'mt-6 lg:mt-12';
      case 'medium':
        return 'mt-12 lg:mt-24';
      case 'large':
        return 'mt-30 lg:mt-48';
      case 'extra-large':
        return 'mt-40 lg:mt-64';
      default:
        return 'mt-30 lg:mt-48';
    }
  };

  // Get padding top class based on selection (responsive: smaller on mobile)
  const getPaddingTopClass = () => {
    switch (slice.primary.padding_top) {
      case 'none':
        return 'pt-0';
      case 'small':
        return 'pt-6 lg:pt-12';
      case 'medium':
        return 'pt-12 lg:pt-24';
      case 'large':
        return 'pt-16 lg:pt-32';
      case 'extra-large':
        return 'pt-24 lg:pt-48';
      default:
        return 'pt-12 lg:pt-24';
    }
  };

  // Get padding bottom class based on selection (responsive: smaller on mobile)
  const getPaddingBottomClass = () => {
    switch (slice.primary.padding_bottom) {
      case 'none':
        return 'pb-0';
      case 'small':
        return 'pb-6 lg:pb-12';
      case 'medium':
        return 'pb-12 lg:pb-24';
      case 'large':
        return 'pb-16 lg:pb-32';
      case 'extra-large':
        return 'pb-24 lg:pb-48';
      default:
        return 'pb-12 lg:pb-24';
    }
  };

  return (
    <section className={`w-full bg-white ${getPaddingTopClass()} ${getPaddingBottomClass()}`}>
      <div className={`w-full max-w-[110rem] mx-auto px-4 lg:px-8 ${getMarginTopClass()}`}>
        {/* Content Layout */}
        <div className={`flex flex-col ${getFlexDirection()} gap-12 lg:gap-16 items-center`}>
          
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            {slice.primary.image && slice.primary.image.url ? (
              <div 
                className="w-full aspect-video bg-neutral-100 overflow-hidden"
                style={{
                  clipPath: 'polygon(0% 0%, 98% 0%, 100% 4%, 100% 100%, 2% 100%, 0% 98%)'
                }}
              >
                <PrismicNextImage
                  field={slice.primary.image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            ) : (
              // Placeholder when no image is provided
              <div 
                className="w-full aspect-video bg-neutral-200 overflow-hidden"
                style={{
                  clipPath: 'polygon(0% 0%, 98% 0%, 100% 4%, 100% 100%, 2% 100%, 0% 98%)'
                }}
              >
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
              </div>
            )}
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            {slice.primary.subheading && (
              <h5 className="text-black text-sm mb-4">
                {slice.primary.subheading}
              </h5>
            )}
            
            {slice.primary.heading && (
              <h2 className="text-black leading-tight mb-6">
                {slice.primary.heading}
              </h2>
            )}
            
            {slice.primary.description && (
              <div className="text-black leading-relaxed space-y-4">
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
