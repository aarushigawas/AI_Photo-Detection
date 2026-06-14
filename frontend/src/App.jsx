import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    let mx = 0, my = 0, rx = 0, ry = 0
    let raf

    const move = (e) => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = mx + 'px'
      dot.style.top  = my + 'px'
    }

    const loop = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      raf = requestAnimationFrame(loop)
    }

    const over = (e) => {
      if (e.target.closest('button, label, a, input')) ring.classList.add('hovering')
      else ring.classList.remove('hovering')
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      cancelAnimationFrame(raf)
    }
  }, [])

  function handleFile(e) {
    setError(null)
    const f = e.target.files && e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!file) {
      setError('Please select an image to analyze.')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const fd = new FormData()
      fd.append('image', file)

      const resp = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: fd,
      })

      if (!resp.ok) throw new Error(`Server responded ${resp.status}`)

      const data = await resp.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div className="app">
        <header className="header">
          <h1>AI Photo Detector</h1>
          <p>Upload an image and the model will predict if it's AI-generated.</p>
        </header>

        <main className="main">
          <form className="uploader" onSubmit={handleSubmit}>
            <label className="file-label">
              <input type="file" accept="image/*" onChange={handleFile} />
              <span className="file-cta">Choose image</span>
            </label>

            {preview && (
              <div className="preview">
                <img src={preview} alt="preview" />
              </div>
            )}

            <div className="actions">
              <button className={`btn primary${loading ? ' loading' : ''}`} type="submit" disabled={loading}>
                {loading ? 'Analyzing…' : 'Analyze Image'}
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                  setResult(null)
                  setError(null)
                }}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </form>

          {error && <div className="message error">{error}</div>}

          {result && (
            <div className="result">
              <h2>
                Verdict:{' '}
                <span className={result.prediction === 'REAL' ? 'tag real' : 'tag fake'}>
                  {result.prediction}
                </span>
              </h2>
              <p>Confidence: {result.confidence}%</p>
              <div className="confidence-bar">
                <div
                  className={`confidence-fill ${result.prediction === 'REAL' ? 'good' : 'bad'}`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <small>Using the project's ML API at /predict</small>
        </footer>
      </div>
    </>
  )
}

export default App