# dotgui

**UI as text.**

dotgui is an open format for describing user interfaces as plain, portable XML. Export any Figma screen to a `.gui` file. Render it in a browser. Feed it to an AI agent. Build with it programmatically.

No proprietary decoder. No binary blob. No context lost in translation.

---

## Why it exists

Design tools store UI as proprietary formats — binary APIs, closed schemas, data you can only access through vendor SDKs. That works fine for designers. It breaks down the moment you want code or AI to reason about a screen.

Screenshots are imprecise. SVG exports are layout-blind. JSON from the Figma API is verbose, deeply nested, and saturated with authoring noise that has nothing to do with how the screen actually looks.

**dotgui exists because there should be one format that works equally well for a human reading it, a renderer drawing it, and an AI agent reasoning about it.**

That format is text. Structured, readable, self-contained text.

---

## Ethos

### Text is the interface

A `.gui` file is plain XML. You can open it in any editor, diff it in git, pipe it through a shell script, paste it into a prompt. No tooling required to read it. The format is the documentation.

### One file, complete picture

A `.gui` file is fully self-contained. Structure, styles, design tokens, font declarations, and binary assets (images, vector artwork) all live in one place. Nothing is externally referenced unless you explicitly choose the packaged format. You hand someone a `.gui` file and they have everything.

### Fidelity to source

The format maps 1-1 to Figma's layer model. Auto-layout, fills, gradients, effects, constraints, mixed-style text, image crops, blend modes — everything is preserved exactly. Nothing is approximated, summarized, or dropped because it was inconvenient to encode. If it's on screen, it's in the file.

### Readable by machines and humans

Attributes are named for what they mean, not what the internal data model calls them. `font-weight="700"` not `fontWeight: [700, 700]`. `direction="horizontal"` not `layoutMode: "HORIZONTAL"`. A file that reads naturally is also a file an LLM can reason about without a translation layer.

### No AI in the format pipeline

The Figma plugin that produces `.gui` is deterministic and rule-based. The optimizer that cleans it up is deterministic and rule-based. Neither invents meaning, infers intent, or guesses at what the designer meant. The format carries what the design contains — nothing more.

### Visual impact is zero

The optimizer is explicitly forbidden from making changes that alter visual output. Every transformation either provably preserves the render or is skipped and logged. Structural cleanup is not an excuse to silently change what the user sees.

### Platform-agnostic

`.gui` makes no assumptions about the target platform. It describes visual structure and properties — not React components, not CSS classes, not SwiftUI views. What you build from it is your decision.

---

## The Pipeline

```
Figma Design
     ↓
dotgui-figma (Figma plugin)
     ↓
raw.gui
     ↓
gui-optimizer
     ↓
optimized.gui
     ↓
dotgui-render   /   AI Agent   /   Code Generator
```

Each stage has a single, well-defined responsibility. The extractor doesn't optimize. The optimizer doesn't render. The renderer doesn't modify the document. They compose cleanly because they stay in their lane.

---

## The Format

`.gui` is XML. The root element is `<gui>`. Everything else is a child.

### File Structure

```xml
<gui version="1.0" name="Checkout" viewport="390x844">
  <preview format="webp" src="base64:..." />
  <tokens>
    <color name="primary" value="#007AFF" />
    <number name="space-md" value="16" />
  </tokens>
  <fonts>
    <font family="Inter" source="google" weights="400 600 700" styles="normal" />
  </fonts>
  <assets>
    <image id="img-1" format="webp" src="base64:..." />
    <image id="svg-1" format="svg" src="base64:..." />
  </assets>
  <stack direction="vertical" fill="#F2F2F7" gap="16" padding="24">
    <text value="Checkout" font-family="Inter" font-size="28" font-weight="700" color="#1C1C1E" />
    ...
  </stack>
</gui>
```

### Root Element

| Attr | Description |
|---|---|
| `version` | Spec version (`1.0`) |
| `name` | Screen or layer name |
| `viewport` | Canvas size as `WxH` |

### Tokens

Design system primitives. Referenced anywhere in the tree with `$name`.

```xml
<tokens>
  <color name="primary" value="#007AFF" />
  <number name="radius-card" value="12" />
  <string name="font-base" value="Inter" />
</tokens>
```

