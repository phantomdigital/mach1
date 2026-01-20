import { Suspense } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PageTopperClient, PageTopperVisibilityController } from "./page-topper-client";
import { PageTopperAnimation } from "./page-topper-animation";
import { PageTopperButtons } from "./page-topper-buttons";
import { PageTopperBgImage } from "./page-topper-bg-image";
import { PageTopperBgAnimation } from "./page-topper-bg-animation";

/**
 * Props for `PageTopper`.
 */
export type PageTopperProps = SliceComponentProps<Content.PageTopperSlice>;

/**
 * The actual PageTopper content - rendered server-side for instant display.
 * Separated from visibility logic to prevent image pop-in during hydration.
 */
function PageTopperContent({ slice, getWidthClass }: { 
  slice: Content.PageTopperSlice; 
  getWidthClass: () => string;
}) {
  return (
    <PageTopperClient>
      <section className="w-full">
        {/* Dark Blue Header Section */}
        <div className="w-full bg-dark-blue pt-48 flex items-end relative overflow-hidden" style={{ height: 'calc(var(--page-topper-vh, 1vh) * 89)' }}>
          {/* Background Image - Server rendered, client animated */}
          {slice.primary.hero_image?.url && (
            <PageTopperBgAnimation>
              <PageTopperBgImage 
                heroImage={slice.primary.hero_image}
                imagePosition={slice.primary.image_position as 'top' | 'center' | 'bottom' | undefined}
              />
            </PageTopperBgAnimation>
          )}
          
          {/* Vignette Overlay - Dark edges, lighter center */}
          <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/70 via-black/10 to-black/85"></div>

          {/* Content */}
          <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8 pb-8 lg:pb-12 relative z-10">
            <div className={getWidthClass()}>
              {/* Header with Animation - Progressive enhancement */}
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
  );
}

/**
 * Component for "PageTopper" Slices.
 * 
 * Architecture:
 * - Server Component (this file): Renders all static content, fetches data
 * - PageTopperContent: The actual hero content (always server-rendered)
 * - PageTopperBgImage (Server): Renders the hero image with SSR optimisation
 * - PageTopperBgAnimation (Client): Wraps image for scale animation only
 * - PageTopperAnimation (Client): Handles text reveal animations with progressive enhancement
 * - PageTopperButtons (Client): Handles button hover animations
 * - PageTopperClient (Client): Handles viewport height calculation
 * - PageTopperVisibilityController (Client): Handles URL-based visibility (quote flow)
 * 
 * Progressive Enhancement:
 * - Image is SSR'd in scaled position, animates to normal on client
 * - Text is SSR'd visible, animations enhance the experience
 * - If JS fails, content is still fully visible and functional
 * 
 * IMPORTANT: The Suspense boundary only wraps the visibility controller,
 * NOT the content. This prevents the image from disappearing during hydration.
 * The content is rendered unconditionally on the server, and the visibility
 * controller hides it client-side if needed (quote flow).
 */
const PageTopper = ({ slice }: PageTopperProps): React.ReactElement => {
  // Get width class based on selection (full width on mobile, constrained on desktop)
  const getWidthClass = () => {
    const contentWidth = slice.primary.content_width;
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

  // Render the content directly (server-rendered for instant display)
  const content = <PageTopperContent slice={slice} getWidthClass={getWidthClass} />;

  // Wrap in visibility controller with Suspense
  // The fallback shows the CONTENT (not null) to prevent pop-in
  return (
    <Suspense fallback={content}>
      <PageTopperVisibilityController>
        {content}
      </PageTopperVisibilityController>
    </Suspense>
  );
};

export default PageTopper;
