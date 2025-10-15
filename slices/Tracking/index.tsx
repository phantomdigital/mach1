import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import TrackingClient from "./tracking-client";

/**
 * Props for `Tracking`.
 */
export type TrackingProps = SliceComponentProps<Content.TrackingSlice>;

/**
 * Component for "Tracking" Slices.
 */
const Tracking = ({ slice }: TrackingProps): React.ReactElement => {
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

  // Filter out FAQs with empty questions
  const faqs = slice.items
    .filter(item => item.faq_question && item.faq_answer)
    .map(item => ({
      faq_question: item.faq_question,
      faq_answer: item.faq_answer,
    }));

  return (
    <section className={`w-full py-16 lg:py-24 bg-white ${getMarginTopClass()}`}>
      <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
        {slice.primary.url_prefix ? (
          <TrackingClient
            urlPrefix={slice.primary.url_prefix}
            placeholderText={slice.primary.placeholder_text || undefined}
            heading={slice.primary.heading}
            subheading={slice.primary.subheading}
            description={slice.primary.description}
            faqs={faqs}
          />
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

