// Blueprint prep request — fired from the start-of-IA prep card so Brian can
// pull the agent's Culture Index + production AHEAD of Session 5.
//
// ⚠️ Apps Script update required (mirrors the other kind handlers):
// kind: 'blueprint-prep-request' → append to "Blueprint Prep Queue" tab:
//   name, email, hasCI (yes/no), ciUploaded (yes/no), requestedAt, Status
//   (Pending → Pulled → Ready, Brian marks it)
// + notify Brian (same notify path as 'blueprint-generation').
// If a CI file is attached (ciFile: {name, type, dataBase64}), save it to the
// agent's Drive folder. No new OAuth scopes — Sheets + Drive, same as current.

export const config = { api: { bodyParser: { sizeLimit: '4mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const webhook = process.env.IA_SHEET_WEBHOOK_URL
  if (!webhook) {
    return res.status(200).json({ ok: false, error: 'Blueprint prep isn’t configured yet.' })
  }

  const { name = '', email = '', hasCI = false, ciFile = null } = req.body || {}
  if (!name.trim() || !email.trim()) {
    return res.status(400).json({ ok: false, error: 'Missing name or email.' })
  }

  try {
    const resp = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'blueprint-prep-request',
        name: name.trim(),
        email: email.trim(),
        hasCI: !!hasCI,
        ciUploaded: !!ciFile,
        ciFile: ciFile || null,
        notifyBrian: true,
        requestedAt: new Date().toISOString(),
      }),
    })
    return res.status(resp.ok ? 200 : 502).json({ ok: resp.ok })
  } catch (e) {
    console.error('prep-request failed:', e)
    return res.status(500).json({ ok: false, error: String(e) })
  }
}
