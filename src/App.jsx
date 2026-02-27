import { useState, useEffect, useRef } from 'react'

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #98FF00;
    --black: #030816;
    --green-dim: rgba(152,255,0,0.15);
  }

  body {
    font-family: 'Space Grotesk', sans-serif;
    background-color: var(--black);
    color: white;
    overflow: hidden;
    cursor: none;
  }

  #custom-cursor {
    width: 18px; height: 18px;
    background: var(--green);
    border-radius: 50%;
    position: fixed; pointer-events: none; z-index: 9999;
    box-shadow: 0 0 20px var(--green), 0 0 40px var(--green);
    transform: translate(-50%, -50%);
    transition: left 0.06s ease, top 0.06s ease;
  }

  #progress-bar {
    position: fixed; top: 0; left: 0; height: 5px;
    background: linear-gradient(90deg, var(--green), #00ffcc);
    z-index: 1000; transition: width 0.5s ease;
    box-shadow: 0 0 20px var(--green);
  }

  .slide {
    display: none; height: 100vh; width: 100vw; padding: 2rem;
    flex-direction: column; justify-content: center; align-items: center;
    text-align: center; position: relative; z-index: 10;
  }
  .slide.active {
    display: flex;
    animation: slideIn 0.7s cubic-bezier(0.23, 1, 0.32, 1);
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(50px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .green-glow {
    color: var(--green);
    text-shadow: 0 0 30px rgba(152,255,0,0.9), 0 0 60px rgba(152,255,0,0.4);
  }

  .glass-card {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 1.8rem 1.5rem;
    transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
    width: 100%; display: flex; flex-direction: column;
    justify-content: center; min-height: 170px;
    position: relative; overflow: hidden;
  }
  .glass-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--green), transparent);
    opacity: 0; transition: opacity 0.4s;
  }
  .glass-card:hover {
    border-color: rgba(152,255,0,0.4);
    transform: translateY(-10px) scale(1.02);
    background: rgba(152,255,0,0.06);
    box-shadow: 0 20px 60px rgba(152,255,0,0.15);
  }
  .glass-card:hover::before { opacity: 1; }

  .dna-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: var(--green-dim); border: 2px solid var(--green);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; margin: 0 auto 0.8rem;
    box-shadow: 0 0 20px rgba(152,255,0,0.3);
  }

  .btn-nav {
    position: fixed; bottom: 30px; padding: 10px 28px;
    background: rgba(10,15,25,0.95); border: 2px solid var(--green);
    color: var(--green); font-weight: 900; border-radius: 10px;
    z-index: 100; transition: 0.3s; letter-spacing: 2px;
    text-transform: uppercase; font-size: 0.78rem;
    cursor: none; font-family: 'Space Grotesk', sans-serif;
  }
  .btn-nav:hover {
    background: var(--green); color: black;
    box-shadow: 0 0 30px var(--green), 0 0 60px rgba(152,255,0,0.3);
    transform: translateY(-2px);
  }

  .profile-img {
    width: 200px; height: 200px;
    border: 5px solid var(--green);
    background: url('/freddy.jpg') center/cover;
    animation: morph 8s ease-in-out infinite;
    box-shadow: 0 0 80px rgba(152,255,0,0.5), 0 0 160px rgba(152,255,0,0.2);
    flex-shrink: 0; position: relative; z-index: 2;
  }
  @keyframes morph {
    0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  }

  .orbit-ring {
    position: absolute; border-radius: 50%;
    border: 1px dashed rgba(152,255,0,0.3);
    animation: spin linear infinite; pointer-events: none;
  }
  @keyframes spin {
    from { transform: translate(-50%,-50%) rotate(0deg); }
    to   { transform: translate(-50%,-50%) rotate(360deg); }
  }

  .skill-tag {
    background: linear-gradient(135deg, rgba(152,255,0,0.1), rgba(152,255,0,0.03));
    border: 1px solid rgba(152,255,0,0.2);
    border-left: 5px solid var(--green);
    padding: 1.1rem 1.5rem; text-align: left;
    border-radius: 0 16px 16px 0;
    transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
    width: 100%; display: flex; align-items: center; gap: 1rem;
  }
  .skill-tag:hover {
    transform: translateX(12px);
    background: rgba(152,255,0,0.12);
    border-color: rgba(152,255,0,0.5);
    box-shadow: 0 4px 20px rgba(152,255,0,0.1);
  }

  .grid-2 {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1.2rem; width: 100%;
  }
  .grid-4 {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem; width: 100%; max-width: 1200px;
  }
  @media (max-width: 900px) {
    .grid-4 { grid-template-columns: repeat(2,1fr); }
    .grid-2 { grid-template-columns: 1fr; }
  }
  @media (max-width: 500px) {
    .grid-4 { grid-template-columns: 1fr; }
  }

  #net-canvas {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    z-index: 0; opacity: 0.35; pointer-events: none;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.08; transform: scale(1); }
    50% { opacity: 0.18; transform: scale(1.05); }
  }
  .pulse-bg { animation: pulse 4s ease-in-out infinite; }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-18px); }
  }
  .bounce { animation: bounce 1.6s ease-in-out infinite; }

  @keyframes floatUp {
    0% { opacity:0; transform: translateY(30px); }
    100% { opacity:1; transform: translateY(0); }
  }
  .float-1 { animation: floatUp 0.6s ease forwards 0.1s; opacity:0; }
  .float-2 { animation: floatUp 0.6s ease forwards 0.3s; opacity:0; }
  .float-3 { animation: floatUp 0.6s ease forwards 0.5s; opacity:0; }
  .float-4 { animation: floatUp 0.6s ease forwards 0.7s; opacity:0; }
  .float-5 { animation: floatUp 0.6s ease forwards 0.9s; opacity:0; }

  @keyframes scanLine {
    0% { top: -10%; } 100% { top: 110%; }
  }
  .scan-line {
    position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--green), transparent);
    animation: scanLine 3s linear infinite; opacity: 0.4;
  }

  @keyframes glitch {
    0%, 90%, 100% { transform: translate(0); }
    92% { transform: translate(-3px, 1px); }
    94% { transform: translate(3px, -1px); }
    96% { transform: translate(-2px, 2px); }
  }
  .glitch { animation: glitch 5s ease-in-out infinite; }

  .stat-card {
    background: rgba(152,255,0,0.05);
    border: 1px solid rgba(152,255,0,0.25);
    border-radius: 16px; padding: 1rem 0.8rem; text-align: center;
    transition: all 0.3s ease;
  }
  .stat-card:hover {
    background: rgba(152,255,0,0.1);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(152,255,0,0.15);
  }

  .quote-block {
    padding: 1.3rem 1.8rem;
    background: rgba(255,255,255,0.04);
    border-radius: 14px; border-left: 6px solid var(--green);
    position: relative;
  }
  .quote-block::before {
    content: '"'; position: absolute; top: -10px; left: 16px;
    font-size: 5rem; color: var(--green);
    opacity: 0.2; line-height: 1; font-family: Georgia, serif;
  }

  .tag-pill-green {
    background: var(--green); color: black;
    padding: 6px 20px; border-radius: 999px;
    font-weight: 900; font-size: 0.9rem; letter-spacing: 1px;
  }
  .tag-pill-outline {
    border: 2px solid var(--green); color: var(--green);
    padding: 6px 20px; border-radius: 999px;
    font-weight: 900; font-size: 0.9rem; letter-spacing: 1px;
  }

  .platzi-logo { height: 36px; margin-bottom: 1rem; object-fit: contain; }

  .slide2-img {
    width: 100%; border-radius: 16px;
    border: 1px solid rgba(152,255,0,0.2);
    box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(152,255,0,0.1);
    object-fit: cover; max-height: 300px;
  }

  .thank-you-btn {
    background: var(--green); color: black;
    padding: 1.2rem 3rem; border-radius: 12px;
    font-weight: 900; font-size: clamp(1.3rem, 2.5vw, 2rem); letter-spacing: 2px;
    box-shadow: 0 0 40px rgba(152,255,0,0.5), 0 0 80px rgba(152,255,0,0.2);
    margin-top: 1rem;
  }

  .divider {
    height: 3px; width: 100px;
    background: linear-gradient(90deg, var(--green), transparent);
    margin: 0.6rem 0 1rem;
  }

  .nsl-char {
    display: inline-block;
    transition: color 0.3s, text-shadow 0.3s, transform 0.2s;
  }
  .nsl-char:hover {
    color: white;
    text-shadow: 0 0 40px rgba(152,255,0,1);
    transform: translateY(-8px) scale(1.1);
  }
