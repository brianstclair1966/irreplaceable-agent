import { useEffect, useState } from 'react'
import { isCompleted, setCompleted, getAgent, logCompletion } from '@/lib/progress'

export default function CompleteButton({ module }) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDone(isCompleted(module.slug))
  }, [module.slug])

  function toggle() {
    const next = !done
    setDone(next)
    setCompleted(module.slug, next)
    logCompletion({
      slug: module.slug,
      title: module.title,
      session: module.n,
      agent: getAgent(),
      completed: next,
    })
  }

  return (
    <button
      onClick={toggle}
      className={
        done
          ? 'w-full sm:w-auto px-8 py-3 rounded-full font-semibold border-2 border-brand-navy text-brand-navy bg-white hover:bg-gray-50 transition'
          : 'w-full sm:w-auto px-8 py-3 rounded-full font-semibold bg-brand-coral text-white hover:bg-opacity-90 transition'
      }
    >
      {done ? '✓ Completed — click to undo' : 'Mark Session Complete'}
    </button>
  )
}
