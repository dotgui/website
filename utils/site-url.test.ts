import { describe, expect, test } from 'bun:test'
import { canonicalPath, canonicalUrl, isSamePath, SITE_URL } from './site-url'

describe('canonicalPath', () => {
  test('homepage stays a bare slash', () => {
    expect(canonicalPath('/')).toBe('/')
  })

  test('appends a trailing slash to a page path', () => {
    expect(canonicalPath('/spec')).toBe('/spec/')
    expect(canonicalPath('/spec/roles')).toBe('/spec/roles/')
    expect(canonicalPath('/kit/render')).toBe('/kit/render/')
  })

  test('is idempotent — already-slashed paths are unchanged', () => {
    expect(canonicalPath('/spec/')).toBe('/spec/')
    expect(canonicalPath('/')).toBe('/')
  })

  test('inserts the slash before a hash fragment', () => {
    expect(canonicalPath('/kit#faq')).toBe('/kit/#faq')
    expect(canonicalPath('/cli#install')).toBe('/cli/#install')
  })

  test('inserts the slash before a query string', () => {
    expect(canonicalPath('/spec?tab=x')).toBe('/spec/?tab=x')
    expect(canonicalPath('/spec?tab=x#frag')).toBe('/spec/?tab=x#frag')
  })

  test('leaves file paths (dot in last segment) untouched', () => {
    expect(canonicalPath('/llms.txt')).toBe('/llms.txt')
    expect(canonicalPath('/llms-full.txt')).toBe('/llms-full.txt')
    expect(canonicalPath('/pricing.md')).toBe('/pricing.md')
    expect(canonicalPath('/og.png')).toBe('/og.png')
  })

  test('leaves external URLs untouched', () => {
    expect(canonicalPath('https://github.com/dotgui/core')).toBe('https://github.com/dotgui/core')
    expect(canonicalPath('mailto:hi@dotgui.org')).toBe('mailto:hi@dotgui.org')
  })

  test('leaves a bare hash/anchor untouched', () => {
    expect(canonicalPath('#section')).toBe('#section')
  })
})

describe('canonicalUrl', () => {
  test('prefixes the site origin', () => {
    expect(canonicalUrl('/')).toBe(`${SITE_URL}/`)
    expect(canonicalUrl('/spec')).toBe(`${SITE_URL}/spec/`)
    expect(canonicalUrl('/guides/vs-css')).toBe(`${SITE_URL}/guides/vs-css/`)
  })
})

describe('isSamePath', () => {
  test('matches regardless of trailing slash', () => {
    expect(isSamePath('/spec/', '/spec')).toBe(true)
    expect(isSamePath('/spec', '/spec/')).toBe(true)
    expect(isSamePath('/spec/', '/spec/')).toBe(true)
  })

  test('does not match different paths', () => {
    expect(isSamePath('/spec/roles/', '/spec')).toBe(false)
    expect(isSamePath('/kit/', '/cli')).toBe(false)
  })

  test('treats root as itself only', () => {
    expect(isSamePath('/', '/')).toBe(true)
    expect(isSamePath('/', '/spec')).toBe(false)
  })
})
