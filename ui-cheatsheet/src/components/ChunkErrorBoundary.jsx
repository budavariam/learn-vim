import { Component } from 'react'

// Lazy modals can fail to load (e.g. a new deploy replaced the chunk). Without a boundary
// that error would unmount the whole page, so show a small notice instead.
export default class ChunkErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('Failed to load a lazy chunk', error)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-lg dark:border-red-700 dark:bg-gray-800 dark:text-gray-100">
        Could not load this view.{' '}
        <button className="underline" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    )
  }
}
