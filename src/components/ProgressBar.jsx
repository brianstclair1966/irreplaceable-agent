export default function ProgressBar({ done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-brand-navy">
          {done} of {total} sessions complete
        </span>
        <span className="text-xs text-brand-taupe">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-gray-200">
        <div
          className="h-full bg-brand-coral transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
