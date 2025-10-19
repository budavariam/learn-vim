import { HashRouter, Routes, Route } from 'react-router-dom';
import QuizGame from './components/QuizGame';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<QuizGame />} />
        <Route path="/mode/:gameMode" element={<QuizGame />} />
        <Route path="/mode/:gameMode/:questionCount" element={<QuizGame />} />
        <Route path="/play/:gameMode" element={<QuizGame />} />
        <Route path="/play/:gameMode/:questionCount" element={<QuizGame />} />
        <Route path="/results/:gameMode" element={<QuizGame />} />
        <Route path="/review/:gameMode" element={<QuizGame />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
