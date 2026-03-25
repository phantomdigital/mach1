import type { ReactNode } from "react";

type HighlightedTextProps = {
  text: string;
  query: string;
  className?: string;
};

/**
 * Wraps substring matches for query terms in <mark> (case-insensitive).
 */
export function HighlightedText({ text, query, className }: HighlightedTextProps): ReactNode {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const terms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length >= 2);
  if (terms.length === 0) {
    return <span className={className}>{trimmed}</span>;
  }

  const pattern = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const re = new RegExp(`(${pattern})`, "gi");
  const parts = trimmed.split(re);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className="bg-amber-200/90 text-neutral-900 rounded-sm px-0.5 not-prose"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
