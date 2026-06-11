import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import ModuleCard from '@/components/ModuleCard'
import ProgressBar from '@/components/ProgressBar'
import AgentGate from '@/components/AgentGate'
import modules, { PROGRAM, PHASES } from '@/data/modules'
import { getCompleted } from '@/lib/progress'

export default function Home() {
  const [completed, setCompletedState] = useState({})

  useEffect(() => {
    setCompletedState(getCompleted())
  }, [])

  const doneCount = modules.filter((m) => completed[m.slug]).length
  const phaseOrder = ['I', 'II', 'III']
  const allDone = modules.length > 0 && doneCount === modules.length
  const phaseDone = (p) => {
    const mods = modules.filter((m) => m.phase === p)
    return mods.length > 0 && mods.every((m) => completed[m.slug])
  }

  return (
    <Layout>
      <Head>
        <title>Irreplaceable Agent — 6th Ave Homes</title>
      </Head>

      {/* Hero */}
      <section className="bg-brand-cream">
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-4 text-center">
          <img
            src={PROGRAM.heroImage}
            alt="Irreplaceable Agent — a 6th Ave Homes agent system for winning in the age of AI."
            className="mx-auto w-full max-w-md sm:max-w-lg rounded-2xl shadow-lg border border-gray-200"
          />
          <p className="mt-8 text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {PROGRAM.intro}
          </p>
          <p className="mt-4 text-base italic text-brand-navy">“{PROGRAM.philosophy}”</p>
        </div>
      </section>

      {/* Progress */}
      <section className="max-w-5xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <ProgressBar done={doneCount} total={modules.length} />
          </div>
          <div className="sm:text-right">
            <AgentGate />
          </div>
        </div>
      </section>

      {/* Completion celebration */}
      {allDone && (
        <section className="max-w-5xl mx-auto px-6 mt-6">
          <div className="bg-brand-coral text-white rounded-2xl p-6 text-center shadow-md">
            <p className="text-2xl font-extrabold mb-1">🎉 You’ve completed Irreplaceable Agent!</p>
            <p className="text-white/90">
              All six sessions done. Now go run your system — and request your Blueprint if you haven’t yet.
            </p>
          </div>
        </section>
      )}

      {/* Modules by phase */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        {phaseOrder.map((p) => (
          <div key={p} className="mb-12">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-xl font-bold text-brand-navy">{PHASES[p].label}</h2>
              <div className="flex items-center gap-3">
                {phaseDone(p) && (
                  <span className="bg-brand-coral text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    ✓ Part complete
                  </span>
                )}
                <span className="text-sm text-brand-taupe">{PHASES[p].range}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules
                .filter((m) => m.phase === p)
                .map((m) => (
                  <ModuleCard key={m.slug} module={m} completed={!!completed[m.slug]} />
                ))}
            </div>
          </div>
        ))}
      </section>

      {/* Blueprint CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-brand-navy text-white rounded-2xl p-8 sm:p-10 text-center">
          <p className="text-brand-coral font-semibold uppercase tracking-widest text-xs mb-2">
            Built for you
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Build the system that fits how you win</h2>
          <p className="text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Your Blueprint is an optional, no-cost add-on built around exactly how you win. Share
            your Culture Index results and a snapshot of your past production, and Brian builds your
            operating system, decision framework, AI engine, and daily non-negotiables by hand.
          </p>
          <Link
            href={PROGRAM.blueprintPath}
            className="inline-block mt-6 bg-brand-coral text-white font-semibold px-7 py-3 rounded-full hover:bg-opacity-90 transition"
          >
            Request Your Blueprint →
          </Link>
        </div>
      </section>
    </Layout>
  )
}
