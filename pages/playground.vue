<template>
  <div class="pg-shell">
    <TheNav />
    <div class="pg-body">

      <!-- Left column: tabbed editor / assets -->
      <div class="pg-left-col" :style="{ flexBasis: splitPct + '%' }">

        <div class="pg-tab-bar">
          <div class="pg-tabs">
            <button class="pg-tab" :class="{ active: activeTab === 'gui' }" @click="activeTab = 'gui'">gui</button>
            <button class="pg-tab" :class="{ active: activeTab === 'assets' }" @click="activeTab = 'assets'">assets</button>
          </div>
          <div class="pg-tab-actions">
            <template v-if="activeTab === 'gui'">
              <span class="pg-hint" :class="{ 'pg-hint--error': !!parseError }">
                {{ parseError || 'live preview' }}
              </span>
              <label class="pg-format-btn" title="Open .gui file">
                open
                <input ref="guiFileInputEl" type="file" accept=".gui,.xml" style="display:none" @change="onGuiFileUpload" />
              </label>
              <button class="pg-format-btn" @click="formatCode" title="Format code (Shift+Alt+F)">format</button>
            </template>
            <template v-if="activeTab === 'assets'">
              <label class="pg-format-btn" title="Upload image">
                + upload
                <input ref="fileInputEl" type="file" accept="image/*" multiple style="display:none" @change="onFileUpload" />
              </label>
            </template>
          </div>
        </div>

        <div class="pg-tab-content" :class="{ hidden: activeTab !== 'gui' }">
          <div ref="editorEl" class="pg-editor-mount" />
        </div>

        <div class="pg-tab-content pg-assets-panel" :class="{ hidden: activeTab !== 'assets' }">
          <div class="pg-assets-list">
            <div v-if="!Object.keys(assets).length" class="pg-assets-empty">
              upload an image — reference it as <code>$img-1</code> in your code
            </div>
            <div
              v-for="(url, id) in assets"
              :key="id"
              class="pg-asset-item"
              :class="{ copied: copiedId === id }"
            >
              <button class="pg-asset-delete" @click="deleteAsset(String(id))" title="Remove">×</button>
              <img :src="url" class="pg-asset-thumb" @click="copyId(String(id))" :title="copiedId === id ? 'copied!' : `click to copy ${id}`" />
              <span class="pg-asset-id">{{ copiedId === id ? 'copied!' : id }}</span>
            </div>
          </div>
        </div>

      </div>

      <div class="pg-divider" @mousedown.prevent="startDrag" />

      <!-- Preview pane -->
      <div class="pg-pane pg-preview-pane" :style="{ flexBasis: (100 - splitPct) + '%' }">
        <div class="pg-pane-header">
          <span class="pg-pane-label">preview</span>
          <span class="pg-hint">scroll to zoom · drag to pan</span>
        </div>
        <div ref="previewEl" class="pg-preview" @wheel.prevent="onWheel" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { EditorView, keymap, lineNumbers, drawSelection, highlightActiveLine, dropCursor } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { xml, xmlLanguage } from '@codemirror/lang-xml'
import { linter, lintGutter, type Diagnostic } from '@codemirror/lint'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import {
  foldGutter, foldKeymap, indentOnInput,
  syntaxHighlighting, HighlightStyle, syntaxTree,
} from '@codemirror/language'
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap, startCompletion, type CompletionContext, type CompletionResult } from '@codemirror/autocomplete'
import { tags } from '@lezer/highlight'
import { normalizeBooleanAttrs, render } from 'gui-render'
import xmlFormat from 'xml-formatter'
import { unzip } from 'fflate'

definePageMeta({ ssr: false })

// ─── sample ───────────────────────────────────────────────────────────────────

const SAMPLE = `<gui version="0.2" name="Profile">
  <tokens>
    <color name="bg"      value="#0f172a" />
    <color name="surface" value="#1e293b" />
    <color name="primary" value="#6366f1" />
    <color name="green"   value="#22c55e" />
    <color name="text"    value="#f8fafc" />
    <color name="muted"   value="#94a3b8" />
    <number name="r"      value="14" />
  </tokens>
  <fonts>
    <font family="Inter" source="google"
          weights="400 500 600 700" styles="normal" />
  </fonts>

  <col fill="$bg" p="24" gap="20" w="390">

    <!-- header card -->
    <row fill="$surface" radius="$r" p="20" gap="16" align="middle-left">
      <ellipse w="52" h="52" fill="$primary" />
      <col gap="4" w="fill">
        <text value="Alex Chen"
              font-family="Inter" font-size="16" font-weight="700"
              fill="$text" />
        <text value="Product Designer · San Francisco"
              font-family="Inter" font-size="12" fill="$muted" />
      </col>
      <rect fill="$primary" radius="8" w="72" h="32" />
    </row>

    <!-- stats row -->
    <row gap="12">
      <col fill="$surface" radius="$r" p="16" gap="4" align="top-center" w="fill">
        <text value="248" font-family="Inter" font-size="20"
              font-weight="700" fill="$text" />
        <text value="projects" font-family="Inter"
              font-size="11" fill="$muted" />
      </col>
      <col fill="$surface" radius="$r" p="16" gap="4" align="top-center" w="fill">
        <text value="12k" font-family="Inter" font-size="20"
              font-weight="700" fill="$green" />
        <text value="followers" font-family="Inter"
              font-size="11" fill="$muted" />
      </col>
      <col fill="$surface" radius="$r" p="16" gap="4" align="top-center" w="fill">
        <text value="99%" font-family="Inter" font-size="20"
              font-weight="700" fill="$text" />
        <text value="rating" font-family="Inter"
              font-size="11" fill="$muted" />
      </col>
    </row>

  </col>
</gui>`

// ─── .gui schema for completions ──────────────────────────────────────────────

