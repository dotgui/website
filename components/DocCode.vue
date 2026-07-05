<template>
  <div class="doc-code">
    <p v-if="label" class="doc-code-label">{{ label }}</p>
    <div class="doc-code-body">
      <pre class="example-pre" v-html="rendered"></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hlCode } from '~/lib/spec-highlight'

const props = defineProps<{
  code: string
  lang?: string
  label?: string
}>()

const rendered = computed(() => hlCode(props.code, props.lang))
</script>

<style scoped>
.doc-code { margin: 0; }
.doc-code-label {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  margin: 0 0 8px;
}
.doc-code-body {
  background: var(--surface-card);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-md);
  padding: 16px 18px;
  overflow-x: auto;
}
.example-pre {
  font-family: var(--mono);
  font-size: 12.5px;
  line-height: 1.7;
  color: #55534c;
  white-space: pre;
  margin: 0;
  font-variant-ligatures: none;   /* no === → ≡ */
}

/* spec light-surface palette */
:deep(.tok-tag)     { color: #2b6be4; }
:deep(.tok-attr)    { color: #b7471d; }
:deep(.tok-val)     { color: #1f7a43; }
:deep(.tok-punct)   { color: #9a988e; }
:deep(.tok-comment) { color: #98978a; font-style: italic; }
</style>
