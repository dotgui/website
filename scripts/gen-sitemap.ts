/**
 * Generate public/sitemap.xml from the same data sources that drive the
 * site's routes, so a new spec/kit/guide entry never needs a manual sitemap
 * edit again.
 *
 * Run: bun run gen:sitemap
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { specSlugs } from '../lib/spec-data'
import { kitModules } from '../lib/kit-data'
import { guideEntries as guides } from '../lib/guides-data'
import { examples } from '../lib/examples-data'
import { SITE_URL, canonicalPath } from '../utils/site-url'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, '../public/sitemap.xml')

// Site-wide content-freshness date for pages without their own dateModified
// (spec, kit, and the top-level pages). Bump this when their content changes.
// Guides carry their own per-entry dateModified and use that instead. Keep
// lastmod accurate — Bing discounts sitemaps whose lastmod changes on every
// deploy without a real content change.
const SITE_UPDATED = '2026-07-07'

// When the examples library was published — a real freshness date so crawlers
// treat these URLs as newly added. Bump when the library changes materially.
const EXAMPLES_ADDED = '2026-07-22'

interface Entry { loc: string; changefreq: string; priority: string; lastmod: string }

const staticTop: Entry[] = [
  { loc: '/', changefreq: 'weekly', priority: '1.0', lastmod: SITE_UPDATED },
  { loc: '/spec', changefreq: 'weekly', priority: '0.9', lastmod: SITE_UPDATED },
  { loc: '/cli', changefreq: 'monthly', priority: '0.9', lastmod: SITE_UPDATED },
  { loc: '/kit', changefreq: 'monthly', priority: '0.9', lastmod: SITE_UPDATED },
  { loc: '/embed', changefreq: 'monthly', priority: '0.9', lastmod: SITE_UPDATED },
  { loc: '/figma', changefreq: 'monthly', priority: '0.9', lastmod: SITE_UPDATED },
  { loc: '/guides', changefreq: 'weekly', priority: '0.9', lastmod: SITE_UPDATED },
  { loc: '/faq', changefreq: 'monthly', priority: '0.8', lastmod: SITE_UPDATED },
  { loc: '/spec/roles', changefreq: 'monthly', priority: '0.8', lastmod: SITE_UPDATED },
  { loc: '/spec/quality', changefreq: 'monthly', priority: '0.8', lastmod: SITE_UPDATED },
  { loc: '/playground', changefreq: 'monthly', priority: '0.7', lastmod: SITE_UPDATED }
]

const specEntries: Entry[] = specSlugs.map(slug => ({
  loc: `/spec/${slug}`, changefreq: 'monthly', priority: '0.8', lastmod: SITE_UPDATED
}))

const kitEntries: Entry[] = kitModules.map(m => ({
  loc: `/kit/${m.slug}`, changefreq: 'monthly', priority: '0.8', lastmod: SITE_UPDATED
}))

const guideEntries: Entry[] = guides.map(g => ({
  loc: `/guides/${g.slug}`, changefreq: 'monthly', priority: '0.8', lastmod: g.dateModified
}))

const examplesTop: Entry[] = [
  { loc: '/examples', changefreq: 'weekly', priority: '0.8', lastmod: EXAMPLES_ADDED }
]
const exampleEntries: Entry[] = examples.map(e => ({
  loc: `/examples/${e.slug}`, changefreq: 'monthly', priority: '0.7', lastmod: EXAMPLES_ADDED
}))

const all = [...staticTop, ...specEntries, ...kitEntries, ...guideEntries, ...examplesTop, ...exampleEntries]

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...all.map(e =>
    // Trailing-slash canonical form (`/` stays `/`) so crawlers hit the final
    // 200 URL directly instead of the extensionless path that 301-redirects.
    // <lastmod> is a freshness signal Bing/Google use to prioritise recrawls.
    `  <url><loc>${SITE_URL}${canonicalPath(e.loc)}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`
  ),
  '</urlset>',
  ''
].join('\n')

writeFileSync(out, xml)
console.log(`wrote sitemap.xml (${all.length} urls)`)