const SHARED_VISUAL = [
  { name: 'opacity' }, { name: 'blend', values: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity', 'linear-burn', 'linear-dodge'] },
  { name: 'mask' }, { name: 'rotation' },
  { name: 'constraint-h', values: ['left', 'right', 'center', 'scale', 'stretch'] },
  { name: 'constraint-v', values: ['top', 'bottom', 'center', 'scale', 'stretch'] },
  { name: 'abs' },
  { name: 'min-width' }, { name: 'max-width' },
  { name: 'min-height' }, { name: 'max-height' },
]

const SHARED_LAYOUT = [
  { name: 'id' }, { name: 'name' },
  { name: 'w' }, { name: 'h' }, { name: 'x' }, { name: 'y' },
  { name: 'fill' }, { name: 'fill-style' }, { name: 'effect-style' },
  { name: 'radius' }, { name: 'corner-smoothing' }, { name: 'shadow' },
  { name: 'border' },
  { name: 'border-color' }, { name: 'border-width' },
  { name: 'border-style', values: ['solid', 'dashed', 'dotted'] },
  { name: 'border-align', values: ['inside', 'center', 'outside'] },
  { name: 'border-top' }, { name: 'border-right' },
  { name: 'border-bottom' }, { name: 'border-left' },
  { name: 'clip' },
  ...SHARED_VISUAL,
]

const ALIGN_VALUES = [
  'top-left', 'top-center', 'top-right',
  'middle-left', 'middle-center', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right',
  'stretch', 'baseline',
]

const STACK_LAYOUT_ATTRS = [
  { name: 'gap' }, { name: 'p' }, { name: 'pt' }, { name: 'pr' }, { name: 'pb' }, { name: 'pl' },
  { name: 'align', values: ALIGN_VALUES },
  { name: 'wrap' },
  { name: 'reverse-z' },
]

const GUI_ELEMENTS = [
  {
    name: 'gui',
    attrs: [
      { name: 'version', values: ['0.2'] },
      { name: 'name' },
    ],
  },
  { name: 'tokens', children: ['color', 'number', 'string'] },
  { name: 'color', selfClosing: true, attrs: [{ name: 'name' }, { name: 'value' }] },
  { name: 'number', selfClosing: true, attrs: [{ name: 'name' }, { name: 'value' }] },
  { name: 'string', selfClosing: true, attrs: [{ name: 'name' }, { name: 'value' }] },
  {
    name: 'fonts',
    children: ['font'],
  },
  {
    name: 'font',
    selfClosing: true,
    attrs: [
      { name: 'family' },
      { name: 'source', values: ['google', 'system', 'unresolved'] },
      { name: 'weights' },
      { name: 'styles', values: ['normal', 'italic'] },
      { name: 'category', values: ['sans-serif', 'serif', 'monospace', 'handwriting'] },
      { name: 'variants' },
    ],
  },
  { name: 'assets', children: ['image'] },
  {
    name: 'image',
    selfClosing: true,
    attrs: [{ name: 'id' }, { name: 'format', values: ['webp', 'png', 'jpg', 'svg'] }, { name: 'src' }],
  },
  { name: 'styles', children: ['text-style', 'fill-style', 'effect-style'] },
  { name: 'components', children: ['component', 'component-set'] },
  {
    name: 'component',
    attrs: [{ name: 'name' }, { name: 'id' }],
    children: ['props', 'frame', 'stack', 'row', 'col', 'grid'],
  },
  {
    name: 'component-set',
    attrs: [{ name: 'name' }, { name: 'id' }],
    children: ['variant'],
  },
  {
    name: 'variant',
    attrs: [{ name: 'id' }],
    children: ['props', 'frame', 'stack', 'row', 'col', 'grid'],
  },
  { name: 'props', children: ['prop'] },
  {
    name: 'prop',
    selfClosing: true,
    attrs: [{ name: 'name' }, { name: 'type', values: ['text', 'visible', 'image', 'src', 'fill'] }, { name: 'target' }],
  },
  {
    name: 'text-style',
    selfClosing: true,
    attrs: [
      { name: 'name' }, { name: 'font-family' }, { name: 'font-size' }, { name: 'font-weight' },
      { name: 'font-style', values: ['normal', 'italic'] }, { name: 'line-height' },
      { name: 'letter-spacing' },
      { name: 'decoration', values: ['underline', 'strikethrough'] },
      { name: 'text-case', values: ['uppercase', 'lowercase', 'capitalize', 'small-caps', 'small-caps-forced'] },
    ],
  },
  {
    name: 'fill-style',
    selfClosing: true,
    attrs: [{ name: 'name' }, { name: 'value' }],
  },
  {
    name: 'effect-style',
    attrs: [{ name: 'name' }],
  },
  {
    name: 'stack',
    attrs: [
      { name: 'direction', values: ['horizontal', 'vertical', 'grid'] },
      ...STACK_LAYOUT_ATTRS,
      { name: 'grid-columns' }, { name: 'grid-rows' },
      { name: 'grid-col-gap' }, { name: 'grid-row-gap' },
      ...SHARED_LAYOUT,
    ],
  },
  {
    name: 'row',
    attrs: [
      ...STACK_LAYOUT_ATTRS,
      ...SHARED_LAYOUT,
    ],
  },
  {
    name: 'col',
    attrs: [
      ...STACK_LAYOUT_ATTRS,
      ...SHARED_LAYOUT,
    ],
  },
  {
    name: 'grid',
    attrs: [
      { name: 'cols' }, { name: 'rows' },
      { name: 'unit' },
      { name: 'gap' }, { name: 'col-gap' }, { name: 'row-gap' },
      { name: 'p' }, { name: 'pt' }, { name: 'pr' }, { name: 'pb' }, { name: 'pl' },
      { name: 'align', values: ALIGN_VALUES },
      { name: 'gc' }, { name: 'gr' },
      { name: 'col-span' }, { name: 'row-span' },
      ...SHARED_LAYOUT,
    ],
  },
  {
    name: 'frame',
    attrs: [...SHARED_LAYOUT],
  },
  {
    name: 'group',
    attrs: [
      { name: 'id' }, { name: 'name' },
      { name: 'x' }, { name: 'y' }, { name: 'w' }, { name: 'h' },
      { name: 'mask-src' }, { name: 'mask-x' }, { name: 'mask-y' },
      { name: 'mask-width' }, { name: 'mask-height' },
      ...SHARED_VISUAL,
    ],
  },
  {
    name: 'text',
    selfClosing: true,
    attrs: [
      { name: 'value' },
      { name: 'font-family' }, { name: 'font-size' }, { name: 'font-weight' },
      { name: 'font-style', values: ['normal', 'italic'] },
      { name: 'font-variation' }, { name: 'font-feature' },
      { name: 'line-height' }, { name: 'letter-spacing' },
      { name: 'baseline-shift' },
      { name: 'paragraph-spacing' }, { name: 'paragraph-indent' },
      { name: 'align', values: ['left', 'center', 'right', 'justified'] },
      { name: 'vertical-align', values: ['top', 'center', 'bottom'] },
      { name: 'decoration', values: ['underline', 'strikethrough'] },
      { name: 'decoration-color' }, { name: 'decoration-style', values: ['solid', 'dashed', 'dotted', 'wavy', 'double'] },
      { name: 'decoration-thickness' },
      { name: 'text-case', values: ['uppercase', 'lowercase', 'capitalize', 'small-caps', 'small-caps-forced'] },
      { name: 'leading-trim', values: ['cap-height', 'normal'] },
      { name: 'text-resize', values: ['hug', 'hug-height', 'fixed', 'truncate'] },
      { name: 'truncate' }, { name: 'max-lines' },
      { name: 'overflow', values: ['clip', 'ellipsis'] },
      { name: 'list', values: ['disc', 'decimal'] }, { name: 'list-level' }, { name: 'list-marker' },
      { name: 'href' }, { name: 'text-style' }, { name: 'fill-style' },
      ...SHARED_LAYOUT,
    ],
  },
  {
    name: 'instance',
    selfClosing: true,
    attrs: [
      { name: 'component' },
      { name: 'name' }, { name: 'x' }, { name: 'y' }, { name: 'w' }, { name: 'h' },
      ...SHARED_VISUAL,
    ],
  },
  {
    name: 'rect',
    selfClosing: true,
    attrs: [
      { name: 'radius' },
      ...SHARED_LAYOUT,
    ],
    children: ['appearance'],
  },
  {
    name: 'ellipse',
    selfClosing: true,
    attrs: [
      { name: 'arc-start' }, { name: 'arc-end' }, { name: 'arc-inner' },
      ...SHARED_LAYOUT,
    ],
    children: ['appearance'],
  },
  {
    name: 'line',
    selfClosing: true,
    attrs: [
      { name: 'direction', values: ['horizontal', 'vertical'] },
      { name: 'thickness' },
      ...SHARED_LAYOUT,
    ],
  },
  {
    name: 'img',
    selfClosing: true,
    attrs: [
      { name: 'src' },
      { name: 'fit', values: ['cover', 'contain', 'fill', 'none'] },
      ...SHARED_LAYOUT,
    ],
  },
  {
    name: 'appearance',
    children: ['fill', 'effect'],
  },
  {
    name: 'fill',
    selfClosing: true,
    attrs: [
      { name: 'type', values: ['color', 'linear-gradient', 'radial-gradient', 'angular-gradient', 'image'] },
      { name: 'value' }, { name: 'src' },
      { name: 'fit', values: ['cover', 'contain', 'crop', 'tile'] },
      { name: 'x' }, { name: 'y' }, { name: 'w' }, { name: 'h' },
      { name: 'opacity' },
    ],
  },
  {
    name: 'effect',
    selfClosing: true,
    attrs: [
      { name: 'type', values: ['drop-shadow', 'inner-shadow', 'layer-blur', 'background-blur', 'glass'] },
      { name: 'x' }, { name: 'y' }, { name: 'radius' }, { name: 'spread' }, { name: 'color' },
      { name: 'blend' }, { name: 'saturation' },
    ],
  },
  {
    name: 'segment',
    selfClosing: true,
    attrs: [
      { name: 'value' }, { name: 'font-family' }, { name: 'font-size' },
      { name: 'font-weight' }, { name: 'font-style', values: ['normal', 'italic'] },
      { name: 'font-variation' }, { name: 'font-feature' },
      { name: 'fill' }, { name: 'line-height' }, { name: 'letter-spacing' },
      { name: 'baseline-shift' },
      { name: 'decoration', values: ['underline', 'strikethrough'] },
      { name: 'decoration-color' }, { name: 'decoration-style', values: ['solid', 'dashed', 'dotted', 'wavy', 'double'] },
      { name: 'decoration-thickness' },
      { name: 'text-case', values: ['uppercase', 'lowercase', 'capitalize', 'small-caps'] },
      { name: 'list', values: ['disc', 'decimal'] }, { name: 'list-level' }, { name: 'list-marker' },
      { name: 'href' },
    ],
  },
  {
    name: 'preview',
    selfClosing: true,
    attrs: [{ name: 'format', values: ['webp', 'png'] }, { name: 'src' }],
  },
  { name: 'meta' },
]

// ─── attribute name completion ────────────────────────────────────────────────

function guiAttrNameCompletion(ctx: CompletionContext): CompletionResult | null {
  const word = ctx.matchBefore(/[\w-]*/)
  if (!ctx.explicit && !word?.text) return null

  const tree = syntaxTree(ctx.state)

  // Must not be inside an AttributeValue
  let check = tree.resolveInner(ctx.pos, -1)
  while (check && check.name !== 'AttributeValue' && check.name !== 'Document') check = check.parent!
  if (check?.name === 'AttributeValue') return null

  // Walk up to OpenTag / SelfClosingTag
  let tagNode = tree.resolveInner(ctx.pos, -1)
  while (tagNode && tagNode.name !== 'OpenTag' && tagNode.name !== 'SelfClosingTag' && tagNode.name !== 'Document') {
    tagNode = tagNode.parent!
  }
  if (!tagNode || (tagNode.name !== 'OpenTag' && tagNode.name !== 'SelfClosingTag')) return null

  const tagNameNode = tagNode.getChild('TagName')
  if (!tagNameNode) return null
  const tagName = ctx.state.doc.sliceString(tagNameNode.from, tagNameNode.to)

  const elSpec = GUI_ELEMENTS.find(e => e.name === tagName)
  if (!elSpec || !elSpec.attrs?.length) return null

  // Attrs already present in this tag
  const usedAttrs = new Set(
    tagNode.getChildren('Attribute')
      .map(a => a.getChild('AttributeName'))
      .filter(Boolean)
      .map(n => ctx.state.doc.sliceString(n!.from, n!.to))
  )

  const from = word ? word.from : ctx.pos

  const options = elSpec.attrs
    .filter(a => !usedAttrs.has(a.name))
    .map(a => ({
      label: a.name,
      type: 'property' as const,
      apply(view: EditorView, _completion: any, f: number, to: number) {
        const insert = BARE_COMPLETION_ATTRS.has(a.name) ? a.name : `${a.name}=""`
        view.dispatch({
          changes: { from: f, to, insert },
          selection: { anchor: f + insert.length },
        })
        if (!BARE_COMPLETION_ATTRS.has(a.name)) setTimeout(() => startCompletion(view), 0)
      },
    }))

  if (!options.length) return null
  return { from, options, validFor: /^[\w-]*$/ }
}

// ─── attribute value completion ──────────────────────────────────────────────

// Attributes that also accept $token references
const TOKEN_ATTRS = new Set([
  'fill', 'color', 'stroke', 'radius', 'font-family',
  'font-size', 'font-weight', 'gap', 'p', 'pt', 'pr', 'pb', 'pl', 'w', 'h',
])

const PRESENCE_ATTRS = new Set(['mask', 'clip', 'abs', 'wrap', 'reverse-z', 'truncate', 'gap'])
const BARE_COMPLETION_ATTRS = new Set(['mask', 'clip', 'abs', 'wrap', 'reverse-z', 'truncate'])

function guiAttrValueCompletion(ctx: CompletionContext): CompletionResult | null {
  const tree = syntaxTree(ctx.state)
  let valNode = tree.resolveInner(ctx.pos, -1)

  while (valNode && valNode.name !== 'AttributeValue') {
    valNode = valNode.parent!
  }
  if (!valNode) return null

  const attrNode = valNode.parent
  if (!attrNode || attrNode.name !== 'Attribute') return null

  const attrNameNode = attrNode.getChild('AttributeName')
  if (!attrNameNode) return null
  const attrName = ctx.state.doc.sliceString(attrNameNode.from, attrNameNode.to)

  const tagNode = attrNode.parent
  if (!tagNode) return null
  const tagNameNode = tagNode.getChild('TagName')
  if (!tagNameNode) return null
  const tagName = ctx.state.doc.sliceString(tagNameNode.from, tagNameNode.to)

  const elSpec = GUI_ELEMENTS.find(e => e.name === tagName)
  const attrSpec = elSpec?.attrs?.find(a => a.name === attrName)

  const from = valNode.from + 1
  const to = valNode.to > ctx.pos ? valNode.to - 1 : ctx.pos

  // Snapshot of the doc for preview rendering
  const baseCode = ctx.state.doc.toString()

  function makeInfo(label: string) {
    return () => {
      const wrap = document.createElement('div')
      wrap.style.cssText = [
        'width:220px;height:200px',
        'position:relative;overflow:hidden',
        'background:#0c0c0c',
        'border-left:1px solid var(--border)',
        'pointer-events:none',
        'background-image:radial-gradient(circle,#1a1a1a 1px,transparent 1px)',
        'background-size:20px 20px',
      ].join(';')

      // Replace current attribute value with the hovered option
      const previewCode = baseCode.slice(0, from) + label + baseCode.slice(to)
      // Defer until CodeMirror adds the element to the DOM
      setTimeout(() => render(previewCode, wrap), 0)
      return wrap
    }
  }

  const options: { label: string; type: string; detail?: string; info?: () => HTMLElement }[] = []

  if (attrSpec && 'values' in attrSpec && Array.isArray(attrSpec.values)) {
    for (const v of attrSpec.values) {
      options.push({ label: v, type: 'constant', info: makeInfo(v) })
    }
  }

  if (TOKEN_ATTRS.has(attrName)) {
    const tokens = collectTokens(baseCode)
    for (const t of tokens) {
      options.push({ label: `$${t}`, type: 'variable', detail: 'token', info: makeInfo(`$${t}`) })
    }
  }

  if (attrName === 'src') {
    for (const id of Object.keys(assets.value)) {
      options.push({ label: id, type: 'variable', detail: 'asset', info: makeInfo(id) })
    }
  }

  if (!options.length) return null

  return { from, to, options, validFor: /^[$a-z0-9._-]*$/ }
}

// ─── .gui linter ──────────────────────────────────────────────────────────────

const VALID_ELEMENTS = new Set(GUI_ELEMENTS.map(e => e.name))
const ATTRS_BY_ELEMENT = new Map(GUI_ELEMENTS.map(e => [e.name, new Set((e.attrs || []).map(a => a.name))]))

const ENUM_ATTRS: Record<string, Record<string, Set<string>>> = {}
for (const element of GUI_ELEMENTS) {
  const enumAttrs: Record<string, Set<string>> = {}
  for (const attr of element.attrs || []) {
    if ('values' in attr && Array.isArray(attr.values)) {
      enumAttrs[attr.name] = new Set(attr.values)
    }
  }
  if (Object.keys(enumAttrs).length) ENUM_ATTRS[element.name] = enumAttrs
}

const LAYOUT_TAGS = new Set(['frame', 'stack', 'row', 'col', 'grid', 'group', 'instance'])
const CONTENT_TAGS = new Set(['text', 'img', 'rect', 'ellipse', 'line'])
const CHILD_TAGS = new Set([...LAYOUT_TAGS, ...CONTENT_TAGS])
const TOKEN_REF_ATTRS = new Set(['fill', 'border-color', 'radius', 'font-family', 'font-size', 'font-weight', 'gap', 'p', 'pt', 'pr', 'pb', 'pl', 'w', 'h'])
const ASSET_REF_ATTRS = new Set(['src', 'mask-src'])
type ParsedAttr = {
  name: string
  value: string | null
  nameFrom: number
  nameTo: number
  valueFrom: number
  valueTo: number
}

function collectDefinitions(code: string) {
  const tokens = new Set<string>()
  const tokenRe = /<(?:color|number|string)\s[^>]*name="([^"]+)"/g
  let m
  while ((m = tokenRe.exec(code)) !== null) tokens.add(m[1])
  return { tokens }
}

