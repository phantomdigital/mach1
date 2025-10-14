import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { TrackingWidget } from "./tracking-widget";

/**
 * Props for `Tracking`.
 */
export type TrackingProps = SliceComponentProps<Content.TrackingSlice>;

/**
 * Component for "Tracking" Slices.
 */
const Tracking = ({ slice }: TrackingProps): React.ReactElement => {
  // Get margin top class based on selection
  const getMarginTopClass = () => {
    switch (slice.primary.margin_top) {
      case 'none':
        return 'mt-0';
      case 'small':
        return 'mt-12';
      case 'medium':
        return 'mt-24';
      case 'large':
        return 'mt-48';
      case 'extra-large':
        return 'mt-64';
      default:
        return 'mt-48';
    }
  };

  return (
    <section className={`w-full py-16 lg:py-24 bg-white ${getMarginTopClass()}`}>
      <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
        {/* Tracking Widget */}
        {slice.primary.url_prefix ? (
          <div className="w-full max-w-xl">
            <h1 className="text-[2rem] font-semibold text-neutral-900 mb-8">
              Track your shipment:
            </h1>
            <TrackingWidget 
              urlPrefix={slice.primary.url_prefix}
              placeholderText={(slice.primary as any).placeholder_text || undefined}
            />
          </div>
        ) : (
          <div className="text-center text-neutral-500">
            Please configure the Logixboard URL prefix in Prismic
          </div>
        )}
      </div>
    </section>
  );
};

export default Tracking;

