<template>
  <div class="guide-body">
    <template v-for="(block, i) in body" :key="i">
      <p v-if="block.type === 'p'" class="g-p" v-html="block.text" />
      <h2 v-else-if="block.type === 'h2'" class="g-h2">{{ block.text }}</h2>
      <ul v-else-if="block.type === 'list'" class="g-list">
        <li v-for="(item, j) in block.items" :key="j" v-html="item" />
      </ul>
      <DocCode
        v-else-if="block.type === 'code'"
        :code="block.code"
        :lang="block.lang"
        :label="block.label"
      />
      <div v-else-if="block.type === 'callout'" class="g-callout" :class="`g-callout-${block.tone}`">
        <span class="g-callout-tag">{{ block.tone === 'do' ? 'Do' : "Don't" }}</span>
        <p v-html="block.text" />
      </div>
      <table v-else-if="block.type === 'table'" class="g-table">
        <thead>
          <tr><th v-for="(h, j) in block.head" :key="j">{{ h }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="(row, j) in block.rows" :key="j">
            <td v-for="(cell, k) in row" :key="k" v-html="cell" />
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { GuideBlock } from '~/lib/guides-data'

defineProps<{ body: GuideBlock[] }>()
</script>

<style scoped>
.guide-body { max-width: 720px; }

.g-p {
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-muted);
  margin: 0 0 16px;
}
.guide-body :deep(strong) { color: var(--text); }
.guide-body :deep(a) { color: var(--text); }
.guide-body :deep(code) {
  font-family: var(--mono);
  font-size: 0.92em;
  color: var(--text);
}

.g-h2 {
  font-family: var(--display);
  font-size: 20px;
  font-weight: var(--display-weight);
  letter-spacing: -0.015em;
  color: var(--ink);
  margin: 32px 0 10px;
}

.g-list {
  margin: 0 0 16px;
  padding-left: 20px;
}
.g-list li {
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.g-callout {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--hairline);
  margin: 0 0 16px;
}
.g-callout p { margin: 0; font-family: var(--sans); font-size: 13.5px; line-height: 1.65; color: var(--text-muted); }
.g-callout-tag {
  flex: none;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  margin-top: 1px;
}
.g-callout-do { background: color-mix(in srgb, var(--green, #1f7a43) 8%, transparent); border-color: color-mix(in srgb, var(--green, #1f7a43) 25%, var(--hairline)); }
.g-callout-do .g-callout-tag { background: color-mix(in srgb, var(--green, #1f7a43) 16%, transparent); color: var(--green, #1f7a43); }
.g-callout-dont { background: color-mix(in srgb, var(--orange, #b7471d) 8%, transparent); border-color: color-mix(in srgb, var(--orange, #b7471d) 25%, var(--hairline)); }
.g-callout-dont .g-callout-tag { background: color-mix(in srgb, var(--orange, #b7471d) 16%, transparent); color: var(--orange, #b7471d); }

.g-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--sans);
  font-size: 13px;
  margin: 8px 0 16px;
}
.g-table th {
  text-align: left;
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-weight: 500;
  padding: 0 14px 8px 0;
  border-bottom: 1px solid var(--border);
}
.g-table td {
  padding: 10px 14px 10px 0;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: top;
  line-height: 1.65;
  color: var(--text-muted);
}
.g-table td:first-child { color: var(--text); font-weight: 500; }
.g-table :deep(code) { font-family: var(--mono); font-size: 0.92em; color: var(--text-dim); }

.guide-body :deep(.code-block),
.guide-body :deep(.doc-code) { margin: 0 0 16px; }
</style>
