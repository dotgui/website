<template>
  <section :id="entry.slug" class="spec-entry">
    <div class="entry-head">
      <component :is="nameTag" class="entry-name">{{ displayName }}</component>
      <span class="kind-badge" :class="`kind-${kind}`">{{ kind }}</span>
      <span class="entry-sub">{{ entry.sub }}</span>
      <NuxtLink v-if="linkToPage" :to="`/spec/${entry.slug}`" class="entry-permalink">full page →</NuxtLink>
    </div>
    <div class="entry-body">
      <div class="entry-desc">
        <p v-for="(para, i) in entry.desc" :key="i">{{ para }}</p>
        <table v-if="entry.table" class="attr-table">
          <thead><tr><th v-for="h in entry.table.head" :key="h">{{ h }}</th></tr></thead>
          <tbody>
            <tr v-for="(row, ri) in entry.table.rows" :key="ri">
              <td v-for="(cell, ci) in row" :key="ci" v-html="cell"></td>
            </tr>
          </tbody>
        </table>
        <p v-if="entry.note" class="note">{{ entry.note }}</p>
        <SharedAttrsTable v-if="entry.sharedAttrs" />
      </div>
      <div class="entry-example">
        <p class="example-label">{{ entry.exampleLabel }}</p>
        <pre class="example-pre" v-html="rendered"></pre>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { type SpecEntry, specDisplayName, specKind } from '~/lib/spec-data'
import { hl, plain } from '~/lib/spec-highlight'

const props = withDefaults(defineProps<{
  entry: SpecEntry
  /** Heading element for the entry name (h1 on dedicated pages, h2 in the hub). */
  nameTag?: string
  /** Show a "full page →" permalink to the dedicated route. */
  linkToPage?: boolean
}>(), {
  nameTag: 'span',
  linkToPage: false
})

const displayName = computed(() => specDisplayName(props.entry.name))
const kind = computed(() => specKind(props.entry))

const rendered = computed(() =>
  props.entry.exampleMode === 'plain' ? plain(props.entry.example) : hl(props.entry.example)
)
</script>

<style scoped>
.spec-entry {
  border-bottom: 1px solid var(--border);
  scroll-margin-top: 61px;
}

.entry-head {
  padding: 16px 40px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.entry-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  font-family: var(--mono);
  letter-spacing: -0.01em;
  margin: 0;
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

.entry-sub {
  font-size: 11px;
  color: var(--text-dim);
  font-family: var(--sans);
  letter-spacing: 0.02em;
}

.entry-permalink {
  margin-left: auto;
  font-size: 11px;
  font-family: var(--sans);
  color: var(--text-dim);
  text-decoration: none;
  transition: color 120ms var(--ease-out);
}
.entry-permalink:hover { color: var(--text); }

.entry-body {
  display: grid;
  grid-template-columns: 3fr 2fr;
  min-height: 0;
}

.entry-desc {
  padding: 28px 36px 32px 40px;
  border-right: 1px solid var(--border);
}

.entry-desc p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.85;
  font-family: var(--sans);
  margin-bottom: 12px;
}
.entry-desc p:last-child { margin-bottom: 0; }
.entry-desc p.note {
  color: var(--text-dim);
  font-size: 12px;
}

.entry-desc :deep(strong) { color: var(--text); font-weight: 500; }
.entry-desc :deep(code) { font-family: var(--mono); }

.attr-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 18px;
  font-size: 12px;
}

.attr-table thead tr { border-bottom: 1px solid var(--border); }

.attr-table th {
  text-align: left;
  padding: 5px 10px 5px 0;
  color: var(--text-dim);
  font-weight: 500;
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.attr-table td {
  padding: 5px 10px 5px 0;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  vertical-align: top;
  font-family: var(--sans);
  font-size: 12.5px;
  line-height: 1.6;
}

.attr-table td:first-child {
  font-family: var(--mono);
  color: var(--text);
  font-size: 11.5px;
  white-space: nowrap;
  padding-right: 16px;
}

.entry-example {
  padding: 20px 24px;
  background: var(--surface);
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.example-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
  flex-shrink: 0;
}

.example-pre {
  font-family: var(--mono);
  font-size: 11.5px;
  line-height: 1.7;
  color: #888;
  overflow-x: auto;
  white-space: pre;
  margin: 0;
  flex: 1;
}

:deep(.tok-tag)     { color: #6ea8fe; }
:deep(.tok-attr)    { color: #79c0ff; }
:deep(.tok-val)     { color: #a5d6ff; }
:deep(.tok-punct)   { color: #555; }
:deep(.tok-comment) { color: #484f58; font-style: italic; }

@media (max-width: 900px) {
  .entry-head { padding: 14px 20px; }
  .entry-desc { padding: 20px 20px 24px; }
  .entry-example { padding: 16px 16px; }
}

@media (max-width: 700px) {
  .entry-body { grid-template-columns: 1fr; }
  .entry-desc { border-right: none; border-bottom: 1px solid var(--border-subtle); }
}
</style>
