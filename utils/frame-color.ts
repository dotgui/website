import type { Example } from '~/lib/examples-data'

// Frame colour behind a .gui preview shot. Uses the design's dominant colour,
// but when that colour is near-white or near-black (which would read as a plain
// white or black background) it falls back to the most saturated accent in the
// palette, or a soft neutral if the palette has no colour to offer.
const NEUTRAL_FRAME = '#EAE6DF'

const isHex6 = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v)

const hexBrightness = (hex: string) =>
  (parseInt(hex.slice(1, 3), 16) + parseInt(hex.slice(3, 5), 16) + parseInt(hex.slice(5, 7), 16)) / 3 / 255

const hexSaturation = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  return mx === 0 ? 0 : (mx - mn) / mx
}

const isExtreme = (hex: string) => {
  const b = hexBrightness(hex)
  return b < 0.1 || b > 0.9
}

export function frameColor(ex: Example): string {
  const cols = (ex.colors || []).map((c) => c.value).filter(isHex6)
  if (!cols.length) return NEUTRAL_FRAME
  if (!isExtreme(cols[0])) return cols[0]
  const accents = cols.filter((c) => !isExtreme(c)).sort((a, b) => hexSaturation(b) - hexSaturation(a))
  return accents[0] || NEUTRAL_FRAME
}
