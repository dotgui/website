<template>
  <ProductShell crumb="embed" eyebrow="@dotgui/embed — browser" title="Render .gui files anywhere in the browser">
    <template #lead>
      <strong>@dotgui/embed</strong> renders <code>.gui</code> files on any website with one
      CDN script and one element — <code>&lt;gui-embed&gt;</code>. It is a thin layer over
      the kit's renderer with <strong>zero dependencies</strong> for the consumer: no
      build step, no framework, no install.
    </template>

    <section data-reveal>
      <div class="section-label">Quick start</div>
      <h2>One script, one element</h2>
      <CodeBlock filename="index.html" lang="html"><code>&lt;script src="https://unpkg.com/@dotgui/embed"&gt;&lt;/script&gt;

&lt;!-- external file --&gt;
&lt;gui-embed src="hero.gui"&gt;&lt;/gui-embed&gt;

&lt;!-- inline markup — parser-safe carrier --&gt;
&lt;gui-embed&gt;
  &lt;script type="application/gui"&gt;
    &lt;gui&gt; … &lt;/gui&gt;
  &lt;/script&gt;
&lt;/gui-embed&gt;</code></CodeBlock>
      <p>
        A <code>src</code> file is fetched, unzipped, its assets resolved to
        <code>blob:</code> URLs, and rendered. Inline markup lives in a
        <code>&lt;script type="application/gui"&gt;</code> because script content is raw
        text the HTML parser never touches — a full <code>.gui</code> survives verbatim,
        including tags that collide with HTML void elements like <code>&lt;col&gt;</code>
        and <code>&lt;img&gt;</code>.
      </p>
    </section>

    <section data-reveal>
      <div class="section-label">Modes</div>
      <h2>Standalone preview or full widget — same tag</h2>
      <p>
        With no CSS, the embed sizes to the file's native dimensions, like an inline SVG.
        Give it a width and the height follows the file's aspect ratio; give it both and
        the file is centered and scaled to fit. Booleans turn on widget chrome:
      </p>
      <table class="prod-table">
        <thead><tr><th>Attribute</th><th>Default</th><th>Effect</th></tr></thead>
        <tbody>
          <tr><td><code>zoom</code></td><td>on</td><td>Scroll/pinch zoom, drag-pan, and a “Fit” reset button.</td></tr>
          <tr><td><code>grid</code></td><td>on</td><td>Dot-grid canvas background — the dotgui surface.</td></tr>
          <tr><td><code>download</code></td><td>off</td><td>Download the .gui file.</td></tr>
          <tr><td><code>copy</code></td><td>off</td><td>Copy the markup to the clipboard.</td></tr>
          <tr><td><code>mode-switch</code></td><td>off</td><td>Light/dark mode dropdown — only when the file declares more than one mode.</td></tr>
        </tbody>
      </table>
    </section>

    <section data-reveal>
      <div class="section-label">Programmatic</div>
      <h2>Module use and theming</h2>
      <CodeBlock filename="app.js" lang="js"><code>import { install } from '@dotgui/embed'
install() // registers &lt;gui-embed&gt;</code></CodeBlock>
      <p>
        The CDN build self-installs; as a module you call <code>install()</code> once.
        Theme the canvas with CSS custom properties: <code>--gui-embed-bg</code>,
        <code>--gui-embed-dot</code>, <code>--gui-embed-dot-gap</code>. The default render
        mode comes from the file itself.
      </p>
    </section>

    <section data-reveal>
      <div class="section-label">FAQ</div>
      <h2>Frequently asked</h2>
      <div class="prod-faq">
        <div v-for="(f, i) in faq" :key="i" class="faq-item">
          <h3>{{ f.q }}</h3>
          <p>{{ f.a }}</p>
        </div>
      </div>
    </section>
  </ProductShell>
</template>

<script setup lang="ts">
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
