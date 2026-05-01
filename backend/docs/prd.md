# 📋 Product Requirements Document (PRD)
## JanVeda AI — Interactive Election Education Platform
 
**Version:** 2.0  
**Author:** Umang Vaghela  
**Hackathon:** PromptWars Virtual Hackathon — Challenge 2  
**Submission Deadline:** 03/05/2026 11:59 PM IST  
**Tech Stack:** React · Flask (Python) · Supabase · Google Cloud Run  
**Target:** Top 100 Rank  
 
---
 
## 1. Executive Summary
 
ElectionGuide is a full-stack civic education web application that empowers every Indian citizen — especially first-time voters — to understand the election process through interactive, engaging, and accessible features. It is engineered specifically to score maximum points across all six AI evaluation criteria: **Code Quality, Security, Efficiency, Testing, Accessibility, and Google Services**.
 
### Problem Statement
> *"Create an assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way."*
 
Millions of eligible voters are confused, uninformed, or intimidated by the election process. ElectionGuide solves this with a beautifully designed, feature-rich platform that educates, guides, and empowers every citizen.
 
---
 
## 2. AI Evaluation Criteria — Full Coverage Plan
 
| Criteria | Score Strategy | Key Implementations |
|---|---|---|
| **Code Quality** | Modular, clean, documented | ESLint + Prettier (frontend), Black + Flake8 (backend), JSDoc comments, Python docstrings, SOLID principles, feature-based folder structure, reusable components |
| **Security** | Defense-in-depth | HTTPS enforced, CSP headers, input sanitization, CORS whitelist, Flask rate limiting, Supabase RLS, Secret Manager, XSS prevention, no PII stored |
| **Efficiency** | Fast load + fast response | React code-splitting, lazy loading, Flask-Caching, indexed DB queries, nginx gzip, React Query, service worker, static data for chatbot & glossary |
| **Testing** | 80%+ coverage all layers | pytest (backend), Jest + RTL (frontend), Cloud Build CI gate — deploy blocked if tests fail |
| **Accessibility** | WCAG 2.1 AA full | ARIA labels, keyboard navigation, screen reader support, 4.5:1+ contrast, focus indicators, skip links, `aria-live` regions |
| **Google Services** | Maximum integration | Cloud Run (hosting), Maps Embed API (booth location), Maps Directions API, Cloud Storage (PDFs), Secret Manager, Cloud Build (CI/CD), Cloud Logging, Google Fonts, Google Analytics 4 |
 
---
 
## 3. Target Users
 
| Segment | Primary Need |
|---|---|
| First-Time Voters (18–25) | Step-by-step guidance, confidence building |
| Returning Voters | Fast polling booth lookup |
| Rural Citizens | Simple, clear content in Hindi/English |
| Students | Quiz, glossary, civic knowledge |
| Educators | Shareable tools for awareness campaigns |
 
---
 
## 4. Feature Specifications
 
---
 
### F1 — Interactive Election Timeline
**Priority:** P0 | **Criteria:** Code Quality, Efficiency, Accessibility
 
An animated, interactive timeline showing the complete election lifecycle from Announcement to Results. Data is fetched from Supabase (with 1-hour Flask cache) and rendered as expandable phase cards.
 
**Phases:** Announcement → Voter Roll → Nomination → Campaigning → Voting Day → Counting → Results
 
**Key Requirements:**
- "You Are Here" indicator — auto-highlights current phase by comparing today's date
- Click to expand each phase: description + citizen action guide
- Filter by election type (General / State / Local)
- Hindi / English toggle (react-i18next)
- Phase progress bar (% complete)
- Mobile: vertical layout; Desktop: horizontal layout
**Acceptance Criteria:**
- All 7 phases render with icons, dates, descriptions
- Current phase auto-highlighted on load
- Animate expand/collapse < 300ms (Framer Motion)
- Fully keyboard accessible (Tab + Enter)
- ARIA `role="region"` on each phase with descriptive label
---
 
