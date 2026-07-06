<template>
  <DocShell title="Embed" overview="/embed" :groups="navGroups">
    <header id="embed-top" class="doc-header">
      <p class="doc-eyebrow">@dotgui/embed · browser</p>
      <h1 class="doc-title">Render .gui files anywhere in the browser</h1>
      <p class="doc-desc">
        <strong>@dotgui/embed</strong> renders <code>.gui</code> files on any website with one
        CDN script and one element — <code>&lt;gui-embed&gt;</code>. It is a thin layer over
        the kit's renderer with <strong>zero dependencies</strong> for the consumer: no
        build step, no framework, no install.
      </p>
    </header>

    <section id="quickstart" class="cat">
      <h2 class="cat-label">Quick start</h2>
      <p class="cat-lead">One script, one element.</p>
      <DocCode :code="quickCode" lang="html" />
      <p class="cat-note">
        A <code>src</code> file is fetched, unzipped, its assets resolved to
        <code>blob:</code> URLs, and rendered. Inline markup lives in a
        <code>&lt;script type="application/gui"&gt;</code> because script content is raw text
        the HTML parser never touches — a full <code>.gui</code> survives verbatim, including
        tags that collide with HTML void elements like <code>&lt;col&gt;</code> and
        <code>&lt;img&gt;</code>.
      </p>
    </section>

    <section id="modes" class="cat">
      <h2 class="cat-label">Modes</h2>
      <p class="cat-lead">Standalone preview or full widget — same tag.</p>
      <p class="cat-note" style="margin-top:0;margin-bottom:18px">
        With no CSS, the embed sizes to the file's native dimensions, like an inline SVG.
        Give it a width and the height follows the file's aspect ratio; give it both and the
        file is centered and scaled to fit. Booleans turn on widget chrome:
      </p>
      <table class="doc-table">
        <thead><tr><th>Attribute</th><th>Default</th><th>Effect</th></tr></thead>
        <tbody>
          <tr v-for="a in attrs" :key="a.name" :id="`attr-${a.name}`">
            <td><code>{{ a.name }}</code></td>
            <td class="dim">{{ a.default }}</td>
            <td>{{ a.effect }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="programmatic" class="cat">
      <h2 class="cat-label">Programmatic</h2>
      <p class="cat-lead">Module use and theming.</p>
      <InstallCmd pkg="@dotgui/embed" />
      <div class="after-install">
        <DocCode label="Register the element once" :code="moduleCode" lang="js" />
      </div>
      <p class="cat-note">
        The CDN build self-installs; as a module you call <code>install()</code> once. Theme
        the canvas with CSS custom properties: <code>--gui-embed-bg</code>,
        <code>--gui-embed-dot</code>, <code>--gui-embed-dot-gap</code>. The default render
        mode comes from the file itself.
      </p>
    </section>

    <section id="faq" class="cat">
      <h2 class="cat-label">Frequently asked</h2>
      <div class="faq">
        <div v-for="(f, i) in faq" :key="i" class="faq-item">
          <p class="faq-q">{{ f.q }}</p>
          <p class="faq-a">{{ f.a }}</p>
        </div>
      </div>
    </section>
  </DocShell>
</template>

<script setup lang="ts">
const quickCode = `<script src="https://unpkg.com/@dotgui/embed"><\/script>

<!-- external file -->
<gui-embed src="hero.gui"></gui-embed>

<!-- inline markup — parser-safe carrier -->
<gui-embed>
  <script type="application/gui">
    <gui> … </gui>
  <\/script>
</gui-embed>`

const moduleCode = `import { install } from '@dotgui/embed'
install() // registers <gui-embed>`

const attrs = [
  { name: 'zoom', default: 'on', effect: 'Scroll/pinch zoom, drag-pan, and a “Fit” reset button.' },
  { name: 'grid', default: 'on', effect: 'Dot-grid canvas background — the dotgui surface.' },
  { name: 'download', default: 'off', effect: 'Download the .gui file.' },
  { name: 'copy', default: 'off', effect: 'Copy the markup to the clipboard.' },
  { name: 'mode-switch', default: 'off', effect: 'Light/dark mode dropdown — only when the file declares more than one mode.' }
]

const navGroups = [
  {
    label: 'Guide',
    items: [
      { label: 'Quick start', to: '#quickstart' },
      { label: 'Modes', to: '#modes' },
      { label: 'Programmatic', to: '#programmatic' },
      { label: 'FAQ', to: '#faq' }
    ]
  },
  {
    label: 'Attributes',
    items: attrs.map(a => ({ label: a.name, to: `#attr-${a.name}`, mono: true }))
  }
]

const faq = [
  {
    q: 'Do I need a build step or framework to use @dotgui/embed?',
    a: 'No. One CDN script tag registers the <gui-embed> element and bundles everything — the kit renderer, parser, package reader, pan/zoom, and unzip — into a single self-contained file with zero dependencies for the consumer.'
  },
  {
    q: 'Why does inline markup sit inside <script type="application/gui">?',
    a: 'Script content is raw text the HTML parser never interprets, so a complete .gui file survives verbatim — including tags like <col> and <img> that HTML would otherwise mangle as void elements. The script is also the source of truth: copy and download emit it unchanged.'
  },
  {
    q: 'How does sizing work?',
    a: 'Like an inline SVG. No CSS: the embed takes the file\'s native dimensions. Width only: height follows the file\'s aspect ratio. Width and height: a fixed canvas with the file centered and scaled to fit.'
  },
  {
    q: 'Can viewers switch between light and dark mode?',
    a: 'Yes — add the mode-switch attribute. The dropdown appears only when the file declares more than one mode; the default mode always comes from the file itself.'
  }
]

usePageSeo({
  path: '/embed',
  title: '@dotgui/embed — render .gui files on any website',
  description: 'Embed .gui files in any web page with one CDN script and a <gui-embed> element. Zero dependencies, inline or external files, SVG-like sizing, and optional zoom, download, copy, and mode-switch controls.'
})

useProductSchema({
  path: '/embed',
  name: '@dotgui/embed',
  crumb: 'embed',
  description: 'A zero-dependency browser library that renders .gui files anywhere via a <gui-embed> custom element — one CDN script over the @dotgui/kit renderer.',
  faq
})
</script>

<style scoped>
.doc-header { padding: 48px 40px 8px; }
.doc-eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
}
.doc-title {
  font-family: var(--display);
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--ink);
  margin-bottom: 14px;
  max-width: 660px;
}
.doc-desc {
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.75;
  color: var(--text-muted);
  max-width: 660px;
  margin: 0;
}
.doc-desc strong { color: var(--text); font-weight: 600; }
.doc-desc code { font-family: var(--mono); font-size: 0.9em; color: var(--text); }

