import Panzoom, { type PanzoomObject } from '@panzoom/panzoom'

type Ctx = { absolute: boolean; offsetX?: number; offsetY?: number; parentDirection?: 'horizontal' | 'vertical' | 'grid' }

type FontInfo = { source: string; category?: string }

let activeTokens: Record<string, string> = {}
let activeFonts: Record<string, FontInfo> = {}
let activeStyles: Record<string, Record<string, string>> = {}
let activeFillStyles: Record<string, string> = {}
let activeEffectStyles: Record<string, Element[]> = {}
let activeComponents: Map<string, Element> = new Map()

const PRESENCE_ATTR_VALUES: Record<string, string> = {
  abs: 'true',
  clip: 'true',
  gap: 'auto',
  mask: 'true',
  'reverse-z': 'true',
  truncate: 'true',
  wrap: 'true',
}

function normalizeTagPresenceAttrs(tag: string): string {
  let out = ''
  let i = 0

  while (i < tag.length) {
    const ch = tag[i]
    if (ch === '"' || ch === "'") {
      const quote = ch
      const start = i
      i++
      while (i < tag.length && tag[i] !== quote) i++
      if (i < tag.length) i++
      out += tag.slice(start, i)
      continue
    }

    const isAttrBoundary = /\s/.test(ch)
    if (!isAttrBoundary) {
      out += ch
      i++
      continue
    }

    const wsStart = i
    while (i < tag.length && /\s/.test(tag[i])) i++
    const nameStart = i
    if (!/[A-Za-z]/.test(tag[i] || '')) {
      out += tag.slice(wsStart, i + 1)
      i++
      continue
    }

    while (i < tag.length && /[\w-]/.test(tag[i])) i++
    const name = tag.slice(nameStart, i)
    const afterName = tag[i]
    const value = PRESENCE_ATTR_VALUES[name]

    if (value && (/\s/.test(afterName || '') || afterName === '/' || afterName === '>')) {
      out += `${tag.slice(wsStart, nameStart)}${name}="${value}"`
    } else {
      out += tag.slice(wsStart, i)
    }
  }

  return out
}

export function normalizeBooleanAttrs(code: string): string {
  let out = ''
  let i = 0

  while (i < code.length) {
    const tagStart = code.indexOf('<', i)
    if (tagStart === -1) {
      out += code.slice(i)
      break
    }

    out += code.slice(i, tagStart)

    if (code.startsWith('<!--', tagStart)) {
      const commentEnd = code.indexOf('-->', tagStart + 4)
      const end = commentEnd === -1 ? code.length : commentEnd + 3
      out += code.slice(tagStart, end)
      i = end
      continue
    }

    let tagEnd = tagStart + 1
    let quote: string | null = null
    while (tagEnd < code.length) {
      const ch = code[tagEnd]
      if (quote) {
        if (ch === quote) quote = null
      } else if (ch === '"' || ch === "'") {
        quote = ch
      } else if (ch === '>') {
        break
      }
      tagEnd++
    }

    const end = tagEnd < code.length ? tagEnd + 1 : code.length
    const tag = code.slice(tagStart, end)
    if (/^<\/|^<\?|^<!/.test(tag)) {
      out += tag
    } else {
      out += normalizeTagPresenceAttrs(tag)
    }
    i = end
  }

  return out
}

function resolveToken(v: string | null): string | null {
  if (!v || v.indexOf('$') === -1) return v
  return v.replace(/\$([A-Za-z0-9_.-]+)/g, (match, name) => activeTokens[name] ?? match)
}

function resolveSrc(src: string | null, assets: Record<string, string>): string | null {
  if (!src) return null
  if (assets[src]) return assets[src]
  if (src.startsWith('https://') || src.startsWith('http://')) return src
  return null
}

function get(el: Element, attr: string): string | null {
  return resolveToken(el.getAttribute(attr))
}

function getRaw(el: Element, attr: string): string | null {
  return el.getAttribute(attr)
}

function px(v: string | null): string {
  if (!v) return 'auto'
  if (v === 'fill') return '100%'
  if (v === 'hug') return 'fit-content'
  return `${v}px`
}

function hexToRgba(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const a = (parseInt(hex.slice(6, 8), 16) / 255).toFixed(3)
  return `rgba(${r},${g},${b},${a})`
}

function col(v: string | null): string {
  if (!v) return 'transparent'
  // Normalise any 8-digit hex stops inside gradient strings for broad CSS compat
  if (v.startsWith('linear-gradient') || v.startsWith('radial-gradient') || v.startsWith('conic-gradient')) {
    return v.replace(/#([0-9a-fA-F]{8})\b/g, (_, h) => hexToRgba(h))
  }
  if (v.length === 9 && v[0] === '#') return hexToRgba(v.slice(1))
  return v
}

// SVG fill/stroke attrs don't support CSS gradients — extract first stop colour
function colSolid(v: string | null): string {
  if (!v) return 'none'
  if (v.startsWith('linear-gradient') || v.startsWith('radial-gradient') || v.startsWith('conic-gradient')) {
    const m = v.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{6,8}/)
    return m ? col(m[0]) : 'none'
  }
  return col(v)
}

function radii(v: string | null): string {
  if (!v) return '0'
  return v.split(' ').map(n => `${n}px`).join(' ')
}

function pad(v: string | null): string {
  if (!v) return '0'
  return v.split(' ').map(n => `${n}px`).join(' ')
}

function shadow(v: string | null): string | null {
  if (!v) return null
  const p = v.split(' ')
  if (p.length >= 5) return `${p[0]}px ${p[1]}px ${p[2]}px ${p[3]}px ${col(p[4])}`
  return null
}

function lineHeight(v: string): string {
  if (v.includes('%')) return v
  const n = parseFloat(v)
  if (Number.isFinite(n) && n > 0 && n <= 4) return String(n)
  return `${v}px`
}

