import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Dialog from '../components/Dialog.jsx'
import { Arrow, Check } from '../components/icons.jsx'
import { CITIES, PUBLISH_FEE, SPORT_ROWS, formatDates, formatMoney } from '../data.js'
import { SPORT_PHOTO, saveCreated, slugify } from '../created.js'
import { submitLead } from '../leads.js'
import { PAY_METHODS, paymentsLive, startPayment } from '../payments.js'
import { photo } from '../photos.js'

const STEPS = ['info', 'place', 'entry', 'review']
const FORMATS = ['singles', 'doubles', 'team']
const EMPTY = {
  name: '', sport: 'futbol', format: 'team', about: '',
  start: '', end: '', deadline: '', city: 'tashkent', venue: '', address: '',
  max: '16', paid: true, fee: '', prize: '', rules: '',
  contact: '', phone: '',
}
const num = (v) => Number(String(v).replace(/\D/g, '')) || 0

// Required fields of each step: field → error key.
function check(step, f) {
  const e = {}
  if (step === 'info' && f.name.trim().length < 3) e.name = 1
  if (step === 'place') {
    if (!f.start) e.start = 1
    if (!f.end || (f.start && f.end < f.start)) e.end = 1
    if (f.deadline && f.start && f.deadline > f.start) e.deadline = 1
    if (f.city !== 'online' && !f.venue.trim()) e.venue = 1
  }
  if (step === 'entry') {
    if (num(f.max) < 2) e.max = 1
    if (f.paid && num(f.fee) < 1000) e.fee = 1
    if (!f.contact.trim()) e.contact = 1
    if (f.phone.replace(/\D/g, '').length < 9) e.phone = 1
  }
  return e
}

