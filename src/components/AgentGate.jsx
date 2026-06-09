import { useEffect, useState } from 'react'
import { getAgent, setAgent } from '@/lib/progress'

// Lightweight one-time capture of agent name + email so completion logging
// can attribute progress. Stored locally; shown only until filled in.
export default function AgentGate({ onReady }) {
  const [agent, setLocal] = useState(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })

  useEffect(() => {
    const a = getAgent()
    setLocal(a)
    if (onReady) onReady(a)
  }, [onReady])

  function save(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    const saved = setAgent({ name: form.name.trim(), email: form.email.trim() })
    setLocal(saved)
    setOpen(false)
    if (onReady) onReady(saved)
  }

  if (agent) {
    return (
      <p className="text-xs text-brand-taupe">
        Tracking progress for <span className="font-semibold text-brand-navy">{agent.name}</span>{' '}
        <button onClick={() => setOpen(true)} className="underline hover:text-brand-coral">
          change
        </button>
      </p>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-brand-coral underline"
      >
        Add your name to track progress
      </button>
    )
  }

  return (
    <form onSubmit={save} className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
      <div className="flex flex-col">
        <label className="text-xs text-brand-navy font-semibold mb-1">Name</label>
        <input
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your name"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-brand-navy font-semibold mb-1">Email</label>
        <input
          type="email"
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@6thavehomes.com"
        />
      </div>
      <button
        type="submit"
        className="bg-brand-coral text-white text-sm font-semibold px-4 py-2 rounded hover:bg-opacity-90 transition"
      >
        Save
      </button>
    </form>
  )
}
