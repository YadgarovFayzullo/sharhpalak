import { useTranslation } from 'react-i18next'
import { Arrow } from './icons.jsx'
import { useSponsor } from '../sponsor.jsx'

const FORMATS = ['slider', 'block', 'tournament']

/** Where brands and organizers can advertise: the top slider, the brand block, a tournament's sponsor slot. */
export default function AdFormats() {
  const { t } = useTranslation()
  const { openSponsor } = useSponsor()
  return (
    <section className="wrap section" id="ads">
      <div className="sec-head">
        <div className="sec-lead">
          <h2>{t('ads.title')}</h2>
          <p>{t('ads.lead')}</p>
        </div>
        <button type="button" className="btn btn-lime" onClick={openSponsor}>{t('ads.cta')} <Arrow size={16} /></button>
      </div>
      <div className="ad-formats">
        {FORMATS.map((k, i) => (
          <div key={k} className="ad-format">
            <span className="ad-n">0{i + 1}</span>
            <b>{t(`ads.${k}.title`)}</b>
            <p>{t(`ads.${k}.text`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
