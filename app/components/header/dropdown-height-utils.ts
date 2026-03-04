import type { HeaderDocumentDataNavigationItem } from "@/types.generated";

/**
 * Computes the dropdown height for a single navigation item using the same
 * formula as NavigationDropdown. Used to determine the max height across all
 * dropdowns so they can share a consistent minimum height.
 */
function computeDropdownHeightForItem(item: HeaderDocumentDataNavigationItem): number {
  const dropdownItems = item.dropdown_items ?? [];
  if (dropdownItems.length === 0) return 0;

  const hasIndividualImages = dropdownItems.some((i) => i.image?.url);
  const hasDropdownImage = Boolean(
    (item.dropdown_image?.url) || hasIndividualImages
  );

  const itemHeight = 55;
  const headerHeight = 48;
  const topPadding = 40;
  const bottomPadding = hasDropdownImage ? 32 : 20;
  const edgeBuffer = hasDropdownImage ? 100 : 60;

  const contentHeight =
    topPadding +
    headerHeight +
    dropdownItems.length * itemHeight +
    bottomPadding;
  const minHeight = contentHeight + edgeBuffer;
  const minImageHeight = hasDropdownImage ? 320 : 280;

  return Math.max(minHeight, minImageHeight);
}

/**
 * Returns the maximum height across all navigation items that have dropdowns.
 * Used to enforce a consistent minimum height on all header dropdowns.
 */
export function computeMaxDropdownHeight(
  navigation: HeaderDocumentDataNavigationItem[] | null | undefined
): number {
  if (!navigation?.length) return 0;

  let maxHeight = 0;
  for (const item of navigation) {
    if (item.has_dropdown && item.dropdown_items?.length) {
      maxHeight = Math.max(
        maxHeight,
        computeDropdownHeightForItem(item)
      );
    }
  }
  return maxHeight;
}
