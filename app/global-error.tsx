"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HeroButton } from "@/components/ui/hero-button";
import { getContainerClass } from "@/lib/spacing";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <main className={`w-full min-h-screen flex items-center bg-white`}>
          <div className={`${getContainerClass()} py-16 lg:py-24`}>
            <div className="max-w-3xl mx-auto text-center">
              {/* Error Badge */}
              <div className="mb-8">
                <h5 className="inline-block text-sky-100 text-xs font-bold tracking-wider uppercase px-3 py-1.5 bg-mach1-green rounded-2xl">
                  System Error
                </h5>
              </div>

              {/* Main Heading */}
              <h1 className="text-neutral-800 text-4xl lg:text-6xl font-bold mb-6">
                Something went wrong
              </h1>

              {/* Description */}
              <p className="text-neutral-600 text-lg lg:text-xl mb-12 leading-relaxed">
                We&apos;re experiencing technical difficulties. This may be a temporary issue. Please try again in a few moments or contact us if the problem persists.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <HeroButton asChild>
                  <button onClick={reset} className="cursor-pointer">
                    TRY AGAIN
                  </button>
                </HeroButton>
                
                <HeroButton asChild>
                  <Link href="/">
                    BACK TO HOME
                  </Link>
                </HeroButton>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

