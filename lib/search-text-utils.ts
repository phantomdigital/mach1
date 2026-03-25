import type { PrismicDocument, RichTextField } from "@prismicio/client";
import { asText } from "@prismicio/client/richtext";

const MAX_SLICE_TEXT_CHARS = 120_000;

/**
 * Recursively pull searchable text from slice `primary` / repeat-group rows.
 * Includes rich text (via `asText`), plain strings, image alt text, etc.
 */
function collectTextFromUnknown(value: unknown, depth = 0): string {
  if (depth > 24) return "";
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    const first = value[0];
    if (typeof first === "object" && first !== null && "type" in first) {
      try {
        return asText(value as RichTextField).trim();
      } catch {
        // not a rich-text block list — treat as array of rows
      }
    }
    return value
      .map((v) => collectTextFromUnknown(v, depth + 1))
      .filter(Boolean)
      .join(" ");
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    // Image / embed-ish: prefer alt only, avoid dumping raw asset URLs into snippets
    if (obj.dimensions && typeof obj.url === "string") {
      return typeof obj.alt === "string" ? obj.alt.trim() : "";
    }
    if (typeof obj.text === "string" && obj.text.trim()) {
      return obj.text.trim();
    }
    return Object.values(obj)
      .map((v) => collectTextFromUnknown(v, depth + 1))
      .filter(Boolean)
      .join(" ");
  }

  return "";
}

function extractSliceZoneText(slices: unknown): string {
  if (!Array.isArray(slices)) return "";
  const parts: string[] = [];
  for (const slice of slices) {
    if (!slice || typeof slice !== "object") continue;
    const s = slice as Record<string, unknown>;
    if (s.primary) parts.push(collectTextFromUnknown(s.primary));
    if (Array.isArray(s.items)) {
      for (const row of s.items) {
        parts.push(collectTextFromUnknown(row));
      }
    }
  }
  const joined = parts.filter(Boolean).join(" ");
  return joined.length > MAX_SLICE_TEXT_CHARS
    ? joined.slice(0, MAX_SLICE_TEXT_CHARS)
    : joined;
}

/**
 * Document-level fields plus slice zone plain text so snippets can reflect body matches
 * (Prismic `fulltext` already searches slices; this aligns excerpts with that behavior).
 */
export function extractPrimaryText(doc: PrismicDocument): string {
  const data = doc.data as Record<string, unknown>;
  const keys = [
    "description",
    "excerpt",
    "meta_description",
    "summary",
    "role",
    "category",
  ] as const;
  const parts: string[] = [];
  for (const k of keys) {
    const v = data[k];
    if (typeof v === "string" && v.trim()) {
      parts.push(v.trim());
    }
  }
  const sliceText = extractSliceZoneText(data.slices);
  if (sliceText) parts.push(sliceText);
  return parts.join(" ");
}

/**
 * Prefer a window around the first match of any query term; otherwise head-truncate.
 */
export function clipAroundMatch(text: string, query: string, maxLen: number): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length >= 1);
  if (terms.length === 0 || maxLen <= 0) {
    return trimmed.length <= maxLen ? trimmed : `${trimmed.slice(0, maxLen)}…`;
  }

  const lower = trimmed.toLowerCase();
  let idx = -1;
  for (const term of terms) {
    const t = term.toLowerCase();
    if (t.length < 1) continue;
    const i = lower.indexOf(t);
    if (i >= 0) {
      idx = i;
      break;
    }
  }

  if (idx < 0) {
    return trimmed.length <= maxLen ? trimmed : `${trimmed.slice(0, maxLen)}…`;
  }

  const half = Math.floor(maxLen / 2);
  const start = Math.max(0, idx - half);
  const end = Math.min(trimmed.length, start + maxLen);
  const adjustedStart = end - start < maxLen ? Math.max(0, end - maxLen) : start;
  const prefix = adjustedStart > 0 ? "…" : "";
  const suffix = end < trimmed.length ? "…" : "";
  return prefix + trimmed.slice(adjustedStart, end) + suffix;
}
