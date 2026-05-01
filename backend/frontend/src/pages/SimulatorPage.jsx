import React from 'react';
import VotingSimulator from '../components/simulator/VotingSimulator';

export default function SimulatorPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 140px)' }}>
      <VotingSimulator />
    </div>
  );
}
