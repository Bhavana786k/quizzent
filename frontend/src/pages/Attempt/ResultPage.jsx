import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { attemptService } from '../../services/attemptService';
import { Trophy, CheckCircle, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export const ResultPage = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      const res = await attemptService.getAttemptResult(attemptId);
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="card text-center" style={{ padding: '4rem' }}>Evaluating score & loading results...</div>;
  }

  if (error) {
    return (
      <div className="card text-center" style={{ padding: '3rem', maxWidth: '600px', margin: '2rem auto' }}>
        <h3>Result Error</h3>
        <p className="alert alert-danger" style={{ marginTop: '1rem' }}>{error}</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const { quizTitle, quizId, score, totalMarks, percentage, timeTakenSeconds, showResultsImmediately, showCorrectAnswers, answers } = result;

  const formatSeconds = (totalSecs) => {
    if (!totalSecs) return '0s';
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Result Header Summary Card */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '2rem',
        }}
      >
        <Trophy size={56} color="var(--primary)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{quizTitle}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Attempt Submission Summary</p>

        {showResultsImmediately ? (
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>
              {score} <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {totalMarks}</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', color: percentage >= 50 ? 'var(--success)' : 'var(--danger)' }}>
              {percentage}% Score
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Time Taken: {formatSeconds(timeTakenSeconds)}
            </div>
          </div>
        ) : (
          <div className="alert alert-info" style={{ maxWidth: '500px', margin: '0 auto' }}>
            Result visibility is controlled by the quiz creator. Immediate scores are hidden for this assessment.
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/history" className="btn btn-secondary">
            <ArrowLeft size={16} /> View Attempt History
          </Link>
          <Link to={`/attempt/${quizId}`} className="btn btn-primary">
            <RefreshCw size={16} /> Re-attempt Quiz
          </Link>
        </div>
      </div>

      {/* Detailed Question Review (If Permitted) */}
      {showResultsImmediately && answers && answers.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
            Question-wise Evaluation
          </h3>

          {answers.map((ans, idx) => (
            <div key={ans.questionId || idx} className="card" style={{ marginBottom: '1.25rem', borderLeft: `6px solid ${ans.isCorrect ? 'var(--success)' : 'var(--danger)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                  {idx + 1}. {ans.questionText}
                </span>
                <span style={{ fontWeight: 700, color: ans.isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                  {ans.marksEarned} / {ans.totalQuestionMarks} Marks
                </span>
              </div>

              {/* Answers Details */}
              {ans.questionType === 'VERY_SHORT_ANSWER' && (
                <div style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>
                  <div>Your Answer: <strong>{ans.userTextAnswer || 'No answer provided'}</strong></div>
                  {showCorrectAnswers && (
                    <div style={{ color: 'var(--success)', marginTop: '0.2rem' }}>
                      Correct Answer: <strong>{ans.correctTextAnswer}</strong>
                    </div>
                  )}
                </div>
              )}

              {ans.questionType === 'MATCHING' && (
                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                  {Object.entries(ans.userMatchingPairs || {}).map(([left, right]) => (
                    <div key={left} style={{ margin: '0.2rem 0' }}>
                      {left} ➔ <strong>{right}</strong>
                      {showCorrectAnswers && ans.correctMatchingPairs && (
                        <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                          (Expected: {ans.correctMatchingPairs[left]})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