function collectTokens(code: string): Set<string> {
  const defs = collectDefinitions(code)
  return defs.tokens
}

function hasAttr(node: any, doc: any, name: string): boolean {
  return parseTagAttrs(node, doc).some(attr => attr.name === name)
}

function attrValue(node: any, doc: any, name: string): string | null {
  return parseTagAttrs(node, doc).find(attr => attr.name === name)?.value ?? null
}

function parseTagAttrs(node: any, doc: any): ParsedAttr[] {
  const tagNameNode = node.getChild('TagName')
  if (!tagNameNode) return []

  const raw = doc.sliceString(node.from, node.to)
  const tagOffset = node.from
  const tagNameEnd = tagNameNode.to - tagOffset
  const attrs: ParsedAttr[] = []
  let i = tagNameEnd

  while (i < raw.length) {
    while (i < raw.length && /\s/.test(raw[i])) i++
    if (i >= raw.length || raw[i] === '>' || raw[i] === '/') break

    const nameStart = i
    while (i < raw.length && /[^\s=/>]/.test(raw[i])) i++
    const nameEnd = i
    const name = raw.slice(nameStart, nameEnd)
    if (!name) break

    while (i < raw.length && /\s/.test(raw[i])) i++

    let value: string | null = null
    let valueFrom = tagOffset + nameEnd
    let valueTo = tagOffset + nameEnd

    if (raw[i] === '=') {
      i++
      while (i < raw.length && /\s/.test(raw[i])) i++
      const quote = raw[i]
      if (quote === '"' || quote === "'") {
        i++
        const valueStart = i
        while (i < raw.length && raw[i] !== quote) i++
        value = raw.slice(valueStart, i)
        valueFrom = tagOffset + valueStart
        valueTo = tagOffset + i
        if (raw[i] === quote) i++
      } else {
        const valueStart = i
        while (i < raw.length && /[^\s/>]/.test(raw[i])) i++
        value = raw.slice(valueStart, i)
        valueFrom = tagOffset + valueStart
        valueTo = tagOffset + i
      }
    }

    attrs.push({
      name,
      value,
      nameFrom: tagOffset + nameStart,
      nameTo: tagOffset + nameEnd,
      valueFrom,
      valueTo,
    })
  }

  return attrs
}

