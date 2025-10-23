"use client";

import { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  faq_question: string | null;
  faq_answer: RichTextField | null;
}

interface FaqAccordionCompactProps {
  faqs: FaqItem[];
  title?: string;
  className?: string;
}

/**
 * Compact FAQ Accordion Component
 * Uses Radix UI Accordion for consistent behavior across the app
 * Designed for sidebar/compact layouts (smaller text, tighter spacing)
 */
export default function FaqAccordionCompact({
  faqs,
  title = "FAQs",
  className = "",
}: FaqAccordionCompactProps) {
  // Filter out empty FAQs
  const validFaqs = faqs.filter((faq) => faq.faq_question && faq.faq_answer);

  if (validFaqs.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h5 className="text-neutral-800 text-sm">{title}</h5>
      <div className="bg-neutral-100 p-6 rounded-md border border-[#D9D9D9]">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {validFaqs.map((faq, index) => {
            const faqId = `faq-compact-${index}`;

            return (
              <AccordionItem
                key={faqId}
                value={faqId}
                className="border-b border-neutral-200 last:border-b-0"
              >
                <AccordionTrigger className="py-4 text-left hover:no-underline group">
                  <span className="text-neutral-800 text-sm flex-1 pr-4">
                    {faq.faq_question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-0">
                  <div className="text-neutral-600">
                    <PrismicRichText field={faq.faq_answer} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

