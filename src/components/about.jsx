import { turfingoImages } from '../lib/cloudinary.js'

const DONNY_PHOTO = turfingoImages.aboutCommunity
const CARDBOARD_OVERLAY =
  'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68bb5115edfe445b904f6dda_04f1b8bc7dceac5cf0fd2d799c4b745f_cartboard_overlay.webp'

function About() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;0,900;1,400;1,700;1,800;1,900&family=Inter:wght@300;400;500;600&display=swap');

        .ab-section {
          background: #E8192C;
          position: relative;
          width: 100%;
          min-height: 100svh;
          overflow: hidden;
          container-type: inline-size;
          container-name: aboutsection;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .ab-texture {
          position: absolute;
          inset: 0;
          background-image: url('${CARDBOARD_OVERLAY}');
          background-size: cover;
          background-position: center;
          opacity: 0.1;
          pointer-events: none;
          z-index: 1;
        }

        .ab-top {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 45% 55%;
          padding-top: 5cqw;
          padding-bottom: 5cqw;
          min-height: 0;
          box-sizing: border-box;
        }

        .ab-left-col {
          min-height: 32cqw;
        }

        .ab-text-col {
          padding: 0 5cqw 0 3cqw;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          animation: abFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
        }

        .ab-heading {
          font-family: 'Barlow Condensed', Impact, sans-serif;
          font-weight: 900;
          font-style: normal;
          font-size: clamp(1.6rem, 5.8cqw, 5.9rem);
          line-height: 0.92;
          color: #ffffff;
          text-transform: uppercase;
          margin: 0 0 2.5cqw 0;
          letter-spacing: -0.01em;
          word-break: keep-all;
          hyphens: none;
        }

        .ab-heading span {
          display: block;
        }

        .ab-body {
          color: rgba(255, 255, 255, 0.93);
          font-size: clamp(0.8rem, 1.2cqw, 0.98rem);
          line-height: 1.78;
          font-weight: 400;
        }

        .ab-body p {
          margin: 0;
        }

        .ab-donny-row {
          position: relative;
          z-index: 3;
          padding: 0 0.5%;
          line-height: 0;
          margin-top: -3.8cqw;
          padding-bottom: 0.6cqw;
          animation: abFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
        }

        .ab-donny-text {
          font-family: 'Barlow Condensed', Impact, sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: clamp(3.3rem, 28cqw, 32rem);
          color: #080808;
          text-transform: uppercase;
          line-height: 0.7;
          letter-spacing: -0.03em;
          display: block;
          white-space: nowrap;
          user-select: none;
        }

        .ab-photo-wrap {
          position: absolute;
          top: 14cqw;
          bottom: 6cqw;
          left: 8cqw;
          width: 28cqw;
          z-index: 10;
          animation: abFadeUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.07s both;
        }

        .ab-photo-card {
          width: 100%;
          height: 100%;
          border-radius: clamp(8px, 1.2cqw, 18px);
          overflow: hidden;
          position: relative;
          background: #1a2e2e;
          border: 3px solid #1c3232;
          box-shadow:
            0 clamp(16px,3cqw,56px) clamp(40px,7cqw,100px) rgba(0,0,0,0.72),
            0 clamp(6px,1cqw,16px) clamp(16px,2.5cqw,36px) rgba(0,0,0,0.38);
        }

        .ab-photo-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        .ab-photo-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: clamp(20px,4cqw,48px) clamp(10px,1.5cqw,18px) clamp(10px,1.2cqw,16px);
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%);
          display: flex;
          align-items: center;
          gap: clamp(5px, 0.8cqw, 10px);
        }

        .ab-dot {
          width: clamp(6px,0.8cqw,10px);
          height: clamp(6px,0.8cqw,10px);
          border-radius: 50%;
          background: #E8192C;
          flex-shrink: 0;
        }

        .ab-name {
          color: #fff;
          font-size: clamp(0.6rem, 0.85cqw, 0.85rem);
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        @keyframes abFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .ab-section { min-height: 100svh; }
          .ab-top { grid-template-columns: 1fr; padding-top: 56px; padding-bottom: 8px; min-height: 0; }
          .ab-left-col { display: none; }
          .ab-text-col { padding: 18svh 6% 0; }
          .ab-heading { font-size: clamp(1.4rem, 10vw, 2.4rem); margin-bottom: 14px; }
          .ab-heading-brand { display: none !important; }
          .ab-body { font-size: 0.76rem; line-height: 1.62; }
        }
      `}</style>

      <section id="about" className="ab-section">
        <div className="ab-texture" />

        <div className="ab-top">
          <div className="ab-left-col" />
          <div className="ab-text-col">
            <h2 className="ab-heading">
              <span className="ab-heading-main">ABOUT</span>
              <span className="ab-heading-brand">TURFINGO</span>
              <span className="ab-heading-tail">TOURNAMENTS</span>
            </h2>

            <div className="ab-body">
              <p>
                Founded in 2025, Turfingo is an elite turf community built to
                bring players together through organized tournaments,
                competitive play, and shared experiences. Turfingo goes beyond just matches - it creates a
                platform where players of all levels can compete, connect, and
                grow. At its core is the Clutch Arena tournament series, a
                high-stakes stage where talent meets opportunity and every
                player gets a chance to own the spotlight. More than a game,
                Turfingo is about building a community that plays together,
                competes together, and evolves together.
              </p>
            </div>
          </div>
        </div>

        <div className="ab-donny-row">
          <span className="ab-donny-text">TURFINGO</span>
        </div>

        <div className="ab-photo-wrap">
          <div className="ab-photo-card">
            <img src={DONNY_PHOTO} alt="Turfingo community coaching session" />
            <div className="ab-photo-label">
              <span className="ab-dot" />
              <span className="ab-name">TURFINGO COMMUNITY</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
