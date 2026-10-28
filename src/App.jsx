import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import TournamentsPage from './pages/TournamentsPage.jsx'
import OfferPage from './pages/OfferPage.jsx'
import TournamentPage from './pages/TournamentPage.jsx'
import OrganizerPage from './pages/OrganizerPage.jsx'
import CreatePage from './pages/CreatePage.jsx'

// New page → top; "/#section" → that section. "#t-…" is handled by the tournament rows themselves.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash.startsWith('#t-')) return
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/:sport" element={<TournamentsPage />} />
        <Route path="/tournament/:slug" element={<TournamentPage />} />
        <Route path="/organizer/:id" element={<OrganizerPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/oferta" element={<OfferPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
