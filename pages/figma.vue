<template>
  <ProductShell crumb="figma" eyebrow="dotgui for Figma — plugin" title="Export any Figma screen as a .gui file">
    <template #lead>
      The dotgui Figma plugin exports any layer — a frame, component, group, or single
      shape — as a <code>.gui</code> file. The export is a <strong>1:1 mapping of
      Figma's layer model</strong>: auto-layout, fills, gradients, effects, and tokens
      are preserved exactly, not approximated.
    </template>

    <section data-reveal>
      <div class="section-label">How it works</div>
      <h2>Select, export, done</h2>
      <table class="prod-table">
        <thead><tr><th>Step</th><th>What happens</th></tr></thead>
        <tbody>
          <tr><td><code>01</code></td><td>Install the dotgui plugin from the Figma Community.</td></tr>
          <tr><td><code>02</code></td><td>Select any visible layer — frames, components, groups, or individual shapes.</td></tr>
          <tr><td><code>03</code></td><td>Export. Small selections produce inline .gui XML; larger ones download as a packaged .gui with an assets/ folder.</td></tr>
          <tr><td><code>04</code></td><td>Render it with the kit, embed it on a page, or hand it to your agent as structured context.</td></tr>
        </tbody>
      </table>
      <p>
        The plugin handles the whole translation: token extraction, font mapping, image
        encoding, and gradient computation. What was pixels locked in a design tool
        becomes a portable text file your whole toolchain can read.
      </p>
    </section>

    <section data-reveal>
      <div class="section-label">Why it matters</div>
      <h2>Your designs, out of the walled garden</h2>
      <p>
        Figma's native format is a proprietary API — not something you can paste into a
        prompt, check into a repo, or open in another tool. Exporting to
        <code>.gui</code> turns a screen into an open artifact: an AI agent can read the
        exact layout, text, colors, and spacing without screenshots or visual reasoning,
        and any renderer can draw it.
      </p>
    </section>

    <section data-reveal>
      <div class="section-label">Roadmap</div>
      <h2>Round-trip is the goal</h2>
      <p>
        Export is shipping today. The round-trip — <code>gui pull &lt;figma-url&gt;</code>
        and <code>gui push home.gui &lt;figma-url&gt;</code> from the CLI — is on the
        roadmap, closing the loop: design in Figma, iterate with your agent, push back
        to Figma without losing fidelity.
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
    q: 'Which Figma layers can I export to .gui?',
    a: 'Any visible layer: full frames, components, groups, or even a single shape. The plugin walks the selection and translates the complete subtree.'
  },
  {
    q: 'How accurate is the export?',
    a: 'It is a 1:1 mapping of Figma\'s layer model. Auto-layout becomes .gui stacks, and fills, gradients, effects, corner radii, and design tokens carry over exactly — nothing is rasterized or approximated.'
  },
  {
    q: 'Where do images and other assets go?',
    a: 'Small exports inline everything into a single .gui XML file. Larger exports download as a packaged .gui — a zip with the markup plus an assets/ folder holding the images.'
  },
  {
    q: 'Can I import a .gui file back into Figma?',
    a: 'Not yet — export is shipping today, and the pull/push round-trip via the CLI is on the roadmap.'
  }
]

usePageSeo({
  path: '/figma',
  title: 'dotgui Figma plugin — export Figma designs to .gui',
  description: 'Export any Figma frame, component, or layer as an open .gui file. A 1:1 mapping of Figma\'s layer model — auto-layout, fills, gradients, effects, and tokens preserved — ready for AI agents and any renderer.'
})

useProductSchema({
  path: '/figma',
  name: 'dotgui Figma plugin',
  crumb: 'figma',
  description: 'A Figma plugin that exports any layer as a .gui file — a 1:1, token-preserving mapping of Figma\'s layer model into the open .gui format.',
  faq
})
</script>
