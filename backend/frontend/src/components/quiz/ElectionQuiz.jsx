import React, { useState, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const QUESTIONS = [
  { id: 1, q: 'What is the minimum age to vote in India?', opts: ['16', '18', '21', '25'], correct: 1, explanation: 'You must be at least 18 years old on the qualifying date (January 1st of the registration year) to be eligible to vote.' },
  { id: 2, q: 'What is NOTA on an EVM?', opts: ['Not On The Agenda', 'None Of The Above', 'No Other Tally Available', 'National Official Ticket Authority'], correct: 1, explanation: 'NOTA (None of the Above) allows voters to reject all candidates. It was introduced after a Supreme Court order in 2013.' },
  { id: 3, q: 'How long is the VVPAT slip visible to the voter?', opts: ['3 seconds', '5 seconds', '7 seconds', '10 seconds'], correct: 2, explanation: 'The VVPAT slip is visible through a glass window for exactly 7 seconds, then drops into a sealed box.' },
  { id: 4, q: 'Who manufactures EVM machines in India?', opts: ['Infosys and TCS', 'ECIL and BEL', 'Tata and Wipro', 'ISRO and DRDO'], correct: 1, explanation: 'EVMs are manufactured by ECIL (Electronics Corporation of India Ltd.) and BEL (Bharat Electronics Ltd.), both government companies.' },
  { id: 5, q: 'What app can citizens use to report election violations?', opts: ['Voter ID App', 'cVIGIL', 'UMANG', 'DigiLocker'], correct: 1, explanation: 'cVIGIL is the ECI app for citizens to report election violations. Flying Squads respond within 100 minutes.' },
  { id: 6, q: 'What form is used for new voter registration?', opts: ['Form 1', 'Form 4', 'Form 6', 'Form 8'], correct: 2, explanation: 'Form 6 is used for new voter enrollment. Form 8 is for corrections, Form 7 for deletion requests.' },
  { id: 7, q: 'Which finger gets the indelible ink during voting?', opts: ['Right index', 'Right thumb', 'Left index', 'Left thumb'], correct: 2, explanation: 'Indelible ink is applied on the left index finger. It contains Silver Nitrate and cannot be easily removed.' },
  { id: 8, q: 'What does EPIC stand for?', opts: ['Election Photo ID Card', 'Electoral Photo Identity Card', 'Electronic Photo Identity Card', 'Elector Participation Identity Card'], correct: 1, explanation: 'EPIC stands for Elector\'s Photo Identity Card — the official voter ID issued by the Election Commission of India.' },
  { id: 9, q: 'How many days before election does campaigning have to stop?', opts: ['24 hours', '36 hours', '48 hours', '72 hours'], correct: 2, explanation: 'The \'silent period\' begins 48 hours before the start of polling. No rallies, speeches, or canvassing are allowed.' },
  { id: 10, q: 'What is the Model Code of Conduct?', opts: ['Rules for EVM testing', 'Guidelines for election campaigns & conduct', 'Voter registration rules', 'Counting day procedures'], correct: 1, explanation: 'The Model Code of Conduct (MCC) is a set of guidelines issued by ECI to regulate political parties and candidates during elections.' },
  { id: 11, q: 'Which article of the Constitution establishes the Election Commission of India?', opts: ['Article 226', 'Article 300', 'Article 324', 'Article 356'], correct: 2, explanation: 'Article 324 of the Indian Constitution establishes the Election Commission of India and vests it with authority over elections.' },
  { id: 12, q: 'Can an NRI (Non-Resident Indian) vote in Indian elections?', opts: ['No, NRIs cannot vote', 'Yes, but must physically be present in India', 'Yes, via postal ballot', 'Yes, via online voting'], correct: 1, explanation: 'NRIs can register as overseas electors and vote, but must physically be present at their designated polling booth in India. No postal ballot for NRIs yet.' },
  { id: 13, q: 'What is a by-election?', opts: ['An election in rural areas', 'An election held when a seat falls vacant mid-term', 'A second round of elections if no majority', 'An election for Rajya Sabha'], correct: 1, explanation: 'A by-election (or bye-election) is held for a single constituency when the seat falls vacant due to death, resignation, or disqualification of the elected member.' },
  { id: 14, q: 'Who is the Booth Level Officer (BLO)?', opts: ['The Presiding Officer on election day', 'A government official who manages voter rolls for a booth area', 'A police officer at the polling booth', 'A candidate\'s representative at the booth'], correct: 1, explanation: 'A BLO is a grassroots government official (often a school teacher) responsible for maintaining the voter roll accuracy for their assigned booth area.' },
  { id: 15, q: 'Is your vote truly secret in India?', opts: ['No — officers can see your choice', 'Yes — EVM records only counts, not who voted for whom', 'Only for computerized booths', 'No — your EPIC number is linked to your vote'], correct: 1, explanation: 'Your vote is completely secret. EVMs only record vote counts — they do not link individual voters to their choices. It is the law that nobody can ask you how you voted.' },
  { id: 16, q: 'What is the spending limit for a Lok Sabha candidate?', opts: ['₹10 lakh', '₹25 lakh', '₹70–95 lakh', '₹5 crore'], correct: 2, explanation: 'The ECI-set expenditure limit for Lok Sabha candidates varies from ₹70 lakh to ₹95 lakh depending on the state. Violations can lead to disqualification.' },
  { id: 17, q: 'When was the VVPAT machine made mandatory in all Indian elections?', opts: ['2004', '2009', '2014', '2019'], correct: 3, explanation: 'VVPAT machines were made mandatory in all polling stations across India starting from the 2019 Lok Sabha General Elections.' },
  { id: 18, q: 'What is the National Voters\' Day and when is it?', opts: ['March 1 — to promote voter awareness', 'January 25 — celebrating ECI\'s establishment', 'November 26 — celebrating the Constitution', 'August 15 — Independence Day'], correct: 1, explanation: 'January 25th is National Voters\' Day, celebrating the establishment of the Election Commission of India on January 25, 1950. It promotes voter awareness.' },
  { id: 19, q: 'What penalty can an employer face for denying employees leave to vote?', opts: ['No penalty', '₹500 fine', 'Criminal prosecution under election law', '₹100 fine'], correct: 2, explanation: 'Employers are required by law to grant employees paid leave on election day. Denying this leave can result in criminal prosecution under election law.' },
  { id: 20, q: 'How many Lok Sabha constituencies are there in India?', opts: ['400', '452', '543', '600'], correct: 2, explanation: 'India has 543 Lok Sabha constituencies. Each constituency elects one Member of Parliament (MP) by first-past-the-post voting.' },
];

function quizReducer(state, action) {
  switch (action.type) {
    case 'ANSWER': {
      const isCorrect = action.idx === QUESTIONS[state.current].correct;
      return { ...state, answered: action.idx, isCorrect, score: isCorrect ? state.score + 1 : state.score };
    }
    case 'NEXT':
      if (state.current + 1 >= QUESTIONS.length) return { ...state, finished: true };
      return { ...state, current: state.current + 1, answered: null, isCorrect: null };
    case 'RESTART':
      return { current: 0, score: 0, answered: null, isCorrect: null, finished: false };
    default: return state;
  }
}

function getBadge(score, total) {
  const pct = score / total;
  if (pct === 1) return { label: '🏆 Civic Champion!', color: 'var(--primary)' };
  if (pct >= 0.8) return { label: '🥇 Informed Voter!', color: 'var(--accent-dark)' };
  if (pct >= 0.6) return { label: '🥈 Good Citizen!', color: 'var(--secondary-light)' };
  return { label: '🥉 Keep Learning!', color: 'var(--text-secondary)' };
}

export default function ElectionQuiz() {
  const [state, dispatch] = useReducer(quizReducer, { current: 0, score: 0, answered: null, isCorrect: null, finished: false });

  const q = QUESTIONS[state.current];
  const pct = (state.current / QUESTIONS.length) * 100;

  React.useEffect(() => {
    if (state.finished) {
      const score = state.score / QUESTIONS.length;
      confetti({ particleCount: score >= 0.8 ? 150 : 60, spread: 70, colors: ['#FF6B35', '#1B3A6B', '#2ECC71', '#fff'] });
    }
  }, [state.finished]);

  if (state.finished) {
    const badge = getBadge(state.score, QUESTIONS.length);
    return (
      <div style={{ maxWidth: 540, margin: '2rem auto', padding: '1rem', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ borderTop: `4px solid ${badge.color}` }}>
          <div style={{ fontSize: '4rem', margin: '0.5rem 0' }}>{badge.label.split(' ')[0]}</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)', margin: '0.5rem 0' }}>{badge.label.slice(2)}</h2>
          <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: badge.color, margin: '1rem 0' }}>{state.score}/{QUESTIONS.length}</div>
          <div className="progress-bar" style={{ marginBottom: '1.5rem' }}>
            <div className="progress-fill" style={{ width: `${(state.score / QUESTIONS.length) * 100}%` }} />
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {state.score === QUESTIONS.length ? 'Perfect score! You\'re a civic knowledge expert!' : `You got ${state.score} out of ${QUESTIONS.length} questions correct. Keep learning!`}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => dispatch({ type: 'RESTART' })}>🔄 Try Again</button>
            <a href="/chatbot" className="btn btn-secondary">💬 Learn More</a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '2rem auto', padding: '1rem' }}>
      {/* Header + Progress */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--secondary)' }}>Quiz — Election Civic Knowledge</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>{state.current + 1} / {QUESTIONS.length}</span>
        </div>
        <div className="progress-bar" role="progressbar" aria-valuenow={state.current + 1} aria-valuemin={1} aria-valuemax={QUESTIONS.length} aria-label={`Question ${state.current + 1} of ${QUESTIONS.length}`}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>Score: {state.score} ✓</span>
          <span>{QUESTIONS.length - state.current - 1} remaining</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
            <div className="badge badge-navy" style={{ marginBottom: '1rem' }}>Q{state.current + 1}</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>{q.q}</h2>

            <div role="radiogroup" aria-label="Answer options" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {q.opts.map((opt, i) => {
                let bg = 'var(--surface)', border = 'var(--surface-2)', color = 'var(--text-primary)';
                if (state.answered !== null) {
                  if (i === q.correct) { bg = 'rgba(46,204,113,0.15)'; border = 'var(--accent)'; color = 'var(--accent-dark)'; }
                  else if (i === state.answered && !state.isCorrect) { bg = 'rgba(229,62,62,0.12)'; border = 'var(--error)'; color = 'var(--error)'; }
                }
                return (
                  <button
                    key={i}
                    role="radio"
                    aria-checked={state.answered === i}
                    disabled={state.answered !== null}
                    onClick={() => dispatch({ type: 'ANSWER', idx: i })}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: bg, border: `2px solid ${border}`, borderRadius: 'var(--radius)', cursor: state.answered === null ? 'pointer' : 'default', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '0.95rem', color, transition: 'all 0.2s', minHeight: '48px', fontWeight: i === q.correct && state.answered !== null ? 600 : 400 }}
                  >
                    <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: state.answered !== null && i === q.correct ? 'var(--accent)' : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                      {state.answered !== null && i === q.correct ? '✓' : state.answered === i && !state.isCorrect ? '✗' : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {state.answered !== null && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.25rem', background: state.isCorrect ? 'rgba(46,204,113,0.12)' : 'rgba(229,62,62,0.08)', borderLeft: `4px solid ${state.isCorrect ? 'var(--accent)' : 'var(--error)'}`, borderRadius: '0 var(--radius) var(--radius) 0', padding: '0.875rem 1rem' }}>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: state.isCorrect ? 'var(--accent-dark)' : 'var(--error)', marginBottom: '0.3rem' }}>
                  {state.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{q.explanation}</p>
              </motion.div>
            )}
          </div>

          {state.answered !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={() => dispatch({ type: 'NEXT' })}>
                {state.current + 1 >= QUESTIONS.length ? '🏆 See Results' : 'Next Question →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
