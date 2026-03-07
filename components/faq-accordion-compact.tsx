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
  noCard?: boolean;
  tight?: boolean;
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
  noCard = false,
  tight = false,
}: FaqAccordionCompactProps) {
  // Filter out empty FAQs
  const validFaqs = faqs.filter((faq) => faq.faq_question && faq.faq_answer);

  if (validFaqs.length === 0) {
    return null;
  }

  return (
    <div className={`${tight ? "space-y-2" : "space-y-4"} ${className}`}>
      <h5 className={`text-neutral-800 ${tight ? "text-xs font-medium uppercase tracking-wider" : "text-sm"}`}>{title}</h5>
      <div className={noCard ? "" : tight ? "bg-neutral-100 p-4 rounded-md border border-[#D9D9D9]" : "bg-neutral-100 p-6 rounded-md border border-[#D9D9D9]"}>
        <Accordion type="single" collapsible className={`w-full ${tight ? "space-y-0" : "space-y-4"}`}>
          {validFaqs.map((faq, index) => {
            const faqId = `faq-compact-${index}`;

            return (
              <AccordionItem
                key={faqId}
                value={faqId}
                className="border-b border-neutral-200 last:border-b-0"
              >
                <AccordionTrigger className={`${tight ? "py-2.5" : "py-4"} text-left hover:no-underline group`}>
                  <span className={`text-neutral-800 flex-1 pr-4 ${tight ? "text-xs" : "text-sm"}`}>
                    {faq.faq_question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className={tight ? "pb-2.5 pt-0" : "pb-4 pt-0"}>
                  <div className="text-neutral-600 text-sm prose prose-sm max-w-none prose-p:text-sm prose-p:my-1 prose-p:leading-relaxed">
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

