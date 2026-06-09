// Logs a module completion event to a Google Sheet.
// Set IA_SHEET_WEBHOOK_URL in your environment to a Google Apps Script
// Web App URL (see README). If it isn't set, the call succeeds as a no-op so
// the app keeps working without tracking configured.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const webhook = process.env.IA_SHEET_WEBHOOK_URL
  if (!webhook) {
    return res.status(200).json({ ok: true, logged: false, reason: 'no webhook configured' })
  }

  try {
    const { name, email, slug, title, session, completed, timestamp } = req.body || {}
    const resp = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, slug, title, session, completed, timestamp }),
    })
    const ok = resp.ok
    return res.status(200).json({ ok, logged: ok })
  } catch (e) {
    return res.status(200).json({ ok: false, logged: false, error: String(e) })
  }
}
