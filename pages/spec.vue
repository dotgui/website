<template>
  <div>
    <TheNav />
    <div class="spec-layout">

      <!-- ── Sidebar nav ───────────────────────────────── -->
      <aside class="spec-sidebar">
        <div class="spec-sidebar-inner">
          <p class="sidebar-title">Spec Reference</p>
          <nav>
            <div v-for="group in navGroups" :key="group.label" class="nav-group">
              <p class="nav-group-label">{{ group.label }}</p>
              <a
                v-for="item in group.items"
                :key="item.id"
                :href="'#' + item.id"
                :class="['nav-link', { active: activeId === item.id }]"
              >{{ item.label }}</a>
            </div>
          </nav>
        </div>
      </aside>

      <!-- ── Spec content ──────────────────────────────── -->
      <main class="spec-content">

        <header class="spec-header">
          <p class="spec-header-eyebrow">dotgui v0.2</p>
          <h1 class="spec-header-title">Spec Reference</h1>
          <p class="spec-header-desc">Every tag, attribute, and convention in the dotgui format.</p>
        </header>

        <!-- ════════════════ FORMAT ════════════════ -->

        <section id="package" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">.gui package</span>
            <span class="entry-sub">file format</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>A <code>.gui</code> file is a ZIP package. The markup, design tokens, font declarations, binary assets, and a preview thumbnail all live in one self-contained file.</p>
              <p>Internally, the markup lives as <code>design.guix</code> — an implementation detail never surfaced to the outside. A program distinguishing a package from a raw markup string uses magic bytes: ZIP starts with <code>PK</code>, markup starts with <code>&lt;</code>.</p>
              <table class="attr-table">
                <thead><tr><th>Entry</th><th>Description</th></tr></thead>
                <tbody>
                  <tr><td>design.guix</td><td>The UI markup — always this name inside the package</td></tr>
                  <tr><td>preview.webp</td><td>Thumbnail for visual verification before opening</td></tr>
                  <tr><td>assets/</td><td>Embedded WebP images and SVG vectors</td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Package structure</p>
              <pre class="example-pre" v-html="plain(ex.package)"></pre>
            </div>
          </div>
        </section>

        <section id="gui-root" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;gui&gt;</span>
            <span class="entry-sub">document root</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>The root element is a document envelope — never rendered. Direct children are metadata blocks or exactly one root layout node. Metadata always precedes the layout root.</p>
              <table class="attr-table">
                <thead><tr><th>Attr</th><th>Description</th></tr></thead>
                <tbody>
                  <tr><td>version</td><td>Spec version. Current: <code>0.2</code></td></tr>
                  <tr><td>name</td><td>Screen or layer name from the source design</td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Example</p>
              <pre class="example-pre" v-html="hl(ex.gui)"></pre>
            </div>
          </div>
        </section>

        <section id="root-canvas" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">Root Canvas</span>
            <span class="entry-sub">canvas patterns</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>The first layout tag under <code>&lt;gui&gt;</code> defines the canvas. Two patterns cover all cases.</p>
              <table class="attr-table">
                <thead><tr><th>Root</th><th>When</th><th>h</th></tr></thead>
                <tbody>
                  <tr><td>&lt;col w="390"&gt;</td><td>Content-driven screen, AI-authored</td><td>absent — hugs children</td></tr>
                  <tr><td>&lt;frame w="390" h="844"&gt;</td><td>Fixed artboard, Figma export</td><td>required</td></tr>
                </tbody>
              </table>
              <p class="note">Default to <code>&lt;col&gt;</code> — it cannot clip content. <code>&lt;frame&gt;</code> children are absolutely positioned. <code>&lt;col&gt;</code> children flow vertically.</p>
            </div>
            <div class="entry-example">
              <p class="example-label">Both patterns</p>
              <pre class="example-pre" v-html="hl(ex.rootCanvas)"></pre>
            </div>
          </div>
        </section>

        <!-- ════════════════ METADATA ════════════════ -->

        <section id="tokens" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;tokens&gt;</span>
            <span class="entry-sub">design primitives</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>Design system primitives. Referenced anywhere in the tree with <code>$name</code>. Figma Variables resolve to <code>&lt;tokens&gt;</code> entries. Only tokens used in the exported tree are emitted.</p>
              <table class="attr-table">
                <thead><tr><th>Tag</th><th>value</th></tr></thead>
                <tbody>
                  <tr><td>&lt;color&gt;</td><td>Hex color, e.g. <code>#007AFF</code></td></tr>
                  <tr><td>&lt;number&gt;</td><td>Numeric value, e.g. <code>12</code></td></tr>
                  <tr><td>&lt;string&gt;</td><td>String value, e.g. <code>Inter</code></td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Example</p>
              <pre class="example-pre" v-html="hl(ex.tokens)"></pre>
            </div>
          </div>
        </section>

        <section id="styles" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;styles&gt;</span>
            <span class="entry-sub">text styles</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>Named text styles from the design system. Each <code>&lt;text-style&gt;</code> captures a full typography definition. Text nodes reference a style by name — individual font attrs are omitted when a style is applied.</p>
              <p>Color and layout attrs are always inlined — they are not part of the text style definition. Only styles used in the exported tree are emitted.</p>
              <table class="attr-table">
                <thead><tr><th>Attr</th><th>Description</th></tr></thead>
                <tbody>
                  <tr><td>name</td><td>Style name, e.g. <code>Heading/H1</code></td></tr>
                  <tr><td>font-family</td><td>Font family name</td></tr>
                  <tr><td>font-size</td><td>Size in px</td></tr>
                  <tr><td>font-weight</td><td>Numeric weight (100–900)</td></tr>
                  <tr><td>line-height</td><td>px or percent</td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Example</p>
              <pre class="example-pre" v-html="hl(ex.styles)"></pre>
            </div>
          </div>
        </section>

        <section id="fonts" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;fonts&gt;</span>
            <span class="entry-sub">font declarations</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>Font declarations for the renderer to load Google Fonts or fall back gracefully. Text nodes still carry their own <code>font-family</code> and <code>font-weight</code> — the fonts block makes those families resolvable.</p>
              <table class="attr-table">
                <thead><tr><th>Attr</th><th>Values</th></tr></thead>
                <tbody>
                  <tr><td>family</td><td>Font family name</td></tr>
                  <tr><td>source</td><td><code>google</code>, <code>system</code>, <code>unresolved</code></td></tr>
                  <tr><td>category</td><td><code>sans-serif</code>, <code>serif</code>, <code>monospace</code></td></tr>
                  <tr><td>weights</td><td>Space-separated numeric weights, e.g. <code>400 600 700</code></td></tr>
                  <tr><td>styles</td><td><code>normal italic</code></td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Example</p>
              <pre class="example-pre" v-html="hl(ex.fonts)"></pre>
            </div>
          </div>
        </section>

        <section id="assets" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">Assets</span>
            <span class="entry-sub">images &amp; vectors</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>Images and vector artwork are embedded in <code>assets/</code> and referenced inline via <code>src</code> — no declaration block, no <code>$id</code> indirection.</p>
              <p>All raster images are converted to WebP at 0.85 quality by the Figma plugin. External URLs are a fallback only. If a URL reference fails to load, the renderer shows an <code>asset not loaded</code> error state — no silent failure.</p>
              <table class="attr-table">
                <thead><tr><th>src pattern</th><th>When</th></tr></thead>
                <tbody>
                  <tr><td>assets/img.webp</td><td>Embedded raster (default for all exports)</td></tr>
                  <tr><td>assets/icon.svg</td><td>Embedded vector artwork</td></tr>
                  <tr><td>https://…</td><td>External URL — fallback only</td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Example</p>
              <pre class="example-pre" v-html="hl(ex.assets)"></pre>
            </div>
          </div>
        </section>

        <section id="components" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;components&gt;</span>
            <span class="entry-sub">component system</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>A <code>&lt;components&gt;</code> block at the top of the document holds all component definitions. Instances reference a component by <code>id</code> and pass prop overrides as attributes.</p>
              <p><code>&lt;component&gt;</code> defines a single reusable component. <code>&lt;component-set&gt;</code> groups related variants. Each <code>&lt;variant&gt;</code> is a member of the set.</p>
              <p>Declared props use a <code>&lt;props&gt;</code> block with <code>&lt;prop&gt;</code> entries. Ad-hoc overrides skip the props block and match by sanitized layer name.</p>
              <table class="attr-table">
                <thead><tr><th>prop type</th><th>Effect</th></tr></thead>
                <tbody>
                  <tr><td>text</td><td>Overrides <code>value</code> attr of the target layer</td></tr>
                  <tr><td>visible</td><td>Hides target when set to <code>"false"</code></td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Component + instance</p>
              <pre class="example-pre" v-html="hl(ex.components)"></pre>
            </div>
          </div>
        </section>

        <!-- ════════════════ LAYOUT ════════════════ -->

        <section id="frame" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;frame&gt;</span>
            <span class="entry-sub">fixed container</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>Fixed container. Children are absolutely positioned with <code>x</code> and <code>y</code> attributes. Maps to a Figma frame without auto-layout.</p>
              <p><code>w</code> and <code>h</code> are required. <code>clip</code> (boolean presence) clips content to bounds.</p>
              <table class="attr-table">
                <thead><tr><th>Attr</th><th>Description</th></tr></thead>
                <tbody>
                  <tr><td>w</td><td>Width in px — required</td></tr>
                  <tr><td>h</td><td>Height in px — required</td></tr>
                  <tr><td>fill</td><td>Background fill</td></tr>
                  <tr><td>radius</td><td>Corner radius in px</td></tr>
                  <tr><td>clip</td><td>Boolean presence — clips to bounds</td></tr>
                  <tr><td>x / y</td><td>Position on children inside frame</td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Example</p>
              <pre class="example-pre" v-html="hl(ex.frame)"></pre>
            </div>
          </div>
        </section>

        <section id="stack" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;stack&gt; / &lt;row&gt; / &lt;col&gt;</span>
            <span class="entry-sub">auto-layout</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p><code>&lt;row&gt;</code> is horizontal, <code>&lt;col&gt;</code> is vertical. <code>&lt;stack&gt;</code> requires an explicit <code>direction</code>. Children are flow-positioned.</p>
              <p><code>w</code> / <code>h</code> absent = hug content; <code>"fill"</code> = fill parent; number = fixed px. <code>p</code> accepts CSS shorthand (1–4 values). <code>gap="auto"</code> distributes space evenly.</p>
              <table class="attr-table">
                <thead><tr><th>Attr</th><th>Values</th></tr></thead>
                <tbody>
                  <tr><td>direction</td><td><code>horizontal</code>, <code>vertical</code> (stack only)</td></tr>
                  <tr><td>gap</td><td>px, <code>auto</code> (space-between), or <code>"N N"</code> (item + row)</td></tr>
                  <tr><td>align</td><td>9-point: <code>top-left</code>, <code>middle-center</code>, etc.</td></tr>
                  <tr><td>p</td><td>CSS shorthand padding</td></tr>
                  <tr><td>pt / pr / pb / pl</td><td>Per-side padding in px</td></tr>
                  <tr><td>wrap</td><td>Boolean presence — wraps children</td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Example</p>
              <pre class="example-pre" v-html="hl(ex.stack)"></pre>
            </div>
          </div>
        </section>

        <section id="grid" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;grid&gt;</span>
            <span class="entry-sub">track grid &amp; unit grid</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>Two modes determined by which attrs are present. <strong>Track grid</strong> (<code>cols</code>/<code>rows</code>): parent declares track sizes, children place themselves with <code>gc</code>/<code>gr</code>. <strong>Unit grid</strong> (<code>unit</code>): fixed coordinate canvas, each square equals <code>unit</code> px.</p>
              <p>A <code>gc</code>/<code>gr</code> range fills the spanned tracks (no <code>w</code>/<code>h</code> needed). A single value hugs content. Range end is inclusive: <code>gc="2/5"</code> occupies columns 2–5.</p>
              <table class="attr-table">
                <thead><tr><th>Attr</th><th>Mode</th><th>Example</th></tr></thead>
                <tbody>
                  <tr><td>cols</td><td>track</td><td><code>"3"</code>, <code>"240 1fr"</code>, <code>"fill 200"</code></td></tr>
                  <tr><td>rows</td><td>track</td><td>same rules as cols</td></tr>
                  <tr><td>unit</td><td>unit</td><td><code>"8"</code> — each square = 8 px</td></tr>
                  <tr><td>gc</td><td>both</td><td><code>"1"</code>, <code>"2/5"</code>, <code>"1/-1"</code></td></tr>
                  <tr><td>gr</td><td>both</td><td>same rules as gc</td></tr>
                  <tr><td>gap</td><td>both</td><td>px or <code>"col row"</code></td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Track grid — dashboard layout</p>
              <pre class="example-pre" v-html="hl(ex.grid)"></pre>
            </div>
          </div>
        </section>

        <section id="group" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;group&gt;</span>
            <span class="entry-sub">logical grouping</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>No layout behavior. Children are absolutely positioned relative to the group origin. Maps to a Figma group node.</p>
              <p>When the first child of a Figma group is a mask node, the mask shape is extracted as an SVG asset and hoisted onto the <code>&lt;group&gt;</code> as <code>mask-src</code> attrs. The mask child is excluded from the rendered children.</p>
              <table class="attr-table">
                <thead><tr><th>Attr</th><th>Description</th></tr></thead>
                <tbody>
                  <tr><td>x / y</td><td>Group position</td></tr>
                  <tr><td>w / h</td><td>Group dimensions — required</td></tr>
                  <tr><td>opacity</td><td>0–1, omitted when 1</td></tr>
                  <tr><td>mask-src</td><td>Asset path for the SVG mask shape</td></tr>
                  <tr><td>mask-x / mask-y</td><td>Mask position relative to group origin</td></tr>
                  <tr><td>mask-width / mask-height</td><td>Mask dimensions</td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Group with mask</p>
              <pre class="example-pre" v-html="hl(ex.group)"></pre>
            </div>
          </div>
        </section>

        <!-- ════════════════ CONTENT ════════════════ -->

        <section id="text" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;text&gt;</span>
            <span class="entry-sub">text node</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>Single-style text is self-closing with a <code>value</code> attribute. Mixed-style text has <code>&lt;segment&gt;</code> children — each segment overrides font attrs for its run.</p>
              <p><code>text-style</code> references a named style; individual font attrs are omitted when a style is referenced. Variable fonts use <code>font-variation</code>; OpenType features use <code>font-feature</code>.</p>
              <table class="attr-table">
                <thead><tr><th>Attr</th><th>Values</th></tr></thead>
                <tbody>
                  <tr><td>value</td><td>Text content (single-style only)</td></tr>
                  <tr><td>font-family</td><td>Font family name</td></tr>
                  <tr><td>font-size</td><td>px</td></tr>
                  <tr><td>font-weight</td><td>100–900</td></tr>
                  <tr><td>font-style</td><td><code>italic</code></td></tr>
                  <tr><td>fill</td><td>Hex, gradient, or token</td></tr>
                  <tr><td>line-height</td><td>px or percent</td></tr>
                  <tr><td>letter-spacing</td><td>px or percent</td></tr>
                  <tr><td>align</td><td><code>left</code>, <code>center</code>, <code>right</code>, <code>justified</code></td></tr>
                  <tr><td>vertical-align</td><td><code>top</code>, <code>center</code>, <code>bottom</code></td></tr>
                  <tr><td>text-style</td><td>Named style reference</td></tr>
                  <tr><td>decoration</td><td><code>underline</code>, <code>strikethrough</code></td></tr>
                  <tr><td>truncate</td><td>Boolean presence — ellipsis on overflow</td></tr>
                  <tr><td>max-lines</td><td>Max lines before clipping</td></tr>
                  <tr><td>list</td><td><code>disc</code>, <code>decimal</code></td></tr>
                  <tr><td>href</td><td>URL — wraps text in hyperlink</td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Single, mixed, decorated</p>
              <pre class="example-pre" v-html="hl(ex.text)"></pre>
            </div>
          </div>
        </section>

        <section id="img" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;img&gt;</span>
            <span class="entry-sub">image &amp; vector</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>Handles both raster and vector assets. The renderer detects format from the file extension at render time — the author only writes <code>src</code>, <code>w</code>, and <code>h</code>.</p>
              <p>The <code>name</code> attribute carries the Figma layer name. <code>fit</code> controls image scaling within the bounding box.</p>
              <table class="attr-table">
                <thead><tr><th>Attr</th><th>Values</th></tr></thead>
                <tbody>
                  <tr><td>src</td><td><code>assets/…</code> path or <code>https://</code> URL</td></tr>
                  <tr><td>w / h</td><td>px — required</td></tr>
                  <tr><td>fit</td><td><code>cover</code>, <code>contain</code>, <code>fill</code>, <code>none</code></td></tr>
                  <tr><td>radius</td><td>Corner radius in px</td></tr>
                  <tr><td>name</td><td>Figma layer name</td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Example</p>
              <pre class="example-pre" v-html="hl(ex.img)"></pre>
            </div>
          </div>
        </section>

        <!-- ════════════════ GEOMETRY ════════════════ -->

        <section id="rect" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;rect&gt;</span>
            <span class="entry-sub">rectangle</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>Sugar for a childless <code>&lt;frame&gt;</code>. Signals decorative intent — no layout children. <code>w</code> and <code>h</code> are required.</p>
              <p>Supports all visual attributes: <code>fill</code>, <code>border</code>, <code>radius</code>, <code>opacity</code>, <code>blend</code>, <code>rotation</code>, <code>appearance</code>. Does not accept layout attributes (<code>direction</code>, <code>gap</code>, <code>p</code>, <code>align</code>).</p>
              <p>Border shorthand: <code>"[width] [color] [style] [align]"</code>. Defaults: 1px solid center.</p>
            </div>
            <div class="entry-example">
              <p class="example-label">Example</p>
              <pre class="example-pre" v-html="hl(ex.rect)"></pre>
            </div>
          </div>
        </section>

        <section id="ellipse" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;ellipse&gt;</span>
            <span class="entry-sub">oval &amp; circle</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>Sugar for <code>&lt;frame radius="9999"&gt;</code>. Full-radius rendering is the contract — <code>radius</code> is not an attribute on <code>&lt;ellipse&gt;</code>. Equal dimensions produce a circle.</p>
              <p>Arc and donut shapes (progress rings, pie segments) are SVG assets referenced via <code>&lt;img&gt;</code>.</p>
              <table class="attr-table">
                <thead><tr><th>Attr</th><th>Description</th></tr></thead>
                <tbody>
                  <tr><td>w / h</td><td>px — required. Equal = circle, unequal = oval</td></tr>
                  <tr><td>fill</td><td>Background fill</td></tr>
                  <tr><td>border</td><td>Border shorthand</td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Example</p>
              <pre class="example-pre" v-html="hl(ex.ellipse)"></pre>
            </div>
          </div>
        </section>

        <section id="line" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;line&gt;</span>
            <span class="entry-sub">separator</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>Sugar for a thin frame used as a visual divider. Default: horizontal, <code>thickness="1"</code>, <code>w="fill"</code>.</p>
              <table class="attr-table">
                <thead><tr><th>Attr</th><th>Values</th></tr></thead>
                <tbody>
                  <tr><td>fill</td><td>Line color</td></tr>
                  <tr><td>direction</td><td><code>vertical</code> — horizontal is default</td></tr>
                  <tr><td>thickness</td><td>px, default 1</td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Example</p>
              <pre class="example-pre" v-html="hl(ex.line)"></pre>
            </div>
          </div>
        </section>

        <!-- ════════════════ APPEARANCE ════════════════ -->

        <section id="appearance" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">&lt;appearance&gt;</span>
            <span class="entry-sub">paint &amp; effects stack</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>A non-layout child that describes the parent's complete paint and effect stack. Used when a node has multiple fills, complex borders, or multiple effects.</p>
              <p>All three stacks — fills, borders, effects — are ordered in document order. When <code>&lt;appearance&gt;</code> contains at least one <code>&lt;border&gt;</code>, the <code>border</code> shorthand on the parent is ignored.</p>
              <p>Simple single-paint cases use <code>fill="…"</code> directly on the element. Use <code>&lt;appearance&gt;</code> only when multiple layers or paint-level metadata (opacity, blend, crop transform) are needed.</p>
              <table class="attr-table">
                <thead><tr><th>Child</th><th>type values</th></tr></thead>
                <tbody>
                  <tr><td>&lt;fill&gt;</td><td><code>color</code>, <code>linear-gradient</code>, <code>radial-gradient</code>, <code>angular-gradient</code>, <code>image</code></td></tr>
                  <tr><td>&lt;border&gt;</td><td>color, w, align (<code>inside</code>/<code>center</code>/<code>outside</code>), style, dash, cap, join</td></tr>
                  <tr><td>&lt;effect&gt;</td><td><code>drop-shadow</code>, <code>inner-shadow</code>, <code>layer-blur</code>, <code>background-blur</code>, <code>glass</code></td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Multi-fill + shadow</p>
              <pre class="example-pre" v-html="hl(ex.appearance)"></pre>
            </div>
          </div>
        </section>

        <section id="fill-values" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">Fill Values</span>
            <span class="entry-sub">fill attribute formats</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>The <code>fill</code> attribute accepts hex colors, gradient functions, and token references. Alpha is encoded as the last byte of an 8-digit hex: <code>#1C1C1ECC</code>.</p>
              <p>Gradient syntax mirrors CSS — <code>linear-gradient()</code>, <code>radial-gradient()</code>, <code>conic-gradient()</code>. Token references use <code>$name</code> syntax.</p>
              <table class="attr-table">
                <thead><tr><th>Format</th><th>Example</th></tr></thead>
                <tbody>
                  <tr><td>Hex opaque</td><td><code>#1C1C1E</code></td></tr>
                  <tr><td>Hex + alpha</td><td><code>#1C1C1ECC</code> (last byte = alpha)</td></tr>
                  <tr><td>Linear gradient</td><td><code>linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)</code></td></tr>
                  <tr><td>Radial gradient</td><td><code>radial-gradient(circle at 50% 30%, #FFF 0%, #000 100%)</code></td></tr>
                  <tr><td>Angular gradient</td><td><code>conic-gradient(from 0deg at 50% 50%, #F00 0deg, #00F 360deg)</code></td></tr>
                  <tr><td>Token</td><td><code>$primary</code></td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Fill values in use</p>
              <pre class="example-pre" v-html="hl(ex.fillValues)"></pre>
            </div>
          </div>
        </section>

        <section id="shared-attrs" class="spec-entry">
          <div class="entry-head">
            <span class="entry-name">Shared Attrs</span>
            <span class="entry-sub">all nodes</span>
          </div>
          <div class="entry-body">
            <div class="entry-desc">
              <p>Visual attributes available on all layout, content, and geometry nodes.</p>
              <p><strong>Boolean presence convention:</strong> bare attributes without a value are treated as <code>true</code>. <code>&lt;frame clip&gt;</code> = <code>&lt;frame clip="true"&gt;</code>. Applies to: <code>clip</code>, <code>mask</code>, <code>wrap</code>, <code>abs</code>, <code>truncate</code>, <code>reverse-z</code>.</p>
              <table class="attr-table">
                <thead><tr><th>Attr</th><th>Values</th><th>Notes</th></tr></thead>
                <tbody>
                  <tr><td>opacity</td><td>0–1</td><td>Omitted when 1</td></tr>
                  <tr><td>blend</td><td><code>multiply</code>, <code>screen</code>, <code>overlay</code>, …</td><td>Omitted when normal</td></tr>
                  <tr><td>mask</td><td>boolean presence</td><td>Alpha mask for subsequent siblings</td></tr>
                  <tr><td>rotation</td><td>degrees</td><td>Omitted when 0</td></tr>
                  <tr><td>constraint-h</td><td><code>right</code>, <code>center</code>, <code>scale</code>, <code>stretch</code></td><td>left is default, omitted</td></tr>
                  <tr><td>constraint-v</td><td><code>bottom</code>, <code>center</code>, <code>scale</code>, <code>stretch</code></td><td>top is default, omitted</td></tr>
                  <tr><td>abs</td><td>boolean presence</td><td>Absolute child inside auto-layout parent</td></tr>
                  <tr><td>min-width / max-width</td><td>px</td><td>Omitted when unset</td></tr>
                  <tr><td>min-height / max-height</td><td>px</td><td>Omitted when unset</td></tr>
                  <tr><td>border</td><td><code>"[w] [color] [style] [align]"</code></td><td>Shorthand — e.g. <code>"2 #333 dashed inside"</code></td></tr>
                  <tr><td>border-top / right / bottom / left</td><td><code>"[w] [color] [style]"</code></td><td>Per-side, always inside-aligned</td></tr>
                </tbody>
              </table>
            </div>
            <div class="entry-example">
              <p class="example-label">Shared attrs in use</p>
              <pre class="example-pre" v-html="hl(ex.sharedAttrs)"></pre>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const navGroups = [
  { label: 'Format', items: [
    { id: 'package', label: '.gui package' },
    { id: 'gui-root', label: '<gui>' },
    { id: 'root-canvas', label: 'Root Canvas' },
  ]},
  { label: 'Metadata', items: [
    { id: 'tokens', label: '<tokens>' },
    { id: 'styles', label: '<styles>' },
    { id: 'fonts', label: '<fonts>' },
    { id: 'assets', label: 'Assets' },
    { id: 'components', label: '<components>' },
  ]},
  { label: 'Layout', items: [
    { id: 'frame', label: '<frame>' },
    { id: 'stack', label: '<stack> / <row> / <col>' },
    { id: 'grid', label: '<grid>' },
    { id: 'group', label: '<group>' },
  ]},
  { label: 'Content', items: [
    { id: 'text', label: '<text>' },
    { id: 'img', label: '<img>' },
  ]},
  { label: 'Geometry', items: [
    { id: 'rect', label: '<rect>' },
    { id: 'ellipse', label: '<ellipse>' },
    { id: 'line', label: '<line>' },
  ]},
  { label: 'Appearance', items: [
    { id: 'appearance', label: '<appearance>' },
    { id: 'fill-values', label: 'Fill Values' },
    { id: 'shared-attrs', label: 'Shared Attrs' },
  ]},
]

const activeId = ref('')

onMounted(() => {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) activeId.value = e.target.id
    }
  }, { rootMargin: '-20% 0px -60% 0px' })
  document.querySelectorAll('.spec-entry').forEach(el => io.observe(el))
})

