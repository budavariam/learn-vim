import React from 'react'
import { Gamepad2, Target, Footprints, Icon } from 'lucide-react'
import { golfDriver } from '@lucide/lab'
import { Crosshair } from 'lucide-react'

function GolfIcon(props: React.ComponentProps<typeof Gamepad2>) {
  return <Icon iconNode={golfDriver} {...props} />
}

interface ModeSelectScreenProps {
  onSelectArcade: () => void
  onSelectVimGolf: () => void
  onSelectGoal: () => void
  onSelectMotionRace: () => void
  onSelectQvimx: () => void
}

interface ModeCard {
  icon: React.ElementType
  name: string
  tagline: string
  onClick: () => void
}

export function ModeSelectScreen({
  onSelectArcade,
  onSelectVimGolf,
  onSelectGoal,
  onSelectMotionRace,
  onSelectQvimx,
}: ModeSelectScreenProps) {
  // Row 1: Arcade alone (full-width)
  // Row 2: VimGolf | Goal
  // Row 3: Motion Race | QVIMX
  const row1: ModeCard[] = [
    {
      icon: Gamepad2,
      name: 'Arcade Mode',
      tagline: 'Race the clock — score points for every vim command',
      onClick: onSelectArcade,
    },
  ]

  const row2: ModeCard[] = [
    {
      icon: GolfIcon,
      name: 'VimGolf',
      tagline: 'Fewest keystrokes wins — transform text, pure efficiency',
      onClick: onSelectVimGolf,
    },
    {
      icon: Target,
      name: 'Goal Mode',
      tagline: 'Transform text under time pressure — real editing challenges',
      onClick: onSelectGoal,
    },
  ]

  const row3: ModeCard[] = [
    {
      icon: Footprints,
      name: 'Motion Race',
      tagline: 'Navigate to highlighted positions — pure vim movement, no editing',
      onClick: onSelectMotionRace,
    },
    {
      icon: Crosshair,
      name: 'QVIMX',
      tagline: 'Claim territory with vim motions — avoid the balls, beat the AI',
      onClick: onSelectQvimx,
    },
  ]

  function ModeButton({ card, fullWidth }: { card: ModeCard; fullWidth?: boolean }) {
    return (
      <button
        key={card.name}
        onClick={card.onClick}
        className={`bg-gray-800 border border-gray-700 hover:border-green-500 rounded-xl p-6 text-left transition-all hover:bg-gray-800/80 focus:outline-none focus:border-green-500 ${fullWidth ? 'w-full' : ''}`}
      >
        <card.icon className="w-10 h-10 mb-3 text-gray-300" />
        <div className="font-mono font-bold text-white text-lg mb-1">{card.name}</div>
        <div className="font-mono text-gray-400 text-sm leading-snug">{card.tagline}</div>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white font-mono mb-2">VIM ARCADE</h1>
          <p className="text-gray-400 font-mono text-sm">Choose your mode</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Row 1 — Arcade (full width) */}
          <div>
            {row1.map(c => (
              <ModeButton key={c.name} card={c} fullWidth />
            ))}
          </div>

          {/* Row 2 — VimGolf + Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {row2.map(c => (
              <ModeButton key={c.name} card={c} />
            ))}
          </div>

          {/* Row 3 — Motion Race + QVIMX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {row3.map(c => (
              <ModeButton key={c.name} card={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
