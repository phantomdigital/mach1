import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";
import type { Content } from "@prismicio/client";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";
import { formatAuDate } from "@/lib/date-utils";

interface FeaturedArticleProps {
  article: Content.NewsDocument;
  isDarkBackground?: boolean;
}

export default function FeaturedArticle({ article, isDarkBackground = false }: FeaturedArticleProps) {
  // Text colors based on background
  const titleColor = isDarkBackground ? "text-neutral-100" : "text-neutral-800";
  const excerptColor = isDarkBackground ? "text-neutral-200" : "text-neutral-600";
  const metaColor = isDarkBackground ? "text-blue-300/80" : "text-neutral-600";
  const dateColor = isDarkBackground ? "text-blue-300/70" : "text-neutral-500";
  const hoverBorderColor = isDarkBackground ? "group-hover:border-neutral-100" : "group-hover:border-neutral-800";
  const iconColor = isDarkBackground ? "#f5f5f5" : "#262626";
  
  // Card background for dark mode
  const cardBg = isDarkBackground ? "bg-black/40 rounded-xs overflow-hidden" : "";
  const textPadding = isDarkBackground ? "p-4 lg:p-6" : "";
  const imageRounding = isDarkBackground ? "rounded-l-xs" : "rounded-xs";

  return (
    <div className={`w-full ${cardBg}`}>
      <Link
        href={`/news/${article.uid}`}
        className="group block"
      >
        <div className="flex flex-row gap-4 lg:gap-6 items-stretch">
          {/* Image - Square, inline with text, height matches content */}
          <div className={`relative overflow-hidden flex-shrink-0 aspect-square min-w-[8rem] lg:min-w-[10rem] ${imageRounding} bg-neutral-200`}>
            {article.data.featured_image?.url ? (
              <PrismicNextImage
                field={article.data.featured_image}
                fill
                sizes="(max-width: 768px) 128px, 300px"
                quality={95}
                priority
                className={`object-cover transition-transform duration-300 ${imageRounding}`}
              />
            ) : (
              <div className={`absolute inset-0 bg-neutral-200 ${imageRounding}`} />
            )}
          </div>

          {/* Content - Compact spacing */}
          <div className={`space-y-3 ${textPadding}`}>
            {/* Meta Tags */}
            <div className="flex items-center gap-3 flex-wrap">
              {article.data.category && (
                <span 
                  className="inline-block text-green-200 text-[11px] font-bold tracking-wider uppercase px-4 py-1 bg-mach1-green rounded-2xl"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
                >
                  {article.data.category}
                </span>
              )}
              {(article.data as any).article_type && (
                <span className={`text-xs ${metaColor} uppercase tracking-wide`}>
                  {(article.data as any).article_type}
                </span>
              )}
            </div>

            {/* Title - Smaller for compact layout */}
            <h2 className={`${titleColor} text-2xl lg:text-3xl font-bold leading-wide`}>
              <span className={`inline border-b-1 border-transparent ${hoverBorderColor}`}>
                {article.data.title}
              </span>
              <span className="inline-block align-baseline ml-2 lg:ml-3">
                <ExternalLinkIcon
                  className="w-4 h-4 lg:w-5 lg:h-5 opacity-0 group-hover:opacity-100"
                  color={iconColor}
                />
              </span>
            </h2>

            {/* Excerpt - Smaller, 2 lines max */}
            {article.data.excerpt && (
              <p className={`${excerptColor} lg:text-sm text-xs leading-relaxed line-clamp-2`}>
                {article.data.excerpt}
              </p>
            )}

            {/* Date */}
            {article.first_publication_date && (
              <time className={`text-xs ${dateColor}`} dateTime={article.first_publication_date}>
                {formatAuDate(article.first_publication_date)}
              </time>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}


