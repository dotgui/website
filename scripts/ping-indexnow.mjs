/**
 * Notify Bing/IndexNow of the site's canonical URLs after a *production*
 * deploy, so the index refreshes without waiting for the next crawl.
 * (Bing Webmaster Guidelines §4 — "Notify Bing and Copilot quickly when
 * URLs change".)
 *
 * Wired into the Netlify build command AFTER the build:
 *   command = "npm run build:ci && node scripts/ping-indexnow.mjs"
 *
 * Two guards keep this from firing where it shouldn't:
 *   1. It lives in netlify.toml's command, not a package.json script, so a
 *      local `bun run build`/`dev` never runs it.
 *   2. It no-ops unless Netlify's CONTEXT is `production`, so deploy previews
 *      and branch deploys (which have throwaway URLs) are never announced.
 *
 * The URL list is read straight from the just-built sitemap, so IndexNow and
 * the sitemap can never drift. Any failure is logged but never fails the
 * build (always exits 0).
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const KEY = 'df9990a82b8c878ee6ed10f48e81be1e'
const HOST = 'dotgui.org'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/indexnow'

async function main() {
  // Guard 2: only the real production deploy should announce URLs.
  if (process.env.CONTEXT !== 'production') {
    console.log(`[indexnow] skipped — context is "${process.env.CONTEXT ?? 'local'}", not "production"`)
    return
  }

  const here = dirname(fileURLToPath(import.meta.url))
  const sitemap = readFileSync(join(here, '../public/sitemap.xml'), 'utf8')
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])

  if (urlList.length === 0) {
    console.log('[indexnow] no URLs found in sitemap.xml — skipping')
    return
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList })
  })

  // IndexNow returns 200 (accepted) or 202 (accepted, pending validation).
  console.log(`[indexnow] submitted ${urlList.length} URLs → HTTP ${res.status} ${res.statusText}`)
}

// Never fail the deploy over a notification error.
main().catch(err => {
  console.error('[indexnow] ping failed (non-fatal):', err?.message ?? err)
})
