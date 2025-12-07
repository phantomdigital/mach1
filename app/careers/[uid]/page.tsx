import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";
import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { HeroButton } from "@/components/ui/hero-button";
import { Badge } from "@/components/ui/badge";
import { JobApplicationDialog } from "@/app/careers/job-application-dialog";
import { formatAuDate } from "@/lib/date-utils";

type Params = { uid: string };

export default async function JobPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid } = await params;
  const client = createClient();

  let page: Content.JobDocument;
  try {
    page = await client.getByUID("job", uid);
  } catch {
    notFound();
  }

  const formattedClosingDate = formatAuDate(page.data.closing_date);

  // Check if position is still active
  const isActive = page.data.active !== false;
  const closingDate = page.data.closing_date;
  const hasClosingDate = closingDate && closingDate !== null;
  const isPastClosingDate = hasClosingDate && new Date(closingDate) < new Date();
  
  // Hide job completely if it's been more than 24 hours since closing date
  if (hasClosingDate && isPastClosingDate) {
    const closingDateTime = new Date(closingDate).getTime();
    const now = new Date().getTime();
    const hoursSinceClosed = (now - closingDateTime) / (1000 * 60 * 60);
    
    if (hoursSinceClosed > 24) {
      notFound();
    }
  }
  
  // Also hide if manually set to inactive and past closing date
  if (!isActive && isPastClosingDate && hasClosingDate) {
    const closingDateTime = new Date(closingDate).getTime();
    const now = new Date().getTime();
    const hoursSinceClosed = (now - closingDateTime) / (1000 * 60 * 60);
    
    if (hoursSinceClosed > 24) {
      notFound();
    }
  }

  // Get application method
  const applicationEmail = page.data.application_email;
  const applicationUrl = page.data.application_url;
  const hasApplicationUrl = isFilled.link(applicationUrl);

  return (
    <main>
      {/* Job Header */}
      <section className="w-full pt-40 pb-16 lg:pt-64 lg:pb-24 bg-white">
        <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <div className="mb-8">
              <Link 
                href="/careers" 
                className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-dark-blue transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Careers
              </Link>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              {page.data.department && (
                <Badge variant="green">
                  {page.data.department}
                </Badge>
              )}
              {page.data.featured && (
                <Badge variant="featured">
                  Featured
                </Badge>
              )}
              {(!isActive || isPastClosingDate) && (
                <Badge variant="closed">
                  Position Closed
                </Badge>
              )}
            </div>

            {/* Job Title */}
            <h1 className="text-neutral-800 text-4xl lg:text-6xl font-bold mb-6">
              {page.data.title}
            </h1>

            {/* Job Meta */}
            <div className="flex flex-wrap items-center gap-4 text-base text-neutral-600 mb-8 pb-8 border-b border-neutral-200">
              {(page.data.city || page.data.state) && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    {[page.data.city, page.data.state].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
              {page.data.employment_type && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{page.data.employment_type}</span>
                </div>
              )}
              {page.data.experience_level && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>{page.data.experience_level}</span>
                </div>
              )}
              {page.data.salary_range && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">{page.data.salary_range}</span>
                </div>
              )}
            </div>

            {/* Summary */}
            {page.data.summary && (
              <div className="mb-12">
                <p className="text-neutral-700 text-lg lg:text-xl leading-relaxed">
                  {page.data.summary}
                </p>
              </div>
            )}

            {/* Application CTA - Top */}
            {isActive && !isPastClosingDate && (applicationEmail || hasApplicationUrl) && (
              <div className="mb-12 p-6 lg:p-8 bg-neutral-50 rounded-lg border-2 border-mach1-green">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-neutral-800 text-xl font-bold mb-2">
                      Interested in this role?
                      </h3>
                      {hasClosingDate && (
                        <p className="text-neutral-600 text-sm">
                          Applications close on {formattedClosingDate}
                        </p>
                      )}
                    </div>
                    <div>
                      {hasApplicationUrl ? (
                        <HeroButton asChild>
                          <PrismicNextLink field={applicationUrl} target="_blank" rel="noopener noreferrer">
                            APPLY NOW
                          </PrismicNextLink>
                        </HeroButton>
                      ) : applicationEmail ? (
                        <JobApplicationDialog
                          jobTitle={page.data.title || ""}
                          applicationEmail={applicationEmail}
                          closingDate={formattedClosingDate}
                        >
                          <HeroButton>APPLY NOW</HeroButton>
                        </JobApplicationDialog>
                      ) : null}
                    </div>
                </div>
              </div>
            )}

            {/* Job Description */}
            {page.data.description && (
              <div className="mb-12">
                <h2 className="text-neutral-800 text-2xl lg:text-3xl font-bold mb-6">
                  About the Role
                </h2>
                <div className="prose max-w-none">
                  <PrismicRichText field={page.data.description} />
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {page.data.responsibilities && (
              <div className="mb-12">
                <h2 className="text-neutral-800 text-2xl lg:text-3xl font-bold mb-6">
                  Key Responsibilities
                </h2>
                <div className="prose max-w-none">
                  <PrismicRichText field={page.data.responsibilities} />
                </div>
              </div>
            )}

            {/* Requirements */}
            {page.data.requirements && (
              <div className="mb-12">
                <h2 className="text-neutral-800 text-2xl lg:text-3xl font-bold mb-6">
                  Requirements & Qualifications
                </h2>
                <div className="prose max-w-none">
                  <PrismicRichText field={page.data.requirements} />
                </div>
              </div>
            )}

            {/* Benefits */}
            {page.data.benefits && (
              <div className="mb-12">
                <h2 className="text-neutral-800 text-2xl lg:text-3xl font-bold mb-6">
                  What We Offer
                </h2>
                <div className="prose max-w-none">
                  <PrismicRichText field={page.data.benefits} />
                </div>
              </div>
            )}

            {/* Application CTA - Bottom */}
            {isActive && !isPastClosingDate && (applicationEmail || hasApplicationUrl) && (
              <div className="mt-16 p-6 lg:p-8 bg-dark-blue text-white rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                      Ready to join our team?
                    </h3>
                    <p className="text-neutral-200">
                      Submit your application today and become part of something great.
                    </p>
                    {hasClosingDate && (
                      <p className="text-neutral-300 text-sm mt-2">
                        Applications close on {formattedClosingDate}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {hasApplicationUrl ? (
                      <HeroButton asChild>
                        <PrismicNextLink field={applicationUrl} target="_blank" rel="noopener noreferrer">
                          APPLY NOW
                        </PrismicNextLink>
                      </HeroButton>
                    ) : applicationEmail ? (
                      <JobApplicationDialog
                        jobTitle={page.data.title || ""}
                        applicationEmail={applicationEmail}
                        closingDate={formattedClosingDate}
                      >
                        <HeroButton>APPLY NOW</HeroButton>
                      </JobApplicationDialog>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {/* Closed Position Message */}
            {(!isActive || isPastClosingDate) && (
              <div className="mt-16 p-6 lg:p-8 bg-neutral-100 rounded-lg text-center">
                <h3 className="text-neutral-800 text-xl font-bold mb-2">
                  This position is no longer accepting applications
                </h3>
                <p className="text-neutral-600 mb-6">
                  Check out our other current opportunities
                </p>
                <HeroButton asChild>
                  <Link href="/careers">
                    VIEW ALL POSITIONS
                  </Link>
                </HeroButton>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: page.data.title,
            description: page.data.summary || page.data.title,
            datePosted: page.first_publication_date,
            validThrough: closingDate || undefined,
            employmentType: page.data.employment_type || undefined,
            hiringOrganization: {
              "@type": "Organization",
              name: "MACH1 Logistics",
              sameAs: "https://mach1logistics.com.au",
            },
            jobLocation: (page.data.city || page.data.state) ? {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: page.data.city || undefined,
                addressRegion: page.data.state || undefined,
                addressCountry: "AU",
              },
            } : undefined,
            baseSalary: page.data.salary_range ? {
              "@type": "MonetaryAmount",
              currency: "AUD",
              value: {
                "@type": "QuantitativeValue",
                value: page.data.salary_range,
              },
            } : undefined,
          }),
        }}
      />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();

  let page: Content.JobDocument;
  try {
    page = await client.getByUID("job", uid);
  } catch {
    return {
      title: "Job Not Found",
    };
  }

  const title = page.data.meta_title || `${page.data.title} - ${page.data.department || 'Career'}`;
  const description = page.data.meta_description || page.data.summary || `Join MACH1 Logistics as a ${page.data.title}`;
  const image = page.data.meta_image?.url;

  return {
    title: `${title} | MACH1 Logistics Careers`,
    description,
    openGraph: {
      title: `${title} | MACH1 Logistics Careers`,
      description,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MACH1 Logistics Careers`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("job");

  // Filter out jobs that closed more than 24 hours ago
  const activePages = pages.filter((page) => {
    const closingDate = page.data.closing_date;
    if (!closingDate) return true; // Keep jobs without closing dates
    
    const closingDateTime = new Date(closingDate).getTime();
    const now = new Date().getTime();
    const hoursSinceClosed = (now - closingDateTime) / (1000 * 60 * 60);
    
    // Keep jobs that haven't closed yet, or closed within the last 24 hours
    return hoursSinceClosed <= 24;
  });

  return activePages.map((page) => {
    return { uid: page.uid };
  });
}

// Revalidate every hour to check for expired jobs
export const revalidate = 3600;

