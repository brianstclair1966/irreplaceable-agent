# Irreplaceable Agent — Class App

A self-paced, 6-session agent system for 6th Ave Homes, built with Next.js and styled
in the 6th Ave brand. Built from the same engine as the Small Steps, Big Results app.

**Premise:** different agents win differently — some with speed and relationships, some
with systems and detail, some with strategy. Over six sessions, agents learn how *they*
win, where decisions actually get made, and how to use AI to remove friction instead of
replacing their judgment — ending with a personalized Blueprint they run every day.

Each session is a full lesson, not just a video:

- an embedded YouTube session video,
- a written lesson in Brian's first-person coaching voice,
- "why this matters," the teaching, inline AI prompt scripts,
- 3 "Do This Week" action steps, pitfalls to avoid, and the working rhythm,
- coral resource pills (the AI Playbook, the Align-Your-AI guide, the testimonial email),
- session Notes (Google Doc) and Slides (PDF) links up top.

The home page leads with the Irreplaceable Agent brand graphic, then lists all six
sessions as cards grouped into three parts. Agents can mark each session complete;
progress is saved in their browser and (optionally) logged to a Google Sheet.

## The six sessions

1. **Introduction** — AI won't replace you; agents who use AI will.
2. **Your Path** — the three ways agents win, and how to find yours.
3. **Decisions** — information is everywhere; good decisions are where you get paid.
4. **Using AI the Right Way** — AI removes friction, it doesn't replace you.
5. **Building the Blueprint** — your personalized operating system + the 7-step AI alignment.
6. **Your Vision & Commitment** — what happens when you actually run it (covers weeks 6 & 7).

All content lives in `src/data/modules.js`. Edit text there; no component changes needed.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Deploy (run these on your Mac, not in Cowork)

The app is fully built, verified (`npm run build` passes), and committed locally — but
the GitHub push and Vercel link must run from your Mac, where your GitHub/Vercel
credentials live. From a Mac terminal:

```bash
cd ~/Documents/Claude/Projects/Trainings/irreplaceable-agent

# 1. Clear the stale git locks left by the sandbox, then name the branch main
rm -f .git/*.lock .git/refs/heads/*.lock .git/objects/maintenance.lock
git branch -M main

# 2. Create the GitHub repo and push (GitHub CLI — same account as small-steps)
gh repo create irreplaceable-agent --public --source=. --remote=origin --push
```

No `gh` CLI? Create an empty repo named `irreplaceable-agent` at github.com/new, then:

```bash
git remote add origin https://github.com/brianstclair1966/irreplaceable-agent.git
git push -u origin main
```

Then import the repo at **vercel.com → Add New → Project**, pick `irreplaceable-agent`,
and deploy. After that, **every push to `main` auto-deploys** — day to day it's just
`git add -A && git commit -m "..." && git push`.

Two gotchas (learned on the Small Steps app):

- **Commit author email must be `brianstclair@gmail.com`** (already set on the initial
  commit). Vercel blocks pushed commits whose author email it can't match to a GitHub
  account. Fix a blocked commit with:
  `git commit --amend --reset-author --no-edit && git push --force-with-lease`.
- If git complains it "cannot lock ref," clear stale locks:
  `rm -f .git/HEAD.lock .git/index.lock`.

(Optional) Add a custom domain like `irreplaceable.6thavehomesagents.com` under
**Project → Settings → Domains**.

## Completion tracking (Google Sheet)

Tracking is wired up but needs one env var to go live (it's a no-op until then, so the
app works fine without it):

- Each "Mark Session Complete" (and undo) POSTs to `/api/log-completion`, which forwards
  to a Google Apps Script web app that appends a row (timestamp, name, email, session,
  title, slug, completed).
- Set the web app's `/exec` URL as `IA_SHEET_WEBHOOK_URL` in Vercel
  (**Project → Settings → Environment Variables**, Production + Preview).
- Agents enter their name/email once on the home page; it's stored locally and attached
  to each event.

Apps Script to deploy (**Extensions → Apps Script → Deploy → New deployment → Web app**,
execute as **Me**, access **Anyone**):

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var d = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp','name','email','session','title','slug','completed']);
  }
  sheet.appendRow([d.timestamp, d.name, d.email, d.session, d.title, d.slug, d.completed]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Editing content

All six sessions live in `src/data/modules.js`. Each module has:

- `tagline`, `intro` — the hook and opening paragraph
- `whyItMatters` — bullet list
- `lesson` — array of sections, each `{ heading, paras[], list?, scripts?, resourceRefs? }`
- `actionSteps` — the "Do This Week" steps
- `pitfalls`, `rhythm`, `vision` — what to avoid, the working rhythm, the close
- `resources` — `{ label, meta, type, url }`; `resourceRefs` in a lesson section
  reuses these by `label` to show an inline pill (one source of truth for URLs)
- `video` (YouTube ID), `notesUrl`, `slidesUrl`

`PROGRAM` at the top holds program-wide bits (intro, philosophy, `heroImage`, the AI
Playbook link). `PHASES` defines the three groupings on the home page.

### Hosting a resource in-app instead of Drive

Resources link to Google Drive / the back-site by default. To serve a file from the app
instead, drop it in `public/resources/<file>` and point that resource's `url` to
`/resources/<file>`.

> The hero graphic currently loads from the Squarespace CDN (the same image used on the
> live back-site page). To self-host it, save it to `public/ia-hero.jpg` and set
> `PROGRAM.heroImage = '/ia-hero.jpg'` in `src/data/modules.js`.

## Structure

```
public/
  resources/             # optional in-app-hosted files
src/
  data/modules.js        # all 6 sessions of content + resources + PROGRAM
  pages/index.jsx        # home: brand image, progress, sessions by part
  pages/session/[slug].jsx     # session lesson page
  pages/api/log-completion.js  # posts completions to the Sheet webhook
  components/             # Layout, ModuleCard, VideoEmbed, ResourcePill,
                          # ProgressBar, AgentGate, CompleteButton
  lib/progress.js         # localStorage progress + agent identity + logging
  styles/globals.css      # brand colors, video embed, type
```

© 2025 Brian St. Clair. All Rights Reserved.
