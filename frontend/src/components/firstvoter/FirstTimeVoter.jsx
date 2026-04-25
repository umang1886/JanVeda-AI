import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  {
    id: 1, icon: '✅', title: 'Check Eligibility', color: '#FF6B35',
    heading: 'Are You Eligible to Vote?',
    content: [
      { icon: '🎂', label: '18+ years old', desc: 'You must be at least 18 on January 1st of the election year' },
      { icon: '🇮🇳', label: 'Indian citizen', desc: 'You must be a citizen of India' },
      { icon: '📍', label: 'Resident of constituency', desc: 'Ordinary resident of the area for the qualifying period' },
      { icon: '🧠', label: 'Sound mind', desc: 'Not disqualified by court or law' },
    ],
    tip: 'Even if you\'re a first-time voter, you can register anytime. Check your existing registration at electoralsearch.in',
  },
  {
    id: 2, icon: '📋', title: 'Register to Vote', color: '#1B3A6B',
    heading: 'Register as a Voter — Form 6',
    content: [
      { icon: '🌐', label: 'Online', desc: 'Go to voters.eci.gov.in → Click "New Registration (Form 6)"' },
      { icon: '📄', label: 'Fill Form 6', desc: 'Enter your personal details, address, and upload documents' },
      { icon: '📤', label: 'Submit', desc: 'Submit and note your reference number for tracking' },
      { icon: '⏳', label: 'Wait for verification', desc: 'BLO verifies within 2–4 weeks. You\'ll get an SMS confirmation' },
    ],
    tip: 'Registration closes 30 days before the election date. Register early!',
    link: { url: 'https://voters.eci.gov.in/voter/selfregn', label: '🔗 Register Now at ECI Portal' },
  },
  {
    id: 3, icon: '📄', title: 'Documents Needed', color: '#2ECC71',
    heading: 'Documents for Registration',
    content: [
      { icon: '🪪', label: 'Age proof', desc: 'Aadhaar card, passport, birth certificate, school certificate' },
      { icon: '🏠', label: 'Address proof', desc: 'Aadhaar, utility bill, bank passbook, rent agreement' },
      { icon: '📸', label: 'Passport photo', desc: '2 recent passport-size photographs' },
      { icon: '📱', label: 'Mobile number', desc: 'Linked to Aadhaar — for OTP verification and updates' },
    ],
    tip: 'Aadhaar alone is often sufficient for both age and address proof. Most convenient!',
  },
  {
    id: 4, icon: '📲', title: 'Get Your Voter ID', color: '#9B59B6',
    heading: 'Download Your EPIC / e-EPIC',
    content: [
      { icon: '🌐', label: 'Visit portal', desc: 'Go to voters.eci.gov.in → "Download e-EPIC"' },
      { icon: '🔐', label: 'Login with mobile', desc: 'OTP sent to your registered mobile number' },
      { icon: '🔍', label: 'Find your record', desc: 'Search by EPIC number or name + date of birth + state' },
      { icon: '📥', label: 'Download PDF', desc: 'Save your e-EPIC — it\'s legally valid for voting' },
    ],
    tip: 'Save your e-EPIC in DigiLocker for secure, instant access anywhere.',
  },
  {
    id: 5, icon: '📍', title: 'Find Your Booth', color: '#F6AD55',
    heading: 'Locate Your Polling Booth',
    content: [
      { icon: '📱', label: 'Use JanVeda\'s Booth Finder', desc: 'Enter your pincode on this platform → instant results!' },
      { icon: '🌐', label: 'electoralsearch.in', desc: 'Search your name → your polling booth details are shown' },
      { icon: '📞', label: 'Call 1950', desc: 'Toll-free voter helpline — available in multiple languages' },
      { icon: '📄', label: 'Check your voter slip', desc: 'BLO distributes slips before election with booth details' },
    ],
    tip: 'Visit your booth once before election day to know the exact route. Takes under 5 minutes on polling day.',
    cta: { to: '/booth-finder', label: '📍 Find My Booth Now' },
  },
  {
    id: 6, icon: '🗳️', title: 'Voting Day', color: '#2ECC71',
    heading: 'What to Do on Voting Day',
    content: [
      { icon: '⏰', label: 'Go early (7 AM – 9 AM)', desc: 'Shorter queues in the morning. Booth is open until 6 PM.' },
      { icon: '🪪', label: 'Carry valid photo ID', desc: 'Voter ID, Aadhaar, Passport, DL, PAN, or any recognized ID' },
      { icon: '🔘', label: 'Press your candidate\'s button', desc: 'Take your time. Verify via VVPAT slip (7 seconds).' },
      { icon: '📵', label: 'No phones inside booth', desc: 'You can carry phone but must not use it in the voting compartment' },
    ],
    tip: 'You CANNOT take selfies or photos inside the voting compartment — it\'s a criminal offense!',
  },
];

