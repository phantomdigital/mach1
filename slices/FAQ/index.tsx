import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { getContainerClass, getSectionPaddingClass } from "@/lib/spacing";
import { createClient } from "@/prismicio";
import { SliceHeader } from "@/components/slice-header";
import FaqAccordion from "./faq-accordion";
import SimpleFaqList from "./simple-faq-list";

/**
 * Props for `Faq`.
 */
export type FaqProps = SliceComponentProps<Content.FaqSlice>;

/**
 * Component for "Faq" Slices.
 */
const Faq = async ({ slice }: FaqProps): Promise<React.ReactElement> => {
  const faqLimit = slice.primary.faq_limit || 10;
  let faqs = slice.items.filter(item => item.question);

  // Referenced variant: Pull FAQs from another page
  if (slice.variation === ("referenced" as any)) {
    const faqPage = (slice.primary as any).faq_page;
    const filterCategory = (slice.primary as any).filter_by_category;

    if (faqPage && faqPage.id) {
      try {
        const client = createClient();
        const referencedPage = await client.getByID(faqPage.id);

        // Find FAQ slices in the referenced page
        if (referencedPage.data.slices) {
          const faqSlices = referencedPage.data.slices.filter(
            (s: any) => s.slice_type === "faq"
          );

          // Collect all FAQ items from all FAQ slices
          const allFaqs: any[] = [];
          faqSlices.forEach((faqSlice: any) => {
            if (faqSlice.items && Array.isArray(faqSlice.items)) {
              allFaqs.push(...faqSlice.items);
            }
          });

          // Filter by category if specified
          faqs = allFaqs
            .filter(item => item.question) // Only FAQs with questions
            .filter(item => {
              if (!filterCategory || filterCategory === "All") return true;
              return item.category === filterCategory;
            });
        }
      } catch (error) {
        console.log("Could not fetch referenced FAQ page, using local items");
      }
    }
  }

  // Apply limit
  faqs = faqs.slice(0, faqLimit);

  if (faqs.length === 0) {
    return <></>;
  }

  // Referenced variant: Simple design with heading (centered)
  if (slice.variation === "referenced") {
    const subheading = (slice.primary as any).subheading;
    const heading = (slice.primary as any).heading;

    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className={`w-full bg-white ${getSectionPaddingClass()}`}
      >
        <div className={getContainerClass()}>
          {/* Header - Centered */}
          {(subheading || heading) && (
            <div className="mb-12 lg:mb-16 flex flex-col items-center text-center">
              {subheading && (
                <SliceHeader 
                  subheading={subheading} 
                  textColor="text-neutral-800"
                  textAlign="center"
                />
              )}
              {heading && (
                <h2 className="text-neutral-800 text-3xl lg:text-5xl font-bold leading-tight max-w-3xl">
                  {heading}
                </h2>
              )}
            </div>
          )}

          {/* Simple FAQ List - Full container width */}
          <SimpleFaqList faqs={faqs} />
        </div>
      </section>
    );
  }

  // Default variant: Full featured with search & filtering
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full bg-white ${getSectionPaddingClass()}`}
    >
      <div className={getContainerClass()}>
        {/* FAQ Accordion with Search & Filtering - Client Component */}
        <FaqAccordion faqs={faqs} />
      </div>
    </section>
  );
};

export default Faq;
