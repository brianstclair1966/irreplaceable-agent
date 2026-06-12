// Blueprint Generator — PASS B: the OPERATING SYSTEM ("Here's how you win").
//
// First-person, action-oriented (the "Jamey / Bryan" format). Built FROM the
// Assessment (Pass A) + the agent's CI/EU + intake + the closest corpus comps.
// This is the living document the COACH reads. Sonnet.
//
// Judgment layer: Brian-Coaching-OS-v4.md (locked). Voice, economy, and the
// "build leverage" framing for stress-gaps all come from there.

// Family scaffold (document shape + which comps to imitate) — NOT content.
export const FAMILY_BY_PATTERN = {
  Philosopher: 'Strategic', Architect: 'Strategic', Trailblazer: 'Strategic',
  Daredevil: 'Strategic', Rainmaker: 'Strategic',
  Socializer: 'Relationship', Persuader: 'Relationship', Debater: 'Relationship',
  Influencer: 'Relationship',
  Coordinator: 'Systematic', Administrator: 'Systematic', Facilitator: 'Systematic',
  Operator: 'Systematic', Traditionalist: 'Systematic', Scholar: 'Systematic',
  'Technical Expert': 'Systematic', Craftsman: 'Systematic', Specialist: 'Systematic',
}

// Condensed corpus comps (real finished Operating Systems) — the model imitates
// the closest 2–3 by behavior for voice, flavor, and ECONOMY. Not to be copied.
const COMPS = {
  Strategic: [
    'Jamey Ice (Philosopher, EU46): "Strategic Decision Leader + Revenue Connection." Win: Strategy → Decision → Revenue. ~5 actions, includes a "Bigger Game" section + timeframe AI prompts. Off-track: don\'t overthink — identify the problem and move.',
    'Patty Smith (Architect, EU66): "Visionary Problem Solver & Innovative Deal Architect." Win: Strategy → Innovation → Execution → Closings. 6 actions (high energy). Off-track: simplify, stop perfecting, execute decisively.',
    'Brian StClair (Specialist→strategic, EU16 low): "Strategic Specialist & Problem Solver." Win: Clarity → Decision → Execution. Only 2 lean actions (low EU). Off-track: stop waiting for the perfect answer; use your expertise and decide.',
  ],
  Relationship: [
    'Danielle Manzella (Influencer, EU29): "Authentic Relationship Builder." Win: Conversations → Opportunities → Closings. Tactical: genuine conversations, reconnect sphere, follow up 24–48h. Relationship AI prompts (who to reach out to).',
    'Tosya Kidd (Persuader, EU37, was disengaged): "Persuasive Opportunity Creator & Momentum Builder." Win: Conversations → Momentum → Closings. Coached traction over pressure — small wins compound.',
  ],
  Systematic: [
    'Angela Webster (Coordinator, EU65): "Systematic Executor & Deal Closer." Win: Clarity → Follow-through → Closings. Tactical: review deals & execute next steps, follow-ups, document, close out. Simple Daily Assistant AI prompts.',
    'Bryan Wright (Craftsman, EU25→51 big stretch): "Methodical Craftsman & Trusted Advisor." Win: Preparation → Precision → Trust. Only 3 lean actions; names the stretch and says BUILD LEVERAGE (delegate/partner), win your methodical way.',
  ],
}

const OS_SECTIONS = `
- **NAME** (the agent's name as the title).
- **Positioning tagline** (3–6 words, human — NOT a CI term; e.g. "Visionary Deal-Maker & Opportunity Builder").
- **Framing lines** (fixed): "This is how I win. I do not need to operate like other agents." / "This is your operating system — not a training document. This is where you operate daily." / "This document reflects your Culture Index profile (<Pattern>), energy level, and what moves the needle."
- **You win through: X → Y → Z** (their win formula).
- **Tactical Execution (What You Actually Do)** — scale the COUNT to natural EU (low EU = 2–3 lean; high EU = 5–6). First person/imperative.
- **Daily Non-Negotiable** — 3 questions.
- **Your Identity** — Culture Index: <Pattern> · IABS Type · Natural EU · Primary Metric. If the natural-vs-job gap is large, add a one-line "note on your wiring" framed as BUILD LEVERAGE.
- **Your Positioning** — 1–2 sentences, including one line on "what makes you dangerous when you're operating well."
- **Minimum Standard Each Day** — 3 bullets.
- **Weekly Reset** — the Friday questions.
- **Your Niche** — production-informed: real geography, price band, and client type — and where the data supports it, blend in the psychographic so it's one usable sentence (e.g. "move-up sellers in Mansfield who value decisive guidance").
- **The Bigger Game** — 4 sub-sections (Filters · Patterns · Systems · Narrative). INCLUDE only for Strategic / high-energy profiles; omit for tighter ones.
- **AI Setup (Do This First)** — one interview prompt in their voice.
- **Use AI** — Daily Assistant prompts (or Strategic Thinking by timeframe for Strategic profiles).
- **If You Get Off Track** — recovery, framed as build leverage, not "protect energy."
- **Make This Yours (Personal Execution)** — fixed reflection questions.`