// ── XML syntax highlighter ──────────────────────────────────────────
function hl(code: string): string {
  let out = ''
  let i = 0
  const e = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  while (i < code.length) {
    // XML comment
    if (code.startsWith('<!--', i)) {
      const end = code.indexOf('-->', i)
      if (end !== -1) {
        out += `<span class="tok-comment">${e(code.slice(i, end + 3))}</span>`
        i = end + 3; continue
      }
    }

    if (code[i] === '<') {
      out += `<span class="tok-punct">&lt;</span>`
      i++
      if (code[i] === '/') { out += `<span class="tok-punct">/</span>`; i++ }

      // tag name
      let j = i
      while (j < code.length && /[\w\-]/.test(code[j])) j++
      if (j > i) { out += `<span class="tok-tag">${e(code.slice(i, j))}</span>`; i = j }

      // attrs until >
      while (i < code.length && code[i] !== '>') {
        if (/\s/.test(code[i])) { out += code[i]; i++; continue }
        if (code[i] === '/') { out += `<span class="tok-punct">/</span>`; i++; continue }
        let a = i
        while (i < code.length && code[i] !== '=' && code[i] !== '>' && code[i] !== '/' && !/\s/.test(code[i])) i++
        if (i > a) out += `<span class="tok-attr">${e(code.slice(a, i))}</span>`
        if (code[i] === '=') {
          out += `<span class="tok-punct">=</span>`; i++
          if (code[i] === '"') {
            out += `<span class="tok-punct">"</span>`; i++
            let v = i
            while (i < code.length && code[i] !== '"') i++
            out += `<span class="tok-val">${e(code.slice(v, i))}</span>`
            out += `<span class="tok-punct">"</span>`; i++
          }
        }
      }
      if (code[i] === '>') { out += `<span class="tok-punct">&gt;</span>`; i++ }
      continue
    }

    out += e(code[i]); i++
  }
  return out
}

