// Shared XML syntax highlighter for spec examples. Used by the spec hub and
// each per-element spec page so highlighting is identical everywhere.

export function hl(code: string): string {
  let out = ''
  let i = 0
  const e = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  while (i < code.length) {
    if (code.startsWith('<!--', i)) {
      const end = code.indexOf('-->', i)
      if (end !== -1) {
        out += `<span class="tok-comment">${e(code.slice(i, end + 3))}</span>`
        i = end + 3; continue
      }
    }
    if (code[i] === '<') {
      out += `<span class="tok-punct">&lt;</span>`
      i++
      if (code[i] === '/') { out += `<span class="tok-punct">/</span>`; i++ }
      let j = i
      while (j < code.length && /[\w\-]/.test(code[j])) j++
      if (j > i) { out += `<span class="tok-tag">${e(code.slice(i, j))}</span>`; i = j }
      while (i < code.length && code[i] !== '>') {
        if (/\s/.test(code[i])) { out += code[i]; i++; continue }
        if (code[i] === '/') { out += `<span class="tok-punct">/</span>`; i++; continue }
        let a = i
        while (i < code.length && code[i] !== '=' && code[i] !== '>' && code[i] !== '/' && !/\s/.test(code[i])) i++
        if (i > a) out += `<span class="tok-attr">${e(code.slice(a, i))}</span>`
        if (code[i] === '=') {
          out += `<span class="tok-punct">=</span>`; i++
          if (code[i] === '"') {
            out += `<span class="tok-punct">"</span>`; i++
            let v = i
            while (i < code.length && code[i] !== '"') i++
            out += `<span class="tok-val">${e(code.slice(v, i))}</span>`
            out += `<span class="tok-punct">"</span>`; i++
          }
        }
      }
      if (code[i] === '>') { out += `<span class="tok-punct">&gt;</span>`; i++ }
      continue
    }
    out += e(code[i]); i++
  }
  return out
}

export function plain(code: string): string {
  return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// TypeScript / JS / bash highlighter — same tok-* palette as the XML one, so the
// spec and kit pages share one light-surface code look.
const TS_KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'const', 'let', 'var', 'function', 'return',
  'if', 'else', 'for', 'of', 'in', 'while', 'await', 'async', 'new', 'throw', 'try',
  'catch', 'finally', 'interface', 'type', 'class', 'extends', 'implements', 'typeof',
  'instanceof', 'as', 'void', 'null', 'undefined', 'true', 'false', 'this', 'enum'
])

export function hlTs(code: string): string {
  const e = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  let out = ''
  let i = 0
  const n = code.length
  while (i < n) {
    const c = code[i]
    // line comment (// …) or shell comment (# …)
    if ((c === '/' && code[i + 1] === '/') || c === '#') {
      let j = code.indexOf('\n', i)
      if (j === -1) j = n
      out += `<span class="tok-comment">${e(code.slice(i, j))}</span>`
      i = j; continue
    }
    // block comment
    if (c === '/' && code[i + 1] === '*') {
      let j = code.indexOf('*/', i)
      j = j === -1 ? n : j + 2
      out += `<span class="tok-comment">${e(code.slice(i, j))}</span>`
      i = j; continue
    }
    // string (single, double, template)
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1
      while (j < n && code[j] !== c) { if (code[j] === '\\') j++; j++ }
      j = Math.min(j + 1, n)
      out += `<span class="tok-val">${e(code.slice(i, j))}</span>`
      i = j; continue
    }
    // identifier / keyword
    if (/[A-Za-z_$]/.test(c)) {
      let j = i + 1
      while (j < n && /[\w$]/.test(code[j])) j++
      const w = code.slice(i, j)
      out += TS_KEYWORDS.has(w) ? `<span class="tok-tag">${w}</span>` : e(w)
      i = j; continue
    }
    out += e(c); i++
  }
  return out
}

// Pick the highlighter by language.
export function hlCode(code: string, lang?: string): string {
  return lang === 'gui' || lang === 'xml' ? hl(code) : hlTs(code)
}
