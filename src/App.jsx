import { useState, useEffect, useRef } from 'react'

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #98FF00;
    --black: #030816;
  }

  body {
    font-family: 'Space Grotesk', sans-serif;
    background-color: var(--black);
    color: white;
    overflow: hidden;
    cursor: none;
  }

  /* ── Custom Cursor ── */
  #custom-cursor {
    width: 20px;
    height: 20px;
    background: var(--green);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    box-shadow: 0 0 20px var(--green), 0 0 40px var(--green);
    transform: translate(-50%, -50%);
    transition: left 0.08s ease, top 0.08s ease;
  }

  /* ── Progress bar ── */
  #progress-bar {
    position: fixed;
    top: 0; left: 0;
    height: 6px;
    background: var(--green);
    z-index: 1000;
    transition: width 0.4s ease;
    box-shadow: 0 0 20px var(--green);
  }

  /* ── Slides ── */
  .slide {
    display: none;
    height: 100vh;
    width: 100vw;
    padding: 2rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 10;
  }
  .slide.active {
    display: flex;
    animation: slideIn 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(40px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Utilities ── */
  .green-glow {
    color: var(--green);
    text-shadow: 0 0 25px rgba(152,255,0,0.8);
  }

  .glass-card {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px;
    padding: 1.5rem;
    transition: all 0.4s ease;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 140px;
  }
  .glass-card:hover {
    border-color: var(--green);
    transform: translateY(-8px);
    background: rgba(152,255,0,0.05);
  }

  /* ── Nav Buttons ── */
  .btn-nav {
    position: fixed;
    bottom: 30px;
    padding: 10px 25px;
    background: rgba(15,20,30,0.9);
    border: 2px solid var(--green);
    color: var(--green);
    font-weight: 900;
    border-radius: 10px;
    z-index: 100;
    transition: 0.3s;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-size: 0.8rem;
    cursor: none;
    font-family: 'Space Grotesk', sans-serif;
  }
  .btn-nav:hover {
    background: var(--green);
    color: black;
    box-shadow: 0 0 30px var(--green);
  }

  /* ── Profile image ── */
  .profile-img {
    width: 220px;
    height: 220px;
    border: 6px solid var(--green);
    background: url('https://pbs.twimg.com/profile_images/1491104445831639040/yLz8bV45_400x400.jpg') center/cover;
    animation: morph 8s ease-in-out infinite;
    box-shadow: 0 0 60px rgba(152,255,0,0.4);
    flex-shrink: 0;
  }
  @keyframes morph {
    0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  }

  /* ── Skill tags ── */
  .skill-tag {
    background: linear-gradient(90deg, rgba(152,255,0,0.15), transparent);
    border-left: 5px solid var(--green);
    padding: 1rem 1.5rem;
    text-align: left;
    border-radius: 0 15px 15px 0;
    transition: 0.3s;
    width: 100%;
  }
  .skill-tag:hover {
    transform: translateX(10px);
    background: rgba(152,255,0,0.2);
  }

  /* ── Grid helpers ── */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    width: 100%;
  }
  .grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
  }
  @media (max-width: 900px) {
    .grid-4 { grid-template-columns: repeat(2,1fr); }
    .grid-2 { grid-template-columns: 1fr; }
  }
  @media (max-width: 500px) {
    .grid-4 { grid-template-columns: 1fr; }
  }

  /* ── Canvas background ── */
  #net-canvas {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 0;
    opacity: 0.4;
    pointer-events: none;
  }

  /* ── Slide 5 pulse ── */
  @keyframes pulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.2; }
  }
  .pulse-bg {
    animation: pulse 3s ease-in-out infinite;
  }

  /* ── Slide 6 bounce ── */
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  .bounce { animation: bounce 1.4s ease-in-out infinite; }

  /* ── divider line ── */
  .divider {
    height: 4px;
    width: 120px;
    background: var(--green);
    margin: 0 auto 1.5rem;
  }

  /* ── Quote block ── */
  .quote-block {
    margin-top: 1.5rem;
    padding: 1.5rem 2rem;
    background: rgba(255,255,255,0.05);
    border-radius: 16px;
    border-left: 8px solid var(--green);
  }

  .platzi-logo {
    height: 40px;
    margin-bottom: 1.5rem;
    object-fit: contain;
  }

  .tag-pill-green {
    background: var(--green);
    color: black;
    padding: 6px 20px;
    border-radius: 999px;
    font-weight: 900;
    font-size: 1rem;
    letter-spacing: 1px;
  }
  .tag-pill-outline {
    border: 2px solid var(--green);
    color: var(--green);
    padding: 6px 20px;
    border-radius: 999px;
    font-weight: 900;
    font-size: 1rem;
    letter-spacing: 1px;
  }

  .slide2-img {
    width: 100%;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    object-fit: cover;
    max-height: 320px;
  }

  .thank-you-btn {
    background: var(--green);
    color: black;
    padding: 1.2rem 3rem;
    border-radius: 12px;
    font-weight: 900;
    font-size: clamp(1.4rem, 3vw, 2.2rem);
    letter-spacing: 2px;
    box-shadow: 0 0 40px rgba(152,255,0,0.4);
    margin-top: 1rem;
  }

  .dot-row {
    display: flex;
    gap: 1.5rem;
    margin-top: 2.5rem;
    opacity: 0.3;
  }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
