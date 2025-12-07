import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { generatePrismicMetadata } from "@/lib/metadata";

/**
 * This page displays the careers/vacancies listing page.
 * In Prismic, create a page with UID "careers-vacancies" and add the Careers slice.
 * The UID can be changed below if you prefer a different name in Prismic.
 */
const CAREERS_PAGE_UID = "careers-vacancies";

export default async function CareersVacanciesPage() {
  const client = createClient();
  
  try {
    const page = await client.getByUID("page", CAREERS_PAGE_UID);
    
    return (
      <main>
        <SliceZone slices={page.data.slices} components={components} />
      </main>
    );
  } catch {
    // Page not found - guide admin to create it
    notFound();
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  
  try {
    const page = await client.getByUID("page", CAREERS_PAGE_UID);
    
    return generatePrismicMetadata(page, {
      url: "/careers/vacancies",
      keywords: ["careers", "jobs", "vacancies", "employment", "MACH1 Logistics"],
    });
  } catch {
    // Return default metadata if page doesn't exist
    return {
      title: "Careers & Vacancies | MACH1 Logistics",
      description: "Explore career opportunities at MACH1 Logistics. Join our team and help shape the future of logistics.",
    };
  }
}