function cssString(v: string): string {
  return `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function genericFontFallback(font: FontInfo | undefined, family: string): string {
  if (font?.source === 'system') return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  if (font?.category === 'serif') return 'serif'
  if (font?.category === 'monospace' || /mono|code|console/i.test(family)) return 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
  if (font?.category === 'handwriting') return 'cursive'
  return 'sans-serif'
}

function fontStack(family: string): string {
  return `${cssString(family)}, ${genericFontFallback(activeFonts[family], family)}`
}

const VERT_MAP: Record<string, string> = { top: 'flex-start', middle: 'center', bottom: 'flex-end' }
const HORIZ_MAP: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' }

/**
 * Apply 9-point align + gap to a flex stack container.
 * Returns negative gap value if present (needs margin treatment), else null.
 */
function applyStackLayout(
  div: HTMLElement,
  direction: 'horizontal' | 'vertical',
  gapRaw: string | null,
  alignVal: string | null,
): number | null {
  // Parse gap: null=unset, "auto"=space-between, "16"=fixed, "16 10"=main+cross
  let mainGap: string | null = null
  let crossGap: string | null = null
  if (gapRaw !== null) {
    const parts = (gapRaw === '' ? 'auto' : gapRaw).trim().split(/\s+/)
    mainGap = parts[0]
    crossGap = parts[1] || null
  }

  // Apply 9-point align
  if (alignVal === 'stretch') {
    div.style.alignItems = 'stretch'
  } else if (alignVal === 'baseline') {
    div.style.alignItems = 'baseline'
  } else if (alignVal) {
    const ap = alignVal.split('-')
    const vertPart = VERT_MAP[ap[0]] || 'flex-start'
    const horizPart = HORIZ_MAP[ap[1]] || 'flex-start'
    if (direction === 'horizontal') {
      div.style.alignItems = vertPart
      if (mainGap !== 'auto') div.style.justifyContent = horizPart
    } else {
      if (mainGap !== 'auto') div.style.justifyContent = vertPart
      div.style.alignItems = horizPart
    }
  }

  // Apply main-axis gap
  let negativeGap: number | null = null
  if (mainGap === 'auto') {
    div.style.justifyContent = 'space-between'
  } else if (mainGap !== null) {
    const gv = parseFloat(mainGap)
    if (Number.isFinite(gv) && gv < 0) {
      negativeGap = gv
    } else if (Number.isFinite(gv)) {
      if (direction === 'horizontal') div.style.columnGap = `${gv}px`
      else div.style.rowGap = `${gv}px`
    }
  }

  // Apply cross-axis gap (wrap only, but set unconditionally — only matters when wrapping)
  if (crossGap !== null) {
    if (crossGap === 'auto') {
      div.style.alignContent = 'space-between'
    } else {
      const cv = parseFloat(crossGap)
      if (Number.isFinite(cv)) {
        if (direction === 'horizontal') div.style.rowGap = `${cv}px`
        else div.style.columnGap = `${cv}px`
      }
    }
  }

  return negativeGap
}

const RENDER_UTILITIES = `
.gui-node { box-sizing: border-box; }
.gui-relative { position: relative; }
.gui-absolute { position: absolute; left: var(--gui-x, 0px); top: var(--gui-y, 0px); }
.gui-sizing-h-fixed { width: var(--gui-width, auto); flex-shrink: 0; }
.gui-sizing-h-hug { width: fit-content; flex-shrink: 0; }
.gui-parent-horizontal.gui-sizing-h-hug { width: auto; }
.gui-sizing-h-fill { width: 100%; }
.gui-parent-horizontal.gui-sizing-h-fill {
  width: auto;
  min-width: 0;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}
.gui-sizing-v-fixed { height: var(--gui-height, auto); flex-shrink: 0; }
.gui-sizing-v-hug { height: fit-content; }
.gui-parent-vertical.gui-sizing-v-hug { height: auto; }
.gui-sizing-v-fill { height: 100%; }
.gui-parent-vertical.gui-sizing-v-fill {
  height: auto;
  min-height: 0;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}
.gui-display-flex { display: flex; }
.gui-display-grid { display: grid; }
.gui-direction-horizontal { flex-direction: row; }
.gui-direction-vertical { flex-direction: column; }
.gui-align-start { align-items: flex-start; }
.gui-align-center { align-items: center; }
.gui-align-end { align-items: flex-end; }
.gui-align-stretch { align-items: stretch; }
.gui-align-baseline { align-items: baseline; }
.gui-justify-start { justify-content: flex-start; }
.gui-justify-center { justify-content: center; }
.gui-justify-end { justify-content: flex-end; }
.gui-justify-space-between { justify-content: space-between; }
.gui-wrap { flex-wrap: wrap; }
.gui-wrap-align-start { align-content: flex-start; }
.gui-wrap-align-center { align-content: center; }
.gui-wrap-align-end { align-content: flex-end; }
.gui-wrap-align-stretch { align-content: stretch; }
.gui-wrap-align-space-between { align-content: space-between; }
.gui-fit-cover { object-fit: cover; }
.gui-fit-contain { object-fit: contain; }
.gui-fit-fill { object-fit: fill; }
.gui-fit-none { object-fit: none; }
.gui-block { display: block; }
.gui-overflow-hidden { overflow: hidden; }
.gui-overflow-visible { overflow: visible; }
.gui-pointer-events-none { pointer-events: none; }
.gui-inset-0 { inset: 0; }
.gui-z-0 { z-index: 0; }
.gui-z-1 { z-index: 1; }
.gui-z-2 { z-index: 2; }
.gui-layer { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.gui-w-full { width: 100%; }
.gui-h-full { height: 100%; }
.gui-pre-wrap { white-space: pre-wrap; }
.gui-text.gui-sizing-v-hug { height: auto; min-height: max-content; }
`

function ensureRenderUtilities(): void {
  if (typeof document === 'undefined') return
  if (document.querySelector('style[data-gui-render-utilities]')) return

  const style = document.createElement('style')
  style.setAttribute('data-gui-render-utilities', 'true')
  style.textContent = RENDER_UTILITIES
  document.head.appendChild(style)
}

function addClass(el: HTMLElement | SVGElement, name: string): void {
  el.classList.add(name)
}

let clipId = 0

function position(el: HTMLElement | SVGElement, guiEl: Element, ctx: Ctx): void {
  addClass(el, 'gui-node')
  // w/h: absent=hug, "fill"=fill, number=fixed
  const wVal = get(guiEl, 'w')
  const hVal = get(guiEl, 'h')
  const sizingH = wVal === null ? 'hug' : wVal === 'fill' ? 'fill' : 'fixed'
  const sizingV = hVal === null ? 'hug' : hVal === 'fill' ? 'fill' : 'fixed'
  el.style.setProperty('--gui-width', px(wVal))
  el.style.setProperty('--gui-height', px(hVal))

  addClass(el, `gui-sizing-h-${sizingH}`)
  addClass(el, `gui-sizing-v-${sizingV}`)
  if (ctx.parentDirection) {
    addClass(el, `gui-parent-${ctx.parentDirection}`)
  }

  const minW = get(guiEl, 'min-width')
  const maxW = get(guiEl, 'max-width')
  const minH = get(guiEl, 'min-height')
  const maxH = get(guiEl, 'max-height')
  if (minW) el.style.minWidth = `${minW}px`
  if (maxW) el.style.maxWidth = `${maxW}px`
  if (minH) el.style.minHeight = `${minH}px`
  if (maxH) el.style.maxHeight = `${maxH}px`

  const op = get(guiEl, 'opacity')
  if (op) el.style.opacity = op

  const blend = get(guiEl, 'blend')
  if (blend) el.style.mixBlendMode = blend as CSSStyleDeclaration['mixBlendMode']

  const maskVal = getRaw(guiEl, 'mask')
  if (maskVal !== null && maskVal !== 'false') el.setAttribute('data-mask', 'true')

  rotationStyle(el, guiEl)
  if (ctx.absolute) {
    const x = parseFloat(get(guiEl, 'x') || '0') - (ctx.offsetX || 0)
    const y = parseFloat(get(guiEl, 'y') || '0') - (ctx.offsetY || 0)
    addClass(el, 'gui-absolute')
    el.style.setProperty('--gui-x', `${x}px`)
    el.style.setProperty('--gui-y', `${y}px`)
  }
}

function rotationStyle(el: HTMLElement | SVGElement, guiEl: Element): void {
  const rotation = get(guiEl, 'rotation')
  if (!rotation) return

  const degrees = parseFloat(rotation)
  if (!Number.isFinite(degrees) || degrees === 0) return

  el.style.transform = `rotate(${degrees}deg)`
  el.style.transformOrigin = 'center'
  ;(el.style as CSSStyleDeclaration & { transformBox?: string }).transformBox = 'fill-box'
}

function normalizedRightAngle(el: Element): number | null {
  const rotation = get(el, 'rotation')
  const degrees = rotation ? parseFloat(rotation) : 0
  if (!Number.isFinite(degrees)) return null

  const normalized = ((degrees % 360) + 360) % 360
  const rounded = Math.round(normalized / 90) * 90
  if (Math.abs(normalized - rounded) > 0.001) return null
  return rounded % 360
}

function parseBorder(val: string): { color: string; width: number; style: string; align: string } | null {
  const ALIGN = new Set(['inside', 'outside', 'center'])
  const STYLE = new Set(['solid', 'dashed', 'dotted'])
  let color = '', width = 1, style = 'solid', align = 'center'
  for (const tok of val.trim().split(/\s+/)) {
    if (tok.startsWith('#') || tok.startsWith('$') || /^rgba?/.test(tok)) color = tok
    else if (ALIGN.has(tok)) align = tok
    else if (STYLE.has(tok)) style = tok
    else if (/^\d/.test(tok)) width = parseFloat(tok)
  }
  return color ? { color, width, style, align } : null
}

function strokeStyle(el: HTMLElement, guiEl: Element, radius?: string | null): void {
  const borderVal = get(guiEl, 'border')
  let color: string, width: number, align: string

  if (borderVal) {
    const parsed = parseBorder(borderVal)
    if (!parsed) return
    color = parsed.color
    width = parsed.width
    align = parsed.align
  } else {
    // Legacy fallback for files using stroke= / stroke-width=
    const s = get(guiEl, 'stroke')
    const sw = get(guiEl, 'stroke-width')
    if (!s || !sw) return
    color = s
    width = parseFloat(sw)
    align = get(guiEl, 'stroke-position') || 'center'
  }

  if (!Number.isFinite(width) || width <= 0) return
  const outset = align === 'outside' ? width : align === 'center' ? width / 2 : 0
  const stroke = document.createElement('div')

  stroke.style.position = 'absolute'
  addClass(stroke, 'gui-pointer-events-none')
  stroke.style.left = `${-outset}px`
  stroke.style.top = `${-outset}px`
  stroke.style.right = `${-outset}px`
  stroke.style.bottom = `${-outset}px`
  stroke.style.border = `${width}px solid ${col(color)}`
  stroke.style.boxSizing = 'border-box'
  stroke.style.zIndex = '2'
  if (radius) stroke.style.borderRadius = radius

  el.appendChild(stroke)
}

function appendBoxShadow(el: HTMLElement, value: string): void {
  el.style.boxShadow = el.style.boxShadow
    ? `${el.style.boxShadow}, ${value}`
    : value
}

function appendFilter(el: HTMLElement, prop: 'filter' | 'backdropFilter', value: string): void {
  el.style[prop] = el.style[prop] ? `${el.style[prop]} ${value}` : value
  if (prop === 'backdropFilter') {
    ;(el.style as CSSStyleDeclaration & { webkitBackdropFilter?: string }).webkitBackdropFilter = el.style[prop]
  }
}

function appearanceEl(el: Element): Element | null {
  return Array.from(el.children).find(child => child.tagName === 'appearance') || null
}

function hasAppearance(el: Element): boolean {
  return !!appearanceEl(el)
}

function hasAppearanceFill(el: Element): boolean {
  const appearance = appearanceEl(el)
  if (!appearance) return false
  return Array.from(appearance.children).some(child => child.tagName === 'fill')
}

function applyEffectElement(target: HTMLElement, effectEl: Element): void {
  const type = get(effectEl, 'type')
  const radius = get(effectEl, 'radius') || '0'

  if (type === 'drop-shadow' || type === 'inner-shadow') {
    const x = get(effectEl, 'x') || '0'
    const y = get(effectEl, 'y') || '0'
    const spread = get(effectEl, 'spread') || '0'
    const color = col(get(effectEl, 'color'))
    appendBoxShadow(target, `${type === 'inner-shadow' ? 'inset ' : ''}${x}px ${y}px ${radius}px ${spread}px ${color}`)
  } else if (type === 'layer-blur') {
    appendFilter(target, 'filter', `blur(${radius}px)`)
  } else if (type === 'background-blur' || type === 'glass') {
    const saturation = get(effectEl, 'saturation') || '180'
    appendFilter(target, 'backdropFilter', `blur(${radius}px) saturate(${saturation}%)`)
  }
}

function applyEffectStyle(target: HTMLElement, styleName: string): void {
  const effectEls = activeEffectStyles[styleName]
  if (!effectEls) return
  for (let i = 0; i < effectEls.length; i++) applyEffectElement(target, effectEls[i])
}

function renderAppearance(el: Element, target: HTMLElement, assets: Record<string, string>, radius?: string | null): void {
  const appearance = appearanceEl(el)
  if (!appearance) return

  for (const child of Array.from(appearance.children)) {
    if (child.tagName === 'effect') {
      applyEffectElement(target, child)
      continue
    }

    if (child.tagName !== 'fill') continue
    const layer = document.createElement('div')
    addClass(layer, 'gui-layer')
    if (radius) layer.style.borderRadius = radius

    const opacity = get(child, 'opacity')
    if (opacity) layer.style.opacity = opacity

    const type = get(child, 'type')
    if (type === 'image') {
      const src = get(child, 'src')
      const resolvedSrc = resolveSrc(src, assets)
      if (!resolvedSrc) continue
      if (get(child, 'fit') === 'tile') {
        layer.style.backgroundImage = `url("${resolvedSrc}")`
        layer.style.backgroundRepeat = 'repeat'
        layer.style.backgroundSize = 'auto'
        target.appendChild(layer)
        continue
      }

      const img = document.createElement('img')
      img.src = resolvedSrc
      addClass(img, 'gui-block')
      const hasCropBox = get(child, 'x') !== null
        && get(child, 'y') !== null
        && get(child, 'width') !== null
        && get(child, 'height') !== null
      if (get(child, 'fit') === 'crop' && hasCropBox) {
        addClass(layer, 'gui-overflow-hidden')
        img.style.position = 'absolute'
        img.style.left = px(get(child, 'x') || '0')
        img.style.top = px(get(child, 'y') || '0')
        img.style.width = px(get(child, 'width') || 'fill')
        img.style.height = px(get(child, 'height') || 'fill')
        addClass(img, 'gui-fit-fill')
      } else {
        addClass(img, 'gui-w-full')
        addClass(img, 'gui-h-full')
        addClass(img, `gui-fit-${get(child, 'fit') || 'cover'}`)
      }
      if (radius) img.style.borderRadius = radius
      layer.appendChild(img)
    } else {
      const value = get(child, 'value')
      if (!value) continue
      layer.style.background = col(value)
    }

    target.appendChild(layer)
  }
}

// --- node renderers ---

function renderFrame(el: Element, assets: Record<string, string>, ctx: Ctx, isStack: boolean): HTMLElement {
  const div = document.createElement('div')
  position(div, el, ctx)
  if (!ctx.absolute) addClass(div, 'gui-relative')

  const explicitAppearance = hasAppearance(el)
  const appearanceOwnsFill = hasAppearanceFill(el)

  const fillStyleName = getRaw(el, 'fill-style')
  const resolvedFill = fillStyleName ? (activeFillStyles[fillStyleName] || null) : get(el, 'fill')
  if (resolvedFill && !appearanceOwnsFill) div.style.background = col(resolvedFill)

  const r = get(el, 'radius')
  const radius = r ? radii(r) : null
  if (radius) div.style.borderRadius = radius

  const clipVal = getRaw(el, 'clip')
  if (clipVal !== null && clipVal !== 'false') addClass(div, 'gui-overflow-hidden')

  const sh = shadow(get(el, 'shadow'))
  if (sh) appendBoxShadow(div, sh)

  renderAppearance(el, div, assets, radius)

  const effectStyleName = getRaw(el, 'effect-style')
  if (effectStyleName) applyEffectStyle(div, effectStyleName)

  let stackDirection: 'horizontal' | 'vertical' | 'grid' | undefined
  let negativeGap: number | null = null
  let reverseZ = false
  if (isStack) {
    const tagName = el.tagName
    const dir = tagName === 'row' ? 'horizontal' : tagName === 'col' ? 'vertical' : tagName === 'grid' ? 'grid' : (get(el, 'direction') || 'vertical')

    // Padding: p (new) or padding (old), plus per-side overrides
    const pVal = get(el, 'p') || get(el, 'padding')
    if (pVal) div.style.padding = pad(pVal)
    const ptVal = get(el, 'pt'); if (ptVal) div.style.paddingTop = `${ptVal}px`
    const prVal = get(el, 'pr'); if (prVal) div.style.paddingRight = `${prVal}px`
    const pbVal = get(el, 'pb'); if (pbVal) div.style.paddingBottom = `${pbVal}px`
    const plVal = get(el, 'pl'); if (plVal) div.style.paddingLeft = `${plVal}px`

    if (dir === 'grid') {
      stackDirection = 'grid'
      addClass(div, 'gui-display-grid')
      const isGridTag = tagName === 'grid'
      const cols = isGridTag ? get(el, 'columns') : get(el, 'grid-columns')
      const rows = isGridTag ? get(el, 'rows') : get(el, 'grid-rows')
      const colGap = isGridTag ? get(el, 'col-gap') : get(el, 'grid-col-gap')
      const rowGap = isGridTag ? get(el, 'row-gap') : get(el, 'grid-row-gap')
      if (cols) div.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
      if (rows) div.style.gridTemplateRows = `repeat(${rows}, 1fr)`
      const gridGap = isGridTag ? get(el, 'gap') : null
      if (gridGap) {
        const parts = gridGap.trim().split(/\s+/)
        const firstGap = parts[0]
        const secondGap = parts[1] || parts[0]
        if (firstGap === 'auto') div.style.columnGap = '0px'
        else if (firstGap) div.style.columnGap = `${firstGap}px`
        if (secondGap === 'auto') div.style.rowGap = '0px'
        else if (secondGap) div.style.rowGap = `${secondGap}px`
      }
      if (colGap) div.style.columnGap = `${colGap}px`
      if (rowGap) div.style.rowGap = `${rowGap}px`
    } else {
      stackDirection = dir === 'horizontal' ? 'horizontal' : 'vertical'
      addClass(div, 'gui-display-flex')
      addClass(div, `gui-direction-${stackDirection}`)
      // reverse-z: boolean presence convention
      const rzVal = getRaw(el, 'reverse-z')
      reverseZ = rzVal !== null && rzVal !== 'false'
      // gap (new: "auto"|"16"|"16 10"|"16 auto") + 9-point align
      const gapRaw = getRaw(el, 'gap')
      const alignVal = get(el, 'align')
      negativeGap = applyStackLayout(div, stackDirection, gapRaw, alignVal)
      // wrap: boolean presence convention
      const wrapVal = getRaw(el, 'wrap')
      if (wrapVal !== null && wrapVal !== 'false') {
        addClass(div, 'gui-wrap')
      }
    }
  }

  const children = Array.from(el.children)

  function isAbsoluteChild(child: Element): boolean {
    const absVal = getRaw(child, 'abs')
    if (absVal !== null && absVal !== 'false') return true
    return getRaw(child, 'layout-position') === 'absolute'
  }

  const flowChildTotal = children.filter(child =>
    child.tagName !== 'appearance' && !(isStack && isAbsoluteChild(child))
  ).length
  let flowChildCount = 0
  let prevFlowChild: Element | null = null
  for (const child of children) {
    if (child.tagName === 'appearance') continue
    const isAbsolute = !isStack || isAbsoluteChild(child)
    const childCtx: Ctx = { absolute: isAbsolute, parentDirection: isAbsolute ? undefined : stackDirection }
    const childEl = renderNode(child, assets, childCtx)
    if (childEl) {
      if (!isAbsolute && negativeGap !== null) {
        // Later items sit on top in Figma — ensure stacking context with ascending z-index
        if (!childEl.classList.contains('gui-absolute')) addClass(childEl, 'gui-relative')
        childEl.style.zIndex = String(flowChildCount)
        if (flowChildCount > 0) {
          // Clamp: B can't go past the left/top edge of the previous sibling (Figma behaviour)
          const prevSize = prevFlowChild ? parseFloat(
            stackDirection === 'horizontal' ? (get(prevFlowChild, 'w') || '') : (get(prevFlowChild, 'h') || '')
          ) : NaN
          const clampedGap = !isNaN(prevSize) ? Math.max(negativeGap, -prevSize) : negativeGap
          if (stackDirection === 'horizontal') childEl.style.marginLeft = `${clampedGap}px`
          else if (stackDirection === 'vertical') childEl.style.marginTop = `${clampedGap}px`
        }
      }
      if (!isAbsolute && reverseZ) {
        if (!childEl.classList.contains('gui-absolute')) addClass(childEl, 'gui-relative')
        childEl.style.zIndex = String(flowChildTotal - flowChildCount - 1)
      }
      if (explicitAppearance) {
        if (!childEl.classList.contains('gui-absolute')) addClass(childEl, 'gui-relative')
        if (!reverseZ || isAbsolute) childEl.style.zIndex = '1'
      }
      div.appendChild(childEl)
      if (!isAbsolute) { flowChildCount++; prevFlowChild = child }
    }
  }

  strokeStyle(div, el, radius)

  return div
}

function renderGroup(el: Element, assets: Record<string, string>, ctx: Ctx): HTMLElement {
  const div = document.createElement('div')
  position(div, el, ctx)
  if (!ctx.absolute) addClass(div, 'gui-relative')

  const maskSrc = get(el, 'mask-src')
  if (maskSrc && assets[maskSrc]) {
    const mx = get(el, 'mask-x') || '0'
    const my = get(el, 'mask-y') || '0'
    const mw = get(el, 'mask-width') || String(get(el, 'width') || '100%')
    const mh = get(el, 'mask-height') || String(get(el, 'height') || '100%')
    const url = assets[maskSrc]
    const mask = `url("${url}")`
    div.style.webkitMaskImage = mask
    div.style.maskImage = mask
    div.style.webkitMaskSize = `${mw}px ${mh}px`
    div.style.maskSize = `${mw}px ${mh}px`
    div.style.webkitMaskPosition = `${mx}px ${my}px`
    div.style.maskPosition = `${mx}px ${my}px`
    div.style.webkitMaskRepeat = 'no-repeat'
    div.style.maskRepeat = 'no-repeat'
  }

  const childCtx: Ctx = { absolute: true }

  for (const child of Array.from(el.children)) {
    const childEl = renderNode(child, assets, childCtx)
    if (childEl) div.appendChild(childEl)
  }
  return div
}

function applyTextStyle(el: HTMLElement, guiEl: Element): void {
  const styleName = getRaw(guiEl, 'text-style')
  const namedStyle = styleName ? activeStyles[styleName] : null

  function styledAttr(name: string): string | null {
    const direct = get(guiEl, name)
    if (direct !== null) return direct
    if (namedStyle && namedStyle[name] !== undefined) return resolveToken(namedStyle[name])
    return null
  }

  const ff = styledAttr('font-family')
  const fs = styledAttr('font-size')
  const fw = styledAttr('font-weight')
  const fst = styledAttr('font-style')
  const lh = styledAttr('line-height')
  const ls = styledAttr('letter-spacing')
  const fillStyleName = getRaw(guiEl, 'fill-style')
  const c = fillStyleName ? (activeFillStyles[fillStyleName] || null) : (get(guiEl, 'fill') || get(guiEl, 'color'))
  const deco = styledAttr('decoration')
  const transform = styledAttr('text-case')
  if (ff) el.style.fontFamily = fontStack(ff)
  if (fs) el.style.fontSize = `${fs}px`
  if (fw) el.style.fontWeight = fw
  if (fst) el.style.fontStyle = fst
  if (lh) el.style.lineHeight = lineHeight(lh)
  if (ls) el.style.letterSpacing = ls.includes('%') ? ls : `${ls}px`
  if (c) el.style.color = col(c)
  if (deco === 'underline') el.style.textDecoration = 'underline'
  if (deco === 'strikethrough') el.style.textDecoration = 'line-through'
  if (transform === 'small-caps' || transform === 'small-caps-forced') {
    el.style.fontVariant = 'small-caps'
  } else if (transform) {
    el.style.textTransform = transform as 'uppercase' | 'lowercase' | 'capitalize'
  }
}

function wrapHref(child: HTMLElement, href: string | null): HTMLElement {
  if (!href) return child
  const a = document.createElement('a')
  a.href = href
  a.style.color = 'inherit'
  a.style.textDecoration = 'inherit'
  a.appendChild(child)
  return a
}

function renderText(el: Element, assets: Record<string, string>, ctx: Ctx): HTMLElement {
  const div = document.createElement('div')
  position(div, el, ctx)
  addClass(div, 'gui-text')
  addClass(div, 'gui-pre-wrap')

  const align = get(el, 'align')
  const va = get(el, 'vertical-align')
  const truncateVal = getRaw(el, 'truncate')
  const truncate = truncateVal !== null && truncateVal !== 'false'
  const maxLines = get(el, 'max-lines')
  const leadingTrim = get(el, 'leading-trim')
  const hasFixedHeight = get(el, 'h') !== null

  if (align) div.style.textAlign = align as CanvasTextAlign

  if (leadingTrim && leadingTrim !== 'none') {
    ;(div.style as any).textBoxTrim = 'both'
    ;(div.style as any).textBoxEdge = 'cap alphabetic'
  }

  renderAppearance(el, div, assets)

  // Check for <segment> children (mixed-style text)
  const segmentEls = Array.from(el.children).filter(c => c.tagName === 'segment')
  if (segmentEls.length > 0) {
    if (va && va !== 'top') {
      div.style.display = 'flex'
      div.style.alignItems = va === 'center' ? 'center' : 'flex-end'
    }
    const wrap = document.createElement('span')
    addClass(wrap, 'gui-pre-wrap')
    for (const seg of segmentEls) {
      const span = document.createElement('span')
      span.textContent = get(seg, 'value') || ''
      applyTextStyle(span, seg)
      wrap.appendChild(wrapHref(span, get(seg, 'href')))
    }
    div.appendChild(wrap)
    return div
  }

  // Single-style text
  applyTextStyle(div, el)
  const text = get(el, 'value') || ''
  const href = get(el, 'href')

  const clamp = maxLines || (truncate ? '1' : null)
  if (hasFixedHeight || clamp) addClass(div, 'gui-overflow-hidden')

  if (va && va !== 'top') {
    div.style.display = 'flex'
    div.style.alignItems = va === 'center' ? 'center' : 'flex-end'
    if (clamp) {
      const inner = document.createElement('span')
      inner.textContent = text
      inner.style.display = '-webkit-box'
      inner.style.webkitLineClamp = clamp
      ;(inner.style as any).WebkitBoxOrient = 'vertical'
      addClass(inner, 'gui-overflow-hidden')
      inner.style.width = '100%'
      div.appendChild(wrapHref(inner, href))
    } else {
      const span = document.createElement('span')
      span.textContent = text
      div.appendChild(wrapHref(span, href))
    }
  } else if (clamp) {
    div.textContent = text
    div.style.display = '-webkit-box'
    div.style.webkitLineClamp = clamp
    ;(div.style as any).WebkitBoxOrient = 'vertical'
    addClass(div, 'gui-overflow-hidden')
    if (href) {
      addClass(div, 'gui-block')
      div.textContent = ''
      const inner = document.createElement('span')
      inner.textContent = text
      inner.style.display = '-webkit-box'
      inner.style.webkitLineClamp = clamp
      ;(inner.style as any).WebkitBoxOrient = 'vertical'
      addClass(inner, 'gui-overflow-hidden')
      div.appendChild(wrapHref(inner, href))
    }
  } else if (href) {
    const span = document.createElement('span')
    span.textContent = text
    div.appendChild(wrapHref(span, href))
  } else {
    div.textContent = text
  }

  return div
}

function renderImg(el: Element, assets: Record<string, string>, ctx: Ctx): HTMLElement {
  const wrap = document.createElement('div')
  position(wrap, el, ctx)
  if (!ctx.absolute) addClass(wrap, 'gui-relative')

  const img = document.createElement('img')
  addClass(img, 'gui-block')
  img.style.width = '100%'
  img.style.height = '100%'

  const src = get(el, 'src')
  const resolvedSrc = resolveSrc(src, assets)
  if (resolvedSrc) img.src = resolvedSrc

  const fit = get(el, 'fit')
  if (fit) addClass(img, `gui-fit-${fit}`)

  const r = get(el, 'radius')
  const radius = r ? radii(r) : null
  if (radius) {
    wrap.style.borderRadius = radius
    img.style.borderRadius = radius
  }

  wrap.appendChild(img)
  strokeStyle(wrap, el, radius)

  return wrap
}

function renderSvgAsset(el: Element, assets: Record<string, string>, ctx: Ctx): HTMLElement {
  const src = get(el, 'src')
  const w = get(el, 'w') || '0'
  const h = get(el, 'h') || '0'

  if (!src) {
    // Inline SVG: create a real <svg> element and set innerHTML so children parse in SVG namespace
    const ns = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(ns, 'svg')
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h)
    position(svg, el, ctx)
    addClass(svg, 'gui-block')

    const serializer = new XMLSerializer()
    let innerSvg = ''
    const childEls = Array.from(el.children)
    for (let ci = 0; ci < childEls.length; ci++) {
      innerSvg += serializer.serializeToString(childEls[ci])
    }
    svg.innerHTML = innerSvg.replace(/\s+xmlns=""/g, '')

    return svg as unknown as HTMLElement
  }

  const img = document.createElement('img')
  position(img, el, ctx)
  addClass(img, 'gui-block')
  addClass(img, 'gui-fit-fill')
  if (assets[src]) img.src = assets[src]

  return img as unknown as HTMLElement
}

function renderEllipseArc(
  el: Element,
  ctx: Ctx,
  fill: string | null,
  stroke: string | null,
  strokeWidth: string | null,
): HTMLElement {
  const w = parseFloat(get(el, 'w') || '24')
  const h = parseFloat(get(el, 'h') || '24')
  const startDeg = parseFloat(get(el, 'arc-start') || '0')
  const endDeg = parseFloat(get(el, 'arc-end') || '360')
  const innerRatio = parseFloat(get(el, 'arc-inner') || '0')
  const sw = parseFloat(strokeWidth || '0')

  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
  position(svg, el, ctx)
  addClass(svg, 'gui-block')
  addClass(svg, 'gui-overflow-visible')

  const cx = w / 2
  const cy = h / 2
  const rx = w / 2
  const ry = h / 2
  const startRad = startDeg * Math.PI / 180
  const endRad = endDeg * Math.PI / 180
  const spanDeg = ((endDeg - startDeg) + 360) % 360 || 360
  const large = spanDeg > 180 ? 1 : 0

  const ox = (x: number, r: number) => cx + r * Math.cos(x)
  const oy = (y: number, r: number) => cy + r * Math.sin(y)

  let d: string
  if (innerRatio > 0) {
    const irx = rx * innerRatio
    const iry = ry * innerRatio
    d = [
      `M ${ox(startRad, rx)} ${oy(startRad, ry)}`,
      `A ${rx} ${ry} 0 ${large} 1 ${ox(endRad, rx)} ${oy(endRad, ry)}`,
      `L ${ox(endRad, irx)} ${oy(endRad, iry)}`,
      `A ${irx} ${iry} 0 ${large} 0 ${ox(startRad, irx)} ${oy(startRad, iry)}`,
      'Z',
    ].join(' ')
  } else {
    d = [
      `M ${cx} ${cy}`,
      `L ${ox(startRad, rx)} ${oy(startRad, ry)}`,
      `A ${rx} ${ry} 0 ${large} 1 ${ox(endRad, rx)} ${oy(endRad, ry)}`,
      'Z',
    ].join(' ')
  }

  const path = document.createElementNS(ns, 'path') as SVGPathElement
  path.setAttribute('d', d)
  path.setAttribute('fill', fill ? colSolid(fill) : 'none')
  if (stroke && sw > 0) {
    path.setAttribute('stroke', colSolid(stroke))
    path.setAttribute('stroke-width', String(sw))
  }
  svg.appendChild(path)
  return svg as unknown as HTMLElement
}

function renderRect(el: Element, assets: Record<string, string>, ctx: Ctx): HTMLElement {
  const div = document.createElement('div')
  position(div, el, ctx)
  if (!ctx.absolute) addClass(div, 'gui-relative')
  const appearanceOwnsFill = hasAppearanceFill(el)
  const fillStyleName = getRaw(el, 'fill-style')
  const resolvedFill = fillStyleName ? (activeFillStyles[fillStyleName] || null) : get(el, 'fill')
  if (resolvedFill && !appearanceOwnsFill) div.style.background = col(resolvedFill)
  const r = get(el, 'radius')
  if (r) div.style.borderRadius = radii(r)
  const sh = shadow(get(el, 'shadow'))
  if (sh) appendBoxShadow(div, sh)
  renderAppearance(el, div, assets, div.style.borderRadius || null)
  const effectStyleName = getRaw(el, 'effect-style')
  if (effectStyleName) applyEffectStyle(div, effectStyleName)
  strokeStyle(div, el, div.style.borderRadius || null)
  return div
}

function renderEllipse(el: Element, assets: Record<string, string>, ctx: Ctx): HTMLElement {
  const div = document.createElement('div')
  position(div, el, ctx)
  if (!ctx.absolute) addClass(div, 'gui-relative')
  const appearanceOwnsFill = hasAppearanceFill(el)
  const fillStyleName = getRaw(el, 'fill-style')
  const resolvedFill = fillStyleName ? (activeFillStyles[fillStyleName] || null) : get(el, 'fill')
  if (resolvedFill && !appearanceOwnsFill) div.style.background = col(resolvedFill)
  div.style.borderRadius = '50%'
  const sh = shadow(get(el, 'shadow'))
  if (sh) appendBoxShadow(div, sh)
  renderAppearance(el, div, assets, '50%')
  const effectStyleName = getRaw(el, 'effect-style')
  if (effectStyleName) applyEffectStyle(div, effectStyleName)
  strokeStyle(div, el, '50%')
  return div
}

function renderLine(el: Element, ctx: Ctx): HTMLElement {
  const div = document.createElement('div')
  position(div, el, ctx)
  if (!ctx.absolute) addClass(div, 'gui-relative')
  const direction = get(el, 'direction') || 'horizontal'
  const thickness = get(el, 'thickness') || '1'
  const fillStyleName = getRaw(el, 'fill-style')
  const resolvedFill = fillStyleName ? (activeFillStyles[fillStyleName] || null) : get(el, 'fill')
  if (direction === 'vertical') {
    div.style.width = `${thickness}px`
    div.style.alignSelf = 'stretch'
  } else {
    div.style.height = `${thickness}px`
    div.style.alignSelf = 'stretch'
  }
  if (resolvedFill) div.style.background = col(resolvedFill)
  return div
}

function renderShape(el: Element, assets: Record<string, string>, ctx: Ctx): HTMLElement {
  const type = get(el, 'type')

  if (type === 'path') return renderPath(el, ctx)

  if (type === 'ellipse') {
    const arcStart = get(el, 'arc-start')
    const arcEnd = get(el, 'arc-end')
    const arcInner = get(el, 'arc-inner')
    if (arcStart !== null || arcEnd !== null || arcInner !== null) {
      return renderEllipseArc(el, ctx, get(el, 'fill'), get(el, 'stroke'), get(el, 'stroke-width'))
    }
  }

  const div = document.createElement('div')
  position(div, el, ctx)
  if (!ctx.absolute) addClass(div, 'gui-relative')

  if (type === 'line') {
    const sw = get(el, 'stroke-width') || '1'
    const strokeCap = get(el, 'stroke-cap')
    const rotation = normalizedRightAngle(el)
    const length = get(el, 'w') || '0'

    if (rotation !== null) {
      div.style.transform = ''
      div.style.transformOrigin = ''
      if (rotation === 90 || rotation === 270) {
        div.style.width = `${sw}px`
        div.style.height = `${length}px`
      } else {
        div.style.width = `${length}px`
        div.style.height = `${sw}px`
      }
    } else {
      div.style.width = px(get(el, 'w'))
      div.style.height = `${sw}px`
    }

    div.style.background = col(get(el, 'stroke'))
    if (strokeCap === 'round') div.style.borderRadius = '9999px'
    return div
  }

  const explicitAppearance = hasAppearance(el)
  const appearanceOwnsFill = hasAppearanceFill(el)

  const fillStyleName = getRaw(el, 'fill-style')
  const resolvedFill = fillStyleName ? (activeFillStyles[fillStyleName] || null) : get(el, 'fill')
  if (resolvedFill && !appearanceOwnsFill) div.style.background = col(resolvedFill)

  const sh = shadow(get(el, 'shadow'))
  if (sh) appendBoxShadow(div, sh)

  if (type === 'ellipse') {
    div.style.borderRadius = '50%'
  } else if (type === 'rect') {
    const r = get(el, 'radius')
    if (r) div.style.borderRadius = radii(r)
  }

  renderAppearance(el, div, assets, div.style.borderRadius || null)

  const effectStyleName = getRaw(el, 'effect-style')
  if (effectStyleName) applyEffectStyle(div, effectStyleName)

  strokeStyle(div, el, div.style.borderRadius || null)

  return div
}

function renderPath(el: Element, ctx: Ctx): HTMLElement {
  const w = get(el, 'w') || '24'
  const h = get(el, 'h') || '24'
  const fill = get(el, 'fill')
  const s = get(el, 'stroke')
  const sw = get(el, 'stroke-width')
  const strokePos = get(el, 'stroke-position') || 'center'

  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
  position(svg, el, ctx)
  addClass(svg, 'gui-block')

  // Support multiple <path> children (compound paths / boolean operations)
  const pathChildren = Array.from(el.querySelectorAll('path'))
  for (const pathEl of pathChildren) {
    const d = pathEl.getAttribute('d')
    if (!d) continue

    const fillColor = fill ? colSolid(fill) : 'none'
    const strokeColor = s ? colSolid(s) : null

    if (!strokeColor || !sw || strokePos === 'center') {
      svg.appendChild(svgPath(ns, d, fillColor, strokeColor, sw))
      continue
    }

    const strokeWidth = parseFloat(sw)
    if (!Number.isFinite(strokeWidth) || strokeWidth <= 0) {
      svg.appendChild(svgPath(ns, d, fillColor, null, null))
      continue
    }

    if (strokePos === 'inside') {
      const id = `gui-clip-${++clipId}`
      const defs = document.createElementNS(ns, 'defs')
      const clip = document.createElementNS(ns, 'clipPath')
      const clipShape = svgPath(ns, d, 'black', null, null)
      clip.setAttribute('id', id)
      clip.appendChild(clipShape)
      defs.appendChild(clip)
      svg.appendChild(defs)

      const fillPath = svgPath(ns, d, fillColor, null, null)
      const strokePath = svgPath(ns, d, 'none', strokeColor, String(strokeWidth * 2))
      strokePath.setAttribute('clip-path', `url(#${id})`)
      svg.appendChild(fillPath)
      svg.appendChild(strokePath)
    } else {
      const strokePath = svgPath(ns, d, 'none', strokeColor, String(strokeWidth * 2))
      const fillPath = svgPath(ns, d, fillColor, null, null)
      svg.appendChild(strokePath)
      svg.appendChild(fillPath)
    }
  }

  return svg as unknown as HTMLElement
}