function plain(code: string): string {
  return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ── Code examples ──────────────────────────────────────────────────
const ex = {
  package:
`checkout.gui  (ZIP)
├── design.guix
├── preview.webp
└── assets/
    ├── hero.webp
    └── icon-close.svg`,

  gui:
`<gui version="0.2" name="Checkout">
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

  rootCanvas:
`<!-- content-driven: h absent, hugs children -->
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

  tokens:
`<tokens>
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

  styles:
`<styles>
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

  fonts:
`<fonts>
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

  assets:
`<!-- embedded raster (default for all Figma exports) -->
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

  components:
`<components>
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

  frame:
`<frame w="390" h="844" fill="#FFFFFF" clip>
  <!-- children use x/y for absolute position -->
  <img x="0" y="0" src="assets/bg.webp"
       w="390" h="240" fit="cover" />
  <text x="24" y="260" value="Good morning"
        font-family="Inter" font-size="28"
        font-weight="700" fill="#1C1C1E" />
  <rect x="24" y="780" w="342" h="52"
        fill="#007AFF" radius="12" />
</frame>`,

  stack:
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
</row>`,

  grid:
`<!-- track grid: sidebar + main layout -->
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

  group:
`<!-- basic group: children absolutely positioned -->
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

  text:
`<!-- single-style -->
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

  img:
`<!-- raster: embedded WebP -->
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

  rect:
`<!-- solid fill -->
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

  ellipse:
`<!-- circle: equal w and h -->
<ellipse fill="#FF3B30" w="8" h="8" />

<!-- avatar placeholder circle -->
<ellipse fill="#E5E5EA" w="48" h="48" />

<!-- bordered ring -->
<ellipse fill="none" border="2 $primary" w="48" h="48" />

<!-- oval -->
<ellipse fill="$blue" w="80" h="40" />`,

  line:
`<!-- horizontal divider (default) -->
<line fill="#E5E5EA" />

<!-- custom thickness -->
<line fill="#007AFF" thickness="2" />

<!-- vertical divider -->
<line fill="#E5E5EA" direction="vertical" />

<!-- fixed width -->
<line fill="#E5E5EA" w="240" />`,

  appearance:
`<frame w="320" h="180" radius="16">
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

  fillValues:
`<!-- solid opaque hex -->
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

  sharedAttrs:
`<!-- opacity and blend mode -->
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
}
</script>

<style scoped>
/* ── Overall layout ─────────────────────────────── */
.spec-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: calc(100vh - 61px);
}

