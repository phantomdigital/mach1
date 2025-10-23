import { Metadata } from "next";
import { isFilled, RichTextField } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { generatePrismicMetadata } from "@/lib/metadata";
import SummaryClient from "./summary-client";
import type { StepsSliceSummary, FaqSlice } from "@/types.generated";

/**
 * This page displays the quote summary after form submission.
 * In Prismic, create a page with UID "quote-summary" and add a Steps slice with variation "summary".
 * The slice can either use its own custom FAQs or connect to the main FAQ slice.
 */
const QUOTE_SUMMARY_UID = "quote";

export default async function QuoteSummaryPage() {
  const client = createClient();
  
  try {
    const page = await client.getByUID("page", QUOTE_SUMMARY_UID);
    
    // Find the summary slice (Steps slice with variation "summary")
    const summarySlice = page.data.slices.find(
      (slice) => slice.slice_type === "steps" && slice.variation === "summary"
    ) as StepsSliceSummary | undefined;
    
    if (!summarySlice) {
      console.warn("No Steps summary slice found on quote-summary page");
      return <SummaryClient />;
    }
    
    // Access summary variation fields with proper typing
    const primary = summarySlice.primary;
    const items = summarySlice.items;
    
    // Fetch FAQs if use_main_faqs is enabled
    let faqs: Array<{ faq_question: string | null; faq_answer: RichTextField | null }> = [];
    
    if (primary.use_main_faqs && isFilled.contentRelationship(primary.main_faq_slice)) {
      try {
        const linkedPage = await client.getByID(primary.main_faq_slice.id);
        
        // Check if the document has slices (only Page documents have slices)
        if ('slices' in linkedPage.data && Array.isArray(linkedPage.data.slices)) {
          // Find FAQ slice in the linked page
          const faqSlice = linkedPage.data.slices.find(
            (slice) => slice.slice_type === "faq"
          ) as FaqSlice | undefined;
          
          if (faqSlice && faqSlice.variation === "default") {
            // Get the FAQ limit from the slice (default to 5 if not set)
            const faqLimit = primary.faq_limit || 5;
            
            // Map FAQ slice items to the format expected by Steps summary and apply limit
            faqs = faqSlice.items
              .slice(0, faqLimit)
              .map((item) => ({
                faq_question: item.question || null,
                faq_answer: item.answer || null,
              }));
          }
        }
      } catch (error) {
        console.error("Error fetching main FAQs:", error);
      }
    } else {
      // Use custom FAQs from the slice items
      faqs = items.map((item) => ({
        faq_question: item.faq_question || null,
        faq_answer: item.faq_answer || null,
      }));
    }
    
    // Pass Prismic content to client component
    return (
      <SummaryClient 
        heading={primary.summary_heading || "We have received your request."}
        description={primary.summary_description}
        contactEmail={primary.contact_email || ""}
        contactTimeframe={primary.contact_timeframe || ""}
        faqs={faqs}
      />
    );
  } catch (error) {
    // Page not found - use default content
    console.error('Error fetching quote-summary page:', error);
    return <SummaryClient />;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  
  try {
    const page = await client.getByUID("page", QUOTE_SUMMARY_UID);
    
    return generatePrismicMetadata(page, {
      url: "/quote/summary",
      keywords: ["quote", "summary", "MACH 1 Logistics"],
    });
  } catch {
    // Return default metadata if page doesn't exist
    return {
      title: "Quote Summary | MACH 1 Logistics",
      description: "Your quote request has been received.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}
