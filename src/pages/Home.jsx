import { useState } from 'react'
import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import Tournaments from '../components/Tournaments.jsx'
import Finished from '../components/Finished.jsx'
import Partners, { PartnersStrip } from '../components/Partners.jsx'
import Cta from '../components/Cta.jsx'
import BrandAd from '../components/BrandAd.jsx'
import Organizers from '../components/Organizers.jsx'
import HostSection from '../components/HostSection.jsx'
import AdFormats from '../components/AdFormats.jsx'
import Footer from '../components/Footer.jsx'
import { NO_FILTERS } from '../data.js'

export default function Home() {
  // Shared by the hero search and the sport chips above the tournament rows.
  const [filters, setFilters] = useState(NO_FILTERS)

  return (
    <div className="page">
      <Header />
      <main>
        <Hero filters={filters} onSearch={setFilters} />
        <PartnersStrip />
        <Tournaments filters={filters} setFilters={setFilters} />
        <BrandAd />
        <Finished />
        <Organizers />
        <HostSection />
        <AdFormats />
        <Partners />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
