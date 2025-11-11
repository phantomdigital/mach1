"use client";

import { PrismicRichText } from "@prismicio/react";
import type { Content } from "@prismicio/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SimpleFaqListProps {
  faqs: Content.FaqSliceDefaultItem[];
}

/**
 * Simple FAQ list component for Referenced variant
 * No search, no category filtering, just a clean list of FAQs
 */
export default function SimpleFaqList({ faqs }: SimpleFaqListProps) {
  if (faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">No FAQs available.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => {
          const faqId = `simple-faq-${index}`;
          
          return (
            <AccordionItem 
              key={faqId} 
              value={faqId}
              className="border-b border-neutral-200 last:border-b-0"
            >
              <AccordionTrigger className="py-6 text-left hover:no-underline group">
                <span className="text-neutral-800 group-hover:text-dark-blue text-base lg:text-lg font-semibold pr-4 transition-colors">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-0">
                <div className="text-neutral-600 text-base lg:text-lg prose max-w-none prose-p:leading-relaxed prose-strong:text-neutral-800 prose-strong:font-semibold prose-a:text-dark-blue prose-a:underline hover:prose-a:text-mach1-green">
                  <PrismicRichText field={faq.answer} />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

