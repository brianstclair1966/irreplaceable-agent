import { useState } from 'react'
import { getAgent } from '@/lib/progress'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[60px] focus:border-brand-coral focus:outline-none'

export default function WeeklyCheckin() {
  const [form, setForm] = useState({ win: '', friction: '', nonNegotiables: '' })
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    const a = getAgent()
    if (!a?.name || !a?.email) {
      setError('Add your name on the progress bar above first, so your check-in is attributed.')
      return
    }
    if (!form.win.trim() && !form.friction.trim() && !form.nonNegotiables) {
      setError('Add at least one note before submitting.')
      return
    }
    setStatus('sending')
    try {
      const resp = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: a.name, email: a.email, ...form }),
      })
      const data = await resp.json().catch(() => ({ ok: false }))
      if (!resp.ok || !data.ok) throw new Error(data.error || 'Could not send your check-in. Try again.')
      setStatus('done')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        <p className="text-2xl mb-1" aria-hidden>✓</p>
        <p className="text-brand-navy font-bold">Check-in logged — see you next Friday.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="text-lg font-bold text-brand-navy">Friday check-in</h2>
        <span className="text-xs text-brand-taupe">~1 minute</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        A quick weekly pulse so you — and Brian — can see the system actually running.
      </p>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-semibold text-brand-navy mb-1">Your primary win this week</span>
          <textarea className={inputClass} value={form.win} onChange={set('win')} placeholder="What went right?" />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-brand-navy mb-1">Where did you hit friction?</span>
          <textarea className={inputClass} value={form.friction} onChange={set('friction')} placeholder="What slowed you down?" />
        </label>
        <div>
          <span className="block text-sm font-semibold text-brand-navy mb-2">
            Did you hit your daily non-negotiables?
          </span>
          <div className="flex gap-3">
            {['Yes', 'Partly', 'No'].map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setForm((f) => ({ ...f, nonNegotiables: opt }))}
                className={
                  (form.nonNegotiables === opt
                    ? 'bg-brand-coral text-white border-brand-coral '
                    : 'bg-white text-brand-navy border-gray-300 ') +
                  'border rounded-full px-4 py-1.5 text-sm font-semibold transition'
                }
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-brand-coral text-white font-semibold px-6 py-2.5 rounded-full hover:bg-opacity-90 transition disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Submit check-in'}
        </button>
      </form>
    </div>
  )
}
