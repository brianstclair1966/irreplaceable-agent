import { useState } from 'react'
import Link from 'next/link'

const EXAMPLES = [
  'Seller wants to overprice',
  'Heading into a listing appointment',
  'Buyer’s nervous about an inspection finding',
  'Got a suspicious cash buyer',
]

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        } catch {}
      }}
      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-navy text-white hover:bg-opacity-90 transition flex-shrink-0"
    >
      {copied ? 'Copied ✓' : 'Copy prompt'}
    </button>
  )
}

// onPick(promptId) lets the page open + scroll to the matching prompt card.
export default function PlaybookConcierge({ onPick }) {
  const [situation, setSituation] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function ask(e, preset) {
    e?.preventDefault?.()
    const s = (preset != null ? preset : situation).trim()
    if (s.length < 3) return
    if (preset != null) setSituation(preset)
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const resp = await fetch('/api/playbook-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation: s }),
      })
      const data = await resp.json().catch(() => ({ ok: false }))
      if (!data.ok) throw new Error(data.error || 'Couldn’t find a match — try rephrasing.')
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong — try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border-2 border-brand-coral rounded-3xl p-6 sm:p-8 shadow-lg">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-coral mb-2">Need help? Start here</p>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy leading-tight">Tell me what’s in front of you.</h2>
      <p className="text-gray-600 mt-2">
        Describe your situation in plain words — I’ll help you figure out the next move and hand you the prompt to run it. No browsing required.
      </p>

      <form onSubmit={ask} className="mt-5 space-y-3">
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          rows={2}
          placeholder="e.g. seller wants to overprice and it’s been sitting 60 days with no offers…"
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-[15px] focus:outline-none focus:border-brand-coral resize-none"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading || situation.trim().length < 3}
            className="bg-brand-coral text-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-opacity-90 transition disabled:opacity-60"
          >
            {loading ? 'Finding…' : 'Find my prompt →'}
          </button>
          <span className="text-xs text-brand-taupe">🔥 Then use ONE on a real deal this week.</span>
        </div>
      </form>

      {/* One-tap examples */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-brand-taupe">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => ask(null, ex)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-brand-navy bg-white hover:border-brand-coral hover:text-brand-coral transition disabled:opacity-60"
          >
            {ex}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 border-t border-gray-100 pt-5">
          <p className="text-[15px] text-gray-800">
            <span className="font-bold text-brand-navy">→ Use “{result.title}.”</span> {result.why}
          </p>
          {result.tailored ? (
            <div className="mt-3 rounded-xl bg-brand-navy/[0.03] border border-gray-200">
              <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-gray-200">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-taupe">Your prompt, filled in</p>
                <CopyBtn text={result.tailored} />
              </div>
              <pre className="px-4 py-3 text-[13px] leading-relaxed text-gray-800 whitespace-pre-wrap font-sans">{result.tailored}</pre>
              <p className="px-4 pb-3 text-xs text-brand-taupe">Review and swap in your real details before you send it.</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => onPick && onPick(result.promptId)}
            className="mt-3 text-sm font-semibold text-brand-coral underline hover:opacity-80"
          >
            Open the full prompt ↓
          </button>
        </div>
      )}

      <p className="text-xs text-brand-taupe mt-5">
        Want prompts and a daily system tuned to exactly how <span className="italic">you</span> win?{' '}
        <Link href="/blueprint/generate" className="text-brand-coral font-semibold underline hover:opacity-80">Build your Blueprint</Link>.
      </p>
    </div>
  )
}
