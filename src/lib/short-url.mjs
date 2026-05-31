// Short URL alias for sharing: /y/{YYMMDD}{a|b|...}
//
// Why: canonical article URLs use Chinese-character slugs that URL-encode to
// 100+ bytes; when shared in LINE the visible URL wraps to 3-4 lines and looks
// ugly. We keep the canonical URL (good for SEO / readable to humans who see
// it in browser) but expose a short alias for share buttons. _redirects file
// (Cloudflare Pages) 301s the short URL to canonical, so OG-card crawlers and
// readers still land on the right page.
//
// ID format: 2-digit year + 2-digit month + 2-digit day + lowercase letter
// (alphabetical order within the same date). e.g. 260530a / 260530b.

/**
 * @param {string} slug — e.g. "2026-05-30-爸媽身上有老人味..."
 * @param {readonly string[]} allSlugs — all article slugs (no .mdx ext)
 * @returns {string} short ID like "260530a"
 */
export function shortIdForSlug(slug, allSlugs) {
  const date = slug.slice(0, 10); // "2026-05-30"
  const yymmdd = date.slice(2).replace(/-/g, ''); // "260530"
  const sameDate = allSlugs.filter((s) => s.startsWith(date)).sort();
  const idx = sameDate.indexOf(slug);
  if (idx < 0) {
    throw new Error(`shortIdForSlug: slug ${JSON.stringify(slug)} not found in allSlugs`);
  }
  if (idx >= 26) {
    throw new Error(`shortIdForSlug: more than 26 articles on ${date} — extend the scheme`);
  }
  const letter = String.fromCharCode(97 + idx); // 'a','b',...
  return `${yymmdd}${letter}`;
}
