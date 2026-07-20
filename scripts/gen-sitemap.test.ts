import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'bun:test'

const here = dirname(fileURLToPath(import.meta.url))
const sitemap = readFileSync(join(here, '../public/sitemap.xml'), 'utf8')
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
const urlBlocks = [...sitemap.matchAll(/<url>[\s\S]*?<\/url>/g)].map(m => m[0])
const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1])

describe('generated sitemap.xml', () => {
  test('is non-empty and includes the homepage as a bare slash', () => {
    expect(locs.length).toBeGreaterThan(0)
    expect(locs).toContain('https://dotgui.org/')
  })

  test('every non-homepage URL ends in a trailing slash', () => {
    const offenders = locs.filter(
      loc => loc !== 'https://dotgui.org/' && !loc.endsWith('/')
    )
    expect(offenders).toEqual([])
  })

  test('spec URL is the trailing-slash form, never the redirecting one', () => {
    expect(locs).toContain('https://dotgui.org/spec/')
    expect(locs).not.toContain('https://dotgui.org/spec')
  })

  test('no URL points at a file, anchor, or query string', () => {
    const bad = locs.filter(loc => /[?#]/.test(loc) || /\.[a-z0-9]+$/i.test(loc))
    expect(bad).toEqual([])
  })

  test('every URL carries a lastmod freshness signal', () => {
    expect(lastmods.length).toBe(locs.length)
    expect(urlBlocks.length).toBe(locs.length)
    for (const block of urlBlocks) {
      expect(block).toMatch(/<lastmod>/)
    }
  })

  test('lastmod values are valid ISO (YYYY-MM-DD) dates', () => {
    const invalid = lastmods.filter(d => !/^\d{4}-\d{2}-\d{2}$/.test(d) || Number.isNaN(Date.parse(d)))
    expect(invalid).toEqual([])
  })
})
