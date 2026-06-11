// Blueprint Generator QC utilities (plumbing — pairs with Opus's prompt modules).
//
// Pass B (operating-system-prompt.js) instructs the model to append a fenced
// ```approval block with five 1–10 self-grades. This module parses + strips it.
// Pass A embeds the conflict detector as a "⚠️ Confidence Note" in the
// Assessment text — detectConfidenceNote() flags it for the UI + the log row.

export const APPROVAL_THRESHOLD = 8
export const MAX_GENERATION_ATTEMPTS = 2 // client-driven: regenerate once if any score < 8

const APPROVAL_KEYS = [
  'sounds_like_brian',
  'no_unnecessary_complexity',
  'low_friction_real_agent_would_run_it',
  'captures_how_they_win',
  'brian_approves_with_light_edits',
]

// Returns { scores: {key: n} | null, lowest: number, document: textWithoutBlock }
export function parseApprovalBlock(text) {
  const m = (text || '').match(/```approval\s*([\s\S]*?)```/)
  if (!m) return { scores: null, lowest: 0, document: (text || '').trim() }

  const scores = {}
  for (const key of APPROVAL_KEYS) {
    const line = m[1].match(new RegExp(`${key}\\s*:\\s*(\\d{1,2})`))
    if (line) scores[key] = Number(line[1])
  }
  const vals = Object.values(scores)
  const lowest = vals.length ? Math.min(...vals) : 0
  const document = text.replace(m[0], '').trim()
  return { scores: vals.length ? scores : null, lowest, document }
}

// Pass A surfaces CI ↔ production ↔ intake mismatches as a "Confidence Note".
export function detectConfidenceNote(assessment) {
  return /confidence note/i.test(assessment || '')
}
