"use client";

import Link from "next/link";
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
  /** Spacing utils (margin, padding) - applied ONLY to the left column wrapper */
  spacingClass?: string;
}

export default function TrackingClient({
  urlPrefix,
  placeholderText,
  heading,
  subheading,
  description,
  faqs,
  spacingClass = "mt-30 lg:mt-48 pt-16 lg:pt-24 pb-16 lg:pb-24",
}: TrackingClientProps) {

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16">
        {/* Left Column - spacing utils affect this div only */}
        <div className={spacingClass}>
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
        </div>

        {/* Right Column - Teal sidebar (full width on mobile, matches SolutionsBase on desktop) */}
        <div className="order-1 lg:col-start-2 lg:row-start-1 -mx-4 lg:mx-0 pt-6 lg:pt-16 px-6 lg:px-8 pb-6 lg:pb-8 space-y-4 lg:sticky lg:top-[calc(var(--header-height,128px)+1rem)]" style={{ backgroundColor: "#F0FCFB" }}>
          {/* FAQs */}
          {faqs.length > 0 && (
            <FaqAccordionCompact faqs={faqs} title="FAQs" noCard tight />
          )}

          {faqs.length > 0 && (
            <div className="border-t border-neutral-300 pt-4 mt-4" />
          )}

          {/* Get Help - SolutionsBase contact style */}
          <div className="space-y-1">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">HAVE A CHAT</p>
            <p className="text-neutral-800 font-medium text-sm">Get help</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-2">
            <HeroButton asChild size="small">
              <Link href="/contact">CONTACT US</Link>
            </HeroButton>
            <HeroButton asChild size="small">
              <Link href="/contact">LIVE CHAT</Link>
            </HeroButton>
          </div>
        </div>
      </div>
    </div>
  );
}

