import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './StartPg.css'

export default function StartPg() {
  const navigate = useNavigate()
  const [entered, setEntered] = useState(false)
  const starsRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorRingRef = useRef(null)

  useEffect(() => {
    const canvas = starsRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = canvas.width  = window.innerWidth
    let h = canvas.height = window.innerHeight

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      stars.forEach(s => {
        s.a += s.speed
        ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(s.a))
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      w = canvas.width  = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => {
    const dot = cursorRef.current
    const ring = cursorRingRef.current
    if (!dot || !ring) return

    let ringX = 0, ringY = 0
    let dotX = 0, dotY = 0
    let rafId

    const onMove = (e) => {
      dotX = e.clientX
      dotY = e.clientY
    }

    const animate = () => {
      ringX += (dotX - ringX) * 0.12
      ringY += (dotY - ringY) * 0.12

      dot.style.left = dotX + 'px'
      dot.style.top  = dotY + 'px'
      ring.style.left = ringX + 'px'
      ring.style.top  = ringY + 'px'

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const handleStart = () => {
    setEntered(true)
    setTimeout(() => navigate('/app'), 700)
  }

  return (
    <div className={`sp-root${entered ? ' sp-exit' : ''}`}>
      <div ref={cursorRef} className="sp-cursor" />
      <div ref={cursorRingRef} className="sp-cursor-ring" />

      <canvas ref={starsRef} className="sp-stars" />

      <div className="sp-bg" />

      <nav className="sp-nav">
        <span className="sp-logo">VisualAI</span>
      </nav>

      <main className="sp-hero">
        <p className="sp-eyebrow">Powered by machine learning</p>

        <h1 className="sp-title">
          AI Image<br />
          <span className="sp-title-accent">Detector</span>
        </h1>

        <div className="sp-divider" />

        <p className="sp-sub">
          Upload any image and our model will determine whether it was generated
          by artificial intelligence or captured by a camera — and explain
          exactly why, with confidence scoring.
        </p>

        <button className="sp-btn" onClick={handleStart}>
          <span className="sp-btn-text">Let's Start</span>
          <span className="sp-btn-arrow">→</span>
        </button>
      </main>

      <footer className="sp-footer">
        <small>Real-time inference · No data stored · Instant results</small>
      </footer>
    </div>
  )
}