import { Suspense } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PageTopperClient } from "./page-topper-client";
import { PageTopperAnimation } from "./page-topper-animation";
import { PageTopperButtons } from "./page-topper-buttons";
import { PageTopperBgImage } from "./page-topper-bg-image";

/**
 * Props for `PageTopper`.
 */
export type PageTopperProps = SliceComponentProps<Content.PageTopperSlice>;

/**
 * Component for "PageTopper" Slices.
 * Automatically hides when ?step query param is present (e.g., during quote flow).
 * Content is server-rendered for SEO, client component only handles conditional visibility.
 */
const PageTopper = ({ slice }: PageTopperProps): React.ReactElement => {
  // Get width class based on selection (full width on mobile, constrained on desktop)
  const getWidthClass = () => {
    const contentWidth = (slice.primary as any).content_width;
    switch (contentWidth) {
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

  return (
    <Suspense fallback={<div className="w-full h-[89vh] bg-dark-blue" />}>
      <PageTopperClient>
        <section className="w-full">
          {/* Dark Blue Header Section */}
          <div className="w-full bg-dark-blue pt-48 flex items-end relative overflow-hidden h-[89vh]">
            {/* Background Image with scale animation */}
            {slice.primary.hero_image?.url && (
              <PageTopperBgImage heroImage={slice.primary.hero_image} />
            )}
            {/* Vignette Overlay - Dark edges, lighter center */}
            <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/70 via-black/10 to-black/85"></div>

            {/* Content */}
            <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8 pb-8 lg:pb-12 relative z-10">
              <div className={getWidthClass()}>
                {/* Header with Animation */}
                <PageTopperAnimation 
                  subheading={slice.primary.subheading || undefined}
                  heading={slice.primary.heading || undefined}
                  paragraph={slice.primary.paragraph || undefined}
                />
              
                {/* Buttons */}
                <PageTopperButtons
                  button1Text={slice.primary.button_1_text}
                  button1Link={slice.primary.button_1_link}
                  button1Style={slice.primary.button_1_style}
                  button2Text={slice.primary.button_2_text}
                  button2Link={slice.primary.button_2_link}
                  button2Style={slice.primary.button_2_style}
                />
              </div>
            </div>
          </div>
        </section>
      </PageTopperClient>
    </Suspense>
  );
};

export default PageTopper;

