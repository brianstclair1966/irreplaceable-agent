import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import modules from '@/data/modules'

// Build the lesson-content search index once, from the bundled module data.
// (Resource full-text records are lazy-loaded from /search-index.json on first focus.)
function buildLessonRecords() {
  const records = []
  modules.forEach((m) => {
    const base = { week: m.n, slug: m.slug, weekTitle: m.title }
    // Session overview (title, tagline, intro) — links to the top of the session.
    records.push({
      ...base,
      kind: 'lesson',
      section: `Session ${m.n}: ${m.title}`,
      anchor: '',
      text: [m.title, m.tagline, m.intro].filter(Boolean).join('. '),
    })
    if (m.whyItMatters?.length) {
      records.push({
        ...base,
        kind: 'lesson',
        section: 'Why this matters',
        anchor: '#why-it-matters',
        text: 'Why this matters. ' + m.whyItMatters.join('. '),
      })
    }
    // Each lesson section, deep-linked by index.
    ;(m.lesson || []).forEach((sec, i) => {
      const scriptText = (sec.scripts || [])
        .map((s) => `${s.label}: ${(s.lines || []).join(' ')}`)
        .join(' ')
      records.push({
        ...base,
        kind: 'lesson',
        section: sec.heading,
        anchor: `#s-${i}`,
        text: [sec.heading, ...(sec.paras || []), ...(sec.list || []), scriptText, sec.callout?.text]
          .filter(Boolean)
          .join('. '),
      })
    })
    if (m.actionSteps?.length) {
      records.push({
        ...base,
        kind: 'lesson',
        section: 'Do This Week',
        anchor: '#action-steps',
        text: 'Do This Week. ' + m.actionSteps.join('. '),
      })
    }
    if (m.pitfalls?.length) {
      records.push({
        ...base,
        kind: 'lesson',
        section: 'Pitfalls to Avoid',
        anchor: '#pitfalls',
        text: 'Pitfalls to Avoid. ' + m.pitfalls.join('. '),
      })
    }
    if (m.rhythm?.length) {
      records.push({
        ...base,
        kind: 'lesson',
        section: 'Your Rhythm',
        anchor: '#rhythm',
        text: 'Your Rhythm. ' + m.rhythm.join('. '),
      })
    }
    if (m.vision) {
      records.push({
        ...base,
        kind: 'lesson',
        section: 'Vision',
        anchor: '#vision',
        text: 'Vision. ' + m.vision,
      })
    }
  })
  return records
}

function makeSnippet(text, tokens, len = 150) {
  const lower = text.toLowerCase()
  let pos = -1
  for (const t of tokens) {
    const i = lower.indexOf(t)
    if (i !== -1 && (pos === -1 || i < pos)) pos = i
  }
  if (pos === -1) pos = 0
  let start = Math.max(0, pos - 40)
  let snippet = text.slice(start, start + len)
  if (start > 0) snippet = '…' + snippet
  if (start + len < text.length) snippet = snippet + '…'
  return snippet
}

function Highlight({ text, tokens }) {
  if (!tokens.length) return text
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(`(${escaped.join('|')})`, 'gi')
  const parts = text.split(re)
  return parts.map((p, i) =>
    re.test(p) ? (
      <mark key={i} className="bg-brand-coral/30 text-inherit rounded px-0.5">
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    )
  )
}

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [pdfRecords, setPdfRecords] = useState([])
  const boxRef = useRef(null)

  const lessonRecords = useMemo(() => buildLessonRecords(), [])

  // Lazy-load the resource full-text index on first focus.
  async function loadPdfIndex() {
    if (pdfRecords.length) return
    try {
      const res = await fetch('/search-index.json')
      const data = await res.json()
      setPdfRecords(
        data.map((d) => ({
          week: d.week,
          slug: d.slug,
          kind: 'pdf',
          section: d.label,
          url: d.url,
          text: `${d.label}. ${d.text}`,
        }))
      )
    } catch (e) {
      // Search still works on lesson content if the resource index can't load.
      console.warn('Search index load failed', e)
    }
  }

  // Close on outside click.
  useEffect(() => {
    function onClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Close when navigating.
  useEffect(() => {
    function close() {
      setOpen(false)
      setQuery('')
    }
    router.events.on('routeChangeComplete', close)
    return () => router.events.off('routeChangeComplete', close)
  }, [router.events])

  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)

  const results = useMemo(() => {
    if (!tokens.length) return []
    const all = [...lessonRecords, ...pdfRecords]
    const scored = []
    for (const r of all) {
      const lower = r.text.toLowerCase()
      const sectionLower = r.section.toLowerCase()
      if (!tokens.every((t) => lower.includes(t))) continue
      let score = 0
      for (const t of tokens) {
        if (sectionLower.includes(t)) score += 5
        const idx = lower.indexOf(t)
        if (idx !== -1) score += idx < 80 ? 3 : 1
      }
      if (lower.includes(tokens.join(' '))) score += 4 // phrase bonus
      scored.push({ ...r, score })
    }
    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, 12)
  }, [tokens.join(' '), lessonRecords, pdfRecords])

  function go(r) {
    setOpen(false)
    setQuery('')
    if (r.kind === 'pdf') {
      window.open(r.url, '_blank', 'noopener,noreferrer')
    } else {
      router.push(`/session/${r.slug}${r.anchor || ''}`)
    }
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-xs sm:max-w-sm">
      <div className="flex items-center bg-white/95 rounded-full px-3 py-1.5 shadow-sm">
        <span className="text-brand-taupe text-sm" aria-hidden>
          🔍
        </span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            setOpen(true)
            loadPdfIndex()
          }}
          placeholder="Search this program…"
          className="w-full bg-transparent outline-none text-sm text-brand-navy placeholder-brand-taupe px-2"
          aria-label="Search this program"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setOpen(false)
            }}
            className="text-brand-taupe hover:text-brand-navy text-sm"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {open && tokens.length > 0 && (
        <div className="absolute z-50 mt-2 w-[22rem] sm:w-[30rem] max-w-[85vw] right-0 bg-white rounded-2xl shadow-xl border border-gray-200 max-h-[70vh] overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">No matches for “{query}”.</p>
          ) : (
            <ul className="py-2">
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    onClick={() => go(r)}
                    className="w-full text-left px-4 py-2.5 hover:bg-brand-cream transition flex flex-col gap-1"
                  >
                    <span className="flex items-center gap-2">
                      <span className="bg-brand-coral text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Session {r.week}
                      </span>
                      <span className="text-sm font-semibold text-brand-navy">
                        {r.kind === 'pdf' ? `📄 ${r.section}` : r.section}
                      </span>
                    </span>
                    <span className="text-xs text-gray-600 leading-snug">
                      <Highlight text={makeSnippet(r.text, tokens)} tokens={tokens} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