function svgPath(
  ns: string,
  d: string,
  fill: string,
  stroke: string | null,
  strokeWidth: string | null,
): SVGPathElement {
  const path = document.createElementNS(ns, 'path') as SVGPathElement
  path.setAttribute('d', d)
  path.setAttribute('fill', fill)
  if (stroke && strokeWidth) {
    path.setAttribute('stroke', stroke)
    path.setAttribute('stroke-width', strokeWidth)
  }
  return path
}

function parseComponents(gui: Element): Map<string, Element> {
  const map = new Map<string, Element>()
  for (const block of Array.from(gui.children)) {
    if (block.tagName !== 'components') continue
    for (const comp of Array.from(block.children)) {
      if (comp.tagName === 'component') {
        const id = comp.getAttribute('id')
        if (id) map.set(id, comp)
      } else if (comp.tagName === 'component-set') {
        for (const variant of Array.from(comp.children)) {
          if (variant.tagName === 'variant') {
            const id = variant.getAttribute('id')
            if (id) map.set(id, variant)
          }
        }
      }
    }
  }
  return map
}

function findById(root: Element, id: string): Element | null {
  if (root.getAttribute('id') === id) return root
  for (const child of Array.from(root.children)) {
    const found = findById(child, id)
    if (found) return found
  }
  return null
}

