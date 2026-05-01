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
  if (pct === 1) return { label: '🏆 Civic Champion!', desc: 'Flawless! You know exactly how the Indian democratic engine works.', color: '#10B981', bg: 'linear-gradient(135deg, #10B981, #059669)' };
  if (pct >= 0.8) return { label: '🥇 Informed Voter!', desc: 'Incredible score. You are highly educated on your electoral rights.', color: '#3B82F6', bg: 'linear-gradient(135deg, #3B82F6, #2563EB)' };
  if (pct >= 0.6) return { label: '🥈 Good Citizen!', desc: 'Solid attempt! But there is always more to learn about your voting system.', color: '#F59E0B', bg: 'linear-gradient(135deg, #F59E0B, #D97706)' };
  return { label: '🥉 Keep Learning!', desc: 'You need to brush up on your civic knowledge. Knowledge is power!', color: '#64748B', bg: 'linear-gradient(135deg, #64748B, #475569)' };
}

export default function ElectionQuiz() {
  const [state, dispatch] = useReducer(quizReducer, { current: 0, score: 0, answered: null, isCorrect: null, finished: false });

  const q = QUESTIONS[state.current];
  const pct = (state.current / QUESTIONS.length) * 100;

  React.useEffect(() => {
    if (state.finished) {
      const score = state.score / QUESTIONS.length;
      confetti({ particleCount: score >= 0.8 ? 250 : 100, spread: 100, origin: { y: 0.6 }, colors: ['#FF6600', '#2563EB', '#10B981', '#FFFFFF'] });
    }
  }, [state.finished]);

  if (state.finished) {
    const badge = getBadge(state.score, QUESTIONS.length);
    return (
      <div style={{ maxWidth: 640, margin: '4rem auto', padding: '1rem', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', bounce: 0.5 }} style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }}>
          <div style={{ background: badge.bg, padding: '4rem 2rem', color: 'white' }}>
            <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))', marginBottom: '1rem' }}>{badge.label.split(' ')[0]}</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.2)', margin: 0 }}>{badge.label.slice(2)}</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginTop: '1rem', maxWidth: 400, margin: '1rem auto 0' }}>{badge.desc}</p>
          </div>
          
          <div style={{ padding: '3rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '5px', marginBottom: '1rem' }}>
              <span style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: badge.color, lineHeight: 1 }}>{state.score}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#94A3B8', fontFamily: 'var(--font-heading)' }}>/ {QUESTIONS.length}</span>
            </div>
            
            <div style={{ background: '#F1F5F9', height: '12px', borderRadius: '6px', overflow: 'hidden', maxWidth: 300, margin: '0 auto 2rem' }}>
              <div style={{ width: `${(state.score / QUESTIONS.length) * 100}%`, height: '100%', background: badge.color, borderRadius: '6px' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => dispatch({ type: 'RESTART' })} style={{ padding: '1rem 2rem', background: '#F1F5F9', border: 'none', borderRadius: '16px', color: '#1E293B', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'} onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}>
                🔄 Retake Quiz
              </button>
              <a href="/chatbot" style={{ textDecoration: 'none', padding: '1rem 2rem', background: badge.color, border: 'none', borderRadius: '16px', color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 10px 20px ${badge.color}40` }}>
                💬 Explore AI Chatbot
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
      
      {/* Header & HUD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: '#0D3E96', margin: 0 }}>Civic IQ Test</h1>
          <p style={{ color: '#64748B', fontWeight: 500, margin: 0 }}>Mastering the Indian Electoral System</p>
        </div>
        <div style={{ background: 'white', padding: '0.75rem 1.5rem', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', gap: '1.5rem', border: '1px solid #E2E8F0' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Question</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#1E293B' }}>{state.current + 1} <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>/ {QUESTIONS.length}</span></div>
          </div>
          <div style={{ width: '1px', background: '#E2E8F0' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Score</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#10B981' }}>{state.score} ✓</div>
          </div>
        </div>
      </div>

      <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginBottom: '3rem' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #2563EB, #10B981)' }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, scale: 0.98 }} transition={{ duration: 0.3 }}>
          <div style={{ background: 'white', borderRadius: '32px', padding: '3rem 2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid #F1F5F9' }}>
            
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: '#1E293B', fontWeight: 800, marginBottom: '2.5rem', lineHeight: 1.5 }}>
              {q.q}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {q.opts.map((opt, i) => {
                const isSelected = state.answered === i;
                const isCorrectAnswer = i === q.correct;
                const isRevealed = state.answered !== null;
                
                let bg = 'white';
                let border = '#E2E8F0';
                let color = '#334155';
                let shadow = '0 4px 6px rgba(0,0,0,0.02)';

                if (isRevealed) {
                  if (isCorrectAnswer) {
                    bg = '#EFFDF4'; border = '#10B981'; color = '#065F46'; shadow = '0 10px 15px rgba(16,185,129,0.1)';
                  } else if (isSelected && !state.isCorrect) {
                    bg = '#FEF2F2'; border = '#EF4444'; color = '#991B1B';
                  } else {
                    bg = '#F8FAFF'; border = '#F1F5F9'; color = '#94A3B8';
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={isRevealed}
                    onClick={() => dispatch({ type: 'ANSWER', idx: i })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', 
                      background: bg, border: `2px solid ${border}`, borderRadius: '20px', 
                      cursor: isRevealed ? 'default' : 'pointer', textAlign: 'left', 
                      transition: 'all 0.2s', boxShadow: shadow,
                      transform: isSelected && !isCorrectAnswer && isRevealed ? 'scale(0.98)' : 'scale(1)'
                    }}
                    onMouseEnter={e => { if (!isRevealed) { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(37,99,235,0.05)' } }}
                    onMouseLeave={e => { if (!isRevealed) { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)' } }}
                  >
                    <div style={{ 
                      width: 32, height: 32, borderRadius: '50%', background: isRevealed && isCorrectAnswer ? '#10B981' : isSelected && !state.isCorrect ? '#EF4444' : '#F1F5F9', 
                      color: isRevealed && (isCorrectAnswer || isSelected) ? 'white' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, flexShrink: 0 
                    }}>
                      {isRevealed && isCorrectAnswer ? '✓' : isRevealed && isSelected && !state.isCorrect ? '✗' : String.fromCharCode(65 + i)}
                    </div>
                    <span style={{ fontSize: '1.05rem', fontWeight: isRevealed && isCorrectAnswer ? 800 : 600, color }}>{opt}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {state.answered !== null && (
                <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '2.5rem' }} style={{ overflow: 'hidden' }}>
                  <div style={{ background: state.isCorrect ? '#EFFDF4' : '#FEF2F2', borderLeft: `6px solid ${state.isCorrect ? '#10B981' : '#EF4444'}`, borderRadius: '16px', padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{state.isCorrect ? '🎯' : '💡'}</span>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: state.isCorrect ? '#065F46' : '#991B1B', margin: 0 }}>
                        {state.isCorrect ? 'Spot On!' : 'Not Quite Right'}
                      </h4>
                    </div>
                    <p style={{ color: state.isCorrect ? '#064E3B' : '#7F1D1D', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>{q.explanation}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button 
                      onClick={() => dispatch({ type: 'NEXT' })}
                      style={{ padding: '1rem 2.5rem', background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      {state.current + 1 >= QUESTIONS.length ? 'View Final Results 🏆' : 'Next Question ➔'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
