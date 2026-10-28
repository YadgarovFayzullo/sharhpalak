import { TOURNAMENTS } from './data.js'

/**
 * Tournaments made with «Turnir o‘tkazish». Until the backend accepts them they live only in this browser
 * (localStorage "charhpalak.created"), so a published link opens here but not on another device.
 */
const KEY = 'charhpalak.created'

// Cover photo of a new tournament until organizers can upload their own.
export const SPORT_PHOTO = { futbol: 'football', tennis: 'tennis', shaxmat: 'chess', yugurish: 'marathon', suzish: 'swim', bilyard: 'billiards', boshqa: 'basketball' }

export function loadCreated() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function saveCreated(x) {
  const all = loadCreated().filter((c) => c.id !== x.id)
  try { localStorage.setItem(KEY, JSON.stringify([...all, x])) } catch { /* private mode: the success page still shows the link */ }
}

/** A sample tournament or one created in this browser. */
export const findTournament = (slug) => TOURNAMENTS.find((c) => c.id === slug) || loadCreated().find((c) => c.id === slug) || null

const LATIN = { 'ʻ': '', '‘': '', '’': '', "'": '', '`': '' }

/** URL slug from a tournament name; a short suffix keeps it unique. */
export function slugify(name) {
  const base = name.toLowerCase().replace(/[ʻ‘’'`]/g, (c) => LATIN[c]).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'turnir'
  const taken = (s) => TOURNAMENTS.some((x) => x.id === s) || loadCreated().some((x) => x.id === s)
  if (!taken(base)) return base
  for (let i = 2; ; i++) if (!taken(`${base}-${i}`)) return `${base}-${i}`
}
