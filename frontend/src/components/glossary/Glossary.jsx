import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title">📖 Election Glossary</h1>
        <p className="section-subtitle">{TERMS.length}+ election terms explained simply</p>
      </header>

      {/* Search + Filters */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow)', marginBottom: '2rem', borderTop: '4px solid var(--secondary)' }}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="glossary-search" className="form-label">Search Terms</label>
          <input
            id="glossary-search"
            type="search"
            value={search}
            onChange={e => { setSearch(e.target.value); setLetter(''); }}
            placeholder="Search by term, abbreviation, or definition…"
            className="form-input"
            aria-label="Search election glossary"
          />
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }} role="group" aria-label="Filter by category">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className="chip" aria-pressed={category === c}
              style={{ background: category === c ? 'var(--secondary)' : undefined, color: category === c ? 'white' : undefined, borderColor: category === c ? 'var(--secondary)' : undefined }}>
              {c}
            </button>
          ))}
        </div>

        {/* A-Z filter */}
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }} role="group" aria-label="Filter by first letter">
          <button onClick={() => setLetter('')} className="chip small" aria-pressed={!letter}
            style={{ background: !letter ? 'var(--primary)' : undefined, color: !letter ? 'white' : undefined, borderColor: !letter ? 'var(--primary)' : undefined }}>All</button>
          {ALPHABET.map(l => (
            <button key={l} className="chip small" onClick={() => setLetter(l)} aria-pressed={letter === l}
              style={{ background: letter === l ? 'var(--primary)' : undefined, color: letter === l ? 'white' : undefined, borderColor: letter === l ? 'var(--primary)' : undefined }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }} aria-live="polite" aria-atomic="true">
        Showing {filtered.length} of {TERMS.length} terms {bookmarked.size > 0 && `• ${bookmarked.size} bookmarked`}
      </div>

      {/* Terms grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No terms found. Try a different search or clear filters.
          </div>
        )}
        {filtered.map(t => (
          <motion.article key={t.term} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ borderLeft: '4px solid var(--primary)', padding: '1.25rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '0.2rem' }}>{t.term}</h3>
                {t.full && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{t.full}</div>}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>{t.category}</span>
                <button
                  onClick={() => toggleBookmark(t.term)}
                  aria-label={bookmarked.has(t.term) ? `Remove ${t.term} from bookmarks` : `Bookmark ${t.term}`}
                  aria-pressed={bookmarked.has(t.term)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: bookmarked.has(t.term) ? 'var(--primary)' : 'var(--text-muted)', minHeight: '36px', minWidth: '36px', borderRadius: 'var(--radius-sm)' }}
                >
                  {bookmarked.has(t.term) ? '🔖' : '📌'}
                </button>
              </div>
            </div>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.65 }}>{t.definition}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
