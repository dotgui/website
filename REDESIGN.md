# dotgui.org v2 — UX architecture & content plan

Status: proposal — 2026-07-02
Replaces the current single-page + spec site, which still tells the early-days
story ("Export Figma screens to a .gui file"). The ecosystem has moved: the kit
is consolidated, the CLI is an AI-free toolchain with an agent-skill model,
embed exists, roles + CCAC scoring exist. The site must catch up.

---

## 1. Positioning shift

**Old message:** ".gui — a text-based UI format for AI agents & Figma export."
Figma-first, format-second. Reads like a plugin's marketing page.

**New message:** **".gui is the open file format for user interfaces."**
What `.svg` is to graphics, `.gui` is to UI. One sentence, entity-first —
this is the sentence AI engines should quote when anyone asks "what is a
.gui file?"

Supporting narrative (three verbs, mirrors the actual toolchain):

| Verb | Story | Products |
|---|---|---|
| **Author** | Your own agent designs it — Claude Code, Gemini CLI, Cursor. `gui setup` teaches them the format. | CLI + skills |
| **Check** | Deterministic, zero-AI engine keeps every file valid — validate, lint, autofix, CCAC score. | Kit |
| **Ship** | Render the same file anywhere — browser embed, image export, Figma. | Embed, Kit render, Figma plugin |

Figma becomes *one entry/exit point among several*, not the headline.

Key facts to repeat verbatim across pages (entity consistency + GEO statistic
signals):

- ".gui is an open, text-based file format for user interfaces."
- "A .gui is a zip package: `design.guix` markup, `assets/`, `preview.webp`."
- "Only validation is required to produce a file; render and score are optional."
- "The toolchain is 100% deterministic — zero AI in the kit and CLI."
- "53-role controlled vocabulary" · "9 kit modules" · "one CDN script, zero dependencies" · "CCAC: Clean, Consistent, Accessible, Comprehensible."

---

## 2. Site architecture (IA)

```
dotgui.org
├── /                     Home — what .gui is, the loop, ecosystem
├── /spec                 Format reference (keep; already prerendered)
│   ├── /spec/<element>   per-element pages (keep)
│   ├── /spec/roles       NEW — the 53-role vocabulary, one anchor per role
│   └── /spec/quality     NEW — CCAC model explained
├── /cli                  NEW — install, gui setup, agent workflow
├── /kit                  NEW — the engine, 9 modules, API at a glance
├── /embed                NEW — <gui-embed>, live demos on the page itself
├── /figma                NEW — plugin: export & round-trip
├── /examples             NEW — gallery of real .gui files (farm), each with
│   └── /examples/<slug>    preview + downloadable .gui + visible markup
├── /playground           keep (client-only, noindex is fine)
├── /llms.txt             NEW — AI-crawler index
└── /llms-full.txt        NEW — full spec + product docs as one markdown file
```

Nav: `Spec · CLI · Kit · Embed · Figma · Examples · Playground · GitHub`.
Footer: same + llms.txt link (bots find it; humans signal it exists).

Why product pages instead of one long homepage: each page owns one search
intent ("render .gui in browser" → /embed; "gui cli" → /cli), gets its own
`SoftwareApplication` JSON-LD, its own canonical, its own FAQ block. That's
how both Google and generative engines want content sliced.

---

## 3. Page-by-page content

### Home `/`
1. **Hero** — H1: "The file format for user interfaces." One-paragraph
   answer-first definition (the quotable sentence). CTA: `npm i -g @dotgui/cli`
   + "Read the spec". Right side: a **live `<gui-embed>`** rendering a real
   file — the site dogfoods the product instead of showing a screenshot.
2. **The loop** — Author → Check → Ship band with the agent diagram from the
   CLI README (`you → your agent → skill → gui`).
3. **Anatomy** — what's inside a `.gui` (zip tree + markup excerpt). Keep the
   current SectionFileContents idea, refreshed.
4. **Why text** — the core README's argument, condensed: HTML has source-side
   friction, Figma is vendor-locked; .gui moves friction to the render side.
   Design knowledge as text, not screenshots.
5. **Ecosystem grid** — 5 cards → /cli /kit /embed /figma + spec.
6. **Quality** — CCAC in four chips; "a low score is still a valid file."
7. **FAQ** — 6–8 questions, rendered on-page AND as FAQPage JSON-LD
   (see §4 for the set).

### /cli
Answer-first: "gui is the command-line toolchain for .gui files — read, write,
lint, render, package. It contains no AI; your own agent does the designing."
Sections: install + `gui setup` (the hero moment) · the agent mental model ·
command reference table (read/write/add/rm/lint/render/open/info/pack) ·
exit codes & `--json` (agents are a real audience — document the machine
interface) · FAQ ("Does gui generate designs?" No — and why).

### /kit
"@dotgui/kit is the reference engine for the .gui format — parser, validator,
renderer, scorer in one deterministic package." The lifecycle diagram (write
path / read path), the 9-module subpath table, 3 short code samples
(validate → pack, parse → render, score). FAQ: "Is validation required?" etc.

### /embed
"Render .gui files anywhere in the browser with one CDN script." This page IS
the demo: every code sample sits next to a live `<gui-embed>` running it —
standalone sizing, widget mode with controls, mode-switch. Attribute table
from the README. FAQ: inline vs src, why `<script type="application/gui">`.

