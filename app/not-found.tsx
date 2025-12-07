import Link from "next/link";
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
    <main className={`w-full min-h-screen flex items-center bg-white mt-30 lg:mt-32`}>
      <div className={`${getContainerClass()} py-16 lg:py-24`}>
        <div className="max-w-3xl mx-auto text-center">
          {/* Error Badge */}
          <div className="mb-8">
            <h5 className="inline-block text-green-200 text-xs font-bold tracking-wider uppercase px-3 py-1.5 bg-mach1-green rounded-2xl">
              Error 404
            </h5>
          </div>

          {/* Main Heading */}
          <h1 className="text-neutral-800 text-4xl lg:text-6xl font-bold mb-6">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-neutral-600 text-lg lg:text-xl mb-12 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <HeroButton asChild>
              <Link href="/">
                BACK TO HOME
              </Link>
            </HeroButton>
            
         
          </div>
        </div>
      </div>
    </main>
  );
}

