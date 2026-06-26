<template>
  <SpecShell>
    <header class="spec-header">
      <p class="spec-header-eyebrow">dotgui v0.2</p>
      <h1 class="spec-header-title">Spec Reference</h1>
      <p class="spec-header-desc">Every tag, property, and convention in the dotgui format. Pick an item from the sidebar — or a card below — to open its full reference.</p>
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

useSeoMeta({
  title: '.gui Spec Reference — elements, attributes & tokens',
  description: 'The complete .gui format specification: package structure, the gui root, layout elements (col, row, frame, grid), text, shapes, images, design tokens, fonts, and appearance attributes.',
  ogTitle: '.gui Spec Reference',
  ogDescription: 'The complete reference for the .gui UI format — elements, attributes, tokens, and fonts.',
  ogUrl: 'https://dotgui.org/spec',
  twitterCard: 'summary_large_image'
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
  font-family: var(--mono);
}

.spec-header-title {
  font-size: 30px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text);
  margin-bottom: 10px;
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
}

.cat-label {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-family: var(--mono);
  font-weight: 500;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 16px 18px;
  border: 1px solid var(--border);
  border-radius: 8px;
  text-decoration: none;
  background: var(--surface);
  transition: border-color 140ms var(--ease-out), transform 140ms var(--ease-out);
}
.card:hover {
  border-color: var(--text-dim);
  transform: translateY(-1px);
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
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--border);
  line-height: 1;
}
.kind-tag      { color: #6ea8fe; border-color: #2a3a5a; }
.kind-property { color: #a8d8a8; border-color: #2c3f2c; }
.kind-concept  { color: var(--text-muted); }

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

@media (max-width: 900px) {
  .spec-header { padding: 36px 20px 8px; }
  .cat { padding: 28px 20px 0; }
}

@media (max-width: 600px) {
  .cat-grid { grid-template-columns: 1fr; }
}
</style>
