// Client-side persistence for the Blueprint Generator (localStorage, same
// pattern as progress.js). Holds the agent's generated Assessment + Operating
// System so the Page-5 hub survives reloads. The OS is ALSO written via
// setBlueprint() (blueprint.js) so the Coach picks it up automatically.

const KEY = 'ia_generator_v1'

export function getGeneration() {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || 'null')
  } catch {
    return null
  }
}

export function setGeneration(data) {
  const value = { ...data, savedAt: new Date().toISOString() }
  window.localStorage.setItem(KEY, JSON.stringify(value))
  return value
}

export function clearGeneration() {
  window.localStorage.removeItem(KEY)
}

// Minimal markdown → HTML for previews and the branded Word download.
// Handles headings, bold/italic, bullets, and pipe tables (the Assessment's
// Production Summary renders as a real table — see the Billy Mullen sample).
export function mdToHtml(md) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const inline = (s) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
  const lines = (md || '').split('\n')
  const out = []
  let inList = false
  let tableRows = null // buffered table rows

  const flushList = () => { if (inList) { out.push('</ul>'); inList = false } }
  const flushTable = () => {
    if (!tableRows) return
    const [head, ...body] = tableRows
    const cell = (tag, c) => `<${tag} style="border:1px solid #cfcfcf;padding:6px 12px;text-align:center">${inline(c)}</${tag}>`
    out.push('<table style="border-collapse:collapse;margin:10px 0">')
    out.push(`<tr style="background:#043853;color:#ffffff">${head.map((c) => cell('th', c)).join('')}</tr>`)
    for (const row of body) out.push(`<tr>${row.map((c) => cell('td', c)).join('')}</tr>`)
    out.push('</table>')
    tableRows = null
  }

  for (const raw of lines) {
    const escd = esc(raw)
    // Pipe-table rows (skip |---|:-:| separator lines)
    if (/^\s*\|(.+)\|\s*$/.test(escd)) {
      const cells = escd.trim().slice(1, -1).split('|').map((c) => c.trim())
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue
      flushList()
      tableRows = tableRows || []
      tableRows.push(cells)
      continue
    }
    flushTable()

    const line = inline(escd)
    const bullet = line.match(/^\s*[-•]\s+(.*)/)
    if (bullet) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${bullet[1]}</li>`)
      continue
    }
    flushList()
    if (/^###\s+/.test(line)) out.push(`<h3>${line.replace(/^###\s+/, '')}</h3>`)
    else if (/^##\s+/.test(line)) out.push(`<h2>${line.replace(/^##\s+/, '')}</h2>`)
    else if (/^#\s+/.test(line)) out.push(`<h1>${line.replace(/^#\s+/, '')}</h1>`)
    else if (line.trim() === '') out.push('')
    else out.push(`<p>${line}</p>`)
  }
  flushList()
  flushTable()
  return out.join('\n')
}

// Branded Word-compatible .doc download (HTML-based — no dependencies).
// 6th Ave navy (#043853) headings, coral (#ED6758) accents.
export function downloadAsWord(title, markdown) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>
body { font-family: Calibri, Arial, sans-serif; color: #1a1a1a; line-height: 1.45; margin: 48px; }
h1 { color: #043853; font-size: 22pt; border-bottom: 3px solid #ED6758; padding-bottom: 6px; }
h2 { color: #043853; font-size: 14pt; margin-top: 18px; }
h3 { color: #ED6758; font-size: 12pt; }
li { margin: 3px 0; }
.brand { color: #ABAEA7; font-size: 9pt; margin-top: 36px; border-top: 1px solid #ddd; padding-top: 8px; }
</style></head><body>
${mdToHtml(markdown)}
<p class="brand">6th Ave Homes · Irreplaceable Agent™ · Generated draft — Brian reviews and sends the official version.</p>
</body></html>`
  const blob = new Blob(['﻿', html], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/[^\w\- ]+/g, '').trim() || 'document'}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
