export type GallerySuggestionMediaType = 'photo' | 'video';

export interface GallerySuggestionItem {
  id: string | number;
  title: string;
  description: string;
  mediaType: GallerySuggestionMediaType;
  thumb: string;
  duration?: string;
  group?: string;
}

export const ALLOWED_GALLERY_GROUPS = [
  'Food & Beverages',
  'Corporate & Events',
  'Fashion',
  'Artist',
  'Short Films',
  'Wedding',
] as const;

export type AllowedGalleryGroup = (typeof ALLOWED_GALLERY_GROUPS)[number];

type SortContext = {
  activeId?: string | number | null;
  activeGroup?: string | null;
  activeMediaType?: GallerySuggestionMediaType | null;
};

export const normalizeGalleryGroup = (group?: string | null) => {
  if (!group) return null;
  return ALLOWED_GALLERY_GROUPS.includes(group as AllowedGalleryGroup) ? group : null;
};

const scoreSuggestion = (item: GallerySuggestionItem, context: SortContext) => {
  let score = 0;

  if (context.activeGroup && item.group === context.activeGroup) score += 1000;
  if (context.activeMediaType && item.mediaType === context.activeMediaType) score += 200;
  if (item.duration) score += 10;

  return score;
};

export const sortGallerySuggestions = (
  items: GallerySuggestionItem[],
  context: SortContext = {},
  limit = 8,
) => {
  return items
    .filter((item) => item.id !== context.activeId)
    .slice()
    .sort((left, right) => {
      const scoreDiff = scoreSuggestion(right, context) - scoreSuggestion(left, context);
      if (scoreDiff !== 0) return scoreDiff;

      const durationLeft = left.duration ? left.duration.length : 0;
      const durationRight = right.duration ? right.duration.length : 0;
      if (durationRight !== durationLeft) return durationRight - durationLeft;

      return left.title.localeCompare(right.title);
    })
    .slice(0, limit);
};

export const getRelatedGallerySuggestions = (
  items: GallerySuggestionItem[],
  context: SortContext = {},
  limit = 8,
) => {
  const strictRelatedItems = items.filter((item) => {
    if (context.activeId != null && item.id === context.activeId) return false;
    if (context.activeGroup && item.group !== context.activeGroup) return false;
    if (context.activeMediaType && item.mediaType !== context.activeMediaType) return false;
    return true;
  });

  return sortGallerySuggestions(strictRelatedItems, context, limit);
};
