/**
 * Extract the .gui example bundles in ./examples into public/examples so the
 * site can serve, render, and link them, and generate lib/examples.json — the
 * manifest that drives /examples and /examples/<slug>.
 *
 * Each source bundle (a ZIP with design.guix + preview.webp + assets/) becomes
 * a flat public/examples/<slug>/ folder with clean, GitHub-style URLs:
 *   - download      the original .gui bundle (Download button + live preview)
 *   - source.guix   the design.guix XML; the /examples/<slug>/raw server route
 *                   reads it and serves it as text/plain (View raw + agents)
 *   - preview.webp  gallery + og image (when the bundle ships one)
 *
 * Slugs are unique across categories, so category lives in the manifest (for
 * the gallery filter and label) but not in the URL. The live <gui-embed> reads
 * assets straight from the bundle, so the loose assets/ folder is not emitted.
 *
 * Hand-authored prose lives in lib/examples-meta.ts and is merged in at page
 * render time — this script only emits machine-derivable data.
 *
 * Run: bun run sync:examples
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { unzipSync } from 'fflate'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const srcDir = join(root, 'examples')
const outDir = join(root, 'public', 'examples')
const manifestPath = join(root, 'lib', 'examples.json')

const CATEGORIES = ['mobile', 'web'] as const
type Category = (typeof CATEGORIES)[number]

export interface ExampleColor { name: string; value: string }
export interface ExampleEntry {
  slug: string
  category: Category
  /** Root <gui name="…">, humanized. Overridden by lib/examples-meta.ts. */
  name: string
  /** Up to 8 token colors, for the palette strip and preview. */
  colors: ExampleColor[]
  /** Public paths (served from /public). */
  download: string
  raw: string
  preview: string
}

/** camelCase / snake_case / "spotify_playlist_fixed" → "Spotify Playlist" */
function humanize(raw: string): string {
  return raw
    .replace(/[_-]+/g, ' ')
    .replace(/\bfixed\b/gi, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/** filename → url-safe slug (drop "_fixed", underscores → hyphens). */
function slugify(file: string): string {
  return basename(file, '.gui')
    .replace(/_fixed$/i, '')
    .replace(/_+/g, '-')
    .toLowerCase()
}

function parseGuix(xml: string): { name: string; colors: ExampleColor[] } {
  const nameMatch = xml.match(/<gui[^>]*\bname="([^"]+)"/)
  const name = nameMatch ? humanize(nameMatch[1]) : ''

  const colors: ExampleColor[] = []
  const seen = new Set<string>()
  const colorRe = /<color\s+name="([^"]+)"\s+value="(#[0-9a-fA-F]{3,8})"/g
  let m: RegExpExecArray | null
  while ((m = colorRe.exec(xml)) && colors.length < 8) {
    if (seen.has(m[2].toLowerCase())) continue
    seen.add(m[2].toLowerCase())
    colors.push({ name: m[1], value: m[2] })
  }
  return { name, colors }
}

function run() {
  if (!existsSync(srcDir)) {
    console.error(`[sync-examples] source dir not found: ${srcDir}`)
    process.exit(1)
  }
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })

  const manifest: ExampleEntry[] = []
  const seenSlugs = new Set<string>()

  for (const category of CATEGORIES) {
    const catDir = join(srcDir, category)
    if (!existsSync(catDir)) continue
    const files = readdirSync(catDir).filter((f) => f.endsWith('.gui')).sort()

    for (const file of files) {
      const slug = slugify(file)
      if (seenSlugs.has(slug)) {
        console.error(`[sync-examples] duplicate slug "${slug}" (${category}/${file}) — flat URLs require unique slugs`)
        process.exit(1)
      }
      seenSlugs.add(slug)

      const guiBytes = readFileSync(join(catDir, file))
      const zip = unzipSync(new Uint8Array(guiBytes))

      const guixBytes = zip['design.guix']
      if (!guixBytes) {
        console.warn(`[sync-examples] ${category}/${file}: no design.guix, skipping`)
        continue
      }
      const xml = new TextDecoder().decode(guixBytes)
      const parsed = parseGuix(xml)

      const destDir = join(outDir, slug)
      mkdirSync(destDir, { recursive: true })

      // /examples/<slug>/download serves the bundle; the /raw route serves
      // source.guix (kept as a real file so the route/prerender can read it).
      cpSync(join(catDir, file), join(destDir, 'download'))
      writeFileSync(join(destDir, 'source.guix'), guixBytes)

      let hasPreview = false
      const previewBytes = zip['preview.webp']
      if (previewBytes) {
        writeFileSync(join(destDir, 'preview.webp'), previewBytes)
        hasPreview = true
      }

      const base = `/examples/${slug}`
      manifest.push({
        slug,
        category,
        name: parsed.name || humanize(slug),
        colors: parsed.colors,
        download: `${base}/download`,
        raw: `${base}/raw`,
        preview: hasPreview ? `${base}/preview.webp` : ''
      })
    }
  }

  manifest.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`[sync-examples] ${manifest.length} examples → public/examples + lib/examples.json`)
}

run()
