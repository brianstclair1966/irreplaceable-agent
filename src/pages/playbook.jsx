import { useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import prompts, { INTRO, HOW_TO_USE, TIERS, CATEGORIES, CLOSING } from '@/data/playbook'
import PlaybookConcierge from '@/components/PlaybookConcierge'

const TIER_ORDER = [1, 'safety', 2, 3]

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        } catch {
          setCopied(false)
        }
      }}
      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-navy text-white hover:bg-opacity-90 transition flex-shrink-0"
    >
      {copied ? 'Copied ✓' : 'Copy prompt'}
    </button>
  )
}

function PromptCard({ p, open, onToggle }) {
  const isSafety = p.tier === 'safety'
  return (
    <div id={p.id} className={`scroll-mt-24 rounded-2xl border ${isSafety ? 'border-red-300 bg-red-50/40' : 'border-gray-200 bg-white'} overflow-hidden`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-brand-cream/40 transition"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {p.featured && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-brand-coral">🔥 Most agents start here</span>
            )}
          </div>
          <p className="font-bold text-brand-navy leading-snug">{p.title}</p>
          <p className="text-sm text-gray-600 mt-0.5">{p.subtitle}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-cream text-brand-taupe">{p.category}</span>
            {p.whenToUse && <span className="text-[11px] text-brand-taupe">{p.whenToUse}</span>}
          </div>
        </div>
        <span className={`text-brand-coral text-lg leading-none mt-1 transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden>▶</span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-taupe">What it does</p>
            <p className="text-sm text-gray-700">{p.whatItDoes}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-taupe">What to paste in</p>
            <p className="text-sm text-gray-700">{p.whatToPasteIn}</p>
          </div>

          <div className="rounded-xl bg-brand-navy/[0.03] border border-gray-200">
            <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-gray-200">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand-taupe">Prompt</p>
              <CopyButton text={p.prompt} />
            </div>
            <pre className="px-4 py-3 text-[13px] leading-relaxed text-gray-800 whitespace-pre-wrap font-sans">{p.prompt}</pre>
          </div>

          {p.privacy && (
            <p className="text-sm bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-900">
              🔒 <span className="font-semibold">Privacy:</span> {p.privacy}
            </p>
          )}

          {p.proTip && <p className="text-sm text-gray-700"><span className="font-semibold text-brand-navy">Pro tip:</span> {p.proTip}</p>}
          {p.bestResults && <p className="text-sm text-gray-700"><span className="font-semibold text-brand-navy">Best results when you include:</span> {p.bestResults}</p>}
          {p.avoidThis && <p className="text-sm text-gray-700"><span className="font-semibold text-brand-navy">Avoid this:</span> {p.avoidThis}</p>}
          {p.bestUse && <p className="text-sm text-gray-700"><span className="font-semibold text-brand-navy">Best use:</span> {p.bestUse}</p>}
          {p.alwaysVerify && (
            <p className="text-sm bg-brand-cream border border-gray-200 rounded-lg px-3 py-2 text-gray-800">
              <span className="font-semibold text-brand-navy">Always verify:</span> {p.alwaysVerify}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function PlaybookPage() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState(null)
  const [openIds, setOpenIds] = useState({})
  const [openTiers, setOpenTiers] = useState({})

  const toggle = (id) => setOpenIds((o) => ({ ...o, [id]: !o[id] }))
  const toggleTier = (t) => setOpenTiers((o) => ({ ...o, [t]: !o[t] }))

  const handlePick = (id) => {
    setCat(null)
    setQuery('')
    const tier = prompts.find((p) => p.id === id)?.tier
    if (tier != null) setOpenTiers((o) => ({ ...o, [tier]: true }))
    setOpenIds((o) => ({ ...o, [id]: true }))
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  const filtering = query.trim().length > 0 || cat
  const q = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      if (cat && p.category !== cat) return false
      if (!q) return true
      const hay = `${p.title} ${p.subtitle} ${p.whatItDoes} ${p.category} ${p.whenToUse || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [q, cat])

  return (
    <Layout>
      <Head>
        <title>6th Ave AI Playbook — Irreplaceable Agent</title>
      </Head>

      {/* Hero */}
      <section className="bg-brand-navy text-white">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Link href="/" className="text-brand-taupe text-sm hover:text-white">← Back to sessions</Link>
          <p className="text-brand-coral font-semibold uppercase tracking-widest text-xs mt-4 mb-2">6th Ave AI Playbook</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{INTRO.headline}</h1>
          <p className="text-gray-200 mt-3 text-lg">It helps you {INTRO.helps.join(' · ')}.</p>
          <p className="text-brand-taupe mt-2">{INTRO.note}</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 py-10">
        {/* Compliance banner — sets the professional frame before any pasting */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <p className="text-sm text-amber-900 leading-relaxed">
            🔒 <span className="font-semibold">Before you paste:</span> these prompts go into your AI assistant — a third-party tool. Strip client
            names, addresses, account/loan numbers, SSNs, and contract dollar figures first (say “my buyer” and round the numbers).
            Never paste signed documents, bank statements, or IDs. Keep your AI tool’s “train on my data” setting off, and follow your
            brokerage’s technology and confidentiality policy.
          </p>
        </div>

        {/* Concierge — the front door: tell it what's happening, it routes you */}
        <div className="mt-5">
          <PlaybookConcierge onPick={handlePick} />
        </div>

        {/* Browse the library (secondary to the concierge) */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-brand-navy">Or browse the full library</h2>
          <p className="text-sm text-brand-taupe mt-1">Every prompt, by tier. Search or filter to jump straight to what you need.</p>
        </div>

        {/* How to use */}
        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-brand-taupe">
          <span className="font-semibold text-brand-navy">How to use:</span>
          {HOW_TO_USE.map((step, i) => (
            <span key={i}>{i > 0 && <span className="text-gray-300 mr-2">→</span>}{step}</span>
          ))}
        </div>

        {/* Search + filter pills */}
        <div className="mt-6 space-y-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the playbook… (e.g. listing, objection, wire fraud)"
            className="w-full rounded-full border border-gray-300 px-5 py-2.5 text-sm focus:outline-none focus:border-brand-coral"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCat(null)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${!cat ? 'bg-brand-coral text-white border-brand-coral' : 'bg-white text-brand-taupe border-gray-300 hover:border-brand-coral'}`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(cat === c ? null : c)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${cat === c ? 'bg-brand-coral text-white border-brand-coral' : 'bg-white text-brand-taupe border-gray-300 hover:border-brand-coral'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Prompts */}
        <div className="mt-8">
          {filtering ? (
            <div className="space-y-3">
              <p className="text-sm text-brand-taupe mb-2">{filtered.length} prompt{filtered.length === 1 ? '' : 's'}{cat ? ` in ${cat}` : ''}{q ? ` matching “${query.trim()}”` : ''}</p>
              {filtered.map((p) => (
                <PromptCard key={p.id} p={p} open={!!openIds[p.id]} onToggle={() => toggle(p.id)} />
              ))}
              {filtered.length === 0 && <p className="text-sm text-gray-500">No prompts match. Try a different word or clear the filter.</p>}
            </div>
          ) : (
            TIER_ORDER.map((t) => {
              const items = prompts.filter((p) => p.tier === t)
              if (!items.length) return null
              const tier = TIERS[t]
              const isSafety = t === 'safety'
              const open = !!openTiers[t]
              return (
                <section key={t} className="mb-3">
                  <button
                    type="button"
                    onClick={() => toggleTier(t)}
                    className={`w-full text-left flex items-start justify-between gap-4 rounded-2xl border px-5 py-4 transition hover:bg-brand-cream/40 ${isSafety ? 'border-red-300 bg-red-50/40' : 'border-gray-200 bg-white'}`}
                  >
                    <div className="min-w-0">
                      <h2 className={`text-lg font-bold ${isSafety ? 'text-red-700' : 'text-brand-navy'}`}>
                        {tier.label} <span className="text-sm font-normal text-brand-taupe">· {items.length}</span>
                      </h2>
                      <p className="text-sm text-brand-taupe mt-0.5">{tier.blurb}</p>
                    </div>
                    <span className={`text-brand-coral text-lg leading-none mt-1 transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden>▶</span>
                  </button>
                  {open && (
                    <div className="space-y-3 mt-3">
                      {items.map((p) => (
                        <PromptCard key={p.id} p={p} open={!!openIds[p.id]} onToggle={() => toggle(p.id)} />
                      ))}
                    </div>
                  )}
                </section>
              )
            })
          )}
        </div>

        {/* Closing */}
        <div className="mt-6 bg-brand-navy text-white rounded-2xl p-6">
          <p className="font-semibold mb-2">AI helps you {CLOSING.helps.join(' · ')}.</p>
          <p className="text-gray-200 text-sm">But it doesn’t replace {CLOSING.doesntReplace.join(' · ')}.</p>
          <p className="text-brand-taupe text-sm mt-3">👉 {CLOSING.line}</p>
        </div>
      </article>
    </Layout>
  )
}
