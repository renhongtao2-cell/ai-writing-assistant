import { useState, useRef, useEffect } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

// --- Nutrient Web SDK (loaded from unpkg CDN, no self-hosted assets) ---
const NUTRIENT_SCRIPT = 'https://unpkg.com/@nutrient-sdk/viewer@1.20.0/dist/nutrient-viewer.js'
const NUTRIENT_BASE = 'https://unpkg.com/@nutrient-sdk/viewer@1.20.0/dist/'

function ensureNutrient(timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.NutrientViewer) return resolve(window.NutrientViewer)
    const timer = setTimeout(() => {
      reject(new Error('Nutrient SDK load timed out'))
    }, timeoutMs)
    const s = document.createElement('script')
    s.src = NUTRIENT_SCRIPT
    s.async = true
    s.onload = () => {
      clearTimeout(timer)
      window.NutrientViewer ? resolve(window.NutrientViewer) : reject(new Error('Nutrient global missing after load'))
    }
    s.onerror = () => {
      clearTimeout(timer)
      reject(new Error('Failed to load Nutrient script from CDN'))
    }
    document.head.appendChild(s)
  })
}

async function makePdfBlob(text) {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const fontSize = 12
  const lineHeight = 16
  const margin = 50
  const pageWidth = 595.28 // A4
  const pageHeight = 841.89
  const maxWidth = pageWidth - margin * 2
  let page = pdf.addPage([pageWidth, pageHeight])
  let y = pageHeight - margin
  const newPage = () => {
    page = pdf.addPage([pageWidth, pageHeight])
    y = pageHeight - margin
  }
  const drawLine = (line) => {
    if (y < margin) newPage()
    page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) })
    y -= lineHeight
  }
  for (const para of text.split('\n')) {
    let line = ''
    for (const word of para.split(' ')) {
      const test = line ? line + ' ' + word : word
      if (font.widthOfTextAtSize(test, fontSize) > maxWidth && line) {
        drawLine(line)
        line = word
      } else {
        line = test
      }
    }
    if (line) drawLine(line)
    y -= lineHeight / 2 // paragraph spacing
  }
  const bytes = await pdf.save()
  return new Blob([bytes], { type: 'application/pdf' })
}

