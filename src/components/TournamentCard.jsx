import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Arrow, Calendar, Heart, Image, Pin, Trophy, User, Users } from './icons.jsx'
import { entryFee, formatDates, formatMoney } from '../data.js'
import { useAuth } from '../auth.jsx'
import { photo } from '../photos.js'

/**
 * One tournament card. Every card shows the same facts in the same places:
 * name, format, winner (finished) or prize fund (others), participants, dates, city, footer with the button.
 * `wide` is the big variant of the finished-results block; `anchor` gives the card an id for the hero links.
 */
export default function TournamentCard({ item, anchor = false, focus = false, wide = false }) {
  const { t, i18n } = useTranslation()
  const lng = i18n.resolvedLanguage
  const { requireAuth } = useAuth()
  const [liked, setLiked] = useState(false)
  const name = item.name || t(`tournaments.names.${item.id}`)
  const fee = entryFee(item)
  const finished = item.status === 'finished'
  const team = item.format === 'team'

  const participants = finished
    ? (item.teams ? t('finished.teams', { teams: item.teams, count: item.players }) : t('finished.players', { count: item.players }))
    : t(team ? 'tournaments.teams_joined' : 'tournaments.players_joined', { count: item.joined, max: item.max })

  return (
    <article id={anchor ? `t-${item.id}` : undefined} className={`${wide ? 'tcard tcard-wide' : 'tcard'}${focus ? ' focus' : ''}`}>
      <div className="tcard-media">
        <img {...photo(item.img, wide ? 800 : 420)} loading="lazy" alt={name} />
        <span className={finished ? 'badge badge-done' : 'badge'}>{t(`status.${item.status}`)}</span>
        {!finished && <span className={fee ? 'fee-tag' : 'fee-tag free'}>{fee ? formatMoney(fee, lng) : t('tpage.facts.free')}</span>}
        <button type="button" className={liked ? 'like on' : 'like'} aria-pressed={liked} aria-label={t('tournaments.save')} onClick={() => requireAuth(() => setLiked(!liked))}>
          <Heart size={16} />
        </button>
      </div>
      <div className="tcard-body">
        <h3><Link to={`/tournament/${item.id}`}>{name}</Link></h3>
        <span className="format">{item.format === 'singles' ? <User size={14} /> : <Users size={14} />}{t(`format.${item.format}`)}</span>
        <div className="result-line">
          <span className="winner">
            <Trophy size={16} />
            {finished ? <>{t('finished.winner')} <b>{item.winner}</b></> : t('tournaments.prize', { amount: formatMoney(item.prize, lng) })}
          </span>
        </div>
        <div className="meta">
          <span>{team ? <Users size={16} /> : <User size={16} />}{participants}</span>
          <span><Calendar size={16} />{formatDates(item.start, item.end, lng)}</span>
          <span><Pin size={16} />{t(`cities.${item.city}`)}</span>
        </div>
        <div className="tcard-foot">
          <span className="sponsor"><span className="sponsor-logo"><Image size={16} /></span>{t('tournaments.sponsor')}</span>
          <Link to={`/tournament/${item.id}`} className="btn btn-soft">{finished ? t('finished.results') : t('tournaments.details')} <Arrow size={16} /></Link>
        </div>
      </div>
    </article>
  )
}
