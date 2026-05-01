import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const PHASES = [
  { id: 1, icon: '📢', name: 'Election Announcement', color: '#FF6B35', start: '2026-03-01', end: '2026-03-07', description: 'The Election Commission of India announces the election schedule — dates for nominations, voting, and counting. Observe Model Code of Conduct begins.', citizenAction: 'Check your voter registration is up to date. Verify your name on the electoral roll at electoralsearch.in' },
  { id: 2, icon: '📋', name: 'Voter Roll Update', color: '#1B3A6B', start: '2026-03-07', end: '2026-03-15', description: 'The electoral roll (voter list) is finalized. Last chance to register or correct your details before the deadline (30 days prior to election).', citizenAction: 'If not registered, go to voters.eci.gov.in and file Form 6 immediately. Check your address is correct.' },
  { id: 3, icon: '📝', name: 'Candidate Nomination', color: '#9B59B6', start: '2026-03-15', end: '2026-03-22', description: 'Candidates file their nomination papers with the Returning Officer, along with affidavits declaring assets, liabilities, and criminal records.', citizenAction: 'Research candidates — read their affidavits on affidavitarchive.eci.gov.in. Know who is contesting in your constituency.' },
  { id: 4, icon: '📣', name: 'Election Campaigning', color: '#F6AD55', start: '2026-03-22', end: '2026-04-10', description: 'Parties and candidates hold rallies, door-to-door campaigns, and media outreach. Model Code of Conduct prevents government from announcing new schemes.', citizenAction: 'Attend public meetings, watch debates, read party manifestos. Make an informed voting decision. Report violations via cVIGIL.' },
  { id: 5, icon: '🗳️', name: 'Voting Day', color: '#2ECC71', start: '2026-04-12', end: '2026-04-12', description: 'Polling day! Booths open 7 AM – 6 PM. Voters cast their votes on the Electronic Voting Machine. VVPAT provides paper verification.', citizenAction: 'Carry your Voter ID (or alternate photo ID). Check your booth location. Vote in the morning to avoid queues. Do NOT photograph inside the booth.' },
  { id: 6, icon: '🔢', name: 'Vote Counting', color: '#E53E3E', start: '2026-04-15', end: '2026-04-15', description: 'EVMs are opened at counting centers. Candidate agents observe the count. Results are announced seat by seat throughout the day.', citizenAction: 'Watch live on Doordarshan or ECI\'s official results portal (results.eci.gov.in). First-past-the-post determines the winner.' },
  { id: 7, icon: '🏆', name: 'Results & Government Formation', color: '#27AE60', start: '2026-04-16', end: '2026-04-20', description: 'Winning candidates are declared by the Returning Officers. The winning party or coalition forms the government and the new leadership is sworn in.', citizenAction: 'Stay informed about the new government\'s priorities. Engage with your elected representative through their offices.' },
];

const TODAY = new Date('2026-04-25'); // Hardcoded mock date

function getCurrentPhase() {
  for (let i = 0; i < PHASES.length; i++) {
    const s = new Date(PHASES[i].start), e = new Date(PHASES[i].end);
    if (TODAY >= s && TODAY <= e) return PHASES[i].id;
  }
  if (TODAY > new Date(PHASES[PHASES.length - 1].end)) return PHASES.length + 1; // Completed
  return 1;
}