```xml
<shape type="rect" fill="$primary" radius="$radius-card" />
```

### Fonts

Font declarations for the renderer. The renderer uses these to load Google Fonts or fall back gracefully.

```xml
<fonts>
  <font family="Inter" source="google" category="sans-serif"
        weights="400 600 700" styles="normal italic" />
  <font family="SF Pro" source="system" weights="400 600" styles="normal" />
</fonts>
```

`source` is one of `google`, `system`, or `unresolved`. Text nodes still carry their own `font-family` and `font-weight` — the fonts block makes those families resolvable.

### Assets

Embedded images and vector artwork. All raster images are converted to WebP by the plugin.

```xml
<assets>
  <image id="img-1" format="webp" src="base64:..." />
  <image id="svg-1" format="svg" src="base64:..." />
</assets>
```

Reference with `$id`:
```xml
<img src="$img-1" width="320" height="200" fit="cover" />
```

### Layout Tags

#### `<frame>` — Fixed container

Children are absolutely positioned. Maps to a Figma frame without auto-layout.

```xml
<frame width="390" height="844" fill="#FFFFFF" radius="16" clip="true">
  <text x="24" y="80" value="Hello" ... />
</frame>
```

#### `<stack>` — Auto-layout container

Children are flow-positioned. Maps to a Figma auto-layout frame.

```xml
<stack direction="vertical" gap="16" padding="24 16"
       align="center" justify="space-between"
       fill="#FFFFFF" radius="12">
  ...
</stack>
```

`direction` is `horizontal`, `vertical`, or `grid`. Grid adds `columns`, `gap-x`, and `gap-y`.

#### `<group>` — Logical grouping

No layout behavior. Children are absolutely positioned relative to the group origin.

```xml
<group x="0" y="0" width="390" height="200" opacity="0.8">
  ...
</group>
```

### Content Tags

#### `<text>` — Text node

Single-style text is self-closing with a `value` attribute. Mixed-style text has `<segment>` children.

```xml
<!-- Single style -->
<text value="Welcome back" x="24" y="80" width="200" height="32"
      font-family="Inter" font-size="22" font-weight="700"
      color="#1C1C1E" line-height="28" />

<!-- Mixed styles -->
<text x="24" y="80" width="200" height="32">
  <segment value="Hello " font-size="16" font-weight="400" color="#6E6E73" />
  <segment value="World"  font-size="16" font-weight="700" color="#1C1C1E" />
</text>
```

#### `<img>` — Raster image

```xml
<img src="$img-1" x="0" y="0" width="390" height="240"
     fit="cover" radius="12" />
```

`fit` is `cover`, `contain`, `crop`, or `tile`.

#### `<svg>` — Vector artwork

Used for complex graphic clusters — boolean operations, compound vectors, icon groups — where native shapes would lose fidelity.

```xml
<svg src="$svg-1" x="24" y="24" width="48" height="48" />
```

### Shape Tag

```xml
<!-- Rectangle -->
<shape type="rect" x="0" y="0" width="340" height="52"
       fill="$primary" radius="12" />

<!-- Ellipse -->
<shape type="ellipse" x="12" y="12" width="8" height="8" fill="#FF3B30" />

<!-- Arc / donut segment -->
<shape type="ellipse" x="0" y="0" width="100" height="100"
       fill="#007AFF" arc-start="0" arc-end="270" arc-inner="0.6" />

<!-- Line -->
<shape type="line" x="0" y="100" width="390"
       stroke="#E5E5EA" stroke-width="1" />
```

### Appearance Block

Used when a node has multiple fills, image fills, or complex effects. A non-layout child that describes the parent's paint and effect stack.

```xml
<frame width="320" height="180">
  <appearance>
    <fill type="image" src="$img-1" fit="cover" />
    <fill type="color" value="#00000066" />
    <effect type="drop-shadow" x="0" y="8" radius="24" spread="0" color="#00000033" />
  </appearance>
  ...
</frame>
```

`fill` types: `color`, `linear-gradient`, `radial-gradient`, `angular-gradient`, `image`.
`effect` types: `drop-shadow`, `inner-shadow`, `layer-blur`, `background-blur`.

### Fill Values

The `fill` attribute accepts:

