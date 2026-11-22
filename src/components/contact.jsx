import { turfingoImages } from '../lib/cloudinary.js'

function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="contact-stage">
        <img
          className="contact-stage-image"
          src={turfingoImages.heroLanding}
          alt="Turfingo players and community event"
        />
        <div className="contact-stage-overlay" aria-hidden="true" />

        <div className="contact-copy">
          <p className="eyebrow">Join the platform</p>
          <h2>Want your child or academy to be part of the next tournament?</h2>
          <p>
            Reach out for registrations, partnerships, sponsorships, or upcoming
            tournament details.
          </p>
        </div>

        <div className="contact-actions">
          <a className="btn btn-primary" href="mailto:turfingo@gmail.com">
            turfingo@gmail.com
          </a>
          <a className="contact-link" href="#hero">
            Back to top
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact
