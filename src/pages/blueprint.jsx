// RETIRED: the hand-built "Request Your Blueprint" form is replaced by the
// Blueprint Generator (/blueprint/generate). This route redirects so existing
// links (home-page CTA, session content, emails) keep working.

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function BlueprintRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/blueprint/generate')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <p className="text-sm text-brand-taupe">
        Taking you to your Blueprint…{' '}
        <Link href="/blueprint/generate" className="underline text-brand-coral">click here</Link> if nothing happens.
      </p>
    </div>
  )
}
