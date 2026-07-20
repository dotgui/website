/**
 * Single source of truth for the site's canonical URL shape: every
 * non-homepage page URL ends in `/`. Netlify serves prerendered routes as
 * `<route>/index.html` and 301-redirects the extensionless path to the
 * trailing-slash form, so pointing every internal link, canonical tag, and
 * sitemap entry at the trailing-slash URL means crawlers hit the final 200
 * directly instead of a URL that first redirects.
 *
 * Auto-imported everywhere in the Nuxt app (pages/components/composables).
 * Plain Node scripts (e.g. scripts/gen-sitemap.ts) import it explicitly.
 */
export const SITE_URL = 'https://dotgui.org'

/**
 * Normalize an internal path to the canonical trailing-slash form.
 * `/` stays `/`; `/spec` becomes `/spec/`. Query strings and hash fragments
 * are preserved and the slash is inserted before them (`/kit#faq` →
 * `/kit/#faq`). Paths that already end in `/`, point at a file (last path
 * segment contains a dot, e.g. `/llms.txt`), or are external (`http…`) are
 * returned unchanged.
 */
export function canonicalPath(path: string): string {
  if (/^[a-z]+:\/\//i.test(path)) return path

  const hashIndex = path.indexOf('#')
  const hash = hashIndex === -1 ? '' : path.slice(hashIndex)
  const withoutHash = hashIndex === -1 ? path : path.slice(0, hashIndex)

  const queryIndex = withoutHash.indexOf('?')
  const query = queryIndex === -1 ? '' : withoutHash.slice(queryIndex)
  const base = queryIndex === -1 ? withoutHash : withoutHash.slice(0, queryIndex)

  if (!base.startsWith('/') || base.endsWith('/')) return `${base}${query}${hash}`

  const lastSegment = base.slice(base.lastIndexOf('/') + 1)
  if (lastSegment.includes('.')) return `${base}${query}${hash}`

  return `${base}/${query}${hash}`
}

/** Absolute canonical URL (SITE_URL + canonicalPath) for an internal path. */
export function canonicalUrl(path: string): string {
  return `${SITE_URL}${canonicalPath(path)}`
}

/**
 * Trailing-slash-insensitive path comparison, for active-nav-link
 * highlighting — route.path can read with or without a trailing slash
 * depending on how the route was entered.
 */
export function isSamePath(routePath: string, target: string): boolean {
  const strip = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)
  return strip(routePath) === strip(target)
}
