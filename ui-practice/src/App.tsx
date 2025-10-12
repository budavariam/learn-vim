import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuizGame from './components/QuizGame';

function App() {
    return (
        <BrowserRouter basename="/learn-vim/game">
            <Routes>
                <Route path="/" element={<QuizGame />} />
                <Route path="/mode/:mode" element={<QuizGame />} />
                <Route path="/play/:mode" element={<QuizGame />} />
                <Route path="/results/:mode" element={<QuizGame />} />
                <Route path="/review/:mode" element={<QuizGame />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
