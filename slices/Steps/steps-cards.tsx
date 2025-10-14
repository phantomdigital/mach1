"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ClippedCardShape from "./clipped-card-shape";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";
import { PrismicNextImage } from "@prismicio/next";
import type { ImageField } from "@prismicio/client";
import { cardVariants, containerVariants } from "./step-animations";

interface CardData {
  label: string;
  value: string;
  hasLinkIcon: boolean;
  image?: ImageField;
  isTextOption?: boolean;
}

interface StepsCardsProps {
  cards: Array<CardData>;
  onSelect: (value: string) => void;
}

interface CardButtonProps {
  card: CardData;
  onSelect: (value: string) => void;
}

function CardButton({ card, onSelect }: CardButtonProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
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

  return (
    <motion.button
      ref={cardRef}
      onClick={() => onSelect(card.value)}
      variants={cardVariants}
      whileHover="hover"
      className="relative group overflow-hidden transition-all duration-300 cursor-pointer"
      style={{ aspectRatio: '1 / 0.5' }}
    >
          {/* Background image (if provided) - masked to shape */}
          {card.image && card.image.url && (
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
                field={card.image}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Clipped background shape with modern gradient overlay */}
          <div className={`absolute inset-0 transition-colors duration-300 ${
            card.image && card.image.url 
              ? 'text-neutral-800/60 group-hover:text-neutral-800/70' 
              : 'text-neutral-200 group-hover:text-neutral-300'
          }`}>
            <ClippedCardShape width={dimensions.width} height={dimensions.height} />
          </div>

          {/* Modern gradient overlays for text contrast */}
          {card.image && card.image.url && (
            <>
              {/* Dark gradient overlay for better text readability */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"
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
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
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
          )}


          {/* Content */}
          <div className="relative h-full flex items-center justify-center px-4 sm:px-8 md:px-12">
            {/* Text container centered in card with text left-aligned inside */}
            <div className="relative" style={{ maxWidth: '85%' }}>
              {/* Vertical hover bar - positioned to the left of text */}
              <div 
                className="absolute w-0.5 bg-white transition-all duration-300 ease-out origin-bottom scale-y-0 group-hover:scale-y-100 hidden sm:block"
                style={{
                  left: '-1rem',
                  bottom: 0,
                  height: '100%',
                }}
              />
              
              <div className="text-left">
                <span
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-150 ease-out inline ${
                    card.image && card.image.url ? 'text-white' : 'text-neutral-800'
                  }`}
                  style={{ 
                    fontFamily: "var(--font-inter-tight)",
                    lineHeight: '1.1',
                  }}
                >
                  {card.label}
                </span>
                
                {/* Arrow icon - inline with the last line of text */}
                {card.hasLinkIcon && (
                  <span className="inline-block align-baseline ml-3 sm:ml-6">
                    <ExternalLinkIcon 
                      className={`w-[20px] h-[20px] sm:w-[28px] sm:h-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                        card.image && card.image.url ? 'text-white' : 'text-neutral-800'
                      }`}
                      color={card.image && card.image.url ? "#FFFFFF" : "#262626"}
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.button>
  );
}

export default function StepsCards({ cards, onSelect }: StepsCardsProps) {
  // Separate full cards from text options
  const fullCards = cards.filter(card => !card.isTextOption);
  const textOptions = cards.filter(card => card.isTextOption);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* Full Card Grid - responsive: 1 column on mobile, 2 on tablet+ */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"
      >
        {fullCards.map((card, idx) => (
          <CardButton key={card.value} card={card} onSelect={onSelect} />
        ))}
      </motion.div>

      {/* Text Options - smaller, centered */}
      {textOptions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-4"
        >
          {textOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => onSelect(option.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-neutral-600 hover:text-dark-blue text-sm sm:text-base font-medium transition-colors duration-200 underline underline-offset-4 decoration-neutral-300 hover:decoration-dark-blue cursor-pointer"
              style={{ fontFamily: "var(--font-inter-tight)" }}
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
