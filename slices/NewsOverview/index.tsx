import React from "react";
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
import NewsOverviewAnimation from "./news-overview-animation";

/**
 * Props for `NewsOverview`.
 */
export type NewsOverviewProps = SliceComponentProps<Content.NewsOverviewSlice>;

/**
 * Component for "NewsOverview" Slices.
 */
const NewsOverview = async ({ slice }: NewsOverviewProps): Promise<React.ReactElement> => {
  const client = createClient();

  const marginTop = getMarginTopClass(((slice.primary.margin_top as any) as MarginTopSize) || "large");
  const paddingTop = getPaddingTopClass(((slice.primary.padding_top as any) as PaddingSize) || "large");
  const paddingBottom = getPaddingBottomClass(((slice.primary.padding_bottom as any) as PaddingSize) || "large");
  
  // Background color with white default
  const backgroundColor = slice.primary.background_color || "#ffffff";
  
  // Normalize color for comparison (remove #, spaces, convert to lowercase)
  const normalizedColor = backgroundColor.replace(/#/g, "").replace(/\s/g, "").toLowerCase();
  
  // Check if background is dark-blue (#141433) or similar dark color
  // Also check for Tailwind's dark-blue class reference if stored as a class name
  const isDarkBlue = normalizedColor === "141433" ||
                     normalizedColor === "#141433" ||
                     normalizedColor === "rgb(20,20,51)" ||
                     normalizedColor === "rgba(20,20,51,1)" ||
                     backgroundColor.toLowerCase().includes("dark-blue") ||
                     backgroundColor.toLowerCase() === "#0f172a" || // Tailwind slate-900
                     normalizedColor === "0f172a";
  
  // Text colors based on background
  const textColors = isDarkBlue ? {
    subheading: "text-blue-300",       // Light blue for subheading (complements dark-blue #141433)
    heading: "text-neutral-100",       // White for main heading (main text stays neutral)
    lineColor: "dark" as const,        // Dark line for contrast
  } : {
    subheading: "text-neutral-800",    // Default dark text
    heading: "text-neutral-800",       // Default dark text
    lineColor: "light" as const,       // Light line for default
  };
  
  // Number of preview articles to show (default 2)
  const previewCount = slice.primary.preview_count || 2;

  let featuredArticle: Content.NewsDocument | null = null;
  let previewArticles: Content.NewsDocument[] = [];

  try {
    // Fetch featured article - either manually selected or most recent
    if (isFilled.contentRelationship(slice.primary.featured_article)) {
      // Use manually selected featured article
      try {
        featuredArticle = await client.getByID<Content.NewsDocument>(
          slice.primary.featured_article.id,
          {
            graphQuery: `{
              news {
                ...newsFields
                author {
                  ...on author {
                    name
                    profile_photo
                  }
                }
              }
            }`,
          }
        );
      } catch (error) {
        console.error("Error fetching featured article:", error);
      }
    }

    // Fetch all articles for preview selection
    const allArticles = await client.getAllByType<Content.NewsDocument>("news", {
      limit: previewCount + 1, // Fetch one extra in case featured is in the list
      orderings: [
        { field: "document.first_publication_date", direction: "desc" },
      ],
      graphQuery: `{
        news {
          ...newsFields
          author {
            ...on author {
              name
              profile_photo
            }
          }
        }
      }`,
    });

    // If no featured article was manually selected, use the most recent
    if (!featuredArticle && allArticles.length > 0) {
      featuredArticle = allArticles[0];
    }

    // Get preview articles (exclude featured article)
    previewArticles = allArticles
      .filter((article) => article.id !== featuredArticle?.id)
      .slice(0, previewCount);

  } catch (error) {
    console.error("Error fetching news articles:", error);
    return <></>;
  }

  // Don't render if no articles
  if (!featuredArticle && previewArticles.length === 0) {
    return <></>;
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full ${marginTop} ${paddingTop} ${paddingBottom}`}
      style={{ backgroundColor }}
    >
      <NewsOverviewAnimation>
        <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
          {/* Asymmetric Grid Layout: Sidebar + Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Left Sidebar - Header Info (25% width) */}
            <div className="lg:col-span-1 lg:sticky lg:top-32 lg:self-start" data-animate="sidebar">
              <div data-animate="header">
                <SliceHeader 
                  subheading={slice.primary.subheading} 
                  textColor={textColors.subheading}
                  lineColor={textColors.lineColor}
                  variant="badge"
                  badgeVariant="green"
                />
              </div>
              
              {slice.primary.heading && (
                <h2 className={`${textColors.heading} text-xl lg:text-2xl font-bold mt-4 leading-tight`}>
                  {slice.primary.heading}
                </h2>
              )}
            </div>

            {/* Right Content Area (75% width) */}
            <div className="lg:col-span-3 space-y-8 lg:space-y-12">
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
                      <span>{slice.primary.view_all_button_text || "All news"}</span>
                      <ExternalLinkIcon className="w-2.5 h-2.5" color="currentColor" />
                    </PrismicNextLink>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </NewsOverviewAnimation>
    </section>
  );
};

export default NewsOverview;

