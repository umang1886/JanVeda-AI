import React from 'react';
import ElectionTimeline from '../components/timeline/ElectionTimeline';

export default function TimelinePage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 140px)' }}>
      <ElectionTimeline />
    </div>
  );
}
