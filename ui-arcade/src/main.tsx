import './monacoSetup'  // workers must be registered before monaco-editor loads
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import 'monaco-editor/min/vs/editor/editor.main.css'
import { loadAndMergeDefaults } from './engine/UnsupportedEngine'

// StrictMode is intentionally omitted: it double-invokes effects and disposes
// the Monaco editor mid-init, which fires unhandled "Canceled" promise
// rejections from Monaco internals (wordHighlighter async tasks) and can leave
// the editor in a broken state.

// Merge the maintainer-curated unsupported defaults before the first render so
// every component reads an up-to-date localStorage from the start.
loadAndMergeDefaults().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename="/learn-vim/arcade">
      <App />
    </BrowserRouter>,
  )
})
