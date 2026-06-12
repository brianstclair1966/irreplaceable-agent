// 6th Ave AI Playbook — prompt library, migrated from the Squarespace back-site
// into the Irreplaceable Agent app. Each prompt keeps its full metadata.
//
// Per-prompt shape:
//   id           kebab-case slug (anchor + key)
//   title        prompt name
//   subtitle     one-line what-it-writes
//   whenToUse    short "use when…" cue (optional)
//   tier         1 | 2 | 3 | 'safety'   (display grouping)
//   category     filter pill: Listing | Pricing | Marketing | Communication | Transaction | Safety
//   featured     bool — "Most agents start here"
//   whatItDoes   string
//   whatToPasteIn string
//   prompt       the copy-paste prompt body
//   proTip, bestResults, avoidThis  (optional)
//   bestUse, alwaysVerify           (optional)

export const INTRO = {
  headline: 'AI is a tool. Use it when you need it.',
  helps: ['Move faster', 'Communicate clearly', 'Make better decisions'],
  note: 'You don’t need everything here. You need the right tool at the right time.',
  startHere: [
    { situation: 'Listing appointment', use: 'Create Full Listing Package', id: 'full-listing-package' },
    { situation: 'Pricing a home', use: 'CMA & Pricing Analysis', id: 'cma-pricing-analysis' },
    { situation: 'Reviewing offers', use: 'Offer Comparison & Analysis', id: 'offer-comparison' },
  ],
  spark: '🔥 Use ONE tool this week on a real deal.',
}

export const HOW_TO_USE = ['Copy the prompt', 'Paste into your AI', 'Add your details', 'Review & tweak']

export const TIERS = {
  1: { label: 'Tier 1 — Use These First', blurb: 'Done in 1–2 minutes. Use them on real deals.' },
  2: { label: 'Tier 2 — When You Need More Help', blurb: 'A little more depth when the situation calls for it.' },
  3: { label: 'Tier 3 — 6th Ave Systems', blurb: 'Structured templates built the 6th Ave way.' },
  safety: { label: '🛡 Safety & Fraud Protection', blurb: 'Compliance-critical. Run these whenever something feels off — they take a minute and can save you thousands.' },
}

export const CATEGORIES = ['Listing', 'Pricing', 'Marketing', 'Communication', 'Transaction', 'Safety']

export const CLOSING = {
  helps: ['Move faster', 'Communicate better', 'Think more clearly'],
  doesntReplace: ['Your judgment', 'Your experience', 'Your relationships'],
  line: 'Use it as a tool. Lead like a professional. Don’t overthink it.',
}

