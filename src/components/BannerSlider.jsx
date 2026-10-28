import { Link } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Arrow, Calendar, ChevronLeft, ChevronRight, Pause, Pin, Play, Plus } from './icons.jsx'
import { BANNERS, BANNER_INTERVAL, TOURNAMENTS, formatDates } from '../data.js'
import { useSponsor } from '../sponsor.jsx'
import { photo } from '../photos.js'

// Diagonal photo strips on the brand slide; each opens that tournament’s page.
const STRIPS = [
  { img: 'heroFootball', id: 'futbol-kubogi' },
  { img: 'heroRun', id: 'shahar-yugurishi' },
  { img: 'heroBasket', id: 'basketbol-3x3' },
]

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const SWIPE = 50 // px
const SLIDE_MS = 800 // keep in sync with .banner-track transition in index.css

// Focus from the keyboard pauses the slider; focus left behind by a mouse click must not.
const keyboardFocus = (el) => { try { return el.matches(':focus-visible') } catch { return true } }

/** Advertising-style banner slider: auto-advances with a progress bar, pauses on hover/focus/touch, swipeable. */
export default function BannerSlider() {
  const { t, i18n } = useTranslation()
  const total = BANNERS.length
  // Only the current slide and the one moving in/out are in the DOM. `abs` is a slide's place on an endless
  // line, so going from the last banner to the first keeps moving the same way instead of rewinding.
  const [state, setState] = useState({ pos: 0, index: 0, shown: [{ index: 0, abs: 0 }] })
  const { pos, index, shown } = state
  const [hold, setHold] = useState(false) // pointer over / finger down / keyboard focus inside
  const [stopped, setStopped] = useState(() => prefersReducedMotion()) // user pressed pause (or reduced motion)
  const bar = useRef(null)
  const drag = useRef(null)
  const moved = useRef(false)
  const running = !hold && !stopped

  const go = useCallback((target, dir) => setState((st) => {
    if (target === st.index) return st
    const abs = st.pos + dir
    return { pos: abs, index: target, shown: [...st.shown.filter((x) => x.abs !== abs), { index: target, abs }] }
  }), [])
  const next = useCallback(() => go((index + 1) % total, 1), [go, index, total])
  const prev = () => go((index - 1 + total) % total, -1)
  const goTo = (i) => go(i, i > index ? 1 : -1)

  // Once the move is over, drop the slide that slid out.
  useEffect(() => {
    const id = setTimeout(() => setState((st) => ({ ...st, shown: st.shown.filter((x) => x.abs === st.pos) })), prefersReducedMotion() ? 0 : SLIDE_MS + 100)
    return () => clearTimeout(id)
  }, [pos])

  // Slides are mounted only when they are needed, so fetch their photos up front.
  useEffect(() => {
    BANNERS.forEach((b) => {
      if (!b.img) return
      const p = photo(b.img, 1400)
      const im = new Image()
      im.srcset = p.srcSet
      im.src = p.src
    })
  }, [])

  // One rAF loop per slide: advances the progress bar and moves on at the end. Pausing keeps the elapsed time.
  const elapsed = useRef(0)
  useEffect(() => { elapsed.current = 0; if (bar.current) bar.current.style.transform = 'scaleX(0)' }, [index])
  useEffect(() => {
    if (!running) return
    let raf
    let last = performance.now()
    const tick = (now) => {
      elapsed.current += now - last
      last = now
      if (elapsed.current >= BANNER_INTERVAL) { next(); return }
      if (bar.current) bar.current.style.transform = `scaleX(${elapsed.current / BANNER_INTERVAL})`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, index, next])

  const onPointerDown = (e) => { drag.current = { x: e.clientX, y: e.clientY }; moved.current = false; if (e.pointerType === 'touch') setHold(true) }
  const onPointerUp = (e) => {
    const d = drag.current
    drag.current = null
    if (e.pointerType === 'touch') setHold(false)
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(e.clientY - d.y)) { moved.current = true; if (dx < 0) next(); else prev() }
  }
  // The browser takes the gesture over for page scrolling: release the pause too.
  const onPointerCancel = (e) => { drag.current = null; if (e.pointerType === 'touch') setHold(false) }
  // A swipe must not count as a click on the link under the finger.
  const onClickCapture = (e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); moved.current = false } }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    else if (e.key === 'ArrowRight') { e.preventDefault(); next() }
  }

  return (
    <div
      className="banners"
      role="region"
      aria-roledescription="carousel"
      aria-label={t('banners.label')}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHold(true) }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHold(false) }}
      onFocus={(e) => { if (keyboardFocus(e.target)) setHold(true) }}
      onBlur={() => setHold(false)}
      onKeyDown={onKeyDown}
    >
      <div
        className="banner-track"
        style={{ transform: `translateX(${-pos * 100}%)` }}
        aria-live={running ? 'off' : 'polite'}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClickCapture={onClickCapture}
      >
        {shown.map(({ index: i, abs }) => {
          const b = BANNERS[i]
          const active = abs === pos
          // The slide that is leaving must not be reachable with Tab.
          const hidden = active ? {} : { 'aria-hidden': true, inert: '' }
          return (
            <div key={abs} className={`banner banner-${b.type}${active ? ' on' : ''}`} style={{ left: `${abs * 100}%` }} role="group" aria-roledescription="slide" aria-label={t('banners.slide', { n: i + 1, total })} {...hidden}>
              {b.type === 'brand' && <BrandSlide t={t} />}
              {b.type === 'tournament' && <TournamentSlide t={t} lng={i18n.resolvedLanguage} banner={b} />}
              {b.type === 'ad' && <AdSlide t={t} banner={b} />}
            </div>
          )
        })}
      </div>

      <button type="button" className="b-arrow b-prev" aria-label={t('banners.prev')} onClick={prev}><ChevronLeft size={22} /></button>
      <button type="button" className="b-arrow b-next" aria-label={t('banners.next')} onClick={next}><ChevronRight size={22} /></button>

      <div className="b-controls">
        <button type="button" className="b-play" aria-label={stopped ? t('banners.play') : t('banners.pause')} onClick={() => setStopped(!stopped)}>
          {stopped ? <Play size={14} /> : <Pause size={14} />}
        </button>
        <div className="b-dots">
          {BANNERS.map((b, i) => (
            <button key={b.id} type="button" className={i === index ? 'b-dot on' : 'b-dot'} aria-label={t('banners.goto', { n: i + 1 })} aria-current={i === index} onClick={() => goTo(i)}>
              {i === index && <i ref={bar} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function BrandSlide({ t }) {
  return (
    <>
      <div className="hero-photos">
        {STRIPS.map((s, i) => (
          <Link key={s.img} to={`/tournament/${s.id}`} className={`strip strip-${i}`} aria-label={t(`tournaments.names.${s.id}`)}>
            <img {...photo(s.img, 420)} fetchpriority={i === 0 ? 'high' : undefined} alt="" />
          </Link>
        ))}
      </div>
      <div className="wrap banner-in">
        <h1 className="banner-title">{t('hero.title_1')}<br /><span className="lime">{t('hero.title_2')}</span></h1>
        <p className="banner-text">{t('hero.lead')}</p>
        <div className="banner-actions">
          <a href="#tournaments" className="btn btn-lime">{t('header.nav.tournaments')} <Arrow size={16} /></a>
          <Link to="/create" className="btn btn-ghost"><Plus size={18} />{t('header.create')}</Link>
        </div>
      </div>
    </>
  )
}

function TournamentSlide({ t, lng, banner }) {
  const x = TOURNAMENTS.find((c) => c.id === banner.tournament)
  return (
    <>
      <div className="banner-bg"><img {...photo(banner.img, 1400)} alt="" /></div>
      <div className="wrap banner-in">
        <span className="banner-tag">{t('banners.open')}</span>
        <h2 className="banner-title">{t(`tournaments.names.${x.id}`)}</h2>
        <div className="banner-meta">
          <span><Calendar size={18} />{formatDates(x.start, x.end, lng)}</span>
          <span><Pin size={18} />{t(`cities.${x.city}`)}</span>
        </div>
        <div className="banner-actions">
          <Link to={`/tournament/${x.id}`} className="btn btn-lime">{t('tournaments.details')} <Arrow size={16} /></Link>
        </div>
      </div>
    </>
  )
}

function AdSlide({ t, banner }) {
  const { openSponsor } = useSponsor()
  return (
    <>
      <div className="banner-bg"><img {...photo(banner.img, 1400)} alt="" /></div>
      <div className="wrap banner-in">
        <span className="banner-tag banner-tag-ad">{t('banners.ad')}</span>
        <h2 className="banner-title">{t('banners.ad_title')}</h2>
        <p className="banner-text">{t('banners.ad_text')}</p>
        <div className="banner-actions">
          <button type="button" className="btn btn-lime" onClick={openSponsor}>{t('cta.sponsor')} <Arrow size={16} /></button>
        </div>
      </div>
    </>
  )
}
