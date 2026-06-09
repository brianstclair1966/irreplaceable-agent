// Client-side progress + agent identity, stored in localStorage.
// Completion events are also POSTed to /api/log-completion (Google Sheet).

const PROGRESS_KEY = 'ia_progress_v1'
const AGENT_KEY = 'ia_agent_v1'

export function getCompleted() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function isCompleted(slug) {
  return !!getCompleted()[slug]
}

export function setCompleted(slug, value) {
  const data = getCompleted()
  if (value) data[slug] = new Date().toISOString()
  else delete data[slug]
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(data))
  return data
}

export function getAgent() {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(window.localStorage.getItem(AGENT_KEY) || 'null')
  } catch {
    return null
  }
}

export function setAgent(agent) {
  window.localStorage.setItem(AGENT_KEY, JSON.stringify(agent))
  return agent
}

export async function logCompletion({ slug, title, session, agent, completed }) {
  try {
    await fetch('/api/log-completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        title,
        session,
        completed,
        name: agent?.name || '',
        email: agent?.email || '',
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (e) {
    // Non-blocking: local progress still saved even if logging fails.
    console.warn('Completion logging failed', e)
  }
}
