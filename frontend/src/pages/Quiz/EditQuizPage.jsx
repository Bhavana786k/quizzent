import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { mediaService } from '../../services/mediaService';
import { PlusCircle, Trash2, Save } from 'lucide-react';

const CATEGORIES = ['Education', 'Entertainment', 'Training', 'Fun', 'General', 'Other'];

export const EditQuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Education');
  const [tagsInput, setTagsInput] = useState('');
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

  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchQuizDetails();
  }, [id]);

  const fetchQuizDetails = async () => {
    try {
      const res = await quizService.getQuizDetails(id);
      const { quiz, questions: qList } = res.data;

      setTitle(quiz.title || '');
      setDescription(quiz.description || '');
      setCategory(quiz.category || 'Education');
      setTagsInput(quiz.tags ? quiz.tags.join(', ') : '');
      setMode(quiz.mode || 'PRACTICE');
      setVisibility(quiz.visibility || 'PUBLIC');
      setPrivateAccessType(quiz.privateAccessType || 'LINK_ONLY');
      setAttemptLimit(quiz.attemptLimit !== null ? String(quiz.attemptLimit) : '');
      setTimeLimitMinutes(quiz.timeLimitMinutes !== null ? String(quiz.timeLimitMinutes) : '');
      setRandomizeQuestions(!!quiz.randomizeQuestions);
      setRandomizeOptions(!!quiz.randomizeOptions);
      setShowResultsImmediately(!!quiz.showResultsImmediately);
      setShowCorrectAnswers(!!quiz.showCorrectAnswers);
      setStartTime(quiz.startTime || '');
      setEndTime(quiz.endTime || '');
      setEnableLeaderboard(!!quiz.enableLeaderboard);

      setQuestions(
        qList.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          questionType: q.questionType,
          marks: q.marks || 1.0,
          mediaUrl: q.mediaUrl || '',
          mediaType: q.mediaType || '',
          shortAnswerCorrect: q.shortAnswerCorrect || '',
          options: q.options || [],
          matchingPairs: q.matchingPairs || [],
        }))
      );
    } catch (err) {
      setError(err.message || 'Failed to load quiz details');
    } finally {
      setLoading(false);
    }
  };

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
        matchingPairs: [{ leftItem: '', rightItem: '' }],
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length <= 1) {
      alert('Quiz must contain at least 1 question.');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updated = [...questions];
    const q = updated[qIndex];

    if (field === 'isCorrect') {
      if (q.questionType === 'MCQ' || q.questionType === 'TRUE_FALSE') {
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

  const handleAddOption = (qIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length >= 6) {
      alert('Maximum 6 options allowed per question (Rule 18).');
      return;
    }
    updated[qIndex].options.push({ optionText: '', isCorrect: false });
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) {
      alert('At least 2 options required.');
      return;
    }
    updated[qIndex].options = updated[qIndex].options.filter((_, idx) => idx !== oIndex);
    setQuestions(updated);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const tagSet = Array.from(new Set(tagsInput.split(',').map((t) => t.trim()).filter((t) => t.length > 0)));

    const payload = {
      title,
      description,
      category,
      tags: tagSet,
      mode,
      visibility,
      privateAccessType: visibility === 'PRIVATE' ? privateAccessType : null,
      passcode: passcode.trim() ? passcode : null,
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
      await quizService.updateQuiz(id, payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to update quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="card text-center" style={{ padding: '3rem' }}>Loading quiz details...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Edit Quiz</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Modify quiz parameters and question structure.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>General Information</h3>
          <div className="form-group">
            <label className="form-label">Quiz Title *</label>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Category</label>
              <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Tags</label>
              <input type="text" className="form-control" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', margin: '2rem 0 4rem 0' }}>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-lg">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <Save size={20} /> {saving ? 'Saving...' : 'Update Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};