### F2 — Find My Polling Booth
**Priority:** P0 | **Criteria:** Google Services, Code Quality, Accessibility
 
Location-aware polling booth lookup using pincode or area name, backed by a Supabase database with 50+ Indian pincodes. Displays result with Google Maps embed and directions link.
 
**Key Requirements:**
- Two search modes: 6-digit pincode OR area name (text)
- Real-time input validation (regex pincode, length area name)
- Result card: booth name, block, room, full address, ward, district
- Google Maps Embed iframe showing booth on map
- "Get Directions" → `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`
- "Copy Details" → Clipboard API with toast confirmation
- "Share Booth" → Web Share API (mobile) / fallback clipboard (desktop)
- Service Worker caches last booth result for offline access
**Database:** Supabase `polling_booths` table — 50+ records across Gujarat pincodes
 
**Acceptance Criteria:**
- Valid pincode returns result < 500ms
- Invalid pincode shows `aria-live` error announcement
- Google Maps link verified to open correctly
- Offline: last searched booth served from service worker cache
- All buttons reachable by Tab, activated by Enter
---
 
### F3 — First-Time Voter Mode
**Priority:** P0 | **Criteria:** Code Quality, Accessibility, Testing
 
A personalized 6-step wizard that walks new voters from eligibility check through voting day. Progress tracked in localStorage. Ends with downloadable PDF checklist.
 
**6 Steps:**
 
| Step | Content | Interactive Element |
|---|---|---|
| 1. Eligibility | Age, citizenship, residency requirements | Age input form → Yes/No result |
| 2. Registration | NVSP portal guide, Form 6 instructions | External link to voters.eci.gov.in |
| 3. Documents | Valid ID cards grid | Toggle: Primary / Supporting docs |
| 4. Voter List | How to find your name, EPIC card | Illustrated guide |
| 5. Voting Day | What to carry, booth timing, do's & don'ts | Interactive checklist |
| 6. Inside Booth | Illustrated step walkthrough | "Practice Now" → Simulator |
 
**Key Requirements:**
- Welcome modal with "First-Time Voter?" Yes/No
- Persistent progress bar (Step X / 6)
- Checklist items saved to localStorage
- FAQ accordion at bottom of each step
- "Download PDF Checklist" — Flask backend generates PDF via ReportLab, uploads to GCS, returns signed URL
- Back/Next navigation with full keyboard support
**Acceptance Criteria:**
- Progress survives browser refresh (localStorage)
- PDF download works on mobile Chrome/Safari
- Eligibility form shows accessible validation messages
- All 6 steps navigable by keyboard only
---
 
### F4 — Voting Simulator (EVM Simulator)
**Priority:** P0 | **Criteria:** Code Quality, Efficiency, Accessibility
 
An 8-phase interactive simulation of the voting experience. Runs **100% client-side** — no API calls. Uses React `useReducer` state machine for phase management.
 
**8 Simulation Phases:**
 
| Phase | What Happens |
|---|---|
| 1. Enter Booth | Animated door opening, booth interior appears |
| 2. Show ID | Polling officer character, ID verification animation |
| 3. Sign Register | Interactive sign-on-screen animation |
| 4. Indelible Ink | Animated ink mark on finger illustration |
| 5. Approach EVM | Walk animation, EVM appears |
| 6. Select Candidate | Realistic EVM UI — press button, LED blinks, beep |
| 7. VVPAT Slip | Paper slip slides out, 7-second countdown, retracts |
| 8. Vote Cast | Green checkmark, confetti (canvas-confetti), badge |
 
**EVM Interface:**
- 5 dummy candidates: name, party, emoji symbol, button number
- Blue LED blink animation on selection
- Confirmation: "Confirm vote for [Candidate]?"
- Programmatic beep — Web Audio API oscillator (no audio file)
- VVPAT: paper slip graphic with candidate details, countdown timer
**Key Requirements:**
- State machine: `useReducer` with 8 states
- Zero API calls during simulation (pure client-side)
- Disclaimer shown before start: "This is a simulation only"
- "Try Again" → resets reducer to IDLE
- Keyboard accessible: Enter key works on all EVM buttons
**Acceptance Criteria:**
- All 8 phases complete error-free
- Beep fires on vote button press (Web Audio API)
- VVPAT 7-second countdown visible and announced to screen readers
- No network calls made during simulation
- Confetti renders and completes without performance drop
---
 
