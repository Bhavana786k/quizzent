import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { searchService } from '../../services/searchService';
import { Leaderboard } from '../../components/Leaderboard';
import { Trophy, ArrowLeft } from 'lucide-react';

export const LeaderboardPage = () => {
  const { quizId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [quizId]);

  const fetchLeaderboard = async () => {
    try {
      const res = await searchService.getLeaderboard(quizId);
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="card text-center" style={{ padding: '4rem' }}>Loading rankings...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link to="/" className="btn btn-secondary btn-sm" style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back
          </Link>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Quiz Leaderboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>{data?.quizTitle}</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <Leaderboard leaderboardData={data} />
    </div>
  );
};