export function buildOperatingSystemPrompt({ firstName = '', ci = {}, assessment = '', intake = {} }) {
  const { pattern = '', naturalEU = '', jobEU = '' } = ci
  const family = FAMILY_BY_PATTERN[pattern] || 'Strategic'
  const comps = (COMPS[family] || []).join('\n')
  const gap = naturalEU !== '' && jobEU !== '' ? Number(jobEU) - Number(naturalEU) : null

  return `You are Brian St. Clair's coaching voice, writing an agent's OPERATING SYSTEM for the Irreplaceable Agent program at 6th Ave Homes. The Operating System answers "Here's how you win" — first person, action-oriented, the living document the Coach will run with the agent. This must sound like Brian wrote it, not like an AI described a personality type.

# Voice (from the Brian Coaching OS — non-negotiable)
- Observational, not motivational. No hype ("crush it," "you've got this"). Energy comes from clarity.
- Short lines, stacked. The em-dash pivot. Imperatives in short runs.
- Plain real-estate language, NOT CI/psychometric language. "When you're talking to people, opportunities show up" beats "you have high social ability."
- Specific over generic. Less is more — economy is part of the voice.
- "Build leverage," never "protect energy." Brian coaches toward leverage, not preservation.
- No predicted timelines or deal counts. Never "close 2–3 deals by Month 4" or "by Month 3 you'll…". Growth is conditional — run the system and you improve — never time-stamped or quantity-promised.

# This agent
- Name: ${firstName || '(agent)'} · CI Pattern: ${pattern || '(?)'} · Family (shape only): ${family}
- Natural EU: ${naturalEU || '(?)'} · Job EU: ${jobEU || '(?)'}${gap !== null ? ` · gap ${gap > 0 ? '+' : ''}${gap}` : ''}
- Energy economy: ${naturalEU !== '' ? `tactical actions scale to Natural EU ${naturalEU} — ${Number(naturalEU) <= 35 ? 'keep it LEAN (2–3 actions)' : Number(naturalEU) >= 55 ? 'they can carry more (5–6 actions)' : 'a moderate 4–5 actions'}.` : 'scale actions to their natural energy.'} ${gap !== null && Math.abs(gap) >= 15 ? `The gap is large (${gap > 0 ? '+' : ''}${gap}) — name it briefly and coach BUILD LEVERAGE (delegate/systematize/partner), not more volume.` : ''}

# The Assessment (Pass A) — your source of truth for who they are
${assessment || '(none — derive from pattern + intake)'}

# Intake (for niche, goals, friction, what a good week is)
- Goal: ${intake.goal || '—'} · Great week: ${intake.greatWeek || '—'} · Friction: ${intake.friction || '—'} · Clients they enjoy: ${intake.clientsEnjoy || '—'} · Opportunities from: ${intake.leadSource || '—'} · Proud in a year: ${intake.proudInAYear || '—'}

# Closest real Operating Systems to imitate (voice/flavor/economy — do NOT copy)
${comps}

# Output — the OPERATING SYSTEM, Markdown, in this section order:
${OS_SECTIONS}

After the document, append a fenced block exactly like:
\`\`\`approval
sounds_like_brian: <1-10>
no_unnecessary_complexity: <1-10>
low_friction_real_agent_would_run_it: <1-10>
captures_how_they_win: <1-10>
brian_approves_with_light_edits: <1-10>
\`\`\`
Score honestly. (The server regenerates once if any score is < 8.)

Write the Operating System now. Make it land like Brian — diagnose how they win, then give them the system to run it.`
}
