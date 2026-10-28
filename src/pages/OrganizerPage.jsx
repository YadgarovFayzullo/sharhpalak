import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import TournamentCard from '../components/TournamentCard.jsx'
import { Mark } from '../components/Partners.jsx'
import { Check } from '../components/icons.jsx'
import { ORGS, TOURNAMENTS, formatDates, ratingSplit, reviewsOf } from '../data.js'
import { useAuth } from '../auth.jsx'

// Reviews written in this browser until the backend stores them.
const key = (id) => `charhpalak.reviews.${id}`
const readMine = (id) => { try { return JSON.parse(localStorage.getItem(key(id)) || '[]') } catch { return [] } }

const Stars = ({ n }) => <span className="stars" aria-label={`${n} / 5`}>{'★'.repeat(n)}<span aria-hidden="true">{'★'.repeat(5 - n)}</span></span>

/** An organizer's page: rating, open tournaments, the history of held ones and participants' reviews. */
export default function OrganizerPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const lng = i18n.resolvedLanguage
  const { requireAuth } = useAuth()
  const org = ORGS.find((o) => o.id === id)
  const [mine, setMine] = useState(() => readMine(id))
  const [form, setForm] = useState({ stars: 0, text: '', tournament: '' })
  const [err, setErr] = useState(false)
  if (!org) return <Navigate to="/" replace />

  const own = TOURNAMENTS.filter((x) => x.sport === org.sport)
  const open = own.filter((x) => x.status !== 'finished')
  const done = own.filter((x) => x.status === 'finished')
  const live = own.filter((x) => x.status === 'live')
  const history = [...live, ...done].sort((a, b) => b.start.localeCompare(a.start))
  const split = ratingSplit(org)
  const tName = (tid) => t(`tournaments.names.${tid}`)
  const reviews = [...mine, ...reviewsOf(org).map((r) => ({ ...r, text: t(`organizer.samples.${r.key}`) }))]

  const send = (e) => {
    e.preventDefault()
    if (!form.stars || !form.text.trim()) { setErr(true); return }
    requireAuth(() => {
      const r = { who: t('organizer.you'), stars: form.stars, text: form.text.trim(), tournament: form.tournament || null, mine: true }
      const next = [r, ...mine]
      setMine(next)
      try { localStorage.setItem(key(id), JSON.stringify(next)) } catch { /* shown for this visit only */ }
      setForm({ stars: 0, text: '', tournament: '' })
      setErr(false)
    })
  }

  return (
    <div className="page">
      <Header />
      <main>
        <section className="org-hero">
          <div className="wrap org-hero-in">
            <Link to="/#organizers" className="back tp-back">← {t('organizer.all')}</Link>
            <div className="org-top">
              <span className="org-mark org-mark-big" aria-hidden="true"><Mark mark={org.mark} size={40} /></span>
              <div className="org-id">
                <h1 className="tp-title">{org.name}</h1>
                <p><span className="org-verified"><Check size={14} />{t('organizer.verified')}</span> {t(`organizer.kinds.${org.kind}`)} · {t(`cities.${org.city}`)} · {t('organizer.since', { year: org.since })}</p>
              </div>
            </div>
            <div className="tp-facts">
              <div className="tp-fact org-fact"><span className="fk">{t('organizer.rating')}</span><span className="fv">★ {org.rating.toFixed(1)}</span></div>
              <div className="tp-fact org-fact"><span className="fk">{t('organizer.reviews_title')}</span><span className="fv">{org.reviews + mine.length}</span></div>
              <div className="tp-fact org-fact"><span className="fk">{t('organizer.held')}</span><span className="fv">{org.hosted}</span></div>
              <div className="tp-fact org-fact"><span className="fk">{t('organizer.open')}</span><span className="fv">{open.length}</span></div>
            </div>
          </div>
        </section>

        <div className="wrap tp-body">
          <div className="tp-main org-main">
            {open.length > 0 && (
              <section>
                <h2 className="org-h">{t('organizer.open_title')}</h2>
                <div className="cards cards-org">{open.map((x) => <TournamentCard key={x.id} item={x} />)}</div>
              </section>
            )}

            <section>
              <h2 className="org-h">{t('organizer.history')}</h2>
              <div className="org-table-wrap">
                <table className="org-table">
                  <thead><tr><th>{t('organizer.col_date')}</th><th>{t('organizer.col_name')}</th><th>{t('organizer.col_people')}</th><th>{t('organizer.col_winner')}</th></tr></thead>
                  <tbody>
                    {history.map((x) => (
                      <tr key={x.id}>
                        <td>{formatDates(x.start, x.end, lng)}</td>
                        <td><Link to={`/tournament/${x.id}`}>{tName(x.id)}</Link></td>
                        <td>{x.status === 'finished' ? (x.teams ? t('finished.teams', { teams: x.teams, count: x.players }) : t('finished.players', { count: x.players })) : t(x.format === 'team' ? 'tournaments.teams_joined' : 'tournaments.players_joined', { count: x.joined, max: x.max })}</td>
                        <td>{x.status === 'finished' ? <b>{x.winner}</b> : <span className="badge-pill">{t('status.live')}</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="org-h">{t('organizer.reviews_title')}</h2>
              <ul className="reviews">
                {reviews.map((r, i) => (
                  <li key={i} className={r.mine ? 'review mine' : 'review'}>
                    <div className="review-top"><b>{r.who}</b><Stars n={r.stars} /></div>
                    <p>{r.text}</p>
                    {r.tournament && <small>{tName(r.tournament)}</small>}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="tp-aside">
            <div className="tp-card">
              <h2>{t('organizer.rating')}</h2>
              <div className="org-score"><b>{org.rating.toFixed(1)}</b><Stars n={Math.round(org.rating)} /></div>
              <ul className="rating-bars">
                {split.map((c, i) => (
                  <li key={i}><span>{5 - i}★</span><i><em style={{ width: `${Math.round((c / org.reviews) * 100)}%` }} /></i><small>{c}</small></li>
                ))}
              </ul>
            </div>
            <form className="tp-card review-form" onSubmit={send} noValidate>
              <h2>{t('organizer.leave')}</h2>
              <p className="tp-more">{t('organizer.leave_note')}</p>
              <label className="ff"><span>{t('organizer.which')}</span>
                <select value={form.tournament} onChange={(e) => setForm({ ...form, tournament: e.target.value })}>
                  <option value="">—</option>
                  {done.map((x) => <option key={x.id} value={x.id}>{tName(x.id)}</option>)}
                </select>
              </label>
              <div className="star-pick" role="radiogroup" aria-label={t('organizer.your_rating')}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" role="radio" aria-checked={form.stars === n} aria-label={`${n} / 5`} className={n <= form.stars ? 'on' : ''} onClick={() => setForm({ ...form, stars: n })}>★</button>
                ))}
              </div>
              <label className="ff"><span>{t('organizer.your_text')}</span>
                <textarea rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} maxLength={800} placeholder={t('organizer.text_ph')} />
              </label>
              {err && <em className="ff-err" role="alert">{t('organizer.err')}</em>}
              <button type="submit" className="btn btn-lime">{t('organizer.send')}</button>
            </form>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
