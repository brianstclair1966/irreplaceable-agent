// Agent Blueprint storage (client-side, localStorage — same pattern as progress.js).
// The agent pastes their Blueprint once on /coach; the coach is grounded in it.

const BLUEPRINT_KEY = 'ia_blueprint_v1'

export function getBlueprint() {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(window.localStorage.getItem(BLUEPRINT_KEY) || 'null')
  } catch {
    return null
  }
}

export function setBlueprint(text) {
  const value = { text: String(text || '').trim(), savedAt: new Date().toISOString() }
  window.localStorage.setItem(BLUEPRINT_KEY, JSON.stringify(value))
  return value
}

export function clearBlueprint() {
  window.localStorage.removeItem(BLUEPRINT_KEY)
}
