import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Globe, Logo, Plus } from './icons.jsx'
import Select from './Select.jsx'
import { LANGUAGES } from '../i18n.js'

const NAV = [
  { key: 'tournaments', href: '#tournaments' },
  { key: 'organizers', href: '#organizers' },
  { key: 'apply', href: '#apply' },
  { key: 'partners', href: '#ads' },
]

export default function Header() {
  const { t, i18n } = useTranslation()
  const home = useLocation().pathname === '/'
  // On the home page sections are plain anchors; on other pages go home first.
  const section = (hash, props, children) => (home ? <a href={hash} {...props}>{children}</a> : <Link to={`/${hash}`} {...props}>{children}</Link>)
  return (
    <header className="header">
      <div className="wrap header-in">
        {section('#top', { className: 'logo', 'aria-label': t('header.home') }, <><Logo /><span>Ki<b>Go</b></span></>)}
        <nav className="nav" aria-label={t('header.nav_label')}>
          {NAV.map((n) => <span key={n.key} className="nav-item">{section(n.href, {}, t(`header.nav.${n.key}`))}</span>)}
        </nav>
        <div className="header-actions">
          <Select
            variant="lang"
            align="end"
            label={t('header.language')}
            icon={<Globe size={18} />}
            value={i18n.resolvedLanguage}
            onChange={(code) => i18n.changeLanguage(code)}
            options={LANGUAGES.map((l) => ({ value: l.code, label: l.name, short: l.label, lang: l.code }))}
          />
          <button type="button" className="btn btn-line">{t('header.login')}</button>
          <Link to="/create" className="btn btn-lime" aria-label={t('header.create')}><Plus size={18} /><span className="btn-label">{t('header.create')}</span></Link>
        </div>
      </div>
    </header>
  )
}
