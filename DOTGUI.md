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
gui-optimizer (unpublished — optional)
     ↓
optimized.gui
     ↓
@dotgui/kit/render   /   AI Agent   /   Code Generator
```

Each stage has a single, well-defined responsibility. The extractor doesn't optimize. The optimizer doesn't render. The renderer doesn't modify the document. They compose cleanly because they stay in their lane.

---

## The Format

`.gui` is XML. The root element is `<gui>`. Everything else is a child.

### File Structure

```xml
<gui version="0.2" name="Checkout">
  <preview format="webp" src="base64:..." />
  <tokens>
    <color name="primary" value="#007AFF" />
    <number name="space-md" value="16" />
  </tokens>
  <fonts>
    <font family="Inter" source="google" weights="400 600 700" styles="normal" />
  </fonts>
  <col fill="#F2F2F7" gap="16" p="24" w="390">
    <text value="Checkout" font-family="Inter" font-size="28" font-weight="700" fill="#1C1C1E" />
    ...
  </col>
</gui>
```

### Root Element

| Attr | Description |
|---|---|
| `version` | Spec version (`0.2`) |
| `name` | Screen or layer name |

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

Images and vector artwork are embedded in the package under `assets/` and referenced inline — no declaration block needed.

```xml
<!-- embedded raster — stored in assets/ inside the package -->
<img src="assets/hero.webp" w="320" h="200" fit="cover" radius="12" />

<!-- embedded vector icon -->
<img src="assets/icon-close.svg" w="24" h="24" />

<!-- external URL — fallback only -->
<img src="https://example.com/photo.jpg" w="320" h="200" fit="cover" />
```

### Layout Tags

#### `<frame>` — Fixed container

Children are absolutely positioned. Maps to a Figma frame without auto-layout.

```xml
<frame w="390" h="844" fill="#FFFFFF" radius="16" clip>
  <text x="24" y="80" value="Hello" ... />
</frame>
```

#### `<col>` / `<row>` — Auto-layout containers

`<col>` stacks children vertically; `<row>` stacks them horizontally. Sugar for `<stack direction="vertical/horizontal">`.

```xml
<col gap="16" p="24 16" align="top-left" fill="#FFFFFF" radius="12">
  ...
</col>

<row gap="12" align="middle-left" p="16">
  ...
</row>
```

`w` and `h` are optional on auto-layout nodes — absent means hug content. `"fill"` fills the parent; a number is a fixed pixel size.

Padding (`p`) accepts CSS shorthand: `p="24"` all sides, `p="24 16"` vertical/horizontal, `p="8 16 12 16"` each side. Per-side overrides: `pt`, `pr`, `pb`, `pl`.

Gap: `gap="16"` fixed spacing, `gap` or `gap="auto"` space-between, `gap="16 10"` item gap + row gap for wrapping.

Align is a 9-point value: `top-left`, `top-center`, `top-right`, `middle-left`, `middle-center`, `middle-right`, `bottom-left`, `bottom-center`, `bottom-right`, `stretch`, or `baseline`.

#### `<stack>` — Generic auto-layout container

Use `<col>` and `<row>` for new work. `<stack>` remains valid with an explicit `direction` attribute.

```xml
<stack direction="vertical" gap="16" p="24">...</stack>
<stack direction="horizontal" gap="8" align="middle-left">...</stack>
```

#### `<grid>` — Grid container

Supports track grid (explicit track sizes) and unit grid (coordinate canvas) modes.

```xml
<!-- Track grid: 3 equal columns -->
<grid cols="3" gap="16" w="fill">
  <col gc="1/-1" fill="#fff" p="16">...</col>
</grid>

<!-- Unit grid: coordinate canvas -->
<grid unit="8" w="320" h="400">
  <img gc="1/40" gr="1/14" fit="cover" src="assets/cover.webp" />
  <col gc="2/39" gr="27/32" align="middle-center" gap="2">
    <text value="Sarah Johnson" font-size="18" font-weight="700" fill="#111" />
  </col>
</grid>
```

#### `<group>` — Logical grouping

No layout behavior. Children are absolutely positioned relative to the group origin.

```xml
<group x="0" y="0" w="390" h="200" opacity="0.8">
  ...
</group>
```

### Content Tags

#### `<text>` — Text node

Single-style text is self-closing with a `value` attribute. Mixed-style text has `<segment>` children.

```xml
<!-- Single style -->
<text value="Welcome back" x="24" y="80" w="200" h="32"
      font-family="Inter" font-size="22" font-weight="700"
      fill="#1C1C1E" line-height="28" />

<!-- Mixed styles -->
<text x="24" y="80" w="200">
  <segment value="Pay " fill="#6E6E73" font-size="16" />
  <segment value="$42.00" fill="#1C1C1E" font-size="16" font-weight="700" />
</text>
```

Text color is `fill`, not `color`. `w` and `h` replace the old `width` / `height`.

#### `<img>` — Raster and vector image

```xml
<img src="assets/hero.webp" w="390" h="240" fit="cover" radius="12" />
<img src="assets/icon-close.svg" w="24" h="24" />
```

`fit` is `cover`, `contain`, `fill`, or `none`. `src` is an `assets/...` path (packaged format) or an `https://` URL.

