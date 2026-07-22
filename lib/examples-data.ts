/**
 * The merged view of the examples library: generated machine data
 * (lib/examples.json, from scripts/sync-examples.ts) overlaid with the
 * hand-authored copy in lib/examples-meta.ts. This is the single source the
 * app, sitemap, and llms scripts read — adding a .gui to ./examples and
 * re-running `sync:examples` is all it takes to add an example.
 */
import rawManifest from './examples.json'
import { examplesMeta } from './examples-meta'

export type ExampleCategory = 'mobile' | 'web'

export interface ExampleColor { name: string; value: string }

export interface Example {
  slug: string
  category: ExampleCategory
  /** Display title (hand-authored where available, else derived name). */
  title: string
  /** SEO/GEO description. Empty string if not yet authored. */
  description: string
  colors: ExampleColor[]
  /** Public path to the .gui bundle (download). */
  gui: string
  /** Public path to the raw design.guix XML (view raw / agents). */
  guix: string
  /** Public path to preview.webp, or '' when the bundle has none. */
  preview: string
}

interface RawEntry {
  slug: string
  category: ExampleCategory
  name: string
  colors: ExampleColor[]
  gui: string
  guix: string
  preview: string
}

export const examples: Example[] = (rawManifest as RawEntry[]).map((e) => {
  const meta = examplesMeta[e.slug]
  return {
    slug: e.slug,
    category: e.category,
    title: meta?.title || e.name,
    description: meta?.description || '',
    colors: e.colors,
    gui: e.gui,
    guix: e.guix,
    preview: e.preview
  }
})

export const CATEGORY_LABELS: Record<ExampleCategory, string> = {
  mobile: 'Mobile',
  web: 'Web'
}

export function getExample(slug: string): Example | undefined {
  return examples.find((e) => e.slug === slug)
}

export const exampleSlugs = examples.map((e) => e.slug)
