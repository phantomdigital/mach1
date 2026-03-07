import { Content, isFilled, RichTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, type MarginTopSize, type PaddingSize } from "@/lib/spacing";
import SubmittedClient from "./submitted-client";

/**
 * Props for `Submitted`.
 */
export type SubmittedProps = SliceComponentProps<Content.SubmittedSlice>;

/**
 * Component for "Submitted" Slices.
 */
const Submitted = async ({ slice }: SubmittedProps): Promise<React.ReactElement> => {
  let mainFaqs: Array<{ faq_question: string | null; faq_answer: RichTextField | null }> = [];

  // If use_main_faqs is true, fetch FAQs from linked page
  if (
    slice.primary.use_main_faqs &&
    isFilled.contentRelationship(slice.primary.main_faq_slice)
  ) {
    try {
      const client = createClient();
      const linkedPage = await client.getByID(slice.primary.main_faq_slice.id);
      
      // Type guard: Check if the document has slices (only Page documents have slices)
      if ('slices' in linkedPage.data && Array.isArray(linkedPage.data.slices)) {
        // Find FAQ slice in the linked page
        const faqSlice = linkedPage.data.slices.find(
          (slice: any) => slice.slice_type === "faq"
        );

        if (faqSlice && 'items' in faqSlice && Array.isArray(faqSlice.items)) {
          // Get the FAQ limit from the slice (default to 5 if not set)
          const faqLimit = slice.primary.faq_limit || 5;
          
          // Map FAQ slice items to the format expected by Submitted and apply limit
          mainFaqs = faqSlice.items
            .slice(0, faqLimit)
            .map((item: any) => ({
              faq_question: item.question || null,
              faq_answer: item.answer || null,
            }));
        }
      }
    } catch (error) {
      console.error("Error fetching main FAQs:", error);
    }
  }

  // Determine which FAQs to use
  const faqs = slice.primary.use_main_faqs && mainFaqs.length > 0
    ? mainFaqs
    : slice.items
        .filter(item => 
          'faq_question' in item && 
          'faq_answer' in item && 
          item.faq_question && 
          item.faq_answer
        )
        .map(item => ({
          faq_question: item.faq_question,
          faq_answer: item.faq_answer,
        }));

  const marginTop = (slice.primary.margin_top as MarginTopSize) || "large";
  const paddingTop = (slice.primary.padding_top as PaddingSize) || "large";
  const paddingBottom = (slice.primary.padding_bottom as PaddingSize) || "large";
  const spacingClass = `${getMarginTopClass(marginTop)} ${getPaddingTopClass(paddingTop)} ${getPaddingBottomClass(paddingBottom)}`;

  return (
    <section
      className="w-full bg-white"
      style={{ paddingTop: "var(--header-height, 128px)" }}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
        <SubmittedClient slice={slice} faqs={faqs} spacingClass={spacingClass} />
      </div>
    </section>
  );
};

export default Submitted;

