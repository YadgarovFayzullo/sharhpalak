import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { Arrow, Calendar, Check, Eye, Pin, Trophy, User, Users } from '../components/icons.jsx'
import { PARTNER_LOGOS, bracket, entrants, entryFee, formatDates, formatMoney, locations, organizerOf, registrationDeadline, standings } from '../data.js'
import { findTournament } from '../created.js'
import RegisterDialog from '../components/RegisterDialog.jsx'
import { Mark } from '../components/Partners.jsx'
import { fetchViews, trackView, viewsEnabled } from '../views.js'
import { useSponsor } from '../sponsor.jsx'
import { photo } from '../photos.js'

const TABS = ['overview', 'players', 'bracket', 'locations', 'results', 'sponsors']
const MARKED = PARTNER_LOGOS.filter((l) => l.mark) // sponsors drawn as a mark + name
const SPLIT = [50, 30, 20] // share of the prize fund by place, %
// What the bracket score counts in each sport; races have no head-to-head score.
const SCORE_UNIT = { futbol: 'goals', boshqa: 'points', tennis: 'sets', shaxmat: 'games', bilyard: 'games' }

function Seat({ p, score, win, tbd }) {
  return (
    <div className={`seat${win ? ' win' : ''}`}>
      <span className="seat-i" style={p ? { background: p.bg } : undefined}>{p ? p.i : '?'}</span>
      <span className="seat-n">{p ? p.name : tbd}</span>
      <b className="seat-s">{score ?? ''}</b>
    </div>
  )
}

function Match({ m, tbd }) {
  const done = m.sa != null
  return (
    <div className="match">
      <Seat p={m.a} score={m.sa} win={done && m.sa > m.sb} tbd={tbd} />
      <Seat p={m.b} score={m.sb} win={done && m.sb > m.sa} tbd={tbd} />
    </div>
  )
}

