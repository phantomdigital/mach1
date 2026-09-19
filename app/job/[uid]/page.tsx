import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { createClient, defaultLocale, type LocaleCode } from "@/prismicio";
import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { HeroButton } from "@/components/ui/hero-button";
import { Badge } from "@/components/ui/badge";
import { JobApplicationDialog } from "@/app/careers/job-application-dialog";
import { generateBreadcrumbSchema, languageAlternateMap, ogAlternateLocales, ogLocale } from "@/lib/metadata";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";
import { createRichTextComponents } from "@/lib/rich-text-serializer";
import { isHindi, isSimplifiedChinese, localeForIntl, localizedChrome, localizedPath } from "@/lib/localized-routes";

type Params = { uid: string; locale?: LocaleCode };

export default async function JobPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid, locale = defaultLocale } = await params;
  const client = createClient();
  const chinese = isSimplifiedChinese(locale);
  const hindi = isHindi(locale);
  const labels = chinese
    ? {
        back: "返回招聘职位", featured: "精选职位", closed: "职位已关闭",
        interested: "对此职位感兴趣？", applicationsClose: "申请截止日期",
        apply: "立即申请", about: "职位介绍", responsibilities: "主要职责",
        requirements: "任职要求", benefits: "我们提供",
        ready: "准备加入我们的团队吗？",
        readyDescription: "立即提交申请，加入我们的优秀团队。",
        noApplications: "此职位已停止接受申请",
        otherOpportunities: "查看我们的其他招聘机会", viewAll: "查看所有职位",
      }
    : hindi
    ? {
        back: "करियर पर वापस जाएँ", featured: "विशेष पद", closed: "पद बंद",
        interested: "इस भूमिका में रुचि है?", applicationsClose: "आवेदन की अंतिम तिथि",
        apply: "अभी आवेदन करें", about: "भूमिका के बारे में", responsibilities: "मुख्य जिम्मेदारियाँ",
        requirements: "आवश्यकताएँ और योग्यताएँ", benefits: "हम क्या देते हैं",
        ready: "हमारी टीम में शामिल होने के लिए तैयार हैं?",
        readyDescription: "आज ही आवेदन जमा करें और हमारी टीम का हिस्सा बनें।",
        noApplications: "यह पद अब आवेदन स्वीकार नहीं कर रहा है",
        otherOpportunities: "हमारे अन्य वर्तमान अवसर देखें", viewAll: "सभी पद देखें",
      }
    : {
        back: "Back to Careers", featured: "Featured", closed: "Position Closed",
        interested: "Interested in this role?", applicationsClose: "Applications close on",
        apply: "APPLY NOW", about: "About the Role", responsibilities: "Key Responsibilities",
        requirements: "Requirements & Qualifications", benefits: "What We Offer",
        ready: "Ready to join our team?",
        readyDescription: "Submit your application today and become part of something great.",
        noApplications: "This position is no longer accepting applications",
        otherOpportunities: "Check out our other current opportunities", viewAll: "VIEW ALL POSITIONS",
      };

  let page: Content.JobDocument;
  try {
    page = await client.getByUID("job", uid, { lang: locale });
  } catch {
    notFound();
  }

  const formatDate = (date: string | null | undefined) =>
    date
      ? new Date(date).toLocaleDateString(localeForIntl(locale), {
          year: "numeric",
          month: chinese ? "numeric" : "long",
          day: "numeric",
        })
      : "";
  const formattedClosingDate = formatDate(page.data.closing_date);


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
      <article>
        <header
          className="w-full bg-white"
          style={{ paddingTop: "var(--header-height, 128px)" }}
        >
          <div className="w-full max-w-[80rem] mx-auto px-4 lg:px-8 py-8 lg:py-12">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Back Link - subtle, matches news */}
              <nav aria-label="Back navigation">
                <Link
                  href={localizedPath("/careers/vacancies", locale)}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-dark-blue transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {labels.back}
                </Link>
              </nav>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {page.data.department && (
                  <Badge variant="green" className="text-xs lg:text-sm px-3 py-1.5 lg:px-4 lg:py-2">
                    {page.data.department}
                  </Badge>
                )}
                {page.data.featured && (
                  <Badge variant="featured" className="text-xs lg:text-sm px-3 py-1.5 lg:px-4 lg:py-2">
                    {labels.featured}
                  </Badge>
                )}
                {(!isActive || isPastClosingDate) && (
                  <Badge variant="closed" className="text-xs lg:text-sm px-3 py-1.5 lg:px-4 lg:py-2">
                    {labels.closed}
                  </Badge>
                )}
              </div>

            {/* Job Title */}
            <h1 className="text-black text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              {page.data.title}
            </h1>

            {/* Job Meta */}
            <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-sm lg:text-base text-neutral-600 mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-neutral-200">
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
          </div>
        </div>
        </header>

        {/* Article body */}
        <div className="w-full max-w-[80rem] mx-auto px-4 lg:px-8 pb-12 lg:pb-20">
          <div className="max-w-4xl mx-auto">
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
              <div 
                className="mb-12 bg-neutral-200 p-[1.25px]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              >
                <div 
                  className="p-6 lg:p-8 bg-neutral-50"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))'
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-neutral-800 text-xl font-bold mb-2">
                        {labels.interested}
                      </h3>
                      {hasClosingDate && (
                        <p className="text-neutral-600 text-sm">
                          {labels.applicationsClose} {formatDate(closingDate)}
                        </p>
                      )}
                    </div>
                    <div>
                      {hasApplicationUrl ? (
                        <HeroButton asChild size="small">
                          <PrismicNextLink field={applicationUrl} target="_blank" rel="noopener noreferrer">
                            {labels.apply}
                          </PrismicNextLink>
                        </HeroButton>
                      ) : applicationEmail ? (
                        <JobApplicationDialog
                          jobTitle={page.data.title || ""}
                          jobUid={page.uid}
                          closingDate={formattedClosingDate}
                          locale={locale}
                        >
                          <HeroButton size="small">{labels.apply}</HeroButton>
                        </JobApplicationDialog>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job Description */}
            {isFilled.richText(page.data.description) && (
              <div className="mb-12">
                <h2 className="text-neutral-800 text-2xl lg:text-3xl font-bold mb-6">
                  {labels.about}
                </h2>
                <div className="prose prose-sm lg:prose-base max-w-none">
                  <PrismicRichText field={page.data.description} components={createRichTextComponents()} />
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {isFilled.richText(page.data.responsibilities) && (
              <div className="mb-12">
                <h2 className="text-neutral-800 text-2xl lg:text-3xl font-bold mb-6">
                  {labels.responsibilities}
                </h2>
                <div className="prose prose-sm lg:prose-base max-w-none">
                  <PrismicRichText field={page.data.responsibilities} components={createRichTextComponents()} />
                </div>
              </div>
            )}

            {/* Requirements */}
            {isFilled.richText(page.data.requirements) && (
              <div className="mb-12">
                <h2 className="text-neutral-800 text-2xl lg:text-3xl font-bold mb-6">
                  {labels.requirements}
                </h2>
                <div className="prose prose-sm lg:prose-base max-w-none">
                  <PrismicRichText field={page.data.requirements} components={createRichTextComponents()} />
                </div>
              </div>
            )}

            {/* Benefits */}
            {isFilled.richText(page.data.benefits) && (
              <div className="mb-12">
                <h2 className="text-neutral-800 text-2xl lg:text-3xl font-bold mb-6">
                  {labels.benefits}
                </h2>
                <div className="prose prose-sm lg:prose-base max-w-none">
                  <PrismicRichText field={page.data.benefits} components={createRichTextComponents()} />
                </div>
              </div>
            )}

            {/* Application CTA - Bottom */}
            {isActive && !isPastClosingDate && (applicationEmail || hasApplicationUrl) && (
              <div 
                className="mt-16 bg-neutral-200 p-[1.25px]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              >
                <div 
                  className="p-6 lg:p-8 text-neutral-900 bg-[#F0FCFB]"
                 
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                        {labels.ready}
                      </h3>
                      <p className="text-neutral-600">
                        {labels.readyDescription}
                      </p>
                      {hasClosingDate && (
                        <p className="text-neutral-600 text-sm mt-2">
                          {labels.applicationsClose} {formatDate(closingDate)}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {hasApplicationUrl ? (
                        <HeroButton asChild size="small">
                          <PrismicNextLink field={applicationUrl} target="_blank" rel="noopener noreferrer">
                            {labels.apply}
                          </PrismicNextLink>
                        </HeroButton>
                      ) : applicationEmail ? (
                        <JobApplicationDialog
                          jobTitle={page.data.title || ""}
                          jobUid={page.uid}
                          closingDate={formattedClosingDate}
                          locale={locale}
                        >
                          <HeroButton size="small">{labels.apply}</HeroButton>
                        </JobApplicationDialog>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Closed Position Message */}
            {(!isActive || isPastClosingDate) && (
              <div 
                className="mt-16 bg-neutral-200 p-[1.25px]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              >
                <div 
                  className="p-6 lg:p-8 bg-neutral-100 text-center"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))'
                  }}
                >
                  <h3 className="text-neutral-800 text-xl font-bold mb-2">
                    {labels.noApplications}
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    {labels.otherOpportunities}
                  </p>
                  <HeroButton asChild>
                    <Link href={localizedPath("/careers/vacancies", locale)}>
                      {labels.viewAll}
                    </Link>
                  </HeroButton>
                </div>
              </div>
            )}
          </div>
        </div>
        
      </article>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: localizedChrome(locale, "Home", "首页", "होम"), url: localizedPath("/", locale) },
              { name: localizedChrome(locale, "Careers", "招聘职位", "करियर"), url: localizedPath("/careers/vacancies", locale) },
              { name: page.data.title || uid, url: localizedPath(`/job/${uid}`, locale) },
            ])
          ),
        }}
      />
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
              sameAs: SITE_URL,
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
  const { uid, locale = defaultLocale } = await params;
  const client = createClient();

  let page: Content.JobDocument;
  try {
    page = await client.getByUID("job", uid, { lang: locale });
  } catch {
    return {
      title: "Job Not Found",
    };
  }

  const title = page.data.meta_title || `${page.data.title} - ${page.data.department || 'Career'}`;
  const description = page.data.meta_description || page.data.summary || `Join MACH1 Logistics as a ${page.data.title}`;
  const image = page.data.meta_image?.url;
  const url = localizedPath(`/job/${uid}`, locale);

  return {
    title: `${title} | MACH1 Logistics Careers`,
    description,
    alternates: {
      canonical: absoluteUrl(url),
      languages: languageAlternateMap(url),
    },
    openGraph: {
      title: `${title} | MACH1 Logistics Careers`,
      description,
      type: "website",
      url: absoluteUrl(url),
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
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

  // Include ALL job UIDs so pages exist when closing date is updated (unlapsed).
  // Lapsed jobs are handled at render time via notFound() in the page component.
  return pages.map((page) => ({ uid: page.uid }));
}

// Revalidate every hour to check for expired jobs
export const revalidate = 3600;

