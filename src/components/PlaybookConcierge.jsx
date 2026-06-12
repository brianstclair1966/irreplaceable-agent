import { useState } from 'react'
import Link from 'next/link'

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

  async function ask(e) {
    e?.preventDefault?.()
    const s = situation.trim()
    if (s.length < 3) return
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
    <div className="bg-white border border-brand-coral/40 rounded-2xl p-6 shadow-md">
      <p className="text-xs font-bold uppercase tracking-wide text-brand-coral mb-1">Not sure which to use?</p>
      <h2 className="text-lg font-bold text-brand-navy mb-1">Describe your situation — I’ll find the right prompt.</h2>
      <p className="text-sm text-gray-600 mb-4">
        e.g. “angry seller who wants to overprice,” “buyer nervous about a roof finding,” “got a wire instruction email.”
      </p>

      <form onSubmit={ask} className="space-y-3">
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          rows={2}
          placeholder="What’s actually in front of you right now?"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-coral resize-none"
        />
        <button
          type="submit"
          disabled={loading || situation.trim().length < 3}
          className="bg-brand-coral text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-opacity-90 transition disabled:opacity-60"
        >
          {loading ? 'Finding…' : 'Find my prompt →'}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      {result && (
        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-brand-navy">→ Use “{result.title}.”</span> {result.why}
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

      <p className="text-xs text-brand-taupe mt-4">
        Want prompts and a daily system tuned to exactly how <span className="italic">you</span> win?{' '}
        <Link href="/blueprint/generate" className="text-brand-coral font-semibold underline hover:opacity-80">Build your Blueprint</Link>.
      </p>
    </div>
  )
}
