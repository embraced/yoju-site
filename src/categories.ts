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
  '消化系統',
  '內分泌',
  '腎臟',
  '泌尿',
  '眼科',
  '口腔',
  '糖尿病',
  '藥物安全',
  '預防保健',
  '慢性疼痛',
  '心理健康',
  '健康識能',
  '中年男性',
  '中年女性',
  '中年代謝',
  '中年常見',
  '中年睡眠',
  '中年心理',
  '兒少健康',
  '兒少發展',
  '兒少心理',
] as const;

export type Category = (typeof CATEGORIES)[number];