export default function FirstTimeVoter() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());

  const step = STEPS[currentStep];
  const isCompleted = completed.has(step.id);

  const markDone = () => {
    setCompleted(prev => new Set([...prev, step.id]));
    if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
  };

  const progress = (completed.size / STEPS.length) * 100;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title">🗳️ First-Time Voter Guide</h1>
        <p className="section-subtitle">Complete 6-step journey to confident voting</p>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--secondary)' }}>Your Progress</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{completed.size}/{STEPS.length} steps</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        </div>
      </header>

      {/* Step selector */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }} role="tablist" aria-label="Voter guide steps">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === currentStep}
            onClick={() => setCurrentStep(i)}
            style={{
              minHeight: '44px', minWidth: '44px', borderRadius: 'var(--radius)',
              padding: '0.4rem 0.6rem', cursor: 'pointer', border: '2px solid',
              borderColor: i === currentStep ? s.color : completed.has(s.id) ? 'var(--accent)' : 'var(--surface-2)',
              background: i === currentStep ? s.color : completed.has(s.id) ? 'rgba(46,204,113,0.15)' : 'var(--surface)',
              color: i === currentStep ? 'white' : 'var(--text-primary)',
              fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.8rem',
              transition: 'all 0.2s ease',
            }}
            aria-label={`Step ${i + 1}: ${s.title} ${completed.has(s.id) ? '(completed)' : ''}`}
          >
            {completed.has(s.id) ? '✓' : s.icon} {s.title}
          </button>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div key={step.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
          <div className="card" style={{ borderTop: `4px solid ${step.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '2rem' }} aria-hidden="true">{step.icon}</span>
              <div>
                <div className="badge" style={{ background: `${step.color}20`, color: step.color, marginBottom: '0.25rem' }}>Step {step.id} of {STEPS.length}</div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--secondary)', margin: 0 }}>{step.heading}</h2>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {step.content.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', padding: '0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>
                  <span style={{ fontSize: '1.3rem', flexShrink: 0 }} aria-hidden="true">{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.925rem', color: 'var(--secondary)', marginBottom: '0.2rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tip */}
            <div style={{ background: `${step.color}15`, borderLeft: `4px solid ${step.color}`, borderRadius: '0 var(--radius) var(--radius) 0', padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', fontWeight: 700, color: step.color }}>💡 Pro Tip: </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{step.tip}</span>
            </div>

            {/* External links */}
            {step.link && (
              <a href={step.link.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                {step.link.label}
              </a>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" disabled={currentStep === 0} onClick={() => setCurrentStep(s => s - 1)} aria-label="Previous step" style={{ opacity: currentStep === 0 ? 0.4 : 1 }}>
                ← Previous
              </button>
              <button
                className="btn btn-primary"
                onClick={markDone}
                style={{ background: isCompleted ? 'var(--accent-dark)' : step.color, borderColor: 'transparent' }}
              >
                {isCompleted ? '✅ Done' : currentStep === STEPS.length - 1 ? '🏁 Complete Guide!' : 'Mark Done & Continue →'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {completed.size === STEPS.length && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', textAlign: 'center' }} className="card" style={{ background: 'linear-gradient(135deg, var(--secondary), #2A5298)', color: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          <div style={{ fontSize: '3rem' }}>🎉</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'white', margin: '0.5rem 0' }}>You\'re Ready to Vote!</h3>
          <p style={{ opacity: 0.85, marginBottom: '1.5rem' }}>You\'ve completed all 6 steps of the First-Time Voter Guide. Go vote with confidence!</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/simulator" style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', fontFamily: 'var(--font-heading)', fontWeight: 600, textDecoration: 'none' }}>Try EVM Simulator</a>
            <a href="/quiz" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', fontFamily: 'var(--font-heading)', fontWeight: 600, textDecoration: 'none' }}>Take the Quiz</a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
