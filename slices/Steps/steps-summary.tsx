"use client";

import { useState } from "react";
import { ChevronDown, Mail, MessageCircle } from "lucide-react";
import { HeroButton } from "@/components/ui/hero-button";
import { Badge } from "@/components/ui/badge";
import type { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

interface FaqItem {
  faq_question: string | null;
  faq_answer: RichTextField | null;
}

interface StepsSummaryProps {
  heading: string;
  description: RichTextField | null | undefined;
  contactEmail: string;
  contactTimeframe: string;
  selectedCard?: string;
  formData: Record<string, string> | null;
  faqs?: FaqItem[];
  onReset: () => void;
}

export default function StepsSummary({
  heading,
  description,
  contactEmail,
  contactTimeframe,
  selectedCard,
  formData,
  faqs = [],
  onReset,
}: StepsSummaryProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Parse packages from form data
  let packages = [];
  try {
    packages = formData?.packages ? JSON.parse(formData.packages) : [];
  } catch (error) {
    console.error('Error parsing packages:', error);
    packages = [];
  }

  // Format field name for display
  const formatFieldName = (name: string) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Format service type (remove underscores, capitalize first letter)
  const formatServiceType = (type: string) => {
    const withoutUnderscores = type.replace(/_/g, ' ');
    return withoutUnderscores.charAt(0).toUpperCase() + withoutUnderscores.slice(1);
  };

  // Replace placeholders like {email}, {origin}, {destination} with actual form data
  // For email, wrap in special markers so we can make it bold
  const replacePlaceholders = (text: string): string => {
    if (!text || !formData) return text;
    
    let result = text;
    
    // Debug: log formData to see what fields we have
    if (process.env.NODE_ENV === 'development') {
      console.log('FormData available for placeholders:', Object.keys(formData));
    }
    
    // Replace all form field placeholders
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'packages' && value) {
        const placeholder = new RegExp(`\\{${key}\\}`, 'gi');
        const beforeReplace = result;
        
        // Special handling for email - wrap in markers for bold styling
        if (key.toLowerCase() === 'email') {
          result = result.replace(placeholder, `**${value}**`);
        } else {
          result = result.replace(placeholder, value);
        }
        
        // Debug: log replacements
        if (process.env.NODE_ENV === 'development' && beforeReplace !== result) {
          console.log(`Replaced {${key}} with:`, value);
        }
      }
    });
    
    // Replace service type placeholder
    if (selectedCard) {
      result = result.replace(/\{serviceType\}/gi, formatServiceType(selectedCard));
    }
    
    return result;
  };

  // Process RichText field to replace placeholders and mark email for bold
  const processedDescription = description?.map((block: any) => {
    // Handle all text-containing block types
    if (block.text !== undefined) {
      const replacedText = replacePlaceholders(block.text);
      
      // Split text by ** markers and create strong spans for bold text
      const textParts = replacedText.split(/(\*\*[^*]+\*\*)/g);
      
      if (textParts.length > 1) {
        // Has bold markers - create spans
        const newSpans = textParts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return {
              type: 'strong',
              start: textParts.slice(0, index).join('').length,
              end: textParts.slice(0, index).join('').length + part.length - 4,
              data: {}
            };
          }
          return null;
        }).filter(Boolean);
        
        return {
          ...block,
          text: replacedText.replace(/\*\*/g, ''), // Remove markers from text
          spans: [...(block.spans || []), ...newSpans]
        };
      }
      
      return {
        ...block,
        text: replacedText
      };
    }
    return block;
  }) as RichTextField;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-40">
        {/* Left Column - Summary */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="green">Quote Received</Badge>
            </div>

            <h2 className="text-neutral-800 text-4xl lg:text-5xl">
              {heading}
            </h2>
            <div className="text-neutral-600 text-base">
              <PrismicRichText field={processedDescription || description} />
            </div>
          </div>

          {/* Go to Home Button */}
          <div>
            <HeroButton asChild>
              <button onClick={onReset} className="cursor-pointer">
                GO TO HOME
              </button>
            </HeroButton>
          </div>

          {/* Shipment Details */}
          {formData && Object.keys(formData).length > 0 && (
            <div className="mt-12 space-y-4">
              <h5 className="text-neutral-800 text-sm mb-4">SHIPMENT DETAILS</h5>
              
              <div className="bg-neutral-100 p-6 rounded-md border border-[#D9D9D9]">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {/* Selected Service Type */}
                  {selectedCard && (
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Service Type</p>
                      <p className="text-neutral-800 font-medium text-sm">{formatServiceType(selectedCard)}</p>
                    </div>
                  )}
                  
                  {/* Form Fields */}
                  {formData && Object.entries(formData).filter(([key]) => key !== 'packages').map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-neutral-500 mb-1">{formatFieldName(key)}</p>
                      <p className="text-neutral-800 text-sm">{value || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Package Details */}
          {packages.length > 0 && (
            <div className="mt-8 space-y-4">
              <h5 className="text-neutral-800 text-sm mb-4">PACKAGE DETAILS</h5>
              
              <div className="bg-neutral-100 p-6 rounded-md border border-[#D9D9D9] space-y-4">
                {packages.map((pkg: any, index: number) => (
                  <div key={index} className=" py-3">
                    {/* Package Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <h6 className="font-medium text-neutral-800 text-sm">Package {index + 1}</h6>
                      {pkg.description && (
                        <span className="text-xs text-neutral-500">• {pkg.description}</span>
                      )}
                    </div>
                    
                    {/* Addresses */}
                    {(pkg.origin || pkg.destination) && (
                      <div className="flex items-center gap-6 mb-3 text-xs">
                        {pkg.origin && (
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-500">From:</span>
                            <span className="text-neutral-800 font-medium">{pkg.origin}</span>
                          </div>
                        )}
                        {pkg.destination && (
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-500">To:</span>
                            <span className="text-neutral-800 font-medium">{pkg.destination}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Package Specs */}
                    <div className="flex items-center gap-6 text-xs">
                      {pkg.weight && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500">Weight:</span>
                          <span className="text-neutral-800 font-medium">{pkg.weight} {pkg.weightUnit}</span>
                        </div>
                      )}
                      {pkg.quantity && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500">Qty:</span>
                          <span className="text-neutral-800 font-medium">{pkg.quantity}</span>
                        </div>
                      )}
                      {pkg.length && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500">L:</span>
                          <span className="text-neutral-800 font-medium">{pkg.length}{pkg.dimensionUnit}</span>
                        </div>
                      )}
                      {pkg.width && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500">W:</span>
                          <span className="text-neutral-800 font-medium">{pkg.width}{pkg.dimensionUnit}</span>
                        </div>
                      )}
                      {pkg.height && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500">H:</span>
                          <span className="text-neutral-800 font-medium">{pkg.height}{pkg.dimensionUnit}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - FAQs and Help */}
        <div className="space-y-6">
          {/* FAQs */}
          {faqs.length > 0 && (
            <div className="space-y-4">
              <h5 className="text-neutral-800 text-sm">FAQs</h5>
              <div className="bg-neutral-100 p-6 rounded-md border border-[#D9D9D9]">
                <div className="space-y-4">
                  {faqs
                    .filter(faq => faq.faq_question && faq.faq_answer)
                    .map((faq, index) => (
                      <div key={index} className="border-b border-neutral-200 last:border-b-0">
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
                            expandedFaq === index
                              ? "max-h-96 pb-4"
                              : "max-h-0"
                          }`}
                        >
                          <div className="text-neutral-600 text-sm prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-neutral-800 prose-strong:font-semibold prose-a:text-dark-blue prose-a:underline hover:prose-a:text-mach1-green">
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
              <h3 className="text-neutral-800 text-2xl lg:text-3xl mb-6">Get help</h3>
              <div className="flex flex-wrap gap-3">
                <HeroButton asChild>
                  <button className="cursor-pointer">
                    CONTACT US
                  </button>
                </HeroButton>
                <HeroButton asChild>
                  <button className="cursor-pointer">
                    LIVE CHAT
                  </button>
                </HeroButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

