<template>
  <KitShell>
    <div class="leaf">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/kit">The Kit</NuxtLink>
        <span class="sep">/</span>
        <span class="current">{{ mod.name }}</span>
      </nav>

      <p class="leaf-lead">{{ mod.seo }}</p>

      <section class="entry">
        <!-- head -->
        <div class="entry-head">
          <h1 class="entry-name">{{ mod.name }}</h1>
          <span class="kind-badge" :class="`kind-${mod.kind}`">{{ mod.tag }}</span>
          <span class="entry-sub">{{ mod.sub }}</span>
        </div>

        <!-- body: center explanation + API · right examples -->
        <div class="entry-body">
          <div class="entry-desc">
            <p v-for="(p, i) in mod.desc" :key="i">{{ p }}</p>

            <div v-if="mod.signature" class="api">
              <p class="mini-label">Signature</p>
              <pre class="api-pre" v-html="hl(mod.signature, 'ts')"></pre>
            </div>

            <div v-if="mod.checks" class="listing">
              <p class="mini-label">{{ mod.slug === 'autofix' ? 'What it repairs' : 'What it checks' }}</p>
              <ul class="check-list">
                <li v-for="(c, i) in mod.checks" :key="i">{{ c }}</li>
              </ul>
            </div>

            <div class="listing">
              <p class="mini-label">Use cases</p>
              <ul class="check-list">
                <li v-for="(u, i) in mod.useCases" :key="i">{{ u }}</li>
              </ul>
            </div>
          </div>

          <div class="entry-example">
            <div v-for="(ex, i) in mod.examples" :key="i" class="rx">
              <p class="example-label">{{ ex.label }}</p>
              <pre class="example-pre" v-html="hl(ex.code, ex.lang)"></pre>
            </div>
          </div>
        </div>
      </section>

      <section v-if="relatedMods.length" class="related">
        <p class="related-label">Related</p>
        <div class="related-links">
          <NuxtLink v-for="r in relatedMods" :key="r.slug" :to="`/kit/${r.slug}`" class="related-link">
            <span class="related-name">{{ r.name }}</span>
            <span class="related-sub">{{ r.sub }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </KitShell>
</template>

<script setup lang="ts">
import { getKitModule } from '~/lib/kit-data'
import { hlCode } from '~/lib/spec-highlight'

const hl = (code: string, lang?: string) => hlCode(code, lang)

const route = useRoute()
const slug = route.params.module as string
const mod = getKitModule(slug)

if (!mod) {
  throw createError({ statusCode: 404, statusMessage: `Unknown kit module: ${slug}`, fatal: true })
}

const relatedMods = (mod.related || [])
  .map(s => getKitModule(s))
  .filter((m): m is NonNullable<typeof m> => !!m)

const pageUrl = canonicalUrl(`/kit/${mod.slug}`)
const kitUrl = canonicalUrl('/kit')
const importPath = mod.slug === 'types' ? '@dotgui/kit' : `@dotgui/kit${mod.name}`

useSeoMeta({
  title: `${importPath}  @dotgui/kit`,
  description: mod.seo,
  ogTitle: `${importPath}  @dotgui/kit`,
  ogDescription: mod.seo,
  ogUrl: pageUrl,
  ogImage: 'https://dotgui.org/og.png',
  twitterCard: 'summary_large_image'
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: `${importPath}  @dotgui/kit`,
        description: mod.seo,
        url: pageUrl,
        isPartOf: { '@type': 'TechArticle', name: '@dotgui/kit', url: kitUrl },
        author: { '@type': 'Organization', name: '.gui (dotgui)', url: canonicalUrl('/') }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'The Kit', item: kitUrl },
          { '@type': 'ListItem', position: 2, name: mod.name, item: pageUrl }
        ]
      })
    }
  ]
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
.breadcrumb .current { color: var(--text); font-family: var(--mono); }

.leaf-lead {
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-muted);
  max-width: 680px;
  padding: 18px 40px 24px;
  margin: 0;
}

/* ── entry (mirrors SpecEntry) ── */
.entry-head {
  padding: 16px 40px;
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.entry-name {
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.01em;
  margin: 0;
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
.kind-blue   { color: var(--blue);   background: rgba(43,107,228,.1);  border-color: rgba(43,107,228,.22); }
.kind-purple { color: var(--purple); background: rgba(157,91,234,.1);  border-color: rgba(157,91,234,.22); }
.kind-muted  { color: var(--muted);  background: var(--surface-strong); border-color: var(--hairline); }
.entry-sub {
  font-size: 12px;
  color: var(--text-dim);
  font-family: var(--sans);
}

.entry-body {
  display: grid;
  grid-template-columns: 3fr 2fr;
  align-items: start;
}

/* center  explanation + API */
.entry-desc { padding: 12px 36px 40px 40px; }
.entry-desc p {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.8;
  font-family: var(--sans);
  margin-bottom: 14px;
}

.mini-label {
  font-family: var(--sans);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin: 0 0 10px;
}
.api { margin-top: 26px; }
.api-pre {
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.7;
  color: #55534c;
  white-space: pre;
  overflow-x: auto;
  margin: 0;
  padding: 14px 16px;
  background: var(--surface-soft);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-md);
  font-variant-ligatures: none;
}

.listing { margin-top: 26px; }
.check-list { list-style: none; margin: 0; padding: 0; }
.check-list li {
  position: relative;
  font-family: var(--sans);
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-muted);
  padding: 0 0 8px 18px;
}
.check-list li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 9px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--muted-soft);
}

/* right  examples */
.entry-example {
  padding: 16px 24px 24px;
  background: var(--surface);
  min-width: 0;
  align-self: stretch;
  position: sticky;
  top: 61px;
}
.rx { margin-bottom: 22px; }
.rx:last-child { margin-bottom: 0; }
.example-label {
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 10px;
}
.example-pre {
  font-family: var(--mono);
  font-size: 11.5px;
  line-height: 1.7;
  color: #55534c;
  overflow-x: auto;
  white-space: pre;
  margin: 0;
  font-variant-ligatures: none;
}

/* shared light-surface token palette */
:deep(.tok-tag)     { color: #2b6be4; }
:deep(.tok-attr)    { color: #b7471d; }
:deep(.tok-val)     { color: #1f7a43; }
:deep(.tok-punct)   { color: #9a988e; }
:deep(.tok-comment) { color: #98978a; font-style: italic; }

/* related */
.related { padding: 32px 40px 0; }
.related-label {
  font-family: var(--sans);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 14px;
}
.related-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  max-width: 720px;
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
.related-name { font-family: var(--mono); font-size: 13px; color: var(--text); }
.related-sub { font-family: var(--sans); font-size: 11px; color: var(--text-dim); }

@media (max-width: 860px) {
  .entry-body { grid-template-columns: 1fr; }
  .entry-example {
    position: static;
    border-top: 1px solid var(--hairline);
    padding: 20px 40px 24px;
  }
  .entry-desc { padding: 12px 40px 24px; }
}
@media (max-width: 900px) {
  .breadcrumb { padding: 20px 20px 0; }
  .leaf-lead { padding: 16px 20px 20px; }
  .related { padding: 28px 20px 0; }
}
</style>
