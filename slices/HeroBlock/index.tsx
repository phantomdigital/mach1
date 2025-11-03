import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, type MarginTopSize, type PaddingSize } from "@/lib/spacing";
import { SliceHeader } from "@/components/slice-header";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";
import HeroBlockAnimation from "./hero-block-animation";
import { ImageOff } from "lucide-react";

/**
 * Props for `HeroBlock`.
 */
export type HeroBlockProps = SliceComponentProps<Content.HeroBlockSlice>;

/**
 * Component for "HeroBlock" Slices.
 */
const HeroBlock = ({ slice }: HeroBlockProps): React.ReactElement => {
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
    lineColor: "dark" as const,
  } : {
    subheading: "text-neutral-800",
    heading: "text-neutral-800",
    lineColor: "light" as const,
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full ${marginTop} ${paddingTop} ${paddingBottom} overflow-hidden`}
      style={{ backgroundColor }}
    >
      <HeroBlockAnimation>
        <div className="relative w-full min-h-[400px] lg:min-h-[600px]">
          {/* Left Image - Edge to edge, positioned absolutely from left viewport edge */}
          <div className="relative w-full lg:absolute lg:left-0 lg:top-0 lg:w-[40%] h-[400px] lg:h-[600px] order-1 lg:order-1" data-animate="image">
            {slice.primary.image?.url ? (
              <PrismicNextImage
                field={slice.primary.image}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
                priority
              />
            ) : (
              <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                <ImageOff className="w-16 h-16 text-neutral-400" />
              </div>
            )}
          </div>

          {/* Container with max-width for right content alignment */}
          <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8 relative">
            {/* Right Content - Aligned to right edge of max-w container */}
            <div className="relative w-full lg:ml-auto lg:w-[60%] lg:pl-12 lg:pr-0 flex flex-col justify-center py-12 lg:py-16 order-2 lg:order-2 min-h-[400px] lg:min-h-[600px]" style={{ backgroundColor }}>
              {/* Header */}
              {slice.primary.subheading && (
                <div className="mb-6" data-animate="header">
                  <SliceHeader 
                    subheading={slice.primary.subheading} 
                    textColor={textColors.subheading}
                    lineColor={textColors.lineColor}
                  />
                </div>
              )}

              {/* Main Heading */}
              {slice.primary.heading && (
                <h2 className={`${textColors.heading} text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-8 lg:mb-12`} data-animate="heading">
                  {slice.primary.heading}
                </h2>
              )}

              {/* Statistics Grid - 2 rows x 3 columns */}
              {slice.items && slice.items.length > 0 && (
                <div className="grid grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
                  {slice.items.map((item, index) => (
                    <div 
                      key={index}
                      data-animate="stat-card"
                      className="flex flex-col"
                    >
                      {/* Stat Number */}
                      {item.stat_number && (
                        <div className={`${textColors.heading} text-2xl lg:text-3xl xl:text-4xl font-bold mb-1`}>
                          {item.stat_number}
                          {item.stat_suffix && (
                            <span className="text-mach1-green">{item.stat_suffix}</span>
                          )}
                        </div>
                      )}
                      
                      {/* Stat Label */}
                      {item.stat_label && (
                        <p className={`${isDarkBlue ? 'text-neutral-300' : 'text-neutral-600'} text-xs lg:text-sm leading-tight`}>
                          {item.stat_label}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              {slice.primary.button_text && slice.primary.button_link && (
                <div className="inline-flex" data-animate="button">
                  <Button asChild variant="subtle" size="lg">
                    <PrismicNextLink 
                      field={slice.primary.button_link}
                      className={`inline-flex items-center gap-1.5 ${isDarkBlue ? 'text-neutral-100' : 'text-neutral-800'}`}
                    >
                      <span>{slice.primary.button_text}</span>
                      <ExternalLinkIcon className="w-2.5 h-2.5" color="currentColor" />
                    </PrismicNextLink>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </HeroBlockAnimation>
    </section>
  );
};

export default HeroBlock;