/** Page of one tournament, reached by its slug (the tournament id). No booking here: only registration. */
export default function TournamentPage() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const lng = i18n.resolvedLanguage
  const x = findTournament(slug)
  const [tab, setTab] = useState(null)
  const [copied, setCopied] = useState(false)
  const [views, setViews] = useState(null)
  const [registering, setRegistering] = useState(false)
  const { openSponsor } = useSponsor()
  useEffect(() => {
    if (!x || !viewsEnabled) return
    setViews(null)
    fetchViews(slug).then(setViews, () => {})
    return trackView(slug, setViews)
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (tab) document.getElementById(`tab-${tab}`)?.scrollIntoView({ inline: 'nearest', block: 'nearest' })
  }, [tab])
  if (!x) return <Navigate to="/tournaments" replace />

  const name = x.name || t(`tournaments.names.${x.id}`)
  const org = organizerOf(x)
  const sportName = t(`sports.${x.sport}`)
  const finished = x.status === 'finished'
  const upcoming = x.status === 'upcoming'
  const team = x.format === 'team'
  const full = upcoming && x.joined >= x.max
  const active = tab ?? (finished ? 'results' : 'overview')
  const list = entrants(x)
  const fee = entryFee(x)
  const count = finished ? x.players : x.joined
  const br = bracket(x)
  const venues = locations(x)

  const share = async () => {
    const data = { title: name, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(data)
      else { await navigator.clipboard.writeText(data.url); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    } catch { /* cancelled */ }
  }
  // A fact tile leads to the part of the page that explains it: a tab, or a card in the sidebar.
  const jump = (go) => {
    const [tabName, anchor] = go.split('#') // "tab", "tab#element" or "#element" (a card outside the tabs)
    const target = anchor || 'tp-tabs'
    if (tabName) setTab(tabName)
    requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  const onTabKey = (e) => {
    const i = TABS.indexOf(active)
    const n = e.key === 'ArrowRight' ? (i + 1) % TABS.length : e.key === 'ArrowLeft' ? (i + TABS.length - 1) % TABS.length : -1
    if (n < 0) return
    e.preventDefault()
    setTab(TABS[n])
    document.getElementById(`tab-${TABS[n]}`)?.focus()
  }

  const facts = [
    { k: 'date', go: 'overview#tp-schedule', icon: <Calendar size={18} />, v: formatDates(x.start, x.end, lng) },
    { k: 'place', go: 'locations', icon: <Pin size={18} />, v: t(`cities.${x.city}`) },
    { k: 'players', go: 'players', icon: team ? <Users size={18} /> : <User size={18} />, v: finished ? t(team ? 'finished.teams' : 'finished.players', { teams: x.teams, count: x.players }) : t(team ? 'tournaments.teams_joined' : 'tournaments.players_joined', { count: x.joined, max: x.max }) },
    !finished && { k: 'fee', go: '#tp-fee', icon: <Check size={18} />, v: fee ? formatMoney(fee, lng) : t('tpage.facts.free') },
    !finished && { k: 'prize', go: '#tp-prizes', icon: <Trophy size={18} />, v: formatMoney(x.prize, lng) },
  ].filter(Boolean)

  const cta = finished
    ? <a href="#tp-tabs" className="btn btn-lime btn-big" onClick={() => setTab('results')}>{t('tpage.see_results')} <Arrow size={18} /></a>
    : upcoming
      ? (full
        ? <span className="btn btn-big btn-off" aria-disabled="true">{t('tpage.closed')}</span>
        : <button type="button" className="btn btn-lime btn-big" onClick={() => setRegistering(true)}>{fee ? t('tpage.register', { fee: formatMoney(fee, lng) }) : t('tpage.register_free')} <Arrow size={18} /></button>)
      : <a href="#tp-tabs" className="btn btn-lime btn-big" onClick={() => setTab('bracket')}>{t('tpage.follow')} <Arrow size={18} /></a>

  return (
    <div className="page">
      <Header />
      <main>
        <section className="tp-hero">
          <img className="tp-hero-img" {...photo(x.img, 1400)} alt="" />
          <div className="wrap tp-hero-in">
            <Link to={`/tournaments/${x.sport}?status=${x.status}`} className="back tp-back">← {t('tpage.back', { sport: sportName })}</Link>
            <div className="tp-pills">
              <span className={finished ? 'badge-pill done' : 'badge-pill'}>{t(`status.${x.status}`)}</span>
              <span className="pill">{sportName}</span>
              <span className="pill">{t(`format.${x.format}`)}</span>
              {views != null && <span className="pill pill-views" title={t('tpage.views_hint')}><Eye size={14} />{t('tpage.views', { count: views, formatted: views.toLocaleString(lng) })}</span>}
            </div>
            <h1 className="tp-title">{name}</h1>
            {org && (
              <Link to={`/organizer/${org.id}`} className="tp-org-link">
                <span className="org-mark" aria-hidden="true"><Mark mark={org.mark} size={18} /></span>
                <span>{t('organizer.by')} <b>{org.name}</b></span>
                <span className="stars-n">★ {org.rating.toFixed(1)}</span>
                <span className="tp-org-n">{t('organizer.hosted', { count: org.hosted })}</span>
              </Link>
            )}
            {x.created && <span className="pill">{t('create.yours')}</span>}
            <div className="tp-facts">
              {facts.map((f) => (
                <div key={f.k} className="tp-fact">
                  <button type="button" onClick={() => jump(f.go)}>
                    <span className="fk">{f.icon}{t(`tpage.facts.${f.k}`)}</span><span className="fv">{f.v}</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="tp-actions">
              {cta}
              <button type="button" className="btn btn-ghost btn-big" onClick={share}>{copied ? t('tpage.copied') : t('tpage.share')}</button>
            </div>
            <p className="tp-note" role="status">
              {upcoming ? t('tpage.deadline', { date: formatDates(registrationDeadline(x), registrationDeadline(x), lng) }) : finished ? t('tpage.ended_note') : t('tpage.live_note')}
            </p>
          </div>
        </section>

        <div className={finished ? 'wrap tp-body tp-body-solo' : 'wrap tp-body'}>
          <div className="tp-main">
            <div id="tp-tabs" className="tp-tabs" role="tablist" aria-label={t('tpage.tabs_label')} onKeyDown={onTabKey}>
              {TABS.map((k) => (
                <button key={k} id={`tab-${k}`} type="button" role="tab" aria-selected={active === k} aria-controls={`panel-${k}`} tabIndex={active === k ? 0 : -1} className={active === k ? 'tp-tab on' : 'tp-tab'} onClick={() => setTab(k)}>
                  {t(`tpage.tabs.${k}`, { count })}
                </button>
              ))}
            </div>

            <div id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`} tabIndex={0} className="tp-panel">
              {active === 'overview' && (
                <>
                  <div id="tp-schedule" className="tp-schedule">
                    <h2>{t('tpage.schedule.title')}</h2>
                    <ul>
                      {upcoming && <li><span>{t('tpage.schedule.reg')}</span><b>{formatDates(registrationDeadline(x), registrationDeadline(x), lng)}, 23:59</b></li>}
                      <li><span>{t('tpage.schedule.start')}</span><b>{formatDates(x.start, x.start, lng)}</b></li>
                      <li><span>{t('tpage.schedule.final')}</span><b>{formatDates(x.end, x.end, lng)}, 19:00</b></li>
                    </ul>
                  </div>
                  {x.about && <p className="tp-about">{x.about}</p>}
                  {x.rules && <p className="tp-about">{x.rules}</p>}
                  <h2>{t('tpage.overview.title')}</h2>
                  <div className="tp-steps">
                    {['stage1', 'stage2', 'level'].map((k) => (
                      <div key={k} className="tp-step"><small>{t(`tpage.overview.${k}`)}</small><b>{t(`tpage.overview.${k}_t`)}</b><span>{t(`tpage.overview.${k}_d`)}</span></div>
                    ))}
                  </div>
                  <ul className="tp-rules">
                    {['rule1', 'rule2', 'rule3'].map((k) => <li key={k}><Check size={18} />{t(`tpage.overview.${k}`)}</li>)}
                  </ul>
                </>
              )}

              {active === 'players' && (
                <>
                  <div className="tp-players">
                    {list.map((p) => (
                      <div key={p.name} className="tp-player">
                        <span className="seat-i" style={{ background: p.bg }}>{p.i}</span>
                        <span><b>{p.name}</b><small>{t('tpage.players.rating')} {p.r}</small></span>
                      </div>
                    ))}
                  </div>
                  {count > list.length && <p className="tp-more">{t('tpage.players.more', { count: count - list.length })}</p>}
                </>
              )}

              {active === 'bracket' && (
                <>
                  <div className="bracket" role="group" aria-label={t('tpage.bracket.aria')}>
                    <div className="b-col"><h3>{t('tpage.bracket.quarter')}</h3>{br.quarter.map((m, i) => <Match key={i} m={m} tbd={t('tpage.bracket.tbd')} />)}</div>
                    <div className="b-col"><h3>{t('tpage.bracket.semi')}</h3>{br.semi.map((m, i) => <Match key={i} m={m} tbd={t('tpage.bracket.tbd')} />)}</div>
                    <div className="b-col"><h3>{t('tpage.bracket.final', { date: formatDates(x.end, x.end, lng) })}</h3><Match m={br.final} tbd={t('tpage.bracket.tbd')} /></div>
                  </div>
                  <p className="tp-more">{t('tpage.bracket.note')}</p>
                </>
              )}

              {active === 'locations' && (
                <>
                  <h2>{t('tpage.locations.title')}</h2>
                  <ul className="tp-venues">
                    {venues.map((v) => (
                      <li key={v.name} className="tp-venue">
                        <span className="seat-i"><Pin size={18} /></span>
                        <span className="tp-venue-t">
                          <small>{t(`tpage.locations.${v.role}`)} · {t('tpage.locations.places', { count: v.n })}</small>
                          <b>{v.name}</b>
                          <span>{v.address}, {t(`cities.${x.city}`)}</span>
                        </span>
                        <a className="btn btn-soft" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name}, ${v.address}, ${t(`cities.${x.city}`)}`)}`} target="_blank" rel="noopener noreferrer">{t('tpage.locations.map')} <Arrow size={16} /></a>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {active === 'results' && (finished ? (
                <>
                  <h2>{t('tpage.results.podium')}</h2>
                  <ol className="tp-podium">
                    {standings(x).map((r) => (
                      <li key={r.p.name} className={`place-${r.place}`}>
                        <div className="pod-top">
                          <span className="seat-i" style={{ background: r.p.bg }}>{r.p.i}</span>
                          <span className="pod-name"><small>{t('tpage.results.place', { n: r.place })}</small><b>{r.p.name}</b></span>
                          <span className="pod-prize"><small>{t('tpage.results.prize')}</small><b>{formatMoney(r.prize, lng)}</b></span>
                        </div>
                        <dl className="pod-stats" style={{ gridTemplateColumns: `repeat(${SCORE_UNIT[x.sport] ? 3 : 1}, 1fr)` }}>
                          {SCORE_UNIT[x.sport] && <div><dt>{t('tpage.results.record')}</dt><dd>{r.w}–{r.l}</dd></div>}
                          {SCORE_UNIT[x.sport] && <div><dt>{t(`tpage.results.units.${SCORE_UNIT[x.sport]}`)}</dt><dd>{r.gf}–{r.ga}</dd></div>}
                          <div><dt>{t('tpage.players.rating')}</dt><dd>{r.p.r}</dd></div>
                        </dl>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <div className="tp-empty"><Trophy size={32} /><b>{t('tpage.results.pending_title')}</b><span>{t('tpage.results.pending_text')}</span></div>
              ))}

              {active === 'sponsors' && (
                <div className="tp-sponsors">
                  {Array.from({ length: 5 }, (_, i) => {
                    // Sample: the first three slots are taken (title sponsor + two partners), the rest are free.
                    const l = i < 3 ? MARKED[(x.id.length + i) % MARKED.length] : null
                    return l
                      ? <div key={l.name} className={i === 0 ? 'tp-sponsor taken title' : 'tp-sponsor taken'}><Mark mark={l.mark} size={i === 0 ? 40 : 30} /><b>{l.name}</b><small>{t(i === 0 ? 'tpage.sponsors.title' : 'tpage.sponsors.partner')}</small></div>
                      : <div key={i} className="tp-sponsor">{t('tpage.sponsors.logo')}</div>
                  })}
                  <button type="button" className="tp-sponsor tp-sponsor-add" onClick={openSponsor}>{t('tpage.sponsors.become')}</button>
                </div>
              )}
            </div>
          </div>

          {!finished && (
          <aside className="tp-aside">
            {(
              <div id="tp-prizes" className="tp-card">
                <h2>{t('tpage.aside.prizes')}</h2>
                <ul className="tp-prizes">
                  {SPLIT.map((s, i) => (
                    <li key={s}><span>{t('tpage.results.place', { n: i + 1 })}</span><b>{formatMoney(Math.round(x.prize * s / 100), lng)}</b></li>
                  ))}
                  <li><span>{t('tpage.aside.cup')}</span><b>★</b></li>
                </ul>
              </div>
            )}
            {(
              <div id="tp-fee" className="tp-card tp-own">
                <h2>{t('tpage.facts.fee')}</h2>
                <b className="tp-fee">{fee ? formatMoney(fee, lng) : t('tpage.facts.free')}</b>
                <p>{upcoming ? t('tpage.deadline', { date: formatDates(registrationDeadline(x), registrationDeadline(x), lng) }) : t('tpage.live_note')}</p>
                {cta}
              </div>
            )}
          </aside>
          )}
        </div>
      </main>
      <Footer />
      {registering && <RegisterDialog x={x} name={name} fee={fee} onClose={() => setRegistering(false)} />}
    </div>
  )
}
