import React from 'react';
import Chatbot from '../components/chatbot/Chatbot';

export default function ChatbotPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 140px)', padding: '2rem 1rem' }}>
      <Chatbot />
    </div>
  );
}
