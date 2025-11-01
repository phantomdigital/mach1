import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass } from "@/lib/spacing";
import { Button } from "@/components/ui/button";
import { PrismicNextLink } from "@prismicio/next";
import SolutionCard from "./solution-card";
import SolutionsAnimation from "./solutions-animation";

/**
 * Props for `Solutions`.
 */
export type SolutionsProps = SliceComponentProps<Content.SolutionsSlice>;

/**
 * Component for "Solutions" Slices.
 */
const Solutions = ({ slice }: SolutionsProps): JSX.Element => {
  const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
  const paddingTop = getPaddingTopClass(slice.primary.padding_top || "large");
  const paddingBottom = getPaddingBottomClass(slice.primary.padding_bottom || "large");
  
  // Limit number of cards displayed
  const cardsLimit = slice.primary.cards_limit || 4;
  const displayedItems = slice.items.slice(0, cardsLimit);
  
  // Background color with white default
  const backgroundColor = slice.primary.background_color || "#ffffff";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full ${marginTop} ${paddingTop} ${paddingBottom}`}
      style={{ backgroundColor }}
    >
      <SolutionsAnimation>
        <div className="w-full max-w-[100rem] mx-auto px-4 lg:px-8">
          {/* Centered Header */}
          {(slice.primary.subheading || slice.primary.heading) && (
            <div className="text-center mb-12 lg:mb-16" data-animate="header">
              {slice.primary.subheading && (
                <h5 className="text-neutral-800 text-sm uppercase tracking-wider mb-6">
                  {slice.primary.subheading}
                </h5>
              )}
              {slice.primary.heading && (
                <h2 className="text-neutral-800 text-2xl lg:text-4xl max-w-4xl mx-auto ">
                  {slice.primary.heading}
                </h2>
              )}
            </div>
          )}

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
            {displayedItems.map((item, index) => (
              <div key={index} data-animate="card">
                <SolutionCard item={item} index={index} />
              </div>
            ))}
          </div>

          {/* Bottom Button */}
          {slice.primary.button_text && slice.primary.button_link && (
            <div className="flex justify-center" data-animate="button">
              <Button asChild variant="hero" size="lg">
                <PrismicNextLink field={slice.primary.button_link}>
                  {slice.primary.button_text}
                </PrismicNextLink>
              </Button>
            </div>
          )}
        </div>
      </SolutionsAnimation>
    </section>
  );
};

export default Solutions;