const INSTANCE_POSITIONAL_ATTRS = new Set([
  'component', 'name', 'x', 'y', 'w', 'h',
  'constraint-h', 'constraint-v', 'abs', 'rotation', 'opacity', 'blend',
  'min-width', 'max-width', 'min-height', 'max-height',
])

function applyPropsToBody(body: Element, instance: Element, compEl: Element): void {
  // Build prop name → type map from declared <props> block
  const propTypes: Record<string, string> = {}
  const propsEl = Array.from(compEl.children).find(c => c.tagName === 'props')
  if (propsEl) {
    for (const propEl of Array.from(propsEl.children)) {
      if (propEl.tagName !== 'prop') continue
      const propName = propEl.getAttribute('name')
      const propType = propEl.getAttribute('type')
      const propTarget = propEl.getAttribute('target')
      if (!propName || !propType || !propTarget) continue
      propTypes[propName] = propType
      const overrideVal = instance.getAttribute(propName)
      if (overrideVal === null) continue
      const targetEl = findById(body, propTarget)
      if (!targetEl) continue
      applyOverride(targetEl, propType, overrideVal)
    }
  }

  // Also apply any ad-hoc overrides — instance attrs that aren't positional/structural
  // and weren't already handled by a declared prop. Target = element with matching id.
  for (const attr of Array.from(instance.attributes)) {
    if (INSTANCE_POSITIONAL_ATTRS.has(attr.name)) continue
    if (propTypes[attr.name] !== undefined) continue  // already handled above
    const targetEl = findById(body, attr.name)
    if (!targetEl) continue
    // Infer type from element tag
    const inferredType = targetEl.tagName === 'text' ? 'text'
      : attr.value === 'false' || attr.value === 'true' ? 'visible'
      : targetEl.getAttribute('src') !== null ? 'src'
      : 'text'
    applyOverride(targetEl, inferredType, attr.value)
  }
}

