// Shared Anthropic Messages API helper (used by the Coach and the Blueprint
// Generator). Plain fetch — no SDK dependency. Requires ANTHROPIC_API_KEY.

const DEFAULT_MODEL = process.env.COACH_MODEL || 'claude-sonnet-4-6'

export function apiConfigured() {
  return !!process.env.ANTHROPIC_API_KEY
}

// callClaude({ system, messages, maxTokens, model, cacheSystem })
// - system: string (will be sent as a single text block; cached if cacheSystem)
// - messages: [{ role, content }] — content may be a string OR an array of
//   content blocks (e.g. document blocks for PDF input).
// Returns { ok: true, text } or { ok: false, error, status }.
export async function callClaude({ system, messages, maxTokens = 1500, model = DEFAULT_MODEL, cacheSystem = false }) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return { ok: false, error: 'ANTHROPIC_API_KEY not configured', status: 0 }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: cacheSystem
          ? [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }]
          : system,
        messages,
      }),
    })

    const data = await resp.json().catch(() => null)
    if (!resp.ok || !data) {
      const detail = data?.error?.message || `Anthropic API error (${resp.status})`
      console.error('callClaude error:', detail)
      return { ok: false, error: detail, status: resp.status }
    }

    const text = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim()
    return { ok: true, text }
  } catch (e) {
    console.error('callClaude failed:', e)
    return { ok: false, error: String(e), status: 0 }
  }
}

// Extract the first JSON object from a model reply (models sometimes wrap JSON
// in prose or code fences). Returns null on failure — caller decides fallback.
export function extractJson(text) {
  if (!text) return null
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced ? fenced[1] : text
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    return JSON.parse(candidate.slice(start, end + 1))
  } catch {
    return null
  }
}
