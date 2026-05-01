import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';

const getNavLinks = (t) => [
  { to: '/timeline', label: t('nav_timeline') || 'Timeline', icon: '📅' },
  { to: '/booth-finder', label: t('nav_booth') || 'Find Booth', icon: '📍' },
  { to: '/first-time-voter', label: t('nav_first_time') || 'First Timer', icon: '🗳️' },
  { to: '/simulator', label: t('nav_simulator') || 'EVM Sim', icon: '🖧' },
  { to: '/quiz', label: t('nav_quiz') || 'Quiz', icon: '🏆' },
  { to: '/glossary', label: t('nav_glossary') || 'Glossary', icon: '📖' },
  { to: '/chatbot', label: t('nav_chatbot') || 'AI Help', icon: '💬' },
=======

const NAV_LINKS = [
  { to: '/timeline', label: 'Timeline', icon: '📅' },
  { to: '/booth-finder', label: 'Find Booth', icon: '📍' },
  { to: '/first-time-voter', label: 'First Timer', icon: '🗳️' },
  { to: '/simulator', label: 'EVM Sim', icon: '🖧' },
  { to: '/quiz', label: 'Quiz', icon: '🏆' },
  { to: '/glossary', label: 'Glossary', icon: '📖' },
  { to: '/chatbot', label: 'AI Help', icon: '💬' },
>>>>>>> d52fecbaa91d87347bff416a3e399850057e2176
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
<<<<<<< HEAD
  const { t, i18n } = useTranslation();
=======
>>>>>>> d52fecbaa91d87347bff416a3e399850057e2176

  // Close mobile menu on route change
  React.useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'white',
        boxShadow: '0 2px 20px rgba(27,58,107,0.12)',
        height: 'var(--nav-height)',
      }}
      role="banner"
    >
      <nav
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
          aria-label="JanVeda AI — Home"
        >
          <span style={{ fontSize: '1.5rem' }}>🗳️</span>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.25rem',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            JanVeda AI
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            listStyle: 'none',
          }}
          className="desktop-nav"
        >
<<<<<<< HEAD
          {getNavLinks(t).map(link => (
=======
          {NAV_LINKS.map(link => (
>>>>>>> d52fecbaa91d87347bff416a3e399850057e2176
            <li key={link.to}>
              <NavLink
                to={link.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  minHeight: '36px',
                })}
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </NavLink>
            </li>
          ))}
<<<<<<< HEAD
          <li style={{ marginLeft: "1rem" }}>
            <select
              style={{
                fontFamily: "var(--font-heading)",
                padding: "0.25rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                cursor: "pointer",
              }}
              onChange={(e) => {
                i18n.changeLanguage(e.target.value);
              }}
            >
              <option value="en">Eng</option>
              <option value="hi">हिन्दी</option>
              <option value="gu">ગુજરાતી</option>
            </select>
          </li>
=======
>>>>>>> d52fecbaa91d87347bff416a3e399850057e2176
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '1.5rem',
            color: 'var(--secondary)',
            minHeight: '44px',
            minWidth: '44px',
          }}
          className="hamburger"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'white',
              borderTop: '1px solid var(--surface-2)',
              overflow: 'hidden',
            }}
          >
            <ul style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
<<<<<<< HEAD
              {getNavLinks(t).map(link => (
=======
              {NAV_LINKS.map(link => (
>>>>>>> d52fecbaa91d87347bff416a3e399850057e2176
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 500,
                      color: isActive ? 'white' : 'var(--text-primary)',
                      background: isActive ? 'var(--primary)' : 'var(--surface)',
                      textDecoration: 'none',
                      minHeight: '44px',
                    })}
                  >
                    <span aria-hidden="true">{link.icon}</span>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </header>
  );
}
