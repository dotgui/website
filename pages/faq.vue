<template>
  <ProductShell crumb="faq" eyebrow="Reference — FAQ" title="Frequently asked questions">
    <template #lead>
      What a <code>.gui</code> file is, how it differs from HTML and SVG, how agents
      read and write it, and how to create, render, and export one.
    </template>

    <section data-reveal>
      <div class="faq-list">
        <div v-for="(f, i) in siteFaq" :key="i" class="faq-item">
          <h3 class="faq-q">{{ f.q }}</h3>
          <p class="faq-a">{{ f.a }}</p>
        </div>
      </div>
    </section>
  </ProductShell>
</template>

<script setup lang="ts">
import { siteFaq } from '~/lib/site-faq'

const SITE_URL = 'https://dotgui.org'

usePageSeo({
  path: '/faq',
  title: '.gui FAQ — questions about the UI file format',
  description: 'Answers to common questions about .gui: what the file format is, how it differs from HTML and SVG, whether AI agents can read and write it, and how to create, render, and export .gui files.',
  ogTitle: '.gui — Frequently asked questions',
  ogDescription: 'What a .gui file is, how it compares to HTML and SVG, and how to author, render, and export one.'
})

// FAQPage JSON-LD — mirrors the visible list above. This is the strongest GEO
// signal, so the answers on screen and in the schema must stay identical.
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
.faq-list {
  margin-top: var(--space-lg);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl) var(--space-xxl);
}

.faq-q {
  font-family: var(--sans);
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.01em;
  margin: 0 0 var(--space-xs);
}

.faq-a {
  font-family: var(--sans);
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--body);
  margin: 0;
}

@media (max-width: 820px) {
  .faq-list { grid-template-columns: 1fr; }
}
</style>
