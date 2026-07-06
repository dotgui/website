<template>
  <section id="inspect">
    <div data-reveal>
      <div class="section-label">Inspect</div>
      <h2>Code meets canvas</h2>
      <p>
        Hover any element tag in the source — watch it light up in the preview.
        The same connection browser DevTools gives you between the DOM panel and the page.
      </p>
    </div>

    <div class="inspect-shell" data-reveal>
      <!-- Code panel -->
      <div class="inspect-code-panel">
        <div class="inspect-code-header">
          <span class="inspect-filename">profile.gui</span>
          <span class="inspect-lang">GUI</span>
        </div>
        <div class="inspect-lines">
          <div
            v-for="(line, i) in annotatedLines"
            :key="i"
            class="inspect-line"
            :class="{
              'is-node': line.nodeIdx >= 0,
              'is-active': line.nodeIdx >= 0 && line.nodeIdx === hoveredIdx,
            }"
            @mouseenter="onEnter(line.nodeIdx)"
            @mouseleave="onLeave()"
          >
            <span class="inspect-ln">{{ i + 1 }}</span>
            <span v-html="line.html" />
          </div>
        </div>
      </div>

      <!-- Preview panel -->
      <div class="inspect-preview-panel">
        <div ref="previewEl" class="inspect-preview" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { render } from '@dotgui/kit/render'

const previewEl = ref<HTMLElement | null>(null)
const hoveredIdx = ref(-1)
let previewNodes: HTMLElement[] = []
let highlightedEl: HTMLElement | null = null

// ── .gui sample ──────────────────────────────────────────────────────

const SAMPLE = `<gui version="0.2">
  <tokens>
    <color name="bg"      value="#0f172a" />
    <color name="surface" value="#1e293b" />
    <color name="accent"  value="#6366f1" />
    <color name="text"    value="#f8fafc" />
    <color name="muted"   value="#94a3b8" />
  </tokens>
  <fonts>
    <font family="Inter" source="google" weights="400 500 700" />
  </fonts>

  <col fill="$bg" w="260" p="20" gap="14">

    <row fill="$surface" radius="12" p="16" gap="12" align="middle-left">
      <ellipse w="44" h="44" fill="$accent" />
      <col gap="3" w="fill">
        <text value="Alex Chen" font-family="Inter"
              font-size="14" font-weight="700" fill="$text" />
        <text value="Product Designer" font-family="Inter"
              font-size="12" fill="$muted" />
      </col>
    </row>

    <row gap="8">
      <col fill="$surface" radius="10" p="14" gap="2"
           align="middle-center" w="fill">
        <text value="248" font-family="Inter"
              font-size="18" font-weight="700" fill="$text" />
        <text value="projects" font-family="Inter"
              font-size="11" fill="$muted" />
      </col>
      <col fill="$surface" radius="10" p="14" gap="2"
           align="middle-center" w="fill">
        <text value="12k" font-family="Inter"
              font-size="18" font-weight="700" fill="$accent" />
        <text value="followers" font-family="Inter"
              font-size="11" fill="$muted" />
      </col>
    </row>

    <rect fill="$accent" radius="8" w="fill" h="36" />

  </col>
</gui>`

// ── XML syntax highlighter ───────────────────────────────────────────

function highlightLine(raw: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const out: string[] = []
  let i = 0
  const c = () => raw[i]
  const peek = (n: number) => raw.slice(i, i + n)

  while (i < raw.length) {
    if (peek(4) === '<!--') {
      const end = raw.indexOf('-->', i)
      const text = end === -1 ? raw.slice(i) : raw.slice(i, end + 3)
      out.push(`<span class="tok-comment">${esc(text)}</span>`)
      i += text.length
      continue
    }
    if (c() === '<') {
      out.push('<span class="tok-punct">&lt;</span>')
      i++
      if (c() === '/') { out.push('<span class="tok-punct">/</span>'); i++ }
      let name = ''
      while (i < raw.length && /[\w-]/.test(c())) { name += c(); i++ }
      if (name) out.push(`<span class="tok-tag">${esc(name)}</span>`)
      continue
    }
    if (peek(2) === '/>') {
      out.push('<span class="tok-punct">/&gt;</span>')
      i += 2
      continue
    }
    if (c() === '>') {
      out.push('<span class="tok-punct">&gt;</span>')
      i++
      continue
    }
    if (c() === '"') {
      let val = ''
      i++
      while (i < raw.length && c() !== '"') { val += c(); i++ }
      i++
      out.push(`<span class="tok-val">&quot;${esc(val)}&quot;</span>`)
      continue
    }
    if (/[a-zA-Z]/.test(c())) {
      let name = ''
      while (i < raw.length && /[\w-]/.test(c())) { name += c(); i++ }
      out.push(raw[i] === '=' ? `<span class="tok-attr">${esc(name)}</span>` : esc(name))
      continue
    }
    if (c() === '=') {
      out.push('<span class="tok-punct">=</span>')
      i++
      continue
    }
    out.push(esc(c()))
    i++
  }
  return out.join('')
}

