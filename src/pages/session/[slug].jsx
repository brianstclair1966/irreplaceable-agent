import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import VideoEmbed from '@/components/VideoEmbed'
import ResourcePill from '@/components/ResourcePill'
import Callout from '@/components/Callout'
import CompleteButton from '@/components/CompleteButton'
import BlueprintPrep from '@/components/BlueprintPrep'
import modules, { getModule, PHASES } from '@/data/modules'

const CI_SURVEY_URL = 'https://surveys.cultureindex.com/s/dsK5s9LYO8/78525'

function Scripts({ scripts }) {
  if (!scripts || !scripts.length) return null
  return (
    <div className="space-y-4 mt-4">
      {scripts.map((s, i) => (
        <div key={i} className="border-l-4 border-brand-coral bg-brand-cream rounded-r-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-coral mb-2">
            {s.label}
          </p>
          <div className="space-y-2">
            {s.lines.map((line, j) => (
              <p key={j} className="text-gray-800 italic leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SessionPage({ module, prev, next }) {
  // Scroll to a deep-linked section (e.g. from search results) after load.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    }
  }, [module])

  if (!module) return null

  return (
    <Layout>
      <Head>
        <title>{`Session ${module.n}: ${module.title} — Irreplaceable Agent`}</title>
      </Head>

      {/* Header band */}
      <section className="bg-brand-navy text-white">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Link href="/" className="text-brand-taupe text-sm hover:text-white">
            ← All sessions
          </Link>
          <p className="text-brand-coral font-semibold uppercase tracking-widest text-xs mt-4 mb-2">
            {PHASES[module.phase].label} · {module.theme}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            Session {module.n}: {module.title}
          </h1>
          <p className="text-gray-200 mt-3 text-lg">{module.tagline}</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 py-10 prose-body">
        {/* Video */}
        <VideoEmbed id={module.video} title={module.title} />

        {/* Watch links */}
        <div className="flex flex-wrap gap-3 mt-5">
          <ResourcePill label="Session Notes" meta="Google Doc" type="doc" url={module.notesUrl} />
          <ResourcePill label="Slides" meta="PDF" type="slides" url={module.slidesUrl} />
        </div>

        {/* Intro */}
        {module.intro && <p className="mt-8 text-gray-700 text-lg leading-relaxed">{module.intro}</p>}

        {/* Session 5: CI reminder before they build */}
        {module.slug === 'building-the-blueprint' && (
          <div className="mt-6 bg-brand-cream border border-brand-coral/40 rounded-2xl p-5">
            <p className="text-sm text-gray-800 leading-relaxed">
              <span className="font-semibold text-brand-navy">Before you build:</span> make sure Brian
              has your Culture Index — you’ll add it when you generate your Blueprint. Haven’t done it
              yet?{' '}
              <a
                href={CI_SURVEY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-coral font-semibold underline hover:opacity-80"
              >
                Take the survey
              </a>{' '}
              (~10 min), then text Brian so he can send it to you.
            </p>
          </div>
        )}

        {/* Why it matters */}
        {module.whyItMatters && module.whyItMatters.length > 0 && (
          <div id="why-it-matters" className="scroll-mt-24 mt-8 bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-brand-navy mb-3">Why this matters</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {module.whyItMatters.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Lesson */}
        {module.lesson && module.lesson.length > 0 && (
          <div className="mt-10 space-y-8">
            {module.lesson.map((sec, i) => (
              <section key={i} id={`s-${i}`} className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-brand-navy mb-3">{sec.heading}</h2>
                {sec.paras &&
                  sec.paras.map((p, j) => (
                    <p key={j} className="text-gray-700 leading-relaxed">
                      {p}
                    </p>
                  ))}
                {sec.list && (
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                    {sec.list.map((li, j) => (
                      <li key={j}>{li}</li>
                    ))}
                  </ul>
                )}
                <Scripts scripts={sec.scripts} />
                {sec.resourceRefs && sec.resourceRefs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {sec.resourceRefs
                      .map((ref) => module.resources.find((r) => r.label === ref))
                      .filter(Boolean)
                      .map((r) => (
                        <ResourcePill key={r.label} {...r} />
                      ))}
                  </div>
                )}
                {sec.callout && <Callout kind={sec.callout.kind} text={sec.callout.text} />}
              </section>
            ))}
          </div>
        )}

        {/* Action steps */}
        <h2 id="action-steps" className="scroll-mt-24 text-2xl font-bold text-brand-navy mt-12 mb-4">Do This Week</h2>
        <ol className="space-y-3">
          {module.actionSteps.map((step, i) => (
            <li key={i} className="flex gap-3 bg-white border border-gray-200 rounded-xl p-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-coral text-white font-bold flex items-center justify-center text-sm">
                {i + 1}
              </span>
              <span className="text-gray-800">{step}</span>
            </li>
          ))}
        </ol>

        {/* Pitfalls */}
        {module.pitfalls && module.pitfalls.length > 0 && (
          <>
            <h2 id="pitfalls" className="scroll-mt-24 text-2xl font-bold text-brand-navy mt-10 mb-4">Pitfalls to Avoid</h2>
            <ul className="space-y-2">
              {module.pitfalls.map((p, i) => (
                <li key={i} className="flex gap-3 text-gray-700">
                  <span className="text-brand-coral font-bold" aria-hidden>
                    ⚠
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Rhythm */}
        {module.rhythm && module.rhythm.length > 0 && (
          <div id="rhythm" className="scroll-mt-24 mt-10 bg-brand-navy text-white rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3">Your Rhythm</h2>
            <ul className="space-y-2">
              {module.rhythm.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-brand-coral" aria-hidden>
                    ▸
                  </span>
                  <span className="text-gray-100">{r}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-brand-taupe mt-4">
              Apply one thing this session — that’s how this works.
            </p>
          </div>
        )}

        {/* Vision */}
        {module.vision && (
          <p id="vision" className="scroll-mt-24 mt-8 text-lg italic text-brand-navy border-l-4 border-brand-coral pl-4">
            {module.vision}
          </p>
        )}

        {/* Resources */}
        <h2 id="resources" className="scroll-mt-24 text-2xl font-bold text-brand-navy mt-12 mb-4">Resources</h2>
        <div className="flex flex-wrap gap-3">
          {module.resources.map((r, i) => (
            <ResourcePill key={i} {...r} />
          ))}
        </div>

        {/* Session 4: get the Culture Index started before Session 5 builds the Blueprint */}
        {module.slug === 'using-ai-the-right-way' && (
          <div className="mt-12">
            <BlueprintPrep />
          </div>
        )}

        {/* Complete */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <CompleteButton module={module} />
        </div>
      </article>

      {/* Prev / Next */}
      <nav className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex justify-between gap-4">
          {prev ? (
            <Link
              href={`/session/${prev.slug}`}
              className="flex-1 bg-white border border-gray-200 rounded-xl p-4 hover:border-brand-coral transition"
            >
              <span className="text-xs text-brand-taupe">← Session {prev.n}</span>
              <span className="block font-semibold text-brand-navy">{prev.title}</span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/session/${next.slug}`}
              className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-right hover:border-brand-coral transition"
            >
              <span className="text-xs text-brand-taupe">Session {next.n} →</span>
              <span className="block font-semibold text-brand-navy">{next.title}</span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </nav>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: modules.map((m) => ({ params: { slug: m.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const module = getModule(params.slug) || null
  const idx = modules.findIndex((m) => m.slug === params.slug)
  const prev = idx > 0 ? pick(modules[idx - 1]) : null
  const next = idx < modules.length - 1 ? pick(modules[idx + 1]) : null
  return { props: { module, prev, next } }
}

function pick(m) {
  return { slug: m.slug, n: m.n, title: m.title }
}
