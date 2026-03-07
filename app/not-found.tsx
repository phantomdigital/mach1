import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { HeroButton } from "@/components/ui/hero-button";
import { getContainerClass } from "@/lib/spacing";

export const metadata: Metadata = {
  title: "Page Not Found | MACH1 Logistics",
  description: "The page you're looking for doesn't exist. Explore our freight forwarding solutions, careers, and services.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main
      className="w-full min-h-screen flex flex-col bg-white"
      style={{ paddingTop: "var(--header-height, 128px)" }}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className={`${getContainerClass()} py-16 lg:py-24 max-w-2xl mx-auto text-center`}>
          {/* 404 Icon - compact */}
            <div className="flex justify-center mb-6">
              <Image
                src="/icons/404.svg"
                alt="404 - Page not found"
                width={120}
                height={111}
                className="w-20 lg:w-24 h-auto"
                priority
              />
            </div>

            {/* Text hierarchy: label → heading → description */}
            <div className="space-y-3 mb-6">
              <p className="text-neutral-500 text-[11px] font-semibold uppercase tracking-widest">
                Error 404
              </p>
              <h1 className="text-neutral-800 text-2xl lg:text-4xl font-bold leading-tight">
                Page Not Found
              </h1>
            </div>

            <p className="text-neutral-600 text-sm lg:text-base leading-relaxed max-w-sm mx-auto mb-8">
              The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>

            {/* Action Buttons - header style (size="small") */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <HeroButton asChild size="small">
                <Link href="/">Back to Home</Link>
              </HeroButton>
              <HeroButton asChild size="small">
                <Link href="/contact">Contact Us</Link>
              </HeroButton>
            </div>
        </div>
      </div>
    </main>
  );
}

