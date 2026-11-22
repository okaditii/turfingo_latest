import { useState } from 'react'
import { Link } from 'react-router-dom'
import { turfingoImages } from '../lib/cloudinary.js'

function Hero() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section className="section hero-section" id="hero">
      <video
        className="hero-video"
        src={turfingoImages.heroVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="hero-overlay" />
      <div className="hero-shell">
        <div className={`hero-topbar ${menuOpen ? 'hero-topbar-open' : ''}`}>
          <a className="hero-logo" href="#hero" aria-label="Turfingo Tournaments home">
            <img src={turfingoImages.logo} alt="" aria-hidden="true" className="hero-logo-mark" />
            <span className="hero-logo-text">
              <span>Turfingo</span>
              <span>Tournaments</span>
            </span>
          </a>
          <button
            type="button"
            className="hero-menu-toggle"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="hero-nav"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav
            id="hero-nav"
            className={`hero-nav ${menuOpen ? 'hero-nav-open' : ''}`}
            aria-label="Primary"
          >
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Our mission</a>
            <a href="#glimpse" onClick={() => setMenuOpen(false)}>Glimpses</a>
            <a href="#community" onClick={() => setMenuOpen(false)}>Community</a>
            <Link to="/waitlist" onClick={() => setMenuOpen(false)}>Waitlist</Link>
          </nav>
        </div>

        <div className="hero-copy">
          <p className="hero-kicker">Welcome to turfingo sports</p>
          <h1>
            <span>Play together.</span>
            <span>Play better.</span>
            <span>Turfingo.</span>
          </h1>
          <p className="hero-text">
            Tournaments, training energy, and a real stage for young athletes to
            compete, connect, and be seen.
          </p>
        </div>

        <div className="hero-action-row">
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/register">
              Register Now
            </Link>
            <a className="btn btn-secondary" href="#about">
              Explore the mission
            </a>
          </div>
          <div className="hero-members">
            <div className="hero-members-copy">
              <strong>100+</strong>
              <span>registrations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
