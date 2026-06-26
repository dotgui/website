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