function childTagNames(tagNode: any, doc: any): string[] {
  const elementNode = tagNode.name === 'OpenTag' ? tagNode.parent : tagNode
  if (!elementNode) return []

  const names: string[] = []
  const raw = doc.sliceString(elementNode.from, elementNode.to)
  const tagRe = /<([A-Za-z][\w-]*)\b/g
  let match
  while ((match = tagRe.exec(raw)) !== null) {
    names.push(match[1])
  }
  const ownTag = elementNode.getChild('OpenTag')?.getChild('TagName') || elementNode.getChild('TagName')
  if (ownTag && names[0] === doc.sliceString(ownTag.from, ownTag.to)) names.shift()
  return names
}

function isInsideInlineSvg(node: any, doc: any): boolean {
  let current = node.parent
  while (current) {
    const tagNode = current.getChild('OpenTag')?.getChild('TagName') || current.getChild('TagName')
    if (tagNode && doc.sliceString(tagNode.from, tagNode.to) === 'svg') return true
    current = current.parent
  }
  return false
}

function guiLintFn(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = []
  const code = view.state.doc.toString()
  const { tokens: definedTokens } = collectDefinitions(code)
  // playground-uploaded assets are stored in assets.value as { '$img-1': blobUrl, ... }
  const definedAssets = new Set(Object.keys(assets.value).map(id => id.replace(/^\$/, '')))
  const doc = view.state.doc

  syntaxTree(view.state).iterate({
    enter(node) {
      const isTag = node.name === 'OpenTag' || node.name === 'SelfClosingTag'
      if (!isTag) return

      const tagNameNode = node.node.getChild('TagName')
      if (!tagNameNode) return
      const tagName = doc.sliceString(tagNameNode.from, tagNameNode.to)
      const insideInlineSvg = tagName !== 'svg' && isInsideInlineSvg(node.node, doc)
      if (insideInlineSvg) return

      // unknown element
      if (!VALID_ELEMENTS.has(tagName)) {
        diagnostics.push({
          from: tagNameNode.from,
          to: tagNameNode.to,
          severity: 'error',
          message: `Unknown element <${tagName}>. Valid elements: ${[...VALID_ELEMENTS].join(', ')}.`,
        })
        return false
      }

      const allowedAttrs = ATTRS_BY_ELEMENT.get(tagName)

      // check each attribute
      for (const attr of parseTagAttrs(node.node, doc)) {
        const attrName = attr.name

        if (allowedAttrs && !allowedAttrs.has(attrName) && tagName !== 'instance' && tagName !== 'variant') {
          diagnostics.push({
            from: attr.nameFrom,
            to: attr.nameTo,
            severity: 'warning',
            message: `"${attrName}" is not a known attribute for <${tagName}>.`,
          })
        }

        if (attr.value === null) {
          if (!PRESENCE_ATTRS.has(attrName)) {
            diagnostics.push({
              from: attr.nameFrom,
              to: attr.nameTo,
              severity: 'error',
              message: `"${attrName}" needs a value. Only presence attributes can be written without one.`,
            })
          }
          continue
        }

        const attrVal = attr.value

        // enum validation
        const enumMap = ENUM_ATTRS[tagName]
        if (enumMap && enumMap[attrName] && !enumMap[attrName].has(attrVal)) {
          diagnostics.push({
            from: attr.valueFrom,
            to: attr.valueTo,
            severity: 'error',
            message: `"${attrVal}" is not valid for ${tagName}[${attrName}]. Expected: ${[...enumMap[attrName]].join(' | ')}.`,
          })
        }

        // undefined token / asset references ($name, not inside gradient/function calls)
        if (attrVal.startsWith('$') && !attrVal.includes('(')) {
          const refName = attrVal.slice(1)
          const expectsAsset = ASSET_REF_ATTRS.has(attrName)
          const expectsToken = TOKEN_REF_ATTRS.has(attrName) || !expectsAsset
          if (expectsAsset && !definedAssets.has(refName)) {
            diagnostics.push({
              from: attr.valueFrom,
              to: attr.valueTo,
              severity: 'warning',
              message: `Asset "$${refName}" is not uploaded. Add it via the Assets tab.`,
            })
          } else if (expectsToken && !definedTokens.has(refName)) {
            diagnostics.push({
              from: attr.valueFrom,
              to: attr.valueTo,
              severity: 'warning',
              message: `Token "$${refName}" is not defined in <tokens>.`,
            })
          }
        }
      }

      // missing required attributes
      if (tagName === 'gui') {
        const names = parseTagAttrs(node.node, doc).map(attr => attr.name)
        if (!names.includes('version')) {
          diagnostics.push({
            from: tagNameNode.from,
            to: tagNameNode.to,
            severity: 'warning',
            message: '<gui> is missing the required version attribute.',
          })
        }
      }

      const childTags = childTagNames(node.node, doc)
      if (tagName === 'gui') {
        const hasRootNode = childTags.some(t => CHILD_TAGS.has(t))
        if (!hasRootNode) {
          diagnostics.push({
            from: tagNameNode.from,
            to: tagNameNode.to,
            severity: 'error',
            message: '<gui> must contain a root layout node.',
          })
        }
      } else if (tagName === 'stack' && attrValue(node.node, doc, 'direction') === 'grid') {
        diagnostics.push({
          from: tagNameNode.from,
          to: tagNameNode.to,
          severity: 'warning',
          message: 'Prefer <grid> over <stack direction="grid"> — the <grid> tag is cleaner and supports cols/rows/unit.',
        })
      } else if (tagName === 'frame' || tagName === 'img' || tagName === 'svg' || tagName === 'group') {
        if (!hasAttr(node.node, doc, 'w')) {
          diagnostics.push({
            from: tagNameNode.from,
            to: tagNameNode.to,
            severity: 'warning',
            message: `<${tagName}> should specify w.`,
          })
        }
        if (!hasAttr(node.node, doc, 'h')) {
          diagnostics.push({
            from: tagNameNode.from,
            to: tagNameNode.to,
            severity: 'warning',
            message: `<${tagName}> should specify h.`,
          })
        }
      } else if (tagName === 'text') {
        const hasValue = hasAttr(node.node, doc, 'value')
        const hasSegments = childTags.includes('segment')
        if (!hasValue && !hasSegments) {
          diagnostics.push({
            from: tagNameNode.from,
            to: tagNameNode.to,
            severity: 'error',
            message: '<text> must have either a value attribute or <segment> children.',
          })
        } else if (hasValue && hasSegments) {
          diagnostics.push({
            from: tagNameNode.from,
            to: tagNameNode.to,
            severity: 'error',
            message: '<text> must not have both a value attribute and <segment> children.',
          })
        }
      } else if (tagName === 'rect' || tagName === 'ellipse') {
        if (!hasAttr(node.node, doc, 'w')) {
          diagnostics.push({
            from: tagNameNode.from,
            to: tagNameNode.to,
            severity: 'warning',
            message: '<' + tagName + '> should specify w.',
          })
        }
        if (!hasAttr(node.node, doc, 'h')) {
          diagnostics.push({
            from: tagNameNode.from,
            to: tagNameNode.to,
            severity: 'warning',
            message: '<' + tagName + '> should specify h.',
          })
        }
      } else if (tagName === 'line') {
        if (!hasAttr(node.node, doc, 'fill')) {
          diagnostics.push({
            from: tagNameNode.from,
            to: tagNameNode.to,
            severity: 'warning',
            message: '<line> should specify fill.',
          })
        }
      }
    },
  })

  return diagnostics
}

