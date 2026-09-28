import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/Home/HomePage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { CreateQuizPage } from './pages/Quiz/CreateQuizPage';
import { EditQuizPage } from './pages/Quiz/EditQuizPage';
import { AttemptQuizPage } from './pages/Attempt/AttemptQuizPage';
import { ResultPage } from './pages/Attempt/ResultPage';
import { SearchPage } from './pages/Search/SearchPage';
import { LeaderboardPage } from './pages/Leaderboard/LeaderboardPage';
import { AttemptHistoryPage } from './pages/History/AttemptHistoryPage';
import { HelpPage } from './pages/Help/HelpPage';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/quiz/:shareCode" element={<SearchPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-quiz"
              element={
                <ProtectedRoute>
                  <CreateQuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-quiz/:id"
              element={
                <ProtectedRoute>
                  <EditQuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attempt/:quizId"
              element={
                <ProtectedRoute>
                  <AttemptQuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result/:attemptId"
              element={
                <ProtectedRoute>
                  <ResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard/:quizId"
              element={
                <ProtectedRoute>
                  <LeaderboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <AttemptHistoryPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
