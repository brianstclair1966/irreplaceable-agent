import crypto from 'crypto'

// Verifies the shared access code and, on success, sets an httpOnly cookie that
// the middleware checks. The cookie value is a hash of the passcode (+ salt), so
// it can't be forged without knowing the code. Set SITE_PASSCODE in Vercel.

const COOKIE = 'ta_gate'
const SALT = '::6thave-gate'
const MAX_AGE = 60 * 60 * 24 * 90 // 90 days

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  const passcode = process.env.SITE_PASSCODE
  if (!passcode) {
    return res.status(200).json({ ok: false, error: 'The gate isn’t switched on yet.' })
  }
  const code = String((req.body && req.body.code) || '').trim()
  if (!code || code !== passcode) {
    return res.status(401).json({ ok: false, error: 'That code didn’t match. Try again.' })
  }
  const token = crypto.createHash('sha256').update(passcode + SALT).digest('hex')
  res.setHeader(
    'Set-Cookie',
    `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${MAX_AGE}`
  )
  return res.status(200).json({ ok: true })
}
