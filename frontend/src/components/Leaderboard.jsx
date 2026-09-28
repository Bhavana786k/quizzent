import React from 'react';
import { Trophy, Medal, Clock, CheckCircle } from 'lucide-react';

export const Leaderboard = ({ leaderboardData }) => {
  if (!leaderboardData) return null;

  const { isAvailable, availabilityMessage, rankings, topThree } = leaderboardData;

  if (!isAvailable) {
    return (
      <div className="card text-center" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <Trophy size={48} color="var(--warning)" style={{ marginBottom: '1rem' }} />
        <h3>Leaderboard Not Available</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{availabilityMessage}</p>
      </div>
    );
  }

  const formatSeconds = (totalSecs) => {
    if (!totalSecs) return 'N/A';
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div>
      {/* Top 3 Podium Highlights */}
      {topThree && topThree.length > 0 && (
        <div className="podium-container">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="podium-step">
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                🥈 {topThree[1].fullName}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {topThree[1].score}/{topThree[1].totalMarks} pts ({formatSeconds(topThree[1].timeTakenSeconds)})
              </div>
              <div className="podium-box podium-2">2</div>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div className="podium-step">
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#b45309', marginBottom: '0.5rem' }}>
                🥇 {topThree[0].fullName}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {topThree[0].score}/{topThree[0].totalMarks} pts ({formatSeconds(topThree[0].timeTakenSeconds)})
              </div>
              <div className="podium-box podium-1">1</div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="podium-step">
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                🥉 {topThree[2].fullName}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {topThree[2].score}/{topThree[2].totalMarks} pts ({formatSeconds(topThree[2].timeTakenSeconds)})
              </div>
              <div className="podium-box podium-3">3</div>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      {rankings && rankings.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Participant</th>
                <th>Score</th>
                <th>Time Taken</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((entry) => (
                <tr
                  key={entry.userId + '-' + entry.rank}
                  style={{
                    backgroundColor:
                      entry.rank === 1 ? '#fffbeb' : entry.rank === 2 ? '#f8fafc' : entry.rank === 3 ? '#fff7ed' : 'transparent',
                    fontWeight: entry.rank <= 3 ? 600 : 400,
                  }}
                >
                  <td>
                    {entry.rank === 1 ? '🥇 1st' : entry.rank === 2 ? '🥈 2nd' : entry.rank === 3 ? '🥉 3rd' : `#${entry.rank}`}
                  </td>
                  <td>{entry.fullName}</td>
                  <td>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{entry.score}</span> / {entry.totalMarks}
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {formatSeconds(entry.timeTakenSeconds)}
                    </span>
                  </td>
                  <td>{entry.submitTime ? new Date(entry.submitTime).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No quiz attempts submitted yet for this leaderboard.
        </div>
      )}
    </div>
  );
};
