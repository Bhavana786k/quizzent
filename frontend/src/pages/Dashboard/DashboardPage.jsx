import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { PlusCircle, Edit3, Trash2, Trophy, Share2, HelpCircle, Eye, Lock } from 'lucide-react';

export const DashboardPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchMyQuizzes();
  }, []);

  const fetchMyQuizzes = async () => {
    try {
      const res = await quizService.getMyQuizzes();
      setQuizzes(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete quiz "${title}"?`)) {
      try {
        await quizService.deleteQuiz(id);
        setQuizzes(quizzes.filter((q) => q.id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete quiz');
      }
    }
  };

  const handleCopyLink = (shareCode, id) => {
    const shareUrl = `${window.location.origin}/quiz/${shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>My Created Quizzes</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage, edit, delete, and inspect performance analytics for your quizzes.
          </p>
        </div>
        <Link to="/create-quiz" className="btn btn-primary">
          <PlusCircle size={18} /> Create New Quiz
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="card text-center" style={{ padding: '3rem' }}>Loading your quizzes...</div>
      ) : quizzes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span className={`badge ${quiz.mode === 'COMPETITION' ? 'badge-competition' : 'badge-practice'}`}>
                    {quiz.mode}
                  </span>
                  <span className={`badge ${quiz.visibility === 'PRIVATE' ? 'badge-private' : 'badge-public'}`}>
                    {quiz.visibility === 'PRIVATE' ? 'Private' : 'Public'}
                  </span>
                  <span className="badge badge-category">{quiz.category}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.2rem 0' }}>{quiz.title}</h3>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span><HelpCircle size={14} /> {quiz.questionCount || 0} Questions</span>
                  <span>Share Code: <code style={{ background: '#f1f5f9', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{quiz.shareCode}</code></span>
                  <span>Created: {new Date(quiz.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/edit-quiz/${quiz.id}`} className="btn btn-secondary btn-sm" title="Edit Quiz">
                  <Edit3 size={16} /> Edit
                </Link>
                {quiz.enableLeaderboard && (
                  <Link to={`/leaderboard/${quiz.id}`} className="btn btn-secondary btn-sm" title="Leaderboard">
                    <Trophy size={16} /> Leaderboard
                  </Link>
                )}
                <button
                  onClick={() => handleCopyLink(quiz.shareCode, quiz.id)}
                  className="btn btn-outline btn-sm"
                  title="Copy share link"
                >
                  <Share2 size={16} /> {copiedId === quiz.id ? 'Copied!' : 'Link'}
                </button>
                <button
                  onClick={() => handleDelete(quiz.id, quiz.title)}
                  className="btn btn-danger btn-sm"
                  title="Delete Quiz"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Quizzes Created Yet</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1.5rem 0' }}>
            You haven't created any quizzes yet. Click below to start building your first interactive quiz!
          </p>
          <Link to="/create-quiz" className="btn btn-primary">
            <PlusCircle size={18} /> Create Your First Quiz
          </Link>
        </div>
      )}
    </div>
  );
};