// ─── CodeMirror theme ─────────────────────────────────────────────────────────

const guiHighlight = HighlightStyle.define([
  { tag: tags.tagName, color: '#6ea8fe' },
  { tag: tags.attributeName, color: '#79c0ff' },
  { tag: tags.attributeValue, color: '#a5d6ff' },
  { tag: tags.string, color: '#a8d8a8' },
  { tag: tags.comment, color: '#484f58', fontStyle: 'italic' },
  { tag: tags.angleBracket, color: '#4a4a5a' },
  { tag: tags.operator, color: '#4a4a5a' },
  { tag: tags.punctuation, color: '#4a4a5a' },
  { tag: tags.meta, color: '#666' },
])

const guiTheme = EditorView.theme({
  '&': {
    background: 'var(--bg)',
    color: '#aaa',
    height: '100%',
    fontSize: '12.5px',
  },
  '.cm-scroller': {
    fontFamily: '"Berkeley Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace',
    lineHeight: '1.75',
    overflow: 'auto',
  },
  '.cm-content': {
    padding: '16px 0',
    caretColor: '#6366f1',
  },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#6366f1', borderLeftWidth: '2px' },
  '.cm-selectionBackground': { background: 'rgba(99,102,241,0.18)' },
  '&.cm-focused .cm-selectionBackground': { background: 'rgba(99,102,241,0.25)' },
  '.cm-activeLine': { background: 'rgba(255,255,255,0.025)' },
  '.cm-activeLineGutter': { background: 'rgba(255,255,255,0.025)' },
  '.cm-gutters': {
    background: 'var(--bg)',
    borderRight: '1px solid var(--border-subtle)',
    color: 'var(--text-dim)',
  },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 12px 0 8px', minWidth: '36px' },
  '.cm-foldGutter .cm-gutterElement': {
    color: 'var(--text-dim)',
    cursor: 'pointer',
    padding: '0 4px',
  },
  '.cm-foldGutter .cm-gutterElement:hover': { color: 'var(--text-muted)' },
  '.cm-lintGutter': { width: '16px' },
  '.cm-lintGutter .cm-gutterElement': { padding: '0 2px' },

  // lint underlines
  '.cm-lintRange-error': { backgroundImage: 'none', textDecoration: 'underline 2px #f87171' },
  '.cm-lintRange-warning': { backgroundImage: 'none', textDecoration: 'underline 1.5px #fb923c' },

  // tooltip / autocomplete
  '.cm-tooltip': {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  '.cm-tooltip-autocomplete > ul': { fontFamily: '"Berkeley Mono", ui-monospace, monospace', fontSize: '12px' },
  '.cm-tooltip-autocomplete > ul > li': { padding: '4px 12px', color: '#aaa' },
  '.cm-tooltip-autocomplete > ul > li[aria-selected]': { background: '#1e1e2e', color: '#e8e8e8' },
  '.cm-completionLabel': { color: '#79c0ff' },
  '.cm-completionDetail': { color: '#484f58', fontStyle: 'italic', marginLeft: '8px' },

  // lint panel
  '.cm-diagnostic': { padding: '4px 8px', fontSize: '12px', fontFamily: 'var(--sans)', lineHeight: '1.5' },
  '.cm-diagnostic-error': { borderLeft: '2px solid #f87171' },
  '.cm-diagnostic-warning': { borderLeft: '2px solid #fb923c' },
  '.cm-diagnosticText': { color: '#e8e8e8' },

  // fold placeholder
  '.cm-foldPlaceholder': {
    background: 'var(--border)',
    border: '1px solid var(--border)',
    borderRadius: '3px',
    color: 'var(--text-dim)',
    padding: '0 6px',
  },
}, { dark: true })

// ─── editor setup ─────────────────────────────────────────────────────────────

const activeTab = ref<'gui' | 'assets'>('gui')

const editorEl = ref<HTMLElement | null>(null)
const previewEl = ref<HTMLElement | null>(null)
const fileInputEl = ref<HTMLInputElement | null>(null)
const guiFileInputEl = ref<HTMLInputElement | null>(null)
const parseError = ref('')
const assets = ref<Record<string, string>>({})
const copiedId = ref('')
let assetCounter = 0
let setZoom: ((f: number, ax?: number, ay?: number) => void) | null = null
let zoomFactor = 1
let editorView: EditorView | null = null
let lastAttrValFrom = -1

// ─── inspect hover ────────────────────────────────────────────────────────────

let previewNodes: HTMLElement[] = []
let highlightedEl: HTMLElement | null = null

// OpenTag/SelfClosingTag start position → DFS node index
// Keyed by the exact character offset of '<' in the source, so it's immune to
// attribute value content, multi-line tags, and reformatting.
let nodePosMap: Map<number, number> = new Map()

const GUI_NODE_TAGS = new Set(['frame', 'stack', 'row', 'col', 'grid', 'group', 'text', 'img', 'rect', 'ellipse', 'line', 'instance'])

// Walk the syntax tree in document order (= DFS pre-order) and map each GUI
// element's opening-tag start position to the index it will occupy in
// previewEl.querySelectorAll('.gui-node').
function buildNodePosMap(view: EditorView) {
  const map: Map<number, number> = new Map()
  const state = view.state
  let idx = 0
  syntaxTree(state).iterate({
    enter(nodeRef) {
      if (nodeRef.name !== 'OpenTag' && nodeRef.name !== 'SelfClosingTag') return
      const tn = nodeRef.node.getChild('TagName')
      if (!tn) return
      if (GUI_NODE_TAGS.has(state.doc.sliceString(tn.from, tn.to))) {
        map.set(nodeRef.from, idx++)
      }
    },
  })
  nodePosMap = map
}

function setInspectHighlight(idx: number) {
  if (highlightedEl) { highlightedEl.style.boxShadow = ''; highlightedEl = null }
  if (idx >= 0 && previewNodes[idx]) {
    highlightedEl = previewNodes[idx]
    highlightedEl.style.boxShadow = 'inset 0 0 0 2px #0d99ff'
  }
}

function clearInspectHighlight() {
  setInspectHighlight(-1)
}

const splitPct = ref(65)

function startDrag(e: MouseEvent) {
  const bodyEl = (e.currentTarget as HTMLElement).parentElement!
  const startX = e.clientX
  const startPct = splitPct.value

  function onMove(ev: MouseEvent) {
    const dx = ev.clientX - startX
    const totalW = bodyEl.clientWidth
    splitPct.value = Math.min(80, Math.max(20, startPct + (dx / totalW) * 100))
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function loadGuiCode(code: string) {
  if (!editorView) return
  editorView.dispatch({
    changes: { from: 0, to: editorView.state.doc.length, insert: code },
  })
}

function mimeForExt(ext: string): string {
  if (ext === 'svg') return 'image/svg+xml'
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  return `image/${ext}`
}

function onGuiFileUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  ;(e.target as HTMLInputElement).value = ''

  const reader = new FileReader()
  reader.onload = async ev => {
    const bytes = new Uint8Array(ev.target!.result as ArrayBuffer)

    // Detect ZIP by magic bytes PK (0x50 0x4B)
    const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b

    if (!isZip) {
      // Plain .guix — read as text
      loadGuiCode(new TextDecoder().decode(bytes))
      return
    }

    // .gui package — unzip and extract design.guix + assets
    unzip(bytes, (err, data) => {
      if (err) return

      // Find design.guix
      const guixEntry = Object.entries(data).find(([name]) => name.endsWith('.guix'))
      if (!guixEntry) return
      const code = new TextDecoder().decode(guixEntry[1])
      loadGuiCode(code)

      // Parse <assets> block to get id → src path mappings
      const doc = new DOMParser().parseFromString(normalizeBooleanAttrs(code), 'text/xml')
      const idToPath: Record<string, string> = {}
      for (const img of Array.from(doc.querySelectorAll('assets > image'))) {
        const id = img.getAttribute('id')
        const src = img.getAttribute('src')
        if (id && src) idToPath['$' + id] = src
      }

      // Build assetMap from ZIP entries
      const newAssets: Record<string, string> = {}
      for (const [name, fileBytes] of Object.entries(data)) {
        if (name.endsWith('.guix') || name === 'preview.webp') continue
        // Match by path or by filename
        const assetId = Object.keys(idToPath).find(
          id => idToPath[id] === name || idToPath[id].endsWith('/' + name.split('/').pop())
        )
        if (!assetId) continue
        const ext = name.split('.').pop() || 'png'
        const blob = new Blob([fileBytes], { type: mimeForExt(ext) })
        newAssets[assetId] = URL.createObjectURL(blob)
      }

      if (Object.keys(newAssets).length) {
        assets.value = { ...assets.value, ...newAssets }
      }
    })
  }
  reader.readAsArrayBuffer(file)
}

function onFileUpload(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (const file of Array.from(files)) {
    const reader = new FileReader()
    reader.onload = ev => {
      const id = `$img-${++assetCounter}`
      assets.value[id] = ev.target!.result as string
      runRender(editorView?.state.doc.toString() ?? '')
    }
    reader.readAsDataURL(file)
  }
  // reset so same file can be re-uploaded
  ;(e.target as HTMLInputElement).value = ''
}

let copyTimer: ReturnType<typeof setTimeout> | null = null
function copyId(id: string) {
  navigator.clipboard.writeText(id)
  copiedId.value = id
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => { copiedId.value = '' }, 1500)
}

function deleteAsset(id: string) {
  const map = { ...assets.value }
  delete map[id]
  assets.value = map
}

function runRender(code: string) {
  if (!previewEl.value) return
  clearInspectHighlight()
  const result = render(code, previewEl.value, assets.value, { zoom: true })
  if (result) {
    setZoom = result
    zoomFactor = 1
    parseError.value = ''
  } else {
    parseError.value = 'parse error'
  }
  previewNodes = Array.from(previewEl.value.querySelectorAll('.gui-node')) as HTMLElement[]
  if (editorView) buildNodePosMap(editorView)
}

// watch assets changes and re-render
watch(assets, () => runRender(editorView?.state.doc.toString() ?? ''), { deep: true })

let debounceTimer: ReturnType<typeof setTimeout> | null = null
function onCodeChange(code: string) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => runRender(code), 280)
}

