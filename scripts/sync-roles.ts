/**
 * Generate lib/roles.json from the canonical role catalog in ../core/roles.
 * Mirrors the sync:spec pattern — core stays the authority, the site ships a
 * generated snapshot. Run: bun run sync:roles
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SRC = join(here, '../../core/roles')
const OUT = join(here, '../lib/roles.json')

interface Role {
  role: string
  reach: string
  platforms: string[]
  title: string
  description: string
  aka: string[]
}

const roles: Role[] = []

for (const file of readdirSync(SRC).sort()) {
  if (!file.endsWith('.md') || file === 'README.md') continue
  const text = readFileSync(join(SRC, file), 'utf8')

  const fm = text.match(/^---\n([\s\S]*?)\n---/)
  if (!fm) continue
  const meta: Record<string, string> = {}
  for (const line of fm[1].split('\n')) {
    const m = line.match(/^(\w[\w-]*):\s*(.+)$/)
    if (m) meta[m[1]] = m[2].trim()
  }
  if (!meta.role) continue

  const body = text.slice(fm[0].length)
  const title = body.match(/^#\s+(.+)$/m)?.[1].trim() ?? meta.role
  // First non-empty, non-heading, non-AKA paragraph after the H1.
  const description =
    body
      .split(/\n\n+/)
      .map(p => p.trim())
      .find(p => p && !p.startsWith('#') && !p.startsWith('**AKA') && !p.startsWith('```')) ?? ''
  const aka =
    body
      .match(/\*\*AKA:\*\*\s*(.+)/)?.[1]
      .split(',')
      .map(s => s.trim())
      .filter(Boolean) ?? []

  roles.push({
    role: meta.role,
    reach: meta.reach ?? '',
    platforms: (meta.platforms ?? '').split(',').map(s => s.trim()).filter(Boolean),
    title,
    description,
    aka
  })
}

writeFileSync(OUT, JSON.stringify({ count: roles.length, roles }, null, 2) + '\n')
console.log(`wrote ${roles.length} roles → ${OUT}`)
