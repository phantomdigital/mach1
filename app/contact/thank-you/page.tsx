import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { generatePrismicMetadata } from "@/lib/metadata";

/**
 * This page displays the contact thank you page.
 * In Prismic, create a page with UID "contact-thank-you" and add your desired slices.
 * The UID can be changed below if you prefer a different name in Prismic.
 */
const CONTACT_THANK_YOU_UID = "contact-thank-you";

type SearchParams = { email?: string };

// Helper function to process rich text and replace {email} with bold email
interface RichTextBlock {
  text?: string;
  spans?: Array<{
    type: string;
    start: number;
    end: number;
  }>;
}

function processRichTextField(field: RichTextBlock[], emailReplacement: string) {
  return field.map((block: RichTextBlock) => {
    if (block.text && block.text.includes("{email}")) {
      const parts = block.text.split(/(\{email\})/gi);
      let processedText = "";
      const newSpans = [...(block.spans || [])];

      parts.forEach((part: string) => {
        if (part.toLowerCase() === "{email}") {
          const startIndex = processedText.length;
          processedText += emailReplacement;
          const endIndex = processedText.length;

          // Add a strong span for the email
          newSpans.push({
            type: "strong",
            start: startIndex,
            end: endIndex,
          });
        } else {
          processedText += part;
        }
      });

      return {
        ...block,
        text: processedText,
        spans: newSpans,
      };
    }
    return block;
  });
}

export default async function ContactThankYouPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const client = createClient();
  const params = await searchParams;
  
  // Protect the page - only accessible with email parameter (from form submission)
  if (!params.email) {
    redirect("/");
  }
  
  try {
    const page = await client.getByUID("page", CONTACT_THANK_YOU_UID);
    
    // Determine the replacement value for {email}
    const emailReplacement = params.email || "your email address";

    // Process slices to replace {email} placeholder
        const processedSlices = page.data.slices.map((slice) => {
      if (slice.slice_type === "submitted") {
        // Clone the slice to avoid mutating the original
        const processedSlice = JSON.parse(JSON.stringify(slice));

        // Replace {email} in text fields (heading)
        if (processedSlice.primary.heading) {
          processedSlice.primary.heading = processedSlice.primary.heading.replace(
            /\{email\}/gi,
            emailReplacement
          );
        }

        // Replace {email} in rich text fields with bold formatting
        if (processedSlice.primary.description) {
          processedSlice.primary.description = processRichTextField(
            processedSlice.primary.description,
            emailReplacement
          );
        }

        if (processedSlice.primary.info_card_content) {
          processedSlice.primary.info_card_content = processRichTextField(
            processedSlice.primary.info_card_content,
            emailReplacement
          );
        }

        return processedSlice;
      }

      return slice;
    });
    
    return <SliceZone slices={processedSlices} components={components} />;
  } catch (error) {
    // Page not found - guide admin to create it
    console.error('Error fetching contact-thank-you page:', error);
    notFound();
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  
  try {
    const page = await client.getByUID("page", CONTACT_THANK_YOU_UID);
    
    return generatePrismicMetadata(page, {
      url: "/contact/thank-you",
      keywords: ["contact", "thank you", "MACH 1 Logistics"],
    });
  } catch {
    // Return default metadata if page doesn't exist
    return {
      title: "Thank You | MACH 1 Logistics",
      description: "Thank you for contacting MACH 1 Logistics. We'll be in touch soon.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

