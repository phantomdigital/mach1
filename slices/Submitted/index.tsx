import { Content, isFilled, RichTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
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
  const faqs = (slice.primary as any).use_main_faqs && mainFaqs.length > 0
    ? mainFaqs
    : slice.items
        .filter(item => 
          'faq_question' in item && 
          'faq_answer' in item && 
          item.faq_question && 
          item.faq_answer
        )
        .map(item => ({
          faq_question: (item as any).faq_question,
          faq_answer: (item as any).faq_answer,
        }));
  return <SubmittedClient slice={slice} faqs={faqs} />;
};

export default Submitted;

