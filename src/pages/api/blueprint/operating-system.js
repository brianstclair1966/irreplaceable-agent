// Generator stage 3 — Pass B: the OPERATING SYSTEM ("Here's how you win").
// POST { firstName, ci, assessment, intake, attempt }
//  -> { ok, operatingSystem, scores, lowest, needsRetry }
//
// Pass B self-grades via the ```approval block (Brian Approval Score).
// If any score < 8 and attempt < MAX_GENERATION_ATTEMPTS, the CLIENT calls
// again with attempt+1 (client-driven retry keeps each invocation inside the
// Vercel timeout). After the cap, the draft is surfaced WITH its scores.

import { callClaude, apiConfigured } from '@/lib/anthropic'
import { buildOperatingSystemPrompt } from '@/lib/operating-system-prompt'
import { parseApprovalBlock, APPROVAL_THRESHOLD, MAX_GENERATION_ATTEMPTS } from '@/lib/blueprint-qc'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  if (!apiConfigured()) {
    return res.status(200).json({ ok: false, error: 'The generator isn’t switched on yet — Brian needs to add the API key.' })
  }

  const { firstName = '', ci = {}, assessment = '', intake = {}, attempt = 1 } = req.body || {}
  if (!assessment) {
    return res.status(400).json({ ok: false, error: 'Missing the Assessment (run Pass A first).' })
  }

  try {
    const prompt = buildOperatingSystemPrompt({ firstName, ci, assessment, intake })
    const result = await callClaude({
      system: prompt,
      messages: [{ role: 'user', content: 'Write the Operating System now.' }],
      maxTokens: 2500,
    })
    if (!result.ok || !result.text) {
      return res.status(502).json({ ok: false, error: 'The Operating System hit a snag. Try again.' })
    }

    const { scores, lowest, document } = parseApprovalBlock(result.text)
    const needsRetry = !!scores && lowest < APPROVAL_THRESHOLD && Number(attempt) < MAX_GENERATION_ATTEMPTS

    return res.status(200).json({
      ok: true,
      operatingSystem: document,
      scores,
      lowest,
      needsRetry,
      attempt: Number(attempt),
    })
  } catch (e) {
    console.error('operating-system failed:', e)
    return res.status(500).json({ ok: false, error: 'Something went wrong building the Operating System.' })
  }
}