/** «Turnir o‘tkazish»: four steps, then publishing costs PUBLISH_FEE and gives a link to share. */
export default function CreatePage() {
  const { t, i18n } = useTranslation()
  const lng = i18n.resolvedLanguage
  const [f, setF] = useState(EMPTY)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [paying, setPaying] = useState(false)
  const [published, setPublished] = useState(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const current = STEPS[step]

  const go = (to) => {
    // Forward only past steps that are filled in.
    for (let i = step; i < to; i++) {
      const e = check(STEPS[i], f)
      if (Object.keys(e).length) {
        setStep(i)
        setErrors(e)
        requestAnimationFrame(() => document.getElementById(`cr-${Object.keys(e)[0]}`)?.focus())
        return
      }
    }
    setErrors({})
    setStep(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fee = f.paid ? num(f.fee) : 0
  const dates = f.start && f.end ? formatDates(f.start, f.end, lng) : '—'

  const publish = (x) => {
    saveCreated(x)
    setPublished(x)
    setPaying(false)
    window.scrollTo({ top: 0 })
  }

  if (published) return <Published x={published} />

  const err = (k) => errors[k] && <em id={`cr-${k}-e`} role="alert">{t(`create.err.${k}`)}</em>
  const input = (k, props = {}) => (
    <input id={`cr-${k}`} value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `cr-${k}-e` : undefined} {...props} />
  )

  return (
    <div className="page">
      <Header />
      <main className="wrap create">
        <div className="create-head">
          <h1 className="list-title">{t('create.title')}</h1>
          <p>{t('create.lead', { fee: formatMoney(PUBLISH_FEE, lng) })}</p>
        </div>

        <ol className="steps" aria-label={t('create.steps_label')}>
          {STEPS.map((s, i) => (
            <li key={s}>
              <button type="button" className={i === step ? 'step on' : i < step ? 'step ok' : 'step'} aria-current={i === step ? 'step' : undefined} onClick={() => go(i)}>
                <b>{i < step ? <Check size={14} /> : i + 1}</b>{t(`create.step.${s}`)}
              </button>
            </li>
          ))}
        </ol>

        <div className="create-body">
          <form className="create-form" noValidate onSubmit={(e) => { e.preventDefault(); if (step < 3) go(step + 1); else setPaying(true) }}>
            {current === 'info' && (
              <>
                <h2>{t('create.step.info')}</h2>
                <label className="ff"><span>{t('create.name')}<i aria-hidden="true"> *</i></span>{input('name', { maxLength: 80, placeholder: t('create.name_ph') })}{err('name')}</label>
                <div className="ff-row">
                  <label className="ff"><span>{t('hero.sport_label')}</span>
                    <select id="cr-sport" value={f.sport} onChange={set('sport')}>{SPORT_ROWS.map((s) => <option key={s} value={s}>{t(`sports.${s}`)}</option>)}</select></label>
                  <fieldset className="ff choice">
                    <legend>{t('create.format')}</legend>
                    <div className="choice-row">
                      {FORMATS.map((k) => (
                        <label key={k} className={f.format === k ? 'pay-opt on' : 'pay-opt'}><input type="radio" name="cr-format" value={k} checked={f.format === k} onChange={set('format')} />{t(`format.${k}`)}</label>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <label className="ff"><span>{t('create.about')}</span><textarea id="cr-about" rows={4} value={f.about} onChange={set('about')} maxLength={1500} placeholder={t('create.about_ph')} /></label>
              </>
            )}

            {current === 'place' && (
              <>
                <h2>{t('create.step.place')}</h2>
                <div className="ff-row">
                  <label className="ff"><span>{t('tpage.schedule.start')}<i aria-hidden="true"> *</i></span>{input('start', { type: 'date' })}{err('start')}</label>
                  <label className="ff"><span>{t('tpage.schedule.final')}<i aria-hidden="true"> *</i></span>{input('end', { type: 'date', min: f.start || undefined })}{err('end')}</label>
                  <label className="ff"><span>{t('tpage.schedule.reg')}</span>{input('deadline', { type: 'date', max: f.start || undefined })}{err('deadline')}</label>
                </div>
                <div className="ff-row">
                  <label className="ff"><span>{t('hero.city_label')}</span>
                    <select id="cr-city" value={f.city} onChange={set('city')}>{CITIES.map((c) => <option key={c} value={c}>{t(`cities.${c}`)}</option>)}</select></label>
                  <label className="ff"><span>{t('create.venue')}{f.city !== 'online' && <i aria-hidden="true"> *</i>}</span>{input('venue', { maxLength: 80, placeholder: t('create.venue_ph') })}{err('venue')}</label>
                </div>
                <label className="ff"><span>{t('create.address')}</span>{input('address', { maxLength: 120, placeholder: t('create.address_ph') })}</label>
              </>
            )}

            {current === 'entry' && (
              <>
                <h2>{t('create.step.entry')}</h2>
                <div className="ff-row">
                  <label className="ff"><span>{t(f.format === 'team' ? 'create.max_teams' : 'create.max_players')}<i aria-hidden="true"> *</i></span>{input('max', { inputMode: 'numeric' })}{err('max')}</label>
                  <fieldset className="ff choice">
                    <legend>{t('tpage.facts.fee')}</legend>
                    <div className="choice-row">
                      <label className={f.paid ? 'pay-opt on' : 'pay-opt'}><input type="radio" name="cr-paid" checked={f.paid} onChange={() => setF({ ...f, paid: true })} />{t('tournaments.prices.paid')}</label>
                      <label className={!f.paid ? 'pay-opt on' : 'pay-opt'}><input type="radio" name="cr-paid" checked={!f.paid} onChange={() => setF({ ...f, paid: false })} />{t('tournaments.prices.free')}</label>
                    </div>
                  </fieldset>
                </div>
                {f.paid && <label className="ff"><span>{t('create.fee')}<i aria-hidden="true"> *</i></span>{input('fee', { inputMode: 'numeric', placeholder: '50 000' })}<small className="ff-hint">{t('create.fee_hint')}</small>{err('fee')}</label>}
                <label className="ff"><span>{t('create.prize')}</span>{input('prize', { inputMode: 'numeric', placeholder: '5 000 000' })}</label>
                <label className="ff"><span>{t('create.rules')}</span><textarea id="cr-rules" rows={4} value={f.rules} onChange={set('rules')} maxLength={2000} placeholder={t('create.rules_ph')} /></label>
                <div className="ff-row">
                  <label className="ff"><span>{t('create.contact')}<i aria-hidden="true"> *</i></span>{input('contact', { autoComplete: 'name', maxLength: 80 })}{err('contact')}</label>
                  <label className="ff"><span>{t('sponsor.phone')}<i aria-hidden="true"> *</i></span>{input('phone', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: '+998 __ ___ __ __' })}{err('phone')}</label>
                </div>
              </>
            )}

            {current === 'review' && (
              <>
                <h2>{t('create.step.review')}</h2>
                <dl className="review-list">
                  <div><dt>{t('create.name')}</dt><dd>{f.name}</dd></div>
                  <div><dt>{t('hero.sport_label')}</dt><dd>{t(`sports.${f.sport}`)} · {t(`format.${f.format}`)}</dd></div>
                  <div><dt>{t('tpage.facts.date')}</dt><dd>{dates}</dd></div>
                  <div><dt>{t('tpage.facts.place')}</dt><dd>{[f.venue, t(`cities.${f.city}`)].filter(Boolean).join(', ')}</dd></div>
                  <div><dt>{t('tpage.facts.fee')}</dt><dd>{fee ? formatMoney(fee, lng) : t('tpage.facts.free')}</dd></div>
                  <div><dt>{t('tpage.facts.prize')}</dt><dd>{num(f.prize) ? formatMoney(num(f.prize), lng) : '—'}</dd></div>
                </dl>
                <p className="create-note">{t('create.review_note')}</p>
              </>
            )}

            <div className="create-nav">
              {step > 0 ? <button type="button" className="btn btn-line" onClick={() => go(step - 1)}>← {t('create.back')}</button> : <span />}
              {step < 3
                ? <button type="submit" className="btn btn-lime">{t('create.next')} <Arrow size={16} /></button>
                : <button type="submit" className="btn btn-lime btn-big">{t('create.publish', { fee: formatMoney(PUBLISH_FEE, lng) })}</button>}
            </div>
          </form>

          <aside className="create-preview" aria-label={t('create.preview')}>
            <small>{t('create.preview')}</small>
            <div className="tcard">
              <div className="tcard-media">
                <img {...photo(SPORT_PHOTO[f.sport], 420)} alt="" />
                <span className="badge">{t('status.upcoming')}</span>
                <span className={fee ? 'fee-tag' : 'fee-tag free'}>{fee ? formatMoney(fee, lng) : t('tpage.facts.free')}</span>
              </div>
              <div className="tcard-body">
                <h3>{f.name || t('create.name_ph')}</h3>
                <div className="meta"><span>{dates}</span><span>{t(`cities.${f.city}`)}</span></div>
              </div>
            </div>
            <p className="create-note">{t('create.includes')}</p>
          </aside>
        </div>
      </main>
      <Footer />
      {paying && <PublishDialog f={f} fee={fee} onClose={() => setPaying(false)} onDone={publish} />}
    </div>
  )
}

/** Payment for publishing: 20 000 so‘m by Click or Payme, then the tournament goes live. */
function PublishDialog({ f, fee, onClose, onDone }) {
  const { t, i18n } = useTranslation()
  const lng = i18n.resolvedLanguage
  const [method, setMethod] = useState('click')
  const [state, setState] = useState('idle')

  const pay = async () => {
    setState('sending')
    const id = slugify(f.name)
    const x = {
      id, name: f.name.trim(), created: true, sport: f.sport, format: f.format, status: 'upcoming',
      start: f.start, end: f.end, deadline: f.deadline || null, city: f.city, venue: f.venue.trim(), address: f.address.trim(),
      img: SPORT_PHOTO[f.sport], max: num(f.max), joined: 0, fee, prize: num(f.prize), about: f.about.trim(), rules: f.rules.trim(),
    }
    try {
      await submitLead({ type: 'tournament', tournament: x, contact: f.contact.trim(), phone: f.phone.trim(), method })
      const r = await startPayment({ amount: PUBLISH_FEE, method, purpose: 'publish', ref: id })
      if (r.url) { saveCreated(x); window.location.href = r.url; return }
      onDone(x)
    } catch { setState('failed') }
  }

  return (
    <Dialog labelledBy="pub-title" onClose={onClose} className="modal-form">
      <button type="button" className="modal-x" aria-label={t('auth.close')} onClick={onClose}>×</button>
      <h2 id="pub-title">{t('create.pay_title')}</h2>
      <p>{f.name}</p>
      <div className="rg-fee"><span>{t('create.pay_what')}</span><b>{formatMoney(PUBLISH_FEE, lng)}</b></div>
      <fieldset className="pay-pick">
        <legend>{t('pay.method')}</legend>
        {PAY_METHODS.map((m) => (
          <label key={m} className={method === m ? 'pay-opt on' : 'pay-opt'}>
            <input type="radio" name="pub-method" value={m} checked={method === m} onChange={() => setMethod(m)} />{t(`pay.${m}`)}
          </label>
        ))}
      </fieldset>
      {state === 'failed' && <em className="ff-err" role="alert">{t('sponsor.failed')}</em>}
      <button type="button" className="btn btn-lime btn-big" data-autofocus disabled={state === 'sending'} onClick={pay}>
        {state === 'sending' ? t('sponsor.sending') : t('register.pay', { fee: formatMoney(PUBLISH_FEE, lng), method: t(`pay.${method}`) })}
      </button>
      {!paymentsLive && <p className="note-test">{t('pay.test')}</p>}
      <p className="tp-more">{fee ? t('create.pay_fee_note') : t('create.pay_free_note')}</p>
    </Dialog>
  )
}

/** After payment: the public link and ways to spread it. */
function Published({ x }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}/tournament/${x.id}`
  const text = t('create.share_text', { name: x.name })
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* select the field by hand */ }
  }
  const native = async () => { try { await navigator.share({ title: x.name, text, url }) } catch { /* cancelled */ } }
  const enc = encodeURIComponent
  return (
    <div className="page">
      <Header />
      <main className="wrap published">
        <span className="done-mark big" aria-hidden="true"><Check size={40} /></span>
        <h1 className="list-title">{t('create.done_title')}</h1>
        <p>{t('create.done_text')}</p>
        <div className="share-link">
          <input readOnly value={url} aria-label={t('create.link')} onFocus={(e) => e.target.select()} />
          <button type="button" className="btn btn-lime" onClick={copy}>{copied ? t('tpage.copied') : t('create.copy')}</button>
        </div>
        <div className="share-row">
          <a className="btn btn-line" href={`https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`} target="_blank" rel="noopener noreferrer">Telegram</a>
          <a className="btn btn-line" href={`https://wa.me/?text=${enc(`${text} ${url}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a className="btn btn-line" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
          {typeof navigator !== 'undefined' && navigator.share && <button type="button" className="btn btn-line" onClick={native}>{t('tpage.share')}</button>}
        </div>
        <p className="create-note">{t('create.instagram')}</p>
        <div className="share-row">
          <Link to={`/tournament/${x.id}`} className="btn btn-lime btn-big">{t('create.open')} <Arrow size={16} /></Link>
          <Link to="/#ads" className="btn btn-line btn-big">{t('create.boost')}</Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
