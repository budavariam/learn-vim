import { useEffect, useState, useRef } from 'react'
import type { Notification } from '../engine/types'

interface ComboNotificationProps {
  notifications: Notification[]
}

const TYPE_STYLES: Record<string, { bg: string; icon: string }> = {
  lightning: { bg: 'bg-yellow-400 text-black',   icon: '⚡' },
  fast:      { bg: 'bg-blue-500 text-white',      icon: '🚀' },
  good:      { bg: 'bg-green-600 text-white',     icon: '✓'  },
  completed: { bg: 'bg-gray-600 text-white',      icon: '✓'  },
  failed:    { bg: 'bg-red-700 text-white',       icon: '💀' },
  combo:     { bg: 'bg-purple-600 text-white',    icon: '🔥' },
  levelup:   { bg: 'bg-cyan-400 text-black',      icon: '🆙' },
}

type ToastState = Notification & { exiting: boolean }

export function ComboNotification({ notifications }: ComboNotificationProps) {
  const [toasts, setToasts] = useState<ToastState[]>([])
  const seenIds = useRef(new Set<string>())

  useEffect(() => {
    const now = Date.now()
    const live = notifications.filter(n => n.expiresAt > now)

    // Add new toasts
    const incoming = live.filter(n => !seenIds.current.has(n.id))
    if (incoming.length === 0) return

    setToasts(prev => {
      const next = [...prev]
      for (const n of incoming) {
        seenIds.current.add(n.id)
        next.push({ ...n, exiting: false })
      }
      // Keep at most 6
      return next.slice(-6)
    })
  }, [notifications])

  // Auto-remove expired toasts
  useEffect(() => {
    if (toasts.length === 0) return
    const earliest = Math.min(...toasts.map(t => t.expiresAt))
    const delay = earliest - Date.now()
    const id = setTimeout(() => {
      const now = Date.now()
      setToasts(prev => prev.map(t =>
        t.expiresAt <= now ? { ...t, exiting: true } : t
      ))
      // Remove after exit animation
      setTimeout(() => {
        setToasts(prev => prev.filter(t => !t.exiting))
      }, 250)
    }, Math.max(0, delay))
    return () => clearTimeout(id)
  }, [toasts])

  // Level-up toasts shown separately in the centre
  const levelUps = toasts.filter(t => t.type === 'levelup')
  const regular  = toasts.filter(t => t.type !== 'levelup')

  return (
    <>
      {/* Regular toasts — top-right stack */}
      {regular.length > 0 && (
        <div className="fixed top-4 right-4 flex flex-col gap-2 pointer-events-none z-50" aria-live="polite" aria-atomic="false">
          {regular.map(t => {
            const style = TYPE_STYLES[t.type] ?? { bg: 'bg-gray-700 text-white', icon: '' }
            return (
              <div
                key={t.id}
                className={`px-3 py-2 rounded-lg font-mono font-bold text-sm shadow-xl flex items-center gap-1.5 ${style.bg} ${
                  t.exiting ? 'toast-exit' : 'toast-enter'
                }`}
              >
                {style.icon && <span>{style.icon}</span>}
                <span>{t.text}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Level-up banner — centred */}
      {levelUps.map(t => (
        <div
          key={t.id}
          aria-live="assertive"
          aria-atomic="true"
          className={`fixed top-1/4 left-1/2 -translate-x-1/2 z-50 pointer-events-none levelup-banner ${
            t.exiting ? 'opacity-0 transition-opacity duration-300' : ''
          }`}
        >
          <div className="bg-cyan-400 text-black font-mono font-extrabold text-2xl px-8 py-4 rounded-2xl shadow-2xl">
            🆙 {t.text}
          </div>
        </div>
      ))}
    </>
  )
}
