import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const STEPS = [
  {
    id: 1, icon: 'âœ…', title: 'Eligibility Check', color: '#3B82F6',
    heading: 'Are You Eligible to Vote?',
    content: [
      { icon: 'ðŸŽ‚', label: 'Age Criteria', desc: 'You must be at least 18 years old on January 1st of the election year.' },
      { icon: 'ðŸ‡®ðŸ‡³', label: 'Citizenship', desc: 'You must be a legally recognized citizen of India.' },
      { icon: 'ðŸ“', label: 'Residency', desc: 'Ordinary resident of the constituency where you wish to vote.' },
      { icon: 'ðŸ§ ', label: 'Legal Standing', desc: 'Not disqualified by any court of law.' },
    ],
    tip: 'Even as a first-time voter, you can start the registration process before your 18th birthday so you\'re ready on day one!',
  },
  {
    id: 2, icon: 'ðŸ“‹', title: 'Register (Form 6)', color: '#8B5CF6',
    heading: 'Register as a New Voter',
    content: [
      { icon: 'ðŸŒ', label: 'Voters Portal', desc: 'Navigate to voters.eci.gov.in and click "New Registration (Form 6)".' },
      { icon: 'ðŸ“„', label: 'Fill Details', desc: 'Accurately enter your personal, family, and address details.' },
      { icon: 'ðŸ“¤', label: 'Submit Application', desc: 'Submit and save the generated Reference Number (URN) for tracking.' },
      { icon: 'â³', label: 'Verification Process', desc: 'A Booth Level Officer (BLO) will verify your details within 2â€“4 weeks.' },
    ],
    tip: 'Registration officially closes roughly 30 days before the election date. Do not wait until the last minute!',
  },
  {
    id: 3, icon: 'ðŸ“', title: 'Documentation', color: '#10B981',
    heading: 'Required Documents',
    content: [
      { icon: 'ðŸªª', label: 'Age Proof', desc: 'Aadhaar card, Passport, Birth Certificate, or 10th Standard Marksheet.' },
      { icon: 'ðŸ ', label: 'Address Proof', desc: 'Aadhaar, utility bills (water/electricity/gas), or registered rent agreement.' },
      { icon: 'ðŸ“¸', label: 'Photographs', desc: 'Recent passport-size color photographs (white background preferred).' },
      { icon: 'ðŸ“±', label: 'Mobile Number', desc: 'Crucial for OTP verification and downloading your digital e-EPIC.' },
    ],
    tip: 'An Aadhaar Card combined with a linked mobile number is the fastest way to get verified seamlessly.',
  },
  {
    id: 4, icon: 'ðŸ“²', title: 'Digital Voter ID', color: '#F59E0B',
    heading: 'Download Your e-EPIC',
    content: [
      { icon: 'ðŸŒ', label: 'Portal Access', desc: 'Log in to voters.eci.gov.in and select "Download e-EPIC".' },
      { icon: 'ðŸ”', label: 'Secure Login', desc: 'Authenticate using the OTP sent to your registered mobile number.' },
      { icon: 'ðŸ”', label: 'Locate Record', desc: 'Search using your EPIC number, Reference ID, or personal details.' },
      { icon: 'ðŸ“¥', label: 'Save Securely', desc: 'Download the encrypted PDF. It carries the exact same legal weight as a physical card.' },
    ],
    tip: 'Link your e-EPIC directly to the DigiLocker app on your smartphone for permanent, offline secure access.',
  },
  {
    id: 5, icon: 'ðŸ“', title: 'Booth Locator', color: '#EF4444',
    heading: 'Find Your Polling Station',
    content: [
      { icon: 'ðŸ¤–', label: 'JanVeda Booth Finder', desc: 'Use our modernized Booth Finder tool to locate your assigned center instantly.' },
      { icon: 'ðŸŒ', label: 'Electoral Search', desc: 'Visit electoralsearch.in to find your name and exact booth room number.' },
      { icon: 'ðŸ“ž', label: 'Helpline 1950', desc: 'Dial 1950 toll-free from any network for automated booth assistance.' },
      { icon: 'ðŸ“„', label: 'Voter Information Slip', desc: 'Your local BLO will physically distribute these slips 5 days prior to the election.' },
    ],
    tip: 'Always do a trial run to your polling booth the day before the election to gauge traffic and travel time.',
  },
  {
    id: 6, icon: 'ðŸ—³ï¸', title: 'Election Day', color: '#14B8A6',
    heading: 'Your Voting Experience',
    content: [
      { icon: 'â°', label: 'Timing Strategy', desc: 'Booths are open 7 AM â€“ 6 PM. Arrive between 7 AM â€“ 9 AM for the shortest queues.' },
      { icon: 'ðŸªª', label: 'Mandatory ID', desc: 'You MUST carry your physical Voter ID, Aadhaar, Passport, or PAN card.' },
      { icon: 'ðŸ”˜', label: 'Casting the Vote', desc: 'Press the blue button on the EVM next to your candidate. Verify the 7-second VVPAT receipt.' },
      { icon: 'ðŸ“µ', label: 'Strict Rules', desc: 'Photography is a criminal offense inside the booth. Keep your phone in your pocket.' },
    ],
    tip: 'Take your time inside the voting compartment. Do not let anyone rush you. Your vote is completely secret!',
  },
];

