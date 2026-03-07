"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroButton } from "@/components/ui/hero-button";
import { getContainerClass } from "@/lib/spacing";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client-side error:", error);
  }, [error]);

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
              height={111}
              className="w-20 lg:w-24 h-auto"
              priority
            />
          </div>

          {/* Text hierarchy: label → heading → description */}
          <div className="space-y-3 mb-6">
            <p className="text-neutral-500 text-[11px] font-semibold uppercase tracking-widest">
              Error
            </p>
            <h1 className="text-neutral-800 text-2xl lg:text-4xl font-bold leading-tight">
              Something went wrong
            </h1>
          </div>

          <p className="text-neutral-600 text-sm lg:text-base leading-relaxed max-w-sm mx-auto mb-8">
            We encountered an unexpected error. Please try again or return to the homepage.
          </p>

          {/* Action Buttons - header style (size="small") */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <HeroButton asChild size="small">
              <button onClick={reset} className="cursor-pointer w-full sm:w-auto">
                Try Again
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

