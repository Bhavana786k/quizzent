import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { mediaService } from '../../services/mediaService';
import { PlusCircle, Trash2, Upload, Check, AlertCircle, Save } from 'lucide-react';

const CATEGORIES = ['Education', 'Entertainment', 'Training', 'Fun', 'General', 'Other'];

export const CreateQuizPage = () => {
  const navigate = useNavigate();

  // General Quiz State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Education');
  const [tagsInput, setTagsInput] = useState('Java, Spring Boot');
  const [mode, setMode] = useState('PRACTICE');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [privateAccessType, setPrivateAccessType] = useState('LINK_ONLY');
  const [passcode, setPasscode] = useState('');
  const [attemptLimit, setAttemptLimit] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState('');
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [randomizeOptions, setRandomizeOptions] = useState(false);
  const [showResultsImmediately, setShowResultsImmediately] = useState(true);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [enableLeaderboard, setEnableLeaderboard] = useState(true);

  // Questions Array
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      questionText: '',
      questionType: 'MCQ',
      marks: 1.0,
      mediaUrl: '',
      mediaType: '',
      shortAnswerCorrect: '',
      options: [
        { optionText: '', isCorrect: true },
        { optionText: '', isCorrect: false },
      ],
      matchingPairs: [
        { leftItem: '', rightItem: '' },
      ],
    },
  ]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Add Question Handler
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        questionText: '',
        questionType: 'MCQ',
        marks: 1.0,
        mediaUrl: '',
        mediaType: '',
        shortAnswerCorrect: '',
        options: [
          { optionText: '', isCorrect: true },
          { optionText: '', isCorrect: false },
        ],
        matchingPairs: [
          { leftItem: '', rightItem: '' },
        ],
      },
    ]);
  };

  // Remove Question Handler
  const handleRemoveQuestion = (index) => {
    if (questions.length <= 1) {
      alert('Quiz must contain at least 1 question.');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Question Property Change
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;

    // Reset options structure if type changes
    if (field === 'questionType') {
      if (value === 'TRUE_FALSE') {
        updated[index].options = [
          { optionText: 'True', isCorrect: true },
          { optionText: 'False', isCorrect: false },
        ];
      } else if (value === 'MCQ' || value === 'MSQ') {
        if (!updated[index].options || updated[index].options.length < 2) {
          updated[index].options = [
            { optionText: '', isCorrect: true },
            { optionText: '', isCorrect: false },
          ];
        }
      }
    }

    setQuestions(updated);
  };

  // Option Change for MCQ/MSQ/TrueFalse
  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updated = [...questions];
    const q = updated[qIndex];

    if (field === 'isCorrect') {
      if (q.questionType === 'MCQ' || q.questionType === 'TRUE_FALSE') {
        // Only 1 option can be correct for MCQ and True/False
        q.options.forEach((opt, idx) => {
          opt.isCorrect = idx === oIndex;
        });
      } else if (q.questionType === 'MSQ') {
        q.options[oIndex].isCorrect = value;
      }
    } else {
      q.options[oIndex][field] = value;
    }

    setQuestions(updated);
  };

  // Add Option (Max 6 limit rule 18)
  const handleAddOption = (qIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length >= 6) {
      alert('Maximum 6 options allowed per question (Rule 2 & 18).');
      return;
    }
    updated[qIndex].options.push({ optionText: '', isCorrect: false });
    setQuestions(updated);
  };

  // Remove Option
  const handleRemoveOption = (qIndex, oIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) {
      alert('At least 2 options required.');
      return;
    }
    updated[qIndex].options = updated[qIndex].options.filter((_, idx) => idx !== oIndex);
    setQuestions(updated);
  };

  // Matching Pair Change
  const handleMatchingPairChange = (qIndex, pIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex].matchingPairs[pIndex][field] = value;
    setQuestions(updated);
  };

  const handleAddMatchingPair = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].matchingPairs.push({ leftItem: '', rightItem: '' });
    setQuestions(updated);
  };

  const handleRemoveMatchingPair = (qIndex, pIndex) => {
    const updated = [...questions];
    if (updated[qIndex].matchingPairs.length <= 1) {
      alert('Matching questions require at least 1 pair.');
      return;
    }
    updated[qIndex].matchingPairs = updated[qIndex].matchingPairs.filter((_, idx) => idx !== pIndex);
    setQuestions(updated);
  };

  // Media File Upload
  const handleFileUpload = async (qIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await mediaService.uploadMedia(file);
      const updated = [...questions];
      updated[qIndex].mediaUrl = res.data.mediaUrl;
      updated[qIndex].mediaType = res.data.mediaType;
      setQuestions(updated);
    } catch (err) {
      alert('Media upload failed: ' + err.message);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validations
    if (!title.trim()) {
      setError('Quiz title is required');
      return;
    }

    if (visibility === 'PRIVATE' && privateAccessType === 'LINK_PASSCODE' && !passcode.trim()) {
      setError('Passcode is required for Link + Passcode private quizzes');
      return;
    }

    // Validate Questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question #${i + 1} text cannot be empty`);
        return;
      }

      if (q.questionType === 'MCQ' || q.questionType === 'MSQ' || q.questionType === 'TRUE_FALSE') {
        if (q.options.length > 6) {
          setError(`Question #${i + 1} has more than maximum 6 options allowed (Rule 18)`);
          return;
        }
        const hasCorrect = q.options.some((o) => o.isCorrect);
        if (!hasCorrect) {
          setError(`Question #${i + 1} (${q.questionType}) must have at least one correct option selected`);
          return;
        }
      }

      if (q.questionType === 'VERY_SHORT_ANSWER' && !q.shortAnswerCorrect.trim()) {
        setError(`Question #${i + 1} (Very Short Answer) requires an expected correct answer string`);
        return;
      }
    }

    setLoading(true);

    const tagSet = Array.from(new Set(tagsInput.split(',').map((t) => t.trim()).filter((t) => t.length > 0)));

    const payload = {
      title,
      description,
      category,
      tags: tagSet,
      mode,
      visibility,
      privateAccessType: visibility === 'PRIVATE' ? privateAccessType : null,
      passcode: visibility === 'PRIVATE' && privateAccessType === 'LINK_PASSCODE' ? passcode : null,
      attemptLimit: attemptLimit ? parseInt(attemptLimit) : null,
      timeLimitMinutes: timeLimitMinutes ? parseInt(timeLimitMinutes) : null,
      randomizeQuestions,
      randomizeOptions,
      showResultsImmediately,
      showCorrectAnswers,
      startTime: startTime || null,
      endTime: endTime || null,
      enableLeaderboard,
      questions: questions.map((q, idx) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        marks: parseFloat(q.marks) || 1.0,
        mediaUrl: q.mediaUrl,
        mediaType: q.mediaType,
        orderIndex: idx + 1,
        shortAnswerCorrect: q.shortAnswerCorrect,
        options: q.options,
        matchingPairs: q.matchingPairs,
      })),
    };

    try {
      await quizService.createQuiz(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create New Quiz</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Configure quiz settings, modes, visibility, and add questions.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            1. Basic Information
          </h3>

          <div className="form-group">
            <label className="form-label">Quiz Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Master Spring Boot & Java Concepts"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Enter brief instructions or overview of the quiz..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Category *</label>
              <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Java, Python, DSA, Science..."
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Step 2: Mode, Visibility & Access Configuration */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            2. Quiz Settings & Access Rules
          </h3>

          <div className="form-row">
            <div>
              <label className="form-label">Quiz Mode</label>
              <select className="form-control" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="PRACTICE">Practice Mode (Learning & self-testing)</option>
                <option value="COMPETITION">Competition Mode (Timed & Leaderboard ranking)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Visibility</label>
              <select className="form-control" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                <option value="PUBLIC">Public (Appears in Search/Explore)</option>
                <option value="PRIVATE">Private (Hidden from public search)</option>
              </select>
            </div>
          </div>

          {visibility === 'PRIVATE' && (
            <div className="form-row" style={{ marginTop: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius)' }}>
              <div>
                <label className="form-label">Private Access Method</label>
                <select className="form-control" value={privateAccessType} onChange={(e) => setPrivateAccessType(e.target.value)}>
                  <option value="LINK_ONLY">Method A: Link Only (Anyone with link can access)</option>
                  <option value="LINK_PASSCODE">Method B: Link + Passcode (Requires password)</option>
                </select>
              </div>

              {privateAccessType === 'LINK_PASSCODE' && (
                <div>
                  <label className="form-label">Private Passcode *</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Set passcode for users..."
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          )}

          <div className="form-row" style={{ marginTop: '1.25rem' }}>
            <div>
              <label className="form-label">Attempt Limit (Leave blank for unlimited)</label>
              <input
                type="number"
                min="1"
                className="form-control"
                placeholder="e.g. 1, 3, 5..."
                value={attemptLimit}
                onChange={(e) => setAttemptLimit(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Time Limit in Minutes (Leave blank for no timer)</label>
              <input
                type="number"
                min="1"
                className="form-control"
                placeholder="e.g. 15, 30, 60..."
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row" style={{ marginTop: '1.25rem' }}>
            <div>
              <label className="form-label">Optional Start Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Optional End Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            <label className="checkbox-group">
              <input type="checkbox" checked={randomizeQuestions} onChange={(e) => setRandomizeQuestions(e.target.checked)} />
              <span>Randomize Questions Order</span>
            </label>

            <label className="checkbox-group">
              <input type="checkbox" checked={randomizeOptions} onChange={(e) => setRandomizeOptions(e.target.checked)} />
              <span>Randomize Option Order</span>
            </label>

            <label className="checkbox-group">
              <input type="checkbox" checked={showResultsImmediately} onChange={(e) => setShowResultsImmediately(e.target.checked)} />
              <span>Show Results Immediately After Submit</span>
            </label>

            <label className="checkbox-group">
              <input type="checkbox" checked={showCorrectAnswers} onChange={(e) => setShowCorrectAnswers(e.target.checked)} />
              <span>Show Correct Answer Review</span>
            </label>

            <label className="checkbox-group">
              <input type="checkbox" checked={enableLeaderboard} onChange={(e) => setEnableLeaderboard(e.target.checked)} />
              <span>Enable Leaderboard & Ranking</span>
            </label>
          </div>
        </div>

        {/* Step 3: Question Builder */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>3. Questions ({questions.length})</h3>
            <button type="button" onClick={handleAddQuestion} className="btn btn-secondary">
              <PlusCircle size={18} /> Add Question
            </button>
          </div>

          {questions.map((q, qIndex) => (
            <div key={q.id || qIndex} className="card" style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary)' }}>
                  Question #{qIndex + 1}
                </span>
                <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className="btn btn-danger btn-sm">
                  <Trash2 size={16} /> Remove Question
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Question Text *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter the question text..."
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  required
                />
              </div>

              <div className="form-row" style={{ marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label">Question Type</label>
                  <select
                    className="form-control"
                    value={q.questionType}
                    onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                  >
                    <option value="MCQ">1. Multiple Choice Question (MCQ - Single choice)</option>
                    <option value="TRUE_FALSE">2. True / False</option>
                    <option value="MSQ">3. Multiple Select Question (MSQ - Multi choice)</option>
                    <option value="MATCHING">4. Matching Pairs</option>
                    <option value="VERY_SHORT_ANSWER">5. Very Short Answer (1-2 words)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Marks</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    className="form-control"
                    value={q.marks}
                    onChange={(e) => handleQuestionChange(qIndex, 'marks', e.target.value)}
                  />
                </div>
              </div>

              {/* Media Upload */}
              <div className="form-group">
                <label className="form-label">Optional Media Attachment (Image, Video, Audio, File)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="file" onChange={(e) => handleFileUpload(qIndex, e)} style={{ fontSize: '0.9rem' }} />
                  {q.mediaUrl && <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem' }}>✓ Uploaded ({q.mediaType})</span>}
                </div>
              </div>

              {/* MCQ & MSQ Options */}
              {(q.questionType === 'MCQ' || q.questionType === 'MSQ' || q.questionType === 'TRUE_FALSE') && (
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius)', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      Options ({q.options.length} / Max 6)
                    </span>
                    {q.questionType === 'MSQ' && (
                      <span style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}>
                        ℹ Rule 3 & 14: Participant selections will be capped at total correct options ({q.options.filter(o => o.isCorrect).length})
                      </span>
                    )}
                  </div>

                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <input
                        type={q.questionType === 'MSQ' ? 'checkbox' : 'radio'}
                        name={`correct-opt-${qIndex}`}
                        checked={opt.isCorrect}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'isCorrect', e.target.checked)}
                        style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)', cursor: 'pointer' }}
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Option ${oIndex + 1}...`}
                        value={opt.optionText}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'optionText', e.target.value)}
                        required
                      />
                      {q.questionType !== 'TRUE_FALSE' && (
                        <button type="button" onClick={() => handleRemoveOption(qIndex, oIndex)} className="btn btn-secondary btn-sm">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {q.questionType !== 'TRUE_FALSE' && q.options.length < 6 && (
                    <button type="button" onClick={() => handleAddOption(qIndex)} className="btn btn-outline btn-sm" style={{ marginTop: '0.5rem' }}>
                      + Add Option
                    </button>
                  )}
                </div>
              )}

              {/* MATCHING Question Builder */}
              {q.questionType === 'MATCHING' && (
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius)', marginTop: '1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                    Matching Pairs (Left Item ➔ Correct Target Match)
                  </div>
                  {q.matchingPairs.map((pair, pIndex) => (
                    <div key={pIndex} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Left Item (e.g. Java)..."
                        value={pair.leftItem}
                        onChange={(e) => handleMatchingPairChange(qIndex, pIndex, 'leftItem', e.target.value)}
                        required
                      />
                      <span>➔</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Right Match (e.g. Programming Language)..."
                        value={pair.rightItem}
                        onChange={(e) => handleMatchingPairChange(qIndex, pIndex, 'rightItem', e.target.value)}
                        required
                      />
                      <button type="button" onClick={() => handleRemoveMatchingPair(qIndex, pIndex)} className="btn btn-secondary btn-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleAddMatchingPair(qIndex)} className="btn btn-outline btn-sm" style={{ marginTop: '0.5rem' }}>
                    + Add Matching Pair
                  </button>
                </div>
              )}

              {/* VERY SHORT ANSWER Builder */}
              {q.questionType === 'VERY_SHORT_ANSWER' && (
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius)', marginTop: '1rem' }}>
                  <label className="form-label">Expected Correct Answer (Case-insensitive & whitespace trimmed during evaluation)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Delhi"
                    value={q.shortAnswerCorrect}
                    onChange={(e) => handleQuestionChange(qIndex, 'shortAnswerCorrect', e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Quiz Form */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', margin: '2rem 0 4rem 0' }}>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-lg">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            <Save size={20} /> {loading ? 'Publishing Quiz...' : 'Publish Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};
