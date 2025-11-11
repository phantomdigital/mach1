import React from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { HeaderSeparator } from "@/components/ui/header-separator";
import { SliceHeader } from "@/components/slice-header";
import { ContentBlockButton } from "./content-block-button";

/**
 * Props for `ContentBlock`.
 */
export type ContentBlockProps = SliceComponentProps<Content.ContentBlockSlice>;

/**
 * Component for "ContentBlock" Slices.
 */
const ContentBlock = ({ slice }: ContentBlockProps): React.ReactElement => {
  // Check if benefits variant
  const isBenefits = slice.variation === 'benefits';
  
  // Get alignment class based on selection
  const getAlignmentClass = () => {
    switch (slice.primary.text_alignment) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  // Get content alignment for flex positioning
  const getContentAlignment = () => {
    switch (slice.primary.text_alignment) {
      case 'center':
        return 'items-center';
      case 'right':
        return 'items-end';
      default:
        return 'items-start';
    }
  };

  // Get width class based on selection (full width on mobile, constrained on desktop)
  const getWidthClass = () => {
    switch (slice.primary.content_width) {
      case 'three-quarters':
        return 'w-full lg:w-3/4';
      case 'two-thirds':
        return 'w-full lg:w-2/3';
      case 'half':
        return 'w-full lg:w-1/2';
      case 'one-third':
        return 'w-full lg:w-1/3';
      default:
        return 'w-full';
    }
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

  // Get background color with white default
  const backgroundColor = (slice.primary as any).background_color || "#ffffff";

  // Render benefits variant
  if (isBenefits) {
    return (
      <section 
        className={`w-full ${getPaddingTopClass()} ${getPaddingBottomClass()}`}
        style={{ backgroundColor }}
      >
        <div className={`w-full max-w-[88rem] mx-auto px-4 lg:px-8 ${getMarginTopClass()}`}>
          {/* Header */}
          <div className="mb-12 lg:mb-16">
            <div className={`flex flex-col ${getContentAlignment()}`}>
              <div className={`${getWidthClass()}`}>
                {slice.primary.subheading && (
                  <div className={`flex flex-col ${slice.primary.text_alignment === 'center' ? 'items-center' : slice.primary.text_alignment === 'right' ? 'items-end' : 'items-start'}`}>
                    <SliceHeader 
                      subheading={slice.primary.subheading} 
                      textColor="text-neutral-800"
                      textAlign={slice.primary.text_alignment as "left" | "center" | "right"}
                    />
                  </div>
                )}
                {slice.primary.heading && (
                  <h2 className={`text-neutral-800 text-3xl lg:text-5xl leading-tight mb-6 ${getAlignmentClass()}`}>
                    {slice.primary.heading}
                  </h2>
                )}
                {slice.primary.description && (
                  <p className={`text-neutral-600 text-lg leading-relaxed ${getAlignmentClass()}`}>
                    {slice.primary.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          {slice.items && slice.items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 mb-12">
              {slice.items.map((item, index) => (
                <div 
                  key={index}
                  className="space-y-5 border-b-4 border-neutral-200 px-6 py-8 lg:px-8 lg:py-10 rounded-t-sm bg-neutral-50 group transition-all duration-300 hover:border-mach1-green"
                >
                  {/* Icon */}
                  <div className="h-14 lg:h-16 w-auto flex items-center justify-start mb-4">
                    {item.benefit_icon && item.benefit_icon.url ? (
                      <div className="h-12 lg:h-14 w-auto transition-transform duration-300 group-hover:scale-110">
                        <PrismicNextImage
                          field={item.benefit_icon}
                          width={56}
                          height={56}
                          className="h-full w-auto object-contain"
                          alt=""
                          quality={85}
                        />
                      </div>
                    ) : (
                      <div className="h-12 lg:h-14 w-12 lg:w-14 rounded-lg bg-mach1-green/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-mach1-green" />
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  {item.benefit_title && (
                    <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 leading-tight">
                      {item.benefit_title}
                    </h3>
                  )}
                  
                  {/* Description */}
                  {item.benefit_description && (
                    <p className="text-xs lg:text-sm text-neutral-600 leading-relaxed">
                      {item.benefit_description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Button */}
          <div className={getAlignmentClass()}>
            <ContentBlockButton
              buttonText={slice.primary.button_text}
              buttonLink={slice.primary.button_link}
              buttonStyle={slice.primary.button_style as any}
            />
          </div>
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <section className={`w-full bg-white ${getPaddingTopClass()} ${getPaddingBottomClass()}`}>
      <div className={`w-full max-w-[88rem] mx-auto px-4 lg:px-8 ${getMarginTopClass()}`}>
        {/* Header */}
        <div className="mb-16">
          <div className={`flex flex-col ${getContentAlignment()}`}>
            <div className={`${getWidthClass()}`}>
              {slice.primary.subheading && (
                <h5 className={`text-neutral-800 text-sm mb-4 ${getAlignmentClass()}`}>
                  {slice.primary.subheading}
                </h5>
              )}
              {slice.primary.heading && (
                <h2 className={`text-neutral-800 text-4xl lg:text-6xl leading-tight ${getAlignmentClass()}`}>
                  {slice.primary.heading}
                </h2>
              )}
              {slice.primary.description && (
                <p className={`text-neutral-600 text-lg leading-relaxed mt-6 ${getAlignmentClass()}`}>
                  {slice.primary.description}
                </p>
              )}
              
              {/* Button */}
              <div className={getAlignmentClass()}>
                <ContentBlockButton
                  buttonText={slice.primary.button_text}
                  buttonLink={slice.primary.button_link}
                  buttonStyle={slice.primary.button_style}
                />
              </div>
            </div>
          </div>
        
        </div>

        {/* Full Width Image */}
        {slice.primary.show_image && slice.primary.image && slice.primary.image.url && (
          <div className="mb-16">
            <div 
              className="w-full aspect-[2.8/1] bg-neutral-100 overflow-hidden"
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
          </div>
        )}

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

export default ContentBlock;
