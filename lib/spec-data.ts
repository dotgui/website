/**
 * Adapter over the generated spec.
 *
 * The content here is NOT hand-authored — it is read from `spec.json`, which is
 * generated in dotgui-core from `core/schema/types.ts` (structure) + `spec.content.ts`
 * (prose). Run `bun run sync:spec` to refresh `lib/spec.json` from core after the
 * format changes. Canonical source: ../core/ — see core/GOVERNANCE.md.
 *
 * This file only maps the generated spec into the view-model the spec pages expect.
 */
import specJson from './spec.json'

export type SpecKind = 'tag' | 'property' | 'concept'

export interface SpecTable {
  head: string[]
  rows: string[][]
}

export interface SpecFaq {
  q: string
  a: string
}

export interface SpecEntry {
  slug: string
  name: string
  navLabel?: string
  title: string
  sub: string
  category: string
  kind: SpecKind
  desc: string[]
  note?: string
  table?: SpecTable
  sharedAttrs: boolean
  exampleLabel: string
  example: string
  exampleMode: 'hl' | 'plain'
  related: string[]
  seoDescription: string
  faq: SpecFaq[]
  hubHidden: boolean
}

// ── Shapes of the generated spec.json ───────────────────────────────────────
interface RawAttr { name: string; type: string; required: boolean; description: string; enum?: string[] }
interface RawElement {
  slug: string; tag: string | null; name: string; navLabel: string | null
  kind: SpecKind; category: string; summary: string; description: string[]
  note?: string; mapsToFigma?: string; attributes: RawAttr[]; sharedAttrs: boolean
  example: string; exampleLabel: string; exampleMode: 'hl' | 'plain'
  related: string[]; faq: SpecFaq[]; hubHidden: boolean
}
interface RawSpec {
  formatVersion: string
  categoryOrder: string[]
  sharedAttributes: RawAttr[]
  elements: RawElement[]
}

const spec = specJson as unknown as RawSpec

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const code = (s: string) => `<code>${esc(s)}</code>`

/** Type/values cell — prefer enum values, fall back to the type string. */
function valueCell(a: RawAttr): string {
  return a.enum && a.enum.length ? a.enum.map(code).join(' ') : code(a.type)
}

function attrTable(attrs: RawAttr[]): SpecTable | undefined {
  if (!attrs.length) return undefined
  return {
    head: ['Attr', 'Type', 'Description'],
    rows: attrs.map(a => [
      code(a.name) + (a.required ? ' <em class="req">required</em>' : ''),
      valueCell(a),
      esc(a.description)
    ])
  }
}

function toEntry(el: RawElement): SpecEntry {
  // Title for SEO: "frame fixed container", but avoid "text text node" when the
  // summary already repeats the name.
  const clean = el.name.replace(/[<>]/g, '')
  const title = el.summary.toLowerCase().includes(clean.toLowerCase())
    ? clean
    : `${clean} ${el.summary}`
  return {
    slug: el.slug,
    name: el.name,
    navLabel: el.navLabel ?? undefined,
    title,
    sub: el.summary,
    category: el.category,
    kind: el.kind,
    desc: el.description,
    note: el.note,
    table: attrTable(el.attributes),
    sharedAttrs: el.sharedAttrs,
    exampleLabel: el.exampleLabel,
    example: el.example,
    exampleMode: el.exampleMode,
    related: el.related,
    seoDescription: el.description[0] ?? el.summary,
    faq: el.faq ?? [],
    hubHidden: el.hubHidden
  }
}

export const formatVersion = spec.formatVersion
export const specCategoryOrder = spec.categoryOrder
export const specEntries: SpecEntry[] = spec.elements.map(toEntry)
export const specSlugs = specEntries.map(e => e.slug)

export function getSpecEntry(slug: string): SpecEntry | undefined {
  return specEntries.find(e => e.slug === slug)
}

export const specGroups = specCategoryOrder.map(category => ({
  label: category,
  items: specEntries.filter(e => e.category === category)
}))

/** Clean label without XML angle brackets, e.g. "<row>" → "row". */
export function specDisplayName(name: string): string {
  return name.replace(/[<>]/g, '')
}

/** tag / property / concept — now carried in the data. */
export function specKind(entry: SpecEntry): SpecKind {
  return entry.kind
}

// ── Shared attributes (VisualAttrs), for SharedAttrsTable ───────────────────
export type SharedAttr = RawAttr
export const sharedAttributes: SharedAttr[] = spec.sharedAttributes
export function sharedAttrValue(a: SharedAttr): string {
  return a.enum && a.enum.length ? a.enum.join(', ') : a.type
}
