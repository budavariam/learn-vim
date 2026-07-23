interface ModeSelectScreenProps {
  onSelectArcade:      () => void
  onSelectVimGolf:     () => void
  onSelectGoal:        () => void
  onSelectMotionRace:  () => void
  onSelectDev:         () => void
  onHighScores:        () => void
}

interface ModeCard {
  icon:    string
  name:    string
  tagline: string
  onClick: () => void
}

export function ModeSelectScreen({
  onSelectArcade,
  onSelectVimGolf,
  onSelectGoal,
  onSelectMotionRace,
  onSelectDev,
  onHighScores,
}: ModeSelectScreenProps) {
  const cards: ModeCard[] = [
    {
      icon:    '🎮',
      name:    'Arcade Mode',
      tagline: 'Race the clock — score points for every vim command',
      onClick: onSelectArcade,
    },
    {
      icon:    '⛳',
      name:    'VimGolf',
      tagline: 'Fewest keystrokes wins — transform text, pure efficiency',
      onClick: onSelectVimGolf,
    },
    {
      icon:    '🎯',
      name:    'Goal Mode',
      tagline: 'Transform text under time pressure — real editing challenges',
      onClick: onSelectGoal,
    },
    {
      icon:    '🏃',
      name:    'Motion Race',
      tagline: 'Navigate to highlighted positions — pure vim movement, no editing',
      onClick: onSelectMotionRace,
    },
    {
      icon:    '🔬',
      name:    'Dev Mode',
      tagline: 'Test and debug command detection',
      onClick: onSelectDev,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white font-mono mb-2">VIM ARCADE</h1>
          <p className="text-gray-400 font-mono text-sm">Choose your mode</p>
        </div>

        {/* Mode cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map(card => (
            <button
              key={card.name}
              onClick={card.onClick}
              className="bg-gray-800 border border-gray-700 hover:border-green-500 rounded-xl p-6 text-left transition-all hover:bg-gray-800/80 focus:outline-none focus:border-green-500"
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <div className="font-mono font-bold text-white text-lg mb-1">{card.name}</div>
              <div className="font-mono text-gray-400 text-sm leading-snug">{card.tagline}</div>
            </button>
          ))}
        </div>

        {/* High Scores link */}
        <div className="mt-8 text-center">
          <button
            onClick={onHighScores}
            className="font-mono text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            High Scores →
          </button>
        </div>
      </div>
    </div>
  )
}
