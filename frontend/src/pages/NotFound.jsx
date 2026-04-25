import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 140px)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Vote Not Cast — Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
        The page you are looking for has been disqualified, relocated, or never existed in the electoral roll.
      </p>
      <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
        🏠 Return to Home Station
      </Link>
    </div>
  );
}
