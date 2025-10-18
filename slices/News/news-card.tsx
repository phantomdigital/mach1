"use client";

import { useRef, useEffect, useState } from "react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import type { Content } from "@prismicio/client";
import { motion } from "framer-motion";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";
import ClippedCardShape from "../Steps/clipped-card-shape";

interface NewsCardProps {
  article: Content.NewsDocument;
  index: number;
}

export function NewsCard({ article, index }: NewsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 582, height: 579 });

  useEffect(() => {
    if (cardRef.current) {
      const updateDimensions = () => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
          setDimensions({ width: rect.width, height: rect.height });
        }
      };
      
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get author name from relationship
  const authorName = article.data.author && typeof article.data.author !== 'string' && 'data' in article.data.author
    ? (article.data.author as any).data?.name
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <PrismicNextLink 
        document={article}
        className="block"
      >
        {/* Clipped Image Card */}
        <div 
          ref={cardRef}
          className="relative overflow-hidden transition-all duration-300 cursor-pointer mb-6"
          style={{ aspectRatio: '1 / 0.5' }}
        >
          {/* Background image - masked to shape */}
          {article.data.featured_image?.url ? (
            <div 
              className="absolute inset-0 z-0"
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
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                quality={85}
                className="object-cover transition-transform duration-300"
              />
            </div>
          ) : (
            /* Clipped background shape when no image */
            <div className="absolute inset-0 z-0 text-neutral-200 group-hover:text-neutral-300 transition-colors duration-300">
              <ClippedCardShape width={dimensions.width} height={dimensions.height} />
            </div>
          )}

          {/* Category Badge - Top Left */}
          {article.data.category && (
            <span 
              className="absolute top-4 left-4 z-10 inline-block text-green-200 text-xs font-bold tracking-wider uppercase px-4 py-2 bg-mach1-green rounded-2xl"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
            >
              {article.data.category}
            </span>
          )}
        </div>

        {/* Content Below Image */}
        <div className="space-y-3">
          {/* Article Type */}
          {(article.data as any).article_type && (
            <span className="text-xs text-neutral-600 uppercase tracking-wide">
              {(article.data as any).article_type}
            </span>
          )}

          {/* Title with hover icon */}
          <h3 className="text-neutral-800 text-xl lg:text-2xl font-semibold leading-tight">
            <span className="inline border-b-2 border-transparent group-hover:border-neutral-800">
              {article.data.title}
            </span>
            <span className="inline-block align-baseline ml-2">
              <ExternalLinkIcon
                className="w-[13px] h-[13px] opacity-0 group-hover:opacity-100"
                color="#262626"
              />
            </span>
          </h3>

          {/* Excerpt */}
          {article.data.excerpt && (
            <p className="text-neutral-600 text-sm lg:text-base line-clamp-2 leading-relaxed">
              {article.data.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-neutral-500 pt-2">
            {authorName && <span>{authorName}</span>}
            {authorName && article.first_publication_date && (
              <span>•</span>
            )}
            {article.first_publication_date && (
              <time dateTime={article.first_publication_date}>
                {formatDate(article.first_publication_date)}
              </time>
            )}
          </div>
        </div>
      </PrismicNextLink>
    </motion.article>
  );
}

