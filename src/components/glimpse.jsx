/**
 * src/components/Glimpse.jsx
 */

import { useEffect, useRef } from 'react'
import { turfingoImages } from '../lib/cloudinary.js'

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const COLS       = 5
const ROWS       = 3
const CENTER_COL = 2
const CENTER_ROW = 1
const GAP        = 48
const BASE_VW    = 1440

const COL_W = [180, 210, 280, 210, 180]  // was [220, 260, 320, 260, 220]
const ROW_H = [220, 340, 220]             // was [260, 420, 260]

const PARALLAX_FACTORS = [
  1.15, 0.82, 1.08, 0.90, 1.20,
  0.88, /* center skipped */ 1.12,
  0.95, 1.05, 0.85, 1.18, 0.92,
  1.10, 0.80,
]

const IMG_SRCS = turfingoImages.glimpse

// ─── GRID METADATA ────────────────────────────────────────────────────────────

function buildCards() {
  const cards = []
  let imgIdx = 0
  let pIdx   = 0

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c === CENTER_COL && r === CENTER_ROW) continue
      cards.push({
        col:       c,
        row:       r,
        dist:      Math.abs(c - CENTER_COL) + Math.abs(r - CENTER_ROW),
        src:       IMG_SRCS[imgIdx % IMG_SRCS.length],
        parallaxF: PARALLAX_FACTORS[pIdx % PARALLAX_FACTORS.length],
      })
      imgIdx++
      pIdx++
    }
  }

  cards.sort((a, b) => a.dist - b.dist)
  cards.forEach((card, i) => (card.staggerIdx = i))

  const SPREAD = 0.32
  cards.forEach((card) => {
    const frac   = card.staggerIdx / (cards.length - 1)
    card.tEntry  = 0.10 + frac * SPREAD
    card.tPeak   = card.tEntry + 0.08
    card.tSettle = card.tEntry + 0.18
  })

  return cards
}

const CARDS = buildCards()

// ─── MATH ─────────────────────────────────────────────────────────────────────

const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v))
const lerp  = (a, b, t)            => a + (b - a) * t
const ease  = (t)                  => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
const remap = (v, il, ih)          => clamp((v - il) / (ih - il))

// ─── LAYOUT ───────────────────────────────────────────────────────────────────

