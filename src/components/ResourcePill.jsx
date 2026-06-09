const ICONS = {
  pdf: '📄',
  sheet: '📊',
  slides: '🖼️',
  doc: '📝',
  video: '▶️',
  link: '🤖',
  survey: '🧭',
  blueprint: '📐',
}

export default function ResourcePill({ label, meta, type, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 bg-white border border-brand-coral/40 text-brand-navy rounded-full pl-3 pr-4 py-2 text-sm font-medium hover:bg-brand-coral hover:text-white hover:border-brand-coral transition shadow-sm"
    >
      <span aria-hidden>{ICONS[type] || '🔗'}</span>
      <span>{label}</span>
      {meta && (
        <span className="text-xs text-brand-taupe group-hover:text-white/80">· {meta}</span>
      )}
    </a>
  )
}