### Geometry Tags

Sugar tags for common decorative shapes. No layout children.

```xml
<!-- Rectangle -->
<rect fill="$primary" radius="12" w="340" h="52" />

<!-- Ellipse / circle -->
<ellipse fill="#FF3B30" w="8" h="8" />

<!-- Line separator -->
<line fill="#E5E5EA" />                      <!-- horizontal, 1px, fill width -->
<line fill="#E5E5EA" direction="vertical" /> <!-- vertical -->
```

VECTOR, STAR, POLYGON, and BOOLEAN_OPERATION nodes from Figma are exported as SVG assets and referenced via `<img src="assets/...">`.

### Borders

The `border` shorthand covers most cases: `"[width] [color] [style] [align]"`. Defaults: `1 solid center`.

```xml
<rect fill="#fff" border="1 #E5E5EA" radius="8" w="fill" h="52" />
<rect fill="none" border="2 dashed $focus inside" radius="8" w="fill" h="52" />
```

Per-side borders: `border-top`, `border-right`, `border-bottom`, `border-left`. Longhands: `border-color`, `border-width`, `border-style`, `border-align`.

### Appearance Block

Used when a node has multiple fills, complex borders, or multiple effects. A non-layout child describing the parent's complete paint and effect stack.

```xml
<frame w="320" h="180">
  <appearance>
    <fill type="image" src="assets/hero.webp" fit="crop" x="12" y="8" w="640" h="360" />
    <fill type="linear-gradient" value="linear-gradient(180deg, #00000000 0%, #00000099 100%)" opacity="0.8" />
    <border color="$line" w="1" align="inside" />
    <effect type="drop-shadow" x="0" y="8" radius="24" spread="0" color="#00000033" />
  </appearance>
  ...
</frame>
```

`fill` types: `color`, `linear-gradient`, `radial-gradient`, `angular-gradient`, `image`.
`effect` types: `drop-shadow`, `inner-shadow`, `layer-blur`, `background-blur`, `glass`.

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

These apply to all layout, content, and geometry nodes:

| Attr | Values | Notes |
|---|---|---|
| `opacity` | `0`–`1` | Omitted when `1` |
| `blend` | `multiply`, `screen`, `overlay`, `darken`, `lighten`, ... | Omitted when `normal` |
| `mask` | boolean presence | Alpha mask for subsequent siblings |
| `rotation` | degrees | Omitted when `0` |
| `constraint-h` | `right`, `center`, `scale`, `stretch` | `left` is default, omitted |
| `constraint-v` | `bottom`, `center`, `scale`, `stretch` | `top` is default, omitted |
| `w` | number, `"fill"` | Width. Absent = hug (stack/row/col/text only). Required on frame/rect/ellipse/img/group |
| `h` | number, `"fill"` | Height. Absent = hug (stack/row/col/text only). Required on frame/rect/ellipse/img/group |
| `abs` | boolean presence | Absolute child inside auto-layout |
| `min-width` / `max-width` | px | Omitted when unset |
| `min-height` / `max-height` | px | Omitted when unset |
| `border` | shorthand string | `"[width] [color] [style] [align]"`. Example: `"2 #333 dashed inside"` |

### Packaged Format

`.gui` is always the extension. Internally a `.gui` file is a ZIP package containing `design.guix` (the markup), `preview.webp` (thumbnail), and an `assets/` folder.

```
checkout.gui  (ZIP)
├── design.guix       ← the UI markup
├── preview.webp      ← thumbnail shown before opening
└── assets/
    ├── hero.webp
    └── logo.svg
```

A program that needs to distinguish a package from a raw markup string uses magic bytes: ZIP starts with `PK`, markup starts with `<`. The renderer handles both transparently.

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
- Extracts component and component-set definitions — emits `<component>`, `<component-set>`, and `<instance>` tags with declared props and ad-hoc instance overrides

The extractor is deterministic. Given the same Figma layer, it always produces the same output. It does not guess, summarize, or interpret.

### gui-optimizer

> **Note:** not published to npm — this is an optional, opt-in package (`kit`'s `optionalDependencies`). Treat this section as describing the intended design, not a shipped feature.

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

### @dotgui/kit/render

A TypeScript render function, published as a subpath export of `@dotgui/kit`. Takes a `.gui` document string and renders it into a live DOM container.

```typescript
import { render } from '@dotgui/kit/render'

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
- `@dotgui/kit/render` renderer (TypeScript)
- `gui-optimizer` with 21 rules across 8 passes (unpublished — optional)
- Inline and packaged export formats
- Asset deduplication and WebP conversion
- `<component>`, `<component-set>`, and `<instance>` — component definitions and reuse with declared props and ad-hoc overrides

## Deferred to v2

- `<scroll>` — scrollable containers
- `<overlay>` / `<sheet>` — modal and bottom sheet layers
- Semantic roles — `role="button|input|nav"`
- Named text style tokens
- Interactions and prototyping metadata
- Platform and theme variants on root
- W3C composite token types — `shadow`, `typography`, `border`
- `gui-optimizer` style token resolution in the renderer (rule-08)
