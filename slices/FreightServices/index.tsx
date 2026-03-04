import React from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import FreightServicesButton from "./freight-services-button";
import {
  getMarginTopClass,
  getPaddingTopClass,
  getPaddingBottomClass,
} from "@/lib/spacing";

export type FreightServicesProps = {
  slice: Content.FreightServicesSlice;
};

function ServiceBlock({
  icon,
  title,
  description,
}: {
  icon: Content.FreightServicesSlice["items"][number]["icon"];
  title: string | null | undefined;
  description: string | null | undefined;
}) {
  return (
    <div className="flex flex-col items-start gap-4 md:gap-3 lg:gap-4 min-w-0">
      {/* Icon - stacked on top, uploadable in Prismic */}
      {icon?.url && (
        <div className="flex-shrink-0 w-16 h-16 md:w-12 md:h-12 lg:w-14 lg:h-14">
          <PrismicNextImage
            field={icon}
            className="w-full h-full object-contain"
            loading="lazy"
            quality={85}
            sizes="(max-width: 768px) 64px, 56px"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 md:gap-0.5 min-w-0">
        {title && (
          <h3 className="text-neutral-800 text-lg font-semibold leading-tight m-0">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-neutral-600 text-sm md:text-xs font-normal leading-relaxed m-0">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

const FreightServices = ({ slice }: FreightServicesProps): React.ReactElement => {
  const marginTop = getMarginTopClass(
    (slice.primary.margin_top as "none" | "small" | "medium" | "large" | "extra-large") || "large"
  );
  const paddingTop = getPaddingTopClass(
    (slice.primary.padding_top as "none" | "small" | "medium" | "large" | "extra-large") || "large"
  );
  const paddingBottom = getPaddingBottomClass(
    (slice.primary.padding_bottom as "none" | "small" | "medium" | "large" | "extra-large") || "large"
  );
  const backgroundColor = slice.primary.background_color || "#ffffff";
  const items = slice.items || [];

  return (
    <section
      data-slice-type="freight_services"
      data-slice-variation="default"
      className={`w-full bg-[var(--bg-color)] ${marginTop} ${paddingTop} ${paddingBottom}`}
      style={
        {
          "--bg-color": backgroundColor,
        } as React.CSSProperties & { "--bg-color": string }
      }
    >
      <div className="w-full max-w-[80rem] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Main intro with vertical accent line */}
          <div className="flex">
            {/* Vertical green accent line */}
            <div className="w-0.5 h-auto min-h-full bg-mach1-green flex-shrink-0 mr-4 lg:mr-6 self-stretch" />
            <div className="flex flex-col gap-6 min-w-0">
              {slice.primary.heading && (
                <h2 className="text-black">
                  {slice.primary.heading}
                </h2>
              )}
              {slice.primary.description && (
                <p className="text-neutral-700 text-sm lg:text-base leading-relaxed">
                  {slice.primary.description}
                </p>
              )}
              {isFilled.keyText(slice.primary.primary_button_text) && isFilled.link(slice.primary.primary_button_link) && (
                <div className="pt-2">
                  <FreightServicesButton
                    buttonText={slice.primary.primary_button_text}
                    buttonLink={slice.primary.primary_button_link}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - 2x2 grid of service blocks */}
          {items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 lg:gap-x-12 lg:gap-y-12">
              {items.map((item, index) => (
                <ServiceBlock
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FreightServices;
