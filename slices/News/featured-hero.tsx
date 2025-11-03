import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";
import type { Content } from "@prismicio/client";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";
import ClippedCardShape from "../Steps/clipped-card-shape";

interface FeaturedHeroProps {
  article: Content.NewsDocument;
}

export function FeaturedHero({ article }: FeaturedHeroProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Heading */}
      <h5 className="text-neutral-800 text-sm font-medium mb-6 uppercase tracking-wider">
        Featured Article
      </h5>

      <Link
        href={`/news/${article.uid}`}
        className="group block"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image with Clipping */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 0.5' }}>
            {article.data.featured_image?.url ? (
              <>
                {/* Background image - masked to shape */}
                <div 
                  className="absolute inset-0"
                  style={{
                    mask: `url("data:image/svg+xml,${encodeURIComponent(`
                      <svg width="582" height="579" viewBox="0 0 582 579" xmlns="http://www.w3.org/2000/svg">
                        <path d="M581.5 155.574L376.424 7.5285C370.041 3.04306 362.54 0.439749 354.775 0L260.374 1.52588e-05V0.0351952L0 1.52588e-05V423.426L205.076 571.471C211.459 575.957 218.96 578.56 226.725 579H271.626V578.965L581.5 579V155.574Z" fill="white"/>
                      </svg>
                    `)}")`,
                    maskSize: 'cover',
                    maskPosition: 'center',
                    maskRepeat: 'no-repeat'
                  }}
                >
                  <PrismicNextImage
                    field={article.data.featured_image}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                    quality={85}
                    priority
                    className="object-cover transition-transform duration-300"
                  />
                </div>

                {/* Clipped background shape overlay */}
                <div className="absolute inset-0 text-neutral-800/1 pointer-events-none">
                  <ClippedCardShape width={800} height={400} />
                </div>

                {/* Gradient overlays for depth */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-transparent pointer-events-none"
                  style={{
                    mask: `url("data:image/svg+xml,${encodeURIComponent(`
                      <svg width="582" height="579" viewBox="0 0 582 579" xmlns="http://www.w3.org/2000/svg">
                        <path d="M581.5 155.574L376.424 7.5285C370.041 3.04306 362.54 0.439749 354.775 0L260.374 1.52588e-05V0.0351952L0 1.52588e-05V423.426L205.076 571.471C211.459 575.957 218.96 578.56 226.725 579H271.626V578.965L581.5 579V155.574Z" fill="white"/>
                      </svg>
                    `)}")`,
                    maskSize: 'cover',
                    maskPosition: 'center',
                    maskRepeat: 'no-repeat'
                  }}
                />
              </>
            ) : (
              <div className="absolute inset-0 text-neutral-200">
                <ClippedCardShape width={800} height={400} />
              </div>
            )}
          </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Meta Tags */}
          <div className="flex items-center gap-3 flex-wrap">
            {article.data.category && (
              <span 
                className="inline-block text-green-200 text-xs font-bold tracking-wider uppercase px-4 py-2 bg-mach1-green rounded-2xl"
                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
              >
                {article.data.category}
              </span>
            )}
            {(article.data as any).article_type && (
              <span className="text-xs text-neutral-600 uppercase tracking-wide">
                {(article.data as any).article_type}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-neutral-800 text-3xl lg:text-5xl font-bold leading-tight">
            <span className="inline border-b-2 border-transparent group-hover:border-neutral-800">
              {article.data.title}
            </span>
            <span className="inline-block align-baseline ml-3">
              <ExternalLinkIcon
                className="w-5 h-5 lg:w-6 lg:h-6 opacity-0 group-hover:opacity-100"
                color="#262626"
              />
            </span>
          </h2>

          {/* Excerpt */}
          {article.data.excerpt && (
            <p className="text-neutral-600 text-lg leading-relaxed line-clamp-3">
              {article.data.excerpt}
            </p>
          )}

          {/* Date */}
          {article.first_publication_date && (
            <time className="text-sm text-neutral-500" dateTime={article.first_publication_date}>
              {formatDate(article.first_publication_date)}
            </time>
          )}
        </div>
        </div>
      </Link>
    </div>
  );
}
