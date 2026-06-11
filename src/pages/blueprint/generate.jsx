import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { PROGRAM } from '@/data/modules'
import { getAgent } from '@/lib/progress'
import { setBlueprint } from '@/lib/blueprint'
import { getGeneration, setGeneration, clearGeneration, mdToHtml, downloadAsWord } from '@/lib/generator-store'

const MAX_TOTAL_BYTES = 3 * 1024 * 1024 // stay under Vercel's body cap after base64

const STEPS = [
  'Analyzing your Culture Index…',
  'Reviewing your production history…',
  'Building your Assessment…',
  'Building your Operating System…',
  'Preparing your Coach…',
]

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function post(url, body) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await resp.json().catch(() => ({ ok: false }))
  if (!resp.ok || !data.ok) throw new Error(data.error || 'Something went wrong.')
  return data
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-brand-navy mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-brand-taupe mt-1">{hint}</span>}
    </label>
  )
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-brand-coral focus:outline-none'
const areaClass = `${inputClass} min-h-[72px]`

export default function GenerateBlueprintPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    goalIncome: '',
    goalUnits: '',
    goalVolume: '',
    greatWeek: '',
    friction: '',
    clientsEnjoy: '',
    leadSource: '',
    proudInAYear: '',
  })
  const [ciFile, setCiFile] = useState(null)
  const [prodFile, setProdFile] = useState(null)
  const [phase, setPhase] = useState('form') // form | generating | done | error
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [openDoc, setOpenDoc] = useState('assessment')

  useEffect(() => {
    const a = getAgent()
    if (a) setForm((f) => ({ ...f, name: a.name || '', email: a.email || '' }))
    const existing = getGeneration()
    if (existing?.operatingSystem) {
      setResult(existing)
      setPhase('done')
    }
  }, [])

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function run(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please add your name and email.')
      return
    }
    const files = [ciFile, prodFile].filter(Boolean)
    if (files.reduce((n, f) => n + f.size, 0) > MAX_TOTAL_BYTES) {
      setError('Files are a bit large (keep the total under ~3 MB). Try smaller PDFs.')
      return
    }

    const nameParts = form.name.trim().split(/\s+/)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ')
    const goal = [
      form.goalIncome && `income ${form.goalIncome}`,
      form.goalUnits && `${form.goalUnits} units`,
      form.goalVolume && `volume ${form.goalVolume}`,
    ].filter(Boolean).join(' · ')
    const intake = {
      goal,
      greatWeek: form.greatWeek,
      friction: form.friction,
      clientsEnjoy: form.clientsEnjoy,
      leadSource: form.leadSource,
      proudInAYear: form.proudInAYear,
    }

    setPhase('generating')
    try {
      // Step 1–2: extract CI + production
      setStep(0)
      const encoded = {}
      if (ciFile) encoded.ciFile = { name: ciFile.name, type: ciFile.type, dataBase64: await fileToBase64(ciFile) }
      if (prodFile) encoded.prodFile = { name: prodFile.name, type: prodFile.type, dataBase64: await fileToBase64(prodFile) }
      const extracted = await post('/api/blueprint/extract', encoded)
      setStep(1)
      await new Promise((r) => setTimeout(r, 900))

      // Step 3: Assessment (Pass A — includes the Confidence Note conflict check)
      setStep(2)
      const passA = await post('/api/blueprint/assessment', {
        firstName,
        lastName,
        ci: extracted.ci,
        production: extracted.productionSummary,
        intake,
      })

      // Step 4: Operating System (Pass B — self-graded; retry once if any score < 8)
      setStep(3)
      let passB = await post('/api/blueprint/operating-system', {
        firstName,
        ci: extracted.ci,
        assessment: passA.assessment,
        intake,
        attempt: 1,
      })
      if (passB.needsRetry) {
        passB = await post('/api/blueprint/operating-system', {
          firstName,
          ci: extracted.ci,
          assessment: passA.assessment,
          intake,
          attempt: 2,
        })
      }

      // Step 5: prepare the coach + save everything
      setStep(4)
      const generation = {
        name: form.name.trim(),
        email: form.email.trim(),
        ciProvided: extracted.ciProvided,
        ci: extracted.ci,
        productionSummary: extracted.productionSummary,
        intake,
        assessment: passA.assessment,
        conflict: passA.conflict,
        operatingSystem: passB.operatingSystem,
        scores: passB.scores,
        lowest: passB.lowest,
      }
      setBlueprint(generation.operatingSystem) // the Coach reads the OS automatically
      setGeneration(generation)
      // Save to Drive + notify Brian (non-blocking for the agent if it fails)
      try {
        await post('/api/blueprint/save', generation)
      } catch (saveErr) {
        console.warn('Save failed (agent still has documents locally):', saveErr)
      }

      setResult(generation)
      setPhase('done')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setPhase('form')
    }
  }

  function regenerate() {
    clearGeneration()
    setResult(null)
    setPhase('form')
  }

  return (
    <Layout>
      <Head>
        <title>Your Blueprint — Irreplaceable Agent</title>
      </Head>

      {/* Header band */}
      <section className="bg-brand-navy text-white">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Link href="/" className="text-brand-taupe text-sm hover:text-white">
            ← Back to sessions
          </Link>
          <p className="text-brand-coral font-semibold uppercase tracking-widest text-xs mt-4 mb-2">
            Session 5 · Built for you
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Your Blueprint</h1>
          <p className="text-gray-200 mt-3 text-lg">
            Your Culture Index, your production, and six questions — turned into your Assessment
            (who you are) and your Operating System (how you win, daily).
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* ───────────────────────────── INTAKE FORM ───────────────────────────── */}
        {phase === 'form' && (
          <form onSubmit={run} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Your name">
                <input className={inputClass} value={form.name} onChange={set('name')} placeholder="Full name" />
              </Field>
              <Field label="Email">
                <input className={inputClass} type="email" value={form.email} onChange={set('email')} placeholder="you@6thavehomes.com" />
              </Field>
            </div>

            <Field
              label="Culture Index report (PDF)"
              hint="Already have your Culture Index PDF? Upload it. Don’t have it yet? No problem — Brian will pull it for you."
            >
              <input type="file" accept=".pdf,image/*" onChange={(e) => setCiFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-600" />
            </Field>

            <Field label="Production report (xlsx, csv, or PDF)" hint="Your 2- or 5-year production sheet, MLS report, or a screenshot.">
              <input type="file" accept=".pdf,.csv,.xlsx,.xls,image/*" onChange={(e) => setProdFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-600" />
            </Field>

            <div>
              <h3 className="text-lg font-bold text-brand-navy mb-1">Six questions</h3>
              <p className="text-xs text-brand-taupe mb-4">
                Your Culture Index and production tell us a lot already. These tell us what you believe and want.
              </p>
              <div className="space-y-5">
                <div>
                  <span className="block text-sm font-semibold text-brand-navy mb-1">1. What’s your 12-month goal?</span>
                  <div className="grid grid-cols-3 gap-3">
                    <input className={inputClass} value={form.goalIncome} onChange={set('goalIncome')} placeholder="Income (e.g. $120K)" />
                    <input className={inputClass} value={form.goalUnits} onChange={set('goalUnits')} placeholder="Units (e.g. 18)" />
                    <input className={inputClass} value={form.goalVolume} onChange={set('goalVolume')} placeholder="Volume (e.g. $6M)" />
                  </div>
                </div>
                <Field label="2. What does a great week actually look like for you?">
                  <textarea className={areaClass} value={form.greatWeek} onChange={set('greatWeek')} />
                </Field>
                <Field label="3. What part of the business do you keep avoiding, or find draining?">
                  <textarea className={areaClass} value={form.friction} onChange={set('friction')} />
                </Field>
                <Field label="4. What kind of clients do you most enjoy helping?">
                  <textarea className={areaClass} value={form.clientsEnjoy} onChange={set('clientsEnjoy')} />
                </Field>
                <Field label="5. Where do most of your opportunities come from today?">
                  <textarea className={areaClass} value={form.leadSource} onChange={set('leadSource')} />
                </Field>
                <Field label="6. If we sat down a year from now and you felt proud of your progress, what would have changed?">
                  <textarea className={areaClass} value={form.proudInAYear} onChange={set('proudInAYear')} />
                </Field>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full sm:w-auto bg-brand-coral text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition"
            >
              Build My Blueprint
            </button>
            <p className="text-xs text-brand-taupe">
              Your Assessment and Operating System are generated right here — yours to download and
              keep. A copy is saved for Brian. Upload only your own Culture Index and production; no
              client details needed.
            </p>
          </form>
        )}

        {/* ─────────────────────────── GENERATING (visibility steps) ─────────────────────────── */}
        {phase === 'generating' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-brand-navy mb-6">Building your system…</h2>
            <ol className="space-y-4">
              {STEPS.map((label, i) => (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className={
                      i < step
                        ? 'w-6 h-6 rounded-full bg-brand-navy text-white text-xs flex items-center justify-center flex-shrink-0'
                        : i === step
                          ? 'w-6 h-6 rounded-full bg-brand-coral text-white text-xs flex items-center justify-center flex-shrink-0 animate-pulse'
                          : 'w-6 h-6 rounded-full border border-gray-300 text-gray-300 text-xs flex items-center justify-center flex-shrink-0'
                    }
                  >
                    {i < step ? '✓' : i + 1}
                  </span>
                  <span className={i <= step ? 'text-brand-navy font-medium' : 'text-brand-taupe'}>{label}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-brand-taupe mt-6">This takes a minute or two — it’s actually reading your documents.</p>
          </div>
        )}

        {/* ────────────────────────────── THE HUB (Page 5) ────────────────────────────── */}
        {phase === 'done' && result && (
          <div className="space-y-6">
            {result.conflict && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 text-sm text-amber-900">
                <strong>One thing to know:</strong> your Culture Index and your actual
                production/answers tell slightly different stories — your Assessment opens with a
                note about it. Brian will look at this personally when he reviews your draft.
              </div>
            )}

            {/* 1. Assessment */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-6 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-brand-coral font-semibold uppercase tracking-widest text-xs mb-1">Step 1 · The reveal</p>
                  <h2 className="text-xl font-bold text-brand-navy">Your Assessment</h2>
                  <p className="text-sm text-gray-600 mt-1">Here’s how you’re wired and how you naturally win.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setOpenDoc(openDoc === 'assessment' ? '' : 'assessment')} className="text-sm border border-brand-navy text-brand-navy font-semibold px-4 py-2 rounded-full hover:bg-brand-navy hover:text-white transition">
                    {openDoc === 'assessment' ? 'Hide' : 'Read'}
                  </button>
                  <button onClick={() => downloadAsWord(`${result.name} - Assessment`, result.assessment)} className="text-sm bg-brand-coral text-white font-semibold px-4 py-2 rounded-full hover:bg-opacity-90 transition">
                    Download Word
                  </button>
                </div>
              </div>
              {openDoc === 'assessment' && (
                <div className="border-t border-gray-100 px-6 py-5 prose-sm max-w-none text-gray-800 [&_h1]:text-brand-navy [&_h2]:text-brand-navy [&_h3]:text-brand-coral [&_h1]:text-xl [&_h2]:text-lg [&_h2]:font-bold [&_h1]:font-extrabold [&_ul]:list-disc [&_ul]:pl-5 [&_p]:my-2 [&_li]:my-1"
                  dangerouslySetInnerHTML={{ __html: mdToHtml(result.assessment) }}
                />
              )}
            </div>

            {/* 2. Operating System */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-6 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-brand-coral font-semibold uppercase tracking-widest text-xs mb-1">Step 2 · The system</p>
                  <h2 className="text-xl font-bold text-brand-navy">Your Operating System</h2>
                  <p className="text-sm text-gray-600 mt-1">Here’s how you win, daily.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setOpenDoc(openDoc === 'os' ? '' : 'os')} className="text-sm border border-brand-navy text-brand-navy font-semibold px-4 py-2 rounded-full hover:bg-brand-navy hover:text-white transition">
                    {openDoc === 'os' ? 'Hide' : 'Read'}
                  </button>
                  <button onClick={() => downloadAsWord(`${result.name} - Operating System`, result.operatingSystem)} className="text-sm bg-brand-coral text-white font-semibold px-4 py-2 rounded-full hover:bg-opacity-90 transition">
                    Download Word
                  </button>
                </div>
              </div>
              {openDoc === 'os' && (
                <div className="border-t border-gray-100 px-6 py-5 max-w-none text-gray-800 [&_h1]:text-brand-navy [&_h2]:text-brand-navy [&_h3]:text-brand-coral [&_h1]:text-xl [&_h2]:text-lg [&_h2]:font-bold [&_h1]:font-extrabold [&_ul]:list-disc [&_ul]:pl-5 [&_p]:my-2 [&_li]:my-1 text-sm"
                  dangerouslySetInnerHTML={{ __html: mdToHtml(result.operatingSystem) }}
                />
              )}
            </div>

            {/* 3. Blueprint Coach (understated) */}
            <div className="bg-brand-cream border border-gray-200 rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-bold text-brand-navy">Blueprint Coach</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Your Operating System is loaded into your coach — it helps you apply it, day to day.
                </p>
              </div>
              <Link href="/coach" className="bg-brand-navy text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-opacity-90 transition">
                Open Coach →
              </Link>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-brand-taupe mb-3">
                Your documents are ready to download above, and a copy was saved for Brian.
                {result.lowest > 0 && result.lowest < 8 && ' (Quality check flagged this draft for extra attention.)'}
              </p>
              <button onClick={regenerate} className="text-sm text-brand-taupe underline hover:text-brand-coral">
                Start over with new answers
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
