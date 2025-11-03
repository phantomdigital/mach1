"use client";

import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import type { Content } from "@prismicio/client";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";
import { formatAuDate } from "@/lib/date-utils";

interface NewsCardCompactProps {
  article: Content.NewsDocument;
  index: number;
  isDarkBackground?: boolean;
}

export default function NewsCardCompact({ article, index, isDarkBackground = false }: NewsCardCompactProps) {
  const formattedDate = formatAuDate(article.first_publication_date);




  // Text colors based on background
  const titleColor = isDarkBackground ? "text-neutral-100" : "text-neutral-800";
  const excerptColor = isDarkBackground ? "text-neutral-200" : "text-neutral-600";
  const metaColor = isDarkBackground ? "text-blue-300/80" : "text-neutral-600";
  const dateColor = isDarkBackground ? "text-blue-300/70" : "text-neutral-500";
  const hoverBorderColor = isDarkBackground ? "group-hover:border-neutral-100" : "group-hover:border-neutral-800";
  const iconColor = isDarkBackground ? "#f5f5f5" : "#262626";

  // Card background for dark mode
  const cardBg = isDarkBackground ? "bg-black/40 rounded-xs overflow-hidden" : "";
  const textPadding = isDarkBackground ? "p-4" : "";
  const imageRounding = isDarkBackground ? "rounded-l-xs" : "rounded-xs";

  return (
    <article className={`group ${cardBg}`}>
      <PrismicNextLink 
        document={article}
        className="block w-full"
      >
        <div className="flex flex-row gap-3 lg:gap-4 items-stretch">
          {/* Image - Square, smaller than featured for hierarchy */}
          <div className={`relative overflow-hidden flex-shrink-0 aspect-square min-w-[6rem] lg:min-w-[7rem] ${imageRounding} bg-neutral-200`}>
            {article.data.featured_image?.url ? (
              <PrismicNextImage
                field={article.data.featured_image}
                fill
                sizes="(max-width: 768px) 126px, 312px"
                quality={95}
                className={`object-cover transition-transform duration-300 ${imageRounding}`}
              />
            ) : (
              <div className={`absolute inset-0 bg-neutral-200 ${imageRounding}`} />
            )}
          </div>

          {/* Content - Smaller than featured for hierarchy */}
          <div className={`space-y-2 flex-1 min-w-0 ${textPadding}`}>
            {/* Meta Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {article.data.category && (
                <span 
                  className="inline-block text-green-200 text-[10px] font-bold tracking-wider uppercase px-3 py-0.5 bg-mach1-green rounded-2xl"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
                >
                  {article.data.category}
                </span>
              )}
    
            </div>

            {/* Title - Smaller than featured */}
            <h3 className={`${titleColor} text-lg lg:text-xl font-semibold leading-wide`}>
              <span className={`inline border-b-1 border-transparent ${hoverBorderColor}`}>
                {article.data.title}
              </span>
              <span className="inline-block align-baseline ml-2">
                <ExternalLinkIcon
                  className="w-3 h-3 lg:w-3 lg:h-3 opacity-0 group-hover:opacity-100"
                  color={iconColor}
                />
              </span>
            </h3>

            {/* Excerpt - Smaller, single line */}
            {/* {article.data.excerpt && (
              <p className={`${excerptColor} text-xs leading-relaxed line-clamp-1`}>
                {article.data.excerpt}
              </p>
            )} */}

            {/* Date - Smaller */}
            {article.first_publication_date && (
              <time className={`text-[10px] ${dateColor}`} dateTime={article.first_publication_date}>
                {formatAuDate(article.first_publication_date)}
              </time>
            )}
          </div>
        </div>
      </PrismicNextLink>
    </article>
  );
}

