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
import { guideSlugs } from '../lib/guides-data'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, '../public/sitemap.xml')
const SITE_URL = 'https://dotgui.org'

interface Entry { loc: string; changefreq: string; priority: string }

const staticTop: Entry[] = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/spec', changefreq: 'weekly', priority: '0.9' },
  { loc: '/cli', changefreq: 'monthly', priority: '0.9' },
  { loc: '/kit', changefreq: 'monthly', priority: '0.9' },
  { loc: '/embed', changefreq: 'monthly', priority: '0.9' },
  { loc: '/figma', changefreq: 'monthly', priority: '0.9' },
  { loc: '/guides', changefreq: 'weekly', priority: '0.9' },
  { loc: '/faq', changefreq: 'monthly', priority: '0.8' },
  { loc: '/spec/roles', changefreq: 'monthly', priority: '0.8' },
  { loc: '/spec/quality', changefreq: 'monthly', priority: '0.8' },
  { loc: '/playground', changefreq: 'monthly', priority: '0.7' }
]

const specEntries: Entry[] = specSlugs.map(slug => ({
  loc: `/spec/${slug}`, changefreq: 'monthly', priority: '0.8'
}))

const kitEntries: Entry[] = kitModules.map(m => ({
  loc: `/kit/${m.slug}`, changefreq: 'monthly', priority: '0.8'
}))

const guideEntries: Entry[] = guideSlugs.map(slug => ({
  loc: `/guides/${slug}`, changefreq: 'monthly', priority: '0.8'
}))

const all = [...staticTop, ...specEntries, ...kitEntries, ...guideEntries]

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...all.map(e =>
    `  <url><loc>${SITE_URL}${e.loc}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`
  ),
  '</urlset>',
  ''
].join('\n')

writeFileSync(out, xml)
console.log(`wrote sitemap.xml (${all.length} urls)`)