function downloadPdf(blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ai-writing-result.pdf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')
  const [error, setError] = useState('')
  const [webGrounded, setWebGrounded] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const pdfContainerRef = useRef(null)
  const nutrientInstanceRef = useRef(null)

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text')
      return
    }

    setIsLoading(true)
    setError('')
    setOutputText('')

    try {
      let webContext
      if (webGrounded && activeTab === 'generate') {
        try {
          const sRes = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: inputText }),
          })
          const sData = await sRes.json()
          if (sData.enabled && Array.isArray(sData.results) && sData.results.length > 0) {
            webContext = sData.results
          } else if (sData.error) {
            console.warn('[SEARCH]', sData.error)
          }
        } catch (sErr) {
          console.warn('[SEARCH] skipped:', sErr.message)
        }
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputText, mode: activeTab, webContext }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setOutputText(data.result)
      }
    } catch (err) {
      setError('Failed to connect to AI service. Is the server running?')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    alert('Copied to clipboard!')
  }

  const handleExportPdf = async () => {
    if (!outputText) return
    setPdfLoading(true)
    setError('')
    try {
      // Step 1: Always generate & download PDF first (reliable path via pdf-lib)
      const blob = await makePdfBlob(outputText)
      downloadPdf(blob)

      // Step 2: Try to open in Nutrient viewer (best-effort, non-blocking)
      try {
        const url = URL.createObjectURL(blob)
        setShowPdfModal(true)
        await new Promise((r) => setTimeout(r, 100))
        const NutrientViewer = await ensureNutrient()
        const instance = await NutrientViewer.load({
          container: pdfContainerRef.current,
          document: url,
          baseUrl: NUTRIENT_BASE,
          licenseKey: process.env.NEXT_PUBLIC_NUTRIENT_LICENSE_KEY || undefined,
        })
        nutrientInstanceRef.current = instance
      } catch (nutErr) {
        console.warn('[NUTRIENT] viewer skipped:', nutErr?.message || nutErr)
        setShowPdfModal(false)
        // PDF already downloaded — no action needed
      }
    } catch (e) {
      console.error('[EXPORT] failed:', e)
      setError('PDF generation failed. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (nutrientInstanceRef.current) {
        try {
          window.NutrientViewer && window.NutrientViewer.unload(nutrientInstanceRef.current)
        } catch (_) {
          /* noop */
        }
        nutrientInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>AI Writing Assistant</h1>
        <p style={{ color: 'white', textAlign: 'center', marginBottom: '2rem' }}>Powered by AI | API World 2026</p>

        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setActiveTab('generate')}
              style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', background: activeTab === 'generate' ? '#667eea' : '#e0e0e0', color: activeTab === 'generate' ? 'white' : '#333' }}
            >Generate</button>
            <button
              onClick={() => setActiveTab('optimize')}
              style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', background: activeTab === 'optimize' ? '#667eea' : '#e0e0e0', color: activeTab === 'optimize' ? 'white' : '#333' }}
            >Optimize</button>
            <button
              onClick={() => setActiveTab('summarize')}
              style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', background: activeTab === 'summarize' ? '#667eea' : '#e0e0e0', color: activeTab === 'summarize' ? 'white' : '#333' }}
            >Summarize</button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Enter your text here... (${activeTab} mode)`}
            rows={8}
            style={{ width: '100%', padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', marginBottom: '1rem' }}
          />

          {activeTab === 'generate' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#333' }}>
              <input
                type="checkbox"
                checked={webGrounded}
                onChange={(e) => setWebGrounded(e.target.checked)}
              />
              🌐 Ground with live web (SerpApi) — fact-check via real-time search
            </label>
          )}

          {error && (
            <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', color: '#c00' }}>
              Error: {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading || !inputText.trim()}
            style={{
              padding: '1rem 2rem',
              background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            {isLoading ? 'AI is thinking...' : 'Generate with AI'}
          </button>

          {outputText && (
            <div style={{ marginTop: '1.5rem', background: '#f8f9fa', borderRadius: '8px', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>AI Result:</h3>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.95rem', lineHeight: '1.6', color: '#444', marginBottom: '1rem' }}>{outputText}</pre>
              <button
                onClick={handleCopy}
                style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Copy to Clipboard
              </button>
              <button
                onClick={handleExportPdf}
                disabled={pdfLoading}
                style={{ padding: '0.5rem 1rem', background: pdfLoading ? '#ccc' : '#764ba2', color: 'white', border: 'none', borderRadius: '6px', cursor: pdfLoading ? 'not-allowed' : 'pointer' }}
              >
                {pdfLoading ? 'Opening viewer…' : '📄 Export as PDF (Nutrient)'}
              </button>
            </div>
          )}

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#e7f3ff', borderRadius: '8px', fontSize: '0.9rem', color: '#0056b3' }}>
            Tip: Enter your text and click Generate. Supports create, optimize, and summarize modes.
          </div>
        </div>

        <footer style={{ textAlign: 'center', color: 'white', marginTop: '2rem', opacity: '0.9' }}>
          <p>Built for API World 2026 — DevNetwork [API + Cloud + AI] Hackathon</p>
        </footer>
      </div>

      {showPdfModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              width: '92vw',
              maxWidth: '960px',
              height: '86vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #eee',
              }}
            >
              <strong>📄 Document Preview &amp; Export — Powered by Nutrient</strong>
              <button
                onClick={() => setShowPdfModal(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
            <div ref={pdfContainerRef} style={{ flex: 1, minHeight: 0 }} />
          </div>
        </div>
      )}
    </div>
  )
}
