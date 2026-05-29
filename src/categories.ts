// Single source of truth for article categories.
//
// The order here is ALSO the display order of category sections on /articles.
// Both the content schema (valid `category` values) and the archive page
// (section grouping/order) import this list, so the two cannot drift: any
// category accepted by the schema is guaranteed to render on /articles and can
// never be silently dropped from the listing.
export const CATEGORIES = [
  '老年醫學',
  '心血管',
  '腦部健康',
  '骨骼關節',
  '代謝疾病',
  '感官退化',
] as const;

export type Category = (typeof CATEGORIES)[number];
