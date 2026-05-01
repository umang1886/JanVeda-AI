import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TERMS = [
  { term: 'EPIC', full: 'Elector\'s Photo Identity Card', category: 'Documents', definition: 'The official voter ID card issued by the Election Commission of India. Primary identity proof for voting.' },
  { term: 'EVM', full: 'Electronic Voting Machine', category: 'Technology', definition: 'A standalone electronic device used to cast votes in Indian elections. Made by ECIL and BEL. Not connected to internet.' },
  { term: 'VVPAT', full: 'Voter Verified Paper Audit Trail', category: 'Technology', definition: 'A device attached to the EVM that prints a paper slip showing the chosen candidate. Visible for 7 seconds.' },
  { term: 'NOTA', full: 'None of the Above', category: 'Voting Process', definition: 'Option on EVMs to reject all candidates. Introduced by Supreme Court order in 2013. Last button on the ballot.' },
  { term: 'BLO', full: 'Booth Level Officer', category: 'Officials', definition: 'A government official (typically a teacher) assigned to each polling booth area to manage voter rolls.' },
  { term: 'ERO', full: 'Electoral Registration Officer', category: 'Officials', definition: 'The officer responsible for maintaining the electoral roll for a constituency. Processes voter registration forms.' },
  { term: 'MCC', full: 'Model Code of Conduct', category: 'Regulations', definition: 'Guidelines issued by ECI when elections are announced. Prevents misuse of government power for campaigning.' },
  { term: 'Affidavit', full: 'Candidate Disclosure Form', category: 'Regulations', definition: 'A sworn legal document filed by candidates disclosing their assets, liabilities, and criminal cases (if any).' },
  { term: 'Returning Officer', full: 'RO', category: 'Officials', definition: 'An officer appointed by ECI responsible for conducting elections in a specific constituency — accepts nominations, announces results.' },
  { term: 'Electoral Roll', full: 'Voter List', category: 'Documents', definition: 'The official list of all registered voters in a constituency. Your name must be on this list to vote.' },
  { term: 'By-Election', full: 'Bye-Election / Bypoll', category: 'Elections', definition: 'An election held for a single constituency when the seat falls vacant mid-term due to death, resignation, or disqualification.' },
  { term: 'Lok Sabha', full: 'House of the People', category: 'Elections', definition: 'The lower house of India\'s Parliament. 543 seats. Members elected directly by voters every 5 years.' },
  { term: 'Vidhan Sabha', full: 'State Legislative Assembly', category: 'Elections', definition: 'The lower house of a state legislature. Members (MLAs) are elected directly by voters in state assembly elections.' },
  { term: 'Rajya Sabha', full: 'Council of States', category: 'Elections', definition: 'The upper house of India\'s Parliament. Members elected by state legislative assemblies — not directly by voters.' },
  { term: 'Indelible Ink', full: 'Voting Ink / Silver Nitrate Ink', category: 'Voting Process', definition: 'Applied on the left index finger before voting to prevent double voting. Made by Mysore Paints & Varnish Ltd.' },
  { term: 'Presiding Officer', full: 'Polling Booth Presiding Officer', category: 'Officials', definition: 'The senior official in charge of a polling booth on election day. Controls the EVM\'s Control Unit.' },
  { term: 'cVIGIL', full: 'Citizen Vigilance App', category: 'Technology', definition: 'ECI\'s mobile app for citizens to report election violations. Flying Squads respond within 100 minutes.' },
  { term: 'Voter Slip', full: 'Polling Slip', category: 'Documents', definition: 'A document distributed by BLO showing your booth location and voter serial number. NOT a valid ID proof alone.' },
  { term: 'Postal Ballot', full: 'Absentee Ballot', category: 'Voting Process', definition: 'Voting by post instead of visiting a booth. Available to Armed Forces, police, and some other categories.' },
  { term: 'Election Observer', full: 'ECI Observer', category: 'Officials', definition: 'IAS/IPS officer from another state deployed by ECI to monitor elections in a constituency.' },
  { term: 'Strong Room', full: 'EVM Storage Room', category: 'Security', definition: 'The sealed, guarded room where EVMs are stored before and after polling. Monitored by CCTV and security forces.' },
  { term: 'Counting Agent', full: 'Candidate Counting Agent', category: 'Elections', definition: 'A representative appointed by a candidate to observe the vote counting process on counting day.' },
  { term: 'First Past the Post', full: 'FPTP / Plurality Voting', category: 'Elections', definition: 'India\'s election system: the candidate with the most votes wins — no minimum percentage required.' },
  { term: 'Mock Poll', full: 'Preparatory Voting Test', category: 'Technology', definition: 'A test conducted before actual polling begins to ensure the EVM is functioning correctly. Agents observe and sign.' },
  { term: 'Anti-Defection Law', full: '10th Schedule', category: 'Regulations', definition: 'Law preventing elected members from changing party affiliation. Defectors may lose their seat.' },
  { term: 'Re-polling', full: 'Fresh Polling Order', category: 'Elections', definition: 'ECI can order a fresh election at a booth or constituency in case of booth capturing, EVM malfunction, or serious irregularities.' },
  { term: 'Constituency', full: 'Electoral Constituency', category: 'Elections', definition: 'A defined geographical area represented by one elected member. India has 543 Lok Sabha and 4120+ Vidhan Sabha constituencies.' },
  { term: 'Nomination', full: 'Candidate Nomination Form', category: 'Regulations', definition: 'A form filed by a prospective candidate to stand for election. Must include affidavit and security deposit.' },
  { term: 'Security Deposit', full: 'Election Security Deposit', category: 'Regulations', definition: '₹25,000 for Lok Sabha, ₹12,500 for Vidhan Sabha. Forfeited if candidate gets less than 1/6th of valid votes polled.' },
  { term: 'ECI', full: 'Election Commission of India', category: 'Officials', definition: 'Constitutional body responsible for conducting free and fair elections. Established Jan 25, 1950. Independent of government.' },
  { term: 'Qualifying Date', full: 'Electoral Qualifying Date', category: 'Voting Process', definition: 'January 1st of the year — your age on this date determines eligibility. Must be 18+ on this date to register as voter.' },
  { term: 'Form 6', full: 'Voter Registration Form', category: 'Documents', definition: 'The form used to register as a new voter in India. Available online at voters.eci.gov.in and at ERO offices.' },
  { term: 'Form 8', full: 'Voter Correction Form', category: 'Documents', definition: 'Form used to correct errors in your existing voter registration record (name spelling, address, photo, etc.).' },
  { term: 'NRI Voter', full: 'Non-Resident Indian Voter', category: 'Voting Process', definition: 'Indian citizens living abroad can register as overseas electors and vote, but must be physically present in India on polling day.' },
  { term: 'Silent Period', full: 'Campaign Blackout Period', category: 'Regulations', definition: '48 hours before polling begins, no political campaigning is allowed. Rallies, speeches, and canvassing are prohibited.' },
  { term: 'Flying Squad', full: 'ECI Flying Squad', category: 'Officials', definition: 'A rapid enforcement team deployed by ECI to respond to election violations reported through cVIGIL or 1950 helpline.' },
  { term: 'e-EPIC', full: 'Digital Voter ID Card', category: 'Documents', definition: 'The digital/PDF version of the EPIC voter ID card. Downloadable from voters.eci.gov.in. Legally valid for voting.' },
  { term: 'Voter Helpline', full: '1950 Helpline', category: 'Technology', definition: 'Toll-free voter assistance number: 1950. For registration queries, booth location, complaints, and election information.' },
  { term: 'Candidate Affidavit', full: 'Sworn Disclosure Document', category: 'Regulations', definition: 'A mandatory legal document candidates must file declaring their assets, liabilities, education, and criminal cases.' },
  { term: 'Ballot Unit', full: 'EVM Ballot Unit', category: 'Technology', definition: 'The voter-facing part of the EVM showing candidate names, party symbols, and voting buttons.' },
  { term: 'Control Unit', full: 'EVM Control Unit', category: 'Technology', definition: 'The part of the EVM with the Presiding Officer. It activates the Ballot Unit for each voter and records total vote count.' },
];

