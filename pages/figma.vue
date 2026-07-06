<template>
  <DocShell title="Figma" overview="/figma" :groups="navGroups">
    <header id="figma-top" class="doc-header">
      <p class="doc-eyebrow">dotgui for Figma · plugin</p>
      <h1 class="doc-title">Export any Figma screen as a .gui file</h1>
      <p class="doc-desc">
        The dotgui Figma plugin exports any layer — a frame, component, group, or single
        shape — as a <code>.gui</code> file. The export is a <strong>1:1 mapping of
        Figma's layer model</strong>: auto-layout, fills, gradients, effects, and tokens
        are preserved exactly, not approximated.
      </p>
    </header>

    <section id="how" class="cat">
      <h2 class="cat-label">How it works</h2>
      <p class="cat-lead">Select, export, done.</p>
      <table class="doc-table">
        <thead><tr><th>Step</th><th>What happens</th></tr></thead>
        <tbody>
          <tr v-for="s in steps" :key="s.n" :id="`step-${s.n}`">
            <td><code>{{ s.n }}</code></td>
            <td>{{ s.text }}</td>
          </tr>
        </tbody>
      </table>
      <p class="cat-note">
        The plugin handles the whole translation: token extraction, font mapping, image
        encoding, and gradient computation. What was pixels locked in a design tool becomes
        a portable text file your whole toolchain can read.
      </p>
    </section>

    <section id="why" class="cat">
      <h2 class="cat-label">Why it matters</h2>
      <p class="cat-lead">Your designs, out of the walled garden.</p>
      <p class="cat-note">
        Figma's native format is a proprietary API — not something you can paste into a
        prompt, check into a repo, or open in another tool. Exporting to <code>.gui</code>
        turns a screen into an open artifact: an AI agent can read the exact layout, text,
        colors, and spacing without screenshots or visual reasoning, and any renderer can
        draw it.
      </p>
    </section>

    <section id="roadmap" class="cat">
      <h2 class="cat-label">Roadmap</h2>
      <p class="cat-lead">Round-trip is the goal.</p>
      <p class="cat-note">
        Export is shipping today. The round-trip — <code>gui pull &lt;figma-url&gt;</code>
        and <code>gui push home.gui &lt;figma-url&gt;</code> from the CLI — is on the
        roadmap, closing the loop: design in Figma, iterate with your agent, push back to
        Figma without losing fidelity.
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
const steps = [
  { n: '01', text: 'Install the dotgui plugin from the Figma Community.' },
  { n: '02', text: 'Select any visible layer — frames, components, groups, or individual shapes.' },
  { n: '03', text: 'Export. Small selections produce inline .gui XML; larger ones download as a packaged .gui with an assets/ folder.' },
  { n: '04', text: 'Render it with the kit, embed it on a page, or hand it to your agent as structured context.' }
]

const navGroups = [
  {
    label: 'Guide',
    items: [
      { label: 'How it works', to: '#how' },
      { label: 'Why it matters', to: '#why' },
      { label: 'Roadmap', to: '#roadmap' },
      { label: 'FAQ', to: '#faq' }
    ]
  }
]

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
