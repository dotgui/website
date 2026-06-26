// Single source of truth for the .gui spec reference. Consumed by the spec hub
// (pages/spec/index.vue) and the per-element pages (pages/spec/[element].vue).
// Each entry becomes its own indexable, citable URL at /spec/<slug>.

export interface SpecTable {
  head: string[]
  /** Each cell is an HTML string (may contain <code>…</code>). */
  rows: string[][]
}

export interface SpecEntry {
  slug: string
  /** Display name shown in the entry head, e.g. "<frame>". Rendered as text. */
  name: string
  /** Optional longer label for the sidebar, e.g. "<stack> / <row> / <col>". */
  navLabel?: string
  /** Short SEO/title fragment, e.g. "frame". */
  title: string
  sub: string
  category: string
  /** Description paragraphs as HTML strings (may contain <code>, <strong>). */
  desc: string[]
  /** Optional note paragraph rendered after the table. */
  note?: string
  table?: SpecTable
  /** Whether to render the shared-attributes table for this element. */
  sharedAttrs?: boolean
  exampleLabel: string
  example: string
  exampleMode?: 'hl' | 'plain'
  /** Slugs of related entries, for cross-linking. */
  related: string[]
  /** Meta-description for the dedicated page. */
  seoDescription: string
}

// ── Shared content reused by row / col / stack ──────────────────────────────
const stackTable: SpecTable = {
  head: ['Attr', 'Values'],
  rows: [
    ['direction', '<code>horizontal</code>, <code>vertical</code> (stack only)'],
    ['gap', 'px, <code>auto</code> (space-between), or <code>"N N"</code> (item + row)'],
    ['align', '9-point: <code>top-left</code>, <code>middle-center</code>, etc.'],
    ['p', 'CSS shorthand padding'],
    ['pt / pr / pb / pl', 'Per-side padding in px'],
    ['wrap', 'Boolean presence — wraps children']
  ]
}
const stackExample =
`<!-- col: vertical stack, hugs height, fills width -->
<col w="fill" gap="12" p="16" fill="#fff" radius="12">
  <text value="Settings" font-size="17"
        font-weight="600" fill="#1C1C1E" />
  <line fill="#E5E5EA" />
  <row w="fill" gap="auto" align="middle-left">
    <text value="Notifications" font-size="15" fill="#1C1C1E" />
    <text value="On" font-size="15" fill="#8E8E93" />
  </row>
</col>

<!-- row: horizontal, space-between, fixed height -->
<row w="390" h="56" p="0 16" gap="auto"
     align="middle-left" fill="#fff">
  <text value=".gui" font-size="17" font-weight="600" fill="#1C1C1E" />
  <img src="assets/avatar.webp" w="32" h="32" radius="16" fit="cover" />
</row>`

const stackDesc = [
  '<code>&lt;row&gt;</code> is horizontal, <code>&lt;col&gt;</code> is vertical. <code>&lt;stack&gt;</code> requires an explicit <code>direction</code>. Children are flow-positioned.',
  '<code>w</code> / <code>h</code> absent = hug content; <code>"fill"</code> = fill parent; number = fixed px. <code>p</code> accepts CSS shorthand (1–4 values). <code>gap="auto"</code> distributes space evenly.'
]

