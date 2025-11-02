import { Suspense } from "react";
import { Content, isFilled, RichTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import TrackingClient from "./tracking-client";

/**
 * Props for `Tracking`.
 */
export type TrackingProps = SliceComponentProps<Content.TrackingSlice>;

function TrackingLoader() {
  return (
    <section className="w-full py-16 lg:py-24 bg-white">
      <div className="w-full max-w-[90rem] mx-auto px-4 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-12 bg-neutral-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    </section>
  );
}

/**
 * Component for "Tracking" Slices.
 */
const Tracking = async ({ slice }: TrackingProps): Promise<React.ReactElement> => {
  let mainFaqs: Array<{ faq_question: string | null; faq_answer: RichTextField | null }> = [];

  // If use_main_faqs is true, fetch FAQs from linked page
  if (
    (slice.primary as any).use_main_faqs &&
    isFilled.contentRelationship((slice.primary as any).main_faq_slice)
  ) {
    try {
      const client = createClient();
      const linkedPage = await client.getByID((slice.primary as any).main_faq_slice.id);
      
      // Type guard: Check if the document has slices (only Page documents have slices)
      if ('slices' in linkedPage.data && Array.isArray(linkedPage.data.slices)) {
        // Find FAQ slice in the linked page
        const faqSlice = linkedPage.data.slices.find(
          (slice: any) => slice.slice_type === "faq"
        );

        if (faqSlice && 'items' in faqSlice && Array.isArray(faqSlice.items)) {
          // Get the FAQ limit from the slice (default to 5 if not set)
          const faqLimit = (slice.primary as any).faq_limit || 5;
          
          // Map FAQ slice items to the format expected by Tracking and apply limit
          mainFaqs = faqSlice.items
            .slice(0, faqLimit)
            .map((item: any) => ({
              faq_question: item.question || null,
              faq_answer: item.answer || null, // Pass full RichText field
            }));
        }
      }
    } catch (error) {
      console.error("Error fetching main FAQs:", error);
    }
  }
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

  // Determine which FAQs to use
  const faqs = (slice.primary as any).use_main_faqs && mainFaqs.length > 0
    ? mainFaqs
    : slice.items
        .filter(item => item.faq_question && item.faq_answer)
        .map(item => ({
          faq_question: item.faq_question,
          faq_answer: item.faq_answer,
        }));

  return (
    <Suspense fallback={<TrackingLoader />}>
      <section className={`w-full py-16 lg:py-24 bg-white ${getMarginTopClass()}`}>
        <div className="w-full max-w-[90rem] mx-auto px-4 lg:px-8">
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
    </Suspense>
  );
};

export default Tracking;

