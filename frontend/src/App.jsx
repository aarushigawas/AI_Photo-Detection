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
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    let mx = 0, my = 0, rx = 0, ry = 0
    let raf

    const move = (e) => {
      mx = e.clientX; my = e.clientY
      dot.style.left = mx + 'px'; dot.style.top = my + 'px'
    }
    const loop = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px'
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
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!file) { setError('Please select an image first.'); return }
    setLoading(true); setResult(null)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const resp = await fetch('http://localhost:8000/predict', { method: 'POST', body: fd })
      if (!resp.ok) throw new Error(`Server responded ${resp.status}`)
      const data = await resp.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const isReal = result?.prediction === 'REAL'

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div className="app">
        <header className="header">
          <span className="header-logo">VisualAI</span>
          <h1 className="header-title">AI Image Detector</h1>
        </header>

        <main className="main">
          <form className="uploader" onSubmit={handleSubmit}>

            <div className="step">
              <span className="step-label">01 — Insert image</span>
              <label className="file-label">
                <input type="file" accept="image/*" onChange={handleFile} />
                <div className={`drop-zone${preview ? ' has-file' : ''}`}>
                  {preview
                    ? <img src={preview} alt="preview" className="preview-img" />
                    : (
                      <div className="drop-placeholder">
                        <span className="drop-icon">↑</span>
                        <span className="drop-text">Click to upload</span>
                        <span className="drop-hint">PNG · JPG · WEBP</span>
                      </div>
                    )
                  }
                </div>
              </label>
            </div>

            <div className="step">
              <span className="step-label">02 — Run analysis</span>
              <div className="actions">
                <button className="btn primary" type="submit" disabled={loading || !file}>
                  {loading ? <><span className="spinner" /> Analyzing…</> : 'Start Process'}
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); setResult(null); setError(null) }}
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            </div>

          </form>

          {error && <div className="message error">{error}</div>}

          {loading && (
            <div className="loading-bar-wrap">
              <div className="loading-bar" />
            </div>
          )}

          {result && !loading && (
            <div className={`result ${isReal ? 'result-real' : 'result-fake'}`}>
              <div className="result-verdict">
                <span className={`verdict-tag ${isReal ? 'tag-real' : 'tag-fake'}`}>
                  {isReal ? 'REAL' : 'FAKE'}
                </span>
                <span className="verdict-conf">{result.confidence}% confidence</span>
              </div>
              <div className="conf-bar">
                <div
                  className={`conf-fill ${isReal ? 'fill-real' : 'fill-fake'}`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <small>Real-time inference · No data stored</small>
        </footer>
      </div>
    </>
  )
}

export default App