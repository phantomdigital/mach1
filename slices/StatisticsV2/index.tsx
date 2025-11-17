import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, type MarginTopSize, type PaddingSize } from "@/lib/spacing";
import { SliceHeader } from "@/components/slice-header";
import StatisticsGrid from "./statistics-grid";
import StatisticsV2Animation from "./statistics-v2-animation";

/**
 * Props for `StatisticsV2`.
 */
export type StatisticsV2Props = SliceComponentProps<Content.StatisticsV2Slice>;

/**
 * Component for "StatisticsV2" Slices.
 */
const StatisticsV2 = ({ slice }: StatisticsV2Props): React.ReactElement => {
  const marginTop = getMarginTopClass(((slice.primary.margin_top as any) as MarginTopSize) || "large");
  const paddingTop = getPaddingTopClass(((slice.primary.padding_top as any) as PaddingSize) || "large");
  const paddingBottom = getPaddingBottomClass(((slice.primary.padding_bottom as any) as PaddingSize) || "large");
  
  // Background color with dark-blue default
  const backgroundColor = slice.primary.background_color || "#141433";
  
  // Normalize color for comparison (remove #, spaces, convert to lowercase)
  const normalizedColor = backgroundColor.replace(/#/g, "").replace(/\s/g, "").toLowerCase();
  
  // Check if background is dark-blue (#141433) or similar dark color
  const isDarkBlue = normalizedColor === "141433" ||
                     normalizedColor === "#141433" ||
                     normalizedColor === "rgb(20,20,51)" ||
                     normalizedColor === "rgba(20,20,51,1)" ||
                     backgroundColor.toLowerCase().includes("dark-blue") ||
                     backgroundColor.toLowerCase() === "#0f172a" ||
                     normalizedColor === "0f172a";
  
  // Text colors based on background
  const textColors = isDarkBlue ? {
    subheading: "text-blue-300",
    heading: "text-neutral-100",
    lineColor: "dark" as const,
  } : {
    subheading: "text-neutral-800",
    heading: "text-neutral-800",
    lineColor: "light" as const,
  };


  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full ${marginTop} ${paddingTop} ${paddingBottom}`}
      style={{ backgroundColor }}
    >
      <StatisticsV2Animation>
        <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
          {/* Header */}
          {(slice.primary.subheading || slice.primary.heading) && (
            <div className="mb-12 lg:mb-16" data-animate="header">
              {slice.primary.subheading && (
                <SliceHeader 
                  subheading={slice.primary.subheading}
                  variant="badge"
                  badgeVariant="green" 
                  textColor={textColors.subheading}
                  lineColor={textColors.lineColor}
                />
              )}
              
              {slice.primary.heading && (
                <h2 className={`${textColors.heading} text-3xl lg:text-5xl font-bold leading-tight mt-4`}>
                  {slice.primary.heading}
                </h2>
              )}
            </div>
          )}


          {/* Statistics Grid - Client Component for Animations */}
          <StatisticsGrid statistics={slice.primary.statistics || []} />
        </div>
      </StatisticsV2Animation>
    </section>
  );
};

export default StatisticsV2;