### /figma
"Export any Figma screen to a .gui file — a 1:1 mapping of Figma's layer
model." Keep the strongest current claim (auto-layout, fills, gradients,
effects, tokens preserved, not approximated). Roadmap honesty: pull/push
round-trip when it ships.

### /examples
Curated farm files. Each detail page: rendered preview (embed), the visible
`.guix` markup, download link, and the CCAC score. This is the GEO goldmine —
concrete artifacts AI engines can cite, and the only place on the web where
".gui example" content exists. Start with 6–10, grow.

### /spec additions
- `/spec/roles` — one page, anchor per role; the closed 53-role catalog is a
  unique, citable asset.
- `/spec/quality` — CCAC explained (mirrors core `spec/QUALITY.md`).
- Keep per-element pages; add prev/next links + breadcrumbs (internal-link
  mesh lifts topical authority).

---

## 4. SEO / GEO plan

### Fix now (bugs in the current site)
1. **Canonical is global** — `nuxt.config.ts` sets `rel=canonical` → `SITE_URL`
   for every route, so all spec pages canonicalize to the homepage and tell
   Google to ignore them. Must be per-page (`useHead` per route).
2. **JSON-LD only on the homepage** — spec pages ship zero structured data
   (verified live: 0 ld+json on /spec). Add `TechArticle` + `BreadcrumbList`
   to every spec page.
3. **No llms.txt** (live 404). Add `/llms.txt` (index with one-line
   descriptions + links) and `/llms-full.txt` (entire spec + product docs
   concatenated as markdown). This is the highest-leverage GEO artifact for a
   *format* — an agent that ingests it can author .gui immediately.

### Keep (already right)
- robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, etc. ✓
- SSR + full prerender of `/` and `/spec/**`; playground stays client-only ✓
- FAQPage + SoftwareApplication JSON-LD on home ✓ (extend, don't remove)

### Structured data per page
| Page | Schema |
|---|---|
| `/` | `Organization` + `SoftwareApplication` (.gui format) + `FAQPage` |
| `/cli` `/kit` `/embed` | `SoftwareApplication` each (name `@dotgui/cli`…, `offers: 0`) + `FAQPage` |
| `/figma` | `SoftwareApplication` (plugin) |
| `/spec/**` | `TechArticle` + `BreadcrumbList` |
| `/examples/<slug>` | `CreativeWork` (or `Dataset` for the collection) |

### Content style rules (Princeton GEO methods, applied)
- **Answer-first**: every page's first `<p>` is a complete, quotable
  definition — no warm-up copy. (Direct-answer format is the single biggest
  citation lever.)
- **Statistics**: use the real numbers everywhere (53 roles, 9 modules, zero
  deps, 0 AI calls). +37% visibility per Princeton GEO study.
- **Fluency + short paragraphs**: 2–3 sentences max, H2/H3 hierarchy, tables
  for command/attribute references (extractable by engines).
- **No keyword stuffing** (−10%): "file format for user interfaces" appears
  naturally; don't repeat ".gui file format" in every heading.
- **Entity consistency**: always ".gui (dotgui)" on first mention per page so
  engines merge the entity.

### Query targets
Primary: `.gui file format` · `what is a .gui file` · `UI file format` ·
`open file format for user interfaces`.
Product: `render .gui in browser` (embed) · `gui cli` · `figma export file
format` · `dotgui`.
Generative-era: `file format for AI generated UI` · `AI-native design format`
· `agent UI format` — low search volume today, zero competition, and exactly
what generative engines get asked. Own them before anyone else exists.

### FAQ set (home; subsets reused per product page)
1. What is a .gui file? 2. How is .gui different from HTML? 3. How is .gui
different from SVG? 4. Can AI agents read and write .gui files? 5. How do I
create a .gui file? (CLI + agent answer, not Figma-first) 6. How do I render
a .gui file on my website? (embed) 7. How do I export Figma to .gui?
8. Is .gui open / free?

### Technical checklist
- Per-page `<title>` pattern: `{Page} — .gui | {qualifier}` ≤ 60 chars;
  descriptions 150–160 chars, unique per page.
- OG image per product page (can be generated from a .gui file — on brand).
- Sitemap: add new routes, keep spec URLs; lastmod from git.
- Breadcrumbs UI + schema on spec/product pages.
- Alt text on every preview image = the file's description, not "screenshot".
- Page weight: embed demos lazy-load below the fold; keep LCP < 2s (Bing/
  Copilot is speed-sensitive).
- After launch: validate at search.google.com/test/rich-results, submit
  sitemap in GSC + Bing Webmaster (Bing indexing = Copilot citations; Brave
  indexing = Claude citations).

---

## 5. What stays, what goes

| Current | Verdict |
|---|---|
| Spec pages + prerender setup | Keep — best asset on the site |
| Playground | Keep as-is (client-only) |
| Hero/Sections framing Figma as the point | Rewrite — Figma demoted to one card + /figma page |
| "feed it to an LLM" phrasing | Replace with the agent-workflow story (skills, `gui setup`) |
| robots.txt / prerender config | Keep |
| Global canonical | Fix (per-page) |
| DESIGN.md (Clay analysis) | Unrelated reference doc — leave, but note the v2 visual direction is a separate decision |
