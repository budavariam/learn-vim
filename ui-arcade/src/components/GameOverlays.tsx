import { useState, useEffect } from 'react'
import type React from 'react'

// ── SnowOverlay ───────────────────────────────────────────────────────────────

export function SnowOverlay() {
  const [flakes] = useState(() =>
    Array.from({ length: 25 }, (_, i) => {
      const left = Math.floor(Math.random() * 100)
      const duration = 8 + Math.random() * 8
      const delay = -(Math.random() * 16)
      const fontSize = 10 + Math.floor(Math.random() * 5)
      const opacity = 0.4 + Math.random() * 0.4
      const char = Math.random() > 0.5 ? '❄' : '*'
      return { i, left, duration, delay, fontSize, opacity, char }
    })
  )

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      {flakes.map(f => (
        <span
          key={f.i}
          className="snow-flake"
          style={{
            left: `${f.left}%`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            fontSize: `${f.fontSize}px`,
            opacity: f.opacity,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {f.char}
        </span>
      ))}
    </div>
  )
}

// ── OpacityFadeOverlay ────────────────────────────────────────────────────────

export interface OpacityFadeOverlayProps {
  cursorLine: number
  getVisibleRange: () => { startLine: number; endLine: number } | null
}

export function OpacityFadeOverlay({ cursorLine, getVisibleRange }: OpacityFadeOverlayProps) {
  let currentPct = 50
  const range = getVisibleRange()
  if (range) {
    const visibleLines = Math.max(1, range.endLine - range.startLine)
    currentPct = Math.round(((cursorLine - range.startLine) / visibleLines) * 100)
    currentPct = Math.max(0, Math.min(100, currentPct))
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 3,
        background: `radial-gradient(ellipse 80% 40% at 50% ${currentPct}%, transparent 0%, rgba(0,0,0,0.75) 100%)`,
      }}
    />
  )
}

// ── ConfettiOverlay ───────────────────────────────────────────────────────────
// Motion Race specific — only kept here to co-locate visual effects.

const CONFETTI_COLORS = [
  '#f43f5e',
  '#fb923c',
  '#fbbf24',
  '#4ade80',
  '#60a5fa',
  '#c084fc',
  '#f472b6',
]

export interface ConfettiOverlayProps {
  isActive: boolean
  onDone: () => void
}

export function ConfettiOverlay({ isActive, onDone }: ConfettiOverlayProps) {
  useEffect(() => {
    if (!isActive) return
    const id = setTimeout(onDone, 1500)
    return () => clearTimeout(id)
  }, [isActive, onDone])

  if (!isActive) return null

  const pieces = Array.from({ length: 30 }, (_, i) => {
    const left = Math.floor(Math.random() * 100)
    const top = Math.floor(Math.random() * 60)
    const rotation = Math.floor(Math.random() * 360)
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
    const delay = Math.random() * 0.3
    return { i, left, top, rotation, color, delay }
  })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 6,
        overflow: 'hidden',
      }}
    >
      {pieces.map(p => (
        <div
          key={p.i}
          style={
            {
              position: 'absolute',
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: '4px',
              height: '8px',
              background: p.color,
              '--r': `${p.rotation}deg`,
              animation: `confetti-fall 1.5s ease-out ${p.delay}s forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

// ── PenaltyFlash ──────────────────────────────────────────────────────────────
// Motion Race specific — red flash when an enemy scores.

export interface PenaltyFlashProps {
  isActive: boolean
}

export function PenaltyFlash({ isActive }: PenaltyFlashProps) {
  if (!isActive) return null
  return (
    <div
      className="penalty-flash-anim"
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(220, 38, 38, 0.45)',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    />
  )
}
