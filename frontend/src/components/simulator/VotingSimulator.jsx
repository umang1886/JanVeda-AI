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
  { id: 1, name: 'Priya Sharma', party: 'Progress Party', symbol: 'ðŸŒ¸', btn: '1', color: '#3B82F6' },
  { id: 2, name: 'Rahul Mehta', party: 'Unity Front', symbol: 'â­', btn: '2', color: '#8B5CF6' },
  { id: 3, name: 'Kavita Patel', party: 'People\'s Alliance', symbol: 'ðŸŒ¿', btn: '3', color: '#10B981' },
  { id: 4, name: 'Arjun Singh', party: 'Bharath Vikas', symbol: 'ðŸ”±', btn: '4', color: '#F59E0B' },
  { id: 5, name: 'NOTA', party: 'None of the Above', symbol: 'âœ—', btn: '5', color: '#64748B' },
];

const PHASE_INFO = {
  [PHASES.ENTER_BOOTH]: { emoji: 'ðŸšª', title: 'Enter the Polling Booth', desc: 'You approach the polling booth. The Presiding Officer checks your name on the electoral roll.', bg: 'linear-gradient(135deg, #1E3A8A, #3B82F6)' },
  [PHASES.SHOW_ID]: { emoji: 'ðŸªª', title: 'Identity Verification', desc: 'Show your Voter ID (EPIC card) to Officer 1 to verify your identity.', bg: 'linear-gradient(135deg, #4C1D95, #8B5CF6)' },
  [PHASES.SIGN_REGISTER]: { emoji: 'âœï¸', title: 'Sign the Register', desc: 'Officer 2 records your serial number in Register 17A and obtains your signature.', bg: 'linear-gradient(135deg, #064E3B, #10B981)' },
  [PHASES.INDELIBLE_INK]: { emoji: 'ðŸ–Šï¸', title: 'Indelible Ink Application', desc: 'Officer 3 applies indelible silver nitrate ink on your left index finger.', bg: 'linear-gradient(135deg, #7F1D1D, #EF4444)' },
  [PHASES.APPROACH_EVM]: { emoji: 'ðŸ—³ï¸', title: 'Approach the EVM', desc: 'Proceed to the secure voting compartment. The Presiding Officer enables the Ballot Unit.', bg: 'linear-gradient(135deg, #92400E, #F59E0B)' },
  [PHASES.SELECT_CANDIDATE]: { emoji: 'ðŸ”˜', title: 'Cast Your Vote', desc: 'Press the blue button next to your chosen candidate. A red LED light will flash.', bg: 'linear-gradient(135deg, #0F172A, #334155)' },
  [PHASES.CONFIRM_VOTE]: { emoji: 'â“', title: 'Confirm Your Choice', desc: 'Carefully confirm your selection before locking it into the machine.', bg: 'linear-gradient(135deg, #1E1B4B, #6366F1)' },
  [PHASES.VVPAT_SLIP]: { emoji: 'ðŸ–¨ï¸', title: 'VVPAT Verification', desc: 'Look at the glass window! A paper slip drops into the sealed box, verifying what you just pressed.', bg: 'linear-gradient(135deg, #022C22, #059669)' },
  [PHASES.VOTE_CAST]: { emoji: 'âœ…', title: 'Vote Successfully Cast', desc: 'A long beep sounds. Your democratic duty is done securely and anonymously.', bg: 'linear-gradient(135deg, #1D4ED8, #60A5FA)' },
  [PHASES.CELEBRATION]: { emoji: 'ðŸŽ‰', title: 'Congratulations!', desc: 'You\'ve completed the simulation. You\'re now an informed voter!', bg: 'linear-gradient(135deg, #0D3E96, #2563EB)' },
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

  useEffect(() => {
    if (state.phase === PHASES.VVPAT_SLIP) {
      vvpatTimer.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    }
    return () => clearInterval(vvpatTimer.current);
  }, [state.phase]);

  useEffect(() => {
    if (state.vvpatSeconds <= 0 && state.phase === PHASES.VVPAT_SLIP) {
      clearInterval(vvpatTimer.current);
      dispatch({ type: 'VVPAT_DONE' });
    }
  }, [state.vvpatSeconds, state.phase]);

  useEffect(() => {
    if (state.phase === PHASES.CELEBRATION) {
      playSuccessChime();
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 }, colors: ['#EF4444', '#2563EB', '#10B981', '#F59E0B'] });
    }
  }, [state.phase]);

  // UI Renders
  if (state.disclaimer) {
    return (
      <div style={{ maxWidth: 640, margin: '2rem auto', padding: '1rem', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', border: '1px solid #E2E8F0' }}>
          <div style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), linear-gradient(135deg, #1E1B4B, #312E81)', padding: '3rem 2rem', color: 'white' }}>
            <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))', marginBottom: '1rem' }}>ðŸ›¡ï¸</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, margin: 0 }}>Secure Sandbox Protocol</h2>
          </div>
          <div style={{ padding: '3rem 2rem' }}>
            <div style={{ background: '#F8FAFF', borderLeft: '4px solid #2563EB', padding: '1.5rem', borderRadius: '16px', marginBottom: '2.5rem', textAlign: 'left' }}>
              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                This is a <strong>high-fidelity interactive simulation</strong> exclusively designed for civic education. All mock-voting data remains entirely local to your browser. No data leaves your device.
              </p>
            </div>
            <button 
              onClick={() => dispatch({ type: 'DISMISS_DISCLAIMER' })}
              style={{ width: '100%', maxWidth: '350px', padding: '1.25rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(37,99,235,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Acknowledge & Initiate
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (state.phase === PHASES.IDLE) {
    return (
      <div style={{ maxWidth: 640, margin: '2rem auto', padding: '1rem', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
          <div style={{ background: 'linear-gradient(135deg, #0D3E96, #2563EB)', padding: '4rem 2rem', color: 'white', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)' }}></div>
            <div style={{ fontSize: '5rem', position: 'relative', zIndex: 1, textShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>ðŸ—³ï¸</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 900, marginTop: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative', zIndex: 1 }}>Digital EVM Simulator</h2>
          </div>
          <div style={{ padding: '3rem 2rem' }}>
            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Experience the entire architectural workflow of an Indian Election booth. Master the <strong>8 strict verification phases</strong> required to securely cast your vote in real life.
            </p>
            <button 
              onClick={() => dispatch({ type: 'NEXT' })}
              style={{ width: '100%', maxWidth: '350px', padding: '1.25rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(16,185,129,0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span>Step Into Virtual Booth</span>
              <span style={{ fontSize: '1.2rem' }}>â†’</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const info = PHASE_INFO[state.phase] || PHASE_INFO[PHASES.ENTER_BOOTH];

  return (
    <div style={{ maxWidth: 850, margin: '2rem auto', padding: '1rem', position: 'relative' }}>
      <style>{`
        .evm-btn-container {
          display: flex; align-items: center; background: white; border-radius: 12px; padding: 0.5rem;
          border: 2px solid #CBD5E1; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: all 0.2s;
        }
        .evm-btn-container:hover { border-color: #94A3B8; transform: translateY(-1px); }
        .evm-btn-press {
          width: 50px; height: 35px; border-radius: 20px; background: radial-gradient(circle at 30% 30%, #3B82F6, #1D4ED8);
          border: none; border-bottom: 6px solid #1E3A8A; cursor: pointer; outline: none; transition: transform 0.1s, border-width 0.1s;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3);
        }
        .evm-btn-press:active { transform: translateY(6px); border-bottom: 0px solid #1E3A8A; }
        .evm-led {
          width: 16px; height: 16px; border-radius: 50%; opacity: 0.15; border: 1px solid #7F1D1D;
          background: #EF4444; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); transition: opacity 0.2s, box-shadow 0.2s;
        }
        .evm-btn-container:active .evm-led {
          opacity: 1; background: #EF4444; box-shadow: 0 0 15px #DC2626, inset 0 1px 2px rgba(255,255,255,0.8);
        }
        @keyframes printReceipt {
          0% { transform: translateY(-100%); }
          20% { transform: translateY(10%); }
          80% { transform: translateY(10%); }
          100% { transform: translateY(150%); opacity: 0; }
        }
        .receipt-anim { animation: printReceipt 7s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}</style>
      
      {/* Top Progress HUD */}
      <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ width: 45, height: 45, borderRadius: '14px', background: '#F8FAFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid #E2E8F0', flexShrink: 0 }}>
          â³
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>Progression Timeline</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10B981' }}>
              Phase {Object.values(PHASES).indexOf(state.phase)} of {Object.keys(PHASES).length - 1}
            </span>
          </div>
          <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', background: 'linear-gradient(90deg, #3B82F6, #10B981)', borderRadius: '4px' }} 
              initial={{ width: 0 }}
              animate={{ width: `${(Object.values(PHASES).indexOf(state.phase) / (Object.keys(PHASES).length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={state.phase} 
          initial={{ opacity: 0, scale: 0.98, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.98, y: -10 }} 
          transition={{ duration: 0.3 }}
        >
          
          {/* Phase: EVM INTERFACE (Hyper-realistic) */}
          {state.phase === PHASES.SELECT_CANDIDATE ? (
             <div style={{ background: 'linear-gradient(145deg, #1E293B, #0F172A)', padding: 'clamp(1rem, 3vw, 2.5rem)', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)' }}>
               {/* EVM Top Header */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A', padding: '1rem 1.5rem', borderRadius: '20px', marginBottom: '1.5rem', border: '1px solid #334155', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                     <h3 style={{ margin: 0, color: '#E2E8F0', fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '2px' }}>BALLOT UNIT</h3>
                   </div>
                   <div style={{ color: '#64748B', fontSize: '0.65rem', fontWeight: 800, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Property of Election Commission</div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Status</div>
                   <div style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 800, fontFamily: 'monospace', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '4px' }}>READY</div>
                 </div>
               </div>

               {/* EVM Hardware Panel */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'linear-gradient(to bottom, #d4dbdf, #c0c6c9)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '24px', boxShadow: 'inset 0 4px 10px rgba(255,255,255,0.5), inset 0 -4px 10px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.3)' }}>
                 {CANDIDATES.map((c, idx) => (
                   <div key={c.id} className="evm-btn-container" style={{ position: 'relative' }}>
                     <div style={{ width: 'clamp(40px, 10vw, 50px)', textAlign: 'center', fontSize: '1.3rem', fontWeight: 900, color: '#475569', borderRight: '2px solid #E2E8F0' }}>{c.btn}</div>
                     
                     <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem clamp(0.5rem, 2vw, 1.5rem)', flex: 1 }}>
                       <div style={{ flex: 1, minWidth: 0 }}>
                         <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                         <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', color: '#64748B', fontWeight: 700 }}>{c.party}</div>
                       </div>
                       <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.15))', padding: '0 clamp(0.5rem, 2vw, 1rem)' }}>{c.symbol}</div>
                     </div>
                     
                     <div style={{ padding: '0 clamp(0.5rem, 2vw, 1.5rem)', borderLeft: '2px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 3vw, 1.5rem)' }}>
                       {/* Arrow indicator (braille mockup) */}
                       <div style={{ fontSize: '1rem', color: '#94A3B8', fontWeight: 900, display: 'none', md: { display: 'block' } }}>â†’</div>
                       {/* Red LED */}
                       <div className="evm-led" />
                       {/* Physical Button */}
                       <button
                         onClick={() => { playEVMBeep(); dispatch({ type: 'SELECT_CANDIDATE', candidate: c }); }}
                         className="evm-btn-press"
                         aria-label={`Vote for ${c.name}`}
                       />
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          ) : state.phase === PHASES.CONFIRM_VOTE ? (
             <div style={{ background: 'white', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 3vw, 3rem)', borderRadius: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', textAlign: 'center', border: '1px solid #E2E8F0' }}>
               <div style={{ background: '#EFF6FF', width: 90, height: 90, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '3rem', border: '8px solid #F8FAFF' }}>ðŸ”</div>
               <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#1E293B', fontWeight: 900, marginBottom: '2rem' }}>Audit Your Selection</h2>
               
               <div style={{ display: 'inline-block', background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '2.5rem 3.5rem', marginBottom: '2.5rem', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}>
                 <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.1))', marginBottom: '1rem' }}>{state.selectedCandidate?.symbol}</div>
                 <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 900, color: '#0F172A' }}>{state.selectedCandidate?.name}</div>
                 <div style={{ color: '#64748B', fontWeight: 700, fontSize: '1rem', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{state.selectedCandidate?.party}</div>
               </div>

               <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                 <button onClick={() => dispatch({ type: 'BACK_TO_EVM' })} style={{ padding: '1.25rem 2rem', background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '16px', cursor: 'pointer', fontWeight: 800, color: '#64748B', fontSize: '1rem', transition: 'all 0.2s', width: '100%', maxWidth: '250px' }} onMouseEnter={e => { e.currentTarget.style.background='#F1F5F9'; e.currentTarget.style.color='#1E293B' }} onMouseLeave={e => { e.currentTarget.style.background='#F8FAFF'; e.currentTarget.style.color='#64748B' }}>â† Retract Selection</button>
                 <button onClick={() => dispatch({ type: 'CONFIRM' })} style={{ padding: '1.25rem 2rem', background: '#10B981', border: 'none', borderRadius: '16px', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(16,185,129,0.2)', fontSize: '1rem', transition: 'transform 0.2s', width: '100%', maxWidth: '250px' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>âœ“ Lock Choice to EVM</button>
               </div>
             </div>
          ) : state.phase === PHASES.VVPAT_SLIP ? (
             <div style={{ background: '#0F172A', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 3vw, 2rem)', borderRadius: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
               <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'white', fontWeight: 900, marginBottom: '1rem' }}>VVPAT Receipt Validation</h2>
               <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: 450, margin: '0 auto 2.5rem', lineHeight: 1.6 }}>The machine has printed your encrypted receipt. Observe the secure glass window to verify your vote was cast correctly.</p>
               
               {/* 3D VVPAT Window Mockup */}
               <div style={{ position: 'relative', width: '240px', height: '320px', margin: '0 auto', background: '#1E293B', border: '12px solid #334155', borderRadius: '16px', overflow: 'hidden', boxShadow: 'inset 0 15px 40px rgba(0,0,0,0.9), 0 20px 40px rgba(0,0,0,0.5)' }}>
                 {/* Glass reflection effect */}
                 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)', zIndex: 3, pointerEvents: 'none' }} />
                 {/* Internal Green light simulating VVPAT glass illumination */}
                 <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(16,185,129,0.2) 0%, transparent 70%)', zIndex: 1 }} />
                 
                 {/* The Printed Paper Slip */}
                 <div className="receipt-anim" style={{ width: '160px', margin: '0 auto', background: '#FFFDF0', padding: '1.5rem', color: 'black', fontFamily: '"Courier New", Courier, monospace', textAlign: 'center', position: 'relative', zIndex: 2, boxShadow: '0 10px 20px rgba(0,0,0,0.5)', border: '1px solid rgba(0,0,0,0.1)' }}>
                   <div style={{ borderBottom: '1.5px dashed #64748B', paddingBottom: '0.5rem', marginBottom: '0.8rem', fontSize: '0.75rem', color: '#475569', fontWeight: 700 }}>ECI OFFICIAL RECORD</div>
                   <div style={{ fontSize: '3.5rem', margin: '0.5rem 0', filter: 'grayscale(100%) contrast(150%)' }}>{state.selectedCandidate?.symbol}</div>
                   <div style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{state.selectedCandidate?.name}</div>
                   <div style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>{state.selectedCandidate?.party}</div>
                   <div style={{ borderTop: '1.5px dashed #64748B', paddingTop: '0.5rem', marginTop: '0.8rem', fontSize: '0.75rem', fontWeight: 700 }}>VERIFICATION SLIP</div>
                 </div>
               </div>

               <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#EF4444', animation: 'pulsate 1s infinite' }} />
                 <div style={{ fontSize: '3.5rem', fontFamily: 'monospace', fontWeight: 900, color: '#10B981', textShadow: '0 0 20px rgba(16,185,129,0.4)', letterSpacing: '2px' }}>
                   00:0{state.vvpatSeconds}
                 </div>
               </div>
             </div>
          ) : state.phase === PHASES.CELEBRATION ? (
             <div style={{ background: 'white', padding: '4rem 2rem', borderRadius: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', textAlign: 'center', border: '1px solid #E2E8F0' }}>
               <div style={{ fontSize: '5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}>ðŸŽ‰</div>
               <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, color: '#0D3E96', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Simulation Successful</h2>
               <p style={{ color: '#475569', fontSize: '1.15rem', maxWidth: 550, margin: '0 auto 3rem', lineHeight: 1.7 }}>You executed the 8-phase protocol perfectly. Your private vote was securely registered in the Control Unit. You are exceptionally prepared for democracy!</p>
               
               <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                 <button onClick={() => dispatch({ type: 'RESET' })} style={{ padding: '1.25rem 2.5rem', background: '#F1F5F9', color: '#1E293B', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s', width: '100%', maxWidth: '240px' }} onMouseEnter={e=>e.currentTarget.style.background='#E2E8F0'} onMouseLeave={e=>e.currentTarget.style.background='#F1F5F9'}>
                   ðŸ”„ Reboot Simulator
                 </button>
                 <a href="/quiz" style={{ textDecoration: 'none', padding: '1.25rem 2.5rem', background: '#2563EB', color: 'white', borderRadius: '16px', fontWeight: 800, fontSize: '1.05rem', boxShadow: '0 10px 20px rgba(37,99,235,0.3)', width: '100%', maxWidth: '240px' }}>
                   Take Civics Quiz âž”
                 </a>
               </div>
             </div>
          ) : (
             /* Generic Step Screen for Standard Phases (Booth Entry, Identification, Ink, etc) */
             <div style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
               <div style={{ background: info.bg, padding: 'clamp(3rem, 5vw, 5rem) 2rem', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
                 <div style={{ position: 'relative', zIndex: 1 }}>
                   <div style={{ fontSize: 'clamp(3.5rem, 6vw, 4.5rem)', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))', marginBottom: '1.5rem' }}>{info.emoji}</div>
                   <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.3rem)', fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.2)', margin: 0, letterSpacing: '-0.02em' }}>{info.title}</h2>
                 </div>
               </div>
               
               <div style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 2rem', textAlign: 'center' }}>
                 <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.7, margin: '0 auto 3rem', maxWidth: 550 }}>{info.desc}</p>
                 <button 
                   onClick={() => dispatch({ type: 'NEXT' })}
                   style={{ width: '100%', maxWidth: '300px', padding: '1.25rem', background: '#0F172A', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                   onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                   onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                 >
                   Proceed Formally <span>â†’</span>
                 </button>
               </div>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
