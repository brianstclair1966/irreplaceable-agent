// One-time Blueprint-prep card, shown after the agent registers (name capture).
// Why: the Session-5 generator needs the agent's Culture Index + production,
// which Brian pulls with lead time. This collects the request at the START of
// IA so the materials are ready by Session 5 — no stall at the payoff.
//
// Fires kind: 'blueprint-prep-request' → Apps Script "Blueprint Prep Queue"
// tab + Brian notification. Gated by localStorage so it never nags.

import { useEffect, useState } from 'react'

const PREP_KEY = 'ia_bpprep_v1'
const MAX_CI_BYTES = 3 * 1024 * 1024

function getPrepState() {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(window.localStorage.getItem(PREP_KEY) || 'null')
  } catch {
    return null
  }
}

function setPrepState(status) {
  const value = { status, at: new Date().toISOString() }
  window.localStorage.setItem(PREP_KEY, JSON.stringify(value))
  return value
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function BlueprintPrep({ agent }) {
  const [prep, setPrep] = useState(undefined) // undefined = not loaded yet
  const [ciFile, setCiFile] = useState(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setPrep(getPrepState())
  }, [])

  if (!agent || prep === undefined) return null

  // v1 readiness indicator (static — Brian's queue holds the real status)
  if (prep?.status === 'requested') {
    return (
      <p className="text-xs text-brand-taupe bg-white border border-gray-200 rounded-2xl px-4 py-3">
        🛠 <span className="font-semibold text-brand-navy">Blueprint prep is underway</span> — your
        Culture Index and production are being prepared so you can build your Blueprint in Session 5.
      </p>
    )
  }
  if (prep?.status === 'dismissed') return null

  async function request() {
    setError('')
    if (ciFile && ciFile.size > MAX_CI_BYTES) {
      setError('That PDF is a bit large (keep it under ~3 MB) — or skip the upload, Brian will pull it.')
      return
    }
    setSending(true)
    try {
      const body = {
        name: agent.name || '',
        email: agent.email || '',
        hasCI: !!ciFile,
      }
      if (ciFile) {
        body.ciFile = { name: ciFile.name, type: ciFile.type, dataBase64: await fileToBase64(ciFile) }
      }
      const resp = await fetch('/api/blueprint/prep-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await resp.json().catch(() => ({ ok: false }))
      if (!resp.ok || !data.ok) throw new Error(data.error || 'Couldn’t send the request — try again.')
      setPrep(setPrepState('requested'))
    } catch (err) {
      setError(err.message || 'Couldn’t send the request — try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white border border-brand-coral/40 rounded-2xl p-6 shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-brand-coral font-semibold uppercase tracking-widest text-xs mb-2">
          Getting your Blueprint ready (Session 5)
        </p>
        <button
          onClick={() => setPrep(setPrepState('dismissed'))}
          aria-label="Dismiss"
          className="text-brand-taupe hover:text-brand-navy text-lg leading-none"
        >
          ×
        </button>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        In Session 5 we turn your Culture Index and production history into your personal
        Blueprint. Most agents don’t have these on hand yet — that’s fine,{' '}
        <span className="font-semibold text-brand-navy">Brian will pull them for you</span> so
        they’re ready when you get there.
      </p>

      <div className="mt-4">
        {ciFile ? (
          <p className="text-sm bg-brand-cream border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3 max-w-md">
            <span className="text-brand-navy font-medium truncate">📎 {ciFile.name}</span>
            <button type="button" onClick={() => setCiFile(null)} className="text-xs text-brand-taupe underline hover:text-brand-coral flex-shrink-0">remove</button>
          </p>
        ) : (
          <label className="block text-xs text-brand-taupe">
            <span className="block mb-1">
              Have your Culture Index PDF? Upload it now (optional). Don’t have it yet? No problem — Brian will pull it for you.
            </span>
            <input type="file" accept=".pdf,image/*" onChange={(e) => setCiFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-600" />
          </label>
        )}
      </div>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      <button
        onClick={request}
        disabled={sending}
        className="mt-4 bg-brand-coral text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-opacity-90 transition disabled:opacity-60"
      >
        {sending ? 'Sending…' : 'Prep my Blueprint →'}
      </button>
    </div>
  )
}