/* ── Sidebar ────────────────────────────────────── */
.spec-sidebar {
  border-right: 1px solid var(--border);
  position: sticky;
  top: 61px;
  height: calc(100vh - 61px);
  overflow-y: auto;
  scrollbar-width: none;
}
.spec-sidebar::-webkit-scrollbar { display: none; }

.spec-sidebar-inner {
  padding: 28px 0 40px;
}

.sidebar-title {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-dim);
  padding: 0 20px;
  margin-bottom: 20px;
}

.nav-group {
  margin-bottom: 24px;
}

.nav-group-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  padding: 0 20px;
  margin-bottom: 2px;
}

.nav-link {
  display: block;
  padding: 4px 20px;
  font-size: 12.5px;
  color: var(--text-muted);
  text-decoration: none;
  font-family: var(--mono);
  transition: color 120ms var(--ease-out);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
}
.nav-link:hover { color: var(--text); }
.nav-link.active { color: var(--text); }
.nav-link.active::before {
  content: '›';
  margin-right: 6px;
  color: var(--text-muted);
}

/* ── Spec content ───────────────────────────────── */
.spec-content {
  min-width: 0;
}

.spec-header {
  padding: 48px 40px 40px;
  border-bottom: 1px solid var(--border);
}

.spec-header-eyebrow {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
  font-family: var(--mono);
}

