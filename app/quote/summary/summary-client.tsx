"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { RichTextField } from "@prismicio/client";
import StepsSummary from "@/slices/Steps/steps-summary";
import { getContainerClass, getPaddingBottomClass } from "@/lib/spacing";
import { getLocaleFromPathname, addLocaleToPathname } from "@/lib/locale-helpers";

interface SummaryData {
  selectedCard?: string;
  formData: Record<string, string>;
}

interface SummaryClientProps {
  heading?: string;
  description?: RichTextField;
  contactEmail?: string;
  contactTimeframe?: string;
  faqs?: Array<{ faq_question: string | null; faq_answer: RichTextField | null }>;
  badgeText?: string;
  goToHomeButton?: string;
  detailsHeading?: string;
  serviceTypeLabel?: string;
  packageDetailsHeading?: string;
  packageLabel?: string;
  originLabel?: string;
  destinationLabel?: string;
  weightLabel?: string;
  quantityLabel?: string;
  lengthLabel?: string;
  widthLabel?: string;
  heightLabel?: string;
  faqsTitle?: string;
  haveAChatHeading?: string;
  getHelpHeading?: string;
  contactUsButton?: string;
  liveChatButton?: string;
  loadingMessage?: string;
  noDataMessage?: string;
  redirectingMessage?: string;
}

export default function SummaryClient({
  heading = "We have received your request.",
  description,
  contactEmail = "",
  contactTimeframe = "",
  faqs = [],
  badgeText = "Quote Received",
  goToHomeButton = "GO TO HOME",
  detailsHeading = "DETAILS",
  serviceTypeLabel = "Service Type",
  packageDetailsHeading = "PACKAGE DETAILS",
  packageLabel = "Package",
  originLabel = "Origin",
  destinationLabel = "Destination",
  weightLabel = "Weight",
  quantityLabel = "Quantity",
  lengthLabel = "Length",
  widthLabel = "Width",
  heightLabel = "Height",
  faqsTitle = "FAQs",
  haveAChatHeading = "HAVE A CHAT",
  getHelpHeading = "Get help",
  contactUsButton = "CONTACT US",
  liveChatButton = "LIVE CHAT",
  loadingMessage = "Loading your quote summary...",
  noDataMessage = "No quote data found",
  redirectingMessage = "Redirecting you to the home page...",
}: SummaryClientProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default description if not provided
  const defaultDescription = [
    {
      type: "paragraph",
      text: "One of our logistics specialists will contact you at {email} within 24 hours to discuss your requirements. We're looking forward to learning how we can help optimise your supply chain.",
      spans: []
    }
  ] as RichTextField;

  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo(0, 0);

    // Get data from session storage
    const stored = sessionStorage.getItem("steps_flow_data");
    
    if (!stored) {
      // No data - redirect back to start after brief delay, preserving locale
      console.warn("No quote data found - redirecting to home");
      const locale = getLocaleFromPathname(pathname);
      const homePath = locale === getLocaleFromPathname("/") ? "/" : `/${locale}`;
      setTimeout(() => router.push(homePath), 1000);
      return;
    }

    try {
      const data = JSON.parse(stored);
      
      // Validate data structure - ensure we have the required fields
      if (!data.formData || Object.keys(data.formData).length === 0) {
        console.warn("Invalid quote data - redirecting to home");
        const locale = getLocaleFromPathname(pathname);
        const homePath = locale === getLocaleFromPathname("/") ? "/" : `/${locale}`;
        setTimeout(() => router.push(homePath), 1000);
        return;
      }
      
      setSummaryData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error parsing summary data:", error);
      const locale = getLocaleFromPathname(pathname);
      const homePath = locale === getLocaleFromPathname("/") ? "/" : `/${locale}`;
      setTimeout(() => router.push(homePath), 1000);
    }
  }, [router, pathname]);

  // Prevent scrolling during loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  const handleReset = () => {
    // Clear session storage and redirect to home, preserving locale
    sessionStorage.removeItem("steps_flow_data");
    const locale = getLocaleFromPathname(pathname);
    const homePath = locale === getLocaleFromPathname("/") ? "/" : `/${locale}`;
    router.push(homePath);
  };

  if (isLoading) {
    // Check if we're redirecting due to missing data
    const hasNoData = typeof window !== 'undefined' && !sessionStorage.getItem("steps_flow_data");
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-4 pt-52">
          <Loader2 className="w-12 h-12 text-dark-blue animate-spin mx-auto mb-4" />
          {hasNoData ? (
            <>
              <p className="text-neutral-800 font-medium mb-2">{noDataMessage}</p>
              <p className="text-neutral-600 text-sm">{redirectingMessage}</p>
            </>
          ) : (
            <p className="text-neutral-600">{loadingMessage}</p>
          )}
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* No header/topper - standalone page */}
      <section className={`w-full bg-white pt-60 lg:pt-82 ${getPaddingBottomClass("large")}`}>
        <div className={getContainerClass()}>
          <StepsSummary
            heading={heading}
            description={description || defaultDescription}
            contactEmail={contactEmail}
            contactTimeframe={contactTimeframe}
            selectedCard={summaryData.selectedCard}
            formData={summaryData.formData}
            faqs={faqs}
            onReset={handleReset}
            badgeText={badgeText}
            goToHomeButton={goToHomeButton}
            detailsHeading={detailsHeading}
            serviceTypeLabel={serviceTypeLabel}
            packageDetailsHeading={packageDetailsHeading}
            packageLabel={packageLabel}
            originLabel={originLabel}
            destinationLabel={destinationLabel}
            weightLabel={weightLabel}
            quantityLabel={quantityLabel}
            lengthLabel={lengthLabel}
            widthLabel={widthLabel}
            heightLabel={heightLabel}
            faqsTitle={faqsTitle}
            haveAChatHeading={haveAChatHeading}
            getHelpHeading={getHelpHeading}
            contactUsButton={contactUsButton}
            liveChatButton={liveChatButton}
          />
        </div>
      </section>
    </div>
  );
}
