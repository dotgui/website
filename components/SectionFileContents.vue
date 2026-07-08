<template>
  <section>
    <div data-reveal>
      <div class="section-label">Format</div>
      <h2>What a .gui file contains</h2>
      <p>Every <code>.gui</code> document is a self-contained XML file with these top-level blocks:</p>
    </div>

    <div data-reveal>
      <hr />
      <p><strong><code>&lt;tokens&gt;</code></strong>  Design system primitives. Colors, numbers, strings, referenced by <code>$name</code> anywhere in the tree.</p>
      <p><strong><code>&lt;fonts&gt;</code></strong>  Font declarations. The renderer uses these to load Google Fonts or fall back gracefully to system fonts.</p>
      <p><strong><code>&lt;assets&gt;</code></strong>  Embedded images (WebP) and vector artwork (SVG), base64-encoded. Referenced as <code>$img-1</code>, <code>$svg-1</code>, etc.</p>
      <p><strong><code>&lt;frame&gt;</code> / <code>&lt;stack&gt;</code></strong>  The UI tree. Frames have absolutely-positioned children; stacks are auto-layout (flex or grid).</p>
      <p><strong><code>&lt;text&gt;</code></strong>  Text nodes, with full typography attributes and optional mixed-style <code>&lt;segment&gt;</code> children.</p>
      <p><strong><code>&lt;shape&gt;</code></strong>  Rectangles, ellipses, lines, and vector paths.</p>
      <p><strong><code>&lt;appearance&gt;</code></strong>  Multi-fill and multi-effect paint stacks for any node that needs more than a single solid color.</p>
    </div>
  </section>
</template>
