// CI prep step — shown at the END of Session 4, right before Session 5 builds
// the Blueprint. The Blueprint needs the agent's Culture Index, which Brian
// sends with lead time. Asking here (not at the start of the program) means the
// agent has context for why it matters and time to get it done before Session 5.
//
// Self-contained: reads the registered agent from localStorage. The button fires
// kind: 'blueprint-prep-request' → Apps Script "Blueprint Prep Queue" tab so
// Brian has a tracked list. Gated by localStorage so it doesn't nag once done.

import { useEffect, useState } from 'react'
import { getAgent } from '@/lib/progress'

const PREP_KEY = 'ia_bpprep_v1'
const MAX_CI_BYTES = 3 * 1024 * 1024
const CI_SURVEY_URL = 'https://surveys.cultureindex.com/s/dsK5s9LYO8/78525'

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

export default function BlueprintPrep() {
  const [agent, setAgent] = useState(null)
  const [prep, setPrep] = useState(undefined) // undefined = not loaded yet
  const [ciFile, setCiFile] = useState(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setAgent(getAgent())
    setPrep(getPrepState())
  }, [])

  if (prep === undefined) return null

  // Confirmed → quiet reassurance.
  if (prep?.status === 'requested') {
    return (
      <div className="bg-white border border-brand-coral/40 rounded-2xl p-6 shadow-sm">
        <p className="text-brand-coral font-semibold uppercase tracking-widest text-xs mb-2">
          Before Session 5
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          ✅ <span className="font-semibold text-brand-navy">You’re set.</span> Brian will have your
          Culture Index ready to build your Blueprint in Session 5. A quick text to him helps too.
        </p>
      </div>
    )
  }

  async function request() {
    setError('')
    if (!agent || !agent.name || !agent.email) {
      setError('Add your name on the home page first (so Brian knows it’s you), then come back here.')
      return
    }
    if (ciFile && ciFile.size > MAX_CI_BYTES) {
      setError('That PDF is a bit large (keep it under ~3 MB) — or skip the upload, Brian will send it.')
      return
    }
    setSending(true)
    try {
      const body = { name: agent.name, email: agent.email, hasCI: !!ciFile }
      if (ciFile) {
        body.ciFile = { name: ciFile.name, type: ciFile.type, dataBase64: await fileToBase64(ciFile) }
      }
      const resp = await fetch('/api/blueprint/prep-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await resp.json().catch(() => ({ ok: false }))
      if (!resp.ok || !data.ok) throw new Error(data.error || 'Couldn’t send that — try again.')
      setPrep(setPrepState('requested'))
    } catch (err) {
      setError(err.message || 'Couldn’t send that — try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white border border-brand-coral/40 rounded-2xl p-6 shadow-md">
      <p className="text-brand-coral font-semibold uppercase tracking-widest text-xs mb-2">
        Before Session 5 · One quick thing
      </p>
      <h3 className="text-xl font-bold text-brand-navy mb-2">Get your Culture Index ready</h3>
      <p className="text-sm text-gray-700 leading-relaxed">
        Session 5 turns your Culture Index into your personal Blueprint. Take 10 minutes now so it’s
        ready when you get there — no waiting at the finish line.
      </p>

      <div className="mt-4 space-y-3 text-sm text-gray-700">
        <p>
          <span className="font-semibold text-brand-navy">Already done your Culture Index?</span>{' '}
          Text Brian and he’ll send you your report for Session 5.
        </p>
        <p>
          <span className="font-semibold text-brand-navy">Haven’t done it yet?</span> Take the
          survey (about 10 minutes):{' '}
          <a
            href={CI_SURVEY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-coral font-semibold underline hover:opacity-80"
          >
            Start your Culture Index →
          </a>{' '}
          then text Brian that you’re done so he can send it to you.
        </p>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        {ciFile ? (
          <p className="text-sm bg-brand-cream border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3 max-w-md">
            <span className="text-brand-navy font-medium truncate">📎 {ciFile.name}</span>
            <button type="button" onClick={() => setCiFile(null)} className="text-xs text-brand-taupe underline hover:text-brand-coral flex-shrink-0">remove</button>
          </p>
        ) : (
          <label className="block text-xs text-brand-taupe">
            <span className="block mb-1">
              Already have the PDF in hand? Upload it and we’ll save it for your Blueprint (optional).
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
        {sending ? 'Sending…' : 'I’ve done my Culture Index — let Brian know →'}
      </button>
    </div>
  )
}
