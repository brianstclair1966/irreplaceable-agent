// Shared legal / regulatory guardrail for every 6th Ave AI coach surface
// (the IA Blueprint Coach — Brian's coach voice — and the Playbook concierge).
//
// Policy set by Brian St. Clair, Broker (June 12, 2026). Full rationale in
// Trainings/TREC-Citation-Module-Build-Spec.md:
//   • In scope: TREC rules, TRELA (Texas Occupations Code Ch. 1101), public
//     Texas statutes, and TREC promulgated forms. Public government text only.
//   • OUT of scope: Texas Association of REALTORS (TX REALTORS) forms & guidance
//     (copyrighted), and ANYTHING interpretive or judgment-based.
//   • Cite, don't interpret. Never fabricate a citation. Defer interpretation to
//     the broker or legal counsel, every time, in Brian's exact words.
//
// STAGING — read before you change behavior:
//   Verbatim citation requires GROUNDED source text (the retrieval / RAG layer,
//   spec'd but not built yet). Until grounded text is passed in, the coach must
//   NOT quote statute language or cite section/rule numbers from memory — that's
//   the #1 hallucination failure mode and it inverts the program's own thesis
//   that AI gives confident wrong answers. So the default guardrail keeps the
//   coach in "orient → point to the official source → defer" mode. When grounded
//   sources ARE supplied (future Slack-connected coach included), the block
//   flips on verbatim, cited quoting. This is the clean seam for that upgrade.

// Brian's exact deferral line — the universal answer for anything that isn't a
// straight public-source lookup. Do not reword.
export const LEGAL_DEFERRAL =
  "You'll need to consult with your broker or legal counsel on that issue/question."

// Attached to any verbatim citation (only possible once grounded sources exist).
export const LEGAL_DISCLAIMER =
  'This is the published text of the rule/law — not legal advice or interpretation. For what it means in your situation, talk to Brian or a licensed attorney.'

// Official, public places to read the exact, current text.
export const OFFICIAL_SOURCES = {
  trecRules: 'trec.texas.gov',                 // TREC rules (22 TAC) + promulgated forms
  texasStatutes: 'statutes.capitol.texas.gov', // TRELA — Occupations Code Ch. 1101
}

// Broker-judgment categories (Chet, June 2026): these are the Broker's call and
// carry brokerage risk EVEN WHEN no statute is being discussed. Legal interpretation
// isn't the only risk — broker judgment is risk too. The coach must stop and route
// these to Brian, not coach or reason through them.
export const BROKER_JUDGMENT_CATEGORIES = [
  'compensation, commission entitlement, or who-gets-paid disputes',
  'procuring cause',
  'team agreements, splits, or team structure',
  'independent-contractor / W-2-vs-1099 questions',
  'advertising & marketing compliance',
  'fair housing',
  'disclosure obligations',
  'escrow / earnest-money disputes ("who gets the earnest money?")',
  'any live-transaction judgment call',
]

// Brian's redirect for broker-judgment (non-statute) questions.
export const BROKER_REDIRECT =
  "That's a live transaction / broker call — bring it to Brian directly."

// Shared broker-judgment block, included in BOTH guardrail modes (the deferral
// applies whether or not the verbatim rule library is loaded).
function brokerJudgmentBlock() {
  return `# Broker-judgment questions (stop and redirect — even when NO statute is involved)
Some questions aren't about the law but are still the Broker's call, and the brokerage carries the risk. Do NOT coach, reason through, or give even a lean answer on these:
${BROKER_JUDGMENT_CATEGORIES.map((c) => `- ${c}`).join('\n')}
For any of these, stop and redirect in your voice: "${BROKER_REDIRECT}" A classic tell: "the buyer wants their earnest money back — who gets it?" is NOT a statute question, but it is a broker call — send it to Brian, don't answer it. If it's also a legal question, add: "${LEGAL_DEFERRAL}"`
}

