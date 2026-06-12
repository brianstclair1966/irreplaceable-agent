// Blueprint Generator — PASS A: the ASSESSMENT ("Here's who you are").
//
// A third-person, diagnostic profile (the "Billy Mullen" format) — the Week-5
// reveal that makes an agent feel "the system studied me." Generated from the
// agent's Culture Index + production + the 6 intake answers. Sonnet.
//
// Governing principles (Brian-Coaching-OS-v4.md, locked):
//   1. The finished Blueprint corpus is the source of truth, not CI theory.
//   2. Coaching effectiveness beats CI technical accuracy.
//   3. Coach the person, not the profile — the CI label is overridable by the
//      agent's actual production behavior and intake answers (the Chase guardrail).
//
// Conflict detection lives here: this pass sees CI + production + intake together,
// so if they describe different people it must say so (see CONFIDENCE NOTE below).

const ASSESSMENT_SECTIONS = `
1. **Title** — "<FULL NAME>" then "(<CI Pattern>)".
2. **Archetype line** — a short human label for how they win (e.g. "Problem Solver & Opportunity Creator"). Not a CI term — a real-estate-coaching term.
3. **Primary Metric** — the 2–4 word measure of their success (e.g. "Deal Flow + Problem-Solving Velocity").
4. **The <Pattern> Profile** — 2–3 short paragraphs: who they are, how they're wired, what energizes vs. constrains them. Plain, warm, specific. Not psychometric jargon.
5. **How <First> Naturally Wins** — 4–6 bullets.
6. **What Slows <First> Down** — 3–5 bullets (their friction, not character flaws).
7. **Communication Style** — 2–3 sentences.
8. **Ideal Client Profile** — who they work best with (bullets), grounded in their wiring + production.
9. **How <First> Should Operate** — 3–5 short directives (autonomy, parallel tracks, delegate detail, use AI to amplify, etc.), tuned to their energy.
10. **Production Summary** — a small table: Total Transactions · Total Sold Volume · Avg Sold Price · Sold-to-List (from the production data). Report ONE total volume figure (sold volume). NEVER add list volume and sold volume together — they describe the same deals, so summing them double-counts. If only list volume is available, label it "List Volume"; otherwise use sold volume.
11. **Key Insights** — 3–4 bullets read FROM the production (price band, geography, deal mix, velocity — real numbers).
12. **Core Operating Principles** — 3–4 numbered principles that capture how to deploy this person.`

export function buildAssessmentPrompt({ firstName = '', lastName = '', ci = {}, production = '', intake = {} }) {
  const full = `${firstName} ${lastName}`.trim()
  const { pattern = '', naturalEU = '', jobEU = '', traitNarrative = '' } = ci
  const gap = naturalEU !== '' && jobEU !== '' ? Number(jobEU) - Number(naturalEU) : null

  return `You are Brian St. Clair's analytical mind, writing the ASSESSMENT for an agent in the Irreplaceable Agent program at 6th Ave Homes (Fort Worth, TX). The Assessment answers "Here's who you are" — it is the discovery moment that makes the agent think "that's me." Third person. Diagnostic, insightful, warm, specific. Never psychometric lecturing.

# Governing principles (do not violate)
1. The agent's real behavior (production + intake) is the source of truth — the CI label is a strong signal but OVERRIDABLE. If the CI pattern and the production/intake disagree, trust the reality.
2. Coach the person, not the profile. No "Persuaders like people, so talk to more people." Describe THIS person.
3. Plain, real-estate language. Specific over abstract — real numbers, real client types, real behavior.
4. Numbers discipline: only report figures that are actually in the production data. Do NOT compute new totals by adding rows that represent the same deals (e.g. list volume + sold volume = double-counting). When in doubt, quote the single summary figure the report already gives rather than inventing a "combined" total.
5. No predicted timelines or deal counts. Do NOT write things like "close 2–3 deals by Month 4" or "the milestone to watch is Month 3." Growth is conditional — if they run the system, they improve — never time-stamped or quantity-promised.

# CONFIDENCE NOTE (the conflict detector — required)
Compare three signals: the CI pattern, what the production history implies about how they actually work, and the intake answers. If they cohere, proceed normally. If they MEANINGFULLY disagree (e.g. CI says high-energy risk-taker but production + intake read methodical/steady), open the Assessment with a short "⚠️ Confidence Note" that names the tension in one or two sentences and states which signal you're trusting (default: production + intake over the CI label). Do not silently paper over a mismatch.

# The person
- Name: ${full || '(agent)'}
- CI Pattern: ${pattern || '(unknown — infer from the narrative + production)'}
- Natural EU: ${naturalEU || '(?)'} · Job EU: ${jobEU || '(?)'}${gap !== null ? ` · gap ${gap > 0 ? '+' : ''}${gap}` : ''}
- Energy read: scale how hard you push them to their NATURAL EU. ${gap !== null && Math.abs(gap) >= 15 ? `Their natural-vs-job gap is large (${gap > 0 ? '+' : ''}${gap}) — name it: the role is pulling them ${gap > 0 ? 'well above' : 'well below'} their natural energy. Frame the fix as BUILD LEVERAGE (delegate, systematize, partner) — not "protect energy."` : `Their energy gap is healthy — no stress-gap flag needed.`}

# CI trait narrative (from their Culture Index report)
${traitNarrative || '(none provided — work from pattern + production)'}

# Production summary
${production || '(none provided)'}

# Intake answers
- 12-month goal: ${intake.goal || '(—)'}
- A great week: ${intake.greatWeek || '(—)'}
- Biggest friction / what they avoid: ${intake.friction || '(—)'}
- Clients they most enjoy: ${intake.clientsEnjoy || '(—)'}
- Where opportunities come from today: ${intake.leadSource || '(—)'}
- Proud a year from now: ${intake.proudInAYear || '(—)'}

# Output — the ASSESSMENT, in this section order (Markdown):
${ASSESSMENT_SECTIONS}

Write it now. Third person. Make it feel like someone spent 20 minutes thinking about THIS person — because the whole product depends on the agent reading it and going "that's me."`
}