function applyOverride(targetEl: Element, type: string, value: string): void {
  if (type === 'text') {
    targetEl.setAttribute('value', value)
  } else if (type === 'visible' && value === 'false') {
    targetEl.parentNode && targetEl.parentNode.removeChild(targetEl)
  } else if (type === 'image' || type === 'src') {
    targetEl.setAttribute('src', value)
  } else if (type === 'fill') {
    targetEl.setAttribute('fill', value)
  }
}

function renderInstance(el: Element, assets: Record<string, string>, ctx: Ctx): HTMLElement | null {
  const compId = get(el, 'component')
  if (!compId) return null
  const compEl = activeComponents.get(compId)
  if (!compEl) return null

  const bodyEl = Array.from(compEl.children).find(c => c.tagName !== 'props')
  if (!bodyEl) return null

  const body = bodyEl.cloneNode(true) as Element

  applyPropsToBody(body, el, compEl)

  // Override position/sizing from instance element
  for (const attr of ['x', 'y', 'w', 'h', 'constraint-h', 'constraint-v', 'abs', 'rotation', 'opacity', 'blend', 'min-width', 'max-width', 'min-height', 'max-height']) {
    const val = el.getAttribute(attr)
    if (val !== null) body.setAttribute(attr, val)
  }

  return renderNode(body, assets, ctx)
}

