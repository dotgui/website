/**
 * Per-page SEO: title/description/OG + a per-page canonical.
 * Every prerendered route must call this  the global canonical was removed
 * from nuxt.config so pages don't all canonicalize to the homepage.
 *
 * `url` is the canonical trailing-slash URL (`/` stays `/`), used for both
 * the <link rel="canonical"> and og:url so they match the final 200 URL.
 */
export function usePageSeo(opts: {
  path: string
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
}) {
  const url = canonicalUrl(opts.path)
  useSeoMeta({
    title: opts.title,
    description: opts.description,
    ogTitle: opts.ogTitle ?? opts.title,
    ogDescription: opts.ogDescription ?? opts.description,
    ogUrl: url,
    ogImage: `${SITE_URL}/og.png`,
    twitterCard: 'summary_large_image'
  })
  useHead({ link: [{ rel: 'canonical', href: url }] })
  return url
}
