import { useTranslation } from 'react-i18next'
import { Arrow } from './icons.jsx'
import { useSponsor } from '../sponsor.jsx'
import { photo } from '../photos.js'

/** Wide advertising block between the tournament rows: a sports-wear or other brand rents it. Empty slot until sold. */
export default function BrandAd() {
  const { t } = useTranslation()
  const { openSponsor } = useSponsor()
  return (
    <section className="wrap section" aria-label={t('brand_ad.label')}>
      <div className="brand-ad">
        <img {...photo('tennis4', 900)} loading="lazy" alt="" />
        <span className="banner-tag banner-tag-ad">{t('banners.ad')}</span>
        <div className="brand-ad-in">
          <small>{t('brand_ad.kicker')}</small>
          <h2>{t('brand_ad.title')}</h2>
          <p>{t('brand_ad.text')}</p>
          <button type="button" className="btn btn-lime" onClick={openSponsor}>{t('brand_ad.cta')} <Arrow size={16} /></button>
        </div>
      </div>
    </section>
  )
}
