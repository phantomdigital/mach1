"use client";

import { Content, RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { HeroButton } from "@/components/ui/hero-button";
import FaqAccordionCompact from "@/components/faq-accordion-compact";

interface SubmittedClientProps {
  slice: Content.SubmittedSlice;
  faqs: Array<{ faq_question: string | null; faq_answer: RichTextField | null }>;
  /** Spacing utils (margin, padding) - applied ONLY to the left column wrapper */
  spacingClass?: string;
}

export default function SubmittedClient({
  slice,
  faqs,
  spacingClass = "mt-30 lg:mt-48 pt-16 lg:pt-24 pb-16 lg:pb-24",
}: SubmittedClientProps) {
  const contactButtons = slice.items.filter(
    (item): item is typeof item & { button_text: string; button_link: NonNullable<typeof item.button_link> } =>
      !!item.button_text && !!item.button_link
  );

  const hasInfoCard = slice.primary.info_card_title && slice.primary.info_card_content;
  const hasContactSection = slice.primary.show_contact_section && contactButtons.length > 0;
  const hasFaqs = slice.primary.show_faqs && faqs.length > 0;

  return (
    <div
      className="w-full"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16">
        {/* Left Column - spacing utils affect this div only */}
        <div className={spacingClass}>
          <div className="space-y-8">
            <div className="space-y-6">
              {slice.primary.heading && (
                <h2 className="text-neutral-800 text-4xl lg:text-5xl">
                  {slice.primary.heading}
                </h2>
              )}
              {slice.primary.description && (
                <div className="text-neutral-600 text-base prose max-w-none prose-p:text-base prose-p:leading-relaxed prose-strong:text-neutral-800 prose-strong:font-semibold prose-a:text-dark-blue prose-a:underline hover:prose-a:text-mach1-green">
                  <PrismicRichText field={slice.primary.description} />
                </div>
              )}
            </div>
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
        </div>

        {/* Right Column - Teal sidebar (full width on mobile, matches Tracking/SolutionsBase on desktop) */}
        <div
          className="order-1 lg:col-start-2 lg:row-start-1 -mx-4 lg:mx-0 pt-6 lg:pt-16 px-6 lg:px-8 pb-6 lg:pb-8 flex flex-col justify-center gap-4 lg:sticky lg:top-[calc(var(--header-height,128px)+1rem)]"
          style={{ backgroundColor: "#F0FCFB" }}
        >
          {/* Info Card */}
          {hasInfoCard && (
            <div className="space-y-1">
              <p className="text-xs text-neutral-500 uppercase tracking-wide">
                {slice.primary.info_card_title}
              </p>
              <div className="text-neutral-600 text-sm prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-neutral-800 prose-strong:font-semibold prose-a:text-dark-blue prose-a:underline hover:prose-a:text-mach1-green">
                <PrismicRichText field={slice.primary.info_card_content!} />
              </div>
            </div>
          )}

          {(hasInfoCard && (hasContactSection || hasFaqs)) && (
            <div className="border-t border-neutral-300 pt-4 mt-4" />
          )}

          {/* Contact Section */}
          {hasContactSection && (
            <div className="space-y-1">
              {slice.primary.contact_section_title && (
                <p className="text-xs text-neutral-500 uppercase tracking-wide">
                  {slice.primary.contact_section_title}
                </p>
              )}
              <p className="text-neutral-800 font-medium text-sm">
                {slice.primary.contact_section_heading || "Get in touch"}
              </p>
              <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-2">
                {contactButtons.map((item, index) => (
                  <HeroButton key={index} asChild size="small">
                    <PrismicNextLink field={item.button_link}>
                      {item.button_text}
                    </PrismicNextLink>
                  </HeroButton>
                ))}
              </div>
            </div>
          )}

          {(hasContactSection && hasFaqs) && (
            <div className="border-t border-neutral-300 pt-4 mt-4" />
          )}

          {/* FAQs */}
          {hasFaqs && (
            <FaqAccordionCompact
              faqs={faqs}
              title={slice.primary.faq_title || "FAQs"}
              noCard
              tight
            />
          )}
        </div>
      </div>
    </div>
  );
}
