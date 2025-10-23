"use client";

import { HeroButton } from "@/components/ui/hero-button";
import { TrackingWidget } from "./tracking-widget";
import type { RichTextField } from "@prismicio/client";
import FaqAccordionCompact from "@/components/faq-accordion-compact";

interface FAQ {
  faq_question: string | null;
  faq_answer: RichTextField | null;
}

interface TrackingClientProps {
  urlPrefix: string;
  placeholderText?: string;
  heading: string | null;
  subheading: string | null;
  description: string | null;
  faqs: FAQ[];
}

export default function TrackingClient({
  urlPrefix,
  placeholderText,
  heading,
  subheading,
  description,
  faqs,
}: TrackingClientProps) {

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-40">
        {/* Left Column - Tracking Widget */}
        <div className="space-y-8">
          <div className="space-y-6">
            {subheading && (
              <h5 className="text-neutral-800 text-sm">{subheading}</h5>
            )}
            {heading && (
              <h2 className="text-neutral-800 text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-neutral-600 text-base">{description}</p>
            )}
          </div>

          {/* Tracking Widget */}
          <div className="w-full">
            <TrackingWidget
              urlPrefix={urlPrefix}
              placeholderText={placeholderText}
            />
          </div>
        </div>

        {/* Right Column - FAQs and Help */}
        <div className="space-y-6">
          {/* FAQs */}
          {faqs.length > 0 && <FaqAccordionCompact faqs={faqs} title="FAQs" />}

          {/* Get Help */}
          <div className="space-y-4">
            <h5 className="text-neutral-800 text-sm">HAVE A CHAT</h5>
            <div className="bg-neutral-100 p-6 rounded-md border border-[#D9D9D9]">
              <h3 className="text-neutral-800 text-2xl lg:text-3xl mb-6">
                Get help
              </h3>
              <div className="flex flex-wrap gap-3">
                <HeroButton asChild>
                  <button className="cursor-pointer">CONTACT US</button>
                </HeroButton>
                <HeroButton asChild>
                  <button className="cursor-pointer">LIVE CHAT</button>
                </HeroButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

