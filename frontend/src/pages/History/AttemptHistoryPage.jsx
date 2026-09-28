import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attemptService } from '../../services/attemptService';
import { History, Eye, Clock, CheckCircle } from 'lucide-react';

export const AttemptHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await attemptService.getAttemptHistory();
      setHistory(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch attempt history');
    } finally {
      setLoading(false);
    }
  };

  const formatSeconds = (totalSecs) => {
    if (!totalSecs) return 'N/A';
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>My Attempt History</h2>
        <p style={{ color: 'var(--text-muted)' }}>Review your past quiz attempts, scores, and completion times.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="card text-center" style={{ padding: '3rem' }}>Loading attempt history...</div>
      ) : history.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((att) => (
            <div key={att.attemptId} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.3rem' }}>{att.quizTitle}</h3>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Score: <strong style={{ color: 'var(--primary)' }}>{att.score}</strong> / {att.totalMarks} ({att.percentage}%)</span>
                  <span><Clock size={14} /> Time: {formatSeconds(att.timeTakenSeconds)}</span>
                  <span>Submitted: {att.submitTime ? new Date(att.submitTime).toLocaleString() : 'N/A'}</span>
                </div>
              </div>

              <div>
                <Link to={`/result/${att.attemptId}`} className="btn btn-primary btn-sm">
                  <Eye size={16} /> View Result
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Attempt History</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>
            You haven't attempted any quizzes yet. Start exploring public quizzes!
          </p>
          <Link to="/search" className="btn btn-primary">
            Explore Quizzes
          </Link>
        </div>
      )}
    </div>
  );
};
