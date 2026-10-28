import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Arrow } from './icons.jsx'
import { Mark } from './Partners.jsx'
import { ORGS, TOURNAMENTS } from '../data.js'

/** Organizers with the best ratings: history and reviews on their own page. */
export default function Organizers() {
  const { t } = useTranslation()
  const top = [...ORGS].sort((a, b) => b.rating - a.rating || b.hosted - a.hosted).slice(0, 4)
  return (
    <section className="wrap section" id="organizers">
      <div className="sec-head">
        <div className="sec-lead">
          <h2>{t('organizer.title')}</h2>
          <p>{t('organizer.lead')}</p>
        </div>
      </div>
      <div className="orgs">
        {top.map((o) => {
          const open = TOURNAMENTS.filter((x) => x.sport === o.sport && x.status !== 'finished').length
          return (
            <Link key={o.id} to={`/organizer/${o.id}`} className="org-card">
              <span className="org-head">
                <span className="org-mark" aria-hidden="true"><Mark mark={o.mark} size={24} /></span>
                <span><b>{o.name}</b><small>{t(`organizer.kinds.${o.kind}`)} · {t(`cities.${o.city}`)}</small></span>
              </span>
              <span className="org-rating"><b>★ {o.rating.toFixed(1)}</b><small>{t('organizer.reviews', { count: o.reviews })}</small></span>
              <span className="org-stats">
                <span><b>{o.hosted}</b>{t('organizer.held')}</span>
                <span><b>{open}</b>{t('organizer.open')}</span>
              </span>
              <span className="more">{t('organizer.profile')} <Arrow size={16} /></span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
