import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const QuizTimer = ({ initialMinutes, onTimeExpired }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeExpired]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isUrgent = secondsLeft <= 60;

  return (
    <div className={`timer-box ${isUrgent ? 'urgent' : ''}`}>
      <Clock size={20} />
      <span>Time Left: {formatTime(secondsLeft)}</span>
    </div>
  );
};
