import { Suspense } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { HomepageHeroAnimation } from "./homepage-hero-animation";
import { HomepageHeroImage } from "./homepage-hero-image";
import { HeroButton } from "@/components/ui/hero-button";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/**
 * Props for `HomepageHero`.
 */
export type HomepageHeroProps = SliceComponentProps<Content.HomepageHeroSlice>;

/**
 * Component for "HomepageHero" Slices.
 * Modern, minimal hero section with split layout and natural image presentation.
 */
const HomepageHero = ({ slice }: HomepageHeroProps): React.ReactElement => {
  const layout = (slice.primary as any).layout || "split";
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
        className={`w-full relative ${getBackgroundClasses()} pt-42 overflow-hidden`}
      >
        {/* Full-width grid with no gaps */}
        <div className="relative z-10 w-full">
          {layout === "split" && hasImage ? (
            // New Layout: Hero image left with text overlay, stacked content right
            <div className="relative grid grid-cols-1 lg:grid-cols-[2.5fr_1fr]">
              {/* Left Column - Hero Image with Text Overlay */}
              <div className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
                <HomepageHeroImage image={slice.primary.background_image} />
                
                {/* Text Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end px-8 py-12 lg:px-12 lg:py-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <div className="max-w-2xl ml-0 lg:ml-36">
                    <HomepageHeroAnimation
                      subheading={slice.primary.subheading || undefined}
                      heading={slice.primary.heading || undefined}
                      description={slice.primary.description || undefined}
                      textColors={{
                        subheading: "text-white",
                        heading: "text-white",
                        description: "text-white/90"
                      }}
                      badgeButtonText={(slice.primary as any).badge_button_text}
                      badgeButtonLink={(slice.primary as any).badge_button_link?.url}
                    />
                  </div>

                  {/* CTA Buttons */}
                  {(slice.primary.button_1_text || slice.primary.button_2_text) && (
                    <div className="max-w-2xl ml-0 lg:ml-36">
                      <div className="flex flex-wrap gap-4 mt-6 lg:mt-8">
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

              {/* Right Column - Stacked Content */}
              <div className="flex flex-col">
                {/* Top: Secondary Image */}
                <div className="relative h-[250px] lg:flex-1 overflow-hidden bg-neutral-100">
                  {slice.primary.secondary_image && (
                    <HomepageHeroImage image={slice.primary.secondary_image} />
                  )}
                </div>

                {/* Bottom: Features/Info List */}
                <div className="flex-1 bg-neutral-100 px-16 py-14">
                  {slice.items && slice.items.length > 0 ? (
                    <Tabs defaultValue="freight_solutions" className="w-full">
                      <TabsList className="mb-6 bg-transparent p-0 h-auto border-b border-neutral-200 rounded-none gap-6">
                        <TabsTrigger 
                          value="freight_solutions" 
                          className="pt-0 px-0 pb-2 text-sm font-medium text-neutral-600 data-[state=active]:text-neutral-800 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-neutral-800 data-[state=active]:shadow-none rounded-none border-0 border-b-2 border-transparent"
                        >
                          {slice.primary.tab_1_label || "Freight Solutions"}
                        </TabsTrigger>
                        <TabsTrigger 
                          value="specialties" 
                          className="pt-0 px-0 pb-2 text-sm font-medium text-neutral-600 data-[state=active]:text-neutral-800 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-neutral-800 data-[state=active]:shadow-none rounded-none border-0 border-b-2 border-transparent"
                        >
                          {slice.primary.tab_2_label || "Specialties"}
                        </TabsTrigger>
                      </TabsList>

                      {/* Freight Solutions Tab */}
                      <TabsContent value="freight_solutions" className="mt-0">
                        <div className="space-y-4">
                          {slice.items
                            .filter((item) => (item as any).service_category === "freight_solutions")
                            .map((item, index) => (
                              <div key={index} className="group flex items-start gap-3 cursor-pointer">
                                {/* Service Icon */}
                                {item.service_icon && item.service_icon.url ? (
                                  <PrismicNextImage
                                    field={item.service_icon}
                                    className="w-6 h-6 object-contain flex-shrink-0 mt-0.5"
                                    alt={item.service_title || "icon"}
                                    loading="lazy"
                                  />
                                ) : (
                                  <svg className="w-6 h-6 text-neutral-800 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="square" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                )}
                                
                                {/* Service Content */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    {item.service_title && (
                                      <h6 className="text-lg font-semibold text-neutral-800 m-0 group-hover:underline">
                                        {item.service_title}
                                      </h6>
                                    )}
                                    {/* External Link Icon - appears on hover, no transition */}
                                    <div className="hidden group-hover:block">
                                      <ExternalLinkIcon className="w-[11px] h-[11px]" color="#262626" />
                                    </div>
                                  </div>
                                  {item.service_description && (
                                    <p className="text-base text-neutral-600 leading-relaxed mt-1 mb-0">
                                      {item.service_description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          {slice.items.filter((item) => (item as any).service_category === "freight_solutions").length === 0 && (
                            <p className="text-sm text-neutral-500">No freight solutions configured</p>
                          )}
                        </div>
                      </TabsContent>

                      {/* Specialties Tab */}
                      <TabsContent value="specialties" className="mt-0">
                        <div className="space-y-4">
                          {slice.items
                            .filter((item) => (item as any).service_category === "specialties")
                            .map((item, index) => (
                              <div key={index} className="group flex items-start gap-3 cursor-pointer">
                                {/* Service Icon */}
                                {item.service_icon && item.service_icon.url ? (
                                  <PrismicNextImage
                                    field={item.service_icon}
                                    className="w-6 h-6 object-contain flex-shrink-0 mt-0.5"
                                    alt={item.service_title || "icon"}
                                    loading="lazy"
                                  />
                                ) : (
                                  <svg className="w-6 h-6 text-neutral-800 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="square" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                )}
                                
                                {/* Service Content */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    {item.service_title && (
                                      <h6 className="text-lg font-semibold text-neutral-800 m-0 group-hover:underline">
                                        {item.service_title}
                                      </h6>
                                    )}
                                    {/* External Link Icon - appears on hover, no transition */}
                                    <div className="hidden group-hover:block">
                                      <ExternalLinkIcon className="w-[11px] h-[11px]" color="#262626" />
                                    </div>
                                  </div>
                                  {item.service_description && (
                                    <p className="text-base text-neutral-600 leading-relaxed mt-1 mb-0">
                                      {item.service_description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          {slice.items.filter((item) => (item as any).service_category === "specialties").length === 0 && (
                            <p className="text-sm text-neutral-500">No specialties configured</p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <p className="text-sm text-neutral-500">No services configured</p>
                  )}
                  
                  {/* Services Blurb */}
                  {slice.primary.services_blurb && (
                    <p className="text-base text-neutral-600 leading-relaxed mt-20">
                      {slice.primary.services_blurb}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Centered Layout (no image or centered layout)
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <HomepageHeroAnimation
                subheading={slice.primary.subheading || undefined}
                heading={slice.primary.heading || undefined}
                description={slice.primary.description || undefined}
                textColors={textColors}
              />

              {/* CTA Buttons */}
              {(slice.primary.button_1_text || slice.primary.button_2_text) && (
                <div className="flex flex-wrap gap-4 mt-6 lg:mt-8 justify-center">
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

