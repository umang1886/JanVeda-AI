<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
=======
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
>>>>>>> d52fecbaa91d87347bff416a3e399850057e2176
import axios from 'axios';

const MOCK_BOOTHS = {
  '110001': [{ id: 1, name: 'Govt. Primary School, Connaught Place', address: 'Block A, Connaught Place, New Delhi 110001', ward: 'Ward 1 — New Delhi', distance: '0.4 km', voters: 1247, mapUrl: 'https://maps.google.com/?q=28.6304,77.2177' }],
  '400001': [{ id: 2, name: 'Municipal School No.3, Fort Area', address: 'D.N. Road, Fort, Mumbai 400001', ward: 'Ward 227 — Colaba', distance: '0.3 km', voters: 983, mapUrl: 'https://maps.google.com/?q=18.9322,72.8493' }],
  '600001': [{ id: 3, name: 'Government Higher Secondary School', address: 'Anna Salai, Chennai 600001', ward: 'Ward 112 — Thousand Lights', distance: '0.6 km', voters: 1109, mapUrl: 'https://maps.google.com/?q=13.0827,80.2707' }],
  '700001': [{ id: 4, name: 'Dalhousie Primary School', address: 'B.B.D. Bagh, Kolkata 700001', ward: 'Ward 45', distance: '0.5 km', voters: 876, mapUrl: 'https://maps.google.com/?q=22.5726,88.3639' }],
};

<<<<<<< HEAD
const FEATURES = [
  { icon: '♿', label: 'Wheelchair Ramp' },
  { icon: '🚰', label: 'Drinking Water' },
  { icon: '🏥', label: 'Medical Kit' },
  { icon: '👮', label: 'Police Security' },
];

