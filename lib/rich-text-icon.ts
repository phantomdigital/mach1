const ICON_ALT_PREFIX =
  /^\[(?:icon|图标)(?:[:：]\s*(\d+(?:\.\d+)?)\s*[,，.]\s*(\d+(?:\.\d+)?))?\]\s*/i;

function parsePadding(value?: string) {
  if (value == null) return 0;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.min(16, parsed) : 0;
}

export function parseRichTextIconAlt(
  altText: string,
  labels?: { label?: string | null; dataLabel?: string | null }
) {
  const match = altText.match(ICON_ALT_PREFIX);
  const isIcon =
    labels?.dataLabel === "icon" ||
    labels?.label === "icon" ||
    Boolean(match);

  return {
    isIcon,
    displayAlt: match ? altText.replace(ICON_ALT_PREFIX, "").trim() : altText,
    iconPx: parsePadding(match?.[1]),
    iconPy: parsePadding(match?.[2]),
    iconNoMargin:
      parsePadding(match?.[1]) === 0 && parsePadding(match?.[2]) === 0,
  };
}