function formatCode() {
  if (!editorView) return
  const code = editorView.state.doc.toString()
  try {
    const formatted = xmlFormat(code, {
      indentation: '  ',
      collapseContent: true,
      lineSeparator: '\n',
      whiteSpaceAtEndOfSelfclosingTag: true,
    })
    editorView.dispatch({
      changes: { from: 0, to: editorView.state.doc.length, insert: formatted },
    })
  } catch {
    // leave as-is if XML is unparseable
  }
}

onMounted(() => {
  if (!editorEl.value) return

  editorView = new EditorView({
    state: EditorState.create({
      doc: SAMPLE,
      extensions: [
        lineNumbers(),
        lintGutter(),
        foldGutter(),
        history(),
        drawSelection(),
        dropCursor(),
        indentOnInput(),
        highlightActiveLine(),
        xml({ elements: GUI_ELEMENTS }),
        xmlLanguage.data.of({ autocomplete: guiAttrNameCompletion }),
        xmlLanguage.data.of({ autocomplete: guiAttrValueCompletion }),
        closeBrackets(),
        autocompletion({ activateOnTyping: true }),
        linter(guiLintFn, { delay: 400 }),
        syntaxHighlighting(guiHighlight),
        guiTheme,
        keymap.of([
          { key: 'Shift-Alt-f', run: () => { formatCode(); return true } },
          indentWithTab,
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
        ]),
        EditorView.domEventHandlers({
          mousemove(event, view) {
            // Lazily build on first hover (syntax tree ready by then)
            if (nodePosMap.size === 0) buildNodePosMap(view)
            const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
            if (pos === null) { clearInspectHighlight(); return }
            // Walk up the syntax tree from the cursor to find the enclosing tag
            let node = syntaxTree(view.state).resolveInner(pos, -1)
            while (node.parent && node.name !== 'OpenTag' && node.name !== 'SelfClosingTag') {
              node = node.parent
            }
            if (node.name !== 'OpenTag' && node.name !== 'SelfClosingTag') {
              clearInspectHighlight(); return
            }
            const idx = nodePosMap.get(node.from)
            setInspectHighlight(idx !== undefined ? idx : -1)
          },
          mouseleave(_event, _view) {
            clearInspectHighlight()
          },
        }),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            onCodeChange(update.state.doc.toString())
            buildNodePosMap(update.view)
          }

          if (!update.selectionSet && !update.docChanged) return
          const pos = update.state.selection.main.head

          // Find which AttributeValue node (if any) the cursor is now inside
          let node = syntaxTree(update.state).resolveInner(pos, -1)
          while (node && node.name !== 'AttributeValue') node = node.parent!
          const currentFrom = node?.name === 'AttributeValue' ? node.from : -1

          // "" or '' — the value content is empty (node is just the two quote chars)
          const isEmpty = node?.name === 'AttributeValue' && (node.to - node.from) <= 2

          if (currentFrom !== -1) {
            // cursor is inside an AttributeValue
            if (currentFrom !== lastAttrValFrom || isEmpty) {
              lastAttrValFrom = currentFrom
              startCompletion(update.view)
            }
          } else {
            lastAttrValFrom = -1

            // always trigger attribute name completions when cursor is anywhere in a tag body
            let tagNode = syntaxTree(update.state).resolveInner(pos, -1)
            while (
              tagNode &&
              tagNode.name !== 'OpenTag' &&
              tagNode.name !== 'SelfClosingTag' &&
              tagNode.name !== 'Document'
            ) tagNode = tagNode.parent!

            if (tagNode?.name === 'OpenTag' || tagNode?.name === 'SelfClosingTag') {
              startCompletion(update.view)
            }
          }
        }),
      ],
    }),
    parent: editorEl.value,
  })

  runRender(SAMPLE)
})

