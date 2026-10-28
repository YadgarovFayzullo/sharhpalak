// Landing content. Text lives in src/locales/*.json; here only ids and values.
// Tournaments are a sample until the landing reads them from the backend.

// The mini app lives in the Telegram bot: every call to action opens it.

/** Public offer (oferta) document. Currently the sample page /oferta; replace with the real document link (empty = text without a link). */
export const OFFER_URL = '/oferta'

export const SPORTS = ['all', 'futbol', 'tennis', 'shaxmat', 'yugurish', 'suzish', 'bilyard', 'boshqa']

export const SPORT_ROWS = SPORTS.filter((s) => s !== 'all')

// Cards shown per sport row on the landing; the rest is behind «More».
export const ROW_LIMIT = 3

export const NO_FILTERS = { q: '', sport: 'all', city: '', date: '' }

// Entry fee filter on the landing: every tournament, free ones, paid ones.
export const PRICES = ['all', 'free', 'paid']

/** What organizers pay to publish one tournament (so‘m). */
export const PUBLISH_FEE = 20000

export const CITIES = ['tashkent', 'samarkand', 'bukhara', 'namangan', 'online']

export const STATUSES = ['upcoming', 'live', 'finished']

// start/end: ISO dates; city and format are translation keys. Order = order inside a sport row.
export const TOURNAMENTS = [
  { id: 'tennis-open', sport: 'tennis', status: 'upcoming', format: 'doubles', start: '2026-11-12', end: '2026-11-14', city: 'tashkent', img: 'tennis', max: 32, joined: 18, prize: 8000000 },
  { id: 'tennis-juniors', fee: 0, sport: 'tennis', status: 'upcoming', format: 'singles', start: '2026-11-22', end: '2026-11-23', city: 'samarkand', img: 'tennis2', max: 24, joined: 9, prize: 3000000 },
  { id: 'tennis-masters', sport: 'tennis', status: 'upcoming', format: 'doubles', start: '2026-12-09', end: '2026-12-12', city: 'tashkent', img: 'tennis3', max: 16, joined: 11, prize: 15000000 },
  { id: 'tennis-yoz', sport: 'tennis', status: 'live', format: 'singles', start: '2026-10-23', end: '2026-10-28', city: 'namangan', img: 'tennis4', max: 32, joined: 32, prize: 6000000 },
  { id: 'tennis-bahor', sport: 'tennis', status: 'finished', format: 'doubles', start: '2026-04-10', end: '2026-04-12', city: 'tashkent', img: 'tennis2', players: 48, winner: 'Aliyev / Karimov' },
  { id: 'futbol-kubogi', sport: 'futbol', status: 'upcoming', format: 'team', start: '2026-12-04', end: '2026-12-06', city: 'namangan', img: 'football', max: 16, joined: 11, prize: 20000000 },
  { id: 'futbol-liga', sport: 'futbol', status: 'upcoming', format: 'team', start: '2026-11-15', end: '2026-11-30', city: 'tashkent', img: 'football2', max: 12, joined: 9, prize: 30000000 },
  { id: 'futbol-7x7', sport: 'futbol', status: 'upcoming', format: 'team', start: '2026-12-19', end: '2026-12-20', city: 'samarkand', img: 'football3', max: 16, joined: 5, prize: 10000000 },
  { id: 'futbol-kuz', sport: 'futbol', status: 'live', format: 'team', start: '2026-10-17', end: '2026-11-01', city: 'tashkent', img: 'football4', max: 8, joined: 8, prize: 12000000 },
  { id: 'futbol-bahor', sport: 'futbol', status: 'finished', format: 'team', start: '2026-05-02', end: '2026-05-10', city: 'bukhara', img: 'football2', teams: 16, players: 192, winner: 'Navbahor' },
  { id: 'shaxmat-kubogi', fee: 0, sport: 'shaxmat', status: 'upcoming', format: 'singles', start: '2026-11-20', end: '2026-11-21', city: 'samarkand', img: 'chess', max: 64, joined: 32, prize: 5000000 },
  { id: 'shaxmat-blits', fee: 0, sport: 'shaxmat', status: 'upcoming', format: 'singles', start: '2026-12-01', end: '2026-12-01', city: 'online', img: 'chess2', max: 100, joined: 47, prize: 2000000 },
  { id: 'shaxmat-yoshlar', sport: 'shaxmat', status: 'finished', format: 'singles', start: '2026-06-14', end: '2026-06-15', city: 'tashkent', img: 'chess3', players: 64, winner: 'D. Rahimov' },
  { id: 'shahar-yugurishi', sport: 'yugurish', status: 'upcoming', format: 'singles', start: '2026-11-27', end: '2026-11-27', city: 'bukhara', img: 'marathon', max: 500, joined: 214, prize: 10000000 },
  { id: 'tong-yugurishi', fee: 0, sport: 'yugurish', status: 'upcoming', format: 'singles', start: '2026-12-13', end: '2026-12-13', city: 'tashkent', img: 'marathon2', max: 300, joined: 96, prize: 6000000 },
  { id: 'marafon-kuz', sport: 'yugurish', status: 'finished', format: 'singles', start: '2026-09-20', end: '2026-09-20', city: 'samarkand', img: 'marathon3', players: 520, winner: 'B. Tursunov' },
  { id: 'suzish-kubogi', sport: 'suzish', status: 'live', format: 'singles', start: '2026-10-24', end: '2026-10-27', city: 'tashkent', img: 'swim', max: 80, joined: 80, prize: 7000000 },
  { id: 'suzish-yoshlar', fee: 0, sport: 'suzish', status: 'upcoming', format: 'singles', start: '2026-11-29', end: '2026-11-30', city: 'tashkent', img: 'swim2', max: 60, joined: 22, prize: 4000000 },
  { id: 'suzish-yoz', sport: 'suzish', status: 'finished', format: 'singles', start: '2026-07-18', end: '2026-07-19', city: 'namangan', img: 'swim3', players: 86, winner: 'S. Ismoilova' },
  { id: 'bilyard-open', sport: 'bilyard', status: 'upcoming', format: 'singles', start: '2026-11-14', end: '2026-11-16', city: 'tashkent', img: 'billiards2', max: 32, joined: 20, prize: 5000000 },
  { id: 'pirat-cup', sport: 'bilyard', status: 'upcoming', format: 'singles', start: '2026-11-12', end: '2026-11-14', city: 'tashkent', img: 'billiards3', max: 64, joined: 32, prize: 5000000 },
  { id: 'bilyard-turniri', sport: 'bilyard', status: 'finished', format: 'singles', start: '2026-03-01', end: '2026-03-02', city: 'tashkent', img: 'billiards', players: 32, winner: 'A. Karimov' },
  { id: 'basketbol-3x3', sport: 'boshqa', status: 'upcoming', format: 'team', start: '2026-11-28', end: '2026-11-29', city: 'tashkent', img: 'basketball2', max: 24, joined: 10, prize: 9000000 },
  { id: 'basketbol-kubogi', sport: 'boshqa', status: 'finished', format: 'team', start: '2026-02-15', end: '2026-02-23', city: 'tashkent', img: 'basketball', teams: 12, players: 96, winner: 'Phoenix' },
]

