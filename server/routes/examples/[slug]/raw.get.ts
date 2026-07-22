/**
 * GET /examples/<slug>/raw — the .gui source as plain text (GitHub-style raw
 * view). A server route (not a static file) so the text/plain content-type is
 * set authoritatively on every request in dev and prod, and a direct visit or
 * a "View raw" click always displays instead of downloading. Prerendered to a
 * static file for production (see nuxt.config prerender routes).
 */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''
  // Guard against path traversal — slugs are lowercase kebab-case only.
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid example slug' })
  }

  const file = join(process.cwd(), 'public', 'examples', slug, 'source.guix')
  let text: string
  try {
    text = await readFile(file, 'utf8')
  } catch {
    throw createError({ statusCode: 404, statusMessage: `Unknown example: ${slug}` })
  }

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return text
})
