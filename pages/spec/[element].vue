<template>
  <SpecShell>
    <div class="leaf">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/spec">Spec Reference</NuxtLink>
        <span class="sep">/</span>
        <span class="current">{{ displayName(entry.name) }}</span>
      </nav>

      <p class="leaf-lead">{{ entry.seoDescription }}</p>

      <SpecEntry :entry="entry" name-tag="h1" />

      <section v-if="entry.faq.length" class="faq">
        <h2 class="faq-label">Frequently asked</h2>
        <div v-for="(f, i) in entry.faq" :key="i" class="faq-item">
          <p class="faq-q">{{ f.q }}</p>
          <p class="faq-a">{{ f.a }}</p>
        </div>
      </section>

      <section v-if="relatedEntries.length" class="related">
        <p class="related-label">Related</p>
        <div class="related-links">
          <NuxtLink
            v-for="rel in relatedEntries"
            :key="rel.slug"
            :to="`/spec/${rel.slug}`"
            class="related-link"
          >
            <span class="related-name">{{ displayName(rel.name) }}</span>
            <span class="related-sub">{{ rel.sub }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </SpecShell>
</template>

<script setup lang="ts">
import { getSpecEntry, specDisplayName } from '~/lib/spec-data'

const displayName = specDisplayName

const route = useRoute()
const slug = route.params.element as string
const entry = getSpecEntry(slug)

if (!entry) {
  throw createError({ statusCode: 404, statusMessage: `Unknown spec element: ${slug}`, fatal: true })
}

const relatedEntries = (entry.related || [])
  .map(s => getSpecEntry(s))
  .filter((e): e is NonNullable<typeof e> => !!e)

const cleanTitle = specDisplayName(entry.title)
const pageUrl = `https://dotgui.org/spec/${entry.slug}`

useSeoMeta({
  title: `${cleanTitle} — .gui Spec Reference`,
  description: entry.seoDescription,
  ogTitle: `${cleanTitle} — .gui`,
  ogDescription: entry.seoDescription,
  ogUrl: pageUrl,
  ogImage: 'https://dotgui.org/og.png',
  twitterCard: 'summary_large_image'
})

const ldScripts = [
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: `${cleanTitle} — .gui Spec Reference`,
      description: entry.seoDescription,
      url: pageUrl,
      about: { '@type': 'Thing', name: specDisplayName(entry.name) },
      isPartOf: { '@type': 'TechArticle', name: '.gui Spec Reference', url: 'https://dotgui.org/spec' },
      author: { '@type': 'Organization', name: '.gui', url: 'https://dotgui.org' }
    })
  },
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Spec Reference', item: 'https://dotgui.org/spec' },
        { '@type': 'ListItem', position: 2, name: specDisplayName(entry.name), item: pageUrl }
      ]
    })
  }
]

// FAQPage schema — strongest GEO signal; only when the entry has FAQs.
if (entry.faq.length) {
  ldScripts.push({
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: entry.faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    })
  })
}

useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
  script: ldScripts
})
</script>

<style scoped>
.leaf { padding-bottom: 64px; }

.breadcrumb {
  font-family: var(--sans);
  font-size: 12px;
  color: var(--text-dim);
  padding: 24px 40px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.breadcrumb a { color: var(--text-muted); text-decoration: none; }
.breadcrumb a:hover { color: var(--text); }
.breadcrumb .current { color: var(--text); }

.leaf-lead {
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-muted);
  max-width: 680px;
  padding: 18px 40px 24px;
  margin: 0;
}

.faq {
  padding: 32px 40px 0;
}

.faq-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 16px;
}

.faq-item {
  padding: 0 0 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-subtle);
}
.faq-item:last-child { border-bottom: none; margin-bottom: 0; }

.faq-q {
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 6px;
}
.faq-a {
  font-family: var(--sans);
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-muted);
  margin: 0;
  max-width: 680px;
}

.related {
  padding: 32px 40px 0;
}

.related-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 14px;
}

.related-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}

.related-link {
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
.related-link:hover { border-color: var(--muted-soft); transform: translateY(-2px); }

.related-name {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text);
}
.related-sub {
  font-family: var(--sans);
  font-size: 11px;
  color: var(--text-dim);
}

@media (max-width: 900px) {
  .breadcrumb { padding: 20px 20px 0; }
  .leaf-lead { padding: 16px 20px 20px; }
  .faq { padding: 28px 20px 0; }
  .related { padding: 28px 20px 0; }
}
</style>