### F5 — Keyword-Based Election Chatbot ⭐ (No External API)
**Priority:** P0 | **Criteria:** Code Quality, Efficiency, Security, Accessibility
 
**The most important feature for ranking.** A fully client-side, keyword-matching chatbot that answers all election and voting doubts without any external API. Zero cost, zero latency, 100% privacy, works offline.
 
**Architecture: Pure JavaScript Engine**
```
User Input
    │
    ▼
Preprocess (lowercase, trim, remove stopwords)
    │
    ▼
Keyword Matcher (checks against 60+ intent keyword groups)
    │
    ├── Direct match found → Return mapped response
    ├── Fuzzy match (Levenshtein ≤ 2) → Return closest match
    ├── Context match (last intent remembered) → Contextual follow-up
    └── No match → "I don't know" fallback + topic suggestions
    │
    ▼
Format Response (with follow-up chips)
    │
    ▼
Display in chat UI
```
 
**60+ Intents Covered:**
 
| Category | Intents Covered |
|---|---|
| **Voter Registration** | how to register, form 6, nvsp, online registration, voter id apply, BLO, booth level officer |
| **Voter ID / EPIC** | what is voter id, epic card, lost voter id, e-EPIC download, voter slip |
| **Eligibility** | who can vote, age limit, NRI voting, prisoner voting, mental illness voting |
| **Polling Booth** | where to vote, find booth, booth number, polling station, booth location |
| **Documents** | what id to carry, aadhaar for voting, valid documents, what to bring |
| **Voting Day** | voting time, booth open close, voting date, holiday for voting, election day |
| **EVM** | what is EVM, how EVM works, EVM tampering, EVM battery, electronic voting |
| **VVPAT** | what is VVPAT, paper trail, VVPAT slip, how long VVPAT shows |
| **NOTA** | what is NOTA, none of the above, NOTA symbol |
| **Inside Booth** | voting process steps, what happens inside booth, how to cast vote |
| **Indelible Ink** | why ink on finger, indelible ink, ink removal, ink finger |
| **Election Types** | general election, state election, lok sabha, vidhan sabha, by-election, Rajya Sabha |
| **MCC** | model code of conduct, what is MCC, when MCC starts |
| **Nomination** | how to file nomination, candidate nomination, affidavit |
| **Campaigning** | election campaign rules, campaign end date, silent period |
| **Counting** | how votes counted, counting day, result declaration |
| **Voter Rights** | right to vote, voting is secret, can boss force vote |
| **Complaints** | how to complain, election helpline, 1950, cVIGIL app |
| **Election Commission** | what is ECI, election commissioner, who runs election |
| **Observer** | election observer, who monitors election |
| **Postal Ballot** | postal ballot, absentee voting, armed forces voting |
| **Re-polling** | when re-polling happens, booth capturing |
| **Greetings** | hello, hi, help, what can you do |
| **Appreciation** | thank you, thanks, good, helpful |
 
**Multi-Turn Context:**
- Chatbot remembers last intent for 3 turns
- If user says "how long?" after asking about VVPAT, it answers "7 seconds" contextually
**Fuzzy Matching:**
```javascript
// Levenshtein distance ≤ 2 handles typos
// "registartion" → "registration" → voter registration intent
// "EVm" → "EVM" → EVM intent
```
 
