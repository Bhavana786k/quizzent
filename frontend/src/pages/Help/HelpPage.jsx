import React from 'react';
import { BookOpen, CheckCircle, ShieldCheck, Trophy, HelpCircle, AlertCircle, Lock } from 'lucide-react';

export const HelpPage = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div className="card" style={{ background: 'linear-gradient(135deg, #4f46e5, #4338ca)', color: 'white', padding: '2.5rem 2rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          📖 Quizzent Platform Documentation & User Guide
        </h1>
        <p style={{ opacity: 0.9, fontSize: '1.05rem' }}>
          Everything you need to know about quiz creation, modes, question types, scoring formulas, and access controls.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={22} /> 1. Getting Started
        </h2>
        <p style={{ lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          <strong>Quizzent</strong> is an open platform where every registered user can create, share, and attempt quizzes.
        </p>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>
          <li><strong>Registration</strong>: Create an account using your full name, valid email, and secure password.</li>
          <li><strong>Authentication</strong>: Secure login uses JSON Web Tokens (JWT). Passwords are encrypted with BCrypt hashing.</li>
          <li><strong>Dashboard</strong>: Your central hub to manage created quizzes, view analytics, and inspect leaderboards.</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={22} /> 2. Quiz Modes Explained
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#e0f2fe', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid #bae6fd' }}>
            <h3 style={{ color: '#0369a1', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Practice Mode</h3>
            <p style={{ fontSize: '0.9rem', color: '#0c4a6e', lineHeight: 1.5 }}>
              Designed for learning, revision, and casual self-testing. Immediate answer feedback can be shown, and creators can configure multiple attempt retries.
            </p>
          </div>

          <div style={{ background: '#fef3c7', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid #fde68a' }}>
            <h3 style={{ color: '#b45309', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Competition Mode</h3>
            <p style={{ fontSize: '0.9rem', color: '#78350f', lineHeight: 1.5 }}>
              Designed for competitive assessments. Includes visible timers, scheduled start/end windows, live leaderboards, performance ranking, and top 3 podium highlights.
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={22} /> 3. The 5 Question Types & Scoring Rules
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>1. Multiple Choice Question (MCQ)</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Single choice question with up to 6 options. Exactly 1 option is correct. Correct answer earns 100% marks; incorrect earns 0. No negative marking.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>2. True / False</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Exactly two choices (True or False). Exactly 1 option is correct. Correct choice earns 100% marks; incorrect earns 0.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>3. Multiple Select Question (MSQ) & Selection Limit Rule</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Multi-choice question with up to 6 options and multiple correct choices.
              <br />
              <strong>Critical Rule:</strong> The maximum number of selections a participant can make cannot exceed the total number of correct options defined for that question.
              <br />
              <strong>Partial Scoring:</strong> Marks per correct selection = Total Marks / Count(Correct Options). Only correct choices earn marks. Wrong choices earn 0 and do NOT deduct points from correct choices.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>4. Matching Questions</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Pairs left items to right items. Partial marks are awarded per correct pair (Total Marks / Count of Pairs). Incorrect matches earn 0 for that pair. Order independent.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>5. Very Short Answer</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Intended for 1-2 word answers. Answers are evaluated case-insensitively after trimming leading and trailing whitespace (e.g. "Delhi", "delhi", " DELHI " are all evaluated as identical).
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={22} /> 4. Access Control & Passcodes
        </h2>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>
          <li><strong>Public Quizzes</strong>: Discoverable via the public search page and accessible to all logged-in users.</li>
          <li><strong>Private - Link Only (Method A)</strong>: Hidden from public search; accessible via shareable link URL.</li>
          <li><strong>Private - Link + Passcode (Method B)</strong>: Hidden from public search; requires both shareable link and correct passcode. Passcodes are BCrypt hashed for security.</li>
        </ul>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={22} /> 5. Leaderboard Ranking & Tie-Breaker Formula
        </h2>
        <p style={{ lineHeight: 1.6, color: 'var(--text-muted)' }}>
          Leaderboards display participants ordered by:
        </p>
        <ol style={{ paddingLeft: '1.5rem', lineHeight: 1.8, color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          <li><strong>Primary Factor</strong>: Higher Score earns higher rank.</li>
          <li><strong>Tie-Breaker Factor</strong>: For identical scores, lower completion time (seconds taken) earns higher rank.</li>
        </ol>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          For scheduled competitive quizzes, the leaderboard becomes available after the competition window ends. The top 3 performers receive 🥇 Gold, 🥈 Silver, and 🥉 Bronze visual badges.
        </p>
      </div>
    </div>
  );
};
