import { Metadata } from "next";
import { isFilled, RichTextField } from "@prismicio/client";
import { createClient, defaultLocale, type LocaleCode } from "@/prismicio";
import { generatePrismicMetadata } from "@/lib/metadata";
import { quoteChrome, quoteCopy } from "@/lib/quote-ui";
import SummaryClient from "./summary-client";
import type { StepsSliceSummary, FaqSlice } from "@/types.generated";

/**
 * This page displays the quote summary after form submission.
 * In Prismic, create a page with UID "quote-summary" and add a Steps slice with variation "summary".
 * The slice can either use its own custom FAQs or connect to the main FAQ slice.
 */
const QUOTE_SUMMARY_UID = "quote";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function QuoteSummaryPage({ params }: Props) {
  const client = createClient();
  
  // Extract locale from URL - handle both /quote/summary and /[lang]/quote/summary
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  let locale: LocaleCode = defaultLocale;
  
  // Check if we have a locale in the slug (for catch-all route)
  // Format: [locale, "quote", "summary"] or [] for default route
  if (slug.length >= 3 && slug[1] === "quote" && slug[2] === "summary") {
    // Format: /[locale]/quote/summary - handled by catch-all route
    const firstSegment = slug[0];
    const validLocales = ['en-us', 'zh-cn', 'hi-in'] as const;
    if (validLocales.includes(firstSegment as LocaleCode)) {
      locale = firstSegment as LocaleCode;
    }
  } else {
    // Format: /quote/summary (default locale, handled by specific route)
    // Use default locale - client-side will detect actual URL locale
    locale = defaultLocale;
  }
  
  try {
    const page = await client.getByUID("page", QUOTE_SUMMARY_UID, { lang: locale });
    
    // Find the summary slice (Steps slice with variation "summary")
    const summarySlice = page.data.slices.find(
      (slice) => slice.slice_type === "steps" && slice.variation === "summary"
    ) as StepsSliceSummary | undefined;
    
    if (!summarySlice) {
      console.warn("No Steps summary slice found on quote-summary page");
      return <SummaryClient locale={locale} />;
    }

    const copy = quoteCopy(locale);
    
    // Access summary variation fields with proper typing
    const primary = summarySlice.primary;
    const items = summarySlice.items;
    
    // Fetch FAQs if use_main_faqs is enabled
    let faqs: Array<{ faq_question: string | null; faq_answer: RichTextField | null }> = [];
    
    if (primary.use_main_faqs && isFilled.contentRelationship(primary.main_faq_slice)) {
      try {
        // Fetch linked FAQ page in the same locale
        const linkedPage = await client.getByID(primary.main_faq_slice.id, { lang: locale });
        
        // Check if the document has slices (only Page documents have slices)
        if ('slices' in linkedPage.data && Array.isArray(linkedPage.data.slices)) {
          // Find FAQ slice in the linked page - fetch in same locale
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
        heading={quoteChrome(primary.summary_heading, copy.weReceived, locale)}
        description={primary.summary_description}
        contactEmail={primary.contact_email || ""}
        contactTimeframe={primary.contact_timeframe || ""}
        faqs={faqs}
        badgeText={quoteChrome(primary.badge_text, copy.quoteReceived, locale)}
        goToHomeButton={quoteChrome(primary.go_to_home_button, copy.goHome, locale)}
        detailsHeading={quoteChrome(primary.details_heading, copy.details, locale)}
        serviceTypeLabel={quoteChrome(primary.service_type_label, copy.serviceType, locale)}
        packageDetailsHeading={quoteChrome(primary.package_details_heading, copy.packageDetails, locale)}
        packageLabel={quoteChrome(primary.package_label, copy.packageWord, locale)}
        originLabel={quoteChrome(primary.origin_label, copy.origin, locale)}
        destinationLabel={quoteChrome(primary.destination_label, copy.destination, locale)}
        weightLabel={quoteChrome(primary.weight_label, copy.weight, locale)}
        quantityLabel={quoteChrome(primary.quantity_label, copy.quantity, locale)}
        lengthLabel={quoteChrome(primary.length_label, copy.length, locale)}
        widthLabel={quoteChrome(primary.width_label, copy.width, locale)}
        heightLabel={quoteChrome(primary.height_label, copy.height, locale)}
        faqsTitle={quoteChrome(primary.faqs_title, copy.faqs, locale)}
        haveAChatHeading={quoteChrome(primary.have_a_chat_heading, copy.haveAChat, locale)}
        getHelpHeading={quoteChrome(primary.get_help_heading, copy.getHelp, locale)}
        contactUsButton={quoteChrome(primary.contact_us_button, copy.contactUs, locale)}
        liveChatButton={quoteChrome(primary.live_chat_button, copy.liveChat, locale)}
        loadingMessage={quoteChrome(primary.loading_message, copy.loadingSummary, locale)}
        noDataMessage={quoteChrome(primary.no_data_message, copy.noData, locale)}
        redirectingMessage={quoteChrome(primary.redirecting_message, copy.redirecting, locale)}
        locale={locale}
      />
    );
  } catch (error) {
    // Page not found - use default content
    console.error('Error fetching quote-summary page:', error);
    return <SummaryClient locale={locale} />;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = createClient();
  
  // Extract locale from params
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  let locale: LocaleCode = defaultLocale;
  
  if (slug.length > 0) {
    const firstSegment = slug[0];
    const validLocales = ['en-us', 'zh-cn', 'hi-in'] as const;
    if (validLocales.includes(firstSegment as LocaleCode)) {
      locale = firstSegment as LocaleCode;
    }
  }
  
  try {
    const page = await client.getByUID("page", QUOTE_SUMMARY_UID, { lang: locale });
    
    const summaryPath = locale === defaultLocale ? "/quote/summary" : `/${locale}/quote/summary`;
    
    return generatePrismicMetadata(page, {
      url: summaryPath,
      locale,
      keywords: ["quote", "summary", "MACH1 Logistics"],
      noIndex: true,
    });
  } catch {
    // Return default metadata if page doesn't exist
    return {
      title: "Quote Summary | MACH1 Logistics",
      description: "Your quote request has been received.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}
