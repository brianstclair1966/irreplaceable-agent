import Link from 'next/link'

export default function ModuleCard({ module, completed }) {
  return (
    <Link
      href={`/session/${module.slug}`}
      className="group flex flex-col h-full bg-white rounded-2xl border border-gray-200 hover:border-brand-coral hover:shadow-lg transition p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="bg-brand-coral text-white text-xs font-bold px-2.5 py-1 rounded-full">
          Session {module.n}
        </span>
        {completed && (
          <span className="text-brand-navy text-xs font-bold inline-flex items-center gap-1">
            ✓ Done
          </span>
        )}
      </div>

      <p className="text-xs font-semibold text-brand-coral uppercase tracking-wide mb-1">
        {module.theme}
      </p>
      <h3 className="text-lg font-bold text-brand-navy leading-snug group-hover:text-brand-coral transition">
        {module.title}
      </h3>
      <p className="text-sm text-gray-500 mt-2 leading-relaxed flex-1">{module.tagline}</p>

      <span className="inline-block mt-4 text-sm font-semibold text-brand-coral">
        Open session →
      </span>
    </Link>
  )
}
