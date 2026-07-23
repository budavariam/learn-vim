import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useArcadeGame } from './hooks/useArcadeGame'
import { SetupScreen } from './components/SetupScreen'
import { ArcadeGame } from './components/ArcadeGame'
import { ResultsScreen } from './components/ResultsScreen'
import { HighScoreScreen } from './components/HighScoreScreen'
import { SessionReviewScreen } from './components/SessionReviewScreen'
import { VimGolfScreen, loadCustomChallenges } from './components/VimGolfScreen'
import { VimGolfGame } from './components/VimGolfGame'
import { GoalSetupScreen } from './components/GoalSetupScreen'
import { GoalGame } from './components/GoalGame'
import { useGoalGame } from './hooks/useGoalGame'
import { DevModeScreen } from './components/DevModeScreen'
import { ModeSelectScreen } from './components/ModeSelectScreen'
import { MotionRaceWrapper } from './components/MotionRaceGame'
import { BUILTIN_CHALLENGES } from './engine/vimgolfChallenges'
import type { GoalModeConfig } from './engine/types'

function VimGolfGameRoute() {
  const navigate = useNavigate()
  const { challengeId } = useParams<{ challengeId: string }>()

  const challenge =
    BUILTIN_CHALLENGES.find(c => c.id === challengeId) ??
    loadCustomChallenges().find(c => c.id === challengeId)

  if (!challenge) return <Navigate to="/vimgolf" replace />

  return (
    <VimGolfGame
      challenge={challenge}
      onBack={() => navigate('/vimgolf')}
    />
  )
}

// This wrapper just manages setup-vs-game state without holding Monaco hooks
function GoalModeWrapper({ onBack }: { onBack: () => void }) {
  const [pendingConfig, setPendingConfig] = useState<GoalModeConfig | null>(null)

  if (!pendingConfig) {
    return (
      <GoalSetupScreen
        onStart={setPendingConfig}
        onBack={onBack}
      />
    )
  }

  return (
    <GoalGameContainer
      config={pendingConfig}
      onQuit={() => { setPendingConfig(null); onBack() }}
    />
  )
}

// This component mounts AFTER the setup is done, so when useGoalGame's Monaco
// init() effect fires the target <div> is already in the DOM.
function GoalGameContainer({ config, onQuit }: { config: GoalModeConfig; onQuit: () => void }) {
  const { state, currentChallenge, editorRef, statusRef, targetEditorRef, startGame, checkSolution, resetGame } = useGoalGame()

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
      onQuit={() => { resetGame(); onQuit() }}
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
    highScores,
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
    <Routes>
      <Route
        path="/"
        element={
          <ModeSelectScreen
            onSelectArcade={() => navigate('/arcade')}
            onSelectVimGolf={() => navigate('/vimgolf')}
            onSelectGoal={() => navigate('/goal')}
            onSelectMotionRace={() => navigate('/motion-race')}
            onSelectDev={() => navigate('/dev')}
            onHighScores={() => navigate('/high-scores')}
          />
        }
      />
      <Route
        path="/arcade"
        element={
          <SetupScreen
            onStart={config => { startGame(config); navigate('/play') }}
            onHighScores={() => navigate('/high-scores')}
            lastConfig={lastConfig}
          />
        }
      />
      <Route
        path="/play"
        element={
          state.status === 'setup'
            ? <Navigate to="/arcade" replace />
            : <ArcadeGame
                state={state}
                onCommandExecuted={onCommandExecuted}
                onUpdateSettings={updateSettings}
                onQuit={() => { resetGame(); navigate('/') }}
                onMarkUnsupported={markChallengeUnsupported}
              />
        }
      />
      <Route
        path="/results"
        element={
          state.status !== 'results'
            ? <Navigate to="/" replace />
            : <ResultsScreen
                state={state}
                onRestart={() => { resetGame(); navigate('/arcade') }}
                onHighScores={() => navigate('/high-scores')}
                onReview={() => navigate('/review')}
                reviewCount={reviewItems.length}
              />
        }
      />
      <Route
        path="/review"
        element={
          reviewItems.length === 0
            ? <Navigate to="/" replace />
            : <SessionReviewScreen
                items={reviewItems}
                onDone={() => { resetGame(); navigate('/') }}
              />
        }
      />
      <Route
        path="/high-scores"
        element={<HighScoreScreen scores={highScores} onClose={() => navigate(-1)} />}
      />
      <Route
        path="/vimgolf"
        element={
          <VimGolfScreen
            onBack={() => navigate('/')}
            onPlay={c => navigate(`/vimgolf/${c.id}`)}
          />
        }
      />
      <Route
        path="/vimgolf/:challengeId"
        element={<VimGolfGameRoute />}
      />
      <Route
        path="/goal"
        element={<GoalModeWrapper onBack={() => navigate('/')} />}
      />
      <Route
        path="/motion-race"
        element={<MotionRaceWrapper onBack={() => navigate('/')} />}
      />
      <Route
        path="/dev"
        element={<DevModeScreen onBack={() => navigate('/')} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
