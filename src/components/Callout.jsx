// Inline highlight boxes used to break up long lessons and surface key beats.
// kinds: 'coach-tip' | 'brians-take' | 'miss-this'

const KINDS = {
  'coach-tip': { label: 'Coach Tip', icon: '🎯' },
  'brians-take': { label: 'Brian’s Take', icon: '💬' },
  'miss-this': { label: 'Most Agents Miss This', icon: '⚡' },
}

export default function Callout({ kind = 'coach-tip', text, children }) {
  const k = KINDS[kind] || KINDS['coach-tip']
  return (
    <div className="my-6 rounded-xl border-l-4 border-brand-coral bg-brand-cream/70 p-4 sm:p-5">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-coral mb-2">
        <span aria-hidden>{k.icon}</span>
        {k.label}
      </p>
      <p className="text-gray-800 leading-relaxed">{text || children}</p>
    </div>
  )
}
