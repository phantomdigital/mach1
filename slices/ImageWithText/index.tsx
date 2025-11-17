import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { HeaderSeparator } from "@/components/ui/header-separator";
import { SliceHeader } from "@/components/slice-header";
import { ImageAnimation, TextAnimation } from "./image-with-text-animation";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, type MarginTopSize, type PaddingSize } from "@/lib/spacing";

type SubheadingStyle = "badge" | "underline" | "pill" | "accent-bar" | "minimal" | "default";

/**
 * Props for `ImageWithText`.
 */
export type ImageWithTextProps = SliceComponentProps<Content.ImageWithTextSlice>;

/**
 * Component for "ImageWithText" Slices.
 */
const ImageWithText = ({ slice }: ImageWithTextProps): React.ReactElement => {
  // Check if centered variant
  const isCentered = slice.variation === 'centered';

  // Get flex direction based on selection
  const getFlexDirection = () => {
    if (isCentered) return 'flex-col';
    return slice.primary.layout_direction === 'text-left' 
      ? 'lg:flex-row-reverse' 
      : 'lg:flex-row';
  };

  // Get gap spacing for flex row layout (modern approach using gap utility)
  const getFlexGap = () => {
    if (isCentered) return 'gap-0';
    // Standard spacing scale: smaller on mobile, consistent on desktop
    return 'gap-8 lg:gap-12 xl:gap-16';
  };

  // Get image width class for centered variant
  const getImageWidthClass = () => {
    if (!isCentered) return 'w-full lg:w-1/2';
    
    const imageWidth = (slice.primary as any).image_width;
    switch (imageWidth) {
      case 'full':
        return 'w-full';
      case 'three-quarters':
        return 'w-full lg:w-3/4';
      case 'two-thirds':
        return 'w-full lg:w-2/3';
      case 'half':
        return 'w-full lg:w-1/2';
      default:
        return 'w-full lg:w-2/3';
    }
  };

  // Use spacing utilities from @/lib/spacing.ts following rules.yaml
  const marginTopClass = getMarginTopClass(((slice.primary.margin_top as any) as MarginTopSize) || "large");
  const paddingTopClass = getPaddingTopClass(((slice.primary.padding_top as any) as PaddingSize) || "medium");
  const paddingBottomClass = getPaddingBottomClass(((slice.primary.padding_bottom as any) as PaddingSize) || "medium");

  // Background color with white default
  const backgroundColor = (slice.primary as any).background_color || "#ffffff";

  return (
    <section 
      className={`w-full ${paddingTopClass} ${paddingBottomClass}`}
      style={{ backgroundColor }}
    >
      <div className={`w-full max-w-[88rem] mx-auto px-4 lg:px-8 ${marginTopClass}`}>
        {/* Content Layout */}
        <div className={`flex ${getFlexDirection()} ${getFlexGap()} ${isCentered ? 'items-center' : 'items-center lg:items-stretch'}`}>
          
          {/* Text Section - Rendered first for centered variant */}
          {isCentered && (
            <div className="w-full mb-12 lg:mb-16 flex flex-col items-center gap-6">
              {slice.primary.subheading && (
                <TextAnimation delay={0}>
                  <SliceHeader 
                    subheading={slice.primary.subheading} 
                    textColor="text-neutral-800"
                    textAlign="center"
                    variant={(slice.primary.subheading_style as SubheadingStyle) || "badge"}
                    badgeVariant="green"
                  />
                </TextAnimation>
              )}
              
              {slice.primary.heading && (
                <TextAnimation delay={0.1}>
                  <h2 className="text-black text-center">
                    {slice.primary.heading}
                  </h2>
                </TextAnimation>
              )}
              
              {slice.primary.description && (
                <TextAnimation delay={0.2}>
                  <div className="text-neutral-700 space-y-4 mx-auto lg:max-w-3xl text-center">
                    {slice.primary.description.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </TextAnimation>
              )}
            </div>
          )}

          {/* Image Section */}
          <div className={`${getImageWidthClass()} ${isCentered ? 'mx-auto' : 'flex-shrink-0'}`}>
            {slice.primary.image && slice.primary.image.url ? (
                <ImageAnimation>
                  <div 
                    className={`w-full ${isCentered ? 'aspect-[16/9]' : 'aspect-video lg:aspect-[100/115] xl:aspect-[4/3] 2xl:aspect-video'} bg-neutral-100 overflow-hidden`}
                    style={{
                      clipPath: 'polygon(0% 0%, 98% 0%, 100% 4%, 100% 100%, 2% 100%, 0% 98%)'
                    }}
                  >
                    <div data-image-scale className="w-full h-full transform-gpu">
                      <PrismicNextImage
                        field={slice.primary.image}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                  </div>
                </ImageAnimation>
              ) : (
                // Placeholder when no image is provided
                <div 
                  className={`w-full ${isCentered ? 'aspect-[16/9]' : 'aspect-video lg:aspect-[5/4] xl:aspect-[4/3] 2xl:aspect-video'} bg-neutral-200 overflow-hidden`}
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

          {/* Text Section - Default variant only */}
          {!isCentered && (
            <div className="w-full lg:w-1/2 flex flex-col justify-center lg:min-w-0 gap-6">
              {/* Accent Image at Top */}
              {slice.primary.background_accent_image?.url && (
                <div className="w-full max-w-[100px]">
                  <PrismicNextImage
                    field={slice.primary.background_accent_image}
                    className="w-full h-auto"
                    alt=""
                  />
                </div>
              )}
              
              {slice.primary.subheading && (
                <TextAnimation delay={0}>
                  <SliceHeader 
                    subheading={slice.primary.subheading} 
                    textColor="text-neutral-800"
                    variant={(slice.primary.subheading_style as SubheadingStyle) || "badge"}
                    badgeVariant="green"
                  />
                </TextAnimation>
              )}
              
              {slice.primary.heading && (
                <TextAnimation delay={0.1}>
                  <h2 className="text-black">
                    {slice.primary.heading}
                  </h2>
                </TextAnimation>
              )}
              
              {slice.primary.description && (
                <TextAnimation delay={0.2}>
                  <div className="text-neutral-700 space-y-4 lg:max-w-prose">
                    {slice.primary.description.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </TextAnimation>
              )}
            </div>
          )}
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
