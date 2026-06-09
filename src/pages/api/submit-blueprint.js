// Receives a Blueprint request (agent info + production fields + optional
// base64 file uploads) and forwards it to the same Google Apps Script web app
// used for completion logging (IA_SHEET_WEBHOOK_URL). The Apps Script branches
// on `kind: 'blueprint'` to save files to Drive and append to a requests tab.
//
// Note: Vercel caps serverless request bodies around 4.5MB, so the client limits
// total upload size. Large files can be shared via the "link" field instead.

export const config = {
  api: {
    bodyParser: { sizeLimit: '6mb' },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const webhook = process.env.IA_SHEET_WEBHOOK_URL
  if (!webhook) {
    return res
      .status(200)
      .json({ ok: false, error: 'Submissions are not configured yet — please email Brian directly.' })
  }

  try {
    const body = req.body || {}
    const resp = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'blueprint', ...body, timestamp: new Date().toISOString() }),
    })
    const ok = resp.ok
    return res.status(ok ? 200 : 502).json({ ok })
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) })
  }
}
