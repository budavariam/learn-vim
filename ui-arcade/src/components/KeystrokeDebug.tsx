import { useRef, useEffect } from 'react'

interface KeystrokeDebugProps {
  log: string
}

export function KeystrokeDebug({ log }: KeystrokeDebugProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep the newest characters visible by scrolling the container to the right
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [log])

  if (!log) return null

  return (
    <div
      className="fixed bottom-2 right-2 pointer-events-none select-none z-40"
      style={{ maxWidth: '45vw' }}
    >
      <div
        ref={scrollRef}
        className="overflow-hidden whitespace-nowrap font-mono text-xs"
        style={{ color: 'rgba(148,163,184,0.35)' /* slate-300 at 35% */ }}
      >
        {log}
      </div>
    </div>
  )
}
