<template>
  <div>
    <TheNav />

    <main class="ex-index wrap">
      <header class="ex-header">
        <p class="ex-eyebrow">library · .gui</p>
        <h1 class="ex-title">Examples</h1>
        <p class="ex-desc">
          A growing library of real <code>.gui</code> files — mobile and web screens you can
          preview live, read as source, and download. Every example is plain text an
          <strong>AI agent can inspect</strong> without unzipping anything.
        </p>
      </header>

      <nav class="ex-filters" aria-label="Filter examples by category">
        <button
          v-for="opt in filterOptions"
          :key="opt.value"
          class="ex-filter"
          :class="{ active: filter === opt.value }"
          type="button"
          @click="filter = opt.value"
        >
          {{ opt.label }} <span class="ex-filter-count">{{ opt.count }}</span>
        </button>
      </nav>

      <div class="ex-grid">
        <NuxtLink
          v-for="ex in visible"
          :key="ex.slug"
          :to="`/examples/${ex.slug}`"
          class="ex-card"
        >
          <div class="ex-thumb" :class="{ 'is-web': ex.category === 'web' }">
            <img
              v-if="ex.preview"
              :src="ex.preview"
              :alt="`${ex.title} — .gui preview`"
              loading="lazy"
              class="ex-thumb-img"
            />
            <span
              v-else
              class="ex-thumb-fallback"
              :style="fallbackStyle(ex.colors)"
            >{{ ex.title }}</span>
          </div>
          <div class="ex-card-meta">
            <span class="ex-card-title">{{ ex.title }}</span>
            <span class="ex-card-cat">{{ CATEGORY_LABELS[ex.category] }}</span>
          </div>
        </NuxtLink>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { examples, CATEGORY_LABELS, type ExampleColor, type ExampleCategory } from '~/lib/examples-data'

type Filter = 'all' | ExampleCategory
const filter = ref<Filter>('all')

const counts = {
  all: examples.length,
  mobile: examples.filter((e) => e.category === 'mobile').length,
  web: examples.filter((e) => e.category === 'web').length
}

const filterOptions: { value: Filter; label: string; count: number }[] = [
  { value: 'all', label: 'All', count: counts.all },
  { value: 'mobile', label: 'Mobile', count: counts.mobile },
  { value: 'web', label: 'Web', count: counts.web }
]

const visible = computed(() =>
  filter.value === 'all' ? examples : examples.filter((e) => e.category === filter.value)
)

// Fallback tile for bundles without a preview.webp: a diagonal wash of the
// file's own token colors, so the tile still reads as "this design's palette."
function fallbackStyle(colors: ExampleColor[]) {
  const stops = colors.slice(0, 3).map((c) => c.value)
  if (stops.length < 2) return { background: stops[0] || 'var(--surface)' }
  return { background: `linear-gradient(135deg, ${stops.join(', ')})` }
}

usePageSeo({
  path: '/examples',
  title: '.gui Examples — a library of UI files for humans and AI agents',
  description:
    'Browse real .gui example files — mobile and web app screens like Spotify, Instagram, flight search, dashboards and landing pages. Preview live, read the source, and download each as a single .gui file.',
  ogTitle: '.gui Examples',
  ogDescription:
    'A library of real .gui files — preview live, inspect the source, download. Built to be read by humans and AI agents alike.'
})

const pageUrl = canonicalUrl('/examples')
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: '.gui Examples',
        url: pageUrl,
        description:
          'A library of real .gui example files for mobile and web, viewable as source and downloadable.',
        hasPart: examples.map((e) => ({
          '@type': 'SoftwareSourceCode',
          name: e.title,
          programmingLanguage: 'gui',
          url: canonicalUrl(`/examples/${e.slug}`)
        }))
      })
    }
  ]
})
</script>

<style scoped>
.ex-index { padding: 56px 24px 96px; }

.ex-header { max-width: 640px; margin-bottom: 32px; }
.ex-eyebrow {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-soft);
  margin: 0 0 10px;
}
.ex-title {
  font-family: var(--display);
  font-size: clamp(36px, 6vw, 52px);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
  color: var(--ink);
}
.ex-desc { font-size: 16px; line-height: 1.6; color: var(--body); margin: 0; }

.ex-filters { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
.ex-filter {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--body);
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-pill);
  padding: 7px 15px;
  cursor: pointer;
  transition: border-color 160ms var(--ease-out), color 160ms var(--ease-out);
}
.ex-filter:hover { border-color: var(--border-strong, var(--muted-soft)); }
.ex-filter.active { background: var(--ink); color: var(--canvas); border-color: var(--ink); }
.ex-filter-count { font-size: 11px; opacity: 0.6; }

.ex-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

.ex-card { text-decoration: none; display: flex; flex-direction: column; gap: 12px; }
.ex-thumb {
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: 14px;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--hairline);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 180ms var(--ease-out), transform 180ms var(--ease-out);
}
.ex-card:hover .ex-thumb { border-color: var(--muted-soft); transform: translateY(-2px); }
.ex-thumb-img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
.ex-thumb-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  font-family: var(--display);
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}

.ex-card-meta { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.ex-card-title { font-family: var(--sans); font-size: 14px; font-weight: 600; color: var(--ink); }
.ex-card-cat {
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted-soft);
}
</style>