`

/* ─── NEURAL NETWORK CANVAS HOOK ────────────────────────────── */
function useNeuralCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let dots = []

    class Dot {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vX = (Math.random() - 0.5) * 1.0
        this.vY = (Math.random() - 0.5) * 1.0
      }
      update() {
        this.x += this.vX; this.y += this.vY
        if (this.x < 0 || this.x > canvas.width) this.vX *= -1
        if (this.y < 0 || this.y > canvas.height) this.vY *= -1
      }
      draw() {
        ctx.fillStyle = '#98FF00'
        ctx.beginPath()
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      dots = Array.from({ length: 60 }, () => new Dot())
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach(d => {
        d.update(); d.draw()
        dots.forEach(d2 => {
          const dist = Math.hypot(d.x - d2.x, d.y - d2.y)
          if (dist < 150) {
            ctx.strokeStyle = `rgba(152,255,0,${1 - dist / 150})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(d.x, d.y)
            ctx.lineTo(d2.x, d2.y)
            ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [canvasRef])
}

/* ─── SLIDES DATA ────────────────────────────────────────────── */
const SLIDES = [
  { id: 'cover' },
  { id: 'impact' },
  { id: 'dna' },
  { id: 'learning' },
  { id: 'message' },
  { id: 'closing' },
]

/* ─── SLIDE COMPONENTS ───────────────────────────────────────── */

function SlideCover() {
  return (
    <div className="slide active" style={{ flexDirection: 'column', gap: '0.5rem' }}>
      <div className="profile-img" style={{ marginBottom: '1.2rem' }} />

      {/* ✅ Platzi logo - Slide 1 */}
      <img
        src="https://static.platzi.com/media/logos/platzi-logo.png"
        alt="Platzi Logo"
        className="platzi-logo"
      />

      <h1 style={{
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        fontWeight: 900,
        fontStyle: 'italic',
        textTransform: 'uppercase',
        letterSpacing: '-0.04em',
        lineHeight: 1,
        marginBottom: '0.5rem',
      }}>
        Freddy <span className="green-glow">Vega</span>
      </h1>

      <div className="divider" />

      <p style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontWeight: 700, letterSpacing: '0.4em', opacity: 0.6, textTransform: 'uppercase' }}>
        Visionary Leadership
      </p>

      <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.4 }}>Presented by</p>
        <p style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: 900, fontStyle: 'italic' }}>Brayan Urrego Cacante</p>
        <p className="green-glow" style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.2em' }}>2026</p>
      </div>
    </div>
  )
}

function SlideImpact() {
  return (
    <div className="slide active" style={{ alignItems: 'center' }}>
      <div style={{ maxWidth: '1100px', width: '100%' }} className="grid-2">
        {/* Left text */}
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.2rem', justifyContent: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1, textTransform: 'uppercase' }}>
            Transforming <br /><span className="green-glow">Education</span>
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)', fontWeight: 300, lineHeight: 1.7, opacity: 0.85 }}>
            Freddy <strong>successfully</strong> built Platzi to bridge the talent gap in Latam.
            It is a <strong>strongly</strong> powerful community of constant growth.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="tag-pill-green">EDTECH</span>
            <span className="tag-pill-outline">FUTURE</span>
          </div>
        </div>

        {/* Right image */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* ✅ Platzi culture image - Slide 2 */}
          <img
            src="https://static.platzi.com/media/blog/como-funciona-platzi-728f7311-6679-4623-832f-763b016d953d.png"
            alt="Platzi Culture"
            className="slide2-img"
          />
        </div>
      </div>
    </div>
  )
}

