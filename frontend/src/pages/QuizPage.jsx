import React from 'react';
import ElectionQuiz from '../components/quiz/ElectionQuiz';

export default function QuizPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 140px)' }}>
      <ElectionQuiz />
    </div>
  );
}
