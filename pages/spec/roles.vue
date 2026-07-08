<template>
  <SpecShell>
    <div class="leaf">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/spec">Spec Reference</NuxtLink>
        <span class="sep">/</span>
        <span class="current">Roles</span>
      </nav>

      <header class="roles-header">
        <h1>The role vocabulary</h1>
        <p class="roles-lead">
          <code>role=</code> is a closed, controlled vocabulary of {{ count }} recognized UI
          structures  button, nav-bar, card, dialog, and friends. Tagging a node with a
          role changes no pixels; it makes the file <strong>self-describing</strong>, the
          <code>&lt;nav&gt;</code>-vs-<code>&lt;div&gt;</code> distinction for .gui. Any
          machine, AI, or tool reading the file knows <em>what a node is</em> without
          guessing  which is what the <NuxtLink to="/spec/quality">Comprehensible
          quality level</NuxtLink> measures.
        </p>
        <p class="roles-lead">
          A role qualifies by appearing in at least one platform reference system  the
          Component Gallery for web, Apple's Human Interface Guidelines for iOS, Material
          Design for Android. Each role declares a <strong>reach</strong>: how far down
          its subtree its meaning documents the content (<code>full</code> = the whole
          subtree, <code>2</code> = a two-level grammar like table → row → cell,
          <code>1</code> = one chrome level, then the payload labels itself).
        </p>
      </header>

      <table class="roles-table">
        <thead>
          <tr><th>Role</th><th>Reach</th><th>Platforms</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr v-for="r in roles" :key="r.role" :id="r.role">
            <td class="cell-role"><code>{{ r.role }}</code></td>
            <td class="cell-reach">{{ r.reach }}</td>
            <td class="cell-platforms">{{ r.platforms.join(' · ') }}</td>
            <td class="cell-desc">
              {{ r.description }}
              <span v-if="r.aka.length" class="aka">AKA: {{ r.aka.join(', ') }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </SpecShell>
</template>

<script setup lang="ts">
import rolesJson from '~/lib/roles.json'

const roles = rolesJson.roles
const count = rolesJson.count

const pageUrl = 'https://dotgui.org/spec/roles'

usePageSeo({
  path: '/spec/roles',
  title: `The .gui role vocabulary  ${count} recognized UI roles`,
  description: `The complete role= catalog for the .gui format: ${count} recognized UI structures (button, nav-bar, card, dialog, …) that make files self-describing and AI-ready. Each role lists its reach, platforms, and alternate names.`
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: `The .gui role vocabulary  ${count} recognized UI roles`,
        description: `The closed role= catalog of the .gui format: ${count} UI structures with reach and platform coverage.`,
        url: pageUrl,
        isPartOf: { '@type': 'TechArticle', name: '.gui Spec Reference', url: 'https://dotgui.org/spec' },
        author: { '@type': 'Organization', name: '.gui (dotgui)', url: 'https://dotgui.org' }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Spec Reference', item: 'https://dotgui.org/spec' },
          { '@type': 'ListItem', position: 2, name: 'Roles', item: pageUrl }
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        name: '.gui role vocabulary',
        url: pageUrl,
        hasDefinedTerm: roles.map(r => ({
          '@type': 'DefinedTerm',
          name: r.role,
          description: r.description,
          url: `${pageUrl}#${r.role}`
        }))
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
.breadcrumb .current { color: var(--text); }

.roles-header { padding: 18px 40px 8px; }

.roles-header h1 {
  font-family: var(--display);
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--ink);
  margin-bottom: 12px;
}

.roles-lead {
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-muted);
  max-width: 680px;
  margin: 0 0 12px;
}
.roles-lead strong { color: var(--text); }
.roles-lead a { color: var(--text); }
.roles-lead code { font-family: var(--mono); font-size: 0.92em; color: var(--text); }

.roles-table {
  width: calc(100% - 80px);
  margin: 24px 40px 0;
  border-collapse: collapse;
  font-family: var(--sans);
  font-size: 13px;
}
.roles-table th {
  text-align: left;
  font-family: var(--sans);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-weight: 500;
  padding: 0 14px 10px 0;
  border-bottom: 1px solid var(--border);
}
.roles-table td {
  padding: 10px 14px 10px 0;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: top;
  line-height: 1.6;
}
.cell-role code {
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--text);
  white-space: nowrap;
}
.cell-reach { font-family: var(--mono); font-size: 12px; color: var(--text-muted); white-space: nowrap; }
.cell-platforms { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
.cell-desc { color: var(--text-muted); }
.aka {
  display: block;
  font-size: 11.5px;
  color: var(--text-dim);
  margin-top: 2px;
}

@media (max-width: 900px) {
  .breadcrumb { padding: 20px 20px 0; }
  .roles-header { padding: 16px 20px 8px; }
  .roles-table { width: calc(100% - 40px); margin: 20px 20px 0; }
  .cell-platforms { display: none; }
}
</style>
