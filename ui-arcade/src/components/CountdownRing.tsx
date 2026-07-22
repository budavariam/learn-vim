import { useEffect, useRef, useState } from 'react'

interface CountdownRingProps {
  startedAt: number
  timeLimit: number
  size?: number
}

export function CountdownRing({ startedAt, timeLimit, size = 44 }: CountdownRingProps) {
  const [progress, setProgress] = useState(1)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startedAt
      const p = Math.max(0, 1 - elapsed / timeLimit)
      setProgress(p)
      if (p > 0) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [startedAt, timeLimit])

  const radius = (size - 4) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  const color = progress > 0.5 ? '#22c55e' : progress > 0.25 ? '#f59e0b' : '#ef4444'
  const secondsLeft = Math.ceil(Math.max(0, (timeLimit - (Date.now() - startedAt)) / 1000))

  return (
    <svg width={size} height={size} className="flex-shrink-0 -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#374151"
        strokeWidth={3}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'stroke 0.3s' }}
      />
      {/* Text (counter-rotate to read correctly) */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={size * 0.28}
        className="rotate-90 font-mono"
        transform={`rotate(90, ${size / 2}, ${size / 2})`}
        style={{ fontFamily: 'monospace' }}
      >
        {secondsLeft}
      </text>
    </svg>
  )
}