function renderNode(el: Element, assets: Record<string, string>, ctx: Ctx): HTMLElement | null {
  switch (el.tagName) {
    case 'frame': return renderFrame(el, assets, ctx, false)
    case 'stack':
    case 'row':
    case 'col':
    case 'grid': return renderFrame(el, assets, ctx, true)
    case 'group': return renderGroup(el, assets, ctx)
    case 'text': return renderText(el, assets, ctx)
    case 'img': return renderImg(el, assets, ctx)
    case 'rect': return renderRect(el, assets, ctx)
    case 'ellipse': return renderEllipse(el, assets, ctx)
    case 'line': return renderLine(el, ctx)
    // legacy — kept for backward compat with pre-0.3 files
    case 'svg': return renderSvgAsset(el, assets, ctx)
    case 'shape': return renderShape(el, assets, ctx)
    case 'instance': return renderInstance(el, assets, ctx)
    default: return null
  }
}

function mimeForFormat(format: string): string {
  return format === 'svg' ? 'svg+xml' : format
}

function parseAssets(gui: Element): Record<string, string> {
  const map: Record<string, string> = {}
  for (const child of Array.from(gui.children)) {
    if (child.tagName !== 'assets') continue
    for (const img of Array.from(child.children)) {
      if (img.tagName !== 'image') continue
      const id = img.getAttribute('id')
      const format = img.getAttribute('format') || 'png'
      const src = img.getAttribute('src') || ''
      if (id && src.startsWith('base64:')) {
        map['$' + id] = `data:image/${mimeForFormat(format)};base64,${src.slice(7)}`
      } else if (id && src) {
        map['$' + id] = src
      }
    }
  }
  return map
}

