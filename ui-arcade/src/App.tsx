import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom'
import { lazy, Suspense, useState, useEffect } from 'react'
import { useArcadeGame } from './hooks/useArcadeGame'
import { VimGolfScreen } from './components/VimGolfScreen'
import { loadCustomChallenges } from './engine/customChallenges'
import { useGoalGame } from './hooks/useGoalGame'
import type { VimTutorConfig } from './data/vimtutor'
import { Navbar } from './components/Navbar'
import { BUILTIN_CHALLENGES } from './engine/vimgolfChallenges'
import type { GoalModeConfig, HandicapConfig } from './engine/types'
import { HANDICAP_CONFIG_DEFAULTS } from './engine/types'
import { STORAGE_KEYS, loadStoredConfig } from './engine/storageKeys'

// Route screens are loaded on demand so the arcade shell stays small.
const SetupScreen = lazy(() =>
  import('./components/SetupScreen').then(m => ({ default: m.SetupScreen }))
)
const ArcadeGame = lazy(() =>
  import('./components/ArcadeGame').then(m => ({ default: m.ArcadeGame }))
)
const ResultsScreen = lazy(() =>
  import('./components/ResultsScreen').then(m => ({ default: m.ResultsScreen }))
)
const HighScoreScreen = lazy(() =>
  import('./components/HighScoreScreen').then(m => ({ default: m.HighScoreScreen }))
)
const SessionReviewScreen = lazy(() =>
  import('./components/SessionReviewScreen').then(m => ({ default: m.SessionReviewScreen }))
)
const VimGolfGame = lazy(() =>
  import('./components/VimGolfGame').then(m => ({ default: m.VimGolfGame }))
)
const GoalSetupScreen = lazy(() =>
  import('./components/GoalSetupScreen').then(m => ({ default: m.GoalSetupScreen }))
)
const GoalGame = lazy(() => import('./components/GoalGame').then(m => ({ default: m.GoalGame })))
const DevModeScreen = lazy(() =>
  import('./components/DevModeScreen').then(m => ({ default: m.DevModeScreen }))
)
const HelpVimGolfScreen = lazy(() =>
  import('./components/HelpVimGolfScreen').then(m => ({ default: m.HelpVimGolfScreen }))
)
const ModeSelectScreen = lazy(() =>
  import('./components/ModeSelectScreen').then(m => ({ default: m.ModeSelectScreen }))
)
const MotionRaceWrapper = lazy(() =>
  import('./components/MotionRaceGame').then(m => ({ default: m.MotionRaceWrapper }))
)
const QvimxWrapper = lazy(() =>
  import('./components/QvimxGame').then(m => ({ default: m.QvimxWrapper }))
)
const VimBotsWrapper = lazy(() =>
  import('./components/VimBotsGame').then(m => ({ default: m.VimBotsWrapper }))
)
const VimTutorScreen = lazy(() =>
  import('./components/VimTutorScreen').then(m => ({ default: m.VimTutorScreen }))
)
const VimTutorSetupScreen = lazy(() =>
  import('./components/VimTutorSetupScreen').then(m => ({ default: m.VimTutorSetupScreen }))
)
const PreferencesScreen = lazy(() =>
  import('./components/PreferencesScreen').then(m => ({ default: m.PreferencesScreen }))
)
const AppReadmeScreen = lazy(() =>
  import('./components/AppReadmeScreen').then(m => ({ default: m.AppReadmeScreen }))
)

function VimTutorWrapper({ onBack }: { onBack: () => void }) {
  const [config, setConfig] = useState<VimTutorConfig | null>(null)

  if (!config) {
    return <VimTutorSetupScreen onStart={setConfig} onBack={onBack} />
  }

  return (
    <VimTutorScreen
      config={config}
      onBack={() => {
        setConfig(null)
        onBack()
      }}
    />
  )
}
function VimGolfGameRoute() {
  const navigate = useNavigate()
  const location = useLocation()
  const { challengeId } = useParams<{ challengeId: string }>()

  const vimgolfHandicaps: HandicapConfig =
    loadStoredConfig<HandicapConfig>(STORAGE_KEYS.LAST_VIMGOLF_HANDICAPS) ??
    HANDICAP_CONFIG_DEFAULTS
  const challengeList: string[] = location.state?.challengeList || []
  const currentIndex = challengeList.indexOf(challengeId || '')
  const nextChallengeId =
    currentIndex >= 0 && currentIndex < challengeList.length - 1
      ? challengeList[currentIndex + 1]
      : null
  const prevChallengeId = currentIndex > 0 ? challengeList[currentIndex - 1] : null

  const challenge =
    BUILTIN_CHALLENGES.find(c => c.id === challengeId) ??
    loadCustomChallenges().find(c => c.id === challengeId)

  if (!challenge) return <Navigate to="/vimgolf" replace />

  return (
    <VimGolfGame
      key={challenge.id}
      challenge={challenge}
      handicaps={vimgolfHandicaps}
      onNext={
        nextChallengeId
          ? () => navigate(`/vimgolf/${nextChallengeId}`, { state: location.state })
          : undefined
      }
      onPrev={
        prevChallengeId
          ? () => navigate(`/vimgolf/${prevChallengeId}`, { state: location.state })
          : undefined
      }
      onQuit={() => navigate('/vimgolf')}
    />
  )
}

