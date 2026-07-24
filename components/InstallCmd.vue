<template>
  <div class="install-cmd">
    <div class="mgr-tabs" role="tablist">
      <button
        v-for="m in managers"
        :key="m"
        class="mgr-tab"
        :class="{ active: mgr === m }"
        role="tab"
        :aria-selected="mgr === m"
        @click="mgr = m"
      >{{ m }}</button>
    </div>
    <div class="cmd-row">
      <code class="cmd">{{ command }}</code>
      <button class="copy" :aria-label="copied ? 'Copied' : 'Copy command'" @click="copy">
        {{ copied ? 'copied' : 'copy' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  pkg: string
  global?: boolean
  dev?: boolean
}>()

const managers = ['npm', 'bun'] as const
const mgr = ref<'npm' | 'bun'>('npm')
const copied = ref(false)

const command = computed(() => {
  const g = props.global ? ' -g' : ''
  const d = props.dev ? ' -D' : ''
  return mgr.value === 'npm'
    ? `npm install${g}${d} ${props.pkg}`
    : `bun add${g}${d} ${props.pkg}`
})

async function copy() {
  try {
    await navigator.clipboard.writeText(command.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1400)
  } catch {}
}
</script>

<style scoped>
.install-cmd { display: inline-flex; flex-direction: column; gap: 8px; }

.mgr-tabs { display: inline-flex; gap: 4px; }
.mgr-tab {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  padding: 3px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--hairline);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 120ms var(--ease-out), background 120ms var(--ease-out), border-color 120ms var(--ease-out);
}
.mgr-tab:hover { color: var(--text); }
.mgr-tab.active {
  background: var(--ink);
  color: var(--on-primary);
  border-color: var(--ink);
}

.cmd-row {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  background: var(--surface-card);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-sm);
  padding: 9px 12px 9px 15px;
}
.cmd {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--ink);
  white-space: nowrap;
}
.cmd::before { content: '$ '; color: var(--muted-soft); }
.copy {
  font-size: 10.5px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  transition: color 120ms var(--ease-out);
}
.copy:hover { color: var(--ink); }
</style>