`

/* ─── NEURAL CANVAS ──────────────────────────────────────────── */
function useNeuralCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, dots = []

    class Dot {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vX = (Math.random() - 0.5) * 0.8
        this.vY = (Math.random() - 0.5) * 0.8
        this.size = Math.random() * 1.5 + 1
      }
      update() {
        this.x += this.vX; this.y += this.vY
        if (this.x < 0 || this.x > canvas.width) this.vX *= -1
        if (this.y < 0 || this.y > canvas.height) this.vY *= -1
      }
      draw() {
        ctx.fillStyle = '#98FF00'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      dots = Array.from({ length: 70 }, () => new Dot())
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach(d => {
        d.update(); d.draw()
        dots.forEach(d2 => {
          const dist = Math.hypot(d.x - d2.x, d.y - d2.y)
          if (dist < 140) {
            ctx.strokeStyle = `rgba(152,255,0,${(1 - dist/140) * 0.6})`
            ctx.lineWidth = 0.5
            ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d2.x, d2.y); ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(animate)
    }

    resize(); animate()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [canvasRef])
}

/* ─── SLIDE 1: COVER ─────────────────────────────────────────── */
function SlideCover() {
  return (
    <div className="slide active" style={{ gap:'0.4rem' }}>
      {/* Corner accents */}
      {[['top:20px','left:20px','borderTop','borderLeft'],['top:20px','right:20px','borderTop','borderRight'],
        ['bottom:70px','left:20px','borderBottom','borderLeft'],['bottom:70px','right:20px','borderBottom','borderRight']
      ].map(([a,b,c,d], i) => (
        <div key={i} style={{ position:'absolute', ...Object.fromEntries([a,b].map(s=>s.split(':'))),
          width:55, height:55, [c]:'3px solid var(--green)', [d]:'3px solid var(--green)', opacity:0.45 }} />
      ))}

      {/* Profile + orbit rings */}
      <div className="float-1" style={{ position:'relative', width:200, height:200, marginBottom:'1rem' }}>
        <div className="orbit-ring" style={{ width:270, height:270, top:'50%', left:'50%', animationDuration:'12s' }} />
        <div className="orbit-ring" style={{ width:330, height:330, top:'50%', left:'50%', animationDuration:'20s', animationDirection:'reverse' }} />
        <div className="profile-img" />
      </div>

      <img src="/platzi-logo.png" alt="Platzi Logo" className="platzi-logo float-2" />

      <h1 className="glitch float-3" style={{
        fontSize:'clamp(3rem, 8vw, 6.5rem)', fontWeight:900, fontStyle:'italic',
        textTransform:'uppercase', letterSpacing:'-0.04em', lineHeight:1,
      }}>
        Freddy <span className="green-glow">Vega</span>
      </h1>

      <div className="float-4" style={{ height:3, width:160, background:'linear-gradient(90deg, transparent, var(--green), transparent)', margin:'0.5rem auto' }} />
      <p className="float-4" style={{ fontSize:'clamp(0.85rem,1.8vw,1.2rem)', fontWeight:700, letterSpacing:'0.45em', opacity:0.55, textTransform:'uppercase' }}>
        Visionary Leadership
      </p>

      <div className="float-5" style={{ marginTop:'1.8rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.2rem',
        background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'1rem 2.5rem' }}>
        <p style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', opacity:0.35 }}>Presented by</p>
        <p style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:900, fontStyle:'italic' }}>Brayan Urrego Cacante</p>
        <p className="green-glow" style={{ fontWeight:700, fontSize:'1rem', letterSpacing:'0.25em' }}>2026</p>
      </div>
    </div>
  )
}

/* ─── SLIDE 2: IMPACT ────────────────────────────────────────── */
function SlideImpact() {
  const stats = [
    { num:'5M+', label:'Students' },
    { num:'#1',  label:'Latam EdTech' },
    { num:'1K+', label:'Courses' },
    { num:'15+', label:'Countries' },
  ]
  return (
    <div className="slide active">
      <div style={{ maxWidth:'1100px', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2.5rem', alignItems:'center' }}>
        <div style={{ textAlign:'left', display:'flex', flexDirection:'column', gap:'1.2rem' }}>
          <div className="float-1">
            <p style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.3em', color:'var(--green)', opacity:0.8, marginBottom:'0.4rem' }}>● LIVE IMPACT</p>
            <h2 style={{ fontSize:'clamp(2rem,4.5vw,3.5rem)', fontWeight:900, lineHeight:0.95, textTransform:'uppercase' }}>
              Transforming <br /><span className="green-glow">Education</span>
            </h2>
            <div className="divider" />
          </div>
          <p className="float-2" style={{ fontSize:'clamp(0.9rem,1.4vw,1.1rem)', fontWeight:300, lineHeight:1.8, opacity:0.8 }}>
            Freddy <strong>successfully</strong> built Platzi to bridge the talent gap in Latam.
            It is a <strong>strongly</strong> powerful community of constant growth.
          </p>
          <div className="float-3" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.6rem' }}>
            {stats.map((s,i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize:'clamp(1rem,1.8vw,1.4rem)', fontWeight:900, color:'var(--green)' }}>{s.num}</div>
                <div style={{ fontSize:'0.62rem', opacity:0.5, textTransform:'uppercase', letterSpacing:'0.1em', marginTop:'0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="float-4" style={{ display:'flex', gap:'0.8rem', flexWrap:'wrap' }}>
            <span className="tag-pill-green">EDTECH</span>
            <span className="tag-pill-outline">FUTURE</span>
            <span className="tag-pill-outline">AI</span>
          </div>
        </div>

        <div className="float-2" style={{ display:'flex', flexDirection:'column', gap:'0.8rem', position:'relative' }}>
          <div className="scan-line" />
          <img src="/platzi-culture.jpg" alt="Platzi Culture" className="slide2-img" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
            <div style={{ position:'relative', overflow:'hidden', borderRadius:12, border:'1px solid rgba(152,255,0,0.2)' }}>
              <img src="/estudiantes.jpg" alt="Students" style={{ width:'100%', height:90, objectFit:'cover', display:'block' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent, rgba(0,0,0,0.85))', padding:'0.4rem 0.6rem' }}>
                <p style={{ fontSize:'0.6rem', color:'var(--green)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>👨‍🎓 Students</p>
              </div>
            </div>
            <div style={{ position:'relative', overflow:'hidden', borderRadius:12, border:'1px solid rgba(152,255,0,0.2)' }}>
              <img src="/comunidad.jpg" alt="Community" style={{ width:'100%', height:90, objectFit:'cover', display:'block' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent, rgba(0,0,0,0.85))', padding:'0.4rem 0.6rem' }}>
                <p style={{ fontSize:'0.6rem', color:'var(--green)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>🌎 Community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── SLIDE 3: DNA ───────────────────────────────────────────── */
function SlideDNA() {
  const qualities = [
    { adverb:'SUCCESSFULLY', desc:'Scaling education across 15+ countries with proven results', icon:'🚀' },
    { adverb:'CONSTANTLY',   desc:'Innovating with AI and emerging technologies every day',   icon:'⚡' },
    { adverb:'STRONGLY',     desc:'Inspiring millions of students to never stop learning',    icon:'💪' },
    { adverb:'CLEARLY',      desc:'Communicating complex ideas so everyone understands',      icon:'🎯' },
  ]
  return (
    <div className="slide active" style={{ flexDirection:'column', gap:'2rem' }}>
      <div className="float-1" style={{ textAlign:'center' }}>
        <p style={{ fontSize:'0.7rem', color:'var(--green)', letterSpacing:'0.4em', opacity:0.7, textTransform:'uppercase', marginBottom:'0.5rem' }}>● CORE QUALITIES</p>
        <h2 style={{ fontSize:'clamp(2rem,4.5vw,3.2rem)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', letterSpacing:'0.05em' }}>
          Leadership <span className="green-glow">DNA</span>
        </h2>
        <div style={{ height:3, width:120, background:'linear-gradient(90deg, transparent, var(--green), transparent)', margin:'0.8rem auto 0' }} />
      </div>

      <div className="grid-4" style={{ maxWidth:'1200px' }}>
        {qualities.map((q, i) => (
          <div key={q.adverb} className={`glass-card float-${i+2}`}>
            <div className="dna-icon">{q.icon}</div>
            <h3 className="green-glow" style={{ fontSize:'clamp(1.1rem,2vw,1.5rem)', fontWeight:900, fontStyle:'italic', marginBottom:'0.6rem' }}>
              {q.adverb}
            </h3>
            <div style={{ height:2, width:40, background:'var(--green)', margin:'0 auto 0.8rem', opacity:0.5 }} />
            <p style={{ opacity:0.65, fontWeight:400, fontSize:'clamp(0.75rem,1.1vw,0.9rem)', lineHeight:1.6 }}>{q.desc}</p>
          </div>
        ))}
      </div>

      <div className="float-5" style={{ maxWidth:1200, width:'100%', display:'grid', gridTemplateColumns:'1fr auto', gap:'1.5rem', alignItems:'center' }}>
        <div style={{ background:'rgba(152,255,0,0.04)', border:'1px solid rgba(152,255,0,0.15)', borderRadius:12, padding:'0.8rem 1.5rem' }}>
          <p style={{ fontSize:'clamp(0.8rem,1.2vw,1rem)', fontStyle:'italic', opacity:0.6 }}>
            "The best leaders don't just manage — they <strong style={{color:'var(--green)'}}>inspire</strong> and <strong style={{color:'var(--green)'}}>transform</strong>."
          </p>
        </div>
        <div style={{ position:'relative', overflow:'hidden', borderRadius:12, border:'2px solid rgba(152,255,0,0.3)', flexShrink:0 }}>
          <img src="/conferencia.jpg" alt="Freddy at Conference" style={{ width:180, height:100, objectFit:'cover', display:'block' }} />
          <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent, rgba(0,0,0,0.9))', padding:'0.3rem 0.5rem' }}>
            <p style={{ fontSize:'0.55rem', color:'var(--green)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>🎤 Freddy on Stage</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── SLIDE 4: LEARNING ──────────────────────────────────────── */
function SlideLearning() {
  const skills = [
    { title:'Software Engineering', sub:'Coding the next revolution.',      icon:'💻', pct:85 },
    { title:'Artificial Intelligence', sub:'Harnessing data for progress.', icon:'🤖', pct:75 },
    { title:'Financial Strategy', sub:'Smart capital management.',           icon:'📈', pct:65 },
    { title:'Public Speaking', sub:'Communicating ideas with impact.',       icon:'🎤', pct:80 },
  ]
  return (
    <div className="slide active">
      <div style={{ maxWidth:'950px', width:'100%', textAlign:'left', display:'flex', flexDirection:'column', gap:'1.3rem' }}>
        <div className="float-1">
          <p style={{ fontSize:'0.7rem', color:'var(--green)', letterSpacing:'0.4em', opacity:0.7, textTransform:'uppercase', marginBottom:'0.3rem' }}>● PERSONAL JOURNEY</p>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, fontStyle:'italic' }}>
            <span className="green-glow">MY</span> LEARNING PATH
          </h2>
          <div className="divider" />
        </div>

        <div className="grid-2 float-2">
          {skills.map(s => (
            <div key={s.title} className="skill-tag">
              <div style={{ fontSize:'1.6rem', flexShrink:0 }}>{s.icon}</div>
              <div style={{ flex:1 }}>
                <strong style={{ fontSize:'0.95rem', display:'block', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.2rem' }}>{s.title}</strong>
                <span style={{ opacity:0.45, fontWeight:600, fontSize:'0.78rem' }}>{s.sub}</span>
                <div style={{ marginTop:'0.5rem', height:3, background:'rgba(255,255,255,0.1)', borderRadius:99 }}>
                  <div style={{ height:'100%', width:`${s.pct}%`, background:'var(--green)', borderRadius:99, boxShadow:'0 0 8px var(--green)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="quote-block float-3">
          <p style={{ fontSize:'clamp(0.95rem,1.6vw,1.2rem)', fontWeight:300, fontStyle:'italic', opacity:0.9, lineHeight:1.7 }}>
            Thanks to Freddy's vision, I am <strong style={{color:'var(--green)'}}>highly</strong> motivated to change the world.
          </p>
          <p style={{ marginTop:'0.5rem', fontSize:'0.75rem', color:'var(--green)', opacity:0.6, letterSpacing:'0.15em' }}>— Brayan Urrego Cacante, 2026</p>
        </div>

        {/* Tech images row */}
        <div className="float-4" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
          <div style={{ position:'relative', overflow:'hidden', borderRadius:14, border:'1px solid rgba(152,255,0,0.25)' }}>
            <img src="/programacion.jpg" alt="Programming" style={{ width:'100%', height:100, objectFit:'cover', display:'block' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(152,255,0,0.1), transparent)' }} />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent, rgba(0,0,0,0.85))', padding:'0.4rem 0.8rem' }}>
              <p style={{ fontSize:'0.65rem', color:'var(--green)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em' }}>💻 Software Engineering</p>
            </div>
          </div>
          <div style={{ position:'relative', overflow:'hidden', borderRadius:14, border:'1px solid rgba(152,255,0,0.25)' }}>
            <img src="/ia.jpg" alt="Artificial Intelligence" style={{ width:'100%', height:100, objectFit:'cover', display:'block' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(152,255,0,0.1), transparent)' }} />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent, rgba(0,0,0,0.85))', padding:'0.4rem 0.8rem' }}>
              <p style={{ fontSize:'0.65rem', color:'var(--green)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em' }}>🤖 Artificial Intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── SLIDE 5: NEVER STOP LEARNING ──────────────────────────── */
function SlideMessage() {
  return (
    <div className="slide active" style={{ overflow:'hidden' }}>
      <div className="pulse-bg" style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'var(--green)', filter:'blur(120px)', opacity:0.07, top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:-1 }} />
      <div style={{ position:'absolute', width:250, height:250, borderRadius:'50%', background:'#00ffcc', filter:'blur(80px)', opacity:0.05, top:'15%', right:'8%', zIndex:-1 }} />
      <div style={{ position:'absolute', left:'5%', top:0, bottom:0, width:1, background:'linear-gradient(180deg, transparent, rgba(152,255,0,0.3), transparent)' }} />
      <div style={{ position:'absolute', right:'5%', top:0, bottom:0, width:1, background:'linear-gradient(180deg, transparent, rgba(152,255,0,0.3), transparent)' }} />

      <div style={{ textAlign:'center', zIndex:1 }}>
        <p className="float-1" style={{ fontSize:'0.7rem', color:'var(--green)', letterSpacing:'0.5em', opacity:0.6, textTransform:'uppercase', marginBottom:'1rem' }}>● THE MESSAGE ●</p>

        <h2 className="float-2 glitch" style={{
          fontSize:'clamp(4.5rem,13vw,11rem)', fontWeight:900, lineHeight:0.88,
          letterSpacing:'-0.04em', textTransform:'uppercase', fontStyle:'italic', color:'white',
          textShadow:'0 0 80px rgba(255,255,255,0.1)',
        }}>
          NEVER STOP
        </h2>

        <h2 className="float-3" style={{
          fontSize:'clamp(4.5rem,13vw,11rem)', fontWeight:900, lineHeight:0.88,
          letterSpacing:'-0.04em', textTransform:'uppercase', fontStyle:'italic',
        }}>
          {'LEARNING'.split('').map((ch, i) => (
            <span key={i} className="nsl-char green-glow" style={{ transitionDelay:`${i*0.03}s` }}>{ch}</span>
          ))}
        </h2>

        <div className="float-4" style={{ margin:'2rem auto', display:'flex', alignItems:'center', justifyContent:'center', gap:'1.5rem' }}>
          <div style={{ height:1, width:80, background:'linear-gradient(90deg, transparent, var(--green))' }} />
          <p style={{ fontSize:'clamp(0.75rem,1.2vw,1rem)', fontWeight:900, letterSpacing:'0.5em', opacity:0.35, textTransform:'uppercase' }}>Platzi 2026</p>
          <div style={{ height:1, width:80, background:'linear-gradient(90deg, var(--green), transparent)' }} />
        </div>

        <p className="float-5" style={{ fontSize:'clamp(0.85rem,1.5vw,1.1rem)', opacity:0.45, letterSpacing:'0.1em', maxWidth:600, margin:'0 auto' }}>
          In 2026, technology changes fast — education is a <span style={{color:'var(--green)', opacity:1}}>lifestyle</span>, not a phase.
        </p>
      </div>
    </div>
  )
}

/* ─── SLIDE 6: CLOSING ───────────────────────────────────────── */
function SlideClosing() {
  return (
    <div className="slide active" style={{ gap:'0.6rem' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(152,255,0,0.05) 0%, transparent 70%)', zIndex:-1 }} />

      <div className="float-1" style={{ marginBottom:'1.2rem' }}>
        <p style={{ fontSize:'0.8rem', opacity:0.35, textTransform:'uppercase', letterSpacing:'0.25em' }}>Oral Presentation by</p>
        <h2 className="green-glow" style={{ fontSize:'clamp(1.8rem,4.5vw,3rem)', fontWeight:900, fontStyle:'italic' }}>Brayan Urrego Cacante</h2>
      </div>

      <div className="bounce float-2" style={{ fontSize:'clamp(3rem,9vw,5.5rem)', fontWeight:900, fontStyle:'italic', textShadow:'0 0 60px rgba(255,255,255,0.2)' }}>
        QUESTIONS?
      </div>

      <div className="float-3 thank-you-btn">THANK YOU VERY MUCH!</div>

      <div className="float-4" style={{ display:'flex', gap:'8px', marginTop:'2rem', opacity:0.3 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width: i===2 ? 28 : 8, height:8, borderRadius:99, background: i===2 ? 'var(--green)' : 'white' }} />
        ))}
      </div>
    </div>
  )
}

/* ─── MAIN APP ───────────────────────────────────────────────── */
const SLIDES_COUNT = 6
const slideComponents = [SlideCover, SlideImpact, SlideDNA, SlideLearning, SlideMessage, SlideClosing]

export default function App() {
  const [current, setCurrent] = useState(0)
  const canvasRef = useRef(null)
  const cursorRef = useRef(null)

  useNeuralCanvas(canvasRef)

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

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') setCurrent(c => Math.min(c + 1, SLIDES_COUNT - 1))
      if (e.key === 'ArrowLeft') setCurrent(c => Math.max(c - 1, 0))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const progress = ((current + 1) / SLIDES_COUNT) * 100
  const ActiveSlide = slideComponents[current]

  return (
    <>
      <style>{globalCSS}</style>
      <div id="custom-cursor" ref={cursorRef} />
      <canvas id="net-canvas" ref={canvasRef} />
      <div id="progress-bar" style={{ width:`${progress}%` }} />
      <ActiveSlide />

      {current > 0 && (
        <button className="btn-nav" style={{ left:30 }} onClick={() => setCurrent(c => c - 1)}>← PREV</button>
      )}
      {current < SLIDES_COUNT - 1 && (
        <button className="btn-nav" style={{ right:30 }} onClick={() => setCurrent(c => c + 1)}>NEXT →</button>
      )}

      {/* Dot navigation */}
      <div style={{ position:'fixed', bottom:36, left:'50%', transform:'translateX(-50%)', display:'flex', gap:'8px', zIndex:100 }}>
        {Array.from({ length: SLIDES_COUNT }).map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? 28 : 8, height:8, borderRadius:99,
            background: i === current ? 'var(--green)' : 'rgba(255,255,255,0.2)',
            transition:'all 0.3s ease', cursor:'none',
            boxShadow: i === current ? '0 0 10px var(--green)' : 'none',
          }} />
        ))}
      </div>
    </>
  )
}


