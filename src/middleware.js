import { NextResponse } from 'next/server'

// Shared-password gate for 6th Ave training apps.
// The overview/index stays public; the lesson + tool routes in `matcher` (below)
// are locked until the visitor enters the access code, set as SITE_PASSCODE in
// the Vercel project. FAIL-OPEN: if SITE_PASSCODE is not set, nothing is locked —
// so deploying this never bricks the app, and the gate switches on only once the
// code is configured.

const COOKIE = 'ta_gate'
const SALT = '::6thave-gate'

async function sha256Hex(str) {
  const data = new TextEncoder().encode(str)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(req) {
  const passcode = process.env.SITE_PASSCODE
  if (!passcode) return NextResponse.next() // gate off until configured

  const expected = await sha256Hex(passcode + SALT)
  const token = req.cookies.get(COOKIE)?.value
  if (token === expected) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/unlock'
  url.searchParams.set('next', req.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  // Lessons, the AI Playbook, the coach, and the Blueprint tools. Index stays public.
  matcher: ['/session/:path*', '/playbook', '/coach', '/blueprint', '/blueprint/:path*'],
}
