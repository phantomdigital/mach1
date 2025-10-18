"use client";

import { useLegalDates } from "./legal-dates-context";
import { formatLegalDates } from "@/lib/date-utils";

interface LegalHeaderProps {
  pageTitle?: string | null;
}

export function LegalHeader({ pageTitle }: LegalHeaderProps) {
  const { firstPublicationDate, lastPublicationDate } = useLegalDates();

  return (
    <div className="text-center">
      {/* Title */}
      {pageTitle && (
        <h1 className="text-neutral-800 text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6">
          {pageTitle}
        </h1>
      )}
      
      {/* Dates - Automatically from Prismic */}
      {firstPublicationDate && (
        <p className="text-neutral-600 text-sm lg:text-base">
          {formatLegalDates(firstPublicationDate, lastPublicationDate)}
        </p>
      )}
    </div>
  );
}

