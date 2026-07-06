/**
 * Generate public/llms.txt and public/llms-full.txt.
 *
 * llms.txt      — the index AI crawlers read first (llmstxt.org convention).
 * llms-full.txt — the whole spec + toolchain docs as one markdown file, so an
 *                 agent that ingests it can read and write .gui immediately.
 *
 * Sources are the canonical docs in the monorepo (core/, kit/, cli/, embed/).
 * Run: bun run gen:llms
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '../..')
const out = (f: string) => join(here, '../public', f)
const read = (p: string) => readFileSync(join(root, p), 'utf8').trim()

// ── llms.txt — the index ────────────────────────────────────────────────────
const llms = `# .gui (dotgui)

> .gui is an open, text-based file format for user interfaces — what .svg is to
> graphics, .gui is to UI. A .gui file is a zip package: design.guix (plain XML
> markup carrying frames, stacks, text, images, shapes, design tokens, fonts,
> and effects), an assets/ folder, and a preview.webp thumbnail. AI agents can
> read and write it directly; a deterministic, zero-AI toolchain validates,
> lints, scores, and renders it; any browser or design tool can display it.

Key facts:
- Only validation is required to produce a file; render and score are optional.
- A closed 53-role vocabulary (role="button", role="nav-bar", …) makes files self-describing.
- Quality is scored on CCAC (Clean, Consistent, Accessible, Comprehensible) — local, offline, zero-AI.
- The format, engine, CLI, and embed library are open source and free.

## Documentation

- [Full spec and toolchain docs](https://dotgui.org/llms-full.txt): everything below concatenated as one markdown file
- [Spec Reference](https://dotgui.org/spec): every element, attribute, and token type
- [Role vocabulary](https://dotgui.org/spec/roles): the 53 recognized UI roles
- [Quality model](https://dotgui.org/spec/quality): the CCAC scoring spec

## Toolchain

- [gui CLI](https://dotgui.org/cli): read, write, lint, render, and package .gui files; \`gui setup\` installs the dotgui skill into AI agents
- [@dotgui/kit](https://dotgui.org/kit): the reference engine — parser, validator, renderer, scorer in one deterministic package
- [@dotgui/embed](https://dotgui.org/embed): render .gui files on any website with one CDN script
- [Figma plugin](https://dotgui.org/figma): export any Figma layer as a .gui file

## Optional

- [Playground](https://dotgui.org/playground): write .gui XML and see it render live
`

// ── llms-full.txt — the whole corpus ────────────────────────────────────────
const sections: [string, string][] = [
  ['What is .gui', read('core/README.md')],
  ['The .gui format specification', read('core/spec/DOTGUI.md')],
  ['Element and attribute reference (generated)', read('core/spec/REFERENCE.md')],
  ['The role vocabulary', read('core/roles/README.md')],
  ['The CCAC quality model', read('core/spec/QUALITY.md')],
  ['@dotgui/kit — the reference engine', read('kit/README.md')],
  ['@dotgui/cli — the command-line toolchain', read('cli/README.md')],
  ['@dotgui/embed — render .gui in the browser', read('embed/README.md')]
]

const full = [
  '# .gui (dotgui) — full documentation',
  '',
  '> This file concatenates the canonical .gui docs for AI consumption.',
  '> Index: https://dotgui.org/llms.txt · Site: https://dotgui.org',
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
