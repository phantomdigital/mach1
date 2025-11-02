import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { NewsFilters } from "./news-filters";
import { FeaturedHero } from "./featured-hero";
import { HeroButton } from "@/components/ui/hero-button";
import { PrismicNextLink } from "@prismicio/next";

/**
 * Props for `News`.
 */
export type NewsProps = SliceComponentProps<Content.NewsSlice>;

/**
 * Component for "News" Slices.
 */
const News = async ({ slice }: NewsProps): Promise<React.ReactElement> => {
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
  const showFeaturedHero = (slice.primary as any).show_featured_hero ?? true;
  const enableLoadMore = (slice.primary as any).enable_load_more ?? false;
  const initialCount = (slice.primary as any).initial_articles_count || 9;
  
  let allArticles: Content.NewsDocument[] = [];
  let allArticlesForFilters: Content.NewsDocument[] = [];
  let featuredArticle: Content.NewsDocument | null = null;
  
  try {
    // Fetch ALL articles
    allArticles = await client.getAllByType<Content.NewsDocument>("news", {
      limit: 100,
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

    // Keep a copy for filter building (includes featured article)
    allArticlesForFilters = [...allArticles];

    // Fetch featured article if enabled and selected
    if (showFeaturedHero && isFilled.contentRelationship(slice.primary.featured_article)) {
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
        // Remove the featured article from the regular list (but keep in filter list)
        allArticles = allArticles.filter((article) => article.id !== featuredArticle?.id);
      } catch (error) {
        console.error("Error fetching featured article:", error);
        // If fetching featured article fails, fall back to no featured article
        featuredArticle = null;
      }
    }
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return <></>;
  }

  if (!featuredArticle && allArticles.length === 0) {
    return <></>;
  }

  return (
    <>
      {/* Featured Hero - Full Width Section */}
      {showFeaturedHero && featuredArticle && (
        <section className={`w-full py-16 lg:py-24 bg-neutral-100 ${getMarginTopClass()}`}>
          <div className="w-full max-w-[90rem] mx-auto px-4 lg:px-8">
            <FeaturedHero article={featuredArticle} />
          </div>
        </section>
      )}

      {/* Articles Grid Section */}
      <section className={`w-full py-16 lg:py-24 bg-white ${!showFeaturedHero || !featuredArticle ? getMarginTopClass() : ''}`}>
        <div className="w-full max-w-[90rem] mx-auto px-4 lg:px-8">
          {/* Heading */}
          {slice.primary.heading && (
            <h2 className="text-neutral-800 text-2xl lg:text-4xl font-bold mb-8 lg:mb-12">
              {slice.primary.heading}
            </h2>
          )}

          {/* Client-side Filters and Articles */}
          <NewsFilters
            allArticles={allArticles}
            allArticlesForFilters={allArticlesForFilters}
            enableLoadMore={enableLoadMore}
            initialCount={initialCount}
          />

          {/* View All Button */}
          {!enableLoadMore && slice.primary.show_all_button && slice.primary.view_all_link && (
            <div className="mt-12 flex justify-center">
              <HeroButton asChild>
                <PrismicNextLink field={slice.primary.view_all_link}>
                  VIEW ALL NEWS
                </PrismicNextLink>
              </HeroButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default News;
