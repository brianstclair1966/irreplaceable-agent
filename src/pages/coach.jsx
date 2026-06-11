import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import AgentGate from '@/components/AgentGate'
import { PROGRAM } from '@/data/modules'
import { getAgent } from '@/lib/progress'
import { getBlueprint, setBlueprint, clearBlueprint } from '@/lib/blueprint'

// Constrained set (BUILD-ORDER: the coach is a Blueprint interpreter, not a chatbot)
const SUGGESTIONS = [
  'Help me plan this week',
  'Help me prioritize my leads',
  'I’m stuck — what’s my next move?',
  'Review my goals',
  'What would Brian tell me?',
]

export default function CoachPage() {
  const [agent, setAgentState] = useState(null)
  const [bp, setBp] = useState(null)
  const [bpDraft, setBpDraft] = useState('')
  const [editingBp, setEditingBp] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    setAgentState(getAgent())
    setBp(getBlueprint())
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  function saveBlueprint(e) {
    e.preventDefault()
    if (bpDraft.trim().length < 80) {
      setError('That looks too short to be a full Blueprint — paste the whole document.')
      return
    }
    setError('')
    setBp(setBlueprint(bpDraft))
    setBpDraft('')
    setEditingBp(false)
  }

  async function send(text) {
    const content = (text || input).trim()
    if (!content || sending || !bp?.text) return
    setError('')
    setInput('')
    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setSending(true)
    try {
      const resp = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: agent?.name || '',
          blueprint: bp.text,
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      })
      const data = await resp.json().catch(() => ({ ok: false }))
      if (!resp.ok || !data.ok) throw new Error(data.error || 'Something went wrong.')
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
      setMessages((m) => m.slice(0, -1))
      setInput(content)
    } finally {
      setSending(false)
    }
  }

  const ready = !!bp?.text && !editingBp

  return (
    <Layout>
      <Head>
        <title>Blueprint Coach — Irreplaceable Agent</title>
      </Head>

      {/* Header band */}
      <section className="bg-brand-navy text-white">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Link href="/" className="text-brand-taupe text-sm hover:text-white">
            ← Back to sessions
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mt-4">Blueprint Coach</h1>
          <p className="text-gray-200 mt-3 text-lg">
            It reads your Operating System and helps you apply it — your win-formula, your
            non-negotiables, your next move. Nothing generic.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <AgentGate onReady={setAgentState} />
          {bp?.text && (
            <p className="text-xs text-brand-taupe">
              Blueprint loaded{' '}
              <button onClick={() => { setBpDraft(bp.text); setEditingBp(true) }} className="underline hover:text-brand-coral">
                update
              </button>{' '}
              ·{' '}
              <button onClick={() => { clearBlueprint(); setBp(null); setMessages([]) }} className="underline hover:text-brand-coral">
                remove
              </button>
            </p>
          )}
        </div>

        {/* Blueprint setup */}
        {!ready && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-brand-navy mb-2">
              {editingBp ? 'Update your Operating System' : 'Load your Operating System'}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              The coach works strictly from <em>your</em> Operating System.{' '}
              <Link href="/blueprint/generate" className="text-brand-coral font-semibold underline">
                Generate your Blueprint
              </Link>{' '}
              and it loads here automatically — or paste the document Brian sent you below. It
              stays on your device.
            </p>
            <form onSubmit={saveBlueprint} className="space-y-4">
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[220px] focus:border-brand-coral focus:outline-none font-mono"
                value={bpDraft}
                onChange={(e) => setBpDraft(e.target.value)}
                placeholder="Paste your full Blueprint here…"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-brand-coral text-white font-semibold px-6 py-2.5 rounded-full hover:bg-opacity-90 transition"
                >
                  Save Blueprint
                </button>
                {editingBp && (
                  <button
                    type="button"
                    onClick={() => { setEditingBp(false); setBpDraft(''); setError('') }}
                    className="text-sm text-brand-taupe underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Chat */}
        {ready && (
          <div className="bg-white border border-gray-200 rounded-2xl flex flex-col" style={{ minHeight: '480px' }}>
            <div className="flex-1 p-5 sm:p-6 space-y-4 overflow-y-auto" style={{ maxHeight: '60vh' }}>
              {messages.length === 0 && (
                <div>
                  <p className="text-gray-700 mb-4">
                    {agent?.name ? `Hey ${agent.name.split(' ')[0]} — ` : ''}what are we working on?
                    A few places to start:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-sm border border-brand-coral text-brand-coral font-semibold px-4 py-2 rounded-full hover:bg-brand-coral hover:text-white transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={
                      m.role === 'user'
                        ? 'bg-brand-navy text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-[85%] text-sm leading-relaxed'
                        : 'bg-brand-cream text-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap'
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-brand-cream text-brand-taupe rounded-2xl rounded-bl-sm px-4 py-3 text-sm">
                    Coach is thinking…
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-gray-200 p-4">
              {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
              <form
                onSubmit={(e) => { e.preventDefault(); send() }}
                className="flex gap-2"
              >
                <input
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:border-brand-coral focus:outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your coach…"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="bg-brand-coral text-white font-semibold px-6 py-2.5 rounded-full hover:bg-opacity-90 transition disabled:opacity-50"
                >
                  Send
                </button>
              </form>
              <p className="text-[11px] text-brand-taupe mt-2">
                Coaching from your Blueprint only — not legal, contract, or compliance advice. Those
                questions go to Brian directly. Conversations aren’t saved.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
