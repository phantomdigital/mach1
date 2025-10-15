import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { ContentClippedShape } from "./content-clipped-shape";
import { HeaderSeparator } from "@/components/ui/header-separator";

/**
 * Props for `ContentBlock`.
 */
export type ContentBlockProps = SliceComponentProps<Content.ContentBlockSlice>;

/**
 * Component for "ContentBlock" Slices.
 */
const ContentBlock = ({ slice }: ContentBlockProps): React.ReactElement => {
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

  return (
    <section className="w-full py-16 lg:py-24 bg-white">
      <div className={`w-full ${getMarginTopClass()} mx-auto px-4 lg:px-20`}>
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
            </div>
          </div>
        
        </div>

        {/* Full Width Image with Clipping */}
        {slice.primary.show_image && slice.primary.image && slice.primary.image.url && (
          <div className="mb-16">
            <ContentClippedShape className="w-full aspect-[2.8/1] bg-neutral-100">
              <PrismicNextImage
                field={slice.primary.image}
                className="w-full h-full object-cover"
                alt=""
              />
            </ContentClippedShape>
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
