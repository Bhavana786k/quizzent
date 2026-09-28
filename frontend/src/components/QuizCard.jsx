import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, HelpCircle, Trophy, Share2, Lock, Play, Eye } from 'lucide-react';

export const QuizCard = ({ quiz, onStartAttempt }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/quiz/${quiz.shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card quiz-card">
      <div>
        <div className="quiz-card-header">
          <span className={`badge ${quiz.mode === 'COMPETITION' ? 'badge-competition' : 'badge-practice'}`}>
            {quiz.mode}
          </span>
          <span className={`badge ${quiz.visibility === 'PRIVATE' ? 'badge-private' : 'badge-public'}`}>
            {quiz.visibility === 'PRIVATE' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <Lock size={12} /> {quiz.privateAccessType === 'LINK_PASSCODE' ? 'Passcode' : 'Private'}
              </span>
            ) : (
              'Public'
            )}
          </span>
        </div>

        <h3 className="quiz-title">{quiz.title}</h3>
        <p className="quiz-desc">{quiz.description || 'No description provided.'}</p>

        {quiz.tags && quiz.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {quiz.tags.map((tag) => (
              <span key={tag} className="badge badge-category">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="quiz-meta">
          <div className="meta-item">
            <HelpCircle size={15} /> {quiz.questionCount || 0} Questions ({quiz.totalMarks || 0} Marks)
          </div>
          {quiz.timeLimitMinutes && (
            <div className="meta-item">
              <Clock size={15} /> {quiz.timeLimitMinutes} Mins
            </div>
          )}
          {quiz.attemptLimit && (
            <div className="meta-item">
              Attempts: {quiz.attemptLimit} Max
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            onClick={() => onStartAttempt(quiz)}
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            <Play size={16} /> Attempt Quiz
          </button>
          {quiz.enableLeaderboard && (
            <Link to={`/leaderboard/${quiz.id}`} className="btn btn-secondary btn-sm">
              <Trophy size={16} />
            </Link>
          )}
          <button
            onClick={handleShare}
            className="btn btn-outline btn-sm"
            title="Copy share link"
          >
            <Share2 size={16} /> {copied ? 'Copied!' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};
