/**
 * Format a date string to Australian format
 * Example: "15 October 2024"
 */
export function formatAuDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date range or single date for legal documents
 * Shows "Updated on [date] - Effective from [date]" or just "Effective from [date]"
 */
export function formatLegalDates(
  firstPublicationDate: string | null | undefined,
  lastPublicationDate: string | null | undefined
): string {
  if (!firstPublicationDate) return "";
  
  const firstDate = formatAuDate(firstPublicationDate);
  const lastDate = formatAuDate(lastPublicationDate);
  
  if (lastPublicationDate && lastPublicationDate !== firstPublicationDate) {
    return `Updated on ${lastDate} - Effective from ${firstDate}`;
  }
  
  return `Effective from ${firstDate}`;
}