// ── Line annotation ──────────────────────────────────────────────────

const NODE_TAG_RE = /^<(frame|stack|row|col|grid|group|text|img|rect|ellipse|line)\b/

const annotatedLines = computed(() => {
  const lines = SAMPLE.split('\n')
  let nodeIdx = 0
  let inTag = false
  let tagNodeIdx = -1

  return lines.map(line => {
    const trimmed = line.trim()
    let lineNodeIdx = -1

    if (!inTag) {
      if (NODE_TAG_RE.test(trimmed)) {
        lineNodeIdx = nodeIdx++
        if (!trimmed.includes('>')) {
          inTag = true
          tagNodeIdx = lineNodeIdx
        }
      }
    } else {
      lineNodeIdx = tagNodeIdx
      if (trimmed.includes('>')) {
        inTag = false
        tagNodeIdx = -1
      }
    }

    return { html: highlightLine(line), nodeIdx: lineNodeIdx }
  })
})

// ── Hover ────────────────────────────────────────────────────────────

function onEnter(idx: number) {
  if (highlightedEl) {
    highlightedEl.style.boxShadow = ''
    highlightedEl = null
  }
  hoveredIdx.value = idx
  if (idx >= 0 && previewNodes[idx]) {
    highlightedEl = previewNodes[idx]
    highlightedEl.style.boxShadow = 'inset 0 0 0 2px #0d99ff'
  }
}

function onLeave() {
  if (highlightedEl) {
    highlightedEl.style.boxShadow = ''
    highlightedEl = null
  }
  hoveredIdx.value = -1
}

// ── Mount ────────────────────────────────────────────────────────────

onMounted(() => {
  if (!previewEl.value) return
  render(SAMPLE, previewEl.value)
  previewNodes = Array.from(previewEl.value.querySelectorAll('.gui-node')) as HTMLElement[]
})
</script>

<style scoped>
.inspect-shell {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  margin-top: 32px;
  height: 360px;
}

.inspect-code-panel {
  flex: 0 0 58%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
  overflow: hidden;
}

.inspect-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
}

.inspect-filename {
  font-size: 12px;
  color: var(--text-dim);
}

.inspect-lang {
  font-size: 11px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.inspect-lines {
  overflow-y: auto;
  flex: 1;
  background: var(--surface);
}

/* legible on the light cream surface */
.inspect-lines :deep(.tok-tag)     { color: #2b6be4; }
.inspect-lines :deep(.tok-attr)    { color: #b7471d; }
.inspect-lines :deep(.tok-val)     { color: #1f7a43; }
.inspect-lines :deep(.tok-punct)   { color: #9a988e; }
.inspect-lines :deep(.tok-comment) { color: #98978a; font-style: italic; }

.inspect-line {
  display: flex;
  align-items: baseline;
  line-height: 1.75;
  font-size: 12px;
  font-family: var(--mono);
  white-space: pre;
  transition: background 60ms ease;
}

.inspect-line.is-node {
  cursor: default;
}

.inspect-line.is-node:hover,
.inspect-line.is-active {
  background: rgba(13, 153, 255, 0.08);
}

.inspect-ln {
  width: 36px;
  padding: 0 12px 0 8px;
  text-align: right;
  flex-shrink: 0;
  color: var(--text-dim);
  user-select: none;
  font-size: 11px;
}

.inspect-preview-panel {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #0c0c0c;
  background-image: radial-gradient(circle, #1a1a1a 1px, transparent 1px);
  background-size: 20px 20px;
}

.inspect-preview {
  position: absolute;
  inset: 0;
}
</style>