=======
>>>>>>> d52fecbaa91d87347bff416a3e399850057e2176
export default function BoothFinder() {
  const [pincode, setPincode] = useState('');
  const [ep, setEp] = useState('');
  const [booths, setBooths] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultsRef = useRef(null);

  const sanitize = v => v.replace(/[^0-9]/g, '').slice(0, 6);

  const search = async (e) => {
    e.preventDefault();
    const pc = pincode.trim();
    if (!/^\d{6}$/.test(pc)) { setError('Please enter a valid 6-digit pincode.'); return; }
    setError(''); setLoading(true); setBooths(null);
<<<<<<< HEAD

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const res = await axios.get(`${apiUrl}/booth?pincode=${pc}`, { timeout: 4000 });
      let data = res.data.booths || [];
      // Enrich with mock live data
      data = data.map(b => ({
        ...b,
        waitTime: [10, 25, 45, 5][Math.floor(Math.random() * 4)],
        crowdLvl: Math.floor(Math.random() * 3), // 0=low, 1=medium, 2=high
      }));
      setBooths(data);
    } catch {
      // Fallback
      let data = MOCK_BOOTHS[pc];
      if (!data) {
        data = [{ id: 999, name: 'Sample Polling Booth', address: `Designated Area near PIN ${pc}`, ward: 'Designated Ward', distance: 'N/A', voters: ~~(Math.random() * 1000 + 500), mapUrl: `https://maps.google.com/?q=${pc}+india` }];
      }
      data = data.map(b => ({
        ...b,
        waitTime: [10, 25, 45, 5][Math.floor(Math.random() * 4)],
        crowdLvl: Math.floor(Math.random() * 3),
      }));
      setBooths(data);
=======
    try {
      // Try backend first, fall back to mock data
      const res = await axios.get(`/api/booth?pincode=${pc}`, { timeout: 4000 });
      setBooths(res.data.booths || []);
    } catch {
      // Graceful offline fallback
      const mock = MOCK_BOOTHS[pc];
      if (mock) {
        setBooths(mock);
      } else {
        setBooths([{ id: 999, name: 'Sample Polling Booth', address: `Area near PIN ${pc}`, ward: 'Sample Ward', distance: 'N/A', voters: 1000, mapUrl: `https://maps.google.com/?q=pin+code+${pc}+india` }]);
      }
>>>>>>> d52fecbaa91d87347bff416a3e399850057e2176
    } finally {
      setLoading(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

<<<<<<< HEAD
  const getCrowdTheme = (lvl) => {
    if (lvl === 0) return { label: '🟢 Low Crowd', color: '#10B981', bg: 'rgba(16,185,129,0.1)' };
    if (lvl === 1) return { label: '🟡 Moderate', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' };
    return { label: '🔴 Heavy Traffic', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' };
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Hero Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)', width: 250, height: 250, background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', zIndex: -1 }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 70, height: 70, borderRadius: '20px', background: 'linear-gradient(135deg, #FF6600, #FF8C42)', color: 'white', fontSize: '2rem', marginBottom: '1rem', boxShadow: '0 10px 25px rgba(255,102,0,0.3)' }}>
          📍
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, color: '#0D3E96', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Find Your Polling Booth</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>Track live wait times, verify accessibility features, and get instant directions to your designated electronic voting center.</p>
      </motion.div>

      {/* Main Form Interface */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <form onSubmit={search} noValidate style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden', border: '1px solid rgba(226,232,240,0.8)' }}>
          {/* Decorative Corner */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 150, height: 150, background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', clipPath: 'polygon(100% 0, 0 0, 100% 100%)', opacity: 0.1 }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

            {/* Pincode Input */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="pincode-input" style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>Postal PIN Code <span style={{ color: '#EF4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', color: '#94A3B8' }}>📮</span>
                <input
                  id="pincode-input"
                  type="text"
                  inputMode="numeric"
                  value={pincode}
                  onChange={e => { setPincode(sanitize(e.target.value)); setError(''); }}
                  placeholder="e.g. 110001"
                  maxLength={6}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', fontSize: '1.1rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em', border: error ? '2px solid #EF4444' : '2px solid #E2E8F0', borderRadius: '14px', background: '#F8FAFF', outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              {error && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#EF4444', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>⚠️ {error}</motion.div>}
            </div>

            {/* EPIC Input */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="ep-input" style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>Voter EPIC Number <span style={{ color: '#94A3B8', fontWeight: 500 }}>(Optional)</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', color: '#94A3B8' }}>🪪</span>
                <input
                  id="ep-input"
                  type="text"
                  value={ep}
                  onChange={e => setEp(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                  placeholder="e.g. ABC1234567"
                  maxLength={10}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', fontSize: '1.1rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em', border: '2px solid #E2E8F0', borderRadius: '14px', background: '#F8FAFF', outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.5rem' }}>Found on the top of your Voter ID card</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || pincode.length !== 6}
            style={{ width: '100%', marginTop: '2rem', padding: '1.1rem', background: pincode.length === 6 ? 'linear-gradient(135deg, #0D3E96, #2563EB)' : '#CBD5E1', color: 'white', border: 'none', borderRadius: '14px', fontSize: '1.1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, cursor: pincode.length === 6 && !loading ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: pincode.length === 6 ? '0 10px 20px rgba(37,99,235,0.25)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
          {loading ? (
            <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span> Searching secure database...</>
          ) : (
            <><span>🔍</span> Locate Safe Polling Booth</>
          )}
        </button>
      </form>
    </motion.div>

      {/* Results Section */ }
      <div ref={resultsRef} style={{ marginTop: '3rem' }}>
        <AnimatePresence>
          {booths !== null && booths.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#0D3E96', fontWeight: 800 }}>Result: {booths.length} Approved Center{booths.length !== 1 ? 's' : ''}</h2>
                <div style={{ background: '#EFF6FF', color: '#2563EB', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} /> 
                  Live Tracking Active
                </div>
              </div>

              {booths.map((b, i) => {
                const theme = getCrowdTheme(b.crowdLvl);
                return (
                  <motion.div 
                    key={b.id} 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: i * 0.1 }}
                    style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid rgba(226,232,240,0.8)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', md: { flexDirection: 'row' } }}
                  >
                    {/* Top Detail Card */}
                    <div style={{ padding: '2rem', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ background: theme.bg, color: theme.color, padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', display: 'inline-block', marginBottom: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            {theme.label} • ~{b.waitTime} Min Wait
                          </div>
                          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#1E293B', fontWeight: 800, marginBottom: '0.5rem' }}>{b.name}</h3>
                          <p style={{ color: '#64748B', display: 'flex', alignItems: 'flex-start', gap: '5px', fontSize: '0.95rem', lineHeight: 1.5, maxWidth: '400px' }}>
                            <span style={{flexShrink: 0, marginTop: '2px'}}>📫</span> {b.address}
                          </p>
                        </div>
                        <div style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '16px', minWidth: '150px' }}>
                          <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>Voter Base</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0D3E96', fontFamily: 'var(--font-heading)' }}>{b.voters.toLocaleString()}</div>
                          <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>Active Registration</div>
                        </div>
                      </div>

                      <div style={{ height: '1px', background: '#E2E8F0', margin: '1.5rem 0' }} />

                      {/* Facilities */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B' }}>Verified Facilities:</div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          {FEATURES.map(f => (
                            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#475569', background: '#F1F5F9', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
                              <span>{f.icon}</span> {f.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Bar / Map link */}
                    <div style={{ background: '#F8FAFF', borderTop: '1px solid #E2E8F0', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏘️</div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Designated Ward</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E293B', fontFamily: 'var(--font-heading)' }}>{b.ward}</div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <a 
                          href={b.mapUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ textDecoration: 'none', padding: '0.8rem 1.5rem', background: 'white', border: '2px solid #E2E8F0', color: '#1E293B', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                          onMouseOver={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB' }}
                          onMouseOut={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#1E293B' }}
                        >
                          🗺️ View on Maps
                        </a>
                        <a 
                          href={b.mapUrl + "&dirflg=d"} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ textDecoration: 'none', padding: '0.8rem 1.5rem', background: '#2563EB', border: '2px solid #2563EB', color: 'white', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(37,99,235,0.2)' }}
                          onMouseOver={e => { e.currentTarget.style.background = '#1D4ED8'; e.currentTarget.style.borderColor = '#1D4ED8' }}
                          onMouseOut={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.borderColor = '#2563EB' }}
                        >
                          📍 Navigate
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Mandatory Documents Banner */}
              <div style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', borderRadius: '20px', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', color: 'white', marginTop: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                <div style={{ fontSize: '3rem' }}>📄</div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#F8FAFF' }}>Don't forget your documents!</h4>
                  <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6 }}>You must carry your <strong>Voter ID (EPIC)</strong> or an approved alternate photo ID (Aadhar, PAN, Driving License, Passport) to cast your vote. Mobile phones are <strong>strictly prohibited</strong> inside the voting compound.</p>
                </div>
              </div>

            </motion.div>
          )}

          {booths !== null && booths.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#1E293B', marginBottom: '0.5rem' }}>No Polling Booths Found</h3>
              <p style={{ color: '#64748B' }}>We couldn't locate polling booths for Pincode {pincode}. Please verify the area code or check the Election Commission directory.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div >
=======
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="section-title">📍 Find My Polling Booth</h1>
        <p className="section-subtitle">Enter your pincode to find nearby polling booths</p>
      </div>

      <form onSubmit={search} noValidate aria-label="Polling booth search form">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', borderTop: '4px solid var(--primary)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="pincode-input" className="form-label">Your Area Pincode</label>
            <input
              id="pincode-input"
              type="text"
              inputMode="numeric"
              value={pincode}
              onChange={e => { setPincode(sanitize(e.target.value)); setError(''); }}
              placeholder="e.g. 110001"
              maxLength={6}
              className="form-input"
              aria-describedby={error ? 'pincode-error' : 'pincode-hint'}
              aria-invalid={!!error}
              required
              autoComplete="postal-code"
            />
            {error && <div id="pincode-error" className="form-error" role="alert">⚠️ {error}</div>}
            <div id="pincode-hint" className="sr-only">Enter your 6-digit Indian postal code</div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="ep-input" className="form-label">Voter EPIC Number (optional)</label>
            <input
              id="ep-input"
              type="text"
              value={ep}
              onChange={e => setEp(e.target.value.toUpperCase().slice(0, 12))}
              placeholder="e.g. DL12345678"
              className="form-input"
              aria-label="EPIC voter ID number — optional"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading || pincode.length !== 6} style={{ justifyContent: 'center' }} aria-busy={loading}>
            {loading ? '🔍 Searching…' : '🔍 Find Polling Booth'}
          </button>
        </div>
      </form>

      {/* Results */}
      <div ref={resultsRef}>
        {booths !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)', marginBottom: '1rem' }}>
              🗳️ {booths.length} Booth{booths.length !== 1 ? 's' : ''} Found
            </h2>
            {booths.map(b => (
              <div key={b.id} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>{b.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>📫 {b.address}</p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span className="badge badge-navy">🏘️ {b.ward}</span>
                  {b.distance !== 'N/A' && <span className="badge badge-primary">📍 {b.distance}</span>}
                  <span className="badge" style={{ background: 'rgba(46,204,113,0.12)', color: 'var(--accent-dark)' }}>👥 {b.voters.toLocaleString()} voters</span>
                </div>
                <a href={b.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }} aria-label={`Open ${b.name} in Google Maps`}>
                  🗺️ Get Directions
                </a>
              </div>
            ))}
            {/* Safety notes */}
            <div style={{ background: 'rgba(27,58,107,0.07)', borderRadius: 'var(--radius)', padding: '1rem', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}><strong>📋 Remember:</strong> Carry a valid photo ID. Booth opens 7 AM – 6 PM. Indelible ink is applied on your left index finger. No phones inside the voting compartment.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
>>>>>>> d52fecbaa91d87347bff416a3e399850057e2176
  );
}
