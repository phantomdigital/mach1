"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { RichTextField } from "@prismicio/client";
import StepsSummary from "@/slices/Steps/steps-summary";
import { getContainerClass, getPaddingBottomClass } from "@/lib/spacing";

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
}

export default function SummaryClient({
  heading = "We have received your request.",
  description,
  contactEmail = "",
  contactTimeframe = "",
  faqs = [],
}: SummaryClientProps = {}) {
  const router = useRouter();
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
      // No data - redirect back to start after brief delay
      console.warn("No quote data found - redirecting to home");
      setTimeout(() => router.push("/"), 1000);
      return;
    }

    try {
      const data = JSON.parse(stored);
      
      // Validate data structure - ensure we have the required fields
      if (!data.formData || Object.keys(data.formData).length === 0) {
        console.warn("Invalid quote data - redirecting to home");
        setTimeout(() => router.push("/"), 1000);
        return;
      }
      
      setSummaryData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error parsing summary data:", error);
      setTimeout(() => router.push("/"), 1000);
    }
  }, [router]);

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
    // Clear session storage and redirect to home
    sessionStorage.removeItem("steps_flow_data");
    router.push("/");
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
              <p className="text-neutral-800 font-medium mb-2">No quote data found</p>
              <p className="text-neutral-600 text-sm">Redirecting you to the home page...</p>
            </>
          ) : (
            <p className="text-neutral-600">Loading your quote summary...</p>
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
          />
        </div>
      </section>
    </div>
  );
}