.spec-header-title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text);
  margin-bottom: 10px;
}

.spec-header-desc {
  font-size: 14px;
  color: var(--text-muted);
  font-family: var(--sans);
  line-height: 1.7;
  margin: 0;
}

/* ── Spec entry ─────────────────────────────────── */
.spec-entry {
  border-bottom: 1px solid var(--border);
  scroll-margin-top: 61px;
}

.entry-head {
  padding: 16px 40px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.entry-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  font-family: var(--mono);
  letter-spacing: -0.01em;
}

.entry-sub {
  font-size: 11px;
  color: var(--text-dim);
  font-family: var(--sans);
  letter-spacing: 0.02em;
}

/* ── Entry body: 3:2 split ──────────────────────── */
.entry-body {
  display: grid;
  grid-template-columns: 3fr 2fr;
  min-height: 0;
}

/* ── Description panel ──────────────────────────── */
.entry-desc {
  padding: 28px 36px 32px 40px;
  border-right: 1px solid var(--border);
}

.entry-desc p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.85;
  font-family: var(--sans);
  margin-bottom: 12px;
}
.entry-desc p:last-child { margin-bottom: 0; }
.entry-desc p.note {
  color: var(--text-dim);
  font-size: 12px;
}

.entry-desc strong { color: var(--text); font-weight: 500; }

