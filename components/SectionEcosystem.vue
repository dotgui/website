<template>
  <section id="ecosystem">
    <div data-reveal>
      <div class="section-label">Ecosystem</div>
      <h2>A small format with many readers and writers</h2>
      <p>
        The spec is the authority; everything else is a consumer. Five tools cover the
        whole lifecycle of a <code>.gui</code> file today — and the format is open, so
        the sixth can be yours.
      </p>
    </div>

    <div class="eco-grid" data-reveal="stagger">
      <NuxtLink v-for="item in items" :key="item.to" :to="item.to" class="eco-card">
        <div class="eco-head">
          <span class="eco-name">{{ item.name }}</span>
          <span class="eco-badge">{{ item.badge }}</span>
        </div>
        <p class="eco-desc">{{ item.desc }}</p>
        <span class="eco-cta">{{ item.cta }} →</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  {
    to: '/cli',
    name: '@dotgui/cli',
    badge: 'toolchain',
    desc: 'The gui command — read, write, lint, render, and package .gui files. Installs the dotgui skill into your AI agents with one command.',
    cta: 'Set up the CLI'
  },
  {
    to: '/kit',
    name: '@dotgui/kit',
    badge: 'engine',
    desc: 'The reference engine: parser, validator, renderer, scorer, linter, and packager in one deterministic library with 9 subpath modules.',
    cta: 'Explore the kit'
  },
  {
    to: '/embed',
    name: '@dotgui/embed',
    badge: 'browser',
    desc: 'Render .gui files on any website with one CDN script and a <gui-embed> element. Zero dependencies for the consumer.',
    cta: 'Embed a file'
  },
  {
    to: '/figma',
    name: 'Figma plugin',
    badge: 'design tool',
    desc: 'Export any Figma layer as a .gui file — a 1:1 mapping of the layer model. Auto-layout, fills, gradients, effects, and tokens preserved.',
    cta: 'Export from Figma'
  },
  {
    to: '/spec',
    name: 'The spec',
    badge: 'authority',
    desc: 'Every element, attribute, token type, and convention — plus the design principles, RFCs, and the 53-role vocabulary behind them.',
    cta: 'Read the spec'
  }
]
</script>

<style scoped>
.eco-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-xl);
}

.eco-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-lg);
  background: var(--canvas);
  text-decoration: none;
  transition: border-color 140ms var(--ease-out), transform 140ms var(--ease-out);
}
.eco-card:hover {
  border-color: var(--muted-soft);
  transform: translateY(-1px);
}

.eco-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  margin-bottom: var(--space-xs);
}

.eco-name {
  font-family: var(--mono);
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink);
}

.eco-badge {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-xs);
  padding: 3px 7px;
  line-height: 1;
  white-space: nowrap;
}

.eco-desc {
  font-family: var(--sans);
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--body);
  margin: 0 0 var(--space-md);
  flex: 1;
}

.eco-cta {
  font-family: var(--sans);
  font-size: 12.5px;
  color: var(--muted);
  transition: color 140ms var(--ease-out);
}
.eco-card:hover .eco-cta { color: var(--ink); }
</style>
