import React, { useState } from 'react';
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

const TODAY = new Date('2026-04-25');

function getCurrentPhase() {
  for (let i = 0; i < PHASES.length; i++) {
    const s = new Date(PHASES[i].start), e = new Date(PHASES[i].end);
    if (TODAY >= s && TODAY <= e) return PHASES[i].id;
  }
  if (TODAY > new Date(PHASES[PHASES.length - 1].end)) return PHASES.length;
  return 1;
}

export default function ElectionTimeline() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  const currentPhase = getCurrentPhase();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title">Election Timeline</h1>
        <p className="section-subtitle">The complete 7-phase election lifecycle</p>
        {/* Progress */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--secondary)' }}>Overall Progress</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{Math.round((currentPhase / PHASES.length) * 100)}%</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${(currentPhase / PHASES.length) * 100}%` }} /></div>
        </div>
      </div>

      {/* Phases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {PHASES.map((phase, i) => {
          const isActive = phase.id === currentPhase;
          const isDone = phase.id < currentPhase;
          const isOpen = expanded === phase.id;
          return (
            <article
              key={phase.id}
              role="region"
              aria-label={`Phase ${phase.id}: ${phase.name}`}
              aria-expanded={isOpen}
              style={{ borderRadius: 'var(--radius-lg)', border: `2px solid ${isActive ? phase.color : 'var(--surface-2)'}`, background: 'white', overflow: 'hidden', boxShadow: isActive ? `0 4px 20px ${phase.color}30` : 'var(--shadow-sm)', transition: 'all 0.3s ease' }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : phase.id)}
                style={{ width: '100%', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}
                aria-expanded={isOpen}
              >
                <span style={{ fontSize: '1.75rem', flexShrink: 0 }} aria-hidden="true">{phase.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--secondary)' }}>{phase.name}</span>
                    {isActive && <span className="badge badge-primary" style={{ animation: 'pulse 2s ease infinite' }}>📍 You Are Here</span>}
                    {isDone && <span className="badge badge-success">✅ Complete</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontFamily: 'var(--font-heading)' }}>
                    {phase.start === phase.end ? format(new Date(phase.start), 'MMM d, yyyy') : `${format(new Date(phase.start), 'MMM d')} – ${format(new Date(phase.end), 'MMM d, yyyy')}`}
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} aria-hidden="true">▾</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: `1px solid var(--surface-2)` }}>
                      <div style={{ height: '4px', background: phase.color, borderRadius: 'var(--radius-full)', margin: '1rem 0' }} />
                      <p style={{ color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '1rem' }}>{phase.description}</p>
                      <div style={{ background: `${phase.color}15`, borderLeft: `4px solid ${phase.color}`, borderRadius: '0 var(--radius) var(--radius) 0', padding: '0.75rem 1rem' }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem', color: phase.color }}>🎯 Your Action</div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{phase.citizenAction}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </div>
  );
}
