export const COMMUNITY_WHATSAPP_URL =
  'https://chat.whatsapp.com/FSRZYdgwSB6Ax6WmZax3Pd?mode=gi_c'

const quickLinks = [
  { label: 'View Glimpses', href: '#glimpse' },
  { label: 'Explore Services', href: '#services' },
  { label: 'Join a Tournament', href: '#contact' },
  { label: 'Find Your Team', href: '#services' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: 'https://policies.google.com/privacy?hl=en-US' },
  { label: 'Terms & Conditions', href: 'https://policies.google.com/terms?hl=en-US' },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/turfingo', icon: 'instagram' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/turfingo', icon: 'linkedin' },
  { label: 'WhatsApp Community', href: COMMUNITY_WHATSAPP_URL, icon: 'whatsapp' },
]

function Icon({ name }) {


  if (name === 'instagram') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="12"
          r="3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'linkedin') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="2"
          y="9"
          width="4"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="4"
          cy="4"
          r="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === 'whatsapp') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    )
  }

  return null
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="section footer-section" aria-labelledby="footer-title">
      <div className="footer-noise" aria-hidden="true" />
      <div className="footer-arc footer-arc-left" aria-hidden="true" />
      <div className="footer-arc footer-arc-right" aria-hidden="true" />
      <div className="footer-beam" aria-hidden="true" />

      <div className="footer-shell">
        <div className="footer-main">
          <div className="footer-intro">
            <p className="footer-eyebrow">Turfingo Tournament</p>
            <h2 id="footer-title">Play together. Play better.</h2>
            {/* <p className="footer-text">
              Welcome to Turfingo. From local games to organized tournaments,
              we are building a better way to play together and watch the
              action unfold.
            </p> */}
          </div>

          <div className="footer-content">
            <section className="footer-column" aria-labelledby="footer-links-title">
              <h3 id="footer-links-title">Quick Links</h3>
              <nav className="footer-link-list" aria-label="Footer quick links">
                {quickLinks.map((link) => (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </nav>
            </section>

            <section className="footer-column" aria-labelledby="footer-contact-title">
              <h3 id="footer-contact-title">Contact</h3>
              <div className="footer-contact-copy">
                <a href="tel:+918287860215">+91 8287860215</a>
                <a href="mailto:turfingo@gmail.com">turfingo@gmail.com</a>
                <p>Divyashakti Complex, Begumpet,</p>
                <p>Hyderabad - 500016</p>
              </div>

            </section>
          </div>
        </div>

        <div className="footer-lower">
          <div className="footer-branding">

            <div className="footer-wordmark-block">
              <p className="footer-wordmark">TURFINGO</p>
              <p className="footer-meta">
                {year} - From local games to organized tournaments
              </p>
            </div>
          </div>

          <div className="footer-legal">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="footer-meta-area">
            <div className="footer-socials" aria-label="Social media links">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  className="footer-social-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                >
                  <Icon name={link.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
