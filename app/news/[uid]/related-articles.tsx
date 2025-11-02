"use client";

import type { Content } from "@prismicio/client";
import { NewsCard } from "@/slices/News/news-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface RelatedArticlesProps {
  articles: Content.NewsDocument[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="w-full py-12 lg:py-20 bg-neutral-50">
      <div className="w-full max-w-[88rem] mx-auto px-4 lg:px-8">
        <h2 className="text-neutral-800 text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-10">
          Related Articles
        </h2>
        
        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {articles.map((article, index) => (
                <CarouselItem key={article.id} className="pl-4 basis-[85%] sm:basis-[70%]">
                  <NewsCard article={article} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-6">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

