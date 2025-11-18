import React, { Suspense } from "react";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { isFilled } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { getMarginTopClass, getPaddingTopClass, getPaddingBottomClass, type MarginTopSize, type PaddingSize } from "@/lib/spacing";
import { SliceHeader } from "@/components/slice-header";
import NewsCardCompact from "./news-card-compact";
import FeaturedArticle from "./featured-article";
import { Button } from "@/components/ui/button";
import { PrismicNextLink } from "@prismicio/next";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";

// Lazy load animation component to improve initial page load
const NewsOverviewAnimation = React.lazy(() => import("./news-overview-animation"));

/**
 * Props for `NewsOverview`.
 */
export type NewsOverviewProps = SliceComponentProps<Content.NewsOverviewSlice>;

// Loading skeleton component
function NewsOverviewLoading({ isDarkBlue }: { isDarkBlue: boolean }) {
  const textColor = isDarkBlue ? "text-neutral-300" : "text-neutral-600";
  const bgColor = isDarkBlue ? "bg-neutral-800" : "bg-neutral-200";
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Sidebar skeleton */}
        <div className="lg:col-span-1 space-y-4">
          <div className={`h-6 ${bgColor} rounded w-3/4 animate-pulse`}></div>
          <div className={`h-8 ${bgColor} rounded w-full animate-pulse`}></div>
        </div>
        
        {/* Content skeleton */}
        <div className="lg:col-span-3 space-y-8">
          {/* Featured article skeleton */}
          <div className="flex gap-4 lg:gap-6">
            <div className={`flex-shrink-0 w-32 h-32 lg:w-40 lg:h-40 ${bgColor} rounded animate-pulse`}></div>
            <div className="flex-1 space-y-3">
              <div className={`h-4 ${bgColor} rounded w-1/4 animate-pulse`}></div>
              <div className={`h-6 ${bgColor} rounded w-3/4 animate-pulse`}></div>
              <div className={`h-4 ${bgColor} rounded w-full animate-pulse`}></div>
              <div className={`h-3 ${bgColor} rounded w-1/3 animate-pulse`}></div>
            </div>
          </div>
          
          {/* Preview articles skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3 lg:gap-4">
                <div className={`flex-shrink-0 w-24 h-24 lg:w-28 lg:h-28 ${bgColor} rounded animate-pulse`}></div>
                <div className="flex-1 space-y-2">
                  <div className={`h-3 ${bgColor} rounded w-1/4 animate-pulse`}></div>
                  <div className={`h-5 ${bgColor} rounded w-3/4 animate-pulse`}></div>
                  <div className={`h-2 ${bgColor} rounded w-1/2 animate-pulse`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Data fetching component - wrapped in Suspense for streaming
async function NewsOverviewData({ 
  slice, 
  isDarkBlue, 
  textColors 
}: { 
  slice: Content.NewsOverviewSlice; 
  isDarkBlue: boolean; 
  textColors: { subheading: string; heading: string; lineColor: "dark" | "light" };
}) {
  const client = createClient();
  const previewCount = slice.primary.preview_count || 2;

  let featuredArticle: Content.NewsDocument | null = null;
  let previewArticles: Content.NewsDocument[] = [];

  try {
    // Optimized parallel fetching
    const fetchPromises: Promise<any>[] = [];

    // Fetch featured article if manually selected
    if (isFilled.contentRelationship(slice.primary.featured_article)) {
      fetchPromises.push(
        client.getByID<Content.NewsDocument>(
          slice.primary.featured_article.id
        ).catch(() => null)
      );
    } else {
      fetchPromises.push(Promise.resolve(null));
    }

    // Fetch all articles in parallel
    fetchPromises.push(
      client.getAllByType<Content.NewsDocument>("news", {
        limit: previewCount + 1,
        orderings: [
          { field: "document.first_publication_date", direction: "desc" },
        ],
      }).catch(() => [])
    );

    const [fetchedFeatured, allArticles] = await Promise.all(fetchPromises);

    // If no featured article was manually selected, use the most recent
    featuredArticle = fetchedFeatured || (allArticles.length > 0 ? allArticles[0] : null);

    // Get preview articles (exclude featured article)
    previewArticles = Array.isArray(allArticles)
      ? allArticles
          .filter((article) => article.id !== featuredArticle?.id)
          .slice(0, previewCount)
      : [];

  } catch (error) {
    console.error("Error fetching news articles:", error);
    return null;
  }

  // Don't render if no articles
  if (!featuredArticle && previewArticles.length === 0) {
    return null;
  }

  return (
    <>
      {/* Featured Article */}
      {featuredArticle && (
        <div data-animate="featured-article">
          <FeaturedArticle article={featuredArticle} isDarkBackground={isDarkBlue} />
        </div>
      )}

      {/* Preview Articles Grid - Compact */}
      {previewArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {previewArticles.map((article, index) => (
            <div key={article.id} data-animate="preview-card">
              <NewsCardCompact article={article} index={index} isDarkBackground={isDarkBlue} />
            </div>
          ))}
        </div>
      )}

      {/* View All Button */}
      {slice.primary.show_view_all_button && slice.primary.view_all_link && (
        <div className="flex justify-center mt-8 lg:mt-12" data-animate="button">
          <Button asChild variant="subtle" size="lg">
            <PrismicNextLink 
              field={slice.primary.view_all_link} 
              className={`inline-flex items-center gap-1.5 ${isDarkBlue ? 'text-neutral-100' : 'text-neutral-800'}`}
            >
              <span>{slice.primary.view_all_button_text || "View All News"}</span>
              <ExternalLinkIcon className="w-2.5 h-2.5" color={isDarkBlue ? "#f5f5f5" : "#262626"} />
            </PrismicNextLink>
          </Button>
        </div>
      )}
    </>
  );
}

