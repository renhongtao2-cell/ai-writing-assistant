'use client'

import { useState } from 'react'

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text')
      return
    }
    
    setIsLoading(true)
    setError('')
    setOutputText('')
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputText, mode: activeTab }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setOutputText(data.result)
      }
    } catch (err) {
      setError('Failed to connect to AI service')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    alert('Copied to clipboard!')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>✨ AI Writing Assistant</h1>
        <p style={{ color: 'white', textAlign: 'center', marginBottom: '2rem' }}>Powered by OpenAI | Build Beyond Hackathon 2026</p>
        
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => setActiveTab('generate')}
              style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', background: activeTab === 'generate' ? '#667eea' : '#e0e0e0', color: activeTab === 'generate' ? 'white' : '#333' }}
            >📝 Generate</button>
            <button 
              onClick={() => setActiveTab('optimize')}
              style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', background: activeTab === 'optimize' ? '#667eea' : '#e0e0e0', color: activeTab === 'optimize' ? 'white' : '#333' }}
            >✨ Optimize</button>
            <button 
              onClick={() => setActiveTab('summarize')}
              style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', background: activeTab === 'summarize' ? '#667eea' : '#e0e0e0', color: activeTab === 'summarize' ? 'white' : '#333' }}
            >📊 Summarize</button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Enter your text here... (${activeTab} mode)`}
            rows={8}
            style={{ width: '100%', padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', marginBottom: '1rem' }}
          />
          
          {error && (
            <div style={{ background: '#fee', border: '1px solid #fc6', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', color: '#c00' }}>
              ❌ {error}
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
            {isLoading ? '⏳ AI is thinking...' : '🚀 Generate with AI'}
          </button>

          {outputText && (
            <div style={{ marginTop: '1.5rem', background: '#f8f9fa', borderRadius: '8px', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>✨ AI Result:</h3>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.95rem', lineHeight: '1.6', color: '#444', marginBottom: '1rem' }}>{outputText}</pre>
              <button 
                onClick={handleCopy}
                style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                📋 Copy to Clipboard
              </button>
            </div>
          )}

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#e7f3ff', borderRadius: '8px', fontSize: '0.9rem', color: '#0056b3' }}>
            💡 <strong>Tip:</strong> This uses real AI (GPT-3.5) - costs about $0.001 per generation!
          </div>
        </div>

        <footer style={{ textAlign: 'center', color: 'white', marginTop: '2rem', opacity: '0.9' }}>
          <p>Built with ❤️ for Build Beyond Hackathon 2026</p>
          <p>Deadline: August 15, 2026 | Prize: $500</p>
        </footer>
      </div>
    </div>
  )
}
