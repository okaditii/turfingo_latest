import { useEffect, useMemo, useState } from 'react'
import { COMMUNITY_WHATSAPP_URL } from './footer.jsx'
import { turfingoImages } from '../lib/cloudinary.js'

const IMAGES = turfingoImages.community
const CARDBOARD_OVERLAY =
  'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68bb5115edfe445b904f6dda_04f1b8bc7dceac5cf0fd2d799c4b745f_cartboard_overlay.webp'

const CARD_LAYOUT = [
  { className: 'community-card-top-left community-card-front', offset: 0 },
  { className: 'community-card-top-mid community-card-back', offset: 1 },
  { className: 'community-card-bottom-left community-card-back', offset: 2 },
  { className: 'community-card-bottom-right community-card-front', offset: 3 },
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

function Community() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    function onPointerMove(event) {
      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2
      setCursor({ x, y })
    }

    function onScroll() {
      setScrollY(window.scrollY)
    }

    const timer = window.setInterval(() => {
      setFrame((value) => (value + 1) % IMAGES.length)
    }, 2000)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const cards = useMemo(
    () =>
      CARD_LAYOUT.map((card, index) => {
        const imageIndex = (frame + card.offset) % IMAGES.length
        const driftX = cursor.x * (10 + index * 4)
        const driftY = cursor.y * (8 + index * 3) + (scrollY % 120) * (0.08 + index * 0.015)

        return {
          ...card,
          src: IMAGES[imageIndex],
          style: {
            transform: `translate3d(${driftX}px, ${driftY}px, 0)`,
          },
        }
      }),
    [cursor.x, cursor.y, frame, scrollY],
  )

  return (
    <section className="community-section" id="community" aria-labelledby="community-title">
      <div className="community-texture" aria-hidden="true" />
      <div className="community-grain" aria-hidden="true" />
      <div className="community-flare" aria-hidden="true" />
      <div className="community-dust" aria-hidden="true" />

      <div className="community-header">
        <p className="community-kicker">Turfingo</p>
        <h2 id="community-title">Tournaments</h2>
      </div>

      <div className="community-canvas community-canvas-back" aria-hidden="true">
        {cards
          .filter((card) => card.className.includes('community-card-back'))
          .map((card, index) => (
          <figure
            key={`${card.className}-${index}`}
            className={`community-card ${card.className}`}
            style={card.style}
          >
            <img src={card.src} alt="" />
          </figure>
          ))}
      </div>

      <div className="community-wordmark">COMMUNITY</div>

      <div className="community-canvas community-canvas-front" aria-hidden="true">
        {cards
          .filter((card) => card.className.includes('community-card-front'))
          .map((card, index) => (
            <figure
              key={`${card.className}-${index}`}
              className={`community-card ${card.className}`}
              style={card.style}
            >
              <img src={card.src} alt="" />
            </figure>
          ))}
      </div>

      <div className="community-footer">
        <p>Follow Turfingo</p>
        <div className="community-socials" aria-label="Community social links">
          <a
            href="https://www.instagram.com/turfingo"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <Icon name="instagram" />
          </a>
          <a
            href="https://www.linkedin.com/company/turfingo"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Icon name="linkedin" />
          </a>
          <a
            href={COMMUNITY_WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
          >
            <Icon name="whatsapp" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Community
