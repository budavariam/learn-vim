import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

export function mount(root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
