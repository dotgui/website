/**
 * Generate public/llms.txt and public/llms-full.txt.
 *
 * llms.txt       the index AI crawlers read first (llmstxt.org convention).
 * llms-full.txt  the whole spec + toolchain docs as one markdown file, so an
 *                 agent that ingests it can read and write .gui immediately.
 *
 * Sources are the canonical docs in the monorepo (core/, kit/, cli/, embed/).
 * Run: bun run gen:llms
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { guideEntries, type GuideBlock, type GuideEntry } from '../lib/guides-data'
import { examples } from '../lib/examples-data'
import { canonicalUrl, SITE_URL } from '../utils/site-url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '../..')
const out = (f: string) => join(here, '../public', f)
const read = (p: string) => readFileSync(join(root, p), 'utf8').trim()

// ── guides-data.ts → markdown ────────────────────────────────────────────
// Single-sources guide content from lib/guides-data.ts into llms-full.txt,
// so the site and the AI-crawler corpus never drift apart.
function htmlToMd(s: string): string {
  return s
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<a href="([^"]+)">(.*?)<\/a>/g, (_m, href: string, text: string) =>
      // Internal hrefs → absolute canonical (trailing-slash) URLs; leave
      // external links and in-page anchors as-is.
      `[${text}](${href.startsWith('http') || href.startsWith('#') ? href : canonicalUrl(href)})`
    )
}

function blockToMd(b: GuideBlock): string {
  switch (b.type) {
    case 'p': return htmlToMd(b.text)
    case 'h2': return `## ${b.text}`
    case 'list': return b.items.map(i => `- ${htmlToMd(i)}`).join('\n')
    case 'code': return `${b.label ? `**${b.label}**\n\n` : ''}\`\`\`${b.lang}\n${b.code}\n\`\`\``
    case 'callout': return `> **${b.tone === 'do' ? 'Do' : "Don't"}:** ${htmlToMd(b.text)}`
    case 'table': return [
      `| ${b.head.join(' | ')} |`,
      `| ${b.head.map(() => '---').join(' | ')} |`,
      ...b.rows.map(r => `| ${r.map(htmlToMd).join(' | ')} |`)
    ].join('\n')
  }
}

function guideToMd(g: GuideEntry): string {
  const parts = [`### ${g.title}`, '', g.dek, '', ...g.body.map(b => `${blockToMd(b)}\n`)]
  if (g.faq.length) {
    parts.push('**FAQ**', '')
    for (const f of g.faq) parts.push(`- **${f.q}** ${f.a}`)
    parts.push('')
  }
  return parts.join('\n')
}

// ── llms.txt  the index ────────────────────────────────────────────────────
const llms = `# .gui (dotgui)

> .gui is an open, text-based file format for user interfaces  what .svg is to
> graphics, .gui is to UI. A .gui file is a zip package: design.guix (plain XML
> markup carrying frames, stacks, text, images, shapes, design tokens, fonts,
> and effects), an assets/ folder, and a preview.webp thumbnail. AI agents can
> read and write it directly; a deterministic, zero-AI toolchain validates,
> lints, scores, and renders it; any browser or design tool can display it.

Key facts:
- Only validation is required to produce a file; render and score are optional.
- A closed 53-role vocabulary (role="button", role="nav-bar", …) makes files self-describing.
- Quality is scored on CCAC (Clean, Consistent, Accessible, Comprehensible)  local, offline, zero-AI.
- The format, engine, CLI, and embed library are open source and free.

## Documentation

- [Full spec and toolchain docs](${canonicalUrl('/llms-full.txt')}): everything below concatenated as one markdown file
- [Spec Reference](${canonicalUrl('/spec')}): every element, attribute, and token type
- [Role vocabulary](${canonicalUrl('/spec/roles')}): the 53 recognized UI roles
- [Quality model](${canonicalUrl('/spec/quality')}): the CCAC scoring spec

## Toolchain

- [gui CLI](${canonicalUrl('/cli')}): read, write, lint, render, and package .gui files; \`gui setup\` installs the dotgui skill into AI agents
- [@dotgui/kit](${canonicalUrl('/kit')}): the reference engine  parser, validator, renderer, scorer in one deterministic package
- [@dotgui/embed](${canonicalUrl('/embed')}): render .gui files on any website with one CDN script
- [Figma plugin](${canonicalUrl('/figma')}): export any Figma layer as a .gui file

## Guides

${guideEntries.map(g => `- [${g.title}](${canonicalUrl(`/guides/${g.slug}`)}): ${g.dek}`).join('\n')}

## Examples

Real .gui files to read and learn from. Each page renders the file live and
shows its full source; the raw design.guix links below return the plain-text
.gui markup directly — no download or unzip needed.

${examples
    .map(
      e =>
        `- [${e.title}](${canonicalUrl(`/examples/${e.category}/${e.slug}`)}) — ${e.category}${e.description ? `; ${e.description}` : ''} · [raw source](${SITE_URL}${e.guix})`
    )
    .join('\n')}

## Pricing

- [Pricing](${canonicalUrl('/pricing.md')}): free and open source — no paid tiers, no usage limits, no account required

## Optional

- [Playground](${canonicalUrl('/playground')}): write .gui XML and see it render live
`

// ── llms-full.txt  the whole corpus ────────────────────────────────────────
const sections: [string, string][] = [
  ['What is .gui', read('core/README.md')],
  ['The .gui format specification', read('core/spec/DOTGUI.md')],
  ['Element and attribute reference (generated)', read('core/spec/REFERENCE.md')],
  ['The role vocabulary', read('core/roles/README.md')],
  ['The CCAC quality model', read('core/spec/QUALITY.md')],
  ['@dotgui/kit  the reference engine', read('kit/README.md')],
  ['@dotgui/cli  the command-line toolchain', read('cli/README.md')],
  ['@dotgui/embed  render .gui in the browser', read('embed/README.md')],
  ['Guides  comparisons and best practices', guideEntries.map(guideToMd).join('\n---\n\n')]
]

const full = [
  '# .gui (dotgui)  full documentation',
  '',
  '> This file concatenates the canonical .gui docs for AI consumption.',
  `> Index: ${canonicalUrl('/llms.txt')} · Site: ${SITE_URL}`,
  '',
  ...sections.flatMap(([title, body]) => [
    '',
    '---',
    '',
    `<!-- section: ${title} -->`,
    '',
    body,
    ''
  ])
].join('\n')

writeFileSync(out('llms.txt'), llms)
writeFileSync(out('llms-full.txt'), full)
console.log(`wrote llms.txt (${llms.length} bytes) and llms-full.txt (${full.length} bytes)`)
