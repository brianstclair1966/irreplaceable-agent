// Playbook Concierge — routes an agent's described situation to the single best
// prompt in the 6th Ave AI Playbook, and fills in the placeholders when the
// agent gave usable details. Grounded STRICTLY in the library — never invents a
// prompt, never gives general real-estate advice. Reuses the shared Anthropic
// helper + the same ANTHROPIC_API_KEY as the Coach.

import prompts from '@/data/playbook'
import { callClaude, apiConfigured, extractJson } from '@/lib/anthropic'
import { legalGuardrailForRouter } from '@/lib/legal-guardrail'

export const config = { maxDuration: 30 }

function buildCatalog() {
  return prompts
    .map((p) =>
      [
        `id: ${p.id}`,
        `title: ${p.title}`,
        `category: ${p.category}`,
        p.whenToUse ? `when: ${p.whenToUse}` : '',
        `does: ${p.whatItDoes}`,
        `prompt: ${p.prompt}`,
      ]
        .filter(Boolean)
        .join('\n')
    )
    .join('\n---\n')
}

const SYSTEM = `You are the concierge for the 6th Ave AI Playbook — a fixed library of ready-to-use AI prompts for real-estate agents. An agent describes a situation; your only job is to route them to the SINGLE best prompt from the library below, and (when their message gives you concrete details) fill that prompt's [PLACEHOLDERS] with what they told you.

Hard rules:
- Recommend ONLY from the library below. Never invent a prompt. Never give general real-estate, legal, pricing, or compliance advice — your job is routing, not coaching.
- ${legalGuardrailForRouter()}
- Pick exactly ONE prompt: the best fit. If nothing fits well, pick the closest and make clear in "why" that it's a loose match.
- Keep "why" to one short, plain sentence.
- "tailored": if the agent gave concrete specifics (an address, an objection, numbers, a message), return the chosen prompt with those specifics slotted into the matching [PLACEHOLDERS]. Do NOT invent details they didn't give. If they didn't give enough to fill anything in, return null.
- Privacy: never put a real client name, account number, or document into "tailored" — if the agent included one, replace it with a generic placeholder ("my buyer", "their bank").

Output ONLY a JSON object, nothing else:
{"promptId": "<id from the library>", "why": "<one sentence>", "tailored": "<the filled-in prompt, or null>"}

Library:
${buildCatalog()}`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  if (!apiConfigured()) {
    return res.status(200).json({ ok: false, error: 'The concierge isn’t switched on yet — Brian needs to add the API key.' })
  }

  const situation = String((req.body && req.body.situation) || '').trim().slice(0, 1200)
  if (situation.length < 3) {
    return res.status(400).json({ ok: false, error: 'Tell me a bit about your situation first.' })
  }

  const result = await callClaude({
    system: SYSTEM,
    cacheSystem: true,
    maxTokens: 1200,
    messages: [{ role: 'user', content: situation }],
  })

  if (!result.ok) {
    return res.status(502).json({ ok: false, error: 'The concierge hit a snag. Try again in a moment.' })
  }

  const parsed = extractJson(result.text)
  const match = parsed && prompts.find((p) => p.id === parsed.promptId)
  if (!parsed || !match) {
    return res.status(200).json({ ok: false, error: 'Couldn’t pin that to a prompt — try describing the situation a little differently, or browse the tiers below.' })
  }

  return res.status(200).json({
    ok: true,
    promptId: match.id,
    title: match.title,
    category: match.category,
    why: String(parsed.why || '').slice(0, 400),
    tailored: parsed.tailored && typeof parsed.tailored === 'string' ? parsed.tailored.slice(0, 4000) : null,
  })
}
