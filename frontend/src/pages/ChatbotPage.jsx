import React from 'react';
import Chatbot from '../components/chatbot/Chatbot';

export default function ChatbotPage() {
  return (
    <div style={{ 
      minHeight: 'calc(100vh - var(--nav-height, 80px))', 
      padding: '1rem',
      background: 'linear-gradient(135deg, #F8FAFF 0%, #E0E7FF 50%, #EFF6FF 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Decorative background blobs */}
      <div style={{ position: 'absolute', top: '5%', left: '-10%', width: 'clamp(300px, 50vw, 500px)', height: 'clamp(300px, 50vw, 500px)', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%)', filter: 'blur(40px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-5%', right: '-10%', width: 'clamp(400px, 60vw, 600px)', height: 'clamp(400px, 60vw, 600px)', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 60%)', filter: 'blur(50px)', zIndex: 0 }} />
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        width: '100%', 
        maxWidth: '1000px', 
        height: 'calc(100vh - 120px)',
        minHeight: '500px', 
        maxHeight: '900px' 
      }}>
        <Chatbot />
      </div>
    </div>
  );
}