/* Attribute tables */
.attr-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 18px;
  font-size: 12px;
}

.attr-table thead tr {
  border-bottom: 1px solid var(--border);
}

.attr-table th {
  text-align: left;
  padding: 5px 10px 5px 0;
  color: var(--text-dim);
  font-weight: 500;
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.attr-table td {
  padding: 5px 10px 5px 0;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  vertical-align: top;
  font-family: var(--sans);
  font-size: 12.5px;
  line-height: 1.6;
}

.attr-table td:first-child {
  font-family: var(--mono);
  color: var(--text);
  font-size: 11.5px;
  white-space: nowrap;
  padding-right: 16px;
}

/* ── Example panel ──────────────────────────────── */
.entry-example {
  padding: 20px 24px;
  background: var(--surface);
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.example-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
  flex-shrink: 0;
}

.example-pre {
  font-family: var(--mono);
  font-size: 11.5px;
  line-height: 1.7;
  color: #888;
  overflow-x: auto;
  white-space: pre;
  margin: 0;
  flex: 1;
}

/* reuse tok-* colors from global */
:deep(.tok-tag) { color: #6ea8fe; }
:deep(.tok-attr) { color: #79c0ff; }
:deep(.tok-val) { color: #a5d6ff; }
:deep(.tok-punct) { color: #555; }
:deep(.tok-comment) { color: #484f58; font-style: italic; }

/* ── Responsive ─────────────────────────────────── */
@media (max-width: 900px) {
  .spec-layout { grid-template-columns: 180px 1fr; }
  .entry-head { padding: 14px 20px; }
  .entry-desc { padding: 20px 20px 24px; }
  .entry-example { padding: 16px 16px; }
}

@media (max-width: 700px) {
  .spec-layout { grid-template-columns: 1fr; }
  .spec-sidebar { display: none; }
  .entry-body { grid-template-columns: 1fr; }
  .entry-desc { border-right: none; border-bottom: 1px solid var(--border-subtle); }
}
</style>
