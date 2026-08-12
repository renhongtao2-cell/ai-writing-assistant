'use client'

import { useState } from 'react'

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')

  const handleGenerate = async () => {
    if (!inputText.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputText, mode: activeTab }),
      })
      const data = await res.json()
      setOutputText(data.result)
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      <h1 style={{ color: 'white', textAlign: 'center' }}>✨ AI Writing Assistant</h1>
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={() => setActiveTab('generate')} style={{ padding: '0.5rem 1rem', background: activeTab === 'generate' ? '#667eea' : '#ccc', border: 'none', borderRadius: '4px' }}>📝 Generate</button>
          <button onClick={() => setActiveTab('optimize')} style={{ padding: '0.5rem 1rem', background: activeTab === 'optimize' ? '#667eea' : '#ccc', border: 'none', borderRadius: '4px' }}>✨ Optimize</button>
          <button onClick={() => setActiveTab('summarize')} style={{ padding: '0.5rem 1rem', background: activeTab === 'summarize' ? '#667eea' : '#ccc', border: 'none', borderRadius: '4px' }}>📊 Summarize</button>
        </div>
        <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder='Enter your text here...' rows={8} style={{ width: '100%', padding: '1rem', marginBottom: '1rem' }} />
        <button onClick={handleGenerate} disabled={isLoading} style={{ padding: '1rem 2rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem' }}>
          {isLoading ? '⏳ Processing...' : '🚀 Generate with AI'}
        </button>
        {outputText && <pre style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{outputText}</pre>}
      </div>
    </div>
  )
}
