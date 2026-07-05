// Data for the @dotgui/kit module pages (/kit and /kit/<slug>).
// Content mirrors each module's README in the kit package.

export interface KitExample {
  label: string
  filename: string
  lang: string
  code: string
}

export interface KitModule {
  slug: string
  name: string          // the import specifier, e.g. "/parser"
  tag: string           // short badge label
  kind: 'blue' | 'purple' | 'muted'
  api: string           // one-line signature shown on cards
  sub: string           // one-line summary
  desc: string[]        // intro paragraphs
  signature?: string    // full type signature block (mono)
  examples: KitExample[]
  checks?: string[]     // "what it checks / repairs" bullets
  useCases: string[]
  related: string[]     // other module slugs
  seo: string
}

export const kitModules: KitModule[] = [
  {
    slug: 'types',
    name: '@dotgui/kit',
    tag: 'types',
    kind: 'muted',
    api: 'canonical format types',
    sub: 'the format vocabulary',
    desc: [
      'The root export is only the format’s canonical TypeScript types — the shared vocabulary every other module and every consumer builds on. Behaviour lives in the subpaths, so importing the types pulls in no runtime code.',
      'These are the value kinds the format speaks in: colors and fills, token references, dimensions, blend modes, layout directions, effects, shapes, borders, and image formats.'
    ],
    signature: `import type {\n  ColorValue, FillValue, GradientValue, TokenRef,\n  DimensionValue, BlendMode, LayoutDirection,\n  EffectType, ShapeType, BorderStyle, ImageFormat,\n} from '@dotgui/kit'`,
    examples: [
      {
        label: 'Type your tooling against the format',
        filename: 'types.ts',
        lang: 'ts',
        code: `import type { ColorValue, FillValue, TokenRef } from '@dotgui/kit'\n\nfunction resolveFill(fill: FillValue, tokens: Record<string, ColorValue>) {\n  // fill can be a hex ColorValue, a gradient, or a $token TokenRef\n  return typeof fill === 'string' && fill.startsWith('$')\n    ? tokens[(fill as TokenRef).slice(1)]\n    : fill\n}`
      }
    ],
    useCases: [
      'Type your own tooling against the format vocabulary.',
      'Shared, versioned types across parser, render, score, and package.'
    ],
    related: ['validate', 'parser'],
    seo: 'The canonical TypeScript types for the .gui format — colors, fills, tokens, dimensions, effects, shapes — exported from the @dotgui/kit root with zero runtime code.'
  },
  {
    slug: 'validate',
    name: '/validate',
    tag: 'gate',
    kind: 'blue',
    api: 'validate(markup)',
    sub: 'the only required step',
    desc: [
      'The one hard check in a file’s life. It answers “is this broken?” — not “is this good?”. Illegal or unparseable markup can’t be saved as a real .gui, so validation is the gate every write passes through.',
      'It returns a structured result: valid or not, the detected version, and a list of errors and warnings each carrying a code, a message, and a path into the tree.'
    ],
    signature: `validate(guiXml: string): ValidationResult\n\ninterface ValidationResult {\n  valid: boolean\n  version: string | null\n  errors: ValidationError[]\n  warnings: ValidationError[]\n}\ninterface ValidationError {\n  code: string\n  message: string\n  path: string        // e.g. "gui > stack[0] > text[2]"\n}`,
    examples: [
      {
        label: 'Validate markup',
        filename: 'validate.ts',
        lang: 'ts',
        code: `import { validate } from '@dotgui/kit/validate'\n\nconst result = validate('<gui platform="web-desktop"><frame/></gui>')\nif (!result.valid) {\n  for (const e of result.errors) console.error(e)\n}`
      },
      {
        label: 'Gate a write — refuse to save broken markup',
        filename: 'save.ts',
        lang: 'ts',
        code: `import { validate } from '@dotgui/kit/validate'\nimport { pack } from '@dotgui/kit/package'\n\nfunction save(xml: string) {\n  const { valid, errors } = validate(xml)\n  if (!valid) throw new Error('invalid .gui: ' + JSON.stringify(errors))\n  return pack({ xml, assets: {} })\n}`
      }
    ],
    useCases: [
      'The required gate before writing or packing a .gui.',
      'Editor diagnostics — surface schema errors inline as the user types.',
      'CI — fail a build on malformed markup.'
    ],
    related: ['package', 'lint', 'score'],
    seo: 'validate(markup) is the only required step for a .gui file — the schema gate that answers “is this broken?”, returning structured errors with codes and tree paths.'
  },
  {
    slug: 'parser',
    name: '/parser',
    tag: 'read',
    kind: 'blue',
    api: 'parseXml(markup)',
    sub: 'markup → resolved model',
    desc: [
      'Turns .gui markup into a resolved model — tokens, styles, and modes already resolved — ready for rendering, scoring, or analysis.',
      'It runs anywhere: parseXml is DOM-free. It uses the platform’s native DOMParser when present (browser, Figma UI) and falls back to @xmldom/xmldom everywhere else — Node, edge, the Figma sandbox. No DOM shim needed.'
    ],
    signature: `parse(bytes: Uint8Array): ParsedGUI | null\nparseXml(xml: string, assetMap?: Record<string, string>): ParsedGUI | null\n\nresolveTokenValue(def, modes, activeMode): string | undefined\nflattenTokens(tokenDefs, modes, activeMode): Record<string, string>`,
    examples: [
      {
        label: 'Parse markup into a model',
        filename: 'parse.ts',
        lang: 'ts',
        code: `import { parseXml } from '@dotgui/kit/parser'\n\nconst model = parseXml('<gui name="demo" platform="web-desktop"><frame name="root"/></gui>')\nconsole.log(model?.platform)   // "web-desktop"\nconsole.log(model?.root)       // ParsedNode tree`
      },
      {
        label: 'Resolve tokens for a specific mode (dark theme)',
        filename: 'tokens.ts',
        lang: 'ts',
        code: `import { flattenTokens } from '@dotgui/kit/parser'\n\nconst values = flattenTokens(model.tokens, model.modes, { theme: 'dark' })\n// { "color.bg": "#000", "color.fg": "#fff", ... }`
      }
    ],
    useCases: [
      'Feed the renderer — parseXml → model → renderToHTML.',
      'Static analysis — walk ParsedNode for linting, metrics, accessibility.',
      'Token / theme resolution — compute concrete values for any active mode.',
      'Round-trip tooling — Figma import/export reads the resolved model.'
    ],
    related: ['render', 'score'],
    seo: 'parseXml turns .gui markup into a resolved model with tokens, styles, and modes resolved — DOM-free, runs in the browser, Node, edge, and the Figma sandbox.'
  },
  {
    slug: 'render',
    name: '/render',
    tag: 'read',
    kind: 'blue',
    api: 'render(…) · renderToHTML(…)',
    sub: 'the reference output',
    desc: [
      'The format’s reference output — render .gui markup to HTML. Browser-clean: no heavy dependencies, no browser engine bundled.',
      'render draws into a live DOM element and can wrap the result in an interactive pan/zoom canvas; renderToHTML returns an HTML string and can preview any mode (e.g. a dark theme). Rendering to a bitmap is not here — that is /rasterize.'
    ],
    signature: `render(code, container, assetMap?, options?): ZoomControl | null\nrenderToHTML(code, assetMap?, options?): string\n\ninterface RenderOptions {\n  zoom?: boolean                 // wrap in a pan/zoom canvas\n  mode?: Record<string, string>  // active mode, e.g. { theme: 'dark' }\n  view?: ZoomView                // restore a saved viewport\n}`,
    examples: [
      {
        label: 'Render into a page (browser)',
        filename: 'stage.ts',
        lang: 'ts',
        code: `import { render } from '@dotgui/kit/render'\n\nconst zoom = render(markup, document.getElementById('stage')!, assetMap, { zoom: true })\nzoom?.(1)   // fit-to-container`
      },
      {
        label: 'Render to a string in another mode',
        filename: 'dark.ts',
        lang: 'ts',
        code: `import { renderToHTML } from '@dotgui/kit/render'\n\nconst darkHtml = renderToHTML(markup, assetMap, { mode: { theme: 'dark' } })`
      }
    ],
    useCases: [
      'Live preview in an app, the landing site, or a Figma plugin.',
      'The reference output every other format derives from (PNG/PDF/SVG).',
      'Feeding a rasterizer — render to HTML, then screenshot to preview.webp.'
    ],
    related: ['parser', 'rasterize'],
    seo: 'render() and renderToHTML() are the reference output of the .gui format — browser-clean HTML from markup, with optional pan/zoom and mode switching.'
  },
  {
    slug: 'score',
    name: '/score',
    tag: 'quality',
    kind: 'purple',
    api: 'score(…) · scorePackage(…)',
    sub: 'CCAC quality report',
    desc: [
      'The CCAC quality model — a read-only, advisory quality report. The kit produces a number and takes no action; what you do with it is your policy.',
      'It measures how good the file is, not how good the design is — like an HTML validator, not a design critic. All four levels (Clean, Consistent, Accessible, Comprehensible) are local, deterministic, and zero-AI. A low score is still a valid, packable file.'
    ],
    signature: `score(xml: string, ctx?: ScoreContext): ScoreOutput\nscorePackage(bytes: Uint8Array, ctx?: ScoreContext): ScoreOutput\nisGateFailure(out: ScoreOutput): out is GateFailure`,
    examples: [
      {
        label: 'Score locally — no injection needed',
        filename: 'score.ts',
        lang: 'ts',
        code: `import { score } from '@dotgui/kit/score'\n\nconst out = score(markup)\nif (!('error' in out) && 'score' in out.clean) console.log(out.clean.score)`
      },
      {
        label: 'Consumer-defined policy (the kit never decides this)',
        filename: 'policy.ts',
        lang: 'ts',
        code: `import { scorePackage, isGateFailure } from '@dotgui/kit/score'\n\nconst out = scorePackage(bytes)\nif (isGateFailure(out)) throw new Error('broken file')\n// e.g. fail CI below a bar — your call, not the kit's\nif (!('status' in out.accessible) && out.accessible.score < 70) process.exit(1)`
      }
    ],
    useCases: [
      'CI quality gate — your threshold, your decision to fail.',
      'Warning badge in an app on known-bad output.',
      'Batch triage — flag or auto-discard low-scoring generated files.'
    ],
    related: ['lint', 'validate'],
    seo: 'score() is the CCAC quality model for .gui — Clean, Consistent, Accessible, Comprehensible — local, deterministic, zero-AI, advisory and never a gate.'
  },
  {
    slug: 'package',
    name: '/package',
    tag: 'i/o',
    kind: 'muted',
    api: 'pack(…) · unpack(…)',
    sub: 'the .gui container, in memory',
    desc: [
      'A .gui is a ZIP of the markup (design.guix), an assets/ folder, and a rendered preview.webp. This module reads and edits that container entirely in memory — nothing touches disk.',
      'Read the markup, list/add/remove assets, or swap the preview without extracting a shadow folder. Edits are pure and chainable — each returns an updated package. setMarkup is guarded: it validates first, so invalid markup never enters the model.'
    ],
    signature: `unpack(bytes: Uint8Array): GuiPackage     // .gui or raw .guix → model\npack(pkg: GuiPackage): Uint8Array         // model → .gui bytes\n\ngetMarkup · getAsset · listAssets · getPreview · info\nsetMarkup · addAsset · removeAsset · setPreview   // pure, return a new package`,
    examples: [
      {
        label: 'Read a .gui without touching disk',
        filename: 'read.ts',
        lang: 'ts',
        code: `import { unpack, getMarkup, listAssets } from '@dotgui/kit/package'\n\nconst pkg = unpack(bytes)\nconsole.log(getMarkup(pkg))\nconsole.log(listAssets(pkg))   // ["assets/hero.webp", ...]`
      },
      {
        label: 'Edit and repack (pure, chainable)',
        filename: 'edit.ts',
        lang: 'ts',
        code: `import { unpack, addAsset, removeAsset, setPreview, pack } from '@dotgui/kit/package'\n\nlet pkg = unpack(bytes)\npkg = addAsset(pkg, 'logo.png', logoBytes)\npkg = removeAsset(pkg, 'old.png')\npkg = setPreview(pkg, previewBytes)\nconst out = pack(pkg)          // new .gui bytes`
      },
      {
        label: 'setMarkup is guarded — invalid edits throw',
        filename: 'guarded.ts',
        lang: 'ts',
        code: `import { setMarkup, InvalidMarkupError } from '@dotgui/kit/package'\n\ntry {\n  pkg = setMarkup(pkg, editedXml)   // saved only if valid\n} catch (e) {\n  if (e instanceof InvalidMarkupError) showErrors(e.errors)\n}`
      }
    ],
    useCases: [
      'Read, edit, and repack .gui files in any tool.',
      'In-memory asset management — add, remove, rename, swap preview.',
      'Guarded saves — never persist a broken edit.'
    ],
    related: ['validate', 'rasterize'],
    seo: 'The @dotgui/kit/package module reads and edits a .gui container in memory — unpack, pack, list/add/remove assets, set preview — pure, byte-based, nothing touches disk.'
  },
  {
    slug: 'lint',
    name: '/lint',
    tag: 'quality',
    kind: 'purple',
    api: 'lintMarkup(…)',
    sub: 'idiom & content checks',
    desc: [
      'The dotgui linter — idiom, best-practice, and content checks on top of schema legality. Where /validate answers “is this legal?”, lint answers “is this good, idiomatic dotgui?”.',
      'It is the single source of truth for idiom rules, replacing the old per-consumer copies. Deterministic fixes for the issues it finds live in /autofix.'
    ],
    signature: `lintMarkup(xml: string): LintResult\n\ninterface LintResult {\n  issues: LintIssue[]   // all findings\n  errors: LintIssue[]   // level === 'error'\n  ok: boolean           // no errors\n  ran: boolean          // false only if markup couldn't be parsed\n}`,
    examples: [
      {
        label: 'Lint markup and report errors',
        filename: 'lint.ts',
        lang: 'ts',
        code: `import { lintMarkup } from '@dotgui/kit/lint'\n\nconst { ok, errors, issues } = lintMarkup(markup)\nif (!ok) for (const e of errors) console.error(\`[\${e.where}] \${e.message}\`)`
      }
    ],
    checks: [
      'Structure — unknown tags, empty spacers, required w/h, fill children needing a sized parent.',
      'Attributes — invented attrs (margin, py, flex…), boolean="false", text-align on text, legacy stroke.',
      'Values — color formats (hex/$token only), gap="auto" without a fill dimension, undefined $token refs.',
      'Content “AI tells” — em/en-dashes, lorem ipsum, placeholder names/emails, emoji in copy, filler verbs.'
    ],
    useCases: [
      'gui lint in the CLI.',
      'gui-app authoring diagnostics.',
      'The skill linter — one rule set, not a re-port.'
    ],
    related: ['autofix', 'validate'],
    seo: 'lintMarkup() is the dotgui linter — idiom, best-practice, and content checks beyond schema legality, the single source of truth for “is this good, idiomatic dotgui?”.'
  },
  {
    slug: 'autofix',
    name: '/autofix',
    tag: 'repair',
    kind: 'purple',
    api: 'autofixMarkup(…)',
    sub: 'deterministic repair',
    desc: [
      'Deterministic auto-repair for dotgui markup. Models make the same mechanical mistakes — CSS habits, invented attributes, boolean="false", bad color formats — and each is an unambiguous string rewrite, so autofix fixes them in place instead of bouncing back to the author.',
      'Anything needing design judgment (missing sizes, undefined tokens, empty spacers) is deliberately not fixed — it stays a /lint error. lint finds; autofix fixes the unambiguous subset.'
    ],
    signature: `autofixMarkup(xml: string): AutofixResult\n\ninterface AutofixResult {\n  xml: string        // rewritten markup (unchanged if nothing to fix)\n  fixes: string[]    // description of each applied fix\n  error?: string     // set only if the markup couldn't be parsed\n}`,
    examples: [
      {
        label: 'Repair markup and log the fixes',
        filename: 'autofix.ts',
        lang: 'ts',
        code: `import { autofixMarkup } from '@dotgui/kit/autofix'\n\nconst { xml, fixes } = autofixMarkup(markup)\nfor (const f of fixes) console.log('·', f)\n// xml is the cleaned markup — write it back`
      }
    ],
    checks: [
      'CSS-habit renames — width→w, height→h, spacing→gap.',
      'Padding shorthands — py→pt/pb, px→pl/pr.',
      'Drops no-op attrs — margin, mt/mb/ml/mr, justify, align-items, flex.',
      'Booleans — removes attr="false" (presence-based).',
      'Alignment — text-align→align; invented align values remapped to the nearest valid one.',
      'Colors — #abc→#aabbcc, rgb()/rgba()→hex. Content — em-dashes in copy → hyphens.'
    ],
    useCases: [
      'gui lint --fix in the CLI.',
      'gui-app — repair on paste or save.',
      'Any agent pipeline that wants mechanical mistakes fixed without a round-trip.'
    ],
    related: ['lint'],
    seo: 'autofixMarkup() deterministically repairs the unambiguous subset of dotgui mistakes — CSS-habit renames, no-op attrs, boolean="false", color formats — leaving judgment calls to lint.'
  },
  {
    slug: 'rasterize',
    name: '/rasterize',
    tag: 'output',
    kind: 'muted',
    api: 'rasterize(…) · renderPreview(…)',
    sub: 'markup → bitmap',
    desc: [
      'Turns a .gui into a bitmap — most importantly the preview.webp embedded when packing, but also PNG/JPEG for gui render. It renders the .gui with the built render bundle in a headless page, then screenshots the result.',
      'The kit ships a default rasterizer on puppeteer-core (a light install that drives a system Chromium) and lets you opt into full puppeteer for a bundled browser. If neither finds a browser, packing still succeeds with a placeholder preview and a clear console error — never a hard failure.'
    ],
    signature: `rasterize(pkg: GuiPackage, opts?): Promise<RasterizeResult>\nrenderPreview(pkg: GuiPackage, opts?): Promise<PreviewResult>\nhasBrowser(engine?: Engine): Promise<boolean>\n\ntype Engine = 'puppeteer-core' | 'puppeteer'   // default via DOTGUI_PUPPETEER`,
    examples: [
      {
        label: 'Generate the preview.webp for a package',
        filename: 'preview.ts',
        lang: 'ts',
        code: `import { renderPreview } from '@dotgui/kit/rasterize'\n\nconst { preview, ok, reason } = await renderPreview(pkg)\n// ok === false → placeholder embedded; reason explains why (e.g. 'no-browser')`
      },
      {
        label: 'Pick the engine (default is puppeteer-core)',
        filename: 'engine.ts',
        lang: 'ts',
        code: `import { rasterize } from '@dotgui/kit/rasterize'\n\n// bundled, reproducible Chromium — heavier install\nconst out = await rasterize(pkg, { engine: 'puppeteer', format: 'png' })`
      }
    ],
    useCases: [
      'The preview.webp embedded at pack time.',
      'PNG/JPEG export for gui render.',
      'Any pipeline that needs a bitmap of a .gui.'
    ],
    related: ['render', 'package'],
    seo: 'rasterize() and renderPreview() turn a .gui into a bitmap — the preview.webp at pack time, plus PNG/JPEG — driving Chromium via puppeteer-core by default.'
  }
]

export function getKitModule(slug: string): KitModule | undefined {
  return kitModules.find(m => m.slug === slug)
}
