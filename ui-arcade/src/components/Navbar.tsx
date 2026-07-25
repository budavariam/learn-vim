import { useNavigate, useLocation } from 'react-router-dom'
import { Trophy, Settings, HelpCircle } from 'lucide-react'

const HELP_TABS = [
  { path: '/dev', label: 'Dev Mode' },
  { path: '/dev/readme', label: 'Readme' },
]

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const onHelp = isActive('/dev')

  const iconBtn = (path: string, active: string, idle: string) =>
    `px-2 py-1 rounded text-xs font-mono transition-colors ${isActive(path) ? active : idle}`

  return (
    <header className="flex-shrink-0 bg-gray-900 border-b border-gray-700 z-50">
      <div className="px-4 h-11 flex items-center gap-2 font-mono">
        {/* Home */}
        <button
          onClick={() => navigate('/')}
          className="font-bold text-white text-sm tracking-tight hover:text-green-400 transition-colors flex-shrink-0"
        >
          VIM ARCADE
        </button>

        {/* Help sub-tabs — shown when on any /dev route */}
        {onHelp && (
          <div className="flex items-center gap-0.5 ml-2">
            {HELP_TABS.map(tab => {
              const active = location.pathname === tab.path
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`px-2.5 py-1 text-xs font-mono transition-colors border-b-2 ${
                    active
                      ? 'border-blue-400 text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        )}

        <span className="flex-1" />

        {/* High Scores */}
        <button
          onClick={() => navigate('/high-scores')}
          className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
            isActive('/high-scores')
              ? 'bg-yellow-700/40 text-yellow-300 border border-yellow-700'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Trophy className="w-4 h-4" />
        </button>

        {/* Preferences */}
        <button
          onClick={() => navigate('/preferences')}
          className={iconBtn(
            '/preferences',
            'text-gray-300 bg-gray-700',
            'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
          )}
          title="Preferences"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Help — deemphasized */}
        <button
          onClick={() => navigate('/dev')}
          className={iconBtn(
            '/dev',
            'text-gray-300 bg-gray-700',
            'text-gray-600 hover:text-gray-400 hover:bg-gray-800'
          )}
        >
          <HelpCircle className="w-3.5 h-3.5 inline mr-1" />
          Help
        </button>
      </div>
    </header>
  )
}
