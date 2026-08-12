'use client'

import { useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!inputText.trim()) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputText,
          mode: activeTab,
        }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setOutputText(data.result)
      }
    } catch (err) {
      setError('Failed to connect to AI service. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    alert('Copied to clipboard!')
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>✨ AI Writing Assistant</h1>
        <p className={styles.subtitle}>Powered by OpenAI | Build Beyond Hackathon 2026</p>
      </header>

      <main className={styles.main}>
        <div className={styles.tabs}>
          <button 
            className={${styles.tab} } 
            onClick={() => setActiveTab('generate')}
          >
            📝 Generate
          </button>
          <button 
            className={${styles.tab} } 
            onClick={() => setActiveTab('optimize')}
          >
            ✨ Optimize
          </button>
          <button 
            className={${styles.tab} } 
            onClick={() => setActiveTab('summarize')}
          >
            📊 Summarize
          </button>
        </div>

        <div className={styles.inputSection}>
          <textarea
            className={styles.textarea}
            placeholder={Enter your text here... ( mode)}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
          />
          <button 
            className={styles.button} 
            onClick={handleGenerate} 
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? '⏳ AI is thinking...' : '🚀 Generate with AI'}
          </button>
        </div>

        {error && (
          <div className={styles.errorBox}>
            ❌ {error}
          </div>
        )}

        {outputText && (
          <div className={styles.outputSection}>
            <h3 className={styles.outputTitle}>✨ AI Result:</h3>
            <div className={styles.outputBox}>
              <pre className={styles.outputText}>{outputText}</pre>
            </div>
            <button className={styles.copyButton} onClick={handleCopy}>
              📋 Copy to Clipboard
            </button>
          </div>
        )}

        <div className={styles.infoBox}>
          <p>💡 <strong>Tip:</strong> This uses real AI (GPT-3.5) - costs about .001 per generation!</p>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Built with ❤️ for Build Beyond Hackathon 2026</p>
        <p>Deadline: August 15, 2026 | Prize: </p>
      </footer>
    </div>
  )
}