| Value | Example |
|---|---|
| Hex opaque | `#1C1C1E` |
| Hex with alpha | `#1C1C1ECC` (last byte is alpha) |
| Linear gradient | `linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)` |
| Radial gradient | `radial-gradient(circle at 50% 30%, #FFF 0%, #000 100%)` |
| Angular gradient | `conic-gradient(from 0deg at 50% 50%, #F00 0deg, #00F 360deg)` |
| Token | `$primary` |

### Shared Visual Attributes

These apply to all layout, content, and shape nodes:

| Attr | Values | Notes |
|---|---|---|
| `opacity` | `0`–`1` | Omitted when `1` |
| `blend` | `multiply`, `screen`, `overlay`, `darken`, `lighten`, ... | Omitted when `normal` |
| `mask` | `true` | Alpha mask for subsequent siblings |
| `rotation` | degrees | Omitted when `0` |
| `constraint-h` | `right`, `center`, `scale`, `stretch` | `left` is default, omitted |
| `constraint-v` | `bottom`, `center`, `scale`, `stretch` | `top` is default, omitted |
| `sizing-h` | `hug`, `fill` | Auto-layout sizing. Omitted when fixed |
| `sizing-v` | `hug`, `fill` | Auto-layout sizing. Omitted when fixed |
| `layout-position` | `absolute` | Absolute child inside auto-layout |
| `min-width` / `max-width` | px | Omitted when unset |
| `min-height` / `max-height` | px | Omitted when unset |

### Packaged Format

For large exports, the plugin produces a ZIP container using the `.gui` extension:

```
checkout.gui (ZIP)
├── index.gui         ← XML with asset paths instead of base64
├── preview.webp
└── assets/
    ├── img-1.webp
    └── svg-1.svg
```

The inline and packaged formats are interchangeable from the renderer's perspective.

---

## The Toolchain

### dotgui-figma

The Figma plugin. Select any visible layer — frame, component, group, shape, text, or vector — and export it as `.gui`. The plugin:

- Traverses the Figma layer tree and maps each node to its `.gui` equivalent
- Extracts and encodes all image fills as WebP via the Canvas API
- Exports complex vector artwork (boolean operations, compound paths, multi-layer icon groups) as SVG assets
- Computes gradient angles and positions from Figma's transform matrices
- Collects font usage and validates families against the Google Fonts catalog
- Generates a WebP preview thumbnail

The extractor is deterministic. Given the same Figma layer, it always produces the same output. It does not guess, summarize, or interpret.

### gui-optimizer

A post-processing pipeline that converts raw extractor output into a cleaner, smaller, more semantically rich `.gui` file.

The optimizer is also deterministic, non-AI, and rule-based. It does not invent meaning. Every transformation either provably preserves the visual render or is skipped and logged.

**The one rule above all: visual impact must be zero.**

#### Pass Order

Rules run in eight passes, each operating on the output of the previous:

| Pass | Responsibility | Rules |
|---|---|---|
| 1 | Remove invisible and empty nodes | Remove nodes with `visible=false`, `opacity=0`, zero dimensions, or empty text content |
| 2 | Remove no-op effects | Drop effects below perceptibility thresholds (shadow opacity `< 0.05`, blur `< 0.5px`, stroke `< 0.5px`) |
| 3 | Normalize values | Uniform color format, collapsed corner radius, rounded floating-point coordinates |
| 4 | Flatten structure | Remove single-child wrapper frames with no visual role; collapse parents and children with identical bounds |
| 5 | Infer layout | Detect vertical/horizontal stacks from child positions (±2px tolerance); detect grid patterns; extract padding |
| 6 | Deduplicate | Remove identical image/SVG assets, remap references to the canonical copy |
| 7 | Final reduction | Re-run flatten pass after layout normalization catches newly eligible nodes |
| 8 | Attach metadata | Add optimizer version, stats, and timing to the output document |

#### Skip Behavior

When a rule cannot be safely applied — ambiguous z-order, uncertain bounds, a protected node — it skips the node, logs the reason, and moves on. The optimizer always produces a valid output file. A skipped rule never causes a failure.

#### Guard Rules

Certain rules are permanent constraints enforced across all passes:

