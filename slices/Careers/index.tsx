import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { CareersFilters } from "./careers-filters";

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

  // Get margin top class based on selection (responsive: smaller on mobile)
  const getMarginTopClass = () => {
    switch (slice.primary.margin_top) {
      case "none":
        return "mt-0";
      case "small":
        return "mt-6 lg:mt-12";
      case "medium":
        return "mt-12 lg:mt-24";
      case "large":
        return "mt-30 lg:mt-48";
      case "extra-large":
        return "mt-40 lg:mt-64";
      default:
        return "mt-30 lg:mt-48";
    }
  };

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
      <section className={`w-full py-16 lg:py-24 bg-white ${getMarginTopClass()}`}>
        <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
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
      name: "MACH 1 Logistics",
      sameAs: baseUrl,
      logo: `${baseUrl}/logo.png`,
    },
    jobLocation: job.data.location ? {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.data.location.split(",")[0],
        addressRegion: job.data.location.split(",")[1]?.trim(),
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
        <section className={`w-full py-16 lg:py-24 bg-neutral-50 ${getMarginTopClass()}`}>
          <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
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
        <section className={`w-full py-16 lg:py-24 bg-white ${!showFeaturedJobs || featuredJobs.length === 0 ? getMarginTopClass() : ''}`}>
          <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
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

