import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { PROGRAM } from '@/data/modules'
import { getAgent } from '@/lib/progress'

const MAX_TOTAL_BYTES = 3.2 * 1024 * 1024 // keep under Vercel's ~4.5MB body cap after base64

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
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

export default function BlueprintPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    cultureIndexResult: '',
    yearsInBusiness: '',
    last12Transactions: '',
    last12Volume: '',
    avgPrice: '',
    focus: '',
    marketArea: '',
    filesLink: '',
    notes: '',
  })
  const [ciFile, setCiFile] = useState(null)
  const [prodFile, setProdFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')

  useEffect(() => {
    const a = getAgent()
    if (a) setForm((f) => ({ ...f, name: a.name || '', email: a.email || '' }))
  }, [])

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please add your name and email.')
      return
    }
    const files = [ciFile, prodFile].filter(Boolean)
    const totalBytes = files.reduce((n, f) => n + f.size, 0)
    if (totalBytes > MAX_TOTAL_BYTES) {
      setError(
        'Your files are a bit large to upload here (keep the total under ~3 MB). Try a smaller PDF, or paste a Drive/Dropbox link in the “link to your files” field instead.'
      )
      return
    }

    setStatus('sending')
    try {
      const encoded = []
      if (ciFile) encoded.push({ slot: 'culture_index', name: ciFile.name, type: ciFile.type, dataBase64: await fileToBase64(ciFile) })
      if (prodFile) encoded.push({ slot: 'production', name: prodFile.name, type: prodFile.type, dataBase64: await fileToBase64(prodFile) })

      const resp = await fetch('/api/submit-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, files: encoded }),
      })
      const data = await resp.json().catch(() => ({ ok: false }))
      if (!resp.ok || !data.ok) throw new Error(data.error || 'Something went wrong sending your request.')
      setStatus('done')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again, or email Brian directly.')
      setStatus('error')
    }
  }

  return (
    <Layout>
      <Head>
        <title>Request Your Blueprint — Irreplaceable Agent</title>
      </Head>

      {/* Header band */}
      <section className="bg-brand-navy text-white">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Link href="/" className="text-brand-taupe text-sm hover:text-white">
            ← Back to sessions
          </Link>
          <p className="text-brand-coral font-semibold uppercase tracking-widest text-xs mt-4 mb-2">
            Built for you · Free
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Request Your Blueprint</h1>
          <p className="text-gray-200 mt-3 text-lg">
            Share your Culture Index and a snapshot of your past production, and Brian builds your
            personalized operating system by hand — mapped to exactly how you win.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {status === 'done' ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3" aria-hidden>📐</p>
            <h2 className="text-2xl font-bold text-brand-navy mb-2">Request received</h2>
            <p className="text-gray-700 leading-relaxed">
              Thanks, {form.name.split(' ')[0] || 'there'} — your Blueprint request is in. Brian will
              build it from your Culture Index and production and follow up by email.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 bg-brand-coral text-white font-semibold px-7 py-3 rounded-full hover:bg-opacity-90 transition"
            >
              Back to sessions
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-brand-cream border border-brand-coral/30 rounded-2xl p-5 mb-8">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-brand-navy">Haven’t taken your Culture Index yet?</span>{' '}
                It’s a free ~10-minute survey and the foundation of your Blueprint.{' '}
                <a
                  href={PROGRAM.cultureIndexUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-coral font-semibold underline"
                >
                  Take it here ↗
                </a>
              </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Your name">
                  <input className={inputClass} value={form.name} onChange={set('name')} placeholder="Full name" />
                </Field>
                <Field label="Email">
                  <input className={inputClass} type="email" value={form.email} onChange={set('email')} placeholder="you@6thavehomes.com" />
                </Field>
              </div>

              <Field
                label="Your Culture Index result"
                hint="Your profile type/pattern if you know it (e.g. “Rainmaker”, “Specialist”). Optional — you can also upload the PDF below."
              >
                <input className={inputClass} value={form.cultureIndexResult} onChange={set('cultureIndexResult')} placeholder="Profile type or short summary" />
              </Field>

              <Field label="Culture Index PDF" hint="Upload your results PDF if you have it (optional).">
                <input type="file" accept=".pdf,image/*" onChange={(e) => setCiFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-600" />
              </Field>

              <div>
                <h3 className="text-lg font-bold text-brand-navy mb-1">Your past production</h3>
                <p className="text-xs text-brand-taupe mb-4">A rough snapshot is fine — it helps Brian tailor your system.</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Years in real estate">
                    <input className={inputClass} value={form.yearsInBusiness} onChange={set('yearsInBusiness')} placeholder="e.g. 4" />
                  </Field>
                  <Field label="Transactions (last 12 months)">
                    <input className={inputClass} value={form.last12Transactions} onChange={set('last12Transactions')} placeholder="e.g. 14" />
                  </Field>
                  <Field label="Volume (last 12 months)">
                    <input className={inputClass} value={form.last12Volume} onChange={set('last12Volume')} placeholder="e.g. $5.2M" />
                  </Field>
                  <Field label="Average price point">
                    <input className={inputClass} value={form.avgPrice} onChange={set('avgPrice')} placeholder="e.g. $375K" />
                  </Field>
                  <Field label="Primary focus">
                    <input className={inputClass} value={form.focus} onChange={set('focus')} placeholder="Buyers / Sellers / Both" />
                  </Field>
                  <Field label="Market area">
                    <input className={inputClass} value={form.marketArea} onChange={set('marketArea')} placeholder="e.g. Fort Worth, TX" />
                  </Field>
                </div>
              </div>

              <Field label="Production report" hint="Upload a production report or screenshot if you have one (optional).">
                <input type="file" accept=".pdf,.csv,.xlsx,image/*" onChange={(e) => setProdFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-600" />
              </Field>

              <Field label="Or paste a link to your files" hint="Have larger files? Drop a Google Drive or Dropbox share link here instead of uploading.">
                <input className={inputClass} value={form.filesLink} onChange={set('filesLink')} placeholder="https://drive.google.com/..." />
              </Field>

              <Field label="Anything else? (goals, focus for the year, questions)">
                <textarea className={`${inputClass} min-h-[96px]`} value={form.notes} onChange={set('notes')} placeholder="Optional" />
              </Field>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full sm:w-auto bg-brand-coral text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Submit Blueprint Request'}
              </button>
              <p className="text-xs text-brand-taupe">
                Your information goes only to Brian for building your Blueprint. Don’t include client
                private or financial details.
              </p>
            </form>
          </>
        )}
      </div>
    </Layout>
  )
}
