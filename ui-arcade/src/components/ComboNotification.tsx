import { useEffect, useState, useRef } from 'react'
import type React from 'react'
import type { Notification } from '../engine/types'
import { Zap, Rocket, Check, Skull, Flame, TrendingUp } from 'lucide-react'

interface ComboNotificationProps {
  notifications: Notification[]
}

const TYPE_STYLES: Record<string, { bg: string; icon: React.ElementType | null }> = {
  lightning: { bg: 'bg-yellow-400 text-black', icon: Zap },
  fast: { bg: 'bg-blue-500 text-white', icon: Rocket },
  good: { bg: 'bg-green-600 text-white', icon: Check },
  completed: { bg: 'bg-gray-600 text-white', icon: Check },
  failed: { bg: 'bg-red-700 text-white', icon: Skull },
  combo: { bg: 'bg-purple-600 text-white', icon: Flame },
  levelup: { bg: 'bg-cyan-400 text-black', icon: TrendingUp },
}

type ToastState = Notification & { exiting: boolean }

export function ComboNotification({ notifications }: ComboNotificationProps) {
  const [toasts, setToasts] = useState<ToastState[]>([])
  const seenIds = useRef(new Set<string>())

  useEffect(() => {
    const incoming = notifications.filter(n => !seenIds.current.has(n.id))
    if (incoming.length === 0) return
    incoming.forEach(n => seenIds.current.add(n.id))
    setToasts(prev => [...prev, ...incoming.map(n => ({ ...n, exiting: false }))])
  }, [notifications])

  useEffect(() => {
    if (toasts.length === 0) return
    const earliest = Math.min(...toasts.map(t => t.expiresAt))
    const delay = earliest - Date.now()
    const id = setTimeout(
      () => {
        const now = Date.now()
        setToasts(prev => prev.map(t => (t.expiresAt <= now ? { ...t, exiting: true } : t)))
        setTimeout(() => {
          setToasts(prev => prev.filter(t => !t.exiting))
        }, 250)
      },
      Math.max(0, delay)
    )
    return () => clearTimeout(id)
  }, [toasts])

  const levelUps = toasts.filter(t => t.type === 'levelup')
  const regular = toasts.filter(t => t.type !== 'levelup')

  return (
    <>
      {regular.length > 0 && (
        <div
          className="fixed top-4 right-4 flex flex-col gap-2 pointer-events-none z-50"
          aria-live="polite"
          aria-atomic="false"
        >
          {regular.map(t => {
            const style = TYPE_STYLES[t.type] ?? { bg: 'bg-gray-700 text-white', icon: null }
            const Icon = style.icon
            return (
              <div
                key={t.id}
                className={`px-3 py-2 rounded-lg font-mono font-bold text-sm shadow-xl flex items-center gap-1.5 ${style.bg} ${
                  t.exiting ? 'toast-exit' : 'toast-enter'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                <span>{t.text}</span>
              </div>
            )
          })}
        </div>
      )}

      {levelUps.map(t => (
        <div
          key={t.id}
          aria-live="assertive"
          aria-atomic="true"
          className={`fixed top-1/4 left-1/2 -translate-x-1/2 z-50 pointer-events-none levelup-banner ${
            t.exiting ? 'opacity-0 transition-opacity duration-300' : ''
          }`}
        >
          <div className="bg-cyan-400 text-black font-mono font-extrabold text-2xl px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-2">
            <TrendingUp className="w-7 h-7" />
            {t.text}
          </div>
        </div>
      ))}
    </>
  )
}
