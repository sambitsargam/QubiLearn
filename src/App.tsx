import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import AIChat from './components/AIChat';
import Home from './pages/Home';
import CoursesPage from './pages/CoursesPage';
import CoursePage from './pages/CoursePage';
import CodeLab from './pages/CodeLab';
import AIAnalyzer from './pages/AIAnalyzer';
import QubiBuilderPage from './pages/QubiBuilderPage';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/course/:courseId" element={<CoursePage />} />
              <Route path="/code-lab" element={<CodeLab />} />
              <Route path="/ai-analyzer" element={<AIAnalyzer />} />
              <Route path="/qubibuilder" element={<QubiBuilderPage />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <AIChat />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;