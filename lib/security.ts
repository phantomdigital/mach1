import { timingSafeEqual } from "crypto";

export function safeEqual(provided: string, expected: string) {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function sanitizeAttachmentFilename(name: string) {
  const base = name.replace(/^.*[/\\]/, "").replace(/[\r\n]/g, "");
  const cleaned = base.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/_+/g, "_").slice(0, 120);
  return cleaned.replace(/^\.+/, "") || "attachment";
}

export const DOCUMENT_CONTENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;