onBeforeUnmount(() => {
  editorView?.destroy()
})

function onWheel(e: WheelEvent) {
  if (!setZoom || !previewEl.value) return
  const delta = e.deltaY > 0 ? -0.15 : 0.15
  zoomFactor = Math.max(0.25, Math.min(4, zoomFactor + delta))
  const rect = previewEl.value.getBoundingClientRect()
  setZoom(zoomFactor, e.clientX - rect.left, e.clientY - rect.top)
}
</script>

<style scoped>
.pg-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
}

.pg-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.pg-divider {
  position: relative;
  width: 1px;
  background: var(--border);
  flex-shrink: 0;
  cursor: col-resize;
  z-index: 10;
}

.pg-divider::after {
  content: '';
  position: absolute;
  inset: 0 -4px;
}

.pg-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.pg-left-col {
  flex: 0 0 65%;
  min-width: 20%;
  max-width: 80%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pg-preview-pane {
  flex: 0 0 35%;
  min-width: 20%;
  max-width: 80%;
}

/* ─── tab bar ─── */
.pg-tab-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  padding: 0 16px 0 0;
}

.pg-tabs {
  display: flex;
}

.pg-tab {
  font-size: 11px;
  font-family: var(--mono);
  color: var(--text-dim);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 10px 16px;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: color 150ms ease, border-color 150ms ease;
  margin-bottom: -1px;
}