- **Preserve masks** — Never flatten or remove nodes responsible for clipping or masking
- **Preserve z-order** — No transformation may alter visual stacking order
- **Preserve responsive metadata** — Constraints, auto-layout settings, and breakpoints are never stripped
- **Preserve component instances** — Component instance references, IDs, and variant properties are never altered

#### Rule Files

Each rule lives in its own TypeScript file under `gui-optimizer/src/rules/`. The `rules/index.ts` exports two arrays:

- `ALL_RULES` — every rule including guards, for documentation and tooling
- `PIPELINE` — the active execution order, guards excluded

Adding, removing, or reordering rules is a one-line change in `index.ts`.

### dotgui-render

A standalone TypeScript library with zero dependencies. Takes a `.gui` document string and renders it into a live DOM container.

```typescript
import { render } from 'dotgui-render'

const setZoom = render(guiCode, containerEl)
setZoom?.(1)   // fit to container
setZoom?.(2)   // 2× zoom
```

With a pre-built asset map (avoids re-parsing large base64 blobs):

```typescript
const assetMap = {
  '$img-1': 'data:image/webp;base64,...',
  '$svg-1': 'data:image/svg+xml;base64,...',
}
render(guiCode, containerEl, assetMap)
```

The renderer handles: auto-layout (flex and grid), absolute positioning, gradients, shadows, blur effects, blend modes, image fills with crop/fit modes, SVG embedding, mixed-style text, font loading (Google Fonts), arc shapes, and zoom via CSS `zoom`.

Returns a zoom setter or `null` if parsing fails.

---

## Design Decisions

### Why XML, not JSON?

XML has one property JSON does not: **the tag name carries semantic meaning separate from the data**. `<stack direction="horizontal">` reads as a horizontal stack. The equivalent JSON — `{ "type": "FRAME", "layoutMode": "HORIZONTAL" }` — reads as a database record.

XML also has a natural hierarchy that matches UI trees. Nesting communicates containment. Attributes communicate properties. Children communicate children.

For AI consumption specifically, XML is more token-efficient for structured trees than JSON because it avoids repetitive key quoting and deeply nested braces.

### Why not SVG?

SVG is a drawing format. It has no concept of layout, no auto-layout, no semantic text nodes, no design tokens, and no structured component hierarchy. It cannot distinguish between a button and a decorative rectangle. An AI reading SVG sees shapes. An AI reading `.gui` sees structure.

### Why not keep Figma's own data model?

Figma's API returns raw authoring state — a 1:1 snapshot of every property in the editor, including defaults, overrides, legacy values, and implementation details of Figma's rendering engine. It's designed for Figma plugins to read, not for downstream tools to consume.

`.gui` is an export format. It carries what matters for rendering and reasoning, stripped of authoring noise, using names that mean what they say.

### Why is the optimizer separate from the extractor?

The extractor runs inside the Figma plugin sandbox, which has strict browser constraints and no filesystem access. It has one job: faithfully capture the design as structured text, as fast as possible.

The optimizer runs after extraction, in any environment, on any input — whether it came from the Figma plugin, a hand-written `.gui` file, or a code generator. The separation makes both tools simpler and makes the pipeline tool-agnostic. Any extractor can produce `raw.gui`. The optimizer does not care where it came from.

### Why no AI in the pipeline?

Consistency. A deterministic pipeline always produces the same output for the same input. It can be tested, diffed, and trusted. An AI step introduces variability — the output might change between runs, between model versions, or with different prompts.

The optimizer's job is structural cleanup, not interpretation. Interpretation is the AI agent's job, downstream.

---

## What's in v1.0

- `.gui` format spec with full Figma layer coverage
- Figma plugin for export
- `dotgui-render` renderer (TypeScript, zero deps)
- `gui-optimizer` with 21 rules across 8 passes
- Inline and packaged export formats
- Asset deduplication and WebP conversion

## Deferred to v2

- `<component>` and `<instance>` — component definitions and reuse
- `<scroll>` — scrollable containers
- `<overlay>` / `<sheet>` — modal and bottom sheet layers
- Semantic roles — `role="button|input|nav"`
- Named text style tokens
- Interactions and prototyping metadata
- Platform and theme variants on root
- W3C composite token types — `shadow`, `typography`, `border`
- `gui-optimizer` style token resolution in the renderer (rule-08)
