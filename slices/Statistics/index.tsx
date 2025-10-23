import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import StatisticsCard from "./statistics-card";

/**
 * Props for `Statistics`.
 */
export type StatisticsProps = SliceComponentProps<Content.StatisticsSlice>;

/**
 * Component for "Statistics" Slices.
 */
const Statistics = ({ slice }: StatisticsProps): React.ReactElement => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full py-16 lg:py-24 bg-slate-50"
    >
      <div className="w-full max-w-[100rem] mx-auto px-4 lg:px-8">
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