.pg-tab:hover { color: var(--text); }

.pg-tab.active {
  color: var(--text);
  border-bottom-color: var(--text);
}

.pg-tab-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* preview pane header (reused for right side) */
.pg-pane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.pg-pane-label {
  font-size: 11px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* ─── tab content ─── */
.pg-tab-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pg-tab-content.hidden { display: none; }

.pg-hint {
  font-size: 11px;
  color: var(--text-dim);
  font-family: var(--sans);
  transition: color 180ms ease;
}

.pg-hint--error {
  color: #f87171;
}

.pg-format-btn {
  font-size: 11px;
  font-family: var(--mono);
  color: var(--text-dim);
  background: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease;
  letter-spacing: 0.04em;
}

.pg-format-btn:hover {
  color: var(--text);
  border-color: var(--text-dim);
}

.pg-editor-mount {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* make CodeMirror fill the pane */
.pg-editor-mount :deep(.cm-editor) {
  height: 100%;
}
.pg-editor-mount :deep(.cm-scroller) {
  flex: 1;
  min-height: 0;
}

.pg-preview {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #0c0c0c;
  background-image: radial-gradient(circle, #1a1a1a 1px, transparent 1px);
  background-size: 20px 20px;
}

/* ─── assets panel ─── */
.pg-assets-panel {
  overflow-y: auto;
}

.pg-assets-list {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 10px;
  padding: 16px;
}

.pg-assets-empty {
  font-size: 12px;
  color: var(--text-dim);
  font-family: var(--sans);
}

.pg-assets-empty code {
  font-size: 11px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 1px 5px;
  color: var(--text-muted);
}

.pg-asset-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px;
  transition: border-color 150ms ease;
  flex-shrink: 0;
}

.pg-asset-item:hover {
  border-color: var(--text-dim);
}

.pg-asset-item.copied {
  border-color: #6366f1;
}

.pg-asset-delete {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text-dim);
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: opacity 120ms ease, color 120ms ease;
  padding: 0;
}

.pg-asset-item:hover .pg-asset-delete {
  opacity: 1;
}

.pg-asset-delete:hover {
  color: #f87171;
  border-color: #f87171;
}

.pg-asset-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 3px;
  display: block;
  cursor: pointer;
}

.pg-asset-id {
  font-size: 10px;
  color: var(--text-dim);
  font-family: var(--mono);
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pg-asset-item.copied .pg-asset-id {
  color: #6366f1;
}
</style>
