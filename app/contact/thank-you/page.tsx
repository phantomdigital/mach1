import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Thank You | MACH1 Logistics",
    description: "Thank you for contacting MACH1 Logistics. We'll be in touch soon.",
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ThankYouPage() {
  const client = createClient();
  
  // Fetch the home page to get the ContactUs slice content
  let thankYouContent = {
    heading: "Message Received!",
    description: "We've received your enquiry and a member of our team will get back to you as soon as possible.",
    infoTitle: "What happens next?",
    infoText: "Our team typically responds within 24 hours during business days. For urgent enquiries, please call us directly.",
  };

  try {
    const homePage = await client.getSingle("home");
    // Find the ContactUs slice - cast to unknown first then to our expected type
    const slices = homePage.data.slices as unknown as Array<{
      slice_type: string;
      primary?: {
        thank_you_heading?: string;
        thank_you_description?: string;
        thank_you_info_title?: string;
        thank_you_info_text?: string;
      };
    }>;
    
    const contactSlice = slices.find(
      (slice) => slice.slice_type === "contact_us"
    );

    if (contactSlice?.primary) {
      thankYouContent = {
        heading: contactSlice.primary.thank_you_heading || thankYouContent.heading,
        description: contactSlice.primary.thank_you_description || thankYouContent.description,
        infoTitle: contactSlice.primary.thank_you_info_title || thankYouContent.infoTitle,
        infoText: contactSlice.primary.thank_you_info_text || thankYouContent.infoText,
      };
    }
  } catch (error) {
    console.error("Error fetching content:", error);
    // Use defaults if Prismic fetch fails
  }

  return (
    <div className="min-h-screen bg-white">
      {/* No header/topper - standalone page */}
      <section className="w-full bg-white pt-60 pb-16 lg:pt-82 lg:pb-48">
        <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-40">
            {/* Left Column - Main Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                {/* Success Icon Badge */}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mach1-green">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      strokeWidth="3"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                <h2 className="text-neutral-800 text-4xl lg:text-5xl">
                  {thankYouContent.heading}
                </h2>
                
                <div className="text-neutral-600 text-base">
                  <p>{thankYouContent.description}</p>
                </div>
              </div>

              {/* Back to Home Button */}
              <div>
                <Button asChild variant="hero">
                  <Link href="/">
                    GO TO HOME
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Info Card */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h5 className="text-neutral-800 text-sm">{thankYouContent.infoTitle.toUpperCase()}</h5>
                <div className="bg-neutral-100 p-6 rounded-md border border-[#D9D9D9]">
                  <p className="text-neutral-600 text-sm">
                    {thankYouContent.infoText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

