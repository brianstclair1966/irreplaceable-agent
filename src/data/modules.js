// Irreplaceable Agent — 6-session class data
// Lessons are written in Brian St. Clair's first-person coaching voice, distilled
// from his session slides + notes. Resource links point to Google Drive / Docs.
// To host a resource in-app instead, drop the file in /public/resources and set
// `url: "/resources/<filename>"`.
//
// Per-module shape:
//   n            session number (1–6)
//   slug         url slug
//   title        session title
//   phase        'I' | 'II' | 'III'  (grouping on the home page)
//   theme        short label shown on the card
//   video        YouTube ID
//   tagline      one-line hook
//   intro        opening paragraph (the "why now")
//   whyItMatters string[]  — the case for this session
//   lesson       [{ heading, paras: string[], scripts?: [{label, lines: string[]}], list?: string[], resourceRefs?: string[] }]
//   actionSteps  string[]  — what to do this week
//   pitfalls     string[]  — what to avoid
//   rhythm       string[]  — how this shows up week to week
//   vision       string    — vision-casting close
//   notesUrl, slidesUrl
//   resources    [{ label, meta, type, url }]

export const PROGRAM = {
  title: 'Irreplaceable Agent',
  trademark: 'Irreplaceable Agent™',
  subtitle: 'A 6th Ave Homes Agent System',
  philosophy: 'You don’t need to become someone else — you need to understand how YOU win, and build around it.',
  intro:
    'Irreplaceable Agent is a system built around you. Different agents win differently — some with speed and relationships, some with systems and detail, some with strategy and big-picture thinking. Over six sessions we figure out how YOU naturally win, where decisions actually get made, and how to use AI to remove friction instead of replacing your judgment. The result is a personalized operating system you can run every day.',
  mantra: 'AI won’t replace you. Agents using AI will. Clarity is the edge.',
  win: 'A 6th Ave Irreplaceable Agent understands how they win, builds around it, and uses clarity and AI to serve clients at a level that can’t be replaced.',
  playbookUrl: 'https://www.6thavehomesagents.com/6th-ave-ai-playbook',
  cultureIndexUrl: 'https://bit.ly/6thAveCultureIndex',
  blueprintPath: '/blueprint',
  heroImage:
    'https://images.squarespace-cdn.com/content/v1/63769174e6778950255aed67/d68f77d6-e655-4767-9d67-c446a69b71b5/Irreplaceable+Agent+Title.jpg',
  copyright:
    '© 2025 Brian St. Clair. All Rights Reserved. Irreplaceable Agent is a Real Estate Growth Training Program created by Brian St. Clair',
  license: 'Used by 6th Ave Homes under license.',
}

export const PHASES = {
  I: { label: 'Part I · Know the Game', range: 'Sessions 1–2' },
  II: { label: 'Part II · Where You Win', range: 'Sessions 3–4' },
  III: { label: 'Part III · Build Your System', range: 'Sessions 5–6' },
}

