<template>
  <div>
    <TheNav />

    <main class="exd wrap">
      <nav class="exd-crumb" aria-label="Breadcrumb">
        <NuxtLink to="/examples">Examples</NuxtLink>
        <span class="sep">/</span>
        <span class="current">{{ ex.title }}</span>
      </nav>

      <div class="exd-split">
        <!-- Left: live preview, edge to edge -->
        <div class="exd-preview" :class="`is-${ex.category}`">
          <ClientOnly>
            <gui-embed :src="ex.download" class="exd-embed" />
            <template #fallback>
              <img v-if="ex.preview" :src="ex.preview" :alt="`${ex.title} preview`" class="exd-preview-img" />
              <div v-else class="exd-preview-empty">Loading preview…</div>
            </template>
          </ClientOnly>
        </div>

        <!-- Right: metadata + actions -->
        <div class="exd-info">
          <span class="exd-cat">{{ CATEGORY_LABELS[ex.category] }}</span>
          <h1 class="exd-title">{{ ex.title }}</h1>
          <p v-if="ex.description" class="exd-desc">{{ ex.description }}</p>

          <div v-if="ex.colors.length" class="exd-palette" aria-label="Color palette">
            <span
              v-for="c in ex.colors"
              :key="c.name"
              class="exd-swatch"
              :style="{ background: c.value }"
              :title="`${c.name} · ${c.value}`"
            />
          </div>

          <div class="exd-actions">
            <a class="exd-btn exd-btn--primary" :href="ex.raw" target="_blank" rel="noopener">View raw</a>
            <a class="exd-btn" :href="ex.download" :download="`${ex.slug}.gui`">Download .gui</a>
            <button class="exd-btn" type="button" @click="copySource">{{ copied ? 'Copied!' : 'Copy source' }}</button>
          </div>

          <dl class="exd-facts">
            <div><dt>Format</dt><dd><NuxtLink to="/spec">.gui</NuxtLink></dd></div>
            <div><dt>Category</dt><dd>{{ CATEGORY_LABELS[ex.category] }}</dd></div>
            <div><dt>License</dt><dd>Free to use</dd></div>
          </dl>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { getExample, CATEGORY_LABELS } from '~/lib/examples-data'

const route = useRoute()
const slug = route.params.slug as string

const ex = getExample(slug)
if (!ex) {
  throw createError({ statusCode: 404, statusMessage: `Unknown example: ${slug}`, fatal: true })
}

// Load the raw .guix so it can seed the JSON-LD (source in the HTML for AI
// search) and the copy button. On the server read it off disk from public/;
// on the client fetch the static asset. useAsyncData serializes the result
// into the payload so the client doesn't refetch after hydration.
const { data: source } = await useAsyncData(`example-src-${slug}`, async () => {
  if (import.meta.server) {
    const { readFile } = await import('node:fs/promises')
    const { join } = await import('node:path')
    return readFile(join(process.cwd(), 'public', ex.raw), 'utf8')
  }
  return $fetch<string>(ex.raw, { parseResponse: (t) => t })
})

const copied = ref(false)
async function copySource() {
  try {
    await navigator.clipboard.writeText(source.value || '')
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch { /* clipboard unavailable */ }
}

const pageUrl = canonicalUrl(`/examples/${ex.slug}`)
const rawUrl = `${SITE_URL}${ex.raw}`

usePageSeo({
  path: `/examples/${ex.slug}`,
  title: `${ex.title} — .gui ${CATEGORY_LABELS[ex.category]} example`,
  description: ex.description || `A ${CATEGORY_LABELS[ex.category].toLowerCase()} UI example in the .gui format — preview it live, read the source, and download the file.`,
  ogTitle: `${ex.title} — .gui example`,
  ogDescription: ex.description
})

// Point agents straight at the machine-readable source, and embed the source
// in structured data so AI search engines can read the .gui without a fetch.
useHead({
  link: [{ rel: 'alternate', type: 'text/plain', href: rawUrl, title: 'raw .gui source' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: ex.title,
        description: ex.description,
        programmingLanguage: { '@type': 'ComputerLanguage', name: 'gui' },
        codeRepository: pageUrl,
        url: pageUrl,
        text: source.value || '',
        author: { '@type': 'Organization', name: '.gui (dotgui)', url: canonicalUrl('/') },
        isPartOf: { '@type': 'CollectionPage', name: '.gui Examples', url: canonicalUrl('/examples') }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Examples', item: canonicalUrl('/examples') },
          { '@type': 'ListItem', position: 2, name: ex.title, item: pageUrl }
        ]
      })
    }
  ]
})
</script>

<style scoped>
.exd { padding: 40px 24px 96px; }

.exd-crumb { font-family: var(--mono); font-size: 12px; color: var(--muted-soft); margin-bottom: 28px; display: flex; align-items: center; gap: 8px; }
.exd-crumb a { color: var(--muted); text-decoration: none; }
.exd-crumb a:hover { color: var(--ink); }
.exd-crumb .current { color: var(--body); }

.exd-split { display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; align-items: start; }

/* preview — the frame hugs the rendered file (no dotted margins). The embed
   reports its own width (native for mobile, scaled-to-fit for wide web files),
   so width:fit-content wraps it tightly; the dot grid is blended out. */
.exd-preview {
  position: sticky;
  top: 92px;
  width: fit-content;
  max-width: 100%;
  margin-inline: auto;
  border-radius: 16px;
  border: 1px solid var(--hairline);
  overflow: hidden;
  background: var(--surface);
}
.exd-embed {
  display: block;
  max-width: 100%;
  --gui-embed-bg: var(--surface);
  --gui-embed-dot: var(--surface);
}
.exd-preview-img { display: block; max-width: 100%; }
.exd-preview-empty { padding: 60px 40px; color: var(--muted-soft); font-family: var(--mono); font-size: 13px; }

/* info column */
.exd-cat { font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-soft); }
.exd-title { font-family: var(--display); font-size: clamp(28px, 4vw, 40px); font-weight: 700; letter-spacing: -0.02em; margin: 10px 0 16px; color: var(--ink); }
.exd-desc { font-size: 16px; line-height: 1.65; color: var(--body); margin: 0 0 24px; }

.exd-palette { display: flex; gap: 6px; margin-bottom: 28px; flex-wrap: wrap; }
.exd-swatch { width: 30px; height: 30px; border-radius: 7px; border: 1px solid rgba(0, 0, 0, 0.08); }

.exd-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; }
.exd-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--sans); font-size: 14px; font-weight: 500;
  padding: 11px 20px; border-radius: var(--radius-pill);
  text-decoration: none; cursor: pointer;
  border: 1px solid var(--hairline); color: var(--ink); background: var(--surface);
  transition: border-color 160ms var(--ease-out), background 160ms var(--ease-out);
}
.exd-btn:hover { border-color: var(--muted-soft); }
.exd-btn--primary { background: var(--primary); color: var(--on-primary); border-color: var(--primary); }
.exd-btn--primary:hover { background: var(--primary-active); border-color: var(--primary-active); }

.exd-facts { display: flex; flex-direction: column; gap: 10px; margin: 0; border-top: 1px solid var(--hairline); padding-top: 20px; }
.exd-facts > div { display: flex; justify-content: space-between; gap: 16px; }
.exd-facts dt { font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted-soft); margin: 0; }
.exd-facts dd { font-size: 13px; color: var(--body); margin: 0; }
.exd-facts a { color: var(--body); }

@media (max-width: 860px) {
  .exd-split { grid-template-columns: 1fr; gap: 28px; }
  .exd-preview { position: static; }
}
</style>
