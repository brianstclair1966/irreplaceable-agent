// Generator stage 2 — Pass A: the ASSESSMENT ("Here's who you are").
// POST { firstName, lastName, ci, production, intake }
//  -> { ok, assessment, conflict }   (conflict = Pass A's ⚠️ Confidence Note present)

import { callClaude, apiConfigured } from '@/lib/anthropic'
import { buildAssessmentPrompt } from '@/lib/assessment-prompt'
import { detectConfidenceNote } from '@/lib/blueprint-qc'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  if (!apiConfigured()) {
    return res.status(200).json({ ok: false, error: 'The generator isn’t switched on yet — Brian needs to add the API key.' })
  }

  const { firstName = '', lastName = '', ci = {}, production = '', intake = {} } = req.body || {}

  try {
    const prompt = buildAssessmentPrompt({ firstName, lastName, ci, production, intake })
    const result = await callClaude({
      system: prompt,
      messages: [{ role: 'user', content: 'Write the Assessment now.' }],
      maxTokens: 3000,
      cacheSystem: false, // prompt is per-agent; nothing static enough to cache
    })
    if (!result.ok || !result.text) {
      return res.status(502).json({ ok: false, error: 'The Assessment hit a snag. Try again.' })
    }

    return res.status(200).json({
      ok: true,
      assessment: result.text,
      conflict: detectConfidenceNote(result.text),
    })
  } catch (e) {
    console.error('assessment failed:', e)
    return res.status(500).json({ ok: false, error: 'Something went wrong building the Assessment.' })
  }
}