// This wrapper just manages setup-vs-game state without holding Monaco hooks
function GoalModeWrapper({ onBack }: { onBack: () => void }) {
  const [pendingConfig, setPendingConfig] = useState<GoalModeConfig | null>(null)

  if (!pendingConfig) {
    return <GoalSetupScreen onStart={setPendingConfig} onBack={onBack} />
  }

  return (
    <GoalGameContainer
      config={pendingConfig}
      onQuit={() => {
        setPendingConfig(null)
        onBack()
      }}
    />
  )
}

// This component mounts AFTER the setup is done, so when useGoalGame's Monaco
// init() effect fires the target <div> is already in the DOM.
function GoalGameContainer({ config, onQuit }: { config: GoalModeConfig; onQuit: () => void }) {
  const {
    state,
    currentChallenge,
    editorRef,
    statusRef,
    targetEditorRef,
    startGame,
    checkSolution,
    resetGame,
  } = useGoalGame()

  // Start the game as soon as this component mounts (config is already chosen)
  useEffect(() => {
    startGame(config)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <GoalGame
      state={state}
      currentChallenge={currentChallenge}
      editorRef={editorRef}
      statusRef={statusRef}
      targetEditorRef={targetEditorRef}
      onCheck={checkSolution}
      onSkip={() => {
        // Treat skip as a failed challenge — just call checkSolution which handles advancing
        checkSolution()
      }}
      onQuit={() => {
        resetGame()
        onQuit()
      }}
      onMarkUnsupported={() => {}}
    />
  )
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    state,
    lastConfig,
    reviewItems,
    startGame,
    onCommandExecuted,
    resetGame,
    updateSettings,
    markChallengeUnsupported,
  } = useArcadeGame()

  // Auto-navigate when the game engine transitions to results (e.g. survival
  // fails mid-tick or timed challenge expires) so the player isn't stuck on /play.
  useEffect(() => {
    if (state.status === 'results' && location.pathname === '/play') {
      navigate('/results', { replace: true })
    }
  }, [state.status, location.pathname, navigate])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Suspense fallback={null}>
          <Routes>
            <Route
              path="/"
              element={
                <ModeSelectScreen
                  onSelectArcade={() => navigate('/arcade')}
                  onSelectVimGolf={() => navigate('/vimgolf')}
                  onSelectGoal={() => navigate('/goal')}
                  onSelectMotionRace={() => navigate('/motion-race')}
                  onSelectQvimx={() => navigate('/qvimx')}
                  onSelectVimTutor={() => navigate('/vimtutor')}
                  onSelectVimBots={() => navigate('/vimbots')}
                />
              }
            />
            <Route
              path="/arcade"
              element={
                <SetupScreen
                  onStart={config => {
                    startGame(config)
                    navigate('/play')
                  }}
                  onHighScores={() => navigate('/high-scores')}
                  lastConfig={lastConfig}
                />
              }
            />
            <Route
              path="/play"
              element={
                state.status === 'setup' ? (
                  <Navigate to="/arcade" replace />
                ) : (
                  <ArcadeGame
                    state={state}
                    onCommandExecuted={onCommandExecuted}
                    onUpdateSettings={updateSettings}
                    onQuit={() => {
                      resetGame()
                      navigate('/')
                    }}
                    onMarkUnsupported={markChallengeUnsupported}
                  />
                )
              }
            />
            <Route
              path="/results"
              element={
                state.status !== 'results' ? (
                  <Navigate to="/" replace />
                ) : (
                  <ResultsScreen
                    state={state}
                    onRestart={() => {
                      resetGame()
                      navigate('/arcade')
                    }}
                    onHighScores={() => navigate('/high-scores')}
                    onReview={() => navigate('/review')}
                    reviewCount={reviewItems.length}
                  />
                )
              }
            />
            <Route
              path="/review"
              element={
                reviewItems.length === 0 ? (
                  <Navigate to="/" replace />
                ) : (
                  <SessionReviewScreen
                    items={reviewItems}
                    onDone={() => {
                      resetGame()
                      navigate('/')
                    }}
                  />
                )
              }
            />
            <Route path="/high-scores" element={<HighScoreScreen />} />
            <Route
              path="/vimgolf"
              element={
                <VimGolfScreen
                  onBack={() => navigate('/')}
                  onPlay={(c, list) =>
                    navigate(`/vimgolf/${c.id}`, { state: { challengeList: list.map(x => x.id) } })
                  }
                />
              }
            />
            <Route path="/vimgolf/:challengeId" element={<VimGolfGameRoute />} />
            <Route path="/goal" element={<GoalModeWrapper onBack={() => navigate('/')} />} />
            <Route
              path="/motion-race"
              element={<MotionRaceWrapper onBack={() => navigate('/')} />}
            />
            <Route path="/qvimx" element={<QvimxWrapper onBack={() => navigate('/')} />} />
            <Route
              path="/vimbots"
              element={
                <VimBotsWrapper
                  onBack={() => navigate('/')}
                  onViewHighScores={difficulty =>
                    navigate('/high-scores', { state: { tab: 'vimbots', vimbotsTab: difficulty } })
                  }
                />
              }
            />
            <Route path="/vimtutor" element={<VimTutorWrapper onBack={() => navigate('/')} />} />
            <Route path="/help" element={<DevModeScreen onBack={() => navigate('/')} />} />
            <Route path="/help/readme" element={<AppReadmeScreen />} />
            <Route path="/help/vimgolf" element={<HelpVimGolfScreen />} />
            <Route path="/dev" element={<Navigate to="/help" replace />} />
            <Route path="/dev/readme" element={<Navigate to="/help/readme" replace />} />
            <Route path="/preferences" element={<PreferencesScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default App
