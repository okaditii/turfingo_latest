/**
 * src/components/scrollBanner.jsx
 */

import { useEffect, useRef } from 'react'

const PHRASE     = 'REACH YOUR FULL POTENTIAL\u2003—\u2003'
const REPEAT     = 6
const IDLE_SPEED = 1.6
const MAX_BOOST  = 14
const SMOOTHING  = 0.08

export default function ScrollBanner() {
  const trackRef    = useRef(null)
  const offsetRef   = useRef(0)
  const velRef      = useRef(-IDLE_SPEED)
  const targetVRef  = useRef(-IDLE_SPEED)
  const lastScrollY = useRef(window.scrollY)
  const lastTime    = useRef(0)
  const rafRef      = useRef(null)

  useEffect(() => {
    lastTime.current = performance.now()

    const style = document.createElement('style')
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&display=swap');`
    document.head.appendChild(style)

    /* ── scroll velocity ── */
    let scrollTimer = null

    let lastDir = -1  // -1 = left, 1 = right

    function onScroll() {
      const now  = performance.now()
      const dt   = Math.max(now - lastTime.current, 1)
      const dy   = window.scrollY - lastScrollY.current
      lastScrollY.current = window.scrollY
      lastTime.current    = now
    
      if (dy !== 0) lastDir = dy >= 0 ? -1 : 1   // update direction only on actual scroll
    
      const boost = Math.min(Math.abs((dy / dt) * 16) * 2.5, MAX_BOOST)
      targetVRef.current = lastDir * (IDLE_SPEED + boost)
    
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        targetVRef.current = lastDir * IDLE_SPEED  // preserve last direction at idle
      }, 200)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    /* ── animation loop ── */
    function measure() {
      const track = trackRef.current
      if (!track) return 0
      return track.scrollWidth / 2
    }

    function loop() {
      velRef.current += (targetVRef.current - velRef.current) * SMOOTHING
      offsetRef.current += velRef.current

      const unit = measure()
      if (unit > 0) {
        offsetRef.current = ((offsetRef.current % unit) - unit) % unit
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
      clearTimeout(scrollTimer)
      if (document.head.contains(style)) document.head.removeChild(style)
    }
  }, [])

  const items = Array.from({ length: REPEAT * 2 }, (_, i) => (
    <span key={i} style={S.phrase} aria-hidden={i > 0 ? 'true' : undefined}>
      {PHRASE}
    </span>
  ))

  return (
    <div style={S.root}>
      <div style={S.noise} />
      <div style={S.topLine} />
      <div style={S.viewport}>
        <div ref={trackRef} style={S.track}>
          {items}
        </div>
      </div>
    </div>
  )
}

const S = {
  root: {
    position:   'relative',
    width:      '100%',
    height:     '92px',
    overflow:   'hidden',
    background: 'linear-gradient(105deg, #0a0f0d 0%, #0d2620 55%, #091a14 100%)',
    display:    'flex',
    alignItems: 'center',
  },

  noise: {
    position:        'absolute',
    inset:           0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundSize:  '180px 180px',
    opacity:         0.35,
    pointerEvents:   'none',
    mixBlendMode:    'overlay',
  },

  topLine: {
    position:   'absolute',
    top:        0,
    left:       0,
    right:      0,
    height:     '1px',
    background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, transparent 100%)',
  },

  viewport: {
    width:    '100%',
    overflow: 'hidden',
    position: 'relative',
    zIndex:   1,
  },

  track: {
    display:    'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    willChange: 'transform',
  },

  phrase: {
    fontFamily:    "'Barlow Condensed', sans-serif",
    fontSize:      'clamp(1.6rem, 3.4vw, 2.8rem)',
    fontWeight:    800,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color:         '#e8e4df',
    lineHeight:    1,
    paddingRight:  '0.15em',
    userSelect:    'none',
  },
}
