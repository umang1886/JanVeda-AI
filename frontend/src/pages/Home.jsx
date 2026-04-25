import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FEATURES = [
  { to: '/timeline', icon: '📅', title: 'Election Timeline', desc: 'See all 7 phases of the process with real-time progress.', color: '#2563EB' },
  { to: '/first-time-voter', icon: '🗳️', title: 'First-Time Voter', desc: 'Step-by-step masterclass from eligibility to confidence.', color: '#10B981' },
  { to: '/simulator', icon: '🖧', title: 'EVM Simulator', desc: 'Practice using a real EVM + VVPAT in a hyper-realistic simulation.', color: '#3B82F6' },
  { to: '/booth-finder', icon: '📍', title: 'Find My Booth', desc: 'Locate your exact polling station instantly.', color: '#FF6600' },
  { to: '/chatbot', icon: '💬', title: 'AI Assistant', desc: 'Ask complex election questions — get instant, accurate answers.', color: '#0D3E96' },
  { to: '/quiz', icon: '🏆', title: 'Civics Quiz', desc: 'Test your knowledge with our comprehensive leaderboard challenge.', color: '#8B5CF6' }
];

export default function Home() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      
      {/* ── HIGH-CONTRAST SAAS HERO SECTION ──────────────────────── */}
      <section 
        style={{
          position: 'relative',
          padding: '8rem 0 10rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0D3E96 0%, #2563EB 100%)',
          color: 'white',
          overflow: 'hidden'
        }}
        aria-label="Hero section"
      >
        {/* Soft curving wave separator at the bottom to match reference image */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'rotate(180deg)' }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '100px' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F8FAFC"></path>
          </svg>
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '4rem' }}>
            
            {/* Left Content */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{ flex: '1 1 500px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 'var(--radius-full)', padding: '0.4rem 1.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'white' }}>Empowering Citizens 🇮🇳</span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                We are building <br />
                knowledge for your <br />
                <span style={{ color: '#60A5FA' }}>electoral voice</span>
              </h1>

              <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)', maxWidth: '500px', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                JanVeda AI simplifies the entire voting process. Find your booth, practice on our EVM simulator, and get instant answers from our AI assistant.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/simulator" className="btn btn-primary" style={{ background: 'var(--primary)', color: 'white', padding: '1rem 2rem', fontSize: '1.1rem', boxShadow: '0 8px 20px rgba(255, 102, 0, 0.4)' }}>
                  Start Free Trial →
                </Link>
                <Link to="/chatbot" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                  or ask AI 💬
                </Link>
              </div>
            </motion.div>
            
            {/* Right Graphic Representation */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', width: '100%', maxWidth: '500px', transform: 'rotate(2deg)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', gap: '1rem', minHeight: '220px' }}>
                  {/* EVM Mockup */}
                  <div style={{ flex: 1, background: '#E5E7EB', borderRadius: '6px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.25rem' }}>BALLOT UNIT</div>
                    {[1,2,3,4].map(idx => (
                      <div key={idx} style={{ background: 'white', padding: '0.4rem 0.6rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #D1D5DB' }}>
                        <div style={{ width: '40%', height: '8px', background: '#9CA3AF', borderRadius: '4px' }} />
                        <div style={{ width: '28px', height: '18px', background: '#3B82F6', borderRadius: '14px', border: '2px solid #2563EB' }} />
                      </div>
                    ))}
                  </div>
                  {/* VVPAT Mockup */}
                  <div style={{ flex: 0.8, background: '#F3F4F6', borderRadius: '6px', padding: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' }}>VVPAT</div>
                    <div style={{ width: '100%', height: '70px', background: 'white', border: '3px solid #D1D5DB', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                         <div style={{ width: '60%', height: '40px', background: '#F8FAFC', border: '1px dashed #9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <div style={{ width: '20px', height: '20px', background: '#10B981', borderRadius: '50%' }} />
                         </div>
                      </motion.div>
                    </div>
                    <div style={{ marginTop: '0.75rem', width: '60%', height: '8px', background: '#D1D5DB', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── BENTO GRID FEATURES (Clean White) ──────────────────────── */}
      <section style={{ padding: '2rem 0 6rem', background: 'var(--bg-alt)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Features mapped for simplicity</h2>
            <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '4rem', marginInline: 'auto' }}>A wonderful serenity has taken possession of my entire soul, like these sweet mornings.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {FEATURES.map((f, i) => (
                <Link to={f.to} key={f.to} style={{ textDecoration: 'none', display: 'block' }}>
                  <motion.div 
                    className="card"
                    whileHover={{ y: -6 }}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem', background: 'white', border: '1px solid var(--surface-2)', boxShadow: 'var(--shadow)' }}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', borderRadius: '20%', background: `${f.color}15`, color: f.color, fontSize: '2.5rem', marginBottom: '1.5rem' }}>
                      {f.icon}
                    </div>
                    
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--secondary)', marginBottom: '1rem' }}>{f.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, flexGrow: 1 }}>{f.desc}</p>
                    
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER BANNER / CTA ──────────────────────── */}
      <section style={{ padding: '6rem 0', background: 'white', borderTop: '1px solid var(--surface-2)' }}>
        <div className="container">
          <div style={{ background: 'var(--secondary-light)', borderRadius: 'var(--radius-xl)', padding: '4rem 2rem', textAlign: 'center', color: 'white', boxShadow: 'var(--shadow-lg)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
              The simplest way to prepare for voting
            </h2>
            <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
              Join thousands of responsible citizens. No sign-up required, works completely offline.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', background: 'white', padding: '0.5rem', borderRadius: 'var(--radius-full)', maxWidth: '500px', width: '100%', boxShadow: 'var(--shadow)' }}>
                <input type="text" placeholder="Enter your pincode to check area..." style={{ flexGrow: 1, border: 'none', background: 'transparent', padding: '0 1rem', fontSize: '1rem', outline: 'none' }} />
                <Link to="/booth-finder" className="btn btn-primary" style={{ padding: '0.75rem 2rem', margin: 0, borderRadius: 'var(--radius-full)' }}>
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
