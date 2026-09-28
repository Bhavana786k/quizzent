import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchService } from '../../services/searchService';
import { SearchBar } from '../../components/SearchBar';
import { QuizCard } from '../../components/QuizCard';
import { PasscodeModal } from '../../components/PasscodeModal';

export const SearchPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrivateQuiz, setSelectedPrivateQuiz] = useState(null);
  const navigate = useNavigate();

  const handleSearchChange = async ({ query, category, tag }) => {
    setLoading(true);
    try {
      const res = await searchService.searchQuizzes({
        q: query,
        category,
        tag,
        page: 0,
        size: 20,
      });
      setQuizzes(res.data.content || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAttempt = (quiz) => {
    if (quiz.visibility === 'PRIVATE' && quiz.privateAccessType === 'LINK_PASSCODE') {
      setSelectedPrivateQuiz(quiz);
    } else {
      navigate(`/attempt/${quiz.id}`);
    }
  };

  const handlePasscodeSubmit = (passcode) => {
    if (selectedPrivateQuiz) {
      navigate(`/attempt/${selectedPrivateQuiz.id}?passcode=${encodeURIComponent(passcode)}`);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Explore & Search Public Quizzes</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Discover practice quizzes, competitive assessments, and interactive tests.
        </p>
      </div>

      <SearchBar onSearchChange={handleSearchChange} />

      {loading ? (
        <div className="card text-center" style={{ padding: '3rem' }}>Searching quizzes...</div>
      ) : quizzes.length > 0 ? (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onStartAttempt={handleStartAttempt} />
          ))}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Quizzes Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            No public quizzes matched your current search filters. Try adjusting your search query or tag selection.
          </p>
        </div>
      )}

      {selectedPrivateQuiz && (
        <PasscodeModal
          quiz={selectedPrivateQuiz}
          onSubmit={handlePasscodeSubmit}
          onClose={() => setSelectedPrivateQuiz(null)}
        />
      )}
    </div>
  );
};
