import React from 'react';

/**
 * LoadingSpinner — Suspense fallback with optional full-page centering.
 * @param {boolean} fullPage - Center vertically on the page
 */
export default function LoadingSpinner({ fullPage = false }) {
  const content = (
    <div className="loading-page">
      <div className="spinner" role="status" aria-label="Loading content" />
      <p className="sr-only">Loading…</p>
    </div>
  );
  if (fullPage) return content;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div className="spinner" role="status" aria-label="Loading" />
    </div>
  );
}
