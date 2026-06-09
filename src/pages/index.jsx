import { useEffect, useState } from 'react'
import Head from 'next/head'
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

      {/* Modules by phase */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        {phaseOrder.map((p) => (
          <div key={p} className="mb-12">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-xl font-bold text-brand-navy">{PHASES[p].label}</h2>
              <span className="text-sm text-brand-taupe">{PHASES[p].range}</span>
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
    </Layout>
  )
}
