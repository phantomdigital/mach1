"use client";

import { Content, RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { Badge } from "@/components/ui/badge";
import { HeroButton } from "@/components/ui/hero-button";
import FaqAccordionCompact from "@/components/faq-accordion-compact";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass } from "@/lib/spacing";

interface SubmittedClientProps {
  slice: Content.SubmittedSlice;
  faqs: Array<{ faq_question: string | null; faq_answer: RichTextField | null }>;
}

export default function SubmittedClient({ slice, faqs }: SubmittedClientProps) {

  // Filter contact buttons from items
  const contactButtons = slice.items.filter(
    (item: any) => item.button_text && item.button_link
  );

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full bg-white ${getMarginTopClass(slice.primary.top_margin)} ${getPaddingTopClass(slice.primary.padding_top)} ${getPaddingBottomClass(slice.primary.padding_bottom)}`}
    >
      <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-24">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div className="space-y-6">
             

              {/* Heading */}
              {slice.primary.heading && (
                <h2 className="text-neutral-800 text-4xl lg:text-5xl">
                  {slice.primary.heading}
                </h2>
              )}

              {/* Description */}
              {slice.primary.description && (
                <div className="text-neutral-600 text-base prose max-w-none prose-p:text-base prose-p:leading-relaxed prose-strong:text-neutral-800 prose-strong:font-semibold prose-a:text-dark-blue prose-a:underline hover:prose-a:text-mach1-green">
                  <PrismicRichText field={slice.primary.description} />
                </div>
              )}
            </div>

            {/* Primary Button */}
            {slice.primary.button_text && slice.primary.button_link && (
              <div>
                <HeroButton asChild size="small">
                  <PrismicNextLink 
                    field={slice.primary.button_link}
                    className="inline-flex w-auto"
                  >
                    {slice.primary.button_text}
                  </PrismicNextLink>
                </HeroButton>
              </div>
            )}
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6 lg:min-h-full">
            {/* Right-side full-height band (matches SolutionsBase behavior) */}
            <div className="bg-[#F0FCFB] pt-6 lg:pt-48 px-6 lg:px-8 pb-6 lg:pb-8 lg:-mt-72 lg:sticky lg:top-[calc(var(--header-height,128px)+1rem)] lg:min-h-[calc(100vh-var(--header-height,128px)-2rem)]">
              <div className="space-y-6">
              {/* Info Card */}
              {slice.primary.info_card_title && slice.primary.info_card_content && (
                <div className="space-y-4">
                  <h5 className="text-neutral-800 text-sm">
                    {slice.primary.info_card_title}
                  </h5>
                  <div className="text-neutral-600 text-sm prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-neutral-800 prose-strong:font-semibold prose-a:text-dark-blue prose-a:underline hover:prose-a:text-mach1-green">
                    <PrismicRichText field={slice.primary.info_card_content} />
                  </div>
                </div>
              )}

              {/* Contact Section (Optional) */}
              {(slice.primary as any).show_contact_section && contactButtons.length > 0 && (
                <div className="space-y-4">
                  {(slice.primary as any).contact_section_title && (
                    <h5 className="text-neutral-800 text-sm">
                      {(slice.primary as any).contact_section_title}
                    </h5>
                  )}
                  {(slice.primary as any).contact_section_heading && (
                    <h3 className="text-neutral-800 text-2xl lg:text-3xl">
                      {(slice.primary as any).contact_section_heading}
                    </h3>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {contactButtons.map((item: any, index: number) => (
                      <HeroButton key={index} asChild>
                        <PrismicNextLink field={item.button_link}>
                          {item.button_text}
                        </PrismicNextLink>
                      </HeroButton>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs Section (inside the grey band) */}
              {(slice.primary as any).show_faqs && faqs.length > 0 && (
                <FaqAccordionCompact
                  faqs={faqs}
                  title={(slice.primary as any).faq_title || "FAQs"}
                  noCard
                />
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