// Top banner slider: one brand slide, three tournament promos (tennis, billiards, football) and one sponsor ad.
// img names live in photos.js (landscape photos for the full-width ones).
export const BANNERS = [
  { id: 'brand', type: 'brand' },
  { id: 'tennis-open', type: 'tournament', tournament: 'tennis-open', img: 'tennis2' },
  { id: 'pirat-cup', type: 'tournament', tournament: 'pirat-cup', img: 'billiards2' },
  { id: 'futbol-kubogi', type: 'tournament', tournament: 'futbol-kubogi', img: 'football' },
  { id: 'sponsor', type: 'ad', img: 'swim' },
]
export const BANNER_INTERVAL = 5500 // ms per slide

// Logos in the partners marquee. Placeholders: replace `name` with a real logo (e.g. add `src: '/partners/<file>.svg'`).
export const PARTNER_LOGOS = [
  { name: 'Startup Garage', img: '/partners/startup-garage.svg' },
  { name: 'Imkon Acceleration', img: '/partners/imkon-acceleration.svg' },
  { name: 'Imkon Ventures', img: '/partners/imkon-ventures.svg', h: 22 }, // very wide logo: lower so it matches the others
  { name: 'Padel Store', mark: 'circle' },
  { name: 'Sport Market', mark: 'bars' },
  { name: 'Hydro', mark: 'drop' },
  { name: 'Arena Pro', mark: 'hex' },
  { name: 'Fit Zone', mark: 'bolt' },
  { name: 'Aqua Plus', mark: 'wave' },
  { name: 'Pirat Billiard', mark: 'ring' },
  { name: 'Olimp Courts', mark: 'tri' },
]

