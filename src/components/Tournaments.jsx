import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Arrow, SPORT_ICONS } from './icons.jsx'
import TournamentCard from './TournamentCard.jsx'
import { NO_FILTERS, PRICES, ROW_LIMIT, SPORTS, SPORT_ROWS, STATUSES, TOURNAMENTS, entryFee } from '../data.js'

export default function Tournaments({ filters, setFilters }) {
  const { t } = useTranslation()
  const [status, setStatus] = useState('upcoming')
  const [focus, setFocus] = useState(null)
  const [price, setPrice] = useState('all')

  // Search matches the tournament name in the current language.
  const q = filters.q.trim().toLowerCase()
  const visible = TOURNAMENTS.filter((x) => x.status === status
    && (!q || t(`tournaments.names.${x.id}`).toLowerCase().includes(q))
    && (!filters.city || x.city === filters.city)
    && (!filters.date || x.end >= filters.date)
    // Finished tournaments take no entries, so the price filter does not apply to them.
    && (price === 'all' || x.status === 'finished' || (price === 'free') === (entryFee(x) === 0)))
  // One row per sport: the chosen chip narrows it to a single row.
  const rows = SPORT_ROWS
    .filter((s) => filters.sport === 'all' || filters.sport === s)
    .map((s) => ({ sport: s, items: visible.filter((x) => x.sport === s) }))
    .filter((r) => r.items.length > 0)
  const filtered = JSON.stringify(filters) !== JSON.stringify(NO_FILTERS)

  // "#t-<id>" (hero photos): open the card's tab, clear filters, scroll to it and highlight it.
  useEffect(() => {
    const open = () => {
      const x = TOURNAMENTS.find((c) => `#t-${c.id}` === window.location.hash)
      if (!x || x.status === 'finished') return
      setStatus(x.status)
      setFilters(NO_FILTERS)
      setFocus(x.id)
      requestAnimationFrame(() => document.getElementById(`t-${x.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    }
    open()
    window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [setFilters])

  useEffect(() => {
    if (!focus) return
    const id = setTimeout(() => setFocus(null), 2400)
    return () => clearTimeout(id)
  }, [focus])

  return (
    <section className="wrap section" id="tournaments">
      <div className="sports" role="toolbar" aria-label={t('tournaments.sport_label')}>
        {SPORTS.map((s) => {
          const Icon = SPORT_ICONS[s]
          return (
            <button key={s} type="button" className={filters.sport === s ? 'sport on' : 'sport'} aria-pressed={filters.sport === s}
              onClick={() => setFilters({ ...filters, sport: s })}>
              <span className="sport-i"><Icon size={18} /></span>{t(`sports.${s}`)}
            </button>
          )
        })}
      </div>

      <div className="sec-head">
        <h2>{t('tournaments.title')}</h2>
        <div className="sec-tools">
          <div className="seg" role="tablist" aria-label={t('tournaments.status_label')}>
            {STATUSES.map((s) => (
              <button key={s} type="button" role="tab" aria-selected={status === s} className={status === s ? 'on' : ''} onClick={() => setStatus(s)}>{t(`status.${s}`)}</button>
            ))}
          </div>
          {status !== 'finished' && (
            <div className="seg" role="group" aria-label={t('tournaments.price_label')}>
              {PRICES.map((p) => (
                <button key={p} type="button" aria-pressed={price === p} className={price === p ? 'on' : ''} onClick={() => setPrice(p)}>{t(`tournaments.prices.${p}`)}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {rows.map(({ sport, items }) => {
        const Icon = SPORT_ICONS[sport]
        return (
          <div key={sport} className="sport-row" aria-labelledby={`row-${sport}`}>
            <div className="row-head">
              <h3 id={`row-${sport}`}>
                <span className="sport-i"><Icon size={18} /></span>
                {t(`sports.${sport}`)}
                <span className="row-count">{items.length}</span>
              </h3>
              <Link to={`/tournaments/${sport}?status=${status}`} className="more">{t('tournaments.more')} <Arrow size={16} /></Link>
            </div>
            <div className="cards">
              {items.slice(0, ROW_LIMIT).map((x) => (
                <TournamentCard key={x.id} item={x} anchor={status !== 'finished'} focus={focus === x.id} />
              ))}
            </div>
          </div>
        )
      })}

      {rows.length === 0 && (
        <div className="empty">
          {t('tournaments.empty')}
          {filtered && <button type="button" className="btn btn-line" onClick={() => setFilters(NO_FILTERS)}>{t('tournaments.clear')}</button>}
        </div>
      )}
    </section>
  )
}
