import { Suspense } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { HomepageHeroAnimation } from "./homepage-hero-animation";
import { HomepageHeroImage } from "./homepage-hero-image";
import { HeroButton } from "@/components/ui/hero-button";
import { Button } from "@/components/ui/button";
import { HomepageHeroTabs } from "./homepage-hero-tabs";
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
  const hasImage = slice.primary.background_image?.url;

  return (
    <Suspense fallback={null}>
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className={`w-full relative ${getBackgroundClasses()} pt-32 md:pt-32 xl:pt-40 overflow-hidden`}
      >
        {/* Full-width grid with no gaps */}
        <div className="relative z-10 w-full">
          {layout === "split" && hasImage ? (
            <>

              {/* Desktop Text Content Overlay - Hidden on mobile, positioned over the grid */}
              <div className="hidden lg:flex lg:items-end absolute bottom-0 left-0 right-0 py-8 xl:py-12 pointer-events-none z-30 lg:top-0 lg:bottom-auto lg:h-full">
                <div className="w-full max-w-[88rem] mx-auto px-4 xl:px-8 pointer-events-none">
                  {/* Text Content */}
                  <div className="max-w-2xl">
                    <HomepageHeroAnimation
                      subheading={slice.primary.subheading}
                      heading={slice.primary.heading}
                      description={slice.primary.description}
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
              
              {/* Grid */}
              <div className="relative grid grid-cols-1 lg:grid-cols-[2.5fr_1fr]">
              {/* Left Column - Hero Image with Gradient Overlay */}
              <div className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[720px] overflow-hidden">
                <HomepageHeroImage 
                  image={slice.primary.background_image}
                  positionX={slice.primary.image_position_x ?? undefined}
                  positionY={slice.primary.image_position_y ?? undefined}
                />
                
                {/* Gradient Overlay - Constrained to left column only */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none z-20" />
                
                {/* Mobile Text Content Overlay - Hidden on desktop, overlays this image container */}
                <div className="lg:hidden absolute bottom-0 left-0 right-0 py-8 pointer-events-none z-30">
                  <div className="w-full px-4 pointer-events-auto">
                    <div className="max-w-2xl">
                      <HomepageHeroAnimation
                        subheading={slice.primary.subheading}
                        heading={slice.primary.heading}
                        description={slice.primary.description}
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

              {/* Right Column - Stacked Content */}
              <div className="flex flex-col">
                {/* Top: Secondary Image */}
                <div className="relative h-[200px] md:h-[250px] lg:flex-1 overflow-hidden bg-neutral-100">
                  {slice.primary.secondary_image && (
                    <HomepageHeroImage 
                      image={slice.primary.secondary_image}
                      positionX={slice.primary.image_position_x ?? undefined}
                      positionY={slice.primary.image_position_y ?? undefined}
                    />
                  )}
                </div>

                {/* Bottom: Features/Info List */}
                <div className="flex-1 bg-neutral-100 px-6 py-8 xl:px-16 xl:py-14">
                  {slice.items && slice.items.length > 0 ? (
                    <HomepageHeroTabs slice={slice} />
                  ) : (
                    <p className="text-sm text-neutral-500">No services configured</p>
                  )}
                  
                  {/* Tracking Search */}
                  {slice.primary.tracking_heading && (
                    <div className="mt-20 space-y-4">
                      <h3 className="text-neutral-800 text-left text-base font-medium">
                        {slice.primary.tracking_heading}
                      </h3>
                      <TrackingSearch 
                        urlPrefix={slice.primary.tracking_url_prefix || "mach1logistics"}
                        placeholder={slice.primary.tracking_placeholder_text || undefined}
                        warningText={slice.primary.tracking_warning_text || undefined}
                        variant="light"
                      />
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
                description={slice.primary.description}
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