export const PARTNERS = [
  { icon: 'crown', key: 'main' },
  { icon: 'gift', key: 'prize' },
  { icon: 'team', key: 'host' },
]

const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']

/** "12–14-noyabr, 2026" in Uzbek; Intl range format ("November 12 – 14, 2026", "2026년 11월 12일~14일") otherwise. */
export function formatDates(start, end, lng) {
  const a = new Date(`${start}T12:00:00`)
  const b = new Date(`${end}T12:00:00`)
  if (lng === 'uz') {
    // Our own format: the browsers' Uzbek locale data is incomplete.
    const day = start === end ? `${a.getDate()}` : `${a.getDate()}–${b.getDate()}`
    const sameMonth = a.getMonth() === b.getMonth()
    return sameMonth
      ? `${day}-${UZ_MONTHS[b.getMonth()]}, ${b.getFullYear()}`
      : `${a.getDate()}-${UZ_MONTHS[a.getMonth()]} – ${b.getDate()}-${UZ_MONTHS[b.getMonth()]}, ${b.getFullYear()}`
  }
  const fmt = new Intl.DateTimeFormat(lng, { day: 'numeric', month: 'long', year: 'numeric' })
  return start === end ? fmt.format(a) : fmt.formatRange(a, b)
}

/** Prize fund / amounts: "5 000 000 so‘m" in Uzbek, "UZS 5,000,000" in English and Korean. */
export function formatMoney(n, lng) {
  return lng === 'uz' ? `${new Intl.NumberFormat('ru-RU').format(n)} so‘m` : `UZS ${new Intl.NumberFormat('en-US').format(n)}`
}

// ---- Tournament page (sample content until it comes from the backend) ----

/** Organizers (a club or a company): rating from participants' reviews, tournaments hosted, since when on KiGo. */
export const ORGS = [
  { id: 'olimp-courts', sport: 'tennis', name: 'Olimp Courts', kind: 'club', city: 'tashkent', since: 2025, hosted: 8, rating: 4.9, reviews: 156, mark: 'tri' },
  { id: 'arena-pro', sport: 'futbol', name: 'Arena Pro', kind: 'complex', city: 'tashkent', since: 2025, hosted: 12, rating: 4.8, reviews: 214, mark: 'hex' },
  { id: 'chess-club', sport: 'shaxmat', name: 'Chess Club Tashkent', kind: 'club', city: 'tashkent', since: 2025, hosted: 5, rating: 4.6, reviews: 61, mark: 'circle' },
  { id: 'runtashkent', sport: 'yugurish', name: 'RunTashkent', kind: 'community', city: 'tashkent', since: 2025, hosted: 9, rating: 4.8, reviews: 302, mark: 'bolt' },
  { id: 'aqua-plus', sport: 'suzish', name: 'Aqua Plus', kind: 'club', city: 'tashkent', since: 2026, hosted: 4, rating: 4.7, reviews: 44, mark: 'wave' },
  { id: 'pirat', sport: 'bilyard', name: 'Pirat', kind: 'club', city: 'tashkent', since: 2025, hosted: 6, rating: 4.7, reviews: 98, mark: 'ring' },
  { id: 'streetball-park', sport: 'boshqa', name: 'Streetball Park', kind: 'community', city: 'tashkent', since: 2026, hosted: 3, rating: 4.5, reviews: 27, mark: 'bars' },
]