function computeLayout() {
  const isMobile = window.innerWidth < 700
  if (isMobile) {
    const gap = 8
    const slotW = Math.min((window.innerWidth - 24 - gap * 2) / 3, 118)
    const slotH = Math.min(slotW * 0.88, (window.innerHeight - 140 - gap * 4) / 5)
    const totalW = slotW * 3 + gap * 2
    const totalH = slotH * 5 + gap * 4
    const slots = []
    let y = -totalH / 2

    for (let r = 0; r < 5; r++) {
      let x = -totalW / 2
      for (let c = 0; c < 3; c++) {
        slots.push({ x, y, w: slotW, h: slotH })
        x += slotW + gap
      }
      y += slotH + gap
    }

    return { mobile: true, slotW, slotH, slots, centerSlot: 7 }
  }

  const scale    = Math.min(window.innerWidth / BASE_VW, 1.15)
  const gap      = GAP
  const cw     = COL_W.map((w) => w * scale)
  const rh     = ROW_H.map((h) => h * scale)
  const totalW = cw.reduce((a, b) => a + b, 0) + gap * (COLS - 1)
  const totalH = rh.reduce((a, b) => a + b, 0) + gap * (ROWS - 1)

  const lefts = []
  let x = -totalW / 2
  cw.forEach((w) => { lefts.push(x); x += w + gap })

  const tops = []
  let y = -totalH / 2
  rh.forEach((h) => { tops.push(y); y += h + gap })

  return { cw, rh, lefts, tops }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

function Glimpse() {
  const scrollWrapRef = useRef(null)
  const centerRef     = useRef(null)
  const cardRefs      = useRef([])
  const progBarRef    = useRef(null)
  const scrollHintRef = useRef(null)
  const label1Ref     = useRef(null)
  const label2Ref     = useRef(null)

  useEffect(() => {
    const styleEl = document.createElement('style')
    styleEl.dataset.glimpse = 'true'
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&display=swap');

      @keyframes glimpse-scroll-line {
        0%   { transform: scaleY(0); transform-origin: top;    opacity: 1; }
        50%  { transform: scaleY(1); transform-origin: top;    opacity: 1; }
        100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
      }
    `
    document.head.appendChild(styleEl)

    function applyLayout() {
      const layout = computeLayout()
      if (layout.mobile) {
        if (centerRef.current) {
          centerRef.current.style.width = layout.slotW + 'px'
          centerRef.current.style.height = layout.slotH + 'px'
        }
        cardRefs.current.forEach((el) => {
          if (!el) return
          el.style.width = layout.slotW + 'px'
          el.style.height = layout.slotH + 'px'
        })
        return
      }

      const { cw, rh } = layout
      if (centerRef.current) {
        centerRef.current.style.width  = cw[CENTER_COL] + 'px'
        centerRef.current.style.height = rh[CENTER_ROW] + 'px'
      }
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const { col, row } = CARDS[i]
        el.style.width  = cw[col] + 'px'
        el.style.height = rh[row] + 'px'
      })
    }

    applyLayout()
    window.addEventListener('resize', applyLayout)

    let ticking = false

    function tick() {
      ticking = false
      const wrap = scrollWrapRef.current
      if (!wrap) return

      const layout   = computeLayout()
      const top      = wrap.getBoundingClientRect().top
      const startAt  = window.innerHeight * 0.5
      const endAt    = 0
      const ANIM_END = 2.85
      const p        = clamp((startAt - top) / (startAt - endAt))

      if (progBarRef.current)
        progBarRef.current.style.transform = `scaleX(${p})`

      if (scrollHintRef.current)
        scrollHintRef.current.style.opacity = p < 0.04 ? '1' : '0'

      // Text swap
      if (label1Ref.current && label2Ref.current) {
        const t = remap(p, 0.02, 0.12)
        label1Ref.current.style.opacity   = String(1 - t)
        label1Ref.current.style.transform = `translateY(${lerp(0, -12, ease(t))}px)`
        label2Ref.current.style.opacity   = String(t)
        label2Ref.current.style.transform = `translateY(${lerp(12, 0, ease(t))}px)`
      }

      if (layout.mobile) {
        const centerSlot = layout.slots[layout.centerSlot]
        if (centerRef.current) {
          centerRef.current.style.transform = `translate(${centerSlot.x}px, ${centerSlot.y}px) scale(1)`
        }

        CARDS.forEach((card, i) => {
          const el = cardRefs.current[i]
          if (!el) return
          const slotIndex = i < layout.centerSlot ? i : i + 1
          const slot = layout.slots[slotIndex]
          const reveal = ease(remap(p, 0.02, 0.16))
          const driftX = card.parallaxF ? 0 : 0
          el.style.opacity = String(reveal)
          el.style.transform = `translate(${slot.x + driftX}px, ${slot.y}px) scale(1)`
        })
        return
      }

      const { lefts, tops } = layout

      // Center card
      if (centerRef.current) {
        const sc = lerp(1.8, 1.0, ease(remap(p, 0, 0.28)))
        const tx = lefts[CENTER_COL]
        const ty = tops[CENTER_ROW]
        centerRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`
      }

      // Surrounding cards
      CARDS.forEach((card, i) => {
        const el = cardRefs.current[i]
        if (!el) return

        const { col, row, tEntry, tPeak, tSettle, parallaxF } = card
        const targetX = lefts[col]
        const targetY = tops[row]

        let sc
        if (p < tEntry) {
          sc = 0.82
        } else if (p < tPeak) {
          sc = lerp(0.82, 1.04, ease(remap(p, tEntry, tPeak)))
        } else if (p < tSettle) {
          sc = lerp(1.04, 1.0,  ease(remap(p, tPeak, tSettle)))
        } else {
          sc = 1.0
        }

        const revealY   = lerp(72, 0, ease(remap(p, tEntry, tSettle)))
        const p4        = remap(p, 0.65, 1.0)
        const parallaxY = lerp(0, -12 * (parallaxF - 0.97), p4)

        const colFade = col === 0 || col === 4 ? 0.45 : col === 1 || col === 3 ? 0.78 : 1.0
        el.style.opacity = String(ease(remap(p, tEntry, tPeak)) * colFade)

        el.style.transform =
          `translate(${targetX}px, ${targetY + revealY + parallaxY}px) scale(${sc})`
      })
    }

    function onScroll() {
      if (!ticking) { requestAnimationFrame(tick); ticking = true }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    tick()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', applyLayout)
      if (document.head.contains(styleEl)) document.head.removeChild(styleEl)
    }
  }, [])

  return (
    <section className="section" id="glimpse" style={S.root}>

      <div ref={progBarRef} style={S.progressBar} />

      <div ref={scrollWrapRef} style={S.scrollWrap}>
        <div style={S.sticky}>

          {/* Left / right edge fades */}
          <div style={{ ...S.edgeFadeH, left: 0,
            background: 'linear-gradient(to right, #e8e4df 0%, transparent 100%)' }} />
          <div style={{ ...S.edgeFadeH, right: 0,
            background: 'linear-gradient(to left, #e8e4df 0%, transparent 100%)' }} />

          {/* Top / bottom edge fades */}
          <div style={{ ...S.edgeFadeV, top: 0,
            background: 'transparent' }} />
          <div style={{ ...S.edgeFadeV, bottom: 0,
            background: 'linear-gradient(to top, #e8e4df 0%, transparent 100%)' }} />

          <div style={S.stage}>

            {/* Center card */}
            <div ref={centerRef} style={S.centerBox}>
              <img src={turfingoImages.glimpseCenter} alt="Tournament" style={S.fillImg} />
              <div style={S.heroOverlay}>
                <span ref={label1Ref} style={{ ...S.heroLabel, ...S.label1 }}>
                {'REAL MATCHES.\nREAL MOMENTS'}
                </span>
                <span ref={label2Ref} style={{ ...S.heroLabel, ...S.label2 }}>
                {'CAPTURED ON\nEVERY TURF'}
                </span>
              </div>
            </div>

            {/* 14 surrounding cards */}
            {CARDS.map((card, i) => (
              <div
                key={`${card.col}-${card.row}`}
                ref={(el) => (cardRefs.current[i] = el)}
                style={S.photoCard}
              >
                <img src={card.src} alt="" style={S.fillImg} />
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div ref={scrollHintRef} style={S.scrollHint}>
        <span style={S.scrollHintText}>Scroll</span>
        <div style={S.scrollLine} />
      </div>

    </section>
  )
}

export default Glimpse

// ─── STYLES ───────────────────────────────────────────────────────────────────

const S = {
  root: {
    position:   'relative',
    background: 'var(--panel-bg)',
    padding:    0,
    margin:     0,
  },

  progressBar: {
    position:        'fixed',
    top:             0,
    left:            0,
    height:          1,
    width:           '100%',
    background:      '#0a0a0a',
    transformOrigin: 'left center',
    transform:       'scaleX(0)',
    zIndex:          200,
    pointerEvents:   'none',
  },

  scrollWrap: {
    height:   '100vh',
    position: 'relative',
  },

  sticky: {
    position:       'sticky',
    top:            0,
    height:         '100vh',
    width:          '100%',
    overflow:       'hidden',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
  },

  edgeFadeH: {
    position:      'absolute',
    top:           0,
    bottom:        0,
    width:         '6%',
    zIndex:        20,
    pointerEvents: 'none',
  },

  edgeFadeV: {
    position:      'absolute',
    left:          0,
    right:         0,
    height:        '8%',
    zIndex:        20,
    pointerEvents: 'none',
  },

  stage: {
    position:       'relative',
    width:          '100vw',
    height:         '100vh',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
  },

  centerBox: {
    position:     'absolute',
    left:         '50%',
    top:          '50%',
    borderRadius: 20,
    overflow:     'hidden',
    zIndex:       10,
    willChange:   'transform',
    transform:    'translate(-50%, -50%) scale(1.8)',
  },

  photoCard: {
    position:     'absolute',
    left:         '50%',
    top:          '50%',
    borderRadius: 20,
    overflow:     'hidden',
    willChange:   'transform, opacity',
    opacity:      0,
    transform:    'translate(-50%, -50%) translateY(44px) scale(0.82)',
  },

  fillImg: {
    width:         '100%',
    height:        '100%',
    objectFit:     'cover',
    display:       'block',
    pointerEvents: 'none',
    userSelect:    'none',
  },

  heroOverlay: {
    position:       'absolute',
    inset:          0,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    background:     'rgba(0,0,0,0.28)',
  },

  heroLabel: {
    position:      'absolute',
    fontFamily:    "'Barlow Condensed', sans-serif",
    fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)',  // was clamp(2.8rem, 7vw, 5.5rem)
    fontWeight:    800,
    letterSpacing: '0.01em',
    color:         '#fff',
    textAlign:     'center',
    lineHeight:    1.1,
    whiteSpace:    'pre-line',
    userSelect:    'none',
    textTransform: 'uppercase',
  },

  label1: {
    opacity:   1,
    transform: 'translateY(0px)',
  },

  label2: {
    opacity:   0,
    transform: 'translateY(12px)',
  },

  scrollHint: {
    position:      'fixed',
    bottom:        32,
    left:          '50%',
    transform:     'translateX(-50%)',
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    gap:           8,
    opacity:       1,
    transition:    'opacity 0.5s ease',
    zIndex:        50,
    pointerEvents: 'none',
  },

  scrollHintText: {
    fontSize:      9,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color:         '#999',
  },

  scrollLine: {
    width:      1,
    height:     32,
    background: 'linear-gradient(to bottom, #0a0a0a, transparent)',
    animation:  'glimpse-scroll-line 1.6s ease-in-out infinite',
  },
}
