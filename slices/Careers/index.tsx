import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { CareersFilters } from "./careers-filters";
import { getMarginTopClass, getContainerClass, getSectionWrapperClass } from "@/lib/spacing";
import type { MarginTopSize } from "@/lib/spacing";

/**
 * Props for `Careers`.
 */
export type CareersProps = SliceComponentProps<Content.CareersSlice>;

/**
 * Component for "Careers" Slices.
 * Server-rendered for SEO - all job listings are in the initial HTML.
 */
const Careers = async ({ slice }: CareersProps): Promise<React.ReactElement> => {
  const client = createClient();

  // Get margin top size from slice configuration
  const marginTopSize = (slice.primary.margin_top as MarginTopSize) || "large";

  // Get slice configuration
  const showFeaturedJobs = (slice.primary as any).show_featured_jobs ?? true;
  const showInactiveJobs = (slice.primary as any).show_inactive_jobs ?? false;
  const enableLoadMore = (slice.primary as any).enable_load_more ?? false;
  const initialCount = (slice.primary as any).initial_jobs_count || 9;
  
  let allJobs: Content.JobDocument[] = [];
  let featuredJobs: Content.JobDocument[] = [];
  
  try {
    // Fetch ALL active jobs (or all jobs if showInactiveJobs is true)
    allJobs = await client.getAllByType<Content.JobDocument>("job", {
      limit: 100,
      orderings: [
        { field: "my.job.featured", direction: "desc" },
        { field: "document.first_publication_date", direction: "desc" },
      ],
    });

    // Filter out inactive jobs if needed
    if (!showInactiveJobs) {
      allJobs = allJobs.filter((job) => job.data.active !== false);
    }

    // Filter out jobs that closed more than 24 hours ago
    allJobs = allJobs.filter((job) => {
      const closingDate = job.data.closing_date;
      if (!closingDate) return true; // Keep jobs without closing dates
      
      const closingDateTime = new Date(closingDate).getTime();
      const now = new Date().getTime();
      const hoursSinceClosed = (now - closingDateTime) / (1000 * 60 * 60);
      
      // Keep jobs that haven't closed yet, or closed within the last 24 hours
      return hoursSinceClosed <= 24;
    });

    // Separate featured jobs
    if (showFeaturedJobs) {
      featuredJobs = allJobs.filter((job) => job.data.featured === true);
      // Remove featured jobs from main list to avoid duplication
      allJobs = allJobs.filter((job) => job.data.featured !== true);
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return <></>;
  }

  if (featuredJobs.length === 0 && allJobs.length === 0) {
    return (
      <section className={`${getSectionWrapperClass("white")} ${getMarginTopClass(marginTopSize)}`}>
        <div className={getContainerClass()}>
          {slice.primary.heading && (
            <h2 className="text-neutral-800 text-2xl lg:text-4xl font-bold mb-8">
              {slice.primary.heading}
            </h2>
          )}
          <p className="text-neutral-600 text-lg">
            No positions are currently available. Please check back later.
          </p>
        </div>
      </section>
    );
  }

  // Generate JobPosting structured data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mach1logistics.com.au";
  const allJobsForSchema = [...featuredJobs, ...allJobs];
  
  const jobPostingsSchema = allJobsForSchema.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.data.title,
    description: job.data.summary || job.data.title,
    datePosted: job.first_publication_date,
    validThrough: job.data.closing_date || undefined,
    employmentType: job.data.employment_type?.toUpperCase().replace('-', '_') || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "MACH1 Logistics",
      sameAs: baseUrl,
      logo: `${baseUrl}/logo.png`,
    },
    jobLocation: (job.data.city || job.data.state) ? {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.data.city || undefined,
        addressRegion: job.data.state || undefined,
        addressCountry: "AU",
      },
    } : undefined,
    baseSalary: job.data.salary_range ? {
      "@type": "MonetaryAmount",
      currency: "AUD",
      value: {
        "@type": "QuantitativeValue",
        value: job.data.salary_range,
      },
    } : undefined,
    url: `${baseUrl}/job/${job.uid}`,
  }));

  return (
    <>
      {/* Featured Jobs Section */}
      {showFeaturedJobs && featuredJobs.length > 0 && (
        <section className={`${getSectionWrapperClass("neutral")} ${getMarginTopClass(marginTopSize)}`}>
          <div className={getContainerClass()}>
            {slice.primary.featured_heading && (
              <h2 className="text-neutral-800 text-2xl lg:text-4xl font-bold mb-8 lg:mb-12">
                {slice.primary.featured_heading}
              </h2>
            )}
            
            <CareersFilters
              allJobs={featuredJobs}
              enableLoadMore={false}
              initialCount={featuredJobs.length}
              showFilters={false}
              isFeatured={true}
            />
          </div>
        </section>
      )}

      {/* All Jobs Grid Section */}
      {allJobs.length > 0 && (
        <section className={`${getSectionWrapperClass("white")} ${!showFeaturedJobs || featuredJobs.length === 0 ? getMarginTopClass(marginTopSize) : ''}`}>
          <div className={getContainerClass()}>
            {/* Heading */}
            {slice.primary.heading && (
              <div className="mb-8 lg:mb-12">
                <h2 className="text-neutral-800 text-2xl lg:text-4xl font-bold mb-4">
                  {slice.primary.heading}
                </h2>
                {slice.primary.subheading && (
                  <p className="text-neutral-600 text-lg lg:text-xl">
                    {slice.primary.subheading}
                  </p>
                )}
              </div>
            )}

            {/* Client-side Filters and Jobs */}
            <CareersFilters
              allJobs={allJobs}
              enableLoadMore={enableLoadMore}
              initialCount={initialCount}
              showFilters={true}
              isFeatured={false}
            />
          </div>
        </section>
      )}

      {/* Structured Data for SEO */}
      {allJobsForSchema.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobPostingsSchema),
          }}
        />
      )}
    </>
  );
};

export default Careers;

