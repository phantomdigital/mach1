import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { getContainerClass, getSectionPaddingClass } from "@/lib/spacing";
import FaqAccordion from "./faq-accordion";

/**
 * Props for `Faq`.
 */
export type FaqProps = SliceComponentProps<Content.FaqSlice>;

/**
 * Component for "Faq" Slices.
 */
const Faq = ({ slice }: FaqProps): React.ReactElement => {
  // Filter out FAQs with empty questions
  const faqs = slice.items.filter(item => item.question);

  if (faqs.length === 0) {
    return <></>;
  }

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
