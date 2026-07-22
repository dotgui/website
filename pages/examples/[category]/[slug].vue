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
        <!-- Left: live preview -->
        <div class="exd-preview" :class="`is-${ex.category}`">
          <ClientOnly>
            <gui-embed :src="ex.gui" class="exd-embed" />
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
            <a class="exd-btn exd-btn--primary" :href="ex.guix" target="_blank" rel="noopener">View raw</a>
            <a class="exd-btn" :href="ex.gui" :download="`${ex.slug}.gui`">Download .gui</a>
          </div>

          <dl class="exd-facts">
            <div><dt>Format</dt><dd><NuxtLink to="/spec">.gui</NuxtLink></dd></div>
            <div><dt>Files</dt><dd>design.guix + assets</dd></div>
            <div><dt>License</dt><dd>Free to use</dd></div>
          </dl>
        </div>
      </div>

      <!-- Full source, collapsible -->
      <section class="exd-source">
        <div class="exd-source-head">
          <h2 class="exd-source-label">Source — <code>design.guix</code></h2>
          <div class="exd-source-actions">
            <button class="exd-mini" type="button" @click="copySource">{{ copied ? 'Copied!' : 'Copy' }}</button>
            <a class="exd-mini" :href="ex.guix" target="_blank" rel="noopener">Raw</a>
            <button class="exd-mini" type="button" @click="expanded = !expanded">
              {{ expanded ? 'Collapse' : 'Expand' }}
            </button>
          </div>
        </div>
        <pre class="exd-code" :class="{ collapsed: !expanded }"><code>{{ source }}</code></pre>
        <button v-if="!expanded" class="exd-fade-btn" type="button" @click="expanded = true">
          Show full source
        </button>
      </section>
    </main>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { getExample, CATEGORY_LABELS } from '~/lib/examples-data'

const route = useRoute()
const slug = route.params.slug as string
const category = route.params.category as string

const ex = getExample(slug)
if (!ex || ex.category !== category) {
  throw createError({ statusCode: 404, statusMessage: `Unknown example: ${category}/${slug}`, fatal: true })
}

// Load the raw .guix so it renders into the prerendered HTML — this is what
// makes the source readable by crawlers and agents without unzipping the .gui.
// On the server (incl. prerender) read it off disk from public/; on the client
// fall back to fetching the static asset. useAsyncData serializes the result
// into the payload so the client doesn't refetch after hydration.
const { data: source } = await useAsyncData(`example-src-${slug}`, async () => {
  if (import.meta.server) {
    const { readFile } = await import('node:fs/promises')
    const { join } = await import('node:path')
    return readFile(join(process.cwd(), 'public', ex.guix), 'utf8')
  }
  return $fetch<string>(ex.guix, { parseResponse: (t) => t })
})

const expanded = ref(false)
const copied = ref(false)
async function copySource() {
  try {
    await navigator.clipboard.writeText(source.value || '')
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch { /* clipboard unavailable */ }
}

const pageUrl = canonicalUrl(`/examples/${ex.category}/${ex.slug}`)
const rawUrl = `${SITE_URL}${ex.guix}`

usePageSeo({
  path: `/examples/${ex.category}/${ex.slug}`,
  title: `${ex.title} — .gui ${CATEGORY_LABELS[ex.category]} example`,
  description: ex.description || `A ${CATEGORY_LABELS[ex.category].toLowerCase()} UI example in the .gui format — preview it live, read the source, and download the file.`,
  ogTitle: `${ex.title} — .gui example`,
  ogDescription: ex.description
})

// Point agents straight at the machine-readable source.
useHead({
  link: [{ rel: 'alternate', type: 'text/plain', href: rawUrl, title: 'design.guix source' }],
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
        // The literal source, so AI search engines can read the .gui inline.
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

/* preview */
.exd-preview {
  position: sticky;
  top: 92px;
  border-radius: 16px;
  border: 1px solid var(--hairline);
  background: var(--surface);
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 20px;
}
.exd-preview.is-mobile .exd-embed,
.exd-preview.is-mobile .exd-preview-img { max-width: 390px; }
.exd-embed { width: 100%; display: block; }
.exd-preview-img { width: 100%; display: block; border-radius: 8px; }
.exd-preview-empty { padding: 60px 0; color: var(--muted-soft); font-family: var(--mono); font-size: 13px; }

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

/* source */
.exd-source { margin-top: 56px; }
.exd-source-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 14px; flex-wrap: wrap; }
.exd-source-label { font-family: var(--sans); font-size: 15px; font-weight: 600; color: var(--ink); margin: 0; }
.exd-source-label code { font-family: var(--mono); font-size: 13px; }
.exd-source-actions { display: flex; gap: 8px; }
.exd-mini {
  font-family: var(--mono); font-size: 12px; color: var(--body);
  background: var(--surface); border: 1px solid var(--hairline); border-radius: 8px;
  padding: 6px 12px; cursor: pointer; text-decoration: none;
}
.exd-mini:hover { border-color: var(--muted-soft); color: var(--ink); }

.exd-code {
  position: relative;
  background: var(--code-bg, #0d0d12);
  color: var(--code-fg, #e6e6ec);
  border-radius: 12px;
  padding: 20px 22px;
  overflow: auto;
  font-family: var(--mono);
  font-size: 12.5px;
  line-height: 1.6;
  margin: 0;
  tab-size: 2;
}
.exd-code.collapsed { max-height: 420px; overflow: hidden; }
.exd-fade-btn {
  display: block; width: 100%; margin-top: -46px; position: relative;
  padding: 44px 0 12px;
  border: 0; cursor: pointer;
  font-family: var(--sans); font-size: 13px; font-weight: 500; color: var(--ink);
  background: linear-gradient(to bottom, transparent, var(--canvas) 70%);
}

@media (max-width: 860px) {
  .exd-split { grid-template-columns: 1fr; gap: 28px; }
  .exd-preview { position: static; }
}
</style>
