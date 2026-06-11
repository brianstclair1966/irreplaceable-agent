// Logs a weekly check-in (win / friction / non-negotiables) to the broker Google
// Sheet via the same Apps Script web app used for completions and Blueprint
// requests (IA_SHEET_WEBHOOK_URL). The Apps Script branches on kind: 'checkin'
// and appends a row to the "Weekly Check-ins" tab.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const webhook = process.env.IA_SHEET_WEBHOOK_URL
  if (!webhook) {
    return res.status(200).json({ ok: false, error: 'Check-ins aren’t configured yet.' })
  }

  try {
    const body = req.body || {}
    const resp = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'checkin', ...body, timestamp: new Date().toISOString() }),
    })
    return res.status(resp.ok ? 200 : 502).json({ ok: resp.ok })
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) })
  }
}