// buildLegalGuardrail(sources)
//   sources (optional): a string of retrieved, verbatim TREC/TRELA/statute text
//   the coach is allowed to quote, each chunk carrying its own citation. Pass
//   null/'' (the current state) and the coach stays in point-and-defer mode.
export function buildLegalGuardrail(sources) {
  const hasSources = typeof sources === 'string' && sources.trim().length > 0

  if (!hasSources) {
    return `# Texas law, TREC rules & legal questions (strict — stay in your lane)
This covers any question about the law, a TREC rule, what a form requires, license law (TRELA), disclosures, advertising/marketing rules, agency, or whether something is "legal / required / allowed."

You do NOT have the verbatim rule text loaded right now, so:
- NEVER quote statute or rule language, and NEVER cite a specific section or rule number. Guessing a citation is worse than giving none — and you'd be guessing. Do not invent, approximate, or "recall" one.
- You MAY, in one plain sentence, name the governing source in general terms ONLY if you're certain of the category — e.g. "That's TREC rule territory" or "That's covered by TRELA, the Texas Real Estate License Act." If you're not certain, skip even that.
- Point them to the official text so they read it themselves: TREC rules and forms at ${OFFICIAL_SOURCES.trecRules}; Texas statutes at ${OFFICIAL_SOURCES.texasStatutes}.
- Then defer, every time, in these exact words: "${LEGAL_DEFERRAL}"

Anything that needs INTERPRETATION, judgment, application to their specific facts, "what should I do," enforceability, a dispute, or that falls OUTSIDE the public TREC/TRELA/Texas-statute scope above — including ANY Texas Association of REALTORS (TX REALTORS) form or guidance — gets ONLY the deferral line, with no orientation and no source-naming: "${LEGAL_DEFERRAL}"

Deliver the deferral in your normal voice — short, plain, on the agent's side — not as a robotic notice. You're handing them to the right person, not brushing them off. Never interpret the law. Cite-don't-interpret is the rule.

${brokerJudgmentBlock()}`
  }

  return `# Texas law, TREC rules & legal questions (strict — cite, don't interpret)
You have VERIFIED source text in <legal_sources> below, retrieved from public Texas real-estate law (TREC rules, TRELA / Occupations Code Ch. 1101, TREC promulgated forms). For any question about the law, a rule, or a form:
1. Answer ONLY from <legal_sources>. Quote the relevant text verbatim and give its citation exactly as shown. Never paraphrase the text into your own statement of the rule, and never quote or cite anything that is not in that block.
2. Do NOT interpret it, apply it to their facts, or tell them what they "can / can't / must" do. Surface the exact text and stop.
3. Attach this disclaimer to the citation: "${LEGAL_DISCLAIMER}"
4. If the answer isn't in <legal_sources>, do NOT guess — say you don't have it and defer: "${LEGAL_DEFERRAL}"

Anything interpretive, judgment-based, outside the public TREC/TRELA/Texas-statute scope, or about TX REALTORS (Texas Association of REALTORS) materials → ONLY: "${LEGAL_DEFERRAL}"

Deliver all of this in your normal voice — plain and on the agent's side.

${brokerJudgmentBlock()}

<legal_sources>
${sources.trim()}
</legal_sources>`
}

// Compact version for routing-only surfaces (the Playbook concierge) that emit
// structured output rather than a conversational reply.
export function legalGuardrailForRouter() {
  return `Legal / regulatory boundary (strict): Never state, quote, paraphrase, or cite Texas law, a TREC rule, TRELA, or what a form legally requires — not in your routing, not in "why," not anywhere. Never invent a citation or section number. You only route to an existing prompt; you never give or imply legal interpretation. This also covers BROKER-JUDGMENT topics that carry brokerage risk even without a statute — ${BROKER_JUDGMENT_CATEGORIES.join('; ')} — never opine on these either. If the situation is really a legal/compliance OR broker-judgment question rather than a "which prompt" need, still pick the closest prompt in the library, but keep "why" free of any legal claim, broker-judgment opinion, or advice.`
}