/** Organizer of a tournament (sample: one organizer per sport until the backend sends the real one). */
export const ORGANIZERS = Object.fromEntries(ORGS.map((o) => [o.sport, o]))
// A tournament made on this site belongs to its author, not to a sample organizer.
export const organizerOf = (x) => (x.created ? null : (x.org ? ORGS.find((o) => o.id === x.org) : ORGANIZERS[x.sport]) || null)

// Sample reviews: [author, stars, text key]. Text lives in the locales under organizer.samples.
const SAMPLE_REVIEWS = [['Jasur K.', 5, 'r1'], ['Bobur O.', 4, 'r2'], ['Sardor N.', 5, 'r3'], ['Malika R.', 5, 'r4'], ['Timur A.', 4, 'r5']]

/** Reviews of an organizer, each tied to one of its finished tournaments. */
export function reviewsOf(org) {
  const done = TOURNAMENTS.filter((x) => x.sport === org.sport && x.status === 'finished')
  return SAMPLE_REVIEWS.map(([who, stars, key], i) => ({ who, stars, key, tournament: done.length ? done[i % done.length].id : null }))
}

/** Share of 5…1 star ratings for an organizer (sample split that matches its average). */
export function ratingSplit(org) {
  const five = Math.round(org.reviews * (org.rating - 4) * 0.95)
  const four = Math.round((org.reviews - five) * 0.75)
  const three = Math.round((org.reviews - five - four) * 0.6)
  const two = Math.round((org.reviews - five - four - three) * 0.6)
  return [five, four, three, two, org.reviews - five - four - three - two]
}

/** Entry fee: `fee` when set (0 = free), else the sample rule 1% of the prize fund rounded to 10 000 (Pirat Cup: 50 000). */
export const entryFee = (x) => x.fee ?? Math.round((x.prize || 0) / 100 / 10000) * 10000

/** Registration closes two days before the start. */
export function registrationDeadline(x) {
  if (x.deadline) return x.deadline
  const d = new Date(`${x.start}T12:00:00`)
  d.setDate(d.getDate() - 2)
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}

// [initials, name, rating, colour]
export const SAMPLE_PLAYERS = [
  ['AT', 'Aziz T.', '4.6', '#FFD58A'], ['BO', 'Bobur O.', '4.8', '#FFB59A'], ['RM', 'Rustam M.', '4.5', '#9EE6C8'], ['SN', 'Sardor N.', '4.7', '#B9C8FF'],
  ['JK', 'Jasur K.', '4.8', '#C8F25A'], ['TA', 'Timur A.', '4.3', '#FFD58A'], ['DI', 'Davron I.', '4.6', '#9EE6C8'], ['US', 'Ulug‘bek S.', '4.4', '#B9C8FF'],
]
export const SAMPLE_TEAMS = [
  ['PH', 'Phoenix', '4.9', '#FFD58A'], ['NB', 'Navbahor', '4.8', '#FFB59A'], ['PK', 'Paxtakor', '4.7', '#9EE6C8'], ['OL', 'Olimp', '4.6', '#B9C8FF'],
  ['BN', 'Bunyodkor', '4.6', '#C8F25A'], ['SG', 'Sogdiana', '4.5', '#FFD58A'], ['LK', 'Lokomotiv', '4.4', '#9EE6C8'], ['NS', 'Nasaf', '4.4', '#B9C8FF'],
]

