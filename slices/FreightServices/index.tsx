import React from "react";
import { Content, isFilled } from "@prismicio/client";
import FreightServicesButton from "./freight-services-button";
import { ServiceBlock } from "./service-block";
import { AnimatedAccentLine, SectionAnimation, ServiceBlockAnimation } from "./freight-services-animation";
import {
  getMarginTopClass,
  getPaddingTopClass,
  getPaddingBottomClass,
} from "@/lib/spacing";

export type FreightServicesProps = {
  slice: Content.FreightServicesSlice;
};

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
      <SectionAnimation>
      <div className="w-full max-w-[80rem] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-34">
          {/* Left Column - Main intro with vertical accent line (line height matches content, centered vertically) */}
          <div className="flex items-center">
            <div className="flex items-center gap-4 lg:gap-6 min-w-0">
              <AnimatedAccentLine />
              <div className="flex flex-col gap-6 min-w-0 py-5">
                {slice.primary.subheading && (
                  <p className="text-neutral-500 text-[11px] font-semibold uppercase tracking-widest">
                    {slice.primary.subheading}
                  </p>
                )}
                {slice.primary.heading && (
                  <h2 className="text-black">
                    {slice.primary.heading}
                  </h2>
                )}
                {slice.primary.description && (
                  <p className="text-neutral-700 text-sm lg:text-base">
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
          </div>

          {/* Right Column - 2x2 grid of service blocks */}
          {items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 lg:gap-x-12 lg:gap-y-12">
              {items.map((item, index) => (
                <ServiceBlockAnimation key={index} index={index}>
                  <ServiceBlock
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                </ServiceBlockAnimation>
              ))}
            </div>
          )}
        </div>
      </div>
      </SectionAnimation>
    </section>
  );
};

export default FreightServices;
