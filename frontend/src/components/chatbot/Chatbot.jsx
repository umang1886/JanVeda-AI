import React, { useState, useRef, useEffect, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export const QUICK_CHIPS = (t) => [
  { label: t('chatbot_q1'), q: t('chatbot_q1').replace(/^[^\w]*/, '') },
  { label: t('chatbot_q2'), q: t('chatbot_q2').replace(/^[^\w]*/, '') },
  { label: t('chatbot_q3'), q: t('chatbot_q3').replace(/^[^\w]*/, '') },
  { label: t('chatbot_q4'), q: t('chatbot_q4').replace(/^[^\w]*/, '') },
  { label: t('chatbot_q5'), q: t('chatbot_q5').replace(/^[^\w]*/, '') },
  { label: t('chatbot_q6'), q: t('chatbot_q6').replace(/^[^\w]*/, '') },
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

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '0.25rem 0', marginBottom: '1.5rem' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(37,99,235,0.3)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>
        🤖
      </div>
      <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '16px 16px 16px 4px', padding: '0.8rem 1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {[0, 0.15, 0.3].map(delay => (
            <motion.span key={delay}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6', display: 'block' }}
              animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 0.8, delay, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, onChipClick }) {
  const isBot = msg.role === 'bot';
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
      style={{ display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end', marginBottom: '1rem', alignItems: 'flex-end', gap: '8px', width: '100%' }}
    >
      {isBot && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(37,99,235,0.3)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.9rem', alignSelf: 'flex-end' }}>
          🤖
        </div>
      )}

      <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end' }}>
        {isBot && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px', paddingLeft: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>JanVeda AI</span>
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 6px #10B981' }} />
          </div>
        )}

        <div
          style={{
            background: isBot ? 'rgba(255,255,255,0.95)' : 'linear-gradient(135deg, #FF6600, #FF8C42)',
            color: isBot ? '#1E293B' : 'white',
            padding: '0.85rem 1.15rem',
            borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
            boxShadow: isBot ? '0 8px 20px rgba(0,0,0,0.04)' : '0 8px 20px rgba(255,102,0,0.2)',
            border: isBot ? '1px solid rgba(255,255,255,1)' : 'none',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
            fontWeight: isBot ? 500 : 600,
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
          }}
        >
          {msg.text}
        </div>

        {/* Dynamic Follow-up Chips Array */}
        {isBot && msg.followups?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem', paddingLeft: '2px' }}>
            {msg.followups.map((f, i) => (
              <motion.button
                key={f}
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => onChipClick(f)}
                style={{
                  padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.8)', border: '1px solid #BFDBFE', 
                  borderRadius: '16px', fontSize: '0.75rem', color: '#2563EB', fontFamily: 'var(--font-heading)', 
                  fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(37,99,235,0.05)',
                  textAlign: 'left'
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#3B82F6'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#3B82F6'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
              >
                {f}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {!isBot && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6600, #FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(255,102,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.9rem', alignSelf: 'flex-end' }}>
          👤
        </div>
      )}
    </motion.div>
  );
}

export default function Chatbot() {
  const { t, i18n } = useTranslation();
  const [state, dispatch] = useReducer(chatReducer, { messages: [], isTyping: false, lastIntentId: null, turnsSinceIntent: 0 });
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const bottomRef = useRef(null);
  const liveRegionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const playAudio = async (text) => {
    try {
      const lang = i18n.language || "en";
      let voiceConfig = { languageCode: "en-US", name: "en-US-Journey-F" };
      if (lang.startsWith('hi')) voiceConfig = { languageCode: "hi-IN", name: "hi-IN-Neural2-A" };
      if (lang.startsWith('gu')) voiceConfig = { languageCode: "gu-IN", name: "gu-IN-Standard-A" };

      const cleanText = text.replace(/(\*|_|#|>|\n)/g, ' ');
      const res = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${import.meta.env.VITE_GOOGLE_CLOUD_API_KEY}`,
        {
          input: { text: cleanText.substring(0, 1500) },
          voice: voiceConfig,
          audioConfig: { audioEncoding: "MP3" }
        }
      );
      
      const audio = new Audio("data:audio/mp3;base64," + res.data.audioContent);
      audio.play().catch(e => console.error(e));
    } catch (err) {
      console.error(err);
    }
  };

  const handleVoice = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64AudioMessage = reader.result.split(',')[1];
          try {
            const res = await axios.post(
              `https://speech.googleapis.com/v1/speech:recognize?key=${import.meta.env.VITE_GOOGLE_CLOUD_API_KEY}`,
              {
                config: { encoding: "WEBM_OPUS", sampleRateHertz: 48000, languageCode: "en-US", alternativeLanguageCodes: ["hi-IN", "gu-IN"] },
                audio: { content: base64AudioMessage }
              }
            );
            const transcript = res.data.results?.[0]?.alternatives?.[0]?.transcript;
            if (transcript) handleSend(transcript, true);
          } catch (err) {
            console.error(err);
          }
        };
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTimeout(() => { if (mediaRecorderRef.current?.state === "recording") { mediaRecorderRef.current.stop(); setIsRecording(false); } }, 10000);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { 
    if(bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages, state.isTyping]);

  const handleSend = async (text = input.trim(), useVoice = false) => {
    if (!text) return;
    dispatch({ type: 'ADD_USER_MESSAGE', text });
    setInput('');
    dispatch({ type: 'SET_TYPING', value: true });
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const res = await axios.post(`${apiUrl}/chat`, { query: text });
      dispatch({ type: 'ADD_BOT_MESSAGE', text: res.data.reply, followups: [], intentId: null });
      if (liveRegionRef.current) liveRegionRef.current.textContent = res.data.reply;
      if (useVoice) playAudio(res.data.reply);
    } catch (error) {
      dispatch({ type: 'ADD_BOT_MESSAGE', text: 'Connection interrupted.', followups: [], intentId: null });
    }
  };

  return (
    <>
      <style>{`
        /* Custom scrollbar to keep it sleek and hidden on mobile */
        .chat-scroll-area::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll-area::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll-area::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.2);
          border-radius: 10px;
        }
        /* Mobile fixes */
        .cb-wrapper {
            height: 100%;
            display: flex;
            flex-direction: column;
            background: rgba(255,255,255,0.7);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.1), inset 0 1px 3px rgba(255,255,255,1);
            border: 1px solid rgba(255,255,255,0.5);
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .cb-header {
            padding: 1rem 1.5rem;
            background: rgba(255,255,255,0.5);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255,255,255,0.6);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cb-header-ava {
            width: 44px; height: 44px; font-size: 1.4rem;
        }
        .cb-q-chips-container {
            display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center;
        }
        
        @media (max-width: 640px) {
            .cb-wrapper {
                border-radius: 16px; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            }
            .cb-header {
                padding: 0.75rem 1rem;
            }
            .cb-header-ava {
                width: 38px; height: 38px; font-size: 1.2rem;
            }
            .cb-header-title {
                font-size: 1rem !important;
            }
            .cb-q-chips-container {
                flex-direction: column;
                align-items: stretch;
            }
            .cb-q-chip {
                width: 100%; text-align: center; justify-content: center;
            }
        }
      `}</style>

      <div className="cb-wrapper">
        <div ref={liveRegionRef} aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: '-9999px' }} />

        {/* Header */}
        <div className="cb-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
               <div className="cb-header-ava" style={{ borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(37,99,235,0.3)', border: '2px solid rgba(255,255,255,0.4)' }}>🤖</div>
               <span style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: '#10B981', border: '2px solid white', boxShadow: '0 0 8px #10B981' }} />
            </div>
            <div>
              <h1 className="cb-header-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>{t('chatbot_header')}</h1>
              <div style={{ color: '#10B981', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Online & Ready</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {state.messages.length > 0 && <button onClick={() => { const text = state.messages.map(m => `${m.role === 'user' ? 'You' : 'JanVeda AI'}: ${m.text}`).join('\n\n'); navigator.clipboard.writeText(text).then(() => alert('Copied!')); }} style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', fontSize: '0.8rem' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>📋</button>}
            <button onClick={() => dispatch({ type: 'CLEAR' })} style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', fontSize: '0.8rem' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>🗑️</button>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="chat-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: 'clamp(1rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column' }}>
          {state.messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '1rem', boxShadow: '0 15px 30px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.8)' }}>👋</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 900, color: '#1E293B', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #0F172A, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('chatbot_title')}</h2>
              <p style={{ color: '#64748B', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', maxWidth: '400px', lineHeight: 1.6, marginBottom: '2rem', padding: '0 1rem' }} dangerouslySetInnerHTML={{ __html: t('chatbot_desc') }} />
              
              <div className="cb-q-chips-container" style={{ width: '100%', maxWidth: '550px' }}>
                {QUICK_CHIPS(t).map((chip, idx) => (
                  <button
                    key={'c_'+idx}
                    className="cb-q-chip"
                    onClick={() => handleSend(chip.q)}
                    style={{ padding: '0.6rem 1rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '0.85rem', color: '#334155', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'inline-flex', alignItems: 'center' }}
                    onMouseOver={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(37,99,235,0.2)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {state.messages.map((msg) => <MessageBubble key={msg.id} msg={msg} onChipClick={handleSend} />)}
          <AnimatePresence>{state.isTyping && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}><TypingDots /></motion.div>}</AnimatePresence>
          <div ref={bottomRef} style={{ height: 1 }} />
        </div>

        {/* Input Dock */}
        <div style={{ padding: 'clamp(0.75rem, 2vw, 1.5rem)', background: 'rgba(255,255,255,0.5)', borderTop: '1px solid rgba(255,255,255,0.6)' }}>
          <div style={{ background: 'white', borderRadius: '100px', padding: '0.4rem', display: 'flex', gap: '0.4rem', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05), inset 0 0 0 1px #E2E8F0' }}>
            <button
              onClick={handleVoice}
              style={{ width: 44, height: 44, borderRadius: '50%', background: isRecording ? '#FEE2E2' : '#F8FAFF', color: isRecording ? '#EF4444' : '#64748B', border: '1px solid rgba(0,0,0,0.02)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0, transition: 'all 0.2s' }}
            >
              {isRecording ? <motion.span animate={{ scale:[1,1.2,1], opacity:[1,0.5,1] }} transition={{ repeat: Infinity }}>🎙️</motion.span> : '🎤'}
            </button>
            
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={t('chatbot_placeholder')}
              style={{ flex: 1, padding: '0 0.5rem', border: 'none', background: 'transparent', fontSize: '0.95rem', color: '#1E293B', outline: 'none', fontFamily: 'var(--font-body)', minWidth: 0 }}
            />

            <button
              onClick={() => handleSend(undefined, false)}
              disabled={!input.trim()}
              style={{ width: 44, height: 44, borderRadius: '50%', background: input.trim() ? 'linear-gradient(135deg, #2563EB, #3B82F6)' : '#F1F5F9', color: input.trim() ? 'white' : '#94A3B8', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, transition: 'all 0.2s', boxShadow: input.trim() ? '0 4px 10px rgba(37,99,235,0.3)' : 'none', paddingLeft: input.trim() ? '3px' : '0' }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
