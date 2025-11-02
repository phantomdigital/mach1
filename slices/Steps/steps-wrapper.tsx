import { Suspense } from "react";
import { Content, isFilled, RichTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import Steps from "./steps-client";

export type StepsProps = SliceComponentProps<Content.StepsSlice>;

function StepsLoader() {
  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="w-full max-w-[90rem] mx-auto px-4 lg:px-8">
        <div className="w-full flex items-center justify-center py-20">
          <div className="animate-pulse text-neutral-400">Loading...</div>
        </div>
      </div>
    </section>
  );
}

export default async function StepsWrapper(props: StepsProps) {
  let mainFaqs: Array<{ faq_question: string | null; faq_answer: RichTextField | null }> = [];

  // If this is a summary variation and use_main_faqs is true, fetch FAQs from linked page
  if (
    props.slice.variation === "summary" &&
    (props.slice.primary as any).use_main_faqs &&
    isFilled.contentRelationship((props.slice.primary as any).main_faq_slice)
  ) {
    try {
      const client = createClient();
      const linkedPage = await client.getByID((props.slice.primary as any).main_faq_slice.id);
      
      // Type guard: Check if the document has slices (only Page documents have slices)
      if ('slices' in linkedPage.data && Array.isArray(linkedPage.data.slices)) {
        // Find FAQ slice in the linked page
        const faqSlice = linkedPage.data.slices.find(
          (slice: any) => slice.slice_type === "faq"
        );

        if (faqSlice && 'items' in faqSlice && Array.isArray(faqSlice.items)) {
          // Get the FAQ limit from the slice (default to 5 if not set)
          const faqLimit = (props.slice.primary as any).faq_limit || 5;
          
          // Map FAQ slice items to the format expected by Steps summary and apply limit
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

  return (
    <Suspense fallback={<StepsLoader />}>
      <Steps {...props} mainFaqs={mainFaqs} />
    </Suspense>
  );
}