const modules = [
  // ───────────────────────────────────────────────────────────── 1
  {
    n: 1,
    slug: 'introduction',
    title: 'Introduction',
    phase: 'I',
    theme: 'The Mindset',
    video: 'PyIwCZLYvsM',
    tagline: 'AI won’t replace you — but agents who use AI will. This is how you stay irreplaceable.',
    intro:
      'Let’s be honest about where the market is. Rates are up and down, clients are unsure, some of you feel busy and some feel stuck — and most agents don’t really know what to do about it. Here’s the thing: it’s not a work problem. Most agents care, most are working, most are trying. They’re just trying to win the wrong way. Irreplaceable Agent isn’t normal training — no scripts, no fluff, no theory. It’s a system built around how YOU actually win.',
    whyItMatters: [
      'AI is already reshaping knowledge work — real estate included. The agents who use it well will replace the ones who don’t.',
      'There isn’t one right way to win. Some agents win with systems, some with relationships, some with speed, some with strategy — and they all win.',
      'Most training says “do it THIS way.” It works for some people and not others. That’s why agents burn out or stay inconsistent.',
      'The gap between average and elite is widening. Clear agents win. This program is about getting you clear.',
    ],
    lesson: [
      {
        heading: 'The real problem isn’t effort',
        paras: [
          'Most agents are working hard. They care. They’re trying. So why the burnout, the inconsistency, the frustration? Because they’re trying to win the wrong way — copying another agent, forcing themselves to “be more outgoing” or “be more structured” or “be more aggressive,” chasing someone else’s playbook. It doesn’t work, and it wears you out.',
          'Here’s the shift: what if you don’t need to change WHO you are? What if you just need to understand HOW you win? You already know this is true — you’ve seen it in your own office. Someone is super organized and structured. Someone wins purely off relationships. Someone moves fast and closes. Someone thinks three steps ahead. They all win. They just win differently. You’ve already seen it in yourself — you just haven’t built around it yet.',
        ],
      },
      {
        heading: 'Where the industry is actually going',
        callout: { kind: 'miss-this', text: 'Every agent has the same AI tools — the edge isn’t access, it’s knowing how YOU win. That clarity is what turns AI from generic output into leverage.' },
        paras: [
          'Let’s be real about the direction. AI is here. More agents are entering the market. There’s more noise than ever. Buyers now have AI for searches and for learning the basics, so the old value — being the information source — is evaporating. AI won’t replace you. But agents using AI will. That’s not dramatic; that’s the trend.',
          'The good news: every agent has access to the same AI tools, but almost none of them know how to use it well, because they don’t know how they win. You will. That clarity — knowing your strengths, your rhythm, where you make decisions — is the thing AI can amplify. Without it, AI just gives generic output because it still thinks you’re generic.',
        ],
      },
      {
        heading: 'What this program actually is',
        resourceRefs: ['6th Ave AI Playbook'],
        paras: [
          'This is not a course you pass — it’s a system you run. Over the next six sessions we’ll cover what Irreplaceable means, how you win, what actually moves your business, using AI the right way, building your personal system, and locking it in. Each session builds on the last. Session 5 breaks down the Blueprint — the personalized operating system built from your Culture Index, your past production, and how you naturally operate — and shows you how to request your own.',
          'To support how you work right now, the 6th Ave AI Playbook is already live on the back-site — a growing library of prompts for real situations: listing packages, pricing, offers, social posts, objection reframes. Use it on a real deal this week. Don’t try to learn it all; just remove one piece of friction.',
        ],
      },
    ],
    actionSteps: [
      'Decide which of the three ways you think you naturally win — fast/relationship-driven, systematic/detailed, or big-picture/strategic — and write down why.',
      'Open the 6th Ave AI Playbook and run ONE prompt on a real situation you’re working this week (a listing, a price, or an offer).',
      'Commit to the program rhythm: show up, stay engaged, and apply one thing each week. That’s how this works.',
    ],
    pitfalls: [
      'Don’t try to copy another agent — that’s exactly the trap that creates burnout and inconsistency.',
      'Don’t treat AI as a way to stop thinking. It’s leverage for your judgment, not a replacement for it.',
      'Don’t wait for the “whole system” before you start. Use one tool, on one real situation, now.',
    ],
    rhythm: [
      'This session: get honest about how you’re wired and stop fighting it.',
      'Each week: apply exactly one new thing on a live deal.',
      'Keep showing up — the sessions compound.',
    ],
    vision:
      'You’re not just building habits — you’re building a system that’s specific to you. By the end of this, everything comes together into a clear path you can run every day. Next session, we figure out exactly how YOU win.',
    notesUrl: 'https://docs.google.com/document/d/16YAIf1MbVLMzLxUpJZUNiTFyFRW4w3RZgilV1QEKPCE/edit',
    slidesUrl: 'https://drive.google.com/file/d/1JgzP_k64O00doI2BAoMXL9WWO7gZO4k-/view',
    resources: [
      { label: '6th Ave AI Playbook', meta: 'Prompt library', type: 'link', url: 'https://www.6thavehomesagents.com/6th-ave-ai-playbook' },
    ],
  },

  // ───────────────────────────────────────────────────────────── 2
  {
    n: 2,
    slug: 'your-path',
    title: 'Your Path',
    phase: 'I',
    theme: 'How You Win',
    video: 'Et6TLLzaBCI',
    tagline: 'You’re not broken. You’re built differently — and your way works if you understand it.',
    intro:
      'Last session we defined what an Irreplaceable Agent is. Now we figure out how YOU become one. This is about understanding YOUR way. When you know how you win, you stop fighting yourself. When you don’t, you stay inconsistent. Most agents never figure this out — they try to be someone else, and they burn out or stall out. You’re not the problem. You’ve just been trying to win the wrong way.',
    whyItMatters: [
      'Self-awareness changes everything — most agents don’t know how they naturally win, so they copy someone else and stall.',
      'When you work WITH how you’re wired, the same effort produces more: more deals, better operations, or bigger opportunities.',
      'Generic systems fail because they assume you work like everyone else. Your system has to be built around you.',
      'Your business needs all three strengths — but YOU are meant to do YOUR thing, not all of it.',
    ],
    lesson: [
      {
        heading: 'The three ways agents win',
        paras: [
          'There are three ways agents win in this business. You’re probably one, maybe a mix of two. The First Way is fast, decisive, relationship-driven — you move fast, trust your gut, and relationships matter most. You create momentum and trust; clients feel your confidence and you move deals forward. Where you stretch: details can feel boring and you might skip follow-up steps.',
          'The Second Way is systematic, detailed, process-driven — you love systems, you’re thorough and careful, and clients trust your expertise. You create certainty; clients feel safe and you protect the deal. Where you stretch: decisions can take time, and too many options can paralyze you.',
          'The Third Way is big-picture and opportunity-focused — you see patterns others miss, you think long-term, you spot opportunities fast. You position the deal and clients know you’re thinking ahead. Where you stretch: tactical execution can feel tedious and you might skip relationship-building.',
        ],
      },
      {
        heading: 'Where most agents get stuck',
        paras: [
          'Here’s where it goes wrong: fast people try to force themselves to build systems (frustrated, bored). System people try to force themselves to move fast (anxious, rushed). Strategic people try to grind on tactical work (bored, disconnected). You’re not the problem — you’ve just been trying to win the wrong way.',
          'When you work with how you’re wired, everything changes. Fast people get more deals and momentum. System people build bulletproof operations and client loyalty. Strategic people unlock bigger opportunities and stronger positioning. You don’t need to change. You need to lean in and build your business around it.',
        ],
        list: [
          'Fast people: action first, reflect second — quick feedback loops, momentum tracking.',
          'Systematic people: plan first, execute second — process documentation, quality checks.',
          'Strategic people: observe first, move second — pattern tracking, opportunity pipeline.',
        ],
      },
      {
        heading: 'Start using one tool now',
        resourceRefs: ['6th Ave AI Playbook'],
        paras: [
          'You don’t need your full system yet — Session 5 shows you how it comes together. But you can start using tools that help you win now. Not to replace how you work — to support it. When you’re in a real deal — a listing, a price, an offer — that’s when you reach for the Playbook. Don’t try to learn it all. Use one tool this week on one real situation. That’s how this starts.',
        ],
      },
    ],
    actionSteps: [
      'Name your primary way of winning (fast / systematic / strategic) and the secondary you mix in. It’s the foundation your Blueprint is built on (more in Session 5).',
      'For the next few weeks, pay attention: When do you feel most confident? When do you feel stuck? What feels natural? What feels forced? Jot down real answers.',
      'Use one Playbook tool this week on a live listing, pricing, or offer situation — to support how you already work, not replace it.',
    ],
    pitfalls: [
      'Don’t try to be the agent down the hall — their way is built for how THEY win, not you.',
      'Don’t mistake “built differently” for “broken.” You just haven’t built around your wiring yet.',
      'Don’t wait for the perfect system before you act — momentum starts with one tool, one situation.',
    ],
    rhythm: [
      'This session: identify your primary way of winning.',
      'Daily: notice when you feel confident vs. forced — that’s the raw material for your Blueprint.',
      'This week: one real situation, one Playbook tool.',
    ],
    vision:
      'Picture knowing exactly how you win and having a system built around it — no more fighting yourself, no more copying someone else. That’s where this is going. Next session, we show you where this actually wins or loses deals.',
    notesUrl: 'https://docs.google.com/document/d/1ett2mg3CLHOlirkgXADDzRIG91BGqMF6ushjdxDqphQ/edit',
    slidesUrl: 'https://drive.google.com/file/d/1CMikhEJ3z81b42LL4C9E4-Mcxu-7kujO/view',
    resources: [
      { label: '6th Ave AI Playbook', meta: 'Prompt library', type: 'link', url: 'https://www.6thavehomesagents.com/6th-ave-ai-playbook' },
    ],
  },

  // ───────────────────────────────────────────────────────────── 3
  {
    n: 3,
    slug: 'decisions',
    title: 'Decisions',
    phase: 'II',
    theme: 'Where You Get Paid',
    video: 'VLggweVVLlU',
    tagline: 'Information is everywhere. Good decisions are rare. That gap is where you win.',
    intro:
      'Last session you found your lane. Now we show you where the game is actually played. The game has shifted: buyers don’t need you for information anymore — they have AI for searches and for learning the basics. Your job was never information. It’s decisions. That’s where you get paid, and that’s what can’t be commoditized.',
    whyItMatters: [
      'Buyers’ #1 fear is no longer “not knowing” — it’s choosing wrong. They come to you for decisions, not facts.',
      'Most agents don’t lose deals from lack of effort. They lose them in moments of indecision.',
      'AI can’t see the moisture a photo hides, smell smoke in a house, feel 5pm traffic, or calm a nervous buyer live. That’s where you step in.',
      'When you own your decisions, you stop competing on information and start competing on judgment.',
    ],
    lesson: [
      {
        heading: 'Information lives here. Decisions live there.',
        paras: [
          'Information lives in the basics: What is escrow? How much are mortgage rates? What neighborhoods are near the school? What are the market trends? That’s NOT where you win — buyers can get all of it instantly. And when AI hands them a confident wrong answer, you’re the one who catches it.',
          'Decisions live in the specifics — almost every time. This specific house, at this specific price, for this specific buyer. When to negotiate and when to walk. What that inspection finding actually means. Why this neighborhood commands a premium. Whether this is the moment or the wrong moment. They don’t come to you asking “What is this?” — they ask “Should I do this?” Completely different question, completely different skill.',
        ],
      },
      {
        heading: 'Where your three ways win',
        paras: [
          'You found your lane in Session 2 — here’s where each way actually wins the decision moment. None are the same; all are valuable; all are necessary.',
        ],
        list: [
          'Fast agents win in timing and momentum — go/no-go calls, moving on the right deal before someone else does, negotiating from strength. You help clients move.',
          'Systematic agents win in the details that matter vs. noise — risk factors, red flags, process quality. You catch what others miss (the aging roof, the 1960s cast-iron sewer). You help clients feel safe.',
          'Strategic agents win in positioning and opportunity — long-term fit vs. short-term deal, market timing, getting buyers ready while rates are steady. You help clients see clearly.',
        ],
      },
      {
        heading: 'AI as decision support, not decision maker',
        callout: { kind: 'coach-tip', text: 'Right after a showing, brain-dump into a voice-to-text app and let AI shape it into a clean client recap. You keep the judgment — AI just removes the typing.' },
        resourceRefs: ['6th Ave AI Playbook'],
        paras: [
          'AI can’t make the decision — but it can help you make a better one, faster. Brain-dump a showing into a dictation app and let AI organize your thoughts into a clean recap email. Drop in an inspection report and your buyer’s requests and ask AI to estimate costs and draft what to say yes and no to. The agent thinks, AI organizes; the agent decides, AI supports; the agent adjusts, AI gets better.',
          'Think about your last five closed deals (or recent showings, if you’re newer). Where did YOU make the critical decision? What did the buyer need from you that AI couldn’t provide? What was the moment they trusted your judgment? Know those answers — that’s your value, and that’s why they choose you.',
        ],
      },
    ],
    actionSteps: [
      'Review your last 5 closed deals (or recent showings, if you’re newer) and write down the exact moment YOU made the decision that AI couldn’t. That’s your irreplaceable value.',
      'On a live deal this week, use AI to support — not make — a decision: organize a showing recap, summarize an inspection, or pressure-test a price.',
      'Catch yourself the next time you hesitate or over-explain. Practice leading with a clear recommendation instead of deferring to the client.',
    ],
    pitfalls: [
      'Don’t wait for perfect information — that hesitation is where deals get lost.',
      'Don’t over-explain instead of deciding. Clients hired you to lead the decision.',
      'Don’t compete on information you can’t win on. Compete on judgment.',
    ],
    rhythm: [
      'This session: separate information (commodity) from decisions (your value).',
      'On every deal: name the decision the client actually needs from you.',
      'Use AI to think through the moment — then you make the call.',
    ],
    vision:
      'When you own your decisions, you stop feeling threatened by AI and become the decision-maker your clients trust. That’s when you become irreplaceable. Next session: how AI becomes your leverage point.',
    notesUrl: 'https://docs.google.com/document/d/1ihwHCSMw2xwRCjnpeQcPdyXlRSbqrcuLqDQhAYgEizQ/edit',
    slidesUrl: 'https://drive.google.com/file/d/1BzmVS3xKsuMN9H5uPfBmLcyDzzu_c7Gt/view',
    resources: [
      { label: '6th Ave AI Playbook', meta: 'Prompt library', type: 'link', url: 'https://www.6thavehomesagents.com/6th-ave-ai-playbook' },
    ],
  },

  // ───────────────────────────────────────────────────────────── 4
  {
    n: 4,
    slug: 'using-ai-the-right-way',
    title: 'Using AI the Right Way',
    phase: 'II',
    theme: 'Friction Remover',
    video: 'bXmRr_vMGv0',
    tagline: 'AI removes friction. It doesn’t replace you. It makes winning easier to do more often.',
    intro:
      'Now you learn how AI amplifies what you already do. The biggest mistake agents make is using AI to avoid thinking — “the AI will tell me what to do.” That’s backwards. Winning agents use AI to think better and move faster. AI is a friction remover and a pattern recognizer — a tool that handles volume so YOU can focus on what matters. It doesn’t change how you win. It makes winning easier to do more often.',
    whyItMatters: [
      'Every agent has the same AI tools. Your edge is knowing how YOU win — AI doesn’t know you’re a relationship builder, a deal master, or an opportunity spotter. You do.',
      'Agents who use AI to avoid their strength lose their edge — they become the system instead of running it.',
      'Agents who use AI to amplify their strength become unstoppable.',
      'The pattern is always the same: you think → AI organizes → you decide → AI supports → you adjust → AI gets better.',
    ],
    lesson: [
      {
        heading: 'If you win building relationships',
        resourceRefs: ['6th Ave AI Playbook'],
        paras: [
          'You know who you should talk to, that consistency matters, and that the right opening makes everything better. But here’s the reality — most of you don’t reach out as often as you should. Not because you don’t want to, but because you sit there thinking: What do I text? What do I say? Is this random? That hesitation is the friction.',
        ],
        scripts: [
          {
            label: 'Remove the friction',
            lines: [
              'Help me figure out who I should reach out to this week and give me a natural way to start the conversation.',
              'You end up looking at 5 names, 5 real reasons to reach out, and 5 natural ways to start. Instead of thinking, you just start texting. You didn’t become better at relationships — you already were. You removed the friction that was stopping you.',
            ],
          },
        ],
      },
      {
        heading: 'If you win by managing details',
        paras: [
          'You know what stops deals from closing, that details matter more than flashy marketing, and that follow-up is the whole game. But you’re drowning — three active deals, three pending inspections, seven follow-up dates, ten loose ends — sitting there asking: What’s actually urgent? What could break this? What am I forgetting? That overwhelm is the friction.',
        ],
        scripts: [
          {
            label: 'Run your process without burning out',
            lines: [
              'Here are my 3 active deals. What’s the next step for each, and what could actually slow them down?',
              'Now you see what’s next for each deal and what could break each one. You didn’t replace your process — you used AI to actually run it without burning out.',
            ],
          },
        ],
      },
      {
        heading: 'If you win by seeing opportunities',
        paras: [
          'You know deals are built on positioning, that speed matters, and that the market is always moving. But you’ve had moments where you felt something was off — an opportunity you almost saw but didn’t act on, a shift you felt but moved on too late. That’s the friction: you’re managing today while trying to see tomorrow.',
        ],
        scripts: [
          {
            label: 'Think bigger without the noise',
            lines: [
              'Given my current deals and what’s happening in the market right now, what am I not seeing?',
              'Now you’re looking at deals you could reposition, opportunities hiding in your pipeline, and market shifts you should move on. Instead of second-guessing, you move faster and with more confidence.',
            ],
          },
        ],
      },
      {
        heading: 'The real shift',
        callout: { kind: 'brians-take', text: 'The agents who say “the AI told me what to do” get stuck the moment it’s wrong. Stay the decision-maker — AI shows you patterns, you make the call.' },
        paras: [
          'Most agents become dependent on AI — “the AI told me what to do” — so when it’s wrong, they’re stuck. You don’t do that. AI shows you patterns; you make the decision. AI gives you options; you choose what’s right. AI supports your thinking; it never replaces it.',
          'AI didn’t change the game. Your clarity did. Agents who know how they win and use AI to remove friction are the ones becoming irreplaceable. And remember — generic AI changes nothing. It only works when it’s built around how YOU operate. That’s what we build next.',
        ],
      },
    ],
    actionSteps: [
      'Pick the prompt above that matches how you win and run it on your real pipeline this week (even one or two deals is enough).',
      'Notice where AI removed friction (what to say, what’s urgent, what you’re missing) — and save that prompt for reuse.',
      'Practice the loop on one deal: you think → AI organizes → you decide → AI supports → you adjust.',
    ],
    pitfalls: [
      'Don’t use AI to avoid your strength — that’s how you lose your edge and become the system instead of running it.',
      'Don’t let “the AI told me” become your decision-making. You make the call; AI supports it.',
      'Don’t settle for generic prompts — generic AI doesn’t change anything.',
      'Don’t paste a client’s private or financial details into AI — strip names and numbers first.',
    ],
    rhythm: [
      'This session: match AI to your strength, not someone else’s.',
      'Weekly: reuse the prompt that removes your specific friction.',
      'Always: you decide, AI supports.',
    ],
    vision:
      'You’re not replacing yourself with AI — you’re amplifying yourself with AI. That’s what makes you irreplaceable. Next session, we build the system that runs all of this every day.',
    notesUrl: 'https://docs.google.com/document/d/1DdynOz_uYw4qITndf3UEq8ANa52w4-VmBovOKYHKSZM/edit',
    slidesUrl: 'https://drive.google.com/file/d/1ynF4UXUrHr8_W2PhzcXkaJeBM2LrXdfJ/view',
    resources: [
      { label: '6th Ave AI Playbook', meta: 'Prompt library', type: 'link', url: 'https://www.6thavehomesagents.com/6th-ave-ai-playbook' },
    ],
  },

  // ───────────────────────────────────────────────────────────── 5
  {
    n: 5,
    slug: 'building-the-blueprint',
    title: 'Building the Blueprint',
    phase: 'III',
    theme: 'Your System',
    video: 'DtwAdbPY7XA',
    tagline: 'A personalized operating system — built on exactly how YOU win. Not generic. Not one-size-fits-all.',
    intro:
      'You’ve learned a lot in four sessions — about the market, about yourself, about where you get paid, about how AI serves your judgment. Now we build the system that makes all of that operational. This is your Blueprint, and it’s yours alone: a personalized operating system built on your Culture Index, your way of winning, and your decision patterns. It replaces guesswork.',
    whyItMatters: [
      'Top agents rely on repeatable systems, not memory or motivation. A Blueprint turns your strengths into a daily operating system.',
      'Generic systems fail because they’re built for the average agent. When a system matches how you think, you use it — when it doesn’t, you abandon it.',
      'Public proof matters more than ever — AI systems increasingly rely on publicly available information to decide who looks credible and relevant, and detailed reviews help create that proof.',
      'Run the system consistently and it compounds — smoother workflow, faster decisions, more control. The improvement comes from running it, not from a calendar.',
    ],
    lesson: [
      {
        heading: 'First, know your wiring: the Culture Index',
        resourceRefs: ['Take Your Culture Index'],
        paras: [
          'Your Blueprint is built on your Culture Index — a short, free work-style survey that maps how you’re naturally wired: how fast you move, how much structure you need, how you make decisions, and what energizes or drains you. It’s the same profile we use to understand how each agent operates, and it’s the foundation everything else is built on. You started this at the end of Session 4 — if you haven’t taken your Culture Index yet, it’s about 10 minutes, and your results feed directly into your Blueprint.',
        ],
      },
      {
        heading: 'What’s in your Blueprint',
        callout: { kind: 'brians-take', text: 'A system you’ll actually run beats a perfect one you abandon. Your Blueprint works because it matches how you already think — don’t reshape it to look like generic training.' },
        paras: [
          'This isn’t theory — it’s a working system that replaces guesswork. Your Blueprint includes your Operating System, your Decision Framework, your AI Engine, your Daily Non-Negotiables, your Feedback Loop, and your Growth Corridor. It’s built in four steps: (1) your Culture Index — how you naturally think; (2) your Three Ways — where you win; (3) your Decision Triggers — the patterns you recognize better than anyone; and (4) your AI Engine — exactly how AI supports your way of thinking.',
          'Your operating style follows your primary way of winning — speed and momentum, process and certainty, or positioning and opportunity. Same business, different operating systems. And your AI Engine isn’t generic ChatGPT prompts; it’s built around your Culture Index and decision patterns, so the AI responds the way YOU naturally think.',
        ],
      },
      {
        heading: 'Before you use your Blueprint: align your AI',
        callout: { kind: 'miss-this', text: 'The miss isn’t using AI — it’s using it cold. Spend the 20 minutes teaching it how you think and how you decide, and every answer downstream gets sharper.' },
        resourceRefs: ['Align Your AI — Start Here'],
        paras: [
          'Most agents use AI like a search engine. They ask generic questions and get generic answers. The problem isn’t AI — it’s context. AI doesn’t know how you think, communicate, make decisions, or run your business. Before you use your Blueprint, spend 20–30 minutes teaching AI who you are. The better the context, the better the output.',
        ],
        list: [
          'Tell AI who you are — let it interview you on how you win, communicate, and decide.',
          'Explain how you make decisions — what gives you confidence, what causes hesitation, and where you tend to get stuck. AI becomes more useful when it understands how you decide, not just what you do.',
          'Explain your business — market, price point, clients, schedule, goals (the business you actually run, not the one you wish you had).',
          'Explain your strengths — relationships, organization, analysis, negotiation, systems, follow-through.',
          'Show AI where you need leverage — overthinking, inconsistency, follow-up hesitation, the friction that slows you down.',
          'Teach AI your voice — paste in samples of your own writing (listing descriptions, marketing copy, social posts) with any client names or private details removed, and tell it to write like you.',
          'Give AI a role — strategist, execution assistant, relationship coach, deal analyst — matched to how you operate.',
          'Use ONE thread consistently — keep a dedicated thread per listing or deal so context builds, using non-confidential details only. Context compounds.',
        ],
      },
      {
        heading: 'Public proof matters more than ever',
        callout: { kind: 'coach-tip', text: 'Ask happy clients to name what you specifically did well — “walked us through a brutal inspection,” “priced it right the first time.” Specific, niche-naming reviews are the strongest public proof you can have — for clients and for the systems that surface you.' },
        resourceRefs: ['AI Aligned Testimonial Email'],
        paras: [
          'Public proof matters more than ever. AI systems increasingly rely on publicly available information to determine who appears credible, trustworthy, and relevant — and detailed reviews that name your specific niche (“move-up buyer agent,” “luxury listing specialist”) help create that proof. This isn’t manipulation — it’s helping the internet accurately understand how you serve people. Use the AI-Aligned Testimonial Email to request reviews that actually describe your expertise.',
          'A word on privacy — this part matters. It’s fine to paste in your own marketing copy, listing descriptions, general scripts, and public market data. Never paste a client’s private or financial information — names, home or email addresses, account or loan numbers, Social Security numbers, contract dollar figures, or anything from a signed agreement. Strip identifying details first (say “my buyer” instead of a name), keep your AI tool’s “train on my data” setting turned off, and follow your brokerage’s technology and confidentiality policies. And mind the timing: don’t feed proprietary property details or a seller’s motivations into AI before the listing agreement is fully executed and your MLS’s clear-cooperation and timeline rules are met. When in doubt, leave it out.',
        ],
      },
      {
        heading: 'Get your own Blueprint',
        resourceRefs: ['Build Your Blueprint'],
        paras: [
          'This session shows you what a Blueprint is and the habits that make it work. Want yours? It’s an optional, no-cost add-on — and you build it right here. Add your Culture Index and a snapshot of your production, answer six quick questions, and your Blueprint is generated for you on the spot: your Assessment (who you are) and your Operating System (how you win, daily), in Brian’s coaching voice. It’s yours to download and keep, and a copy is saved for Brian. New to real estate? You can skip production — your Culture Index and the six questions are enough.',
        ],
      },
    ],
    actionSteps: [
      'Take your Culture Index survey if you haven’t — about 10 minutes, and it’s the foundation your Blueprint is built on.',
      'Complete the 7-step AI alignment process (Align Your AI — Start Here) — about 20–30 minutes.',
      'Send the AI-Aligned Testimonial Email to a recent happy client (or your most recent client, if you’re just starting) to capture a specific, niche-naming review.',
      'Want your Blueprint? Build it on the Your Blueprint page — add your Culture Index, answer six questions, and it’s generated for you instantly (production optional if you’re new).',
    ],
    pitfalls: [
      'Don’t use your Blueprint like someone else would — if you modify it to match generic training, it breaks.',
      'Don’t skip the AI alignment step — without it, AI stays generic because it still thinks you’re generic.',
      'Never paste a client’s private or financial details into AI — strip names and numbers first, keep “train on my data” off, and follow brokerage policy.',
    ],
    rhythm: [
      'At first: get used to the rhythm of your system.',
      'As it sticks: you start seeing the patterns.',
      'Over time: the system becomes automatic and your business runs differently.',
    ],
    vision:
      'You went from “I don’t know how I win” to “I know exactly how I win” to “I have a system built around how I win.” That’s ownership — and most agents never get here. Next session: where this system takes you.',
    notesUrl: 'https://docs.google.com/document/d/16Vx92vrLnJIOv9JfbX1IO3MsxTGMJOBGQ1w6-j0YTHA/edit',
    slidesUrl: 'https://drive.google.com/file/d/1Fbhit6fYsda9eoacW49qtKaP3XVOFghJ/view',
    resources: [
      { label: 'Take Your Culture Index', meta: 'Survey · ~10 min', type: 'survey', url: 'https://bit.ly/6thAveCultureIndex' },
      { label: 'Build Your Blueprint', meta: 'Free · generated for you', type: 'blueprint', url: '/blueprint/generate' },
      { label: 'Align Your AI — Start Here', meta: 'PDF · 7-step setup', type: 'pdf', url: 'https://drive.google.com/file/d/1YFruPS3sK5h2SHEzhLOzfsauEq68drfE/view' },
      { label: 'AI Aligned Testimonial Email', meta: 'PDF', type: 'pdf', url: 'https://drive.google.com/file/d/1f0oQfbDy-EIlOR2NuGjyl5ovfyUKE2Aw/view' },
      { label: '6th Ave AI Playbook', meta: 'Prompt library', type: 'link', url: 'https://www.6thavehomesagents.com/6th-ave-ai-playbook' },
    ],
  },

  // ───────────────────────────────────────────────────────────── 6
  {
    n: 6,
    slug: 'your-vision-and-commitment',
    title: 'Your Vision & Commitment',
    phase: 'III',
    theme: 'Lock It In',
    video: 'm5in3IHOe4Q',
    tagline: 'The system works. The clarity is there. The only question is whether you run it.',
    intro:
      'You now have something most agents never get — a system built on how YOU win, on your decisions, on your clarity. So the question isn’t “does this work?” The question is: what happens if you actually run it? This final session is where your vision and your commitment come together. It’s where this either becomes how you work… or it doesn’t.',
    whyItMatters: [
      'Agents burn out because they lack a defined vision and grow reactively. A clear, intentional business model fixes that at the root.',
      'You’re not competing on followers — you’re competing on judgment. That’s what clients actually pay for.',
      'This business doesn’t reward what you know. It rewards what you actually do. The missing ingredient is consistency.',
      'Clear agents don’t just get chosen — they get found. Documenting your real thinking makes you visible to people and to AI.',
    ],
    lesson: [
      {
        heading: 'What happens when you run this',
        paras: [
          'Most agents never experience this, because they never run a system long enough. When you do: you stop second-guessing decisions, you move faster than other agents, clients trust you faster, you attract better opportunities, and you use AI to remove friction instead of replacing your thinking. At first you get used to the rhythm; as it sticks you start seeing the patterns; and the longer you run it, the smoother your workflow, the faster your decisions, and the more in control you feel. That’s just the beginning.',
        ],
      },
      {
        heading: 'Attention is cheap. Direction is valuable.',
        paras: [
          'Most agents chase views, followers, and engagement. You have about three seconds to signal value — and what you do with them depends on how you win. The relationship agent starts meaningful conversations and clients move toward them. The systematic agent builds trust through clarity and clients feel protected. The strategic agent positions opportunities and clients see the vision. Same three seconds, different outcomes — all leading to decisions. That’s your unfair advantage, and it’s why your business grows while others stay stuck.',
          'The market is moving. AI is here and it’s not going away, more competition is coming, and clients are smarter. The agents who survive aren’t the ones with the most listings — they’re the ones with the clearest systems. That’s you.',
        ],
      },
      {
        heading: 'The whole game: extreme ownership',
        callout: { kind: 'miss-this', text: 'Motivation fades; consistency compounds. The agents who win aren’t the ones who learned the most — they’re the ones who actually ran the system.' },
        paras: [
          'Let’s be honest. You’ve heard a lot, you’ve had ideas, you’ve seen what works — but none of that matters if you don’t use it. Agents learn things, get motivated, say “this makes sense,” and then go right back to the same habits. Not because the training was wrong, but because they didn’t run it. This business rewards what you actually do.',
          'You already know enough. You know how you win, you know where you get paid, you know how to use AI to support it, and you’ve seen what happens when it’s consistent. You’re missing one thing: consistency. That’s why a system built around you is different — it fits how you work, which means you’ll actually run it. If you run your system, your business improves. If you don’t, nothing changes. That’s not opinion; that’s how this works.',
        ],
      },
      {
        heading: 'If you’re clear, be visible',
        paras: [
          'Most agents stay invisible because their best thinking never leaves their conversations. You don’t need more content — you need to document what you already do. Share real decisions. Say what you actually see. Let your system show up publicly. When you do, you don’t just get chosen — you get found. I’ve personally landed listings from clients who found me through ChatGPT — because my thinking was visible and specific. That’s where this is going.',
        ],
      },
    ],
    actionSteps: [
      'Write a one-paragraph vision for the business you actually want — then let AI interview you to sharpen it.',
      'Time-block your daily non-negotiables and commit to running your system for the next 30 days.',
      'Document one real decision publicly this week (a post, a short video, a note) so your judgment becomes visible — and findable.',
    ],
    pitfalls: [
      'Don’t confuse motivation with execution — the business rewards what you do, not what you know.',
      'Don’t chase followers and engagement. Compete on judgment.',
      'Don’t let your best thinking stay trapped in private conversations — visible clarity is how you get found.',
    ],
    rhythm: [
      'Daily: run your non-negotiables and make decisions through your framework.',
      'Weekly: track your metrics and adjust through your feedback loop.',
      'Monthly: document real decisions publicly so your system shows up.',
    ],
    vision:
      'This either becomes how you work… or it doesn’t. That’s the difference. You understand how you win, you’ve built around it, and you use clarity and AI to serve clients at a level that can’t be replaced. That’s a 6th Ave Irreplaceable Agent. Now go run it.',
    notesUrl: 'https://docs.google.com/document/d/1USg1J2DpJG7BPIeH80-ZAcbGcPfmBcA_R9oe8r5CjDw/edit',
    slidesUrl: 'https://drive.google.com/file/d/1AEvayvjfAK3zbf0_IlLbm-9QSk0wuUSl/view',
    resources: [
      { label: 'Commitment — Slides', meta: 'PDF', type: 'slides', url: 'https://drive.google.com/file/d/1qmAWdEUxWCBOlDel7HdzeI4YkZDWsHf3/view' },
      { label: '6th Ave AI Playbook', meta: 'Prompt library', type: 'link', url: 'https://www.6thavehomesagents.com/6th-ave-ai-playbook' },
    ],
  },
]

export function getModule(slug) {
  return modules.find((m) => m.slug === slug)
}

export default modules