function SlideDNA() {
  const qualities = [
    { adverb: 'SUCCESSFULLY', desc: 'Scaling Education' },
    { adverb: 'CONSTANTLY',   desc: 'Innovating with AI' },
    { adverb: 'STRONGLY',     desc: 'Inspiring Millions' },
    { adverb: 'CLEARLY',      desc: 'Showing the Path' },
  ]
  return (
    <div className="slide active" style={{ flexDirection: 'column', gap: '2.5rem' }}>
      <h2 style={{
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 900,
        fontStyle: 'italic',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        borderBottom: '4px solid var(--green)',
        paddingBottom: '0.5rem',
      }}>
        Leadership DNA
      </h2>

      <div className="grid-4">
        {qualities.map(q => (
          <div key={q.adverb} className="glass-card">
            <h3 className="green-glow" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontWeight: 900, fontStyle: 'italic' }}>
              {q.adverb}
            </h3>
            <p style={{ marginTop: '0.5rem', opacity: 0.7, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
              {q.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideLearning() {
  const skills = [
    { title: 'Software Engineering', sub: 'Coding the next revolution.' },
    { title: 'Artificial Intelligence', sub: 'Harnessing data for progress.' },
    { title: 'Financial Strategy', sub: 'Smart capital management.' },
    { title: 'Public Speaking', sub: 'Communicating ideas with impact.' },
  ]
  return (
    <div className="slide active">
      <div style={{ maxWidth: '900px', width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, fontStyle: 'italic' }}>
          <span className="green-glow">MY</span> LEARNING PATH
        </h2>

        <div className="grid-2">
          {skills.map(s => (
            <div key={s.title} className="skill-tag">
              <strong style={{ fontSize: '1.1rem', display: 'block', textTransform: 'uppercase' }}>{s.title}</strong>
              <span style={{ opacity: 0.5, fontWeight: 700, fontSize: '0.85rem' }}>{s.sub}</span>
            </div>
          ))}
        </div>

        {/* ✅ Fixed asterisks → proper JSX bold */}
        <div className="quote-block">
          <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', fontWeight: 300, fontStyle: 'italic', opacity: 0.9, lineHeight: 1.7 }}>
            "Thanks to Freddy's vision, I am <strong>highly</strong> motivated to change the world."
          </p>
        </div>
      </div>
    </div>
  )
}

function SlideMessage() {
  return (
    <div className="slide active">
      <div style={{ position: 'relative' }}>
        {/* Glow background */}
        <div
          className="pulse-bg"
          style={{
            position: 'absolute',
            inset: '-80px',
            background: 'var(--green)',
            borderRadius: '50%',
            filter: 'blur(100px)',
            opacity: 0.1,
            zIndex: -1,
          }}
        />
        <h2 style={{
          fontSize: 'clamp(4rem, 12vw, 10rem)',
          fontWeight: 900,
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          fontStyle: 'italic',
        }}>
          Never Stop<br /><span className="green-glow">Learning</span>
        </h2>
        <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
          <div style={{ height: '2px', width: '60px', background: 'rgba(152,255,0,0.5)' }} />
          <p style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.2rem)', fontWeight: 900, letterSpacing: '0.5em', opacity: 0.4, textTransform: 'uppercase' }}>
            Platzi 2026
          </p>
          <div style={{ height: '2px', width: '60px', background: 'rgba(152,255,0,0.5)' }} />
        </div>
      </div>
    </div>
  )
}

function SlideClosing() {
  return (
    <div className="slide active" style={{ gap: '0.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '1rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Oral Presentation by</p>
        <h2 className="green-glow" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, fontStyle: 'italic' }}>
          Brayan Urrego Cacante
        </h2>
      </div>

      <div className="bounce" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 900, fontStyle: 'italic' }}>
        QUESTIONS?
      </div>

      <div className="thank-you-btn">
        THANK YOU VERY MUCH!
      </div>

      <div className="dot-row">
        <div className="dot" style={{ background: 'white' }} />
        <div className="dot" style={{ background: 'var(--green)' }} />
        <div className="dot" style={{ background: 'white' }} />
      </div>
    </div>
  )
}

const slideComponents = [
  SlideCover,
  SlideImpact,
  SlideDNA,
  SlideLearning,
  SlideMessage,
  SlideClosing,
]

/* ─── MAIN APP ───────────────────────────────────────────────── */
export default function App() {
  const [current, setCurrent] = useState(0)
  const canvasRef = useRef(null)
  const cursorRef = useRef(null)

  useNeuralCanvas(canvasRef)

  // Custom cursor
  useEffect(() => {
    const onMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top = e.clientY + 'px'
      }
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrent(c => Math.min(c + 1, SLIDES.length - 1))
      }
      if (e.key === 'ArrowLeft') {
        setCurrent(c => Math.max(c - 1, 0))
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const progress = ((current + 1) / SLIDES.length) * 100
  const ActiveSlide = slideComponents[current]

  return (
    <>
      {/* Inject global CSS */}
      <style>{globalCSS}</style>

      {/* Custom cursor */}
      <div id="custom-cursor" ref={cursorRef} />

      {/* Neural canvas background */}
      <canvas id="net-canvas" ref={canvasRef} />

      {/* Progress bar */}
      <div id="progress-bar" style={{ width: `${progress}%` }} />

      {/* Active Slide */}
      <ActiveSlide />

      {/* Navigation buttons */}
      {current > 0 && (
        <button
          className="btn-nav"
          style={{ left: '30px' }}
          onClick={() => setCurrent(c => c - 1)}
        >
          ← PREVIOUS
        </button>
      )}
      {current < SLIDES.length - 1 && (
        <button
          className="btn-nav"
          style={{ right: '30px' }}
          onClick={() => setCurrent(c => c + 1)}
        >
          NEXT →
        </button>
      )}

      {/* Slide counter */}
      <div style={{
        position: 'fixed',
        bottom: '38px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        opacity: 0.35,
        color: 'white',
        zIndex: 100,
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        {current + 1} / {SLIDES.length}
      </div>
    </>
  )
}