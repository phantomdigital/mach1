import Image from "next/image";
import { isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { Check } from "lucide-react";
import { SliceHeader } from "@/components/slice-header";
import { ImageBlockAnimation, ContentBlockAnimation } from "./join-our-team-animation";
import { Button } from "@/components/ui/button";
import JoinOurTeamButton from "./join-our-team-button";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, type MarginTopSize, type PaddingSize } from "@/lib/spacing";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";
import type { JoinOurTeamSlice } from "@/types.generated";

/**
 * Props for `JoinOurTeam`.
 */
export type JoinOurTeamProps = SliceComponentProps<JoinOurTeamSlice>;

/**
 * Careers-focused CTA slice for homepage placement.
 */
const JoinOurTeam = ({ slice }: JoinOurTeamProps): React.ReactElement => {
  const marginTopClass = getMarginTopClass((slice.primary.margin_top as MarginTopSize) || "large");
  const paddingTopClass = getPaddingTopClass((slice.primary.padding_top as PaddingSize) || "large");
  const paddingBottomClass = getPaddingBottomClass((slice.primary.padding_bottom as PaddingSize) || "large");
  const backgroundColor = slice.primary.background_color || "#ffffff";
  const panelColor = slice.primary.left_panel_color || "#141433";
  const isFlipped = slice.variation === "flipped";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full relative overflow-visible ${marginTopClass} ${paddingTopClass} ${paddingBottomClass}`}
      style={{ backgroundColor }}
    >
      {/* Mobile: full-width panel rising from section bottom upward */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none lg:hidden"
        style={{ backgroundColor: panelColor }}
      />

      {/* Color panel: left (default) or right (flipped) */}
      <div
        className={`absolute inset-y-0 w-1/4 xl:w-1/3 2xl:w-[45%] pointer-events-none hidden lg:block overflow-hidden ${isFlipped ? "right-0 left-auto" : "left-0 right-auto"}`}
        style={{ backgroundColor: panelColor }}
      >
        {/* Mapbox static map - overlays when token is set */}
        {process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() && (
          <div className="absolute inset-0">
            <Image
              src={(() => {
                const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
                const customStyle = process.env.NEXT_PUBLIC_MAPBOX_STYLE_NO_LABELS;
                const style = customStyle || "mapbox/dark-v11";
                const base = `https://api.mapbox.com/styles/v1/${style}/static/153.0251,-27.4698,15/600x1200@2x`;
                const params = new URLSearchParams({
                  access_token: token,
                  ...(style === "mapbox/dark-v11" && {
                    setfilter: JSON.stringify(["==", ["get", "name"], "___hide___"]),
                    layer_id: "road-label",
                  }),
                });
                return `${base}?${params}`;
              })()}
              alt=""
              fill
              className="object-cover opacity-25"
              sizes="25vw"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[80rem] mx-auto px-4 lg:px-[clamp(2rem,5vw,2rem)]">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-16">
          {/* Image block: left (default) or right (flipped) */}
          <ImageBlockAnimation
            isFlipped={isFlipped}
            className={`${isFlipped ? "order-2 lg:order-2" : "order-2 lg:order-1"} lg:flex-1 flex pt-2 pb-2 lg:pt-4 lg:pb-4`}
          >
            <div className={`relative w-full lg:w-[clamp(24rem,46vw,42rem)] shrink-0 ${isFlipped ? "lg:ml-auto" : "lg:mr-auto"}`}>
              <div
                className="relative z-10 w-full h-full min-h-[320px] lg:min-h-[clamp(24rem,32vw,29rem)] overflow-hidden bg-neutral-200"
                style={{
                  clipPath: isFlipped
                    ? "polygon(0 0, 100% 0, 100% 100%, 2.5rem 100%, 0 calc(100% - 2rem))"
                    : "polygon(0 0, calc(100% - 2.5rem) 0, 100% 2rem, 100% 100%, 0 100%)",
                }}
              >
                {slice.primary.staff_image?.url ? (
                  <PrismicNextImage
                    field={slice.primary.staff_image}
                    className={`w-full h-full object-cover ${isFlipped ? "object-right" : "object-left"}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-500">
                    Add a staff image
                  </div>
                )}
                {/* Overlay: inset shadow sits on top so it's visible (box-shadow behind content was hidden by image) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    clipPath: isFlipped
                      ? "polygon(0 0, 100% 0, 100% 100%, 2.5rem 100%, 0 calc(100% - 2rem))"
                      : "polygon(0 0, calc(100% - 2.5rem) 0, 100% 2rem, 100% 100%, 0 100%)",
                    boxShadow:
                      "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
                  }}
                />
              </div>
            </div>
          </ImageBlockAnimation>

          {/* Content block: right (default) or left (flipped) */}
          <div className={`order-1 ${isFlipped ? "lg:order-1 lg:justify-start" : "lg:order-2 lg:justify-end"} lg:flex-1 flex`}>
            <div className="w-full lg:max-w-[clamp(24rem,40vw,44rem)] flex flex-col justify-center items-start gap-6 lg:gap-8">
            {slice.primary.subheading && (
              <ContentBlockAnimation delay={0}>
                <SliceHeader subheading={slice.primary.subheading} textColor="text-neutral-800" variant="badge" badgeVariant="green" />
              </ContentBlockAnimation>
            )}

            {slice.primary.heading && (
              <ContentBlockAnimation delay={0.1}>
                <h2 className="text-black">{slice.primary.heading}</h2>
              </ContentBlockAnimation>
            )}

            {slice.primary.description && (
              <ContentBlockAnimation delay={0.2}>
                <p className="text-neutral-700 text-sm lg:text-base">{slice.primary.description}</p>
              </ContentBlockAnimation>
            )}

            {(slice.primary.staff_name || slice.primary.staff_role) && (
              <ContentBlockAnimation delay={0.25}>
                <div className="border-l-4 border-mach1-green pl-4">
                  {slice.primary.staff_name && (
                    <p className="font-semibold text-neutral-900">{slice.primary.staff_name}</p>
                  )}
                  {slice.primary.staff_role && (
                    <p className="text-sm text-neutral-600 mt-1">{slice.primary.staff_role}</p>
                  )}
                </div>
              </ContentBlockAnimation>
            )}

            {slice.items.length > 0 && (
              <ContentBlockAnimation delay={0.3}>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slice.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-neutral-800">
                      <Check className="w-4 h-4 text-mach1-green mt-1 shrink-0" />
                      <span>{item.point_text}</span>
                    </li>
                  ))}
                </ul>
              </ContentBlockAnimation>
            )}

            <ContentBlockAnimation delay={0.4}>
            <div className="flex flex-wrap items-center justify-start self-start gap-4 pt-2">
              {isFilled.keyText(slice.primary.primary_button_text) && isFilled.link(slice.primary.primary_button_link) && (
                <JoinOurTeamButton
                  buttonText={slice.primary.primary_button_text}
                  buttonLink={slice.primary.primary_button_link}
                />
              )}

              {isFilled.keyText(slice.primary.secondary_button_text) && isFilled.link(slice.primary.secondary_button_link) && (
                <Button asChild variant="subtle" className="!px-0">
                  <PrismicNextLink field={slice.primary.secondary_button_link} className="inline-flex items-center gap-1.5 text-neutral-800">
                    <span>{slice.primary.secondary_button_text}</span>
                    <ExternalLinkIcon className="w-2.5 h-2.5" color="currentColor" />
                  </PrismicNextLink>
                </Button>
              )}
            </div>
            </ContentBlockAnimation>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinOurTeam;
