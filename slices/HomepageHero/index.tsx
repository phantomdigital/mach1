import { Suspense } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { HomepageHeroAnimation } from "./homepage-hero-animation";
import { HomepageHeroImage } from "./homepage-hero-image";
import { HeroButton } from "@/components/ui/hero-button";
import { Button } from "@/components/ui/button";
import { TrackingSearch } from "./tracking-search";

/**
 * Props for `HomepageHero`.
 */
export type HomepageHeroProps = SliceComponentProps<Content.HomepageHeroSlice>;

/**
 * Component for "HomepageHero" Slices.
 * Modern, minimal hero section with split layout and natural image presentation.
 */
const HomepageHero = ({ slice }: HomepageHeroProps): React.ReactElement => {
  const layout = slice.primary.layout || "split";
  const backgroundStyle = slice.primary.background_style || "light";

  // Background classes based on style
  const getBackgroundClasses = () => {
    switch (backgroundStyle) {
      case "dark":
        return "bg-[#070c38] text-white";
      case "gradient":
        return "bg-gradient-to-br from-neutral-50 via-white to-neutral-100";
      default:
        return "bg-white text-neutral-800";
    }
  };

  // Text color classes based on background
  const getTextColorClasses = () => {
    switch (backgroundStyle) {
      case "dark":
        return {
          subheading: "text-neutral-100",
          heading: "text-neutral-100",
          description: "text-neutral-200",
        };
      default:
        return {
          subheading: "text-neutral-600",
          heading: "text-neutral-800",
          description: "text-neutral-600",
        };
    }
  };

  const textColors = getTextColorClasses();
  const hasHeroImage = slice.primary.background_image?.url;
  const hasHeroVideo = isFilled.linkToMedia(slice.primary.background_video);
  const hasHeroMedia = hasHeroImage || hasHeroVideo;

  return (
    <Suspense fallback={null}>
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className={`w-full relative ${getBackgroundClasses()} overflow-hidden`}
        style={{ paddingTop: 'var(--header-height, 128px)' }}
      >
        {/* Full-width grid with no gaps */}
        <div className="relative z-10 w-full">
          {layout === "split" && hasHeroMedia ? (
            <>

              {/* Desktop Text Content Overlay - Group aligned to bottom */}
              <div className="hidden lg:grid lg:grid-cols-[2.15fr_1.35fr] lg:items-end absolute inset-0 pointer-events-none z-30 pb-10 xl:pb-14">
                <div className="flex items-end justify-center px-4 xl:px-8">
                  {/* Text Content */}
                  <div className="max-w-2xl text-left">
                    <HomepageHeroAnimation
                      subheading={slice.primary.subheading}
                      heading={slice.primary.heading}
                      textColors={{
                        subheading: "text-white",
                        heading: "text-white",
                        description: "text-white/90"
                      }}
                      badgeButtonText={slice.primary.badge_button_text}
                      badgeButtonLink={
                        slice.primary.badge_button_link && 
                        "url" in slice.primary.badge_button_link 
                          ? slice.primary.badge_button_link.url 
                          : undefined
                      }
                    />
                  </div>

                  {/* CTA Buttons */}
                  {(slice.primary.button_1_text || slice.primary.button_2_text) && (
                    <div className="max-w-2xl mt-6 xl:mt-8">
                      <div className="flex flex-wrap gap-4">
                        {slice.primary.button_1_text && slice.primary.button_1_link && (
                          <PrismicNextLink field={slice.primary.button_1_link}>
                            <HeroButton>
                              {slice.primary.button_1_text}
                            </HeroButton>
                          </PrismicNextLink>
                        )}

                        {slice.primary.button_2_text && slice.primary.button_2_link && (
                          <HeroButton asChild>
                            <PrismicNextLink 
                              field={slice.primary.button_2_link}
                              className="!bg-transparent !border-2 !border-white hover:!bg-white hover:!text-dark-blue"
                            >
                              {slice.primary.button_2_text}
                            </PrismicNextLink>
                          </HeroButton>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Full-width Video/Image Background */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <HomepageHeroImage 
                  image={slice.primary.background_image}
                  video={slice.primary.background_video}
                  positionX={slice.primary.image_position_x ?? undefined}
                  positionY={slice.primary.image_position_y ?? undefined}
                />
                {/* Gradient Overlay - left to right + bottom to top for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent pointer-events-none" />
                {/* Bottom-to-top gradient on mobile - covers video only, starts just below tracking card */}
                <div 
                  className="absolute top-0 left-0 right-0 h-[70%] pointer-events-none lg:hidden"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent pointer-events-none hidden lg:block" />
              </div>
              
              {/* Grid Overlay */}
              <div className="relative grid grid-cols-1 lg:grid-cols-[2.15fr_1.35fr] min-h-[640px] md:min-h-[600px] lg:min-h-[720px] z-10">
              {/* Left Column - Video shows through, mobile overlay here */}
              <div className="relative flex items-end min-h-[320px] lg:min-h-0 pb-8 lg:pb-0">
                {/* Mobile Text Content Overlay - Hidden on desktop, content anchored to bottom */}
                <div className="lg:hidden absolute inset-0 flex flex-col justify-end -mb-4 pb-0 pt-4 pointer-events-none z-30">
                  <div className="w-full px-4 pointer-events-auto">
                    <div className="max-w-2xl">
                      <HomepageHeroAnimation
                        subheading={slice.primary.subheading}
                        heading={slice.primary.heading}
                        textColors={{
                          subheading: "text-white",
                          heading: "text-white",
                          description: "text-white/90"
                        }}
                        badgeButtonText={slice.primary.badge_button_text}
                        badgeButtonLink={
                          slice.primary.badge_button_link && 
                          "url" in slice.primary.badge_button_link 
                            ? slice.primary.badge_button_link.url 
                            : undefined
                        }
                      />
                    </div>

                    {/* Mobile CTA Buttons */}
                    {(slice.primary.button_1_text || slice.primary.button_2_text) && (
                      <div className="max-w-2xl mt-6">
                        <div className="flex flex-wrap gap-4">
                          {slice.primary.button_1_text && slice.primary.button_1_link && (
                            <PrismicNextLink field={slice.primary.button_1_link}>
                              <HeroButton>
                                {slice.primary.button_1_text}
                              </HeroButton>
                            </PrismicNextLink>
                          )}

                          {slice.primary.button_2_text && slice.primary.button_2_link && (
                            <HeroButton asChild>
                              <PrismicNextLink 
                                field={slice.primary.button_2_link}
                                className="!bg-transparent !border-2 !border-white hover:!bg-white hover:!text-dark-blue"
                              >
                                {slice.primary.button_2_text}
                              </PrismicNextLink>
                            </HeroButton>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Tracking (grouped with hero text at bottom) */}
              <div className="flex flex-col justify-end">
                <div
                  className="w-full bg-neutral-100 px-4 py-5 lg:px-6 lg:py-8 xl:pl-10 xl:py-8 rounded-t-lg lg:rounded-none lg:translate-y-[1px] lg:pr-[max(2rem,calc((100vw-88rem)/2+2rem))] lg:[clip-path:polygon(0_0,calc(100%_-_2.5rem)_0,100%_2rem,100%_100%,0_100%)]"
                >
                  {/* Tracking Search */}
                  <TrackingSearch 
                    heading={slice.primary.tracking_heading || undefined}
                    urlPrefix={slice.primary.tracking_url_prefix || "mach1logistics"}
                    placeholder={slice.primary.tracking_placeholder_text || undefined}
                    warningText={slice.primary.tracking_warning_text || undefined}
                    variant="light"
                  />
                  {/* Hero CTAs - icon, text, link */}
                  {slice.primary.hero_ctas && slice.primary.hero_ctas.length > 0 && (
                    <div className="mt-4 pt-4 lg:mt-4 lg:pt-4 border-t border-neutral-200 flex flex-wrap gap-8 lg:gap-6">
                      {slice.primary.hero_ctas.map((cta, i) => (
                        cta.cta_text && cta.cta_link && (
                          <PrismicNextLink
                            key={i}
                            field={cta.cta_link}
                            className="flex flex-col items-center gap-2 text-neutral-800 hover:text-neutral-600 transition-colors group"
                          >
                            {cta.cta_icon?.url && (
                              <PrismicNextImage
                                field={cta.cta_icon}
                                className="w-8 h-8 object-contain"
                                width={32}
                                height={32}
                              />
                            )}
                            <span className="text-[9px] lg:text-[11px] font-medium group-hover:underline">{cta.cta_text}</span>
                          </PrismicNextLink>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            </>
          ) : (
            // Centered Layout (no image or centered layout)
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <HomepageHeroAnimation
                subheading={slice.primary.subheading}
                heading={slice.primary.heading}
                textColors={textColors}
              />

              {/* CTA Buttons */}
              {(slice.primary.button_1_text || slice.primary.button_2_text) && (
                <div className="flex flex-wrap gap-4 mt-6 xl:mt-8 justify-center">
                  {slice.primary.button_1_text && slice.primary.button_1_link && (
                    <PrismicNextLink field={slice.primary.button_1_link}>
                      <HeroButton>
                        {slice.primary.button_1_text}
                      </HeroButton>
                    </PrismicNextLink>
                  )}

                  {slice.primary.button_2_text && slice.primary.button_2_link && (
                    <PrismicNextLink field={slice.primary.button_2_link}>
                      <Button variant="hero" className="h-[45px] px-6 rounded-2xl">
                        {slice.primary.button_2_text}
                      </Button>
                    </PrismicNextLink>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Suspense>
  );
};

export default HomepageHero;

