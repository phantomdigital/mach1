import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass } from "@/lib/spacing";
import { SliceHeader } from "@/components/slice-header";
import StatisticsCard from "./statistics-card";
import StatisticsDarkCard from "./statistics-dark-card";

/**
 * Props for `Statistics`.
 */
export type StatisticsProps = SliceComponentProps<Content.StatisticsSlice>;

/**
 * Component for "Statistics" Slices.
 */
const Statistics = ({ slice }: StatisticsProps): React.ReactElement => {
  // Dark Cards variant
  if (slice.variation === "darkCards") {
    const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
    const paddingTop = getPaddingTopClass(slice.primary.padding_top || "large");
    const paddingBottom = getPaddingBottomClass(slice.primary.padding_bottom || "large");
    const backgroundColor = slice.primary.background_color || "#f5f5f5";

    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className={`w-full bg-[var(--bg-color)] ${marginTop} ${paddingTop} ${paddingBottom}`}
        style={{ '--bg-color': backgroundColor } as React.CSSProperties & { '--bg-color': string }}
      >
        <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
          {/* Header Section with SliceHeader */}
          <div className="text-center mb-12 lg:mb-16">
            {slice.primary.subheading && (
              <SliceHeader 
                subheading={slice.primary.subheading} 
                textColor="text-neutral-800"
                textAlign="center"
                className="mb-4"
              />
            )}
            
            {/* Main Heading */}
            {slice.primary.heading && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 mb-6">
                {slice.primary.heading}
              </h2>
            )}
            
            {/* Description */}
            {slice.primary.description && (
              <p className="text-base lg:text-lg text-neutral-600 max-w-4xl mx-auto leading-relaxed">
                {slice.primary.description}
              </p>
            )}
          </div>

          {/* Statistics Cards Grid - 2x2 layout */}
          {slice.items && slice.items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {slice.items.map((item, index) => (
                <StatisticsDarkCard
                  key={index}
                  percentage={item.percentage || "0%"}
                  title={item.title || ""}
                  description={item.description || ""}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full py-16 lg:py-24 bg-slate-50"
    >
      <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Subheading */}
          {slice.primary.subheading && (
            <h5 className="text-sm text-gray-900 font-medium mb-6 uppercase tracking-wide">
              {slice.primary.subheading}
            </h5>
          )}
          
          {/* Main Heading */}
          {slice.primary.heading && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {slice.primary.heading}
            </h2>
          )}
          
          {/* Description */}
          {slice.primary.description && (
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {slice.primary.description}
            </p>
          )}
        </div>

        {/* Statistics Cards Grid with compact spacing */}
        {slice.items && slice.items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {slice.items.map((item, index) => (
              <StatisticsCard
                key={index}
                percentage={item.percentage || "0%"}
                title={item.title || ""}
                description={item.description || ""}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Statistics;
