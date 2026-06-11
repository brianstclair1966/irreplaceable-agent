// Brian Coach Voice Agent — chat endpoint.
//
// POST { firstName, blueprint, messages: [{ role: 'user'|'assistant', content }] }
//  ->  { ok: true, reply }
//
// Calls the Anthropic Messages API directly (no SDK dependency) with a
// Brian-voice system prompt grounded strictly in the agent's Blueprint.
// Requires env var ANTHROPIC_API_KEY (set in Vercel project settings).
// Model: Sonnet — locked per Blueprint-Generator-Build-Spec.md §8.

import {
  buildCoachSystemPrompt,
  MAX_HISTORY_MESSAGES,
  MAX_BLUEPRINT_CHARS,
  MAX_MESSAGE_CHARS,
} from '@/lib/coach-prompt'

const MODEL = process.env.COACH_MODEL || 'claude-sonnet-4-6'

// Give the model time to respond (Vercel default can be as low as 10s).
export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(200).json({
      ok: false,
      error: 'The coach isn’t switched on yet — Brian needs to add the API key.',
    })
  }

  const { firstName = '', blueprint = '', messages = [] } = req.body || {}

  if (!blueprint || typeof blueprint !== 'string' || blueprint.trim().length < 80) {
    return res.status(400).json({
      ok: false,
      error: 'No Blueprint loaded. Paste your Blueprint on the coach page first.',
    })
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ ok: false, error: 'No message to respond to.' })
  }

  // Sanitize: only role/content, valid roles, capped lengths, capped history.
  const history = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }))
  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return res.status(400).json({ ok: false, error: 'Last message must be from you.' })
  }

  const system = buildCoachSystemPrompt({
    firstName: String(firstName).split(' ')[0].slice(0, 40),
    blueprint: blueprint.slice(0, MAX_BLUEPRINT_CHARS),
  })

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        // Cache the long, static system prompt (Blueprint changes rarely per agent).
        system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
        messages: history,
      }),
    })

    const data = await resp.json().catch(() => null)
    if (!resp.ok || !data) {
      const detail = data?.error?.message || `Anthropic API error (${resp.status})`
      console.error('Coach API error:', detail)
      return res.status(502).json({ ok: false, error: 'The coach hit a snag. Try again in a moment.' })
    }

    const reply = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim()

    if (!reply) {
      return res.status(502).json({ ok: false, error: 'The coach came back empty. Try again.' })
    }
    return res.status(200).json({ ok: true, reply })
  } catch (e) {
    console.error('Coach request failed:', e)
    return res.status(500).json({ ok: false, error: 'The coach hit a snag. Try again in a moment.' })
  }
}
