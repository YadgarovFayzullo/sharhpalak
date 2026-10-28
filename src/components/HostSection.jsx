import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Arrow, Check, Plus } from './icons.jsx'
import { OFFER_URL, PUBLISH_FEE, SPORT_ROWS, formatMoney } from '../data.js'
import { submitLead } from '../leads.js'

const EMPTY = { name: '', phone: '', company: '', sport: 'futbol', message: '', agree: false, site: '' }
const phoneOk = (v) => v.replace(/\D/g, '').length >= 9

/** For organizers: run a tournament yourself (price, three steps) or leave a request and the team helps. */
export default function HostSection() {
  const { t, i18n } = useTranslation()
  const [f, setF] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | done | failed
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const err = {}
    if (!f.name.trim()) err.name = 1
    if (!phoneOk(f.phone)) err.phone = 1
    if (!f.agree) err.agree = 1
    setErrors(err)
    if (Object.keys(err).length) { document.getElementById(`ap-${Object.keys(err)[0]}`)?.focus(); return }
    if (f.site) { setState('done'); return } // honeypot
    setState('sending')
    try {
      await submitLead({ type: 'organizer', name: f.name.trim(), phone: f.phone.trim(), company: f.company.trim(), sport: f.sport, message: f.message.trim() })
      setState('done')
    } catch { setState('failed') }
  }

  return (
    <section className="host" id="apply">
      <div className="wrap host-in">
        <div className="host-pitch">
          <h2>{t('host.title')}</h2>
          <p>{t('host.lead')}</p>
          <ol className="host-steps">
            {['s1', 's2', 's3'].map((k, i) => (
              <li key={k}><b>{i + 1}</b><span><strong>{t(`host.${k}`)}</strong>{t(`host.${k}_d`)}</span></li>
            ))}
          </ol>
          <div className="host-price">
            <span className="host-price-n">{formatMoney(PUBLISH_FEE, i18n.resolvedLanguage)}</span>
            <span>{t('host.price_note')}</span>
          </div>
          <Link to="/create" className="btn btn-lime btn-big"><Plus size={18} />{t('header.create')}</Link>
        </div>

        <div className="host-form">
          {state === 'done' ? (
            <div className="host-done" role="status">
              <span className="done-mark" aria-hidden="true"><Check size={26} /></span>
              <h3>{t('host.done_title')}</h3>
              <p>{t('host.done_text')}</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="sp-form">
              <h3>{t('host.form_title')}</h3>
              <p>{t('host.form_text')}</p>
              <label className="ff"><span>{t('sponsor.name')}<i aria-hidden="true"> *</i></span>
                <input id="ap-name" value={f.name} onChange={set('name')} autoComplete="name" maxLength={120} aria-invalid={!!errors.name} />
                {errors.name && <em role="alert">{t('sponsor.err_name')}</em>}</label>
              <label className="ff"><span>{t('sponsor.phone')}<i aria-hidden="true"> *</i></span>
                <input id="ap-phone" type="tel" inputMode="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="+998 __ ___ __ __" aria-invalid={!!errors.phone} />
                {errors.phone && <em role="alert">{t('sponsor.err_phone')}</em>}</label>
              <div className="ff-row">
                <label className="ff"><span>{t('host.company')}</span>
                  <input id="ap-company" value={f.company} onChange={set('company')} autoComplete="organization" maxLength={120} /></label>
                <label className="ff"><span>{t('hero.sport_label')}</span>
                  <select id="ap-sport" value={f.sport} onChange={set('sport')}>
                    {SPORT_ROWS.map((s) => <option key={s} value={s}>{t(`sports.${s}`)}</option>)}
                  </select></label>
              </div>
              <label className="ff"><span>{t('host.message')}</span>
                <textarea id="ap-message" rows={3} value={f.message} onChange={set('message')} maxLength={1000} placeholder={t('host.message_ph')} /></label>
              <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.site} onChange={set('site')} name="site" />
              <label className="ff-check">
                <input id="ap-agree" type="checkbox" checked={f.agree} onChange={set('agree')} aria-invalid={!!errors.agree} />
                <span><Trans i18nKey="sponsor.agree" components={{ offer: OFFER_URL ? <a href={OFFER_URL} target="_blank" rel="noopener noreferrer" /> : <span /> }} /></span>
              </label>
              {errors.agree && <em className="ff-err" role="alert">{t('sponsor.err_agree')}</em>}
              {state === 'failed' && <em className="ff-err" role="alert">{t('sponsor.failed')}</em>}
              <button type="submit" className="btn btn-lime btn-big" disabled={state === 'sending'}>{state === 'sending' ? t('sponsor.sending') : t('host.submit')} <Arrow size={16} /></button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
