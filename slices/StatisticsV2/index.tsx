import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import StatisticsGrid from "./statistics-grid";

/**
 * Props for `StatisticsV2`.
 */
export type StatisticsV2Props = SliceComponentProps<Content.StatisticsV2Slice>;

/**
 * Component for "StatisticsV2" Slices.
 */
const StatisticsV2 = ({ slice }: StatisticsV2Props): React.ReactElement => {
  // Get margin top class based on selection (responsive: smaller on mobile)
  const getMarginTopClass = () => {
    switch (slice.primary.margin_top) {
      case 'none':
        return 'mt-0';
      case 'small':
        return 'mt-6 lg:mt-12';
      case 'medium':
        return 'mt-12 lg:mt-24';
      case 'large':
        return 'mt-30 lg:mt-48';
      case 'extra-large':
        return 'mt-40 lg:mt-64';
      default:
        return 'mt-30 lg:mt-48';
    }
  };

  // Get padding top class based on selection (responsive: smaller on mobile)
  const getPaddingTopClass = () => {
    switch (slice.primary.padding_top) {
      case 'none':
        return 'pt-0';
      case 'small':
        return 'pt-6 lg:pt-12';
      case 'medium':
        return 'pt-12 lg:pt-24';
      case 'large':
        return 'pt-16 lg:pt-32';
      case 'extra-large':
        return 'pt-24 lg:pt-48';
      default:
        return 'pt-12 lg:pt-24';
    }
  };

  // Get padding bottom class based on selection (responsive: smaller on mobile)
  const getPaddingBottomClass = () => {
    switch (slice.primary.padding_bottom) {
      case 'none':
        return 'pb-0';
      case 'small':
        return 'pb-6 lg:pb-12';
      case 'medium':
        return 'pb-12 lg:pb-24';
      case 'large':
        return 'pb-16 lg:pb-32';
      case 'extra-large':
        return 'pb-24 lg:pb-48';
      default:
        return 'pb-12 lg:pb-24';
    }
  };

  return (
    <section className={`w-full bg-dark-blue ${getPaddingTopClass()} ${getPaddingBottomClass()}`}>
      <div className={`w-full max-w-[88rem] mx-auto px-4 lg:px-8 ${getMarginTopClass()}`}>
        {/* Header */}
        {(slice.primary.subheading || slice.primary.heading) && (
          <div className="mb-16 text-center">
            {slice.primary.subheading && (
              <h5 className="text-white text-sm mb-4">
                {slice.primary.subheading}
              </h5>
            )}
            
            {slice.primary.heading && (
              <h2 className="text-white leading-tight">
                {slice.primary.heading}
              </h2>
            )}
          </div>
        )}

        {/* Statistics Grid - Client Component for Animations */}
        <StatisticsGrid statistics={slice.primary.statistics || []} />
      </div>
    </section>
  );
};

export default StatisticsV2;