/**
 * Component for "NewsOverview" Slices.
 * Optimized for below-the-fold rendering with Suspense boundaries.
 */
const NewsOverview = ({ slice }: NewsOverviewProps): React.ReactElement => {
  const marginTop = getMarginTopClass(((slice.primary.margin_top as any) as MarginTopSize) || "large");
  const paddingTop = getPaddingTopClass(((slice.primary.padding_top as any) as PaddingSize) || "large");
  const paddingBottom = getPaddingBottomClass(((slice.primary.padding_bottom as any) as PaddingSize) || "large");
  
  // Background color with white default
  const backgroundColor = slice.primary.background_color || "#ffffff";
  
  // Normalize color for comparison (remove #, spaces, convert to lowercase)
  const normalizedColor = backgroundColor.replace(/#/g, "").replace(/\s/g, "").toLowerCase();
  
  // Check if background is dark-blue or similar dark color
  const isDarkBlue = normalizedColor === "141433" ||
                     normalizedColor === "#141433" ||
                     normalizedColor === "004885" ||
                     normalizedColor === "#004885" ||
                     normalizedColor === "rgb(20,20,51)" ||
                     normalizedColor === "rgba(20,20,51,1)" ||
                     normalizedColor === "rgb(0,72,133)" ||
                     normalizedColor === "rgba(0,72,133,1)" ||
                     backgroundColor.toLowerCase().includes("dark-blue") ||
                     backgroundColor.toLowerCase() === "#0f172a" ||
                     normalizedColor === "0f172a";
  
  // Text colors based on background
  const textColors = isDarkBlue ? {
    subheading: "text-blue-300",
    heading: "text-neutral-100",
    lineColor: "dark" as const,
  } : {
    subheading: "text-neutral-800",
    heading: "text-neutral-800",
    lineColor: "light" as const,
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full ${marginTop} ${paddingTop} ${paddingBottom}`}
      style={{ backgroundColor }}
    >
      <Suspense fallback={<NewsOverviewLoading isDarkBlue={isDarkBlue} />}>
        <NewsOverviewAnimationWrapper isDarkBlue={isDarkBlue}>
          <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
            {/* Asymmetric Grid Layout: Sidebar + Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Left Sidebar - Header Info (25% width) - Renders immediately */}
              <div className="lg:col-span-1 lg:sticky lg:top-32 lg:self-start" data-animate="sidebar">
                <div data-animate="header">
                  <SliceHeader 
                    subheading={slice.primary.subheading} 
                    textColor={textColors.subheading}
                    lineColor={textColors.lineColor}
                    variant={(slice.primary.subheading_variant as "default" | "badge" | "badge-outline" | "underline" | "pill" | "accent-bar" | "minimal") || "badge"}
                    badgeVariant={(slice.primary.subheading_badge_variant as "green" | "featured" | "closed" | "success" | "pending" | "red" | "default" | "secondary" | "destructive") || "green"}
                  />
                </div>
                
                {isFilled.keyText(slice.primary.heading) && (
                  <h2 className={`${textColors.heading} text-xl lg:text-2xl font-bold mt-4 leading-tight`}>
                    {slice.primary.heading}
                  </h2>
                )}
              </div>

              {/* Right Content Area (75% width) - Suspended for streaming */}
              <div className="lg:col-span-3 space-y-8 lg:space-y-12">
                <Suspense fallback={<NewsOverviewLoading isDarkBlue={isDarkBlue} />}>
                  <NewsOverviewData slice={slice} isDarkBlue={isDarkBlue} textColors={textColors} />
                </Suspense>
              </div>
            </div>
          </div>
        </NewsOverviewAnimationWrapper>
      </Suspense>
    </section>
  );
};

// Wrapper component for lazy-loaded animation
function NewsOverviewAnimationWrapper({ 
  children, 
  isDarkBlue 
}: { 
  children: React.ReactNode; 
  isDarkBlue: boolean;
}) {
  return (
    <Suspense fallback={<div>{children}</div>}>
      <NewsOverviewAnimation>{children}</NewsOverviewAnimation>
    </Suspense>
  );
}

export default NewsOverview;