export default function FirstTimeVoter() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());

  const step = STEPS[currentStep];
  const isCompleted = completed.has(step.id);

  useEffect(() => {
    if (completed.size === STEPS.length) {
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#2563EB', '#10B981', '#F59E0B'] });
    }
  }, [completed]);

  const markDone = () => {
    setCompleted(prev => new Set([...prev, step.id]));
    if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
  };

  const progress = (completed.size / STEPS.length) * 100;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <style>{`
        .ftv-container { display: grid; grid-template-columns: minmax(250px, 320px) 1fr; gap: 3rem; position: relative; }
        .ftv-sidebar { display: block; }
        .ftv-mobile-nav { display: none; }
        .feature-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
        
        @media (max-width: 900px) {
          .ftv-container { grid-template-columns: 1fr; gap: 1.5rem; }
          .ftv-sidebar { display: none; }
          .ftv-mobile-nav { 
            display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 1rem; margin-bottom: 1rem;
            -webkit-overflow-scrolling: touch; scrollbar-width: none; 
          }
          .ftv-mobile-nav::-webkit-scrollbar { display: none; }
        }
      `}</style>

      {/* Hero Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: '#EFF6FF', color: '#2563EB', fontWeight: 800, borderRadius: '50px', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '1rem' }}>Ultimate Guide</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#0F172A', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>The First-Time Voter Masterclass</h1>
        <p style={{ color: '#64748B', fontSize: '1.15rem', maxWidth: 650, margin: '0 auto', lineHeight: 1.6 }}>Your definitive 6-step roadmap. Master the system, secure your digital ID, and confidently cast your first vote.</p>
      </motion.div>

      <div className="ftv-container">
        
        {/* Desktop Sidebar */}
        <div className="ftv-sidebar">
          <div style={{ position: 'sticky', top: '100px', background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
            
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 800, color: '#64748B', marginBottom: '0.8rem', textTransform: 'uppercase' }}>
                <span>Mastery Progress</span>
                <span style={{ color: '#2563EB' }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: '10px', background: '#F1F5F9', borderRadius: '5px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #3B82F6, #6366F1)', borderRadius: '5px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {STEPS.map((s, i) => {
                const isActive = i === currentStep;
                const isDone = completed.has(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStep(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '16px', border: 'none',
                      background: isActive ? `${s.color}15` : 'transparent', cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
                    }}
                    onMouseEnter={e => { if(!isActive && !isDone) e.currentTarget.style.background = '#F8FAFF' }}
                    onMouseLeave={e => { if(!isActive && !isDone) e.currentTarget.style.background = 'transparent' }}
                  >
                    {isActive && <motion.div layoutId="sidebar-active" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: s.color, borderRadius: '4px' }} />}
                    <div style={{ 
                      width: 38, height: 38, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      background: isActive ? s.color : isDone ? '#10B981' : '#F1F5F9', color: isActive || isDone ? 'white' : '#94A3B8',
                      fontSize: '1rem', flexShrink: 0, transition: 'all 0.3s', boxShadow: isActive ? `0 4px 10px ${s.color}40` : 'none'
                    }}>
                      {isDone ? 'âœ“' : s.id}
                    </div>
                    <div style={{ fontWeight: isActive ? 800 : 600, color: isActive ? s.color : isDone ? '#1E293B': '#475569', fontSize: '0.95rem', fontFamily: 'var(--font-heading)' }}>
                      {s.title}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="ftv-mobile-nav">
          {STEPS.map((s, i) => (
             <button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                style={{
                  padding: '0.75rem 1.25rem', borderRadius: '20px', whiteSpace: 'nowrap', border: 'none',
                  background: i === currentStep ? s.color : completed.has(s.id) ? '#10B981' : '#F1F5F9',
                  color: i === currentStep || completed.has(s.id) ? 'white' : '#64748B', fontWeight: 700, fontSize: '0.9rem',
                  boxShadow: i === currentStep ? `0 4px 10px ${s.color}40` : 'none'
                }}
             >
               {completed.has(s.id) ? 'âœ“ ' : ''}{s.title}
             </button>
          ))}
        </div>

        {/* Main Content Pane */}
        <div style={{ minHeight: '500px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={step.id} initial={{ opacity: 0, x: 20, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -20, scale: 0.98 }} transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}>
              
              <div style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', border: '1px solid #F1F5F9' }}>
                {/* Dynamic Header Graphic */}
                <div style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}DD)`, padding: '4rem 2.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: '-5%', top: '-20%', fontSize: '18rem', opacity: 0.1, transform: 'rotate(15deg) scale(1.2)', filter: 'blur(2px)' }}>{step.icon}</div>
                  <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }} />
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ background: 'rgba(255,255,255,0.25)', padding: '0.5rem 1.25rem', borderRadius: '20px', display: 'inline-block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem', backdropFilter: 'blur(10px)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                      Phase {step.id} out of {STEPS.length}
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, margin: 0, textShadow: '0 4px 10px rgba(0,0,0,0.2)', lineHeight: 1.2 }}>{step.heading}</h2>
                  </div>
                </div>

                <div style={{ padding: '3rem 2.5rem' }}>
                  {/* Grid Features */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {step.content.map((item, i) => (
                      <motion.div key={i} className="feature-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} style={{ background: '#F8FAFF', padding: '1.5rem', borderRadius: '24px', border: '1px solid #E2E8F0', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '1.8rem', background: 'white', minWidth: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>{item.icon}</div>
                        <div>
                          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#0F172A', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>{item.label}</h4>
                          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pro Tip Callout */}
                  <div style={{ background: `${step.color}10`, border: `2px solid ${step.color}30`, borderRadius: '24px', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: '-5%', top: '-20%', fontSize: '10rem', opacity: 0.05, filter: 'grayscale(1)' }}>ðŸ’¡</div>
                    <div style={{ fontSize: '2.5rem', filter: `drop-shadow(0 4px 6px ${step.color}40)`, position: 'relative', zIndex: 1 }}>ðŸ’¡</div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h5 style={{ color: step.color, fontWeight: 900, marginBottom: '0.4rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Pro Tip from JanVeda</h5>
                      <p style={{ color: '#1E293B', fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>{step.tip}</p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '2px dashed #E2E8F0', flexWrap: 'wrap', gap: '1rem' }}>
                    <button 
                      onClick={() => setCurrentStep(s => s - 1)} 
                      disabled={currentStep === 0}
                      style={{ padding: '0.8rem 1.5rem', background: 'transparent', border: 'none', color: '#94A3B8', fontWeight: 800, cursor: currentStep === 0 ? 'not-allowed' : 'pointer', opacity: currentStep === 0 ? 0.5 : 1, transition: 'color 0.2s' }}
                      onMouseEnter={e => { if(currentStep !== 0) e.currentTarget.style.color = '#1E293B' }}
                      onMouseLeave={e => { if(currentStep !== 0) e.currentTarget.style.color = '#94A3B8' }}
                    >
                      â† Previous Phase
                    </button>
                    
                    <button
                      onClick={markDone}
                      style={{ padding: '1.25rem 2.5rem', background: isCompleted ? '#10B981' : step.color, color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: `0 10px 25px ${isCompleted ? 'rgba(16,185,129,0.4)' : step.color + '50'}` }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      {isCompleted ? 'âœ… Phase Validated' : currentStep === STEPS.length - 1 ? 'ðŸ Unlock Final Status' : 'Mark Complete & Next â†’'}
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Completion Celebration State */}
          {completed.size === STEPS.length && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '3rem', padding: '4rem 2rem', background: 'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius: '32px', color: 'white', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', border: '1px solid #334155', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at center, #3B82F6 0%, transparent 70%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))' }}>ðŸŽ“</div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', background: 'linear-gradient(to right, #60A5FA, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>You Are Ready!</h2>
                <p style={{ fontSize: '1.2rem', color: '#94A3B8', maxWidth: 600, margin: '0 auto 3rem', lineHeight: 1.7 }}>You have mastered the entire process from start to finish. You are completely equipped to exercise your democratic right with unshakeable confidence.</p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href="/simulator" style={{ textDecoration: 'none', padding: '1.2rem 2.5rem', background: '#3B82F6', color: 'white', borderRadius: '16px', fontWeight: 800, transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ðŸ—³ï¸ Try Mock EVM Screen
                  </a>
                  <a href="/quiz" style={{ textDecoration: 'none', padding: '1.2rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '2px solid #475569', color: 'white', borderRadius: '16px', fontWeight: 800, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor='#94A3B8'; }} onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='#475569'; }}>
                    ðŸ§  Take the Civics Quiz
                  </a>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
