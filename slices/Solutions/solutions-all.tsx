import React, { Suspense } from "react";
import type { Content } from "@prismicio/client";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass } from "@/lib/spacing";
import { createClient } from "@/prismicio";
import SolutionCard from "./solution-card";
import { SliceHeader } from "@/components/slice-header";

// Lazy load animation component to improve initial page load
const SolutionsAnimation = React.lazy(() => import("./solutions-animation"));

interface SolutionsAllProps {
  slice: Content.SolutionsSlice;
}

/**
 * Component for "Solutions" All Solutions variant.
 * Displays all solutions in a grid layout for the dedicated /solutions page.
 * Automatically fetches all solution pages from Prismic.
 */
const SolutionsAll = async ({ slice }: SolutionsAllProps): Promise<React.ReactElement> => {
  const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
  const paddingTop = getPaddingTopClass(slice.primary.padding_top || "large");
  const paddingBottom = getPaddingBottomClass(slice.primary.padding_bottom || "large");
  
  // Fetch all solution pages from Prismic
  const client = createClient();
  let solutionPages: Content.SolutionDocument[] = [];
  
  try {
    solutionPages = await client.getAllByType("solution", {
      orderings: [
        { field: "document.first_publication_date", direction: "asc" }
      ],
    });
  } catch (error) {
    console.error("Error fetching solution pages:", error);
  }
  
  // Map solution pages to the format expected by SolutionCard
  const displayedItems = solutionPages.map((solution) => ({
    title: solution.data.title,
    description: solution.data.description,
    image: solution.data.featured_image,
    link: { 
      link_type: "Document" as const, 
      id: solution.id, 
      uid: solution.uid, 
      type: solution.type,
      tags: solution.tags,
      lang: solution.lang,
      url: solution.url ?? undefined,
      isBroken: false,
      data: {},
    },
  }));
  
  // Background color with white default
  const backgroundColor = slice.primary.background_color || "#ffffff";

  const solutionsAllContent = (
    <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
      {/* Header with SliceHeader */}
      <div data-animate="header" className="flex flex-col items-center">
        <SliceHeader 
          subheading={slice.primary.subheading} 
          textColor="text-neutral-800" 
          textAlign="center"
          variant="badge"
          badgeVariant="green"
        />
        {slice.primary.heading && (
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-neutral-800 text-2xl lg:text-4xl max-w-4xl text-center tracking-tight">
              {slice.primary.heading}
            </h2>
          </div>
        )}
        {'description' in slice.primary && slice.primary.description && (
          <div className="mb-12 lg:mb-16">
            <p className="text-neutral-600 text-base lg:text-lg max-w-3xl text-center">
              {slice.primary.description}
            </p>
          </div>
        )}
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {displayedItems.map((item, index) => (
          <div key={index} data-animate="card">
            <SolutionCard item={item} index={index} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full ${marginTop} ${paddingTop} ${paddingBottom}`}
      style={{ backgroundColor }}
    >
      <Suspense fallback={<div>{solutionsAllContent}</div>}>
        <SolutionsAnimation>
          {solutionsAllContent}
        </SolutionsAnimation>
      </Suspense>
    </section>
  );
};

export default SolutionsAll;

