import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

export const PasscodeModal = ({ quiz, onSubmit, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter the quiz passcode');
      return;
    }
    onSubmit(passcode.trim());
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Lock size={20} color="var(--primary)" /> Private Quiz Passcode
          </h3>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem' }}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          <strong>{quiz.title}</strong> requires a passcode to begin. Please enter the passcode provided by the quiz creator.
        </p>

        {error && <div className="alert alert-danger" style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Quiz Passcode</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter passcode..."
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError('');
              }}
              autoFocus
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Unlock & Start
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