**Key Requirements:**
- Response time < 100ms (client-side JavaScript)
- 60+ curated Q&A pairs in `/src/data/chatbotData.js`
- Quick-reply chips: "How to register?", "Find my booth", "What is NOTA?", "EVM help"
- Typing indicator animation (realistic 500ms delay)
- Conversation history: last 20 messages stored in state
- Clear chat button
- "Copy chat" export as plain text
- Hindi keyword support for basic queries (e.g., "matdan kaise kare")
- Works completely offline — no network required
- ARIA `aria-live="polite"` region announces every bot response
**Response Database Structure (`/src/data/chatbotData.js`):**
```javascript
export const chatbotIntents = [
  {
    id: "voter_registration",
    keywords: ["register", "registration", "how to register", "apply voter id", "form 6", "nvsp", "new voter"],
    response: "To register as a voter in India:\n1. Visit voters.eci.gov.in\n2. Click 'New Registration' and fill Form 6\n3. Upload required documents (Aadhaar, photo, address proof)\n4. Submit and note your reference number\n5. BLO will verify — process takes 2–4 weeks\n\nYou can also visit your nearest BLO (Booth Level Officer) for offline registration.",
    followups: ["What documents are needed?", "How long does it take?", "What is BLO?"]
  },
  // ... 59+ more intents
];
```
 
**Acceptance Criteria:**
- [ ] 60+ intents return correct responses
- [ ] Response delivered < 100ms
- [ ] Fuzzy matching handles 1–2 char typos
- [ ] Hindi keywords trigger correct responses
- [ ] `aria-live` announces bot response to screen readers
- [ ] Works offline with no network dependency
- [ ] No external API calls — verified by network panel
---
 
### F6 — Election Quiz & Gamification
**Priority:** P1 | **Criteria:** Code Quality, Testing, Accessibility
 
20-question MCQ quiz with timer, instant feedback, badge system, and anonymous Supabase leaderboard.
 
**Questions cover:** Constitution, voting process, election history, voter rights, ECI, EVM, NOTA, MCC
 
**Badge System:**
| Score Range | Badge |
|---|---|
| 0–39 | 📘 Learning Voter |
| 40–59 | 🥉 Bronze Voter |
| 60–79 | 🥈 Silver Voter |
| 80–95 | 🥇 Gold Voter |
| 96–100 | 💎 Platinum Voter |
 
**Key Requirements:**
- Questions shuffled per session from Supabase `quiz_questions` table
- 30-second countdown timer per question
- Correct answer: green highlight + explanation shown
- Wrong answer: red highlight + correct option highlighted
- Anonymous leaderboard (session_id only, no name)
- Share result card via Web Share API / clipboard
---
 
### F7 — Election Glossary
**Priority:** P1 | **Criteria:** Efficiency, Accessibility
 
Searchable dictionary of 60+ election terms — completely static JSON, zero API calls.
 
**Key Requirements:**
- Bundled JSON data (instant load, no API)
- Debounced search (300ms), matching text highlighted
- A–Z alphabetical index navigation
- Web Speech API for audio pronunciation
- Bookmark terms → localStorage
- "Bookmarked" filter view
---
 
### F8 — Election Reminders (Browser Notifications)
**Priority:** P2 | **Criteria:** Google Services
 
Browser notification opt-in for election day reminders (7 days, 1 day, day-of). Client-side scheduling via `setTimeout`, no server-side push.
 
---
 
## 5. Design System
 
### Color Palette (Indian Tricolor Inspired)
| Token | Hex | Usage |
|---|---|---|
| `--primary` | `#FF6B35` | Saffron — CTAs, active states, highlights |
| `--secondary` | `#1B3A6B` | Navy — headers, navbar |
| `--accent` | `#2ECC71` | Emerald — success, correct, checkmarks |
| `--bg` | `#FAFAF8` | Warm white — page background |
| `--surface` | `#F0F2F5` | Light grey — cards, inputs |
| `--text-primary` | `#2D3748` | Charcoal — body text |
| `--text-secondary` | `#718096` | Grey — captions |
| `--warning` | `#F6AD55` | Amber — alerts |
| `--error` | `#E53E3E` | Crimson — errors |
 