export default function ElectionTimeline() {
  const [expanded, setExpanded] = useState(null);
  const currentPhase = getCurrentPhase();

  // Auto-expand the current phase
  useEffect(() => {
    if (currentPhase <= PHASES.length) setExpanded(currentPhase);
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', textShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>🗓️</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, color: '#0D3E96', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>The Election Timeline</h1>
        <p style={{ color: '#64748B', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>Tracking the complete 7-phase lifecycle of the world's largest democratic exercise.</p>
        
        {/* Progress HUD */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem 2rem', marginTop: '2.5rem', boxShadow: '0 10px 30px rgba(37,99,235,0.08)', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Current Status</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#1E293B' }}>{currentPhase > PHASES.length ? 'Elections Concluded' : `Phase ${currentPhase} Active`}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 800, color: '#2563EB' }}>
              {Math.min(100, Math.round(((currentPhase - 1) / PHASES.length) * 100))}% Complete
            </div>
            <div style={{ height: '10px', background: '#F1F5F9', borderRadius: '5px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${Math.min(100, ((currentPhase - 1) / PHASES.length) * 100)}%` }} 
                style={{ height: '100%', background: 'linear-gradient(90deg, #3B82F6, #10B981)', borderRadius: '5px' }} 
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vertical Timeline container */}
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* Central Line */}
        <div style={{ position: 'absolute', left: '2rem', top: '1rem', bottom: '1rem', width: '4px', background: 'linear-gradient(to bottom, #E2E8F0 0%, #E2E8F0 100%)', transform: 'translateX(-50%)', borderRadius: '2px', zIndex: 0 }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {PHASES.map((phase, i) => {
            const isActive = phase.id === currentPhase;
            const isPast = phase.id < currentPhase;
            const isOpen = expanded === phase.id;

            return (
              <motion.article
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                {/* Node Dot / Icon */}
                <div 
                  onClick={() => setExpanded(isOpen ? null : phase.id)}
                  style={{ 
                    position: 'absolute', left: 0, top: '24px', transform: 'translate(-50%, -50%)', 
                    width: isActive ? 56 : 44, height: isActive ? 56 : 44, borderRadius: '50%', 
                    background: isActive ? phase.color : isPast ? '#10B981' : 'white',
                    border: `4px solid ${isActive ? 'rgba(255,255,255,0.8)' : isPast ? 'white' : '#CBD5E1'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isActive ? '1.5rem' : '1.2rem', boxShadow: isActive ? `0 0 0 6px ${phase.color}30` : isPast ? '0 0 0 2px #10B98130' : 'none',
                    cursor: 'pointer', zIndex: 2, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', color: isActive || isPast ? 'white' : '#94A3B8'
                  }}
                >
                  {isPast ? '✓' : phase.icon}
                </div>

                {/* Content Card */}
                <div style={{ paddingLeft: '2.5rem' }}>
                  <div 
                    onClick={() => setExpanded(isOpen ? null : phase.id)}
                    style={{ 
                      background: 'white', border: `2px solid ${isActive ? phase.color : isOpen ? '#CBD5E1' : '#F1F5F9'}`, borderRadius: '20px', 
                      overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease',
                      boxShadow: isActive ? `0 15px 30px ${phase.color}20` : isOpen ? '0 10px 20px rgba(0,0,0,0.05)' : '0 2px 5px rgba(0,0,0,0.02)'
                    }}
                  >
                    {/* Card Header */}
                    <div style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', background: isActive ? `${phase.color}08` : 'white' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase', color: isPast ? '#10B981' : isActive ? phase.color : '#94A3B8', letterSpacing: '1px', marginBottom: '0.4rem' }}>
                          Phase {phase.id} {isActive && '— Live Now'}
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>{phase.name}</h3>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Timeframe</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', fontFamily: 'var(--font-heading)', background: '#F1F5F9', padding: '0.3rem 0.8rem', borderRadius: '10px', marginTop: '0.3rem' }}>
                          {phase.start === phase.end ? format(new Date(phase.start), 'MMM d, yyyy') : `${format(new Date(phase.start), 'MMM d')} – ${format(new Date(phase.end), 'MMM d')}`}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                          <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid #F1F5F9' }}>
                            <div style={{ padding: '1rem 0' }}>
                              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{phase.description}</p>
                              
                              <div style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '1.5rem', background: 'white', padding: '0.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>🎯</div>
                                <div>
                                  <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>Your Action Required</div>
                                  <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>{phase.citizenAction}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
