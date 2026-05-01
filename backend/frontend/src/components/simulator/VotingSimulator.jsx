import React, { useReducer, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playEVMBeep, playSuccessChime } from '../../utils/audio';
import confetti from 'canvas-confetti';

const PHASES = {
  IDLE: 'idle', ENTER_BOOTH: 'enter_booth', SHOW_ID: 'show_id',
  SIGN_REGISTER: 'sign_register', INDELIBLE_INK: 'indelible_ink',
  APPROACH_EVM: 'approach_evm', SELECT_CANDIDATE: 'select_candidate',
  CONFIRM_VOTE: 'confirm_vote', VVPAT_SLIP: 'vvpat_slip',
  VOTE_CAST: 'vote_cast', CELEBRATION: 'celebration',
};

const TRANSITIONS = {
  [PHASES.IDLE]: PHASES.ENTER_BOOTH, [PHASES.ENTER_BOOTH]: PHASES.SHOW_ID,
  [PHASES.SHOW_ID]: PHASES.SIGN_REGISTER, [PHASES.SIGN_REGISTER]: PHASES.INDELIBLE_INK,
  [PHASES.INDELIBLE_INK]: PHASES.APPROACH_EVM, [PHASES.APPROACH_EVM]: PHASES.SELECT_CANDIDATE,
  [PHASES.CONFIRM_VOTE]: PHASES.VVPAT_SLIP, [PHASES.VVPAT_SLIP]: PHASES.VOTE_CAST,
  [PHASES.VOTE_CAST]: PHASES.CELEBRATION,
};

const CANDIDATES = [
  { id: 1, name: 'Priya Sharma', party: 'Progress Party', symbol: '🌸', btn: '1' },
  { id: 2, name: 'Rahul Mehta', party: 'Unity Front', symbol: '⭐', btn: '2' },
  { id: 3, name: 'Kavita Patel', party: 'People\'s Alliance', symbol: '🌿', btn: '3' },
  { id: 4, name: 'Arjun Singh', party: 'Bharath Vikas', symbol: '🔱', btn: '4' },
  { id: 5, name: 'NOTA', party: 'None of the Above', symbol: '✗', btn: '5' },
];

const PHASE_INFO = {
  [PHASES.ENTER_BOOTH]: { emoji: '🚪', title: 'Enter the Polling Booth', desc: 'You approach the polling booth. The Presiding Officer greets you and checks your name in the voter roll.' },
  [PHASES.SHOW_ID]: { emoji: '🪪', title: 'Show Your ID', desc: 'The officer verifies your identity. Show your Voter ID (EPIC card) or any other valid photo ID.' },
  [PHASES.SIGN_REGISTER]: { emoji: '✍️', title: 'Sign the Register', desc: 'You sign (or give thumb impression) in the Electoral Roll register. The officer marks you as "voted".' },
  [PHASES.INDELIBLE_INK]: { emoji: '🖊️', title: 'Indelible Ink', desc: 'The officer applies indelible ink on your left index finger. This ink cannot be easily removed and prevents double voting.' },
  [PHASES.APPROACH_EVM]: { emoji: '🗳️', title: 'Approach the EVM', desc: 'You walk to the voting compartment. The Presiding Officer enables the EVM. You are alone — your vote is private.' },
  [PHASES.SELECT_CANDIDATE]: { emoji: '🔘', title: 'Cast Your Vote', desc: 'Press the button next to your chosen candidate. The blue LED will blink and you\'ll hear a beep.' },
  [PHASES.CONFIRM_VOTE]: { emoji: '❓', title: 'Confirm Your Vote', desc: 'Confirm before your vote is final.' },
  [PHASES.VVPAT_SLIP]: { emoji: '🖨️', title: 'VVPAT Paper Slip', desc: 'A paper slip appears showing your candidate\'s name and symbol. It\'s visible for 7 seconds, then drops into the sealed box.' },
  [PHASES.VOTE_CAST]: { emoji: '✅', title: 'Vote Cast!', desc: 'Your vote has been successfully cast. The process took under 5 minutes.' },
  [PHASES.CELEBRATION]: { emoji: '🎉', title: 'Congratulations!', desc: 'You\'ve completed the voting simulation! You\'re now ready to vote in real elections!' },
};

