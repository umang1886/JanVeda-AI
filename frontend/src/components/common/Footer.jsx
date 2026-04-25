import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        background: 'var(--secondary)',
        color: 'white',
        padding: '3rem 0 1.5rem',
        marginTop: 'auto',
      }}
      role="contentinfo"
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>
              🗳️ JanVeda AI
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Empowering every Indian citizen to understand and participate in democracy.
            </p>
          </div>

          {/* Features */}
          <div aria-label="Feature links" role="navigation">
            <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.75rem', color: 'white' }}>Features</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { to: '/timeline', label: 'Election Timeline' },
                { to: '/booth-finder', label: 'Find My Booth' },
                { to: '/simulator', label: 'EVM Simulator' },
                { to: '/first-time-voter', label: 'First-Time Voter' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textDecoration: 'none' }}
                    onMouseOver={e => e.target.style.color = 'white'}
                    onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div aria-label="Resource links" role="navigation">
            <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.75rem', color: 'white' }}>Resources</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { to: '/quiz', label: 'Election Quiz' },
                { to: '/glossary', label: 'Glossary' },
                { to: '/chatbot', label: 'AI Chatbot' },
                { href: 'https://voters.eci.gov.in', label: 'ECI Portal ↗', external: true },
              ].map(l => (
                <li key={l.to || l.href}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textDecoration: 'none' }}>
                      {l.label}
                    </a>
                  ) : (
                    <Link to={l.to} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textDecoration: 'none' }}>
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.15)', margin: '1.5rem 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
            © {year} JanVeda AI. Built for PromptWars Hackathon.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ background: '#FF6B35', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
              Powered by React + Flask
            </span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
              Google Cloud Run
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
