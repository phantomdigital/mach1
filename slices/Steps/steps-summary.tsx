"use client";

import { useState } from "react";
import { ChevronDown, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

interface StepsSummaryProps {
  heading: string;
  description: RichTextField | null | undefined;
  contactEmail: string;
  contactTimeframe: string;
  onReset: () => void;
}

const faqs = [
  {
    question: "If I'm not home, what will the driver do?",
    answer:
      "Our driver will attempt to contact you using the phone number provided. If we cannot reach you, we will leave a notification and reschedule delivery.",
  },
  {
    question: "How long do I wait to enquire about a late or missing item?",
    answer:
      "Please wait until the end of the estimated delivery window. If your item hasn't arrived by then, contact our support team immediately.",
  },
  {
    question: "How long do I wait to enquire about a late or missing item?",
    answer:
      "We recommend waiting 24-48 hours after the expected delivery date before submitting an inquiry about a late shipment.",
  },
  {
    question: "How long do I wait to enquire about a late or missing item?",
    answer:
      "Most inquiries are resolved within 1-2 business days. Our team will keep you updated throughout the investigation process.",
  },
  {
    question: "How long do I wait to enquire about a late or missing item?",
    answer:
      "You can track your shipment in real-time using the tracking number provided in your confirmation email.",
  },
  {
    question: "How long do I wait to enquire about a late or missing item?",
    answer:
      "Yes, you can modify delivery details up to 24 hours before the scheduled delivery time by contacting our support team.",
  },
];

export default function StepsSummary({
  heading,
  description,
  contactEmail,
  contactTimeframe,
  onReset,
}: StepsSummaryProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="w-full max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Column - Summary */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h5 className="text-neutral-800 text-sm">SUMMARY</h5>
            <h2 className="text-neutral-800 text-4xl lg:text-5xl">
              {heading}
            </h2>
            <div className="text-neutral-600 text-base">
              <PrismicRichText field={description} />
            </div>
          </div>

          {/* Go to Home Button */}
          <div>
            <Button onClick={onReset} size="lg" className="px-8">
              GO TO HOME
            </Button>
          </div>

          {/* Quotation Request Summary */}
          <div className="mt-12 space-y-4">
            <h5 className="text-neutral-800 text-sm mb-6">
              QUOTATION REQUEST SUMMARY:
            </h5>
            
            <div className="border-b border-neutral-200 pb-4">
              <table className="w-full text-xs" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                <thead>
                  <tr className="text-neutral-500">
                    <th className="text-left font-medium pb-2">CODE</th>
                    <th className="text-left font-medium pb-2">DESCRIPTION</th>
                    <th className="text-left font-medium pb-2">QTY</th>
                    <th className="text-left font-medium pb-2">PAL</th>
                    <th className="text-left font-medium pb-2">WEIGHT</th>
                    <th className="text-left font-medium pb-2">SPACE</th>
                    <th className="text-left font-medium pb-2">LENGTH</th>
                    <th className="text-left font-medium pb-2">WIDTH</th>
                    <th className="text-left font-medium pb-2">HEIGHT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-neutral-800">
                    <td className="py-2">MACH-001</td>
                    <td className="py-2">MSC PLUTON</td>
                    <td className="py-2">N/A</td>
                    <td className="py-2">1</td>
                    <td className="py-2">99</td>
                    <td className="py-2">N/A</td>
                    <td className="py-2">9.9</td>
                    <td className="py-2">9.9</td>
                    <td className="py-2">N/A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - FAQs and Help */}
        <div className="space-y-12">
          {/* FAQs */}
          <div className="space-y-6">
            <h3 className="text-neutral-800 text-2xl lg:text-3xl">FAQs</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-neutral-200">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-start justify-between gap-4 py-4 text-left group"
                  >
                    <span className="text-neutral-800 text-sm flex-1">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-800 transition-transform duration-300 flex-shrink-0 ${
                        expandedFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedFaq === index
                        ? "max-h-96 pb-4"
                        : "max-h-0"
                    }`}
                  >
                    <p className="text-neutral-600 text-sm">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Get Help */}
          <div className="space-y-6">
            <p className="text-neutral-500 text-xs">NEED HELP?</p>
            <h3 className="text-neutral-800 text-2xl lg:text-3xl">Get help</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="default" size="lg" className="gap-2">
                <Mail className="w-4 h-4" />
                CONTACT US
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                LIVE CHAT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