.cat { padding: 40px 40px 0; border-top: none; }
.cat-label {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin-bottom: 12px;
}
.cat-lead {
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-muted);
  max-width: 680px;
  margin: 0 0 18px;
}
.cat-lead code { font-family: var(--mono); font-size: 0.9em; color: var(--text); }
.cat-note {
  font-family: var(--sans);
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--text-muted);
  max-width: 680px;
  margin: 18px 0 0;
}
.cat-note code { font-family: var(--mono); font-size: 0.9em; color: var(--text); }
.cat-note strong, .cat-lead strong { color: var(--text); font-weight: 600; }

.after-install { margin-top: 18px; max-width: 680px; }

.doc-table {
  width: 100%;
  max-width: 820px;
  border-collapse: collapse;
  font-size: 13px;
}
.doc-table th {
  text-align: left;
  font-family: var(--sans);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-weight: 500;
  padding: 0 16px 10px 0;
  border-bottom: 1px solid var(--border);
}
.doc-table td {
  padding: 11px 16px 11px 0;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  line-height: 1.6;
  vertical-align: top;
  font-family: var(--sans);
}
.doc-table td:first-child {
  font-family: var(--mono);
  color: var(--text);
  font-size: 12px;
  white-space: nowrap;
  padding-right: 24px;
}
.doc-table td.dim { color: var(--text-dim); font-family: var(--mono); font-size: 12px; white-space: nowrap; }
tr[id] { scroll-margin-top: 72px; }

.faq { max-width: 720px; }
.faq-item { padding: 0 0 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); }
.faq-item:last-child { border-bottom: none; margin-bottom: 0; }
.faq-q { font-family: var(--sans); font-size: 14px; font-weight: 600; color: var(--text); margin: 0 0 6px; }
.faq-a { font-family: var(--sans); font-size: 13px; line-height: 1.7; color: var(--text-muted); margin: 0; max-width: 680px; }

section:last-child { padding-bottom: 64px; }

@media (max-width: 900px) {
  .doc-header { padding: 36px 20px 8px; }
  .cat { padding: 32px 20px 0; }
}
</style>
