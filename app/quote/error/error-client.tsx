"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { HeroButton } from "@/components/ui/hero-button";

export default function ErrorClient() {
  const router = useRouter();
  const pathname = usePathname();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasQuoteData, setHasQuoteData] = useState(false);

  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo(0, 0);

    // Check if we have stored quote data to allow retry
    const stored = sessionStorage.getItem("steps_flow_data");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.formData && Object.keys(data.formData).length > 0) {
          setHasQuoteData(true);
        }
      } catch (error) {
        console.error("Error parsing quote data:", error);
      }
    }

    // Get error message from URL params (optional)
    const params = new URLSearchParams(window.location.search);
    const message = params.get("message");
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }
  }, []);

  const handleRetry = () => {
    // Preserve locale when navigating to summary
    const locale = getLocaleFromPathname(pathname);
    const summaryPath = addLocaleToPathname("/quote/summary", locale);
    router.push(summaryPath);
  };

  const handleStartOver = () => {
    // Clear session storage and go back to step 1, preserving locale
    sessionStorage.removeItem("steps_flow_data");
    const locale = getLocaleFromPathname(pathname);
    const quotePath = addLocaleToPathname("/quote?step=1", locale);
    router.push(quotePath);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="w-full bg-white pt-60 pb-16 lg:pt-82 lg:pb-48">
        <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Content Card */}
            <div className="bg-neutral-100 p-8 lg:p-12 rounded-md border border-[#D9D9D9]">
              {/* Error Heading */}
              <h1 className="text-neutral-800 text-3xl lg:text-4xl mb-4">
                Something went wrong
              </h1>

              {/* Error Message */}
              <p className="text-neutral-600 text-base mb-8">
                {errorMessage || "We encountered an issue processing your quote request. You can try submitting again or contact us directly."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {hasQuoteData && (
                  <HeroButton asChild>
                    <button onClick={handleRetry} className="cursor-pointer flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      <span>TRY AGAIN</span>
                    </button>
                  </HeroButton>
                )}
                
                <HeroButton asChild>
                  <button onClick={handleStartOver} className="cursor-pointer">
                    START OVER
                  </button>
                </HeroButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

