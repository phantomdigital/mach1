"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { HeroButton } from "@/components/ui/hero-button";
import { TrackingWidget } from "./tracking-widget";
import type { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

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
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

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
          {faqs.length > 0 && (
            <div className="space-y-4">
              <h5 className="text-neutral-800 text-sm">FAQs</h5>
              <div className="bg-neutral-100 p-6 rounded-md border border-[#D9D9D9]">
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-neutral-200 last:border-b-0"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-start justify-between gap-4 py-4 text-left group"
                      >
                        <span className="text-neutral-800 text-sm flex-1">
                          {faq.faq_question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-neutral-800 transition-transform duration-300 flex-shrink-0 ${
                            expandedFaq === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          expandedFaq === index ? "max-h-96 pb-4" : "max-h-0"
                        }`}
                      >
                        <div className="text-neutral-600 text-sm [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-dark-blue [&_a]:transition-colors hover:[&_a]:text-dark-blue/80 [&_strong]:font-semibold [&_em]:italic [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1">
                          <PrismicRichText field={faq.faq_answer} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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