/** Up to eight entrants of a tournament. For a finished one the winner is first. */
export function entrants(x) {
  if (x.created) return [] // a new tournament has nobody yet
  const pool = x.format === 'team' ? SAMPLE_TEAMS : SAMPLE_PLAYERS
  const list = pool.map(([i, name, r, bg]) => ({ i, name, r, bg }))
  if (x.winner) {
    const rest = list.filter((p) => p.name !== x.winner)
    const w = list.find((p) => p.name === x.winner) || { i: x.winner.split(/[ /]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(), name: x.winner, r: '4.9', bg: '#C8F25A' }
    return [w, ...rest].slice(0, 8)
  }
  return list
}

// Scores of a sample bracket: quarter-finals, semi-finals, final (winner of each pair is the first number's side)
const QF = [[3, 1], [2, 3], [3, 0], [3, 2]] // winners: seats 0, 3, 4, 6
const SF = [[3, 1], [3, 2]]
const FINAL = [3, 2]

/** Eight-player knockout bracket. finished → every score, live → quarter-finals only, upcoming → draw without scores. */
export function bracket(x) {
  const e = entrants(x)
  const seats = [e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7]]
  const qf = [[0, 1], [2, 3], [4, 5], [6, 7]].map(([a, b], k) => ({ a: seats[a], b: seats[b], sa: QF[k][0], sb: QF[k][1] }))
  const winnersQF = qf.map((m) => (m.sa > m.sb ? m.a : m.b))
  const shown = x.status !== 'upcoming'
  const done = x.status === 'finished'
  const sf = [[0, 1], [2, 3]].map(([a, b], k) => ({ a: winnersQF[a], b: winnersQF[b], sa: SF[k][0], sb: SF[k][1] }))
  const winnersSF = sf.map((m) => (m.sa > m.sb ? m.a : m.b))
  const final = { a: winnersSF[0], b: winnersSF[1], sa: FINAL[0], sb: FINAL[1] }
  const hide = (m, on) => (on ? m : { a: m.a, b: m.b, sa: null, sb: null })
  return {
    quarter: qf.map((m) => hide(m, shown)),
    semi: sf.map((m) => (done || x.status === 'live' ? { ...m, sa: done ? m.sa : null, sb: done ? m.sb : null } : { a: null, b: null, sa: null, sb: null })),
    final: done ? final : { a: null, b: null, sa: null, sb: null },
    podium: done ? [final.sa > final.sb ? final.a : final.b, final.sa > final.sb ? final.b : final.a, sf[0].sa > sf[0].sb ? sf[0].b : sf[0].a] : [],
  }
}

// Sample venues (until they come from the backend): the organizer's main venue and a second one.
const VENUE_STREETS = ['Amir Temur ko‘chasi 108', 'Mustaqillik ko‘chasi 14', 'Bobur ko‘chasi 52', 'Navoiy ko‘chasi 31']

/** Venues of a tournament: [{ name, address, role: 'main' | 'extra', tables }]. */
export function locations(x) {
  if (x.created) return x.venue || x.address ? [{ name: x.venue || x.address, address: x.address || x.venue, role: 'main', n: 1 }] : []
  const org = ORGANIZERS[x.sport]
  const n = x.id.length
  const list = [{ name: org.name, address: VENUE_STREETS[n % 4], role: 'main', n: 4 + (n % 5) }]
  if (x.format === 'team' || x.max > 16) list.push({ name: `${org.name} 2`, address: VENUE_STREETS[(n + 1) % 4], role: 'extra', n: 2 + (n % 3) })
  return list
}

const PRIZE_SPLIT = [50, 30, 20]

/** Podium of a finished tournament with each player's record taken from the bracket scores. */
export function standings(x) {
  const br = bracket(x)
  const tally = {}
  const add = (p, won, gf, ga) => {
    const r = (tally[p.name] ||= { w: 0, l: 0, gf: 0, ga: 0 })
    r[won ? 'w' : 'l']++
    r.gf += gf
    r.ga += ga
  }
  for (const m of [...br.quarter, ...br.semi, br.final]) {
    if (m.sa == null) continue
    add(m.a, m.sa > m.sb, m.sa, m.sb)
    add(m.b, m.sb > m.sa, m.sb, m.sa)
  }
  const fund = x.prize ?? (x.players || 8) * 500000 // sample: finished tournaments keep no fund yet
  return br.podium.map((p, i) => ({ p, place: i + 1, ...tally[p.name], prize: Math.round(fund * PRIZE_SPLIT[i] / 100 / 10000) * 10000 }))
}
