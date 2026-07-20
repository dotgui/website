<template>
  <GuideShell>
    <div class="leaf">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/guides">Guides</NuxtLink>
        <span class="sep">/</span>
        <span class="current">{{ entry.navLabel }}</span>
      </nav>

      <div class="leaf-head">
        <p class="leaf-eyebrow">{{ categoryLabel }}</p>
        <h1 class="leaf-title">{{ entry.title }}</h1>
        <p class="leaf-dek">{{ entry.dek }}</p>
      </div>

      <GuideBody :body="entry.body" />

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
            :to="`/guides/${rel.slug}`"
            class="related-link"
          >
            <span class="related-name">{{ rel.navLabel }}</span>
            <span class="related-sub">{{ rel.dek }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </GuideShell>
</template>

<script setup lang="ts">
import { getGuideEntry, guideCategoryLabels } from '~/lib/guides-data'

const route = useRoute()
const slug = route.params.slug as string
const entry = getGuideEntry(slug)

if (!entry) {
  throw createError({ statusCode: 404, statusMessage: `Unknown guide: ${slug}`, fatal: true })
}

const categoryLabel = guideCategoryLabels[entry.category]

const relatedEntries = (entry.related || [])
  .map(s => getGuideEntry(s))
  .filter((e): e is NonNullable<typeof e> => !!e)

const pageUrl = canonicalUrl(`/guides/${entry.slug}`)
const guidesUrl = canonicalUrl('/guides')

useSeoMeta({
  title: entry.seoTitle,
  description: entry.seoDescription,
  ogTitle: entry.seoTitle,
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
      '@type': 'Article',
      headline: entry.title,
      description: entry.seoDescription,
      url: pageUrl,
      datePublished: entry.datePublished,
      dateModified: entry.dateModified,
      isPartOf: { '@type': 'CollectionPage', name: '.gui Guides', url: guidesUrl },
      author: { '@type': 'Organization', name: '.gui (dotgui)', url: canonicalUrl('/') }
    })
  },
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Guides', item: guidesUrl },
        { '@type': 'ListItem', position: 2, name: entry.navLabel, item: pageUrl }
      ]
    })
  }
]

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

.leaf-head { padding: 18px 40px 24px; max-width: 720px; }

.leaf-eyebrow {
  font-family: var(--sans);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin: 0 0 10px;
}

.leaf-title {
  font-family: var(--display);
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--ink);
  margin: 0 0 10px;
}

.leaf-dek {
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0;
}

:deep(.guide-body) { padding: 0 40px; }

.faq {
  padding: 32px 40px 0;
}

.faq-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 16px;
  font-family: var(--sans);
}

.faq-item {
  padding: 0 0 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-subtle);
  max-width: 720px;
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
  font-family: var(--sans);
}

.related-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
  font-family: var(--sans);
  font-weight: 600;
  font-size: 13px;
  color: var(--text);
}
.related-sub {
  font-family: var(--sans);
  font-size: 11px;
  color: var(--text-dim);
  line-height: 1.5;
}

@media (max-width: 900px) {
  .breadcrumb { padding: 20px 20px 0; }
  .leaf-head { padding: 16px 20px 20px; }
  :deep(.guide-body) { padding: 0 20px; }
  .faq { padding: 28px 20px 0; }
  .related { padding: 28px 20px 0; }
}
</style>
