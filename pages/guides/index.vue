<template>
  <GuideShell>
    <header class="guide-header">
      <p class="guide-header-eyebrow">dotgui guides</p>
      <h1 class="guide-header-title">Guides</h1>
      <p class="guide-header-desc">
        The <NuxtLink to="/spec">spec</NuxtLink> answers "what does this attribute do." These answer
        "how is .gui different from what I already know" and "how do I actually build a good file" —
        for people evaluating the format and for agents mid-task with a .gui file already open.
      </p>
    </header>

    <section v-for="group in guideGroups" :key="group.category" class="cat">
      <h2 class="cat-label">{{ group.label }}</h2>
      <div class="cat-grid">
        <NuxtLink
          v-for="entry in group.items"
          :key="entry.slug"
          :to="`/guides/${entry.slug}`"
          class="card"
        >
          <div class="card-head">
            <span class="card-name">{{ entry.navLabel }}</span>
          </div>
          <p class="card-desc">{{ entry.dek }}</p>
          <span class="card-cta">Read guide →</span>
        </NuxtLink>
      </div>
    </section>
  </GuideShell>
</template>

<script setup lang="ts">
import { guideGroups, guideEntries } from '~/lib/guides-data'

usePageSeo({
  path: '/guides',
  title: '.gui Guides — comparisons and best practices',
  description: 'How .gui compares to CSS, HTML, Figma, screenshots, and SVG, plus best practices for spacing, structure, and prompting an AI agent to build a well-scored .gui file.',
  ogTitle: '.gui Guides',
  ogDescription: 'Comparisons for evaluating .gui and best practices for building good .gui files, with or without an AI agent.'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: '.gui Guides',
        description: 'Comparison and best-practice guides for the .gui file format.',
        url: 'https://dotgui.org/guides',
        isPartOf: { '@type': 'WebSite', name: '.gui (dotgui)', url: 'https://dotgui.org' },
        hasPart: guideEntries.map(g => ({
          '@type': 'Article',
          name: g.title,
          url: `https://dotgui.org/guides/${g.slug}`
        }))
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '.gui', item: 'https://dotgui.org' },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://dotgui.org/guides' }
        ]
      })
    }
  ]
})
</script>

<style scoped>
.guide-header { padding: 48px 40px 8px; }

.guide-header-eyebrow {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
  font-family: var(--sans);
}

.guide-header-title {
  font-family: var(--display);
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--ink);
  margin-bottom: 12px;
}

.guide-header-desc {
  font-size: 14px;
  color: var(--text-muted);
  font-family: var(--sans);
  line-height: 1.7;
  margin: 0;
  max-width: 620px;
}
.guide-header-desc :deep(a) { color: var(--text); }

.cat { padding: 32px 40px 0; border-top: none; }

.cat-label {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-family: var(--sans);
  font-weight: 500;
  margin-bottom: 16px;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  border: 1px solid var(--hairline);
  border-radius: var(--radius-md);
  text-decoration: none;
  background: var(--surface-card);
  transition: border-color 140ms var(--ease-out), transform 140ms var(--ease-out), box-shadow 140ms var(--ease-out);
}
.card:hover {
  border-color: var(--muted-soft);
  transform: translateY(-2px);
  box-shadow: 0 12px 30px -18px rgba(16,16,16,.28);
}

.card-head { margin-bottom: 8px; }

.card-name {
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.card-desc {
  font-family: var(--sans);
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0 0 14px;
  flex: 1;
}

.card-cta {
  font-family: var(--sans);
  font-size: 12px;
  color: var(--text-dim);
  transition: color 140ms var(--ease-out);
}
.card:hover .card-cta { color: var(--text); }

section:last-child { padding-bottom: 64px; }

@media (max-width: 900px) {
  .guide-header { padding: 36px 20px 8px; }
  .cat { padding: 28px 20px 0; }
}
</style>
