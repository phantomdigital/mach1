import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { getContainerClass, getSectionPaddingClass } from "@/lib/spacing";
import { createClient } from "@/prismicio";
import { SliceHeader } from "@/components/slice-header";
import FaqAccordion from "./faq-accordion";
import SimpleFaqList from "./simple-faq-list";
import type { FaqSliceDefaultItem } from "@/types.generated";

/**
 * Props for `Faq`.
 */
export type FaqProps = SliceComponentProps<Content.FaqSlice>;

// No type guards needed - we'll use direct type checks

/**
 * Component for "Faq" Slices.
 */
const Faq = async ({ slice }: FaqProps): Promise<React.ReactElement> => {
  const faqLimit = slice.primary.faq_limit || 10;
  const isReferenced = slice.variation !== "default";

  // Get FAQs based on variant
  let faqs: FaqSliceDefaultItem[] = [];
  
  if (!isReferenced) {
    // Default variant: Get FAQs from slice items
    faqs = slice.items.filter((item): item is FaqSliceDefaultItem => Boolean(item.question));
  } else {
    // Referenced variant: Pull FAQs from another page
    const primary = slice.primary as Content.FaqSliceReferencedPrimary;
    const faqPage = primary.faq_page;
    const filterCategory = primary.filter_by_category;

    if (faqPage && "id" in faqPage && faqPage.id) {
      try {
        const client = createClient();
        const referencedPage = await client.getByID(faqPage.id);

        // Check if page has slices (only Page documents have slices)
        if ("slices" in referencedPage.data && Array.isArray(referencedPage.data.slices)) {
          const pageSlices = referencedPage.data.slices;
          
          // Find FAQ slices
          const faqSlices = pageSlices.filter(
            (s): boolean => s.slice_type === "faq" && s.variation === "default"
          );

          // Collect all FAQ items from all FAQ slices
          const allFaqs: FaqSliceDefaultItem[] = [];
          faqSlices.forEach((faqSlice) => {
            if ("items" in faqSlice && Array.isArray(faqSlice.items)) {
              // Type assert the items to FaqSliceDefaultItem
              faqSlice.items.forEach((item) => {
                if ("question" in item && item.question) {
                  allFaqs.push(item as FaqSliceDefaultItem);
                }
              });
            }
          });

          // Filter by category if specified
          faqs = allFaqs.filter(item => {
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
  if (isReferenced) {
    const primary = slice.primary as Content.FaqSliceReferencedPrimary;
    const subheading = primary.subheading;
    const heading = primary.heading;

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
                  variant="badge"
                  badgeVariant="green"
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
