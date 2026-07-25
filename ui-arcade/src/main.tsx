import './monacoSetup' // workers must be registered before monaco-editor loads
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import './enemy-trails.scss'
import 'monaco-editor/min/vs/editor/editor.main.css'
import { loadAndMergeDefaults } from './engine/UnsupportedEngine'
import { migrateStorage } from './engine/storageKeys'

// StrictMode is intentionally omitted: it double-invokes effects and disposes
// the Monaco editor mid-init, which fires unhandled "Canceled" promise
// rejections from Monaco internals (wordHighlighter async tasks) and can leave
// the editor in a broken state.

interface EBState {
  error: Error | null
}

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, EBState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): EBState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[AppErrorBoundary] Uncaught render error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            background: '#0d1117',
            color: '#f0f6fc',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Something went wrong</h1>
          <p
            style={{
              color: '#ef4444',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              maxWidth: '40rem',
            }}
          >
            {this.state.error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#22c55e',
              color: '#fff',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

migrateStorage()
loadAndMergeDefaults().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <AppErrorBoundary>
      <BrowserRouter basename="/learn-vim/arcade">
        <App />
      </BrowserRouter>
    </AppErrorBoundary>
  )
})