function parseTokens(gui: Element): Record<string, string> {
  const tokens: Record<string, string> = {}
  for (const child of Array.from(gui.children)) {
    if (child.tagName !== 'tokens') continue
    for (const token of Array.from(child.children)) {
      const name = getRaw(token, 'name')
      const value = getRaw(token, 'value')
      if (name && value !== null) tokens[name] = value
    }
  }
  return tokens
}

function parseFonts(gui: Element): Record<string, FontInfo> {
  const fonts: Record<string, FontInfo> = {}
  for (const block of Array.from(gui.children)) {
    if (block.tagName !== 'fonts') continue
    for (const font of Array.from(block.children)) {
      if (font.tagName !== 'font') continue
      const family = getRaw(font, 'family')
      const source = getRaw(font, 'source')
      if (family && source) fonts[family] = { source, category: getRaw(font, 'category') || undefined }
    }
  }
  return fonts
}

const TEXT_STYLE_ATTRS = ['font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'decoration', 'text-case']

function parseStyles(gui: Element): Record<string, Record<string, string>> {
  const styles: Record<string, Record<string, string>> = {}
  for (const child of Array.from(gui.children)) {
    if (child.tagName !== 'styles') continue
    for (const style of Array.from(child.children)) {
      if (style.tagName !== 'text-style') continue
      const name = style.getAttribute('name')
      if (!name) continue
      const entry: Record<string, string> = {}
      for (let i = 0; i < TEXT_STYLE_ATTRS.length; i++) {
        const val = style.getAttribute(TEXT_STYLE_ATTRS[i])
        if (val !== null) entry[TEXT_STYLE_ATTRS[i]] = val
      }
      styles[name] = entry
    }
  }
  return styles
}

function parseFillStyles(gui: Element): Record<string, string> {
  const result: Record<string, string> = {}
  for (const child of Array.from(gui.children)) {
    if (child.tagName !== 'styles') continue
    for (const style of Array.from(child.children)) {
      if (style.tagName !== 'fill-style') continue
      const name = style.getAttribute('name')
      const value = style.getAttribute('value')
      if (name && value !== null) result[name] = value
    }
  }
  return result
}

function parseEffectStyles(gui: Element): Record<string, Element[]> {
  const result: Record<string, Element[]> = {}
  for (const child of Array.from(gui.children)) {
    if (child.tagName !== 'styles') continue
    for (const style of Array.from(child.children)) {
      if (style.tagName !== 'effect-style') continue
      const name = style.getAttribute('name')
      if (!name) continue
      result[name] = Array.from(style.children).filter(c => c.tagName === 'effect')
    }
  }
  return result
}

function googleFamilyParam(font: Element): string | null {
  const family = font.getAttribute('family')
  if (!family) return null

  const weights = (font.getAttribute('weights') || '400')
    .split(/[\s,]+/)
    .filter(Boolean)
    .sort((a, b) => parseInt(a) - parseInt(b))
  const styles = (font.getAttribute('styles') || 'normal')
    .split(/[\s,]+/)
    .filter(Boolean)
  const variants = (font.getAttribute('variants') || '')
    .split(/[\s,]+/)
    .filter(Boolean)
  const variantSet = variants.reduce((set, variant) => {
    set[variant] = true
    return set
  }, {} as Record<string, boolean>)

  const familyName = encodeURIComponent(family).replace(/%20/g, '+')
  if (!weights.length) return familyName

  if (styles.indexOf('italic') !== -1) {
    const pairs: string[] = []
    for (const weight of weights) {
      if (!variants.length || variantSet[weight === '400' ? 'regular' : weight]) pairs.push(`0,${weight}`)
    }
    for (const weight of weights) {
      if (!variants.length || variantSet[weight === '400' ? 'italic' : `${weight}italic`]) pairs.push(`1,${weight}`)
    }
    if (!pairs.length) return familyName
    return `${familyName}:ital,wght@${pairs.join(';')}`
  }

  const validWeights = variants.length
    ? weights.filter(weight => variantSet[weight === '400' ? 'regular' : weight])
    : weights
  if (!validWeights.length) return familyName
  return `${familyName}:wght@${validWeights.join(';')}`
}

function injectFonts(gui: Element): void {
  const families: string[] = []
  for (const block of Array.from(gui.children)) {
    if (block.tagName !== 'fonts') continue
    for (const font of Array.from(block.children)) {
      if (font.tagName !== 'font' || font.getAttribute('source') !== 'google') continue
      const param = googleFamilyParam(font)
      if (param && families.indexOf(param) === -1) families.push(param)
    }
  }

  if (!families.length || typeof document === 'undefined') return

  if (!document.querySelector('link[data-gui-fonts-preconnect="google-fonts"]')) {
    const preconnect = document.createElement('link')
    preconnect.rel = 'preconnect'
    preconnect.href = 'https://fonts.gstatic.com'
    preconnect.crossOrigin = 'anonymous'
    preconnect.setAttribute('data-gui-fonts-preconnect', 'google-fonts')
    document.head.appendChild(preconnect)
  }

  const existingLinks = Array.from(document.querySelectorAll('link[data-gui-fonts]')) as HTMLLinkElement[]
  for (const family of families) {
    const href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`
    if (existingLinks.some(link => link.href === href || link.getAttribute('href') === href)) continue

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.setAttribute('data-gui-fonts', href)
    document.head.appendChild(link)
  }
}

/**
 * Render a .gui document string into a container element.
 *
 * @param code      - Full .gui XML string
 * @param container - Host element to render into (cleared on each call)
 * @param assetMap  - Optional pre-built asset map `{ '$img-1': 'data:image/webp;base64,...' }`.
 *                    When provided the `<assets>` block in the XML is ignored, which avoids
 *                    re-parsing large base64 blobs and prevents parse failures on big files.
 *
 * @returns A zoom setter `(factor: number, anchorX?: number, anchorY?: number) => void` where `1` = fit-to-container.
 *          When no anchor is passed, the preview recenters at that zoom level.
 *          Returns `null` if the document failed to parse.
 *
 * @example
 *   const setZoom = render(guiCode, el, assetMap)
 *   setZoom(2)   // 2× the fit scale
 *   setZoom(1)   // back to fit
 */
export function render(
  code: string,
  container: HTMLElement,
  assetMap?: Record<string, string>,
): ((factor: number, anchorX?: number, anchorY?: number) => void) | null {
  ensureRenderUtilities()
  container.innerHTML = ''

  let doc: Document
  try {
    const sanitized = normalizeBooleanAttrs(code).replace(/&(?!amp;|lt;|gt;|quot;|apos;|#)/g, '&amp;')
    doc = new DOMParser().parseFromString(sanitized, 'text/xml')
    if (doc.querySelector('parsererror')) throw new Error()
  } catch {
    container.innerHTML = '<div style="color:#888;padding:24px;font-size:12px">Invalid .gui</div>'
    return null
  }

  const gui = doc.documentElement
  activeTokens = parseTokens(gui)
  activeFonts = parseFonts(gui)
  activeStyles = parseStyles(gui)
  activeFillStyles = parseFillStyles(gui)
  activeEffectStyles = parseEffectStyles(gui)
  activeComponents = parseComponents(gui)
  const assets = assetMap || parseAssets(gui)
  injectFonts(gui)
  const STACK_TAGS = new Set(['stack', 'row', 'col', 'grid'])
  let screenEl: Element | null = null
  for (const child of Array.from(gui.children)) {
    if (child.tagName === 'frame' || STACK_TAGS.has(child.tagName)) { screenEl = child; break }
  }
  if (!screenEl) return null

  // Canvas dimensions come from the root element's w/h — not a separate viewport attr.
  // w is always explicit on root. h is explicit for fixed artboards (<frame>), absent for
  // content-driven screens (<col>) where height is determined by content.
  const rootWAttr = screenEl.getAttribute('w')
  const rootHAttr = screenEl.getAttribute('h')
  const vw = (rootWAttr && rootWAttr !== 'fill') ? (parseInt(rootWAttr) || 390) : 390
  const fixedVh = (rootHAttr && rootHAttr !== 'fill') ? parseInt(rootHAttr) : null

  const screen = renderFrame(screenEl, assets, { absolute: false }, STACK_TAGS.has(screenEl.tagName))
  screen.style.width = `${vw}px`
  if (fixedVh !== null) screen.style.height = `${fixedVh}px`
  addClass(screen, 'gui-relative')
  screen.style.flexShrink = '0'
  screen.style.outline = '1px solid #0d99ff'

  const stage = document.createElement('div')
  const stageH = fixedVh !== null ? `height:${fixedVh}px;` : ''
  stage.style.cssText = `position:absolute;left:0;top:0;width:${vw}px;${stageH}transform-origin:0 0;will-change:transform;`
  stage.appendChild(screen)

  const outer = document.createElement('div')
  outer.style.cssText = 'position:relative;width:100%;height:100%;overflow:hidden;cursor:grab;touch-action:none;user-select:none;'
  outer.appendChild(stage)
  container.appendChild(outer)

  // For dynamic-height roots, measure actual rendered height after DOM insertion.
  function getVh(): number {
    return fixedVh !== null ? fixedVh : (screen.offsetHeight || screen.scrollHeight || 844)
  }

  function fitZoom(): number {
    const vh = getVh()
    return Math.min((outer.clientWidth - 48) / vw, (outer.clientHeight - 48) / vh, 1)
  }

  // Centering formula for panzoom's coordinate system:
  // panzoom sets transform-origin to 50% 50% and applies scale(s) translate(x,y).
  // Visual center of stage lands at (vw/2 + s*x, vh/2 + s*y).
  // To center in outer: s*x = (W-vw)/2 → x = (W-vw)/(2*s).
  function centeredPan(currentScale: number): { x: number; y: number } {
    const vh = getVh()
    return {
      x: (outer.clientWidth - vw) / (2 * currentScale),
      y: (outer.clientHeight - vh) / (2 * currentScale),
    }
  }

  // Centering formula for direct matrix transform (origin 0 0, used before panzoom init).
  function centeredMatrix(currentScale: number): { x: number; y: number } {
    const vh = getVh()
    return {
      x: (outer.clientWidth - vw * currentScale) / 2,
      y: (outer.clientHeight - vh * currentScale) / 2,
    }
  }

  let baseZoom = fitZoom()
  let zoomFactor = 1
  let panzoom: PanzoomObject | null = null

  // Apply centered transform immediately so there's no top-left-corner flash
  // before panzoom initializes in requestAnimationFrame.
  if (baseZoom > 0) {
    const { x, y } = centeredMatrix(baseZoom)
    stage.style.transform = `matrix(${baseZoom}, 0, 0, ${baseZoom}, ${x}, ${y})`
  }

  function applyCenteredZoom(nextFactor: number): void {
    const nextScale = baseZoom * nextFactor
    if (!panzoom) {
      const { x, y } = centeredMatrix(nextScale)
      stage.style.transform = `matrix(${nextScale}, 0, 0, ${nextScale}, ${x}, ${y})`
      return
    }
    const pan = centeredPan(nextScale)
    panzoom.zoom(nextScale, { animate: false, force: true })
    panzoom.pan(pan.x, pan.y, { animate: false, force: true })
  }

  function setZoom(factor: number, anchorX?: number, anchorY?: number): void {
    const nextFactor = Math.max(0.1, Math.min(factor, 16))
    const nextScale = baseZoom * nextFactor
    if (!nextScale) return

    if (anchorX === undefined || anchorY === undefined) {
      zoomFactor = nextFactor
      applyCenteredZoom(nextFactor)
      return
    }

    zoomFactor = nextFactor
    if (!panzoom) {
      applyCenteredZoom(nextFactor)
      return
    }

    const rect = outer.getBoundingClientRect()
    panzoom.zoomToPoint(nextScale, {
      clientX: rect.left + anchorX,
      clientY: rect.top + anchorY,
    }, { animate: false, force: true })
  }

  requestAnimationFrame(() => {
    baseZoom = fitZoom()
    const pan = centeredPan(baseZoom)
    panzoom = Panzoom(stage, {
      canvas: true,
      cursor: 'grab',
      maxScale: baseZoom * 16,
      minScale: baseZoom * 0.1,
      overflow: 'hidden',
      startScale: baseZoom,
      startX: pan.x,
      startY: pan.y,
      step: 0.18,
      touchAction: 'none',
    })
  })

  return setZoom
}