export const specEntries: SpecEntry[] = [
  // ════════════════ FORMAT ════════════════
  {
    slug: 'package', name: '.gui package', title: '.gui package', sub: 'file format', category: 'Format',
    desc: [
      'A <code>.gui</code> file is a ZIP package. The markup, design tokens, font declarations, binary assets, and a preview thumbnail all live in one self-contained file.',
      'Internally, the markup lives as <code>design.guix</code> — an implementation detail never surfaced to the outside. A program distinguishing a package from a raw markup string uses magic bytes: ZIP starts with <code>PK</code>, markup starts with <code>&lt;</code>.'
    ],
    table: { head: ['Entry', 'Description'], rows: [
      ['design.guix', 'The UI markup — always this name inside the package'],
      ['preview.webp', 'Thumbnail for visual verification before opening'],
      ['assets/', 'Embedded WebP images and SVG vectors']
    ]},
    exampleLabel: 'Package structure', exampleMode: 'plain',
    example: `checkout.gui  (ZIP)
├── design.guix
├── preview.webp
└── assets/
    ├── hero.webp
    └── icon-close.svg`,
    related: ['gui', 'assets', 'fonts'],
    seoDescription: 'The .gui package is a ZIP file containing the UI markup (design.guix), a preview thumbnail, and embedded assets — a single self-contained file for any user interface.'
  },
  {
    slug: 'gui', name: '<gui>', title: '<gui> root element', sub: 'document root', category: 'Format',
    desc: [
      'The root element is a document envelope — never rendered. Direct children are metadata blocks or exactly one root layout node. Metadata always precedes the layout root.'
    ],
    table: { head: ['Attr', 'Description'], rows: [
      ['version', 'Spec version. Current: <code>0.2</code>'],
      ['name', 'Screen or layer name from the source design']
    ]},
    exampleLabel: 'Example',
    example: `<gui version="0.2" name="Checkout">
  <tokens>
    <color name="primary" value="#007AFF" />
  </tokens>
  <fonts>
    <font family="Inter" source="google" weights="400 700" />
  </fonts>
  <col w="390" fill="#F2F2F7" gap="16" p="24">
    <text value="Checkout"
          font-family="Inter" font-size="28"
          font-weight="700" fill="#1C1C1E" />
  </col>
</gui>`,
    related: ['package', 'root-canvas', 'tokens'],
    seoDescription: 'The <gui> element is the document root of a .gui file — a never-rendered envelope holding metadata blocks and exactly one root layout node.'
  },
  {
    slug: 'root-canvas', name: 'Root Canvas', title: 'Root canvas patterns', sub: 'canvas patterns', category: 'Format',
    desc: [
      'The first layout tag under <code>&lt;gui&gt;</code> defines the canvas. Two patterns cover all cases.'
    ],
    table: { head: ['Root', 'When', 'h'], rows: [
      ['&lt;col w="390"&gt;', 'Content-driven screen, AI-authored', 'absent — hugs children'],
      ['&lt;frame w="390" h="844"&gt;', 'Fixed artboard, Figma export', 'required']
    ]},
    note: 'Default to <code>&lt;col&gt;</code> — it cannot clip content. <code>&lt;frame&gt;</code> children are absolutely positioned. <code>&lt;col&gt;</code> children flow vertically.',
    exampleLabel: 'Both patterns',
    example: `<!-- content-driven: h absent, hugs children -->
<gui version="0.2" name="Feed">
  <col w="390" fill="#fff" gap="0">
    ...
  </col>
</gui>

<!-- fixed artboard: h required, children absolute -->
<gui version="0.2" name="Splash">
  <frame w="390" h="844" fill="#000">
    <img x="0" y="0" src="assets/bg.webp" w="390" h="844" fit="cover" />
    <text x="24" y="720" value="Welcome" font-size="32"
          font-weight="700" fill="#fff" />
  </frame>
</gui>`,
    related: ['gui', 'col', 'frame'],
    seoDescription: 'The root canvas of a .gui file is the first layout tag under <gui>: use <col> for content-driven screens or <frame> for fixed Figma artboards.'
  },

  // ════════════════ METADATA ════════════════
  {
    slug: 'tokens', name: '<tokens>', title: '<tokens> design primitives', sub: 'design primitives', category: 'Metadata',
    desc: [
      'Design system primitives. Referenced anywhere in the tree with <code>$name</code>. Figma Variables resolve to <code>&lt;tokens&gt;</code> entries. Only tokens used in the exported tree are emitted.'
    ],
    table: { head: ['Tag', 'value'], rows: [
      ['&lt;color&gt;', 'Hex color, e.g. <code>#007AFF</code>'],
      ['&lt;number&gt;', 'Numeric value, e.g. <code>12</code>'],
      ['&lt;string&gt;', 'String value, e.g. <code>Inter</code>']
    ]},
    exampleLabel: 'Example',
    example: `<tokens>
  <color name="primary"     value="#007AFF" />
  <color name="surface"     value="#FFFFFF" />
  <color name="ink"         value="#1C1C1E" />
  <number name="radius-card" value="12" />
  <number name="space-md"   value="16" />
  <string name="font-base"  value="Inter" />
</tokens>

<!-- $name reference anywhere in the tree -->
<col fill="$surface" p="$space-md" gap="12">
  <rect fill="$primary" radius="$radius-card" w="fill" h="52" />
  <text value="Hello" font-family="$font-base" fill="$ink" font-size="17" />
</col>`,
    related: ['styles', 'fonts', 'fill-values'],
    seoDescription: 'The <tokens> block defines .gui design system primitives — colors, numbers, and strings — referenced anywhere with $name syntax. Maps to Figma Variables.'
  },
  {
    slug: 'styles', name: '<styles>', title: '<styles> text styles', sub: 'text styles', category: 'Metadata',
    desc: [
      'Named text styles from the design system. Each <code>&lt;text-style&gt;</code> captures a full typography definition. Text nodes reference a style by name — individual font attrs are omitted when a style is applied.',
      'Color and layout attrs are always inlined — they are not part of the text style definition. Only styles used in the exported tree are emitted.'
    ],
    table: { head: ['Attr', 'Description'], rows: [
      ['name', 'Style name, e.g. <code>Heading/H1</code>'],
      ['font-family', 'Font family name'],
      ['font-size', 'Size in px'],
      ['font-weight', 'Numeric weight (100–900)'],
      ['line-height', 'px or percent']
    ]},
    exampleLabel: 'Example',
    example: `<styles>
  <text-style name="Heading/H1"
              font-family="Inter" font-size="32"
              font-weight="700" line-height="40" />
  <text-style name="Body/Regular"
              font-family="Inter" font-size="16"
              font-weight="400" line-height="24" />
</styles>

<!-- text-style ref — individual font attrs omitted -->
<text text-style="Heading/H1" value="Welcome"
      fill="#1C1C1E" x="24" y="80" />

<text text-style="Body/Regular" value="Here's what's new."
      fill="#6E6E73" x="24" y="132" />`,
    related: ['text', 'tokens', 'fonts'],
    seoDescription: 'The <styles> block defines named text styles for the .gui format — reusable typography definitions referenced by name from text nodes.'
  },
  {
    slug: 'fonts', name: '<fonts>', title: '<fonts> declarations', sub: 'font declarations', category: 'Metadata',
    desc: [
      'Font declarations for the renderer to load Google Fonts or fall back gracefully. Text nodes still carry their own <code>font-family</code> and <code>font-weight</code> — the fonts block makes those families resolvable.'
    ],
    table: { head: ['Attr', 'Values'], rows: [
      ['family', 'Font family name'],
      ['source', '<code>google</code>, <code>system</code>, <code>unresolved</code>'],
      ['category', '<code>sans-serif</code>, <code>serif</code>, <code>monospace</code>'],
      ['weights', 'Space-separated numeric weights, e.g. <code>400 600 700</code>'],
      ['styles', '<code>normal italic</code>']
    ]},
    exampleLabel: 'Example',
    example: `<fonts>
  <font family="Inter"
        source="google"
        category="sans-serif"
        weights="400 500 600 700"
        styles="normal italic" />
  <font family="SF Pro Display"
        source="system"
        weights="400 600 700"
        styles="normal" />
  <font family="CustomBrand"
        source="unresolved"
        weights="700" />
</fonts>`,
    related: ['text', 'styles', 'tokens'],
    seoDescription: 'The <fonts> block declares font families for the .gui renderer — Google, system, or unresolved sources with weights and styles.'
  },
  {
    slug: 'assets', name: 'Assets', title: 'Assets — images & vectors', sub: 'images & vectors', category: 'Metadata',
    desc: [
      'Images and vector artwork are embedded in <code>assets/</code> and referenced inline via <code>src</code> — no declaration block, no <code>$id</code> indirection.',
      'All raster images are converted to WebP at 0.85 quality by the Figma plugin. External URLs are a fallback only. If a URL reference fails to load, the renderer shows an <code>asset not loaded</code> error state — no silent failure.'
    ],
    table: { head: ['src pattern', 'When'], rows: [
      ['assets/img.webp', 'Embedded raster (default for all exports)'],
      ['assets/icon.svg', 'Embedded vector artwork'],
      ['https://…', 'External URL — fallback only']
    ]},
    exampleLabel: 'Example',
    example: `<!-- embedded raster (default for all Figma exports) -->
<img src="assets/hero.webp"
     w="390" h="240" fit="cover" />

<!-- embedded SVG vector icon -->
<img src="assets/icon-close.svg" w="24" h="24" />

<!-- image with corner radius and layer name -->
<img name="Avatar" src="assets/avatar.webp"
     w="48" h="48" radius="24" fit="cover" />

<!-- external URL — fallback only -->
<img src="https://example.com/photo.jpg"
     w="390" h="240" fit="cover" />`,
    related: ['img', 'package', 'gui'],
    seoDescription: 'Assets in a .gui file are WebP images and SVG vectors embedded under assets/ and referenced inline via src, with external URLs as a fallback.'
  },
  {
    slug: 'components', name: '<components>', title: '<components> system', sub: 'component system', category: 'Metadata',
    desc: [
      'A <code>&lt;components&gt;</code> block at the top of the document holds all component definitions. Instances reference a component by <code>id</code> and pass prop overrides as attributes.',
      '<code>&lt;component&gt;</code> defines a single reusable component. <code>&lt;component-set&gt;</code> groups related variants. Each <code>&lt;variant&gt;</code> is a member of the set.',
      'Declared props use a <code>&lt;props&gt;</code> block with <code>&lt;prop&gt;</code> entries. Ad-hoc overrides skip the props block and match by sanitized layer name.'
    ],
    table: { head: ['prop type', 'Effect'], rows: [
      ['text', 'Overrides <code>value</code> attr of the target layer'],
      ['visible', 'Hides target when set to <code>"false"</code>']
    ]},
    exampleLabel: 'Component + instance',
    example: `<components>
  <component name="Card/Product" id="comp-card">
    <props>
      <prop name="title" type="text" target="title" />
      <prop name="show-badge" type="visible" target="badge" />
    </props>
    <col w="320" radius="12" fill="#fff" p="16" gap="8">
      <text id="title" value="Product Name"
            font-size="16" font-weight="600" fill="#1C1C1E" />
      <ellipse id="badge" w="8" h="8" fill="#FF3B30" />
    </col>
  </component>
</components>

<!-- instance with prop overrides -->
<instance component="comp-card"
          title="Nike Air Max 90"
          show-badge="false"
          x="24" y="120" />`,
    related: ['gui', 'col', 'text'],
    seoDescription: 'The <components> block defines reusable components and variant sets in the .gui format, instantiated by id with text and visibility prop overrides.'
  },

  // ════════════════ LAYOUT ════════════════
  {
    slug: 'frame', name: '<frame>', title: '<frame> fixed container', sub: 'fixed container', category: 'Layout',
    desc: [
      'Fixed container. Children are absolutely positioned with <code>x</code> and <code>y</code> attributes. Maps to a Figma frame without auto-layout.',
      '<code>w</code> and <code>h</code> are required. <code>clip</code> (boolean presence) clips content to bounds.'
    ],
    table: { head: ['Attr', 'Description'], rows: [
      ['w', 'Width in px — required'],
      ['h', 'Height in px — required'],
      ['fill', 'Background fill'],
      ['radius', 'Corner radius in px'],
      ['clip', 'Boolean presence — clips to bounds'],
      ['x / y', 'Position on children inside frame']
    ]},
    sharedAttrs: true,
    exampleLabel: 'Example',
    example: `<frame w="390" h="844" fill="#FFFFFF" clip>
  <!-- children use x/y for absolute position -->
  <img x="0" y="0" src="assets/bg.webp"
       w="390" h="240" fit="cover" />
  <text x="24" y="260" value="Good morning"
        font-family="Inter" font-size="28"
        font-weight="700" fill="#1C1C1E" />
  <rect x="24" y="780" w="342" h="52"
        fill="#007AFF" radius="12" />
</frame>`,
    related: ['col', 'group', 'rect'],
    seoDescription: 'The <frame> element is a fixed container in the .gui format with absolutely positioned x/y children, mapping to a Figma frame without auto-layout.'
  },
  {
    slug: 'stack', name: '<stack>', navLabel: '<stack> / <row> / <col>', title: '<stack> auto-layout', sub: 'auto-layout', category: 'Layout',
    desc: stackDesc, table: stackTable, sharedAttrs: true,
    exampleLabel: 'Example', example: stackExample,
    related: ['row', 'col', 'grid'],
    seoDescription: 'The <stack> element is the auto-layout primitive in the .gui format — set direction to horizontal or vertical, with gap, align, padding, and wrap.'
  },
  {
    slug: 'row', name: '<row>', title: '<row> horizontal auto-layout', sub: 'horizontal auto-layout', category: 'Layout',
    desc: [
      '<code>&lt;row&gt;</code> is a horizontal auto-layout container — children flow left to right. It is shorthand for <code>&lt;stack direction="horizontal"&gt;</code>.',
      ...stackDesc.slice(1)
    ], table: stackTable, sharedAttrs: true,
    exampleLabel: 'Example', example: stackExample,
    related: ['col', 'stack', 'grid'],
    seoDescription: 'The <row> element is a horizontal auto-layout container in the .gui format — children flow left to right with gap, align, padding, and wrap.'
  },
  {
    slug: 'col', name: '<col>', title: '<col> vertical auto-layout', sub: 'vertical auto-layout', category: 'Layout',
    desc: [
      '<code>&lt;col&gt;</code> is a vertical auto-layout container — children flow top to bottom. It is shorthand for <code>&lt;stack direction="vertical"&gt;</code> and the recommended default screen root.',
      ...stackDesc.slice(1)
    ], table: stackTable, sharedAttrs: true,
    exampleLabel: 'Example', example: stackExample,
    related: ['row', 'stack', 'frame'],
    seoDescription: 'The <col> element is a vertical auto-layout container in the .gui format — children flow top to bottom with gap, align, padding, and wrap.'
  },
  {
    slug: 'grid', name: '<grid>', title: '<grid> track & unit grid', sub: 'track grid & unit grid', category: 'Layout',
    desc: [
      'Two modes determined by which attrs are present. <strong>Track grid</strong> (<code>cols</code>/<code>rows</code>): parent declares track sizes, children place themselves with <code>gc</code>/<code>gr</code>. <strong>Unit grid</strong> (<code>unit</code>): fixed coordinate canvas, each square equals <code>unit</code> px.',
      'A <code>gc</code>/<code>gr</code> range fills the spanned tracks (no <code>w</code>/<code>h</code> needed). A single value hugs content. Range end is inclusive: <code>gc="2/5"</code> occupies columns 2–5.'
    ],
    table: { head: ['Attr', 'Mode', 'Example'], rows: [
      ['cols', 'track', '<code>"3"</code>, <code>"240 1fr"</code>, <code>"fill 200"</code>'],
      ['rows', 'track', 'same rules as cols'],
      ['unit', 'unit', '<code>"8"</code> — each square = 8 px'],
      ['gc', 'both', '<code>"1"</code>, <code>"2/5"</code>, <code>"1/-1"</code>'],
      ['gr', 'both', 'same rules as gc'],
      ['gap', 'both', 'px or <code>"col row"</code>']
    ]},
    sharedAttrs: true,
    exampleLabel: 'Track grid — dashboard layout',
    example: `<!-- track grid: sidebar + main layout -->
<grid cols="200 1fr" rows="56 1fr"
      gap="0" w="fill" h="fill">

  <!-- header spans all columns -->
  <row gc="1/-1" gr="1" h="fill"
       fill="#fff" p="0 20"
       border-bottom="1 #E5E5EA"
       align="middle-left" gap="auto">
    <text value="Dashboard" font-size="17" font-weight="600" fill="#1C1C1E" />
    <img src="assets/avatar.webp" w="28" h="28" radius="14" fit="cover" />
  </row>

  <!-- sidebar -->
  <col gc="1" gr="2" fill="#f7f7f7" p="12" gap="4">
    <row w="fill" p="10 12" radius="8" fill="#007AFF" align="middle-left">
      <text value="Home" fill="#fff" font-size="14" font-weight="500" />
    </row>
    <row w="fill" p="10 12" radius="8" align="middle-left">
      <text value="Analytics" fill="#8E8E93" font-size="14" />
    </row>
  </col>

  <!-- main content -->
  <col gc="2" gr="2" p="32" gap="16">
    <text value="Overview" font-size="22" font-weight="700" fill="#1C1C1E" />
  </col>

</grid>`,
    related: ['stack', 'frame', 'col'],
    seoDescription: 'The <grid> element supports two modes in the .gui format: track grids (cols/rows with gc/gr placement) and unit grids (fixed coordinate canvas).'
  },
  {
    slug: 'group', name: '<group>', title: '<group> logical grouping', sub: 'logical grouping', category: 'Layout',
    desc: [
      'No layout behavior. Children are absolutely positioned relative to the group origin. Maps to a Figma group node.',
      'When the first child of a Figma group is a mask node, the mask shape is extracted as an SVG asset and hoisted onto the <code>&lt;group&gt;</code> as <code>mask-src</code> attrs. The mask child is excluded from the rendered children.'
    ],
    table: { head: ['Attr', 'Description'], rows: [
      ['x / y', 'Group position'],
      ['w / h', 'Group dimensions — required'],
      ['opacity', '0–1, omitted when 1'],
      ['mask-src', 'Asset path for the SVG mask shape'],
      ['mask-x / mask-y', 'Mask position relative to group origin'],
      ['mask-width / mask-height', 'Mask dimensions']
    ]},
    sharedAttrs: true,
    exampleLabel: 'Group with mask',
    example: `<!-- basic group: children absolutely positioned -->
<group x="0" y="0" w="390" h="200" opacity="0.9">
  <img x="0" y="0" src="assets/hero.webp"
       w="390" h="200" fit="cover" />
  <text x="24" y="160" value="Hero caption"
        font-size="14" fill="#fff" />
</group>

<!-- group with mask from Figma -->
<group x="0" y="0" w="390" h="200"
       mask-src="assets/mask-1.svg"
       mask-x="0" mask-y="0"
       mask-width="390" mask-height="200">
  <img x="0" y="0" src="assets/texture.webp"
       w="390" h="200" fit="cover" />
</group>`,
    related: ['frame', 'img', 'appearance'],
    seoDescription: 'The <group> element is a logical grouping in the .gui format with absolutely positioned children and optional SVG mask support, mapping to a Figma group.'
  },

  // ════════════════ CONTENT ════════════════
  {
    slug: 'text', name: '<text>', title: '<text> node', sub: 'text node', category: 'Content',
    desc: [
      'Single-style text is self-closing with a <code>value</code> attribute. Mixed-style text has <code>&lt;segment&gt;</code> children — each segment overrides font attrs for its run.',
      '<code>text-style</code> references a named style; individual font attrs are omitted when a style is referenced. Variable fonts use <code>font-variation</code>; OpenType features use <code>font-feature</code>.'
    ],
    table: { head: ['Attr', 'Values'], rows: [
      ['value', 'Text content (single-style only)'],
      ['font-family', 'Font family name'],
      ['font-size', 'px'],
      ['font-weight', '100–900'],
      ['font-style', '<code>italic</code>'],
      ['fill', 'Hex, gradient, or token'],
      ['line-height', 'px or percent'],
      ['letter-spacing', 'px or percent'],
      ['align', '<code>left</code>, <code>center</code>, <code>right</code>, <code>justified</code>'],
      ['vertical-align', '<code>top</code>, <code>center</code>, <code>bottom</code>'],
      ['text-style', 'Named style reference'],
      ['decoration', '<code>underline</code>, <code>strikethrough</code>'],
      ['truncate', 'Boolean presence — ellipsis on overflow'],
      ['max-lines', 'Max lines before clipping'],
      ['list', '<code>disc</code>, <code>decimal</code>'],
      ['href', 'URL — wraps text in hyperlink']
    ]},
    sharedAttrs: true,
    exampleLabel: 'Single, mixed, decorated',
    example: `<!-- single-style -->
<text value="Welcome back"
      font-family="Inter" font-size="22"
      font-weight="700" fill="#1C1C1E"
      line-height="28" />

<!-- mixed styles: segment children -->
<text x="24" y="80" w="300">
  <segment value="Pay " fill="#6E6E73" font-size="16" />
  <segment value="$42.00"
           fill="#1C1C1E" font-size="16" font-weight="700" />
</text>

<!-- variable font + OpenType features -->
<text value="Dashboard"
      font-family="Inter" font-size="28" font-weight="700"
      font-variation='"wght" 700, "opsz" 28'
      font-feature='"tnum", "ss01"'
      fill="#1C1C1E" />

<!-- truncated with max lines -->
<text value="This is a longer description that may overflow"
      font-size="14" fill="#6E6E73"
      w="240" truncate max-lines="2" />`,
    related: ['styles', 'fonts', 'fill-values'],
    seoDescription: 'The <text> element renders text in the .gui format — single-style via value, mixed-style via <segment> children, with full typography, fills, and truncation.'
  },
  {
    slug: 'img', name: '<img>', title: '<img> image & vector', sub: 'image & vector', category: 'Content',
    desc: [
      'Handles both raster and vector assets. The renderer detects format from the file extension at render time — the author only writes <code>src</code>, <code>w</code>, and <code>h</code>.',
      'The <code>name</code> attribute carries the Figma layer name. <code>fit</code> controls image scaling within the bounding box.'
    ],
    table: { head: ['Attr', 'Values'], rows: [
      ['src', '<code>assets/…</code> path or <code>https://</code> URL'],
      ['w / h', 'px — required'],
      ['fit', '<code>cover</code>, <code>contain</code>, <code>fill</code>, <code>none</code>'],
      ['radius', 'Corner radius in px'],
      ['name', 'Figma layer name']
    ]},
    sharedAttrs: true,
    exampleLabel: 'Example',
    example: `<!-- raster: embedded WebP -->
<img name="Hero Image"
     src="assets/hero.webp"
     w="390" h="240" fit="cover" />

<!-- avatar with clip radius -->
<img src="assets/avatar.webp"
     w="48" h="48" radius="24"
     fit="cover" />

<!-- SVG icon: vector from assets/ -->
<img src="assets/icon-check.svg" w="20" h="20" />

<!-- external fallback -->
<img src="https://example.com/photo.jpg"
     w="390" h="240" fit="cover" />`,
    related: ['assets', 'rect', 'frame'],
    seoDescription: 'The <img> element embeds raster and vector assets in the .gui format — format is detected from the extension, with src, dimensions, fit, and radius.'
  },

  // ════════════════ GEOMETRY ════════════════
  {
    slug: 'rect', name: '<rect>', title: '<rect> rectangle', sub: 'rectangle', category: 'Geometry',
    desc: [
      'Sugar for a childless <code>&lt;frame&gt;</code>. Signals decorative intent — no layout children. <code>w</code> and <code>h</code> are required.',
      'Supports all visual attributes: <code>fill</code>, <code>border</code>, <code>radius</code>, <code>opacity</code>, <code>blend</code>, <code>rotation</code>, <code>appearance</code>. Does not accept layout attributes (<code>direction</code>, <code>gap</code>, <code>p</code>, <code>align</code>).',
      'Border shorthand: <code>"[width] [color] [style] [align]"</code>. Defaults: 1px solid center.'
    ],
    sharedAttrs: true,
    exampleLabel: 'Example',
    example: `<!-- solid fill -->
<rect fill="$primary" w="342" h="52" radius="12" />

<!-- bordered card background -->
<rect fill="$surface" w="320" h="80"
      radius="12" border="1 #E5E5EA" />

<!-- dashed focus ring -->
<rect fill="none"
      border="2 dashed $focus inside"
      w="320" h="64" radius="8" />

<!-- gradient rect -->
<rect fill="linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)"
      w="fill" h="160" radius="16" />`,
    related: ['ellipse', 'line', 'frame'],
    seoDescription: 'The <rect> element is a rectangle in the .gui format — sugar for a childless <frame> supporting fill, border, radius, and all visual attributes.'
  },
  {
    slug: 'ellipse', name: '<ellipse>', title: '<ellipse> oval & circle', sub: 'oval & circle', category: 'Geometry',
    desc: [
      'Sugar for <code>&lt;frame radius="9999"&gt;</code>. Full-radius rendering is the contract — <code>radius</code> is not an attribute on <code>&lt;ellipse&gt;</code>. Equal dimensions produce a circle.',
      'Arc and donut shapes (progress rings, pie segments) are SVG assets referenced via <code>&lt;img&gt;</code>.'
    ],
    table: { head: ['Attr', 'Description'], rows: [
      ['w / h', 'px — required. Equal = circle, unequal = oval'],
      ['fill', 'Background fill'],
      ['border', 'Border shorthand']
    ]},
    sharedAttrs: true,
    exampleLabel: 'Example',
    example: `<!-- circle: equal w and h -->
<ellipse fill="#FF3B30" w="8" h="8" />

<!-- avatar placeholder circle -->
<ellipse fill="#E5E5EA" w="48" h="48" />

<!-- bordered ring -->
<ellipse fill="none" border="2 $primary" w="48" h="48" />

<!-- oval -->
<ellipse fill="$blue" w="80" h="40" />`,
    related: ['rect', 'line', 'img'],
    seoDescription: 'The <ellipse> element draws ovals and circles in the .gui format — sugar for a full-radius frame; equal width and height produce a circle.'
  },
  {
    slug: 'line', name: '<line>', title: '<line> separator', sub: 'separator', category: 'Geometry',
    desc: [
      'Sugar for a thin frame used as a visual divider. Default: horizontal, <code>thickness="1"</code>, <code>w="fill"</code>.'
    ],
    table: { head: ['Attr', 'Values'], rows: [
      ['fill', 'Line color'],
      ['direction', '<code>vertical</code> — horizontal is default'],
      ['thickness', 'px, default 1']
    ]},
    sharedAttrs: true,
    exampleLabel: 'Example',
    example: `<!-- horizontal divider (default) -->
<line fill="#E5E5EA" />

<!-- custom thickness -->
<line fill="#007AFF" thickness="2" />

<!-- vertical divider -->
<line fill="#E5E5EA" direction="vertical" />

<!-- fixed width -->
<line fill="#E5E5EA" w="240" />`,
    related: ['rect', 'ellipse', 'stack'],
    seoDescription: 'The <line> element is a separator in the .gui format — sugar for a thin frame used as a divider, horizontal by default with configurable thickness.'
  },

  // ════════════════ APPEARANCE ════════════════
  {
    slug: 'appearance', name: '<appearance>', title: '<appearance> paint & effects', sub: 'paint & effects stack', category: 'Appearance',
    desc: [
      "A non-layout child that describes the parent's complete paint and effect stack. Used when a node has multiple fills, complex borders, or multiple effects.",
      'All three stacks — fills, borders, effects — are ordered in document order. When <code>&lt;appearance&gt;</code> contains at least one <code>&lt;border&gt;</code>, the <code>border</code> shorthand on the parent is ignored.',
      'Simple single-paint cases use <code>fill="…"</code> directly on the element. Use <code>&lt;appearance&gt;</code> only when multiple layers or paint-level metadata (opacity, blend, crop transform) are needed.'
    ],
    table: { head: ['Child', 'type values'], rows: [
      ['&lt;fill&gt;', '<code>color</code>, <code>linear-gradient</code>, <code>radial-gradient</code>, <code>angular-gradient</code>, <code>image</code>'],
      ['&lt;border&gt;', 'color, w, align (<code>inside</code>/<code>center</code>/<code>outside</code>), style, dash, cap, join'],
      ['&lt;effect&gt;', '<code>drop-shadow</code>, <code>inner-shadow</code>, <code>layer-blur</code>, <code>background-blur</code>, <code>glass</code>']
    ]},
    exampleLabel: 'Multi-fill + shadow',
    example: `<frame w="320" h="180" radius="16">
  <appearance>
    <!-- image fill behind a gradient overlay -->
    <fill type="image"
          src="assets/hero.webp"
          fit="cover" />
    <fill type="linear-gradient"
          value="linear-gradient(180deg, #00000000 0%, #000000CC 100%)"
          blend="normal" />
    <!-- border stack -->
    <border color="#FFFFFF33" w="1" align="inside" />
    <!-- effects -->
    <effect type="drop-shadow"
            x="0" y="8" radius="24"
            spread="0" color="#00000033" />
    <effect type="background-blur" radius="20" />
  </appearance>
  <text abs x="16" y="140" value="Mountain View"
        font-size="18" font-weight="700" fill="#fff" />
</frame>`,
    related: ['fill-values', 'shared-attrs', 'frame'],
    seoDescription: 'The <appearance> element describes a complete paint and effect stack in the .gui format — multiple fills, borders, and effects in document order.'
  },
  {
    slug: 'fill-values', name: 'Fill Values', title: 'Fill values', sub: 'fill attribute formats', category: 'Appearance',
    desc: [
      'The <code>fill</code> attribute accepts hex colors, gradient functions, and token references. Alpha is encoded as the last byte of an 8-digit hex: <code>#1C1C1ECC</code>.',
      'Gradient syntax mirrors CSS — <code>linear-gradient()</code>, <code>radial-gradient()</code>, <code>conic-gradient()</code>. Token references use <code>$name</code> syntax.'
    ],
    table: { head: ['Format', 'Example'], rows: [
      ['Hex opaque', '<code>#1C1C1E</code>'],
      ['Hex + alpha', '<code>#1C1C1ECC</code> (last byte = alpha)'],
      ['Linear gradient', '<code>linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)</code>'],
      ['Radial gradient', '<code>radial-gradient(circle at 50% 30%, #FFF 0%, #000 100%)</code>'],
      ['Angular gradient', '<code>conic-gradient(from 0deg at 50% 50%, #F00 0deg, #00F 360deg)</code>'],
      ['Token', '<code>$primary</code>']
    ]},
    exampleLabel: 'Fill values in use',
    example: `<!-- solid opaque hex -->
<rect fill="#1C1C1E" w="100" h="100" />

<!-- hex with alpha (last byte = opacity) -->
<rect fill="#1C1C1ECC" w="100" h="100" />

<!-- linear gradient -->
<rect fill="linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)"
      w="fill" h="160" radius="16" />

<!-- radial gradient -->
<rect fill="radial-gradient(circle at 50% 30%, #FFF 0%, #1C1C1E 100%)"
      w="200" h="200" />

<!-- angular/conic gradient -->
<rect fill="conic-gradient(from 0deg at 50% 50%, #F00 0deg, #00F 360deg)"
      w="120" h="120" radius="60" />

<!-- design token reference -->
<rect fill="$primary" w="fill" h="52" radius="12" />`,
    related: ['tokens', 'appearance', 'rect'],
    seoDescription: 'Fill values in the .gui format: hex colors with optional alpha, CSS-style linear/radial/conic gradients, and $token references.'
  },
  {
    slug: 'shared-attrs', name: 'Shared Attrs', title: 'Shared attributes', sub: 'all nodes', category: 'Appearance',
    desc: [
      'Visual attributes available on all layout, content, and geometry nodes.',
      '<strong>Boolean presence convention:</strong> bare attributes without a value are treated as <code>true</code>. <code>&lt;frame clip&gt;</code> = <code>&lt;frame clip="true"&gt;</code>. Applies to: <code>clip</code>, <code>mask</code>, <code>wrap</code>, <code>abs</code>, <code>truncate</code>, <code>reverse-z</code>.'
    ],
    table: { head: ['Attr', 'Values', 'Notes'], rows: [
      ['opacity', '0–1', 'Omitted when 1'],
      ['blend', '<code>multiply</code>, <code>screen</code>, <code>overlay</code>, …', 'Omitted when normal'],
      ['mask', 'boolean presence', 'Alpha mask for subsequent siblings'],
      ['rotation', 'degrees', 'Omitted when 0'],
      ['constraint-h', '<code>right</code>, <code>center</code>, <code>scale</code>, <code>stretch</code>', 'left is default, omitted'],
      ['constraint-v', '<code>bottom</code>, <code>center</code>, <code>scale</code>, <code>stretch</code>', 'top is default, omitted'],
      ['abs', 'boolean presence', 'Absolute child inside auto-layout parent'],
      ['min-width / max-width', 'px', 'Omitted when unset'],
      ['min-height / max-height', 'px', 'Omitted when unset'],
      ['border', '<code>"[w] [color] [style] [align]"</code>', 'Shorthand — e.g. <code>"2 #333 dashed inside"</code>'],
      ['border-top / right / bottom / left', '<code>"[w] [color] [style]"</code>', 'Per-side, always inside-aligned']
    ]},
    exampleLabel: 'Shared attrs in use',
    example: `<!-- opacity and blend mode -->
<img src="assets/overlay.webp" w="390" h="240"
     opacity="0.6" blend="multiply" />

<!-- rotation -->
<rect fill="#FF3B30" w="40" h="40" radius="4"
      rotation="45" />

<!-- absolute child inside auto-layout parent -->
<col w="fill" h="200" fill="#fff">
  <text value="Card title" font-size="17" font-weight="600" fill="#1C1C1E" />
  <img src="assets/badge.svg" w="20" h="20" abs x="16" y="16" />
</col>

<!-- constraints (responsive pinning) -->
<rect fill="$primary" w="fill" h="52" radius="12"
      constraint-v="bottom" />

<!-- per-side borders -->
<row w="fill" h="56" p="0 16" align="middle-left"
     border-bottom="1 #E5E5EA">
  <text value="Section header" font-size="13"
        font-weight="500" fill="#8E8E93" />
</row>`,
    related: ['appearance', 'fill-values', 'frame'],
    seoDescription: 'Shared attributes in the .gui format apply to all nodes — opacity, blend, rotation, constraints, borders, and the boolean-presence convention.'
  }
]

// Sidebar groups, in display order.
export const specCategoryOrder = ['Format', 'Metadata', 'Layout', 'Content', 'Geometry', 'Appearance']

export const specSlugs = specEntries.map(e => e.slug)

export function getSpecEntry(slug: string): SpecEntry | undefined {
  return specEntries.find(e => e.slug === slug)
}

export const specGroups = specCategoryOrder.map(category => ({
  label: category,
  items: specEntries.filter(e => e.category === category)
}))

export type SpecKind = 'tag' | 'property' | 'concept'

/** Clean label without XML angle brackets, e.g. "<row>" → "row". */
export function specDisplayName(name: string): string {
  return name.replace(/[<>]/g, '')
}

/** Whether an entry documents an XML tag, a property/attribute, or a concept. */
export function specKind(entry: SpecEntry): SpecKind {
  if (entry.name.includes('<')) return 'tag'
  if (entry.slug === 'shared-attrs' || entry.slug === 'fill-values') return 'property'
  return 'concept'
}
