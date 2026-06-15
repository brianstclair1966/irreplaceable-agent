import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Unlock() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (data.ok) {
        const next =
          typeof router.query.next === 'string' && router.query.next.startsWith('/')
            ? router.query.next
            : '/'
        router.replace(next)
      } else {
        setError(data.error || 'That code didn’t match.')
      }
    } catch (e) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Enter access code — 6th Ave Homes</title>
      </Head>
      <main className="min-h-screen bg-brand-cream flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-200 p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-coral">
            6th Ave Homes
          </p>
          <h1 className="mt-2 text-2xl font-bold text-brand-navy">
            This training is for our agents
          </h1>
          <p className="mt-2 text-gray-600">Enter your access code to continue.</p>
          <form onSubmit={submit} className="mt-6">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Access code"
              autoFocus
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20"
            />
            {error && <p className="mt-3 text-sm text-brand-coral font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-brand-navy px-6 py-3 font-semibold text-white transition hover:bg-brand-navy/90 disabled:opacity-50"
            >
              {loading ? 'Checking…' : 'Unlock'}
            </button>
          </form>
          <p className="mt-5 text-xs text-brand-taupe">Don’t have a code? Ask your broker.</p>
        </div>
      </main>
    </>
  )
}
