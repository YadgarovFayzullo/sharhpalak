import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from './icons.jsx'
import { useSponsor } from '../sponsor.jsx'

export default function Cta() {
  const { t } = useTranslation()
  const { openSponsor } = useSponsor()
  return (
    <section className="cta" id="cta">
      <div className="wrap cta-in">
        <h2>{t('cta.title')}</h2>
        <p>{t('cta.text')}</p>
        <div className="cta-actions">
          <Link to="/create" className="btn btn-lime"><Plus size={18} />{t('cta.create')}</Link>
          <button type="button" className="btn btn-ghost" onClick={openSponsor}>{t('cta.sponsor')}</button>
        </div>
      </div>
    </section>
  )
}
