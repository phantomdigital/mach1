import type { Content } from "@prismicio/client";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass } from "@/lib/spacing";
import { createClient } from "@/prismicio";
import { SliceHeader } from "@/components/slice-header";
import React from "react";
import SpecialtyCard from "./specialty-card";

interface SpecialtiesAllProps {
  slice: Content.SpecialtiesSlice;
}

/**
 * Component for "Specialties" All Specialties variant.
 * Displays all specialties in a grid layout for the dedicated /specialties page.
 * Automatically fetches all specialty pages from Prismic.
 */
const SpecialtiesAll = async ({ slice }: SpecialtiesAllProps): Promise<React.ReactElement> => {
  const marginTop = getMarginTopClass(slice.primary.margin_top || "large");
  const paddingTop = getPaddingTopClass(slice.primary.padding_top || "large");
  const paddingBottom = getPaddingBottomClass(slice.primary.padding_bottom || "large");
  
  // Fetch all specialty pages from Prismic
  const client = createClient();
  let specialtyPages: Content.SpecialtyDocument[] = [];
  
  try {
    specialtyPages = await client.getAllByType("specialty", {
      orderings: [
        { field: "document.first_publication_date", direction: "asc" }
      ],
    });
  } catch (error) {
    console.error("Error fetching specialty pages:", error);
  }
  
  // Map specialty pages to the format expected by SpecialtyCard
  const displayedItems = specialtyPages.map((specialty) => ({
    title: specialty.data.title,
    description: specialty.data.description,
    image: specialty.data.featured_image,
    link: { 
      link_type: "Document" as const, 
      id: specialty.id, 
      uid: specialty.uid, 
      type: specialty.type,
      tags: specialty.tags,
      lang: specialty.lang,
      url: specialty.url ?? undefined,
      isBroken: false,
      data: {},
    },
  }));
  
  // Background color with white default
  const backgroundColor = ('background_color' in slice.primary && slice.primary.background_color) || "#ffffff";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full ${marginTop} ${paddingTop} ${paddingBottom}`}
      style={{ backgroundColor }}
    >
      <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
        {/* Header with SliceHeader */}
        <div className="flex flex-col items-center">
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

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {displayedItems.map((item, index) => (
            <div key={index}>
              <SpecialtyCard item={item} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesAll;

