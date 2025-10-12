import { HashRouter, Routes, Route } from 'react-router-dom';
import QuizGame from './components/QuizGame';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<QuizGame />} />
                <Route path="/mode/:mode" element={<QuizGame />} />
                <Route path="/play/:mode" element={<QuizGame />} />
                <Route path="/results/:mode" element={<QuizGame />} />
                <Route path="/review/:mode" element={<QuizGame />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
