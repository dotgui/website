<template>
  <SpecShell>
    <header class="spec-header">
      <p class="spec-header-eyebrow">dotgui v0.2</p>
      <h1 class="spec-header-title">Spec Reference</h1>
      <p class="spec-header-desc">Every tag, property, and convention in the dotgui format. Pick an item from the sidebar  or a card below  to open its full reference. Beyond the elements, the spec also defines the <NuxtLink to="/spec/roles">role vocabulary</NuxtLink> (53 recognized UI structures that make files self-describing) and the <NuxtLink to="/spec/quality">CCAC quality model</NuxtLink>.</p>
    </header>

    <section v-for="group in groups" :key="group.label" class="cat">
      <h2 class="cat-label">{{ group.label }}</h2>
      <div class="cat-grid">
        <NuxtLink
          v-for="entry in group.items"
          :key="entry.slug"
          :to="`/spec/${entry.slug}`"
          class="card"
        >
          <div class="card-head">
            <span class="card-name">{{ displayName(entry.navLabel || entry.name) }}</span>
            <span class="kind-badge" :class="`kind-${kind(entry)}`">{{ kind(entry) }}</span>
          </div>
          <p class="card-desc">{{ entry.seoDescription }}</p>
          <span class="card-cta">Open reference →</span>
        </NuxtLink>
      </div>
    </section>
  </SpecShell>
</template>

<script setup lang="ts">
import { specEntries, specCategoryOrder, specDisplayName, specKind } from '~/lib/spec-data'

const displayName = specDisplayName
const kind = specKind

const indexEntries = specEntries.filter(e => e.slug !== 'row' && e.slug !== 'col')
const groups = specCategoryOrder.map(category => ({
  label: category,
  items: indexEntries.filter(e => e.category === category)
}))

usePageSeo({
  path: '/spec',
  title: '.gui Spec Reference  elements, attributes & tokens',
  description: 'The complete .gui format specification: package structure, the gui root, layout elements (col, row, frame, grid), text, shapes, images, design tokens, fonts, appearance attributes, the role vocabulary, and the CCAC quality model.',
  ogTitle: '.gui Spec Reference',
  ogDescription: 'The complete reference for the .gui UI format  elements, attributes, tokens, roles, and quality.'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: '.gui Spec Reference',
        description: 'The complete specification of the .gui file format  every element, attribute, token type, the role vocabulary, and the CCAC quality model.',
        url: 'https://dotgui.org/spec',
        isPartOf: { '@type': 'WebSite', name: '.gui (dotgui)', url: 'https://dotgui.org' },
        hasPart: specEntries.filter(e => !e.hubHidden).map(e => ({
          '@type': 'TechArticle',
          name: specDisplayName(e.name),
          url: `https://dotgui.org/spec/${e.slug}`
        }))
      })
    }
  ]
})
</script>

<style scoped>
.spec-header {
  padding: 48px 40px 8px;
}

.spec-header-eyebrow {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
  font-family: var(--sans);
}

.spec-header-title {
  font-family: var(--display);
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--ink);
  margin-bottom: 12px;
}

.spec-header-desc {
  font-size: 14px;
  color: var(--text-muted);
  font-family: var(--sans);
  line-height: 1.7;
  margin: 0;
  max-width: 620px;
}

.cat {
  padding: 32px 40px 0;
  border-top: none;
}

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

.card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.card-name {
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.kind-badge {
  font-family: var(--sans);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  line-height: 1;
}
.kind-tag      { color: var(--blue);   background: rgba(43,107,228,.1);  border-color: rgba(43,107,228,.22); }
.kind-property { color: var(--purple); background: rgba(157,91,234,.1);  border-color: rgba(157,91,234,.22); }
.kind-concept  { color: var(--muted);  background: var(--surface-strong); border-color: var(--hairline); }

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
  .spec-header { padding: 36px 20px 8px; }
  .cat { padding: 28px 20px 0; }
}

@media (max-width: 600px) {
  .cat-grid { grid-template-columns: 1fr; }
}
</style>
