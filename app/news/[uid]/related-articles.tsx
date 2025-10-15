"use client";

import type { Content } from "@prismicio/client";
import { NewsCard } from "@/slices/News/news-card";

interface RelatedArticlesProps {
  articles: Content.NewsDocument[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="w-full py-16 lg:py-24 bg-neutral-50">
      <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8">
        <h2 className="text-neutral-800 text-3xl lg:text-4xl font-bold mb-8 lg:mb-12">
          Related Articles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {articles.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