const initialState = { phase: PHASES.IDLE, selectedCandidate: null, vvpatSeconds: 7, disclaimer: true };

function simulatorReducer(state, action) {
  switch (action.type) {
    case 'NEXT': return { ...state, phase: TRANSITIONS[state.phase] || state.phase };
    case 'SELECT_CANDIDATE': return { ...state, selectedCandidate: action.candidate, phase: PHASES.CONFIRM_VOTE };
    case 'CONFIRM': return { ...state, phase: PHASES.VVPAT_SLIP, vvpatSeconds: 7 };
    case 'BACK_TO_EVM': return { ...state, phase: PHASES.SELECT_CANDIDATE, selectedCandidate: null };
    case 'TICK': return { ...state, vvpatSeconds: state.vvpatSeconds - 1 };
    case 'VVPAT_DONE': return { ...state, phase: PHASES.VOTE_CAST };
    case 'RESET': return { ...initialState, disclaimer: false };
    case 'DISMISS_DISCLAIMER': return { ...state, disclaimer: false };
    default: return state;
  }
}

export default function VotingSimulator() {
  const [state, dispatch] = useReducer(simulatorReducer, initialState);
  const vvpatTimer = useRef(null);

  // VVPAT 7-second countdown
  useEffect(() => {
    if (state.phase === PHASES.VVPAT_SLIP) {
      vvpatTimer.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    return () => clearInterval(vvpatTimer.current);
  }, [state.phase]);

  useEffect(() => {
    if (state.vvpatSeconds <= 0 && state.phase === PHASES.VVPAT_SLIP) {
      clearInterval(vvpatTimer.current);
      dispatch({ type: 'VVPAT_DONE' });
    }
  }, [state.vvpatSeconds, state.phase]);

  // Confetti on celebration
  useEffect(() => {
    if (state.phase === PHASES.CELEBRATION) {
      playSuccessChime();
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 }, colors: ['#FF6B35', '#1B3A6B', '#2ECC71', '#ffffff'] });
    }
  }, [state.phase]);

  if (state.disclaimer) {
    return (
      <div style={{ maxWidth: 500, margin: '3rem auto', padding: '2rem', textAlign: 'center' }}>
        <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)', marginBottom: '0.75rem' }}>Simulation Disclaimer</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            This is a <strong>simulation only</strong> for educational purposes. No real votes are cast. This demonstrates the actual voting process used in Indian elections.
          </p>
          <button className="btn btn-primary" onClick={() => dispatch({ type: 'DISMISS_DISCLAIMER' })} style={{ width: '100%', justifyContent: 'center' }}>
            I Understand — Start Simulation
          </button>
        </div>
      </div>
    );
  }

  if (state.phase === PHASES.IDLE) {
    return (
      <div style={{ maxWidth: 500, margin: '3rem auto', padding: '1rem', textAlign: 'center' }}>
        <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗳️</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)', marginBottom: '0.75rem' }}>EVM Voting Simulator</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Experience all 8 phases of the actual voting process — from entering the booth to casting your vote on the EVM.
          </p>
          <button className="btn btn-primary" onClick={() => dispatch({ type: 'NEXT' })} style={{ width: '100%', justifyContent: 'center' }}>
            🚀 Start Simulation
          </button>
        </div>
      </div>
    );
  }

  const info = PHASE_INFO[state.phase];

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--secondary)', fontSize: '0.875rem' }}>
            Step {Object.values(PHASES).indexOf(state.phase)} / {Object.keys(PHASES).length - 1}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>100% Client-Side — No API calls</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(Object.values(PHASES).indexOf(state.phase) / (Object.keys(PHASES).length - 1)) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={state.phase} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          {/* EVM SELECT CANDIDATE phase */}
          {state.phase === PHASES.SELECT_CANDIDATE ? (
            <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem' }}>🗳️</div>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)', margin: '0.5rem 0' }}>Electronic Voting Machine</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Press the button next to your chosen candidate</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {CANDIDATES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { playEVMBeep(); dispatch({ type: 'SELECT_CANDIDATE', candidate: c }); }}
                    aria-label={`Vote for ${c.name}, ${c.party}, button number ${c.btn}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem',
                      background: 'var(--surface)', border: '2px solid var(--surface-2)', borderRadius: 'var(--radius)',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease', minHeight: '56px',
                      fontFamily: 'var(--font-body)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(27,58,107,0.08)'; e.currentTarget.style.borderColor = 'var(--secondary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--surface-2)'; }}
                  >
                    <span style={{ background: 'var(--secondary)', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                      {c.btn}
                    </span>
                    <span style={{ fontSize: '1.4rem' }}>{c.symbol}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{c.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.party}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.8rem' }}>PRESS →</span>
                  </button>
                ))}
              </div>
            </div>
          ) : state.phase === PHASES.CONFIRM_VOTE ? (
            <div className="card" style={{ borderTop: '4px solid var(--primary)', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>❓</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)' }}>Confirm Your Vote</h2>
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '1.5rem', margin: '1.5rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{state.selectedCandidate?.symbol}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)' }}>{state.selectedCandidate?.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{state.selectedCandidate?.party}</div>
              </div>
              <p style={{ color: 'var(--error)', fontWeight: 600, marginBottom: '1.5rem', fontSize: '0.9rem' }}>⚠️ Once confirmed, your vote cannot be changed.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => dispatch({ type: 'BACK_TO_EVM' })}>← Change</button>
                <button className="btn btn-primary" onClick={() => dispatch({ type: 'CONFIRM' })}>✅ Confirm Vote</button>
              </div>
            </div>
          ) : state.phase === PHASES.VVPAT_SLIP ? (
            <div className="card" style={{ borderTop: '4px solid var(--accent)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🖨️</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)', marginBottom: '0.5rem' }}>VVPAT Paper Slip</h2>
              <div role="timer" aria-label={`${state.vvpatSeconds} seconds remaining`} style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)', margin: '0.5rem 0' }}>
                {state.vvpatSeconds}s
              </div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ background: 'var(--surface)', border: '2px dashed var(--accent)', borderRadius: 'var(--radius)', padding: '1.25rem', margin: '1rem auto', maxWidth: '280px' }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{state.selectedCandidate?.symbol}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{state.selectedCandidate?.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{state.selectedCandidate?.party}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Verify your vote ✓</div>
              </motion.div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Slip visible through glass window. Auto-drops into sealed box.</p>
            </div>
          ) : state.phase === PHASES.CELEBRATION ? (
            <div className="card" style={{ borderTop: '4px solid var(--accent)', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)', fontSize: '1.75rem' }}>You're Ready to Vote!</h2>
              <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 1.5rem' }}>You completed all 8 phases of the voting simulation. You now know exactly what to expect on election day!</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => dispatch({ type: 'RESET' })}>🔄 Try Again</button>
                <a href="/chatbot" className="btn btn-secondary">💬 Ask Questions</a>
              </div>
            </div>
          ) : (
            <div className="card" style={{ borderTop: `4px solid var(--primary)`, textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }} aria-hidden="true">{info?.emoji}</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)', marginBottom: '0.75rem' }}>{info?.title}</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem' }}>{info?.desc}</p>
              <button className="btn btn-primary" onClick={() => dispatch({ type: 'NEXT' })} style={{ width: '100%', maxWidth: 280, justifyContent: 'center' }}>
                Continue →
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
