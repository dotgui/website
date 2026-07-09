<template>
  <DocShell title="FAQ" overview="/faq" :groups="navGroups">
    <header id="faq-top" class="doc-header">
      <p class="doc-eyebrow">Reference · FAQ</p>
      <h1 class="doc-title">Frequently asked questions</h1>
      <p class="doc-desc">
        What a <code>.gui</code> file is, how it differs from HTML and SVG, how agents read
        and write it, and how to create, render, and export one. Tool-specific questions live
        with each product below.
      </p>
    </header>

    <section id="general" class="cat">
      <h2 class="cat-label">General</h2>
      <div class="faq">
        <div v-for="(f, i) in siteFaq" :key="i" class="faq-item">
          <p class="faq-q">{{ f.q }}</p>
          <p class="faq-a">{{ f.a }}</p>
        </div>
      </div>
    </section>

    <section id="byproduct" class="cat">
      <h2 class="cat-label">By product</h2>
      <p class="cat-lead">Questions about a specific tool are answered on its own page.</p>
      <div class="prod-grid">
        <NuxtLink v-for="p in productFaqs" :key="p.to" :to="p.to" class="prod-link">
          <span class="prod-name">{{ p.name }}</span>
          <span class="prod-sub">{{ p.sub }}</span>
        </NuxtLink>
      </div>
    </section>

    <section id="guides" class="cat">
      <h2 class="cat-label">Still have questions?</h2>
      <p class="cat-lead">
        The <NuxtLink to="/guides">guides</NuxtLink> go deeper than a one-line answer — comparisons
        to CSS, HTML, Figma, and SVG, plus best practices for structuring and prompting a .gui file.
      </p>
    </section>
  </DocShell>
</template>

<script setup lang="ts">
import { siteFaq } from '~/lib/site-faq'

const productFaqs = [
  { name: 'Kit', to: '/kit#faq', sub: 'the reference engine' },
  { name: 'CLI', to: '/cli#faq', sub: 'the command-line toolchain' },
  { name: 'Figma', to: '/figma#faq', sub: 'export designs to .gui' },
  { name: 'Embed', to: '/embed#faq', sub: 'render .gui in the browser' },
  { name: 'Quality', to: '/spec/quality', sub: 'the CCAC scoring model' }
]

const navGroups = [
  {
    label: 'On this page',
    items: [
      { label: 'General', to: '#general' },
      { label: 'By product', to: '#byproduct' }
    ]
  },
  {
    label: 'Product FAQs',
    items: productFaqs.map(p => ({ label: p.name, to: p.to }))
  }
]

usePageSeo({
  path: '/faq',
  title: '.gui FAQ  questions about the UI file format',
  description: 'Answers to common questions about .gui: what the file format is, how it differs from HTML and SVG, whether AI agents can read and write it, and how to create, render, and export .gui files.',
  ogTitle: '.gui  Frequently asked questions',
  ogDescription: 'What a .gui file is, how it compares to HTML and SVG, and how to author, render, and export one.'
})

// FAQPage JSON-LD  mirrors the visible General list. Strongest GEO signal, so the
// answers on screen and in the schema must stay identical. Per-product FAQs carry
// their own FAQPage schema on their own pages; they are not duplicated here.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: siteFaq.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      })
    }
  ]
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
.doc-desc code { font-family: var(--mono); font-size: 0.9em; color: var(--text); }

.cat { padding: 40px 40px 0; border-top: none; }
.cat-label {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin-bottom: 16px;
}
.cat-lead {
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-muted);
  max-width: 680px;
  margin: 0 0 18px;
}

/* General FAQ  two columns like a reference sheet */
.faq {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px 40px;
  max-width: 900px;
}
.faq-item { min-width: 0; }
.faq-q { font-family: var(--sans); font-size: 14.5px; font-weight: 600; color: var(--text); margin: 0 0 6px; letter-spacing: -0.01em; }
.faq-a { font-family: var(--sans); font-size: 13px; line-height: 1.7; color: var(--text-muted); margin: 0; }

/* by-product hub links */
.prod-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  max-width: 720px;
}
.prod-link {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 13px 15px;
  border: 1px solid var(--hairline);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  text-decoration: none;
  transition: border-color 140ms var(--ease-out), transform 140ms var(--ease-out);
}
.prod-link:hover { border-color: var(--muted-soft); transform: translateY(-2px); }
.prod-name { font-family: var(--sans); font-size: 14px; font-weight: 600; color: var(--text); }
.prod-sub { font-family: var(--sans); font-size: 11.5px; color: var(--text-dim); }

section:last-child { padding-bottom: 64px; }

@media (max-width: 900px) {
  .doc-header { padding: 36px 20px 8px; }
  .cat { padding: 32px 20px 0; }
}
@media (max-width: 720px) {
  .faq { grid-template-columns: 1fr; }
}
</style>
