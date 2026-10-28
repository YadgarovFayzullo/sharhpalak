import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Dialog from './Dialog.jsx'
import { OFFER_URL, formatMoney } from '../data.js'
import { submitLead } from '../leads.js'
import { PAY_METHODS, paymentsLive, startPayment } from '../payments.js'

const phoneOk = (v) => v.replace(/\D/g, '').length >= 9

/** Registration for an open tournament, right on its page: contacts, team name, and payment when it is paid. */
export default function RegisterDialog({ x, name, fee, onClose }) {
  const { t, i18n } = useTranslation()
  const lng = i18n.resolvedLanguage
  const group = x.format !== 'singles' // team or doubles: ask for the team / pair name
  const [f, setF] = useState({ name: '', phone: '', team: '', method: 'click', agree: false })
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | done | failed
  const [copied, setCopied] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const err = {}
    if (!f.name.trim()) err.name = 1
    if (!phoneOk(f.phone)) err.phone = 1
    if (group && !f.team.trim()) err.team = 1
    if (!f.agree) err.agree = 1
    setErrors(err)
    if (Object.keys(err).length) { document.getElementById(`rg-${Object.keys(err)[0]}`)?.focus(); return }
    setState('sending')
    try {
      await submitLead({ type: 'registration', tournament: x.id, name: f.name.trim(), phone: f.phone.trim(), team: f.team.trim(), fee, method: fee ? f.method : null })
      if (fee) {
        const pay = await startPayment({ amount: fee, method: f.method, purpose: 'registration', ref: x.id })
        if (pay.url) { window.location.href = pay.url; return }
      }
      setState('done')
    } catch { setState('failed') }
  }

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: name, url })
      else { await navigator.clipboard.writeText(url); setCopied(true) }
    } catch { /* cancelled */ }
  }

  const close = <button type="button" className="modal-x" aria-label={t('auth.close')} onClick={onClose}>×</button>

  if (state === 'done') {
    return (
      <Dialog labelledBy="rg-title" onClose={onClose} className="modal-form">
        {close}
        <span className="done-mark" aria-hidden="true">✓</span>
        <h2 id="rg-title">{t('register.done_title')}</h2>
        <p>{t('register.done_text', { name })}</p>
        {fee > 0 && !paymentsLive && <p className="note-test">{t('pay.test')}</p>}
        <button type="button" className="btn btn-lime btn-big" data-autofocus onClick={share}>{copied ? t('tpage.copied') : t('register.invite')}</button>
        <button type="button" className="btn btn-line" onClick={onClose}>{t('sponsor.done_close')}</button>
      </Dialog>
    )
  }

  const field = (k, { label, ...props }) => (
    <label className="ff">
      <span>{label}<i aria-hidden="true"> *</i></span>
      <input id={`rg-${k}`} value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `rg-${k}-e` : undefined} maxLength={80} required {...props} />
      {errors[k] && <em id={`rg-${k}-e`} role="alert">{t(`register.err_${k}`)}</em>}
    </label>
  )

  return (
    <Dialog labelledBy="rg-title" onClose={onClose} className="modal-form">
      {close}
      <h2 id="rg-title">{t('register.title')}</h2>
      <p>{name}</p>
      <div className="rg-fee"><span>{t('tpage.facts.fee')}</span><b>{fee ? formatMoney(fee, lng) : t('tpage.facts.free')}</b></div>
      <form onSubmit={submit} noValidate className="sp-form">
        {group && field('team', { label: t(x.format === 'team' ? 'register.team' : 'register.pair'), autoComplete: 'off' })}
        {field('name', { label: t(group ? 'register.captain' : 'register.name'), autoComplete: 'name' })}
        {field('phone', { label: t('sponsor.phone'), type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: '+998 __ ___ __ __' })}
        {fee > 0 && (
          <fieldset className="pay-pick">
            <legend>{t('pay.method')}</legend>
            {PAY_METHODS.map((m) => (
              <label key={m} className={f.method === m ? 'pay-opt on' : 'pay-opt'}>
                <input type="radio" name="rg-method" value={m} checked={f.method === m} onChange={set('method')} />
                {t(`pay.${m}`)}
              </label>
            ))}
          </fieldset>
        )}
        <label className="ff-check">
          <input id="rg-agree" type="checkbox" checked={f.agree} onChange={set('agree')} aria-invalid={!!errors.agree} />
          <span><Trans i18nKey="register.agree" components={{ offer: OFFER_URL ? <a href={OFFER_URL} target="_blank" rel="noopener noreferrer" /> : <span /> }} /></span>
        </label>
        {errors.agree && <em className="ff-err" role="alert">{t('sponsor.err_agree')}</em>}
        {state === 'failed' && <em className="ff-err" role="alert">{t('sponsor.failed')}</em>}
        <button type="submit" className="btn btn-lime btn-big" disabled={state === 'sending'}>
          {state === 'sending' ? t('sponsor.sending') : fee ? t('register.pay', { fee: formatMoney(fee, lng), method: t(`pay.${f.method}`) }) : t('register.submit_free')}
        </button>
        {fee > 0 && !paymentsLive && <p className="note-test">{t('pay.test')}</p>}
      </form>
    </Dialog>
  )
}