### Typography
- **Headings:** Poppins 700/600 (Google Fonts)
- **Body:** Inter 400/500 (Google Fonts)
- **Minimum body font size:** 16px
- **Minimum caption size:** 14px
### Accessibility Targets
- Contrast ratio: ≥ 4.5:1 normal text, ≥ 3:1 large text
- Touch targets: minimum 44×44px
- Focus ring: 2px solid `#FF6B35`, 2px offset
- No color-only information
---
 
## 6. Non-Functional Requirements
 
| Requirement | Target |
|---|---|
| LCP | < 2.5 seconds |
| TTI | < 3.5 seconds |
| CLS | < 0.1 |
| Accessibility | WCAG 2.1 AA |
| Uptime | 99.9% (Cloud Run SLA) |
| Chatbot Response | < 100ms (client-side) |
| API Response | < 500ms (Flask + Supabase) |
| Repo Size | < 10MB |
| Browser Support | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Mobile | 320px – 2560px fully responsive |
| Offline | Core features via service worker cache |
 
---
 
## 7. User Journeys
 
**Journey 1 — First-Time Voter:**
Home → First-Time Voter Mode → 6 Steps → Booth Finder → Simulator → Chatbot → Download Checklist
 
**Journey 2 — Quick Lookup:**
Home → Booth Finder (pincode) → Google Maps Directions
 
**Journey 3 — Education:**
Home → Timeline → Quiz → Glossary → Chatbot
 
**Journey 4 — Doubt Resolution:**
Home → Chatbot (questions) → Simulator (practice) → Quiz (test)
 
---
 
## 8. Submission Quality Checklist
 
### Code Quality
- [ ] ESLint (0 warnings/errors) on frontend
- [ ] Black + Flake8 compliant on backend
- [ ] Prettier formatting enforced
- [ ] JSDoc on all utility functions
- [ ] Python docstrings on all routes/services
- [ ] Meaningful variable/function names
- [ ] No commented-out dead code
- [ ] Feature-based folder structure
### Security
- [ ] HTTPS enforced via Cloud Run
- [ ] CSP headers in nginx.conf
- [ ] CORS whitelist in Flask (production domain only)
- [ ] All inputs validated (marshmallow schemas)
- [ ] Rate limiting on all Flask endpoints
- [ ] Supabase RLS on all tables
- [ ] All secrets in Google Secret Manager
- [ ] No API keys in frontend bundle
- [ ] No PII stored anywhere
### Efficiency
- [ ] React.lazy() on all page components
- [ ] Suspense with meaningful loading UI
- [ ] Flask-Caching on /api/elections (1hr TTL)
- [ ] Supabase indexes on pincode, area_name
- [ ] Nginx gzip enabled
- [ ] Google Fonts preloaded
- [ ] Static data (chatbot, glossary) bundled — no API calls
- [ ] React Query for deduplication of API calls
### Testing
- [ ] pytest coverage ≥ 80% (backend)
- [ ] Jest + RTL coverage ≥ 80% (frontend)
- [ ] Tests for all API endpoints
- [ ] Tests for chatbot keyword matching engine
- [ ] Tests for EVM simulator state machine
- [ ] Cloud Build blocks deploy if tests fail
### Accessibility
- [ ] ARIA labels on all interactive elements
- [ ] `aria-live="polite"` on chatbot responses
- [ ] `aria-live="assertive"` on error messages
- [ ] All images have descriptive `alt` text
- [ ] Skip navigation link at page top
- [ ] Logical Tab order verified
- [ ] Focus visible on all focusable elements
- [ ] Tested with NVDA + macOS VoiceOver
- [ ] Color contrast verified (all combinations)
### Google Services
- [ ] Google Cloud Run (frontend + backend hosting)
- [ ] Google Maps Embed API (booth location)
- [ ] Google Maps Directions URL (navigation)
- [ ] Google Cloud Storage (PDF checklists)
- [ ] Google Secret Manager (all credentials)
- [ ] Google Cloud Build (CI/CD pipeline)
- [ ] Google Cloud Logging (request logs)
- [ ] Google Fonts (Poppins + Inter)
- [ ] Google Analytics 4 (usage tracking)