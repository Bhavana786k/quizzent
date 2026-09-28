import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { searchService } from '../../services/searchService';
import { QuizCard } from '../../components/QuizCard';
import { PasscodeModal } from '../../components/PasscodeModal';
import { Play, Sparkles, BookOpen, Trophy, ShieldCheck, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrivateQuiz, setSelectedPrivateQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      try {
        const res = await searchService.searchQuizzes({ page: 0, size: 6 });
        setQuizzes(res.data.content || []);
      } catch (err) {
        console.error('Failed to load recent quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentQuizzes();
  }, []);

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
      {/* Hero Section */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
          color: 'white',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius)',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
          Build, Share & Master Interactive Quizzes with <span style={{ color: '#fef08a' }}>Quizzent</span>
        </h1>
        <p style={{ fontSize: '1.15rem', opacity: 0.95, maxWidth: '750px', margin: '0 auto 2rem auto' }}>
          The all-in-one configurable quiz platform for Education, Training, Entertainment, Practice, and Competition.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/search" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)' }}>
            <Sparkles size={20} /> Explore Public Quizzes
          </Link>
          <Link to="/create-quiz" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>
            <Play size={20} /> Create Your Quiz
          </Link>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card">
          <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
            <BookOpen size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Practice Mode</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Self-paced learning and revision with instant answer feedback and configurable attempt limits.
          </p>
        </div>

        <div className="card">
          <div style={{ background: '#fef3c7', color: '#b45309', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
            <Trophy size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Competition Mode</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Timed competitive assessments featuring live rankings, completion time tie-breakers, and top 3 podiums.
          </p>
        </div>

        <div className="card">
          <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>5 Question Types</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            MCQ, True/False, Multiple Select (MSQ), Matching Pairs, and Case-Insensitive Very Short Answer.
          </p>
        </div>
      </div>

      {/* Featured Quizzes Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Explore Popular Public Quizzes</h2>
          <Link to="/search" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="card text-center" style={{ padding: '2rem' }}>Loading featured quizzes...</div>
        ) : quizzes.length > 0 ? (
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onStartAttempt={handleStartAttempt} />
            ))}
          </div>
        ) : (
          <div className="card text-center" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>No public quizzes found yet. Be the first to create one!</p>
            <Link to="/create-quiz" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              Create a Quiz Now
            </Link>
          </div>
        )}
      </div>

      {/* Passcode Modal for Private Quizzes */}
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
