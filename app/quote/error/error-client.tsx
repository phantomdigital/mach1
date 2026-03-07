"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HeroButton } from "@/components/ui/hero-button";
import { getContainerClass } from "@/lib/spacing";
import { getLocaleFromPathname, addLocaleToPathname } from "@/lib/locale-helpers";

export default function ErrorClient() {
  const router = useRouter();
  const pathname = usePathname();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasQuoteData, setHasQuoteData] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

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

    const params = new URLSearchParams(window.location.search);
    const message = params.get("message");
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }
  }, []);

  const handleRetry = () => {
    const locale = getLocaleFromPathname(pathname);
    const summaryPath = addLocaleToPathname("/quote/summary", locale);
    router.push(summaryPath);
  };

  const handleStartOver = () => {
    sessionStorage.removeItem("steps_flow_data");
    const locale = getLocaleFromPathname(pathname);
    const quotePath = addLocaleToPathname("/quote?step=1", locale);
    router.push(quotePath);
  };

  return (
    <main
      className="w-full min-h-screen flex flex-col bg-white"
      style={{ paddingTop: "var(--header-height, 128px)" }}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className={`${getContainerClass()} py-16 lg:py-24 max-w-2xl mx-auto text-center`}>
          {/* Error Icon - compact */}
          <div className="flex justify-center mb-6">
            <Image
              src="/icons/error.svg"
              alt="Error"
              width={120}
              height={101}
              className="w-20 lg:w-24 h-auto"
              priority
            />
          </div>

          {/* Text hierarchy: label → heading → description */}
          <div className="space-y-3 mb-6">
            <p className="text-neutral-500 text-[11px] font-semibold uppercase tracking-widest">
              Quote Error
            </p>
            <h1 className="text-neutral-800 text-2xl lg:text-4xl font-bold leading-tight">
              Something went wrong
            </h1>
          </div>

          <p className="text-neutral-600 text-sm lg:text-base leading-relaxed max-w-sm mx-auto mb-8">
            {errorMessage || "We encountered an issue processing your quote request. You can try submitting again or start over."}
          </p>

          {/* Action Buttons - header style (size="small") */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {hasQuoteData && (
              <HeroButton asChild size="small">
                <button onClick={handleRetry} className="cursor-pointer w-full sm:w-auto">
                  Try Again
                </button>
              </HeroButton>
            )}
            <HeroButton asChild size="small">
              <button onClick={handleStartOver} className="cursor-pointer w-full sm:w-auto">
                Start Over
              </button>
            </HeroButton>
            <HeroButton asChild size="small">
              <Link href="/">Back to Home</Link>
            </HeroButton>
          </div>
        </div>
      </div>
    </main>
  );
}
