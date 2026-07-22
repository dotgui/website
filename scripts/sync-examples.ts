/**
 * Extract the .gui example bundles in ./examples into public/examples so the
 * site can serve, render, and link them, and generate lib/examples.json — the
 * manifest that drives /examples and /examples/[slug].
 *
 * Each source bundle (a ZIP with design.guix + preview.webp + assets/) is
 * unpacked into public/examples/<category>/<slug>/ with:
 *   - <slug>.gui      the original bundle (Download button)
 *   - design.guix     the raw XML source (View raw + inline display + agents)
 *   - preview.webp    gallery + og image
 *   - assets/...      referenced images, so live <gui-embed> renders resolve
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
  gui: string
  guix: string
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

  for (const category of CATEGORIES) {
    const catDir = join(srcDir, category)
    if (!existsSync(catDir)) continue
    const files = readdirSync(catDir).filter((f) => f.endsWith('.gui')).sort()

    for (const file of files) {
      const slug = slugify(file)
      const bytes = readFileSync(join(catDir, file))
      const zip = unzipSync(new Uint8Array(bytes))

      const guixBytes = zip['design.guix']
      if (!guixBytes) {
        console.warn(`[sync-examples] ${category}/${file}: no design.guix, skipping`)
        continue
      }
      const xml = new TextDecoder().decode(guixBytes)
      const parsed = parseGuix(xml)

      const destDir = join(outDir, category, slug)
      mkdirSync(join(destDir, 'assets'), { recursive: true })

      // Original bundle (download) + raw source (view raw / inline).
      cpSync(join(catDir, file), join(destDir, `${slug}.gui`))
      writeFileSync(join(destDir, 'design.guix'), guixBytes)

      // Everything else from the bundle (preview.webp, assets/*).
      let hasPreview = false
      for (const [name, data] of Object.entries(zip)) {
        if (name === 'design.guix' || name.endsWith('/')) continue
        if (name === 'preview.webp') hasPreview = true
        const target = join(destDir, name)
        mkdirSync(dirname(target), { recursive: true })
        writeFileSync(target, data)
      }

      const base = `/examples/${category}/${slug}`
      manifest.push({
        slug,
        category,
        name: parsed.name || humanize(slug),
        colors: parsed.colors,
        gui: `${base}/${slug}.gui`,
        guix: `${base}/design.guix`,
        preview: hasPreview ? `${base}/preview.webp` : ''
      })
    }
  }

  manifest.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`[sync-examples] ${manifest.length} examples → public/examples + lib/examples.json`)
}

run()