const prompts = [
  // ───────────── Tier 1
  {
    id: 'full-listing-package',
    title: 'Create Full Listing Package (Descriptions + Social)',
    subtitle: 'Write MLS, Zillow, Facebook & IG in one step',
    whenToUse: 'Use before a listing appointment',
    tier: 1, category: 'Listing', featured: true,
    whatItDoes: 'Creates a complete listing package in one go: MLS remarks, Zillow description, Facebook post, Instagram caption.',
    whatToPasteIn: 'Address, beds/baths, square footage, lot size, year built, key upgrades, neighborhood highlights',
    prompt: `Create a full listing package for this property.

Style:
• Professional
• Confident
• Not cheesy
• Benefits > features

Generate:

1. MLS Remarks (2–3 sentences, strong opening, highlight key features)
2. Zillow Description (1 paragraph, buyer-focused, easy to read)
3. Facebook Post (conversational, engaging, 1 paragraph)
4. Instagram Caption (2–3 lines + relevant hashtags)

Property Details:
[PASTE FULL PROPERTY INFO]

Important:
- Do NOT exaggerate features
- Keep it realistic & accurate`,
    proTip: 'Run this twice—once for accuracy, then again to sharpen tone and flow.',
    bestResults: 'Recent updates, unique features, and anything that makes the home stand out.',
    avoidThis: 'Don’t skip details—vague input leads to generic output.',
    bestUse: 'Before publishing a new listing. Generates everything at once.',
    alwaysVerify: 'Square footage, number of bedrooms/bathrooms, year built, school district info, and any special features or upgrades.',
  },
  {
    id: 'email-subject-lines',
    title: 'Write Email Subject Lines (Fast Open Rates)',
    subtitle: 'Generate 7 compelling options in seconds',
    whenToUse: 'Use for important client emails',
    tier: 1, category: 'Marketing',
    whatItDoes: 'Creates 5-7 subject line options for client emails. Helps you get better open rates.',
    whatToPasteIn: 'The main message or purpose of your email',
    prompt: `Generate 7 compelling email subject lines for the following email:

[PASTE EMAIL CONTENT OR PURPOSE]

Requirements:
- Keep each under 50 characters
- Make them clear & benefit-focused
- Avoid spam-like language
- Mix curiosity, urgency, & value
- Use real estate language where relevant`,
    bestUse: 'When sending market updates, listing announcements, or important communications. Pick the one that feels most natural.',
    alwaysVerify: 'The subject line is accurate to your email content.',
  },
  {
    id: 'open-house-posts',
    title: 'Create Open House Posts (Instagram + Facebook)',
    subtitle: 'Drive traffic with urgency-based social announcements',
    whenToUse: 'Use 48-72 hours before an open house',
    tier: 1, category: 'Marketing',
    whatItDoes: 'Creates Instagram, Facebook, & text-ready open house announcements with urgency & clarity.',
    whatToPasteIn: 'Property address, date, time, key features, price',
    prompt: `Create 3 open house posts: one for Instagram (with hashtags), one for Facebook, & one for text/email.

Keep them warm, clear, & inviting. Use action words like "Join us" or "See it Sunday."

Property Info:
[PASTE DETAILS]

Requirements:
- Mention the address clearly
- Include exact time
- Highlight 1-2 key features
- Create urgency without desperation
- Add emoji to Instagram version only`,
    bestUse: '48-72 hours before an open house. Post daily leading up to it.',
    alwaysVerify: 'Date, time, and address are 100% correct.',
  },
  {
    id: 'objection-reframe',
    title: 'Client Objection Reframe',
    subtitle: 'Turn concerns into professional conversations',
    whenToUse: 'Use when a client raises a concern',
    tier: 1, category: 'Communication',
    whatItDoes: 'Takes a client concern & reframes it positively, giving you language to address it professionally.',
    whatToPasteIn: 'The objection or concern your client raised',
    prompt: `A client just said: "[PASTE OBJECTION]"

Help me respond in a way that:
1. Validates their concern (don't dismiss it)
2. Provides perspective
3. Offers a solution or next step
4. Keeps the relationship positive
5. Uses plain language (not real estate jargon)

Give me 2-3 response options I can choose from.`,
    proTip: 'Use this to guide your response—not replace your voice. Adjust tone to match the client.',
    bestResults: 'The exact objection and context of the conversation.',
    avoidThis: 'Don’t copy/paste blindly—make it sound like you.',
    bestUse: 'When a client raises a concern that catches you off-guard. Gives you time to think & respond thoughtfully.',
    alwaysVerify: 'Your response aligns with company policy & is honestly your perspective.',
  },
  {
    id: 'weekly-market-update',
    title: 'Weekly Market Update Template',
    subtitle: 'Build trust with friendly, data-backed market insights',
    whenToUse: 'Use weekly or bi-weekly with your database',
    tier: 1, category: 'Marketing',
    whatItDoes: 'Turns market data into a short, friendly client update. Keeps you visible & helpful without being pushy.',
    whatToPasteIn: 'Key market stats: median price, days on market, inventory, trends for your area',
    prompt: `Turn this market data into a friendly, 1-paragraph client update for [NEIGHBORHOOD/AREA].

Make it:
- Simple & easy to understand (no jargon)
- Positive but honest
- Action-oriented (what does this mean for buyers/sellers?)
- Conversational in tone

Market Data:
[PASTE DATA]

End with: "Let me know if you'd like to discuss what this means for your situation."`,
    proTip: 'Keep it short and relevant—clients care about what it means for them.',
    bestResults: 'Local data, trends, and a simple takeaway (what should they do?).',
    avoidThis: 'Don’t overload with stats—clarity beats quantity.',
    bestUse: 'Send weekly or bi-weekly to your database. Builds trust & keeps you top-of-mind.',
    alwaysVerify: 'All statistics are accurate & from reliable sources.',
  },
  {
    id: 'feature-to-benefit',
    title: 'Property Feature to Benefit Translator',
    subtitle: 'Show buyers why each feature matters to them',
    tier: 1, category: 'Listing',
    whatItDoes: 'Turns property features into buyer-focused benefits. Features describe what’s there; benefits explain why clients care.',
    whatToPasteIn: 'List of property features (e.g., "granite counters," "open floor plan")',
    prompt: `Convert these property features into buyer benefits. Show why each feature matters.

Format:
Feature → Benefit

Features:
[PASTE LIST]

Example:
Feature: "Granite Countertops"
Benefit: "Durable, low-maintenance surfaces perfect for busy families."`,
    bestUse: 'When writing listing descriptions or prepping for buyer showings. Tells the story, not just facts.',
    alwaysVerify: 'Benefits are realistic & match the actual property.',
  },

  // ───────────── Safety & Fraud (was inside Tier 1 — pulled out, compliance-critical)
  {
    id: 'scam-red-flags',
    title: 'Spot Scam Red Flags in Messages',
    subtitle: 'Identify suspicious patterns before they cost you',
    whenToUse: 'Use on every new lead or unusual contact',
    tier: 'safety', category: 'Safety',
    whatItDoes: 'Analyzes buyer/seller messages for common scam patterns: vague inquiries, pressure to move off-platform, out-of-country claims, generic scripts, and other red flags.',
    whatToPasteIn: 'The exact message, email, or communication from the lead. Include the full context if they’ve sent multiple messages.',
    prompt: `Analyze this message for scam risk in real estate. Identify red flags and likelihood of fraud.

Red flags to check for:
- Generic or scripted language
- Out-of-country claims (cannot view properties)
- Pressure to move off-platform quickly
- Vague property references
- Requests for video calls before confirming property details
- Asking for email or personal info upfront
- Too good to be true terms

Message:
[PASTE MESSAGE]

Provide:
1. Risk level (High / Medium / Low)
2. Specific red flags you see
3. What to ask next to verify legitimacy
4. Whether to proceed cautiously or decline`,
    proTip: 'Always call back on known numbers to verify. Never click links—ask them to resend through verified platforms.',
    bestResults: 'The full message thread and any context about how they found you or what they’re asking for.',
    avoidThis: 'Don’t ignore your gut. If something feels off, it probably is.',
    privacy: 'You can paste the suspicious message, but strip the lead’s full name, phone, and email first — you only need the wording and the pattern.',
    bestUse: 'When you get an unusual lead or message that doesn’t feel right. Takes 60 seconds and can save you thousands.',
    alwaysVerify: 'Legitimacy by calling on known numbers, confirming identity via title/lender, and never moving payment off-platform.',
  },
  {
    id: 'verify-identity-proof-of-funds',
    title: 'Verify Identity & Proof of Funds',
    subtitle: 'Spot fake documents before accepting an offer',
    whenToUse: 'Use before accepting any proof of funds or listing agreements',
    tier: 'safety', category: 'Safety',
    whatItDoes: 'Evaluates proof of funds, financial documents, and seller identity claims for signs of fraud or forgery. Helps you spot fake documents and ownership mismatches.',
    whatToPasteIn: 'A plain description of the situation and what feels off — not the actual documents. Strip names, account/routing numbers, and ID numbers first (say "the buyer" and "their bank").',
    prompt: `Check if this proof of funds or identity claim could be fraudulent.

What I need to verify:
[DESCRIBE THE SITUATION: e.g., "Buyer sent proof of funds," "Seller claims to own vacant land remotely," "Buyer sent bank statement"]

Details:
- Who are they?
- What are they claiming?
- What documents did they provide?
- Are there any inconsistencies?

Evaluate for fraud risk:
1. Red flags in the documents or claims
2. Likelihood this is forged or fake
3. What a legitimate version should look like
4. Questions I should ask to verify
5. Whether I should proceed or escalate to title/lender

Be direct about risk level (High / Medium / Low).`,
    proTip: 'Always have title or lender verify documents—don’t rely on your judgment alone. Professional verification catches what AI misses.',
    bestResults: 'Specific details about what they’re claiming, exact documents provided, and any identity mismatches you noticed.',
    avoidThis: 'Don’t upload the real bank statement, ID, or document into AI — describe what you see instead. Don’t accept "proof" without title/lender verification. Don’t list property remotely without video ID verification.',
    privacy: 'Never paste a real bank statement, ID, account number, or someone’s name into AI. Describe the red flags in general terms; let title or your lender verify the actual documents.',
    bestUse: 'Before accepting proof of funds, listing agreements from remote sellers, or when something feels off about who they claim to be.',
    alwaysVerify: 'All documents with title company and/or lender. Confirm seller identity via title search and direct phone contact. Never list property without verifying ownership.',
  },
  {
    id: 'prevent-wire-fraud',
    title: 'Prevent Payment & Wire Fraud',
    subtitle: 'Protect against overpayment, fake wiring instructions & payment scams',
    whenToUse: 'Use before any payment or wire transfer discussion',
    tier: 'safety', category: 'Safety',
    whatItDoes: 'Identifies payment scams: overpayment schemes, fake wiring instructions, pressure to process refunds, and fraudulent payment directions. Protects you before money moves.',
    whatToPasteIn: 'Details about the payment request, wiring instructions, refund request, or payment scenario. Include what they’re asking for and any unusual circumstances.',
    prompt: `Explain the fraud risk in this payment scenario:

[DESCRIBE THE SITUATION: e.g., "Buyer sent overpayment and wants refund," "I got a wire instruction email," "Seller wants me to process payment"]

Details:
- Who is requesting the payment or transfer?
- What are they asking for?
- How did they send instructions (email, text, etc.)?
- Is anything unusual about their request?

Analyze for fraud risk:
1. Is this a known scam pattern?
2. Specific red flags I should see
3. What scammers typically do after this step
4. What I should do instead
5. How to verify legitimacy if needed

Be very direct about whether to proceed or decline immediately.`,
    proTip: 'Always call title directly to confirm wiring instructions. Never use a number from an email—look it up independently.',
    bestResults: 'Price, financing type, payment method, exact instructions, and any communication that feels pressured or unusual.',
    avoidThis: 'Don’t process refunds directly. Don’t wire funds based on emailed instructions. Don’t ignore mismatches between what was discussed and what you’re being asked to do.',
    privacy: 'Describe the scenario — don’t paste real account numbers, routing numbers, or wiring instructions into AI. Confirm anything real with title directly, on a known number.',
    bestUse: 'Before processing any payment, handling refunds, or responding to wiring instructions. Takes 2 minutes and can prevent fraud completely.',
    alwaysVerify: 'All payment requests with title company directly (use known contact info). Never click links in payment emails. Confirm sender identity before any wire transfer.',
  },

  // ───────────── Tier 2
  {
    id: 'cma-pricing-analysis',
    title: 'CMA & Pricing Analysis',
    subtitle: 'Data-driven pricing recommendations for listing appointments',
    tier: 2, category: 'Pricing',
    whatItDoes: 'Analyzes comparable sales & market conditions to suggest a strategic price range. Gives you data-backed recommendations for listing appointments.',
    whatToPasteIn: 'Subject property details, 4-6 recent comparable sales, current active listings, market notes',
    prompt: `Analyze this property like a pricing strategy conversation with a seller.

Provide:
1. Suggested list price range (with justification)
2. Price per square foot comparison
3. Why this property is stronger/weaker than comps
4. Key risks if priced too high
5. Competitive positioning vs active listings
6. A short analysis I can show the seller

Subject Property:
[ADDRESS, BEDS, BATHS, SF, CONDITION, UPGRADES]

Recent Sales (last 90 days):
[COMPARABLE 1: Address, List Price, Sale Price, Days on Market, Key Differences]
[COMPARABLE 2-6...]

Current Active Listings:
[ADDRESS, PRICE, DAYS ON MARKET, KEY FEATURES]

Write the "My Analysis" section the way I would explain it to a seller:
- Clear
- Direct
- Not overly technical
- Focused on what matters`,
    proTip: 'Use this after you’ve pulled comps—not instead of. It helps you think, not replace your judgment.',
    bestResults: 'Recent comps, days on market, price trends, and any upgrades or condition notes.',
    avoidThis: 'Don’t rely on AI alone for pricing—it supports your analysis, it doesn’t make the decision.',
    privacy: 'Addresses and public comps are fine. Leave out your seller’s name and any personal or financial details about them.',
    bestUse: 'Before listing appointments, price adjustments, or negotiations with sellers.',
    alwaysVerify: 'Comparable sales, square footage accuracy, and market alignment. Use this to guide you, not replace your judgment.',
  },
  {
    id: 'offer-comparison',
    title: 'Offer Comparison & Analysis',
    subtitle: 'Evaluate multiple offers & identify the strongest one',
    tier: 2, category: 'Transaction',
    whatItDoes: 'Compares multiple offers side-by-side, analyzing price, terms, contingencies, & likelihood of closing.',
    whatToPasteIn: 'Full details of each offer: price, earnest money, contingencies, closing timeline, buyer pre-approval status',
    prompt: `I have [NUMBER] offers on my listing. Help me evaluate them & recommend which one is strongest.

Compare on:
- Offered Price
- Earnest Money
- Contingencies (inspection, appraisal, financing)
- Closing Timeline
- Likelihood of Closing
- Risk Factors
- Net Proceeds to Seller

Offer Details:
[OFFER 1: Full Details...]
[OFFER 2: Full Details...]
[OFFER 3: Full Details...]

Give me:
1. Strengths & weaknesses of each
2. Risk assessment for each
3. Likelihood of closing
4. Clear recommendation with reasoning`,
    proTip: 'Paste full offer details—AI works best when it sees everything, not summaries.',
    bestResults: 'Price, financing type, contingencies, timelines, and any special terms.',
    avoidThis: 'Don’t just pick the highest price—look at the full strength of the offer.',
    privacy: 'Use "Buyer A / B / C" instead of real names, and leave out account or pre-approval document numbers — terms and price are what matter.',
    bestUse: 'When you have multiple offers. Gives you talking points & clarity for your seller.',
    alwaysVerify: 'All offer terms are accurate. Your recommendation should align with seller’s goals.',
  },
  {
    id: 'price-reduction-conversation',
    title: 'Price Reduction Conversation',
    subtitle: 'Navigate price cuts without losing seller trust',
    tier: 2, category: 'Pricing',
    whatItDoes: 'Helps you explain a price adjustment to a seller without damaging trust. Uses data, not emotion.',
    whatToPasteIn: 'Current price, suggested new price, days on market, showing activity, competition info',
    prompt: `Help me explain a price reduction to a seller.

Context:
- Current price: [PRICE]
- Suggested new price: [PRICE]
- Days on market: [DOM]
- Showing activity: [INFO]
- Competition: [ACTIVE LISTINGS / PRICES]

Write a message that:
- Is honest but not harsh
- Uses data, not emotion
- Explains why the market is responding this way
- Positions the price adjustment as a strategy, not a failure

Keep it conversational & clear.`,
    bestUse: 'When a listing isn’t getting traction. This will be used a lot—have it ready.',
    alwaysVerify: 'Your market data supports the recommendation. Be prepared to discuss comps & market conditions with the seller.',
  },
  {
    id: 'inspection-response',
    title: 'Inspection Response Helper',
    subtitle: 'Explain issues clearly & keep deals moving forward',
    tier: 2, category: 'Transaction',
    whatItDoes: 'Helps you explain inspection issues, repair requests, or next-step options clearly to a buyer or seller. Keeps communication professional & clear.',
    whatToPasteIn: 'Inspection findings, repair requests, cost estimates, or specific issues that need explanation',
    prompt: `Help me explain this inspection issue to my [BUYER/SELLER].

Inspection Finding:
[PASTE THE ISSUE OR REPAIR REQUEST]

Context:
- Cost estimate (if available): [AMOUNT]
- Severity: [MINOR / MODERATE / SIGNIFICANT]
- Next steps options: [REPAIR / REPLACE / MONITOR / NEGOTIATE]

Write a message that:
- Is clear & easy to understand
- Explains what the issue is & why it matters
- Presents options without being alarmist
- Sounds professional & fair
- Leaves room for discussion

Keep it conversational, not technical.`,
    bestUse: 'When you need to communicate inspection issues, repair requests, or negotiation points. Keeps tone professional & clear.',
    alwaysVerify: 'The inspection finding is accurate & the explanation is honest. Don’t minimize serious issues.',
  },
  {
    id: 'title-commitment-summary',
    title: 'Title Commitment Summary & Review',
    subtitle: 'Translate legal jargon into plain English for buyers',
    tier: 2, category: 'Transaction',
    whatItDoes: 'Translates title commitment language into plain English. Highlights issues, red flags, & items the buyer should understand.',
    whatToPasteIn: 'The relevant sections of the title commitment, with owner names, file/loan numbers, and full legal descriptions removed.',
    prompt: `Summarize this title commitment in plain English for a buyer.

Highlight:
1. What is covered & what is NOT covered
2. Any unusual items or restrictions
3. Potential red flags or items requiring attention
4. What the buyer needs to understand before closing
5. Questions we should ask the title company

Title Commitment:
[PASTE TITLE COMMITMENT TEXT]

Format your response as:
- Overall Summary (1-2 sentences)
- Key Items (bullets)
- Red Flags/Issues (if any)
- Recommended Next Steps`,
    privacy: 'Strip owner names, file/loan numbers, and personal identifiers before pasting — you only need the language and the issues.',
    bestUse: 'After title commitment is issued, before sending to buyer. Helps you explain any issues proactively.',
    alwaysVerify: 'Do not present AI output as legal advice. Use it to help you understand and explain, then confirm questions with the title company.',
  },
  {
    id: 'message-refinement',
    title: 'Professional Message Refinement',
    subtitle: 'Upgrade any message for clarity & professionalism',
    tier: 2, category: 'Communication',
    whatItDoes: 'Takes your draft message & refines it for clarity, professionalism, & tone.',
    whatToPasteIn: 'Your original draft email or message',
    prompt: `Refine this message to a client. Make it:
- Clear & easy to understand
- Professional but not stiff
- Slightly conversational
- Confident & reassuring
- Free of jargon
- Action-oriented

Original Message:
[PASTE YOUR DRAFT]

Rewrite it, then give me 2 alternative opening lines in case one feels better.`,
    bestUse: 'Before sending important client emails. Takes 30 seconds & improves clarity.',
    alwaysVerify: 'The refined message represents your actual position & you’re comfortable sending it.',
  },

  // ───────────── Tier 3 — 6th Ave Systems
  {
    id: 'listing-presentation-outline',
    title: '6th Ave Listing Presentation Outline',
    subtitle: 'Build a data-driven, seller-focused presentation',
    tier: 3, category: 'Listing',
    whatItDoes: 'Builds a structured listing presentation outline. Data-driven, focused on seller value, not pressure.',
    whatToPasteIn: 'Property address, details, neighborhood info, comparable sales, your market assessment',
    prompt: `Create a listing presentation outline for [ADDRESS]. Structure it the 6th Ave way:

Section 1: Build Trust
- Brief background on you & your experience with this neighborhood
- Why you understand this market

Section 2: Property Analysis
- What makes this home unique
- Competitive positioning

Section 3: Market Overview
- Local market conditions (buyers, inventory, timing)
- Why now is the right time to list

Section 4: Marketing Strategy
- How you'll position this property
- Timeline & success plan

Section 5: Pricing Recommendation
- Comparable analysis
- Suggested price & justification

Section 6: Next Steps
- Seller expectations & your commitment

Property Details:
[ADDRESS, BEDS, BATHS, SF, KEY FEATURES, CONDITION]

Comps & Market:
[RECENT SALES & MARKET CONDITIONS]

Use plain language. Avoid jargon.`,
    bestUse: '1-2 hours before a listing appointment. Gives you a roadmap to stay focused & confident.',
    alwaysVerify: 'Your pricing recommendation aligns with your CMA analysis.',
  },
  {
    id: 'client-onboarding-checklist',
    title: '6th Ave Client Onboarding Checklist',
    subtitle: 'Track every step from signed contract to closing',
    tier: 3, category: 'Transaction',
    whatItDoes: 'Creates a customized onboarding checklist for new buyer or seller clients. Ensures nothing falls through the cracks.',
    whatToPasteIn: 'Type of client (buyer or seller), basic details, timeline, special circumstances',
    prompt: `Create a 6th Ave Client Onboarding Checklist for a [BUYER / SELLER].

Include pre-qualification steps, needs discovery, market education, showing prep, offer strategy, inspection management (buyers) or initial consultation, pre-listing tasks, listing launch checklist, follow-ups (sellers).

Add: Communication schedule, key milestones & timelines, documents they'll need, your role & what they can expect.

Client Situation:
[BUYER OR SELLER? TIMELINE? SPECIAL CIRCUMSTANCES?]

Format as a clear checklist with dates/timelines.
Make it practical, not overwhelming.`,
    bestUse: 'After signing a new client. Send it to them so they know what’s happening & when to expect updates.',
    alwaysVerify: 'Timelines & tasks match your actual process & what you committed to the client.',
  },
  {
    id: 'market-analysis-template',
    title: '6th Ave Market Analysis Template',
    subtitle: 'Position yourself as a neighborhood market expert',
    tier: 3, category: 'Pricing',
    whatItDoes: 'Generates a neighborhood market analysis you can share with clients. Shows you understand their market & builds credibility.',
    whatToPasteIn: 'Neighborhood/zip code, recent sales data, inventory levels, price trends, local news',
    prompt: `Create a 6th Ave-style Market Analysis for [NEIGHBORHOOD/ZIP CODE].

Structure:
1. Market Overview
2. Price Trends (last 12 months)
3. Inventory & Days on Market
4. Buyer Profile (who's buying, primary motivations, price range)
5. Notable Factors (schools, amenities, growth plans, challenges)
6. 6th Ave Recommendation

Market Data:
[PASTE RECENT SALES, INVENTORY, PRICE DATA, LOCAL NEWS]

Write in plain language for clients. Include 1-2 specific examples.`,
    bestUse: 'Monthly or quarterly neighborhood analyses you can share with your database. Positions you as a market expert.',
    alwaysVerify: 'All statistics are accurate & current. Cite your sources.',
  },
  {
    id: 'transaction-management-checklist',
    title: '6th Ave Transaction Management Checklist',
    subtitle: 'Step-by-step checklist from contract to keys',
    tier: 3, category: 'Transaction',
    whatItDoes: 'A step-by-step checklist from contract to closing. Ensures you don’t miss critical deadlines or contingencies.',
    whatToPasteIn: 'Contract details: offer date, inspection deadline, appraisal deadline, financing deadline, closing date',
    prompt: `Create a 6th Ave Transaction Management Checklist for a [BUYER / SELLER].

Key Sections:

Week 1 (Post-Contract):
- Verification of key dates & deadlines
- Communication with all parties
- Initial inspections scheduled
- Buyer: Loan application started

Week 2-4 (Contingency Period):
- Inspection completed & review
- Appraisal ordered
- Financing updates
- Repair negotiations
- Title ordered & review

Week 5-6 (Contingency Resolution):
- All contingencies cleared
- Final walk-through scheduled
- Insurance & documents prepared
- Closing timeline confirmed

Week 7-8 (Closing Prep):
- Final numbers confirmed
- Buyer: Final loan approval
- Closing disclosure reviewed
- Closing day logistics

Closing Day:
- Document signing, keys transfer, congratulations

Contract Details:
[OFFER DATE, KEY DEADLINES, CLOSING DATE, SPECIAL TERMS]

Include specific dates & make it practical.`,
    bestUse: 'The day you open escrow. Print it, check off items as you go. Prevents critical deadline misses.',
    alwaysVerify: 'All deadlines are accurate based on the actual contract.',
  },
]

export function getPrompt(id) {
  return prompts.find((p) => p.id === id)
}

export default prompts
