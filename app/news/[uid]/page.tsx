import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SliceZone, PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { PrismicNextImage } from "@prismicio/next";
import type { Content, RichTextField, ImageField } from "@prismicio/client";
import { ShareButtons } from "./share-buttons";
import { RelatedArticles } from "./related-articles";
import { LightboxWrapper } from "./lightbox-wrapper";

type Params = { uid: string };

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid } = await params;
  const client = createClient();

  let page: Content.NewsDocument;
  try {
    try {
      page = await client.getByUID("news", uid, {
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
    } catch (fetchError) {
      // If graphQuery fails (e.g., author type doesn't exist yet), try without it
      console.warn("Failed to fetch with author data, trying without:", fetchError);
      page = await client.getByUID("news", uid);
    }
  } catch {
    notFound();
  }

  // Fetch related articles (3 most recent, excluding current)
  let relatedArticles: Content.NewsDocument[] = [];
  try {
    const allArticles = await client.getAllByType<Content.NewsDocument>("news", {
      limit: 4,
      orderings: [{ field: "document.first_publication_date", direction: "desc" }],
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
    relatedArticles = allArticles.filter((article) => article.id !== page.id).slice(0, 3);
  } catch (error) {
    console.warn("Failed to fetch related articles:", error);
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate reading time
  const calculateReadingTime = (content: RichTextField) => {
    if (!content) return 0;
    const text = content.map((block) => ('text' in block ? block.text : '') || "").join(" ");
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 200); // Average reading speed: 200 words per minute
  };
  const readingTime = calculateReadingTime(page.data.content);

  // Get author data from relationship
  const authorData = page.data.author && typeof page.data.author !== 'string' && 'data' in page.data.author
    ? (page.data.author as { data?: { name?: string; profile_photo?: ImageField } }).data
    : null;
  const authorName = authorData?.name;
  const authorPhoto = authorData?.profile_photo;

  // Get full URL for sharing
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mach1logistics.com.au";
  const fullUrl = `${baseUrl}/news/${uid}`;

  // Get author initials for placeholder
  const getAuthorInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <main>
      {/* Article Header */}
      <section className="w-full pt-32 pb-12 lg:pt-56 lg:pb-20 bg-white">
        <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <div className="mb-6 lg:mb-8">
              <Link 
                href="/news" 
                className="inline-flex items-center gap-2 text-sm lg:text-base text-neutral-600 hover:text-dark-blue transition-colors"
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to News
              </Link>
            </div>

            {/* Category */}
            {page.data.category && (
              <span 
                className="inline-block text-green-200 text-xs lg:text-sm font-bold tracking-wider uppercase px-3 py-1.5 lg:px-4 lg:py-2 bg-mach1-green rounded-2xl mb-4 lg:mb-6"
                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
              >
                {page.data.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-neutral-800 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 leading-tight">
              {page.data.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-xs sm:text-sm text-neutral-600 mb-6 lg:mb-8">
              {authorName && (
                <div className="flex items-center gap-2">
                  {authorPhoto?.url ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                      <PrismicNextImage
                        field={authorPhoto}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-dark-blue flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {getAuthorInitials(authorName)}
                    </div>
                  )}
                  <span>{authorName}</span>
                </div>
              )}
              {authorName && page.first_publication_date && <span>•</span>}
              {page.first_publication_date && (
                <time dateTime={page.first_publication_date}>
                  {formatDate(page.first_publication_date)}
                </time>
              )}
              {(authorName || page.first_publication_date) && readingTime > 0 && <span>•</span>}
              {readingTime > 0 && <span>{readingTime} min read</span>}
            </div>

            {/* Featured Image */}
            {page.data.featured_image?.url && (
              <div 
                className="relative aspect-[16/9] bg-neutral-100 mb-8 lg:mb-12 overflow-hidden"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 40px 100%, 0 calc(100% - 40px))'
                }}
              >
                <PrismicNextImage
                  field={page.data.featured_image}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  quality={90}
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            {page.data.content && (
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 lg:mb-12">
                <PrismicRichText field={page.data.content} />
              </div>
            )}

            {/* Lightbox functionality (client-side only) */}
            <LightboxWrapper 
              featuredImage={page.data.featured_image}
              content={page.data.content}
            />

            {/* Share Buttons */}
            <div className="pt-6 lg:pt-8 border-t border-neutral-200">
              <ShareButtons url={fullUrl} title={page.data.title || ""} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <RelatedArticles articles={relatedArticles} />

      {/* Slices */}
      <SliceZone slices={page.data.slices} components={components} />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: page.data.title,
            description: page.data.excerpt,
            image: page.data.featured_image?.url,
            datePublished: page.first_publication_date,
            dateModified: page.last_publication_date || page.first_publication_date,
            author: authorName ? {
              "@type": "Person",
              name: authorName,
            } : undefined,
            publisher: {
              "@type": "Organization",
              name: "MACH1 Logistics",
              logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/logo.png`,
              },
            },
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

  let page: Content.NewsDocument;
  try {
    try {
      page = await client.getByUID("news", uid, {
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
    } catch (fetchError) {
      // If graphQuery fails (e.g., author type doesn't exist yet), try without it
      console.warn("Failed to fetch with author data, trying without:", fetchError);
      page = await client.getByUID("news", uid);
    }
  } catch {
    return {
      title: "Article Not Found",
    };
  }

  const title = page.data.meta_title || page.data.title || "News Article";
  const description =
    page.data.meta_description || page.data.excerpt || undefined;
  const image = page.data.meta_image?.url || page.data.featured_image?.url;
  
  // Get author name from relationship
  const authorName = page.data.author && typeof page.data.author !== 'string' && 'data' in page.data.author
    ? (page.data.author as { data?: { name?: string } }).data?.name
    : null;

  return {
    title: `${title} | MACH1 Logistics`,
    description,
    openGraph: {
      title: `${title} | MACH1 Logistics`,
      description,
      type: "article",
      publishedTime: page.first_publication_date,
      modifiedTime: page.last_publication_date,
      authors: authorName ? [authorName] : undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MACH1 Logistics`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("news");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}

