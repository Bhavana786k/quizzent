import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { attemptService } from '../../services/attemptService';
import { QuizTimer } from '../../components/QuizTimer';
import { MediaViewer } from '../../components/MediaViewer';
import { CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, Send } from 'lucide-react';

export const AttemptQuizPage = () => {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const passcode = searchParams.get('passcode');
  const navigate = useNavigate();

  const [attemptData, setAttemptData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: { selectedOptionIds: [], matchingPairs: {}, textAnswer: '' } }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    startAttemptSession();
  }, [quizId]);

  const startAttemptSession = async () => {
    try {
      const res = await attemptService.startAttempt(quizId, passcode);
      setAttemptData(res.data);

      // Initialize answers object
      const initialAnswers = {};
      if (res.data.questions) {
        res.data.questions.forEach((q) => {
          initialAnswers[q.id] = {
            questionId: q.id,
            selectedOptionIds: [],
            matchingPairs: {},
            textAnswer: '',
          };
        });
      }
      setUserAnswers(initialAnswers);
    } catch (err) {
      setError(err.message || 'Failed to start quiz attempt');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionId, questionType, maxSelections) => {
    setUserAnswers((prev) => {
      const current = prev[questionId] || { questionId, selectedOptionIds: [], matchingPairs: {}, textAnswer: '' };
      let newSelected = [...current.selectedOptionIds];

      if (questionType === 'MCQ' || questionType === 'TRUE_FALSE') {
        newSelected = [optionId];
      } else if (questionType === 'MSQ') {
        if (newSelected.includes(optionId)) {
          newSelected = newSelected.filter((id) => id !== optionId);
        } else {
          // CRITICAL BUSINESS RULE 3 & 14: Prevent selecting more options than permitted max selections!
          if (maxSelections && newSelected.length >= maxSelections) {
            alert(`Rule Enforcement: You can select a maximum of ${maxSelections} options for this MSQ question.`);
            return prev;
          }
          newSelected.push(optionId);
        }
      }

      return {
        ...prev,
        [questionId]: { ...current, selectedOptionIds: newSelected },
      };
    });
  };

  const handleMatchingChange = (questionId, leftItem, rightItem) => {
    setUserAnswers((prev) => {
      const current = prev[questionId] || { questionId, selectedOptionIds: [], matchingPairs: {}, textAnswer: '' };
      const updatedPairs = { ...current.matchingPairs, [leftItem]: rightItem };
      return {
        ...prev,
        [questionId]: { ...current, matchingPairs: updatedPairs },
      };
    });
  };

  const handleTextAnswerChange = (questionId, text) => {
    setUserAnswers((prev) => {
      const current = prev[questionId] || { questionId, selectedOptionIds: [], matchingPairs: {}, textAnswer: '' };
      return {
        ...prev,
        [questionId]: { ...current, textAnswer: text },
      };
    });
  };

  const handleSubmitAttempt = async () => {
    if (!window.confirm('Are you sure you want to submit your quiz attempt?')) {
      return;
    }

    setSubmitting(true);
    try {
      const answerList = Object.values(userAnswers);
      const res = await attemptService.submitAttempt(attemptData.attemptId, { answers: answerList });
      navigate(`/result/${attemptData.attemptId}`);
    } catch (err) {
      alert('Submission failed: ' + err.message);
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    alert('⏱ Time has expired! Automatically submitting your attempt...');
    setSubmitting(true);
    try {
      const answerList = Object.values(userAnswers);
      await attemptService.submitAttempt(attemptData.attemptId, { answers: answerList });
      navigate(`/result/${attemptData.attemptId}`);
    } catch (err) {
      console.error('Auto submit error:', err);
      navigate(`/result/${attemptData.attemptId}`);
    }
  };

  if (loading) {
    return <div className="card text-center" style={{ padding: '4rem' }}>Preparing quiz attempt...</div>;
  }

  if (error) {
    return (
      <div className="card text-center" style={{ padding: '3rem', maxWidth: '600px', margin: '2rem auto' }}>
        <AlertTriangle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
        <h3>Cannot Start Attempt</h3>
        <p className="alert alert-danger" style={{ marginTop: '1rem' }}>{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Home
        </button>
      </div>
    );
  }

  const { quiz, questions, timeLimitMinutes } = attemptData;
  const currentQ = questions[currentQIndex];
  const qAns = userAnswers[currentQ?.id] || { selectedOptionIds: [], matchingPairs: {}, textAnswer: '' };

  const isAnswered = (qId) => {
    const ans = userAnswers[qId];
    if (!ans) return false;
    if (ans.selectedOptionIds && ans.selectedOptionIds.length > 0) return true;
    if (ans.textAnswer && ans.textAnswer.trim().length > 0) return true;
    if (ans.matchingPairs && Object.keys(ans.matchingPairs).length > 0) return true;
    return false;
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      {/* Attempt Top Bar Header */}
      <div className="attempt-header">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{quiz.title}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Question {currentQIndex + 1} of {questions.length} ({currentQ?.marks} Marks)
          </span>
        </div>

        {timeLimitMinutes && (
          <QuizTimer initialMinutes={timeLimitMinutes} onTimeExpired={handleAutoSubmit} />
        )}
      </div>

      {/* Question Navigation Grid */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Question Navigator:
        </div>
        <div className="question-nav-grid">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQIndex(idx)}
              className={`q-nav-btn ${currentQIndex === idx ? 'active' : isAnswered(q.id) ? 'answered' : ''}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Card */}
      {currentQ && (
        <div className="card" style={{ marginBottom: '1.5rem', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-category">{currentQ.questionType}</span>
            <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem' }}>
              {currentQ.marks} Marks
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.4 }}>
            {currentQIndex + 1}. {currentQ.questionText}
          </h3>

          {/* Media Viewer */}
          <MediaViewer mediaUrl={currentQ.mediaUrl} mediaType={currentQ.mediaType} />

          {/* MSQ Max Selection Notice */}
          {currentQ.questionType === 'MSQ' && (
            <div className="alert alert-info" style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              <strong>MSQ Rule:</strong> You can select a maximum of {currentQ.maxSelectionsAllowed} options ({qAns.selectedOptionIds.length} / {currentQ.maxSelectionsAllowed} selected).
            </div>
          )}

          {/* Render Options for MCQ, MSQ, True/False */}
          {(currentQ.questionType === 'MCQ' || currentQ.questionType === 'MSQ' || currentQ.questionType === 'TRUE_FALSE') && (
            <div>
              {currentQ.options.map((opt) => {
                const isSelected = qAns.selectedOptionIds.includes(opt.id);
                const isSelectionLocked =
                  currentQ.questionType === 'MSQ' &&
                  !isSelected &&
                  qAns.selectedOptionIds.length >= (currentQ.maxSelectionsAllowed || 1);

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (!isSelectionLocked) {
                        handleOptionSelect(currentQ.id, opt.id, currentQ.questionType, currentQ.maxSelectionsAllowed);
                      }
                    }}
                    className={`choice-option ${isSelected ? 'selected' : ''} ${isSelectionLocked ? 'disabled' : ''}`}
                  >
                    <input
                      type={currentQ.questionType === 'MSQ' ? 'checkbox' : 'radio'}
                      name={`attempt-opt-${currentQ.id}`}
                      checked={isSelected}
                      disabled={isSelectionLocked}
                      onChange={() => {}}
                      style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)', cursor: isSelectionLocked ? 'not-allowed' : 'pointer' }}
                    />
                    <span style={{ fontSize: '1rem', color: isSelectionLocked ? 'var(--text-muted)' : 'var(--text-main)' }}>
                      {opt.optionText}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Render MATCHING builder */}
          {currentQ.questionType === 'MATCHING' && (
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius)', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>
                Match each item on the left with its corresponding item on the right:
              </p>
              {currentQ.matchingPairs.map((pair) => (
                <div key={pair.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <div style={{ fontWeight: 600, background: 'white', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    {pair.leftItem}
                  </div>
                  <span>➔</span>
                  <select
                    className="form-control"
                    value={qAns.matchingPairs[pair.leftItem] || ''}
                    onChange={(e) => handleMatchingChange(currentQ.id, pair.leftItem, e.target.value)}
                  >
                    <option value="">-- Select Match --</option>
                    {currentQ.matchingPairs.map((m) => (
                      <option key={m.id} value={m.rightItem}>
                        {m.rightItem}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Render VERY SHORT ANSWER */}
          {currentQ.questionType === 'VERY_SHORT_ANSWER' && (
            <div style={{ marginTop: '1rem' }}>
              <label className="form-label">Type your answer below (1-2 words):</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter answer..."
                value={qAns.textAnswer || ''}
                onChange={(e) => handleTextAnswerChange(currentQ.id, e.target.value)}
                style={{ fontSize: '1.05rem', padding: '0.75rem 1rem' }}
              />
            </div>
          )}
        </div>
      )}

      {/* Navigation & Submit Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <button
          type="button"
          onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
          className="btn btn-secondary"
          disabled={currentQIndex === 0}
        >
          <ArrowLeft size={18} /> Previous Question
        </button>

        {currentQIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className="btn btn-primary"
          >
            Next Question <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitAttempt}
            className="btn btn-primary btn-lg"
            style={{ background: 'var(--success)' }}
            disabled={submitting}
          >
            <Send size={18} /> {submitting ? 'Submitting...' : 'Submit Quiz Attempt'}
          </button>
        )}
      </div>
    </div>
  );
};
