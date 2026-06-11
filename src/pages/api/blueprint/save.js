// Generator stage 4: SAVE EVERYTHING (Chet — the future analytics goldmine)
// + notify Brian. Posts to the existing Apps Script webhook
// (IA_SHEET_WEBHOOK_URL) with kind: 'blueprint-generation'.
//
// ⚠️ Apps Script update required (Brian/Opus): branch on kind
// 'blueprint-generation' → save CI extraction, intake, Assessment, and
// Operating System into the agent's Drive folder under versioned
// `Generated Drafts`, append a log row (agent, timestamp, approval scores,
// conflict flag, ciProvided), and email/ping Brian.

export const config = { api: { bodyParser: { sizeLimit: '4mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const webhook = process.env.IA_SHEET_WEBHOOK_URL
  if (!webhook) {
    // Don't block the agent's flow — they already have their documents client-side.
    return res.status(200).json({ ok: false, error: 'Saving isn’t configured yet.' })
  }

  try {
    const body = req.body || {}
    const resp = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'blueprint-generation',
        name: body.name || '',
        email: body.email || '',
        ciProvided: !!body.ciProvided,
        conflict: !!body.conflict,
        scores: body.scores || null,
        ci: body.ci || null,
        productionSummary: body.productionSummary || '',
        intake: body.intake || null,
        assessment: body.assessment || '',
        operatingSystem: body.operatingSystem || '',
        notifyBrian: true,
        timestamp: new Date().toISOString(),
      }),
    })
    return res.status(resp.ok ? 200 : 502).json({ ok: resp.ok })
  } catch (e) {
    console.error('save failed:', e)
    return res.status(500).json({ ok: false, error: String(e) })
  }
}
