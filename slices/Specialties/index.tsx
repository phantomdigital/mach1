import React from "react";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass } from "@/lib/spacing";
import { Button } from "@/components/ui/button";
import { SliceHeader } from "@/components/slice-header";
import { CheckCircle } from "lucide-react";

/**
 * Props for `Specialties`.
 */
export type SpecialtiesProps = SliceComponentProps<Content.SpecialtiesSlice>;

/**
 * Component for "Specialties" Slices.
 * Two-column layout showcasing operational specialties with image collage
 */
const Specialties = ({ slice }: SpecialtiesProps): React.ReactElement => {
  const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
  const paddingTop = getPaddingTopClass(slice.primary.padding_top || "large");
  const paddingBottom = getPaddingBottomClass(slice.primary.padding_bottom || "large");

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full bg-white ${marginTop} ${paddingTop} ${paddingBottom}`}
    >
      <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
        {/* Header */}
        <SliceHeader subheading={slice.primary.subheading} textColor="text-neutral-800" />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Image Collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 h-[500px] lg:h-[600px]">
              {/* Top Left Image */}
              {slice.primary.image_1 && (
                <div className="relative overflow-hidden rounded-lg">
                  <PrismicNextImage
                    field={slice.primary.image_1}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              )}

              {/* Statistics Card Overlay */}
              {(slice.primary.statistic_number || slice.primary.statistic_label) && (
                <div className="relative">
                  {/* Right Image as Background */}
                  {slice.primary.image_3 && (
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <PrismicNextImage
                        field={slice.primary.image_3}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Statistics Card */}
                  <div className="absolute top-4 left-4 right-4 bg-orange-500 text-white p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      {slice.primary.statistic_icon && (
                        <div className="w-8 h-8 flex-shrink-0">
                          <PrismicNextImage
                            field={slice.primary.statistic_icon}
                            className="w-full h-full object-contain filter brightness-0 invert"
                          />
                        </div>
                      )}
                      <div className="text-2xl font-bold">
                        {slice.primary.statistic_number}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {slice.primary.statistic_label}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Left Image */}
              {slice.primary.image_2 && (
                <div className="col-span-2 relative overflow-hidden rounded-lg">
                  <PrismicNextImage
                    field={slice.primary.image_2}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Main Heading */}
            {slice.primary.heading && (
              <h2 className="text-3xl lg:text-5xl font-bold text-neutral-800 leading-tight">
                {slice.primary.heading}
              </h2>
            )}

            {/* Description */}
            {slice.primary.description && (
              <p className="text-base text-neutral-600 leading-relaxed">
                {slice.primary.description}
              </p>
            )}

            {/* Specialties List */}
            {slice.items && slice.items.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slice.items.map((item, index) => (
                  item.specialty_title && (
                    <div key={index} className="flex items-center gap-3">
                      {item.specialty_icon ? (
                        <div className="w-5 h-5 flex-shrink-0">
                          <PrismicNextImage
                            field={item.specialty_icon}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                      <span className="text-neutral-700 font-medium">
                        {item.specialty_title}
                      </span>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* CTA Button */}
            {slice.primary.button_text && slice.primary.button_link && (
              <div className="pt-4">
                <Button asChild variant="outline" size="lg">
                  <PrismicNextLink field={slice.primary.button_link}>
                    {slice.primary.button_text}
                  </PrismicNextLink>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specialties;