const CATEGORIES = ['All', ...new Set(TERMS.map(t => t.category))];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function getColorByCategory(cat) {
  const map = {
    'Documents': '#3B82F6',
    'Technology': '#8B5CF6',
    'Voting Process': '#10B981',
    'Officials': '#F59E0B',
    'Regulations': '#EF4444',
    'Elections': '#0EA5E9',
    'Security': '#64748B'
  };
  return map[cat] || '#2563EB';
}

export default function Glossary() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [letter, setLetter] = useState('');
  const [bookmarked, setBookmarked] = useState(new Set());

  const filtered = useMemo(() => TERMS.filter(t => {
    const matchSearch = !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase()) || t.full?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || t.category === category;
    const matchLetter = !letter || t.term.toUpperCase().startsWith(letter);
    return matchSearch && matchCat && matchLetter;
  }), [search, category, letter]);

  const toggleBookmark = (term) => setBookmarked(prev => { const n = new Set(prev); if (n.has(term)) n.delete(term); else n.add(term); return n; });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem' }}>
      
      {/* Hero Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}>📖</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, color: '#0D3E96', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>The Civic Encyclopedia</h1>
        <p style={{ color: '#64748B', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>Demystify complex election jargon. Find exactly what {TERMS.length}+ technical democratic terms mean in simple language.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '2rem', position: 'relative' }}>
        
        {/* Left Control Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main Search */}
          <div style={{ position: 'sticky', top: '100px', background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', color: '#94A3B8' }}>🔍</span>
              <input
                type="search"
                value={search}
                onChange={e => { setSearch(e.target.value); setLetter(''); }}
                placeholder="Search acronyms..."
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#F8FAFF', border: '2px solid #E2E8F0', borderRadius: '14px', fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#1E293B', outline: 'none', transition: 'all 0.2s' }}
                onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.background = 'white' }}
                onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFF' }}
              />
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Filter by Context</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {CATEGORIES.map(c => {
                const isActive = category === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1rem',
                      background: isActive ? '#EFF6FF' : 'transparent', border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                      borderRadius: '12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                      color: isActive ? '#1D4ED8' : '#475569', fontWeight: isActive ? 700 : 500, fontFamily: 'var(--font-heading)'
                    }}
                    onMouseEnter={e => { if(!isActive) e.currentTarget.style.background = '#F8FAFF' }}
                    onMouseLeave={e => { if(!isActive) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: c === 'All' ? '#1E293B' : getColorByCategory(c) }} />
                      {c}
                    </div>
                    {isActive && <span>✓</span>}
                  </button>
                )
              })}
            </div>
            
            <div style={{ height: '1px', background: '#E2E8F0', margin: '1.5rem 0' }} />

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Index</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {ALPHABET.map(l => (
                  <button 
                    key={l} 
                    onClick={() => setLetter(letter === l ? '' : l)}
                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: 'none', background: letter === l ? '#2563EB' : '#F1F5F9', color: letter === l ? 'white' : '#64748B', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    {l}
                  </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem' }}>
            <div style={{ fontSize: '1rem', color: '#64748B', fontWeight: 500 }}>
              Showing <span style={{ color: '#1E293B', fontWeight: 800 }}>{filtered.length}</span> terms {bookmarked.size > 0 && <span style={{ color: '#2563EB', marginLeft: '10px' }}>• {bookmarked.size} saved 📌</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            <AnimatePresence>
              {filtered.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '24px', border: '1px dashed #CBD5E1' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧐</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#1E293B' }}>No terms found matching '{search}'</h3>
                  <p style={{ color: '#64748B' }}>Try searching something else or clearing your filters.</p>
                </motion.div>
              )}
              
              {filtered.map(t => {
                const isSaved = bookmarked.has(t.term);
                return (
                  <motion.article 
                    layout 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={t.term} 
                    style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0', position: 'relative', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ paddingRight: '2rem' }}>
                        <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', background: `${getColorByCategory(t.category)}15`, color: getColorByCategory(t.category), borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                          {t.category}
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>{t.term}</h3>
                        {t.full && <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginTop: '0.2rem' }}>{t.full}</div>}
                      </div>

                      <button
                        onClick={() => toggleBookmark(t.term)}
                        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: isSaved ? 1 : 0.4, transition: 'all 0.2s', filter: isSaved ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => { if(!isSaved) e.currentTarget.style.opacity = 0.4 }}
                      >
                        {isSaved ? '📌' : '🔖'}
                      </button>
                    </div>
                    
                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, flex: 1, margin: 0 }}>
                      {t.definition}
                    </p>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
