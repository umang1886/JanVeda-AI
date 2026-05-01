import React, { useState, useRef, useEffect, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { matchIntent } from '../../utils/chatEngine';

const TYPING_DELAY = 700;

const QUICK_CHIPS = [
  { label: '📋 How to register?', q: 'How to register?' },
  { label: '📍 Find my booth', q: 'Find my booth' },
  { label: '🚫 What is NOTA?', q: 'What is NOTA?' },
  { label: '🖥️ How EVM works?', q: 'How EVM works?' },
  { label: '🧾 What is VVPAT?', q: 'What is VVPAT?' },
  { label: '📄 Voting documents', q: 'Voting documents' },
];

function chatReducer(state, action) {
  switch (action.type) {
    case 'ADD_USER_MESSAGE':
      return { ...state, messages: [...state.messages, { role: 'user', text: action.text, id: Date.now() }] };
    case 'SET_TYPING':
      return { ...state, isTyping: action.value };
    case 'ADD_BOT_MESSAGE':
      return {
        ...state,
        isTyping: false,
        messages: [...state.messages.slice(-18), { role: 'bot', text: action.text, followups: action.followups, id: Date.now() }],
        lastIntentId: action.intentId,
        turnsSinceIntent: action.intentId ? 0 : state.turnsSinceIntent + 1,
      };
    case 'CLEAR':
      return { messages: [], isTyping: false, lastIntentId: null, turnsSinceIntent: 0 };
    default:
      return state;
  }
}

// Typing dots
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0D3E96, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>🤖</div>
      <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '6px 16px 16px 16px', padding: '0.75rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {[0, 0.18, 0.36].map(delay => (
            <motion.span key={delay}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', display: 'block' }}
              animate={{ y: [0, -7, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 0.9, delay }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual message bubble
function MessageBubble({ msg, onChipClick }) {
  const isBot = msg.role === 'bot';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      style={{ display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end', marginBottom: '1rem', alignItems: 'flex-end', gap: '8px' }}
    >
      {/* Bot avatar */}
      {isBot && (
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #0D3E96, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
          🤖
        </div>
      )}

      <div style={{ maxWidth: '78%' }}>
        {isBot && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px', paddingLeft: '2px' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#2563EB', letterSpacing: '0.02em' }}>JanVeda AI</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} title="Online" />
          </div>
        )}

        <div
          role={isBot ? 'article' : undefined}
          style={{
            background: isBot
              ? 'white'
              : 'linear-gradient(135deg, #FF6600 0%, #FF8C42 100%)',
            color: isBot ? '#1E293B' : 'white',
            padding: '0.85rem 1.1rem',
            borderRadius: isBot ? '6px 18px 18px 18px' : '18px 6px 18px 18px',
            boxShadow: isBot
              ? '0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(226,232,240,0.8)'
              : '0 4px 16px rgba(255,102,0,0.35)',
            fontSize: '0.92rem',
            lineHeight: 1.68,
            whiteSpace: 'pre-line',
          }}
        >
          {msg.text}
        </div>

        {/* Follow-up chips */}
        {isBot && msg.followups?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }} role="group" aria-label="Follow-up questions">
            {msg.followups.map(f => (
              <button
                key={f}
                onClick={() => onChipClick(f)}
                aria-label={`Ask: ${f}`}
                style={{
                  padding: '0.3rem 0.85rem',
                  background: 'white',
                  border: '1.5px solid #BFDBFE',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  color: '#2563EB',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 4px rgba(37,99,235,0.1)',
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.borderColor = '#2563EB'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User avatar */}
      {!isBot && (
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6600, #FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem', boxShadow: '0 2px 8px rgba(255,102,0,0.3)' }}>
          👤
        </div>
      )}
    </motion.div>
  );
}

export default function Chatbot() {
  const [state, dispatch] = useReducer(chatReducer, { messages: [], isTyping: false, lastIntentId: null, turnsSinceIntent: 0 });
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const liveRegionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isTyping]);

  const handleSend = (text = input.trim()) => {
    if (!text) return;
    dispatch({ type: 'ADD_USER_MESSAGE', text });
    setInput('');
    dispatch({ type: 'SET_TYPING', value: true });
    setTimeout(() => {
      const contextId = state.turnsSinceIntent < 3 ? state.lastIntentId : null;
      const { response, followups, intentId } = matchIntent(text, contextId);
      dispatch({ type: 'ADD_BOT_MESSAGE', text: response, followups, intentId });
      if (liveRegionRef.current) liveRegionRef.current.textContent = response;
    }, TYPING_DELAY);
  };

  const copyChat = () => {
    const text = state.messages.map(m => `${m.role === 'user' ? 'You' : 'JanVeda AI'}: ${m.text}`).join('\n\n');
    navigator.clipboard.writeText(text).then(() => alert('Chat copied to clipboard!'));
  };

  return (
    <section
      aria-label="JanVeda AI Election Chatbot"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - var(--nav-height))',
        maxWidth: '820px',
        margin: '0 auto',
        padding: '1.5rem 1rem',
      }}
    >
      {/* ARIA live region */}
      <div ref={liveRegionRef} aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: '-9999px' }} />

      {/* ── Chat Window ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(13,62,150,0.15), 0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(226,232,240,0.8)',
      }}>

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, #0D3E96 0%, #2563EB 60%, #3B82F6 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* decorative circles */}
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', top: 20, right: 60, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', position: 'relative' }}>
            {/* Avatar with pulse ring */}
            <div style={{ position: 'relative' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', border: '2px solid rgba(255,255,255,0.3)' }}>
                🤖
              </div>
              <span style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#10B981', border: '2px solid #1d4ed8' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>JanVeda AI Assistant</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.78, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399', display: 'inline-block' }} />
                Online · Instant · Offline-ready
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
            {state.messages.length > 0 && (
              <button
                onClick={copyChat}
                aria-label="Copy chat"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '10px', padding: '0.4rem 0.8rem', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                📋 Copy
              </button>
            )}
            <button
              onClick={() => dispatch({ type: 'CLEAR' })}
              aria-label="Clear chat"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '10px', padding: '0.4rem 0.8rem', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* ── MESSAGES ── */}
        <div
          role="log"
          aria-label="Chat messages"
          aria-live="off"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1rem',
            background: '#F8FAFF',
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(37,99,235,0.04) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(255,102,0,0.04) 0%, transparent 60%)`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Welcome state */}
          {state.messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '2rem 0.5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #0D3E96, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '1.25rem', boxShadow: '0 12px 35px rgba(37,99,235,0.3)' }}>
                🗳️
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0D3E96', marginBottom: '0.6rem' }}>Ask me anything about Indian Elections!</h2>
              <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '380px', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                I know <strong>60+ topics</strong> — voter registration, EVM, NOTA, booth finder, rights & more.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }} role="group" aria-label="Suggested questions">
                {QUICK_CHIPS.map(chip => (
                  <button
                    key={chip.q}
                    onClick={() => handleSend(chip.q)}
                    aria-label={`Ask: ${chip.q}`}
                    style={{
                      padding: '0.55rem 1.1rem',
                      background: 'white',
                      border: '1.5px solid #BFDBFE',
                      borderRadius: '24px',
                      fontSize: '0.85rem',
                      color: '#1E40AF',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 8px rgba(37,99,235,0.1)',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.2)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.1)'; }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          {state.messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} onChipClick={handleSend} />
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {state.isTyping && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}>
                <TypingDots />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* ── INPUT ── */}
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          padding: '0.9rem 1rem',
          background: 'white',
          borderTop: '1px solid #E2E8F0',
          alignItems: 'center',
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about elections, EVM, voting rights…"
            aria-label="Type your election question"
            maxLength={300}
            style={{
              flex: 1,
              padding: '0.85rem 1.1rem',
              border: '2px solid #E2E8F0',
              borderRadius: '14px',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-body)',
              color: '#1E293B',
              background: '#F8FAFF',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.12)'; e.target.style.background = 'white'; }}
            onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F8FAFF'; }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            aria-label="Send message"
            style={{
              width: 50,
              height: 50,
              borderRadius: '14px',
              background: input.trim() ? 'linear-gradient(135deg, #FF6600, #FF8C42)' : '#E2E8F0',
              color: input.trim() ? 'white' : '#94A3B8',
              border: 'none',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              flexShrink: 0,
              transition: 'all 0.2s',
              boxShadow: input.trim() ? '0 4px 14px rgba(255,102,0,0.4)' : 'none',
              transform: 'scale(1)',
            }}
            onMouseOver={e => { if (input.trim()) e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            ➤
          </button>
        </div>
      </div>
    </section>
  );
}
