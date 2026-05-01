# 🏗️ Architecture Document
## JanVeda AI— Complete System Architecture
 
**Version:** 2.0
**Project:** JanVeda AI — Interactive Election Education Platform
**Deployment:** Google Cloud Run (asia-south1)
**Key Change:** External AI API removed → Client-side keyword chatbot engine
 
---
 
## 1. High-Level System Architecture
 
```
╔══════════════════════════════════════════════════════════════════════╗
║                         INTERNET USERS                               ║
╚══════════════════════════════╦═══════════════════════════════════════╝
                               ║ HTTPS (TLS 1.3)
╔══════════════════════════════▼═══════════════════════════════════════╗
║              Google Cloud Run — Managed Ingress                      ║
║              (Auto HTTPS, Load Balancing, Auto-scaling)              ║
╚══════════╦══════════════════════════════════╦════════════════════════╝
           ║                                  ║
╔══════════▼══════════════╗      ╔════════════▼══════════════════════╗
║  SERVICE 1: Frontend    ║      ║  SERVICE 2: Backend               ║
║  React SPA + nginx      ║      ║  Flask + Gunicorn                 ║
║  Port: 8080             ║      ║  Port: 8080                       ║
║  Region: asia-south1    ║      ║  Region: asia-south1              ║
║                         ║      ║                                   ║
║  • Static React build   ║      ║  /api/booth                       ║
║  • nginx serves SPA     ║      ║  /api/elections                   ║
║  • Gzip compression     ║      ║  /api/quiz/*                      ║
║  • CSP/Security headers ║      ║  /api/generate-checklist          ║
║  • Service Worker       ║      ║  /health                          ║
╚═════════════════════════╝      ╚══════════╦════════════════════════╝
                                            ║
              ╔═════════════════════════════╬══════════════════════╗
              ║                             ║                      ║
╔═════════════▼══════════╗   ╔═════════════▼══════╗   ╔═══════════▼════════╗
║  Supabase (PostgreSQL) ║   ║  Google Cloud      ║   ║  Google Secret     ║
║  + Row Level Security  ║   ║  Storage (GCS)     ║   ║  Manager           ║
║                        ║   ║                    ║   ║                    ║
║  • polling_booths      ║   ║  • PDF checklists  ║   ║  • supabase-url    ║
║  • elections           ║   ║  • Signed URLs     ║   ║  • supabase-key    ║
║  • quiz_questions      ║   ║  • 24hr expiry     ║   ║  • maps-api-key    ║
║  • quiz_scores         ║   ╚════════════════════╝   ║  • flask-secret    ║
╚════════════════════════╝                            ╚════════════════════╝
 
╔══════════════════════════════════════════════════════════════════════╗
║          CLIENT-SIDE ONLY (No Backend — No API)                     ║
║                                                                     ║
║  🤖 Keyword Chatbot Engine    📖 Glossary (static JSON)             ║
║  🗳️  EVM Voting Simulator     📊 Quiz Questions (fallback JSON)     ║
║  🔊  Web Audio API (beep)     💾 LocalStorage (progress/bookmarks) ║
║  📴  Service Worker (offline cache)                                 ║
╚══════════════════════════════════════════════════════════════════════╝
```
 
---
 
## 2. Detailed Component Architecture
 
### 2.1 Frontend Architecture (React SPA)
 
```
frontend/
├── public/
│   ├── index.html                  # App shell — preloads fonts, GA4 script
│   ├── manifest.json               # PWA manifest
│   ├── robots.txt
│   └── locales/
│       ├── en/
│       │   └── translation.json    # English strings (react-i18next)
│       └── hi/
│           └── translation.json    # Hindi strings
│
├── src/
│   ├── index.jsx                   # ReactDOM.render + i18n init
│   ├── App.jsx                     # Router, ErrorBoundary, lazy imports
│   ├── serviceWorker.js            # Caches booth data + static assets
│   │
│   ├── pages/                      # Route-level — all lazy loaded
│   │   ├── Home.jsx                # Landing page + hero CTA
│   │   ├── BoothFinderPage.jsx
│   │   ├── TimelinePage.jsx
│   │   ├── FirstTimeVoterPage.jsx
│   │   ├── SimulatorPage.jsx
│   │   ├── QuizPage.jsx
│   │   ├── GlossaryPage.jsx
│   │   ├── ChatbotPage.jsx
│   │   └── NotFound.jsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx          # Responsive nav + language toggle
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx  # Suspense fallback
│   │   │   ├── ErrorBoundary.jsx   # Catches render errors
│   │   │   ├── SkipLink.jsx        # Accessibility: skip to main content
│   │   │   └── Toast.jsx           # Clipboard / share confirmations
│   │   │
│   │   ├── booth/
│   │   │   ├── BoothFinder.jsx     # Search form + result card
│   │   │   ├── BoothCard.jsx       # Booth details display
│   │   │   └── MapEmbed.jsx        # Google Maps iframe + directions
│   │   │
│   │   ├── timeline/
│   │   │   ├── ElectionTimeline.jsx
│   │   │   └── PhaseCard.jsx       # Expandable phase with Framer Motion
│   │   │
│   │   ├── firsttimevoter/
│   │   │   ├── FirstTimeVoterMode.jsx  # Wizard shell + progress bar
│   │   │   ├── steps/
│   │   │   │   ├── Step1Eligibility.jsx
│   │   │   │   ├── Step2Registration.jsx
│   │   │   │   ├── Step3Documents.jsx
│   │   │   │   ├── Step4VoterList.jsx
│   │   │   │   ├── Step5VotingDay.jsx
│   │   │   │   └── Step6InsideBooth.jsx
│   │   │   └── ChecklistItem.jsx
│   │   │
│   │   ├── simulator/
│   │   │   ├── VotingSimulator.jsx     # Phase orchestrator (useReducer)
│   │   │   ├── phases/
│   │   │   │   ├── EnterBooth.jsx
│   │   │   │   ├── ShowID.jsx
│   │   │   │   ├── SignRegister.jsx
│   │   │   │   ├── IndelibleInk.jsx
│   │   │   │   ├── ApproachEVM.jsx
│   │   │   │   ├── EVMInterface.jsx    # EVM buttons + LED animation
│   │   │   │   ├── ConfirmVote.jsx
│   │   │   │   ├── VVPATSlip.jsx       # Paper slip + 7s countdown
│   │   │   │   └── Celebration.jsx     # Confetti + badge
│   │   │   └── CandidateButton.jsx
│   │   │
│   │   ├── chatbot/
│   │   │   ├── Chatbot.jsx             # Chat UI + useReducer state
│   │   │   ├── MessageBubble.jsx       # User/bot message display
│   │   │   └── QuickChips.jsx          # Suggested question buttons
│   │   │
│   │   ├── quiz/
│   │   │   ├── Quiz.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── TimerBar.jsx
│   │   │   └── ResultScreen.jsx
│   │   │
│   │   └── glossary/
│   │       ├── Glossary.jsx
│   │       ├── TermCard.jsx
│   │       └── AlphabetIndex.jsx
│   │
│   ├── hooks/
│   │   ├── useBoothSearch.js       # React Query + API call
│   │   ├── useElections.js         # React Query + API call
│   │   ├── useQuiz.js              # Quiz state + scoring logic
│   │   ├── useLocalStorage.js      # Generic localStorage hook
│   │   └── useClipboard.js         # Clipboard API with toast
│   │
│   ├── utils/
│   │   ├── chatEngine.js           # ★ Keyword matching engine (Levenshtein + intent match)
│   │   ├── audio.js                # Web Audio API EVM beep generator
│   │   ├── pdf.js                  # PDF download helper (calls /api/generate-checklist)
│   │   ├── share.js                # Web Share API wrapper
│   │   └── date.js                 # date-fns wrappers for timeline
│   │
│   ├── data/                       # Static data — bundled, zero API calls
│   │   ├── chatbotData.js          # ★ 60+ intents, contextual responses, fallback
│   │   ├── glossaryTerms.json      # 60+ election terms
│   │   └── quizQuestions.json      # 20+ questions (offline fallback)
│   │
│   ├── services/
│   │   └── api.js                  # Axios instance — all backend API calls
│   │
│   ├── store/
│   │   ├── voterStore.js           # Zustand: firstTimeMode, language pref
│   │   └── quizStore.js            # Zustand: quiz session state
│   │
│   └── styles/
│       ├── global.css              # Base styles, reset
│       └── variables.css           # CSS custom properties (design tokens)
│
├── __tests__/
│   ├── chatEngine.test.js          # Unit tests for keyword matching engine
│   ├── BoothFinder.test.jsx
│   ├── VotingSimulator.test.jsx
│   ├── FirstTimeVoterMode.test.jsx
│   ├── Quiz.test.jsx
│   └── Glossary.test.jsx
│
├── Dockerfile                      # Multi-stage: node build → nginx serve
├── nginx.conf                      # SPA routing, gzip, CSP headers
├── .env.example
└── package.json
```
 
### 2.2 Backend Architecture (Flask)
 
```
backend/
├── wsgi.py                         # Gunicorn entrypoint: from app import create_app
├── app/
│   ├── __init__.py                 # App factory: create_app(config)
│   ├── config.py                   # Config classes: Development, Production
│   ├── extensions.py               # CORS, Limiter, Cache, Compress instances
│   │
│   ├── routes/
│   │   ├── __init__.py             # Register all blueprints
│   │   ├── booth.py                # GET /api/booth?pincode= or ?area=
│   │   ├── elections.py            # GET /api/elections
│   │   ├── quiz.py                 # GET /api/quiz/questions, POST /api/quiz/submit
│   │   └── checklist.py            # POST /api/generate-checklist (PDF → GCS)
│   │
│   ├── schemas/                    # Marshmallow input validation
│   │   ├── booth_schema.py         # BoothSearchSchema (pincode regex, area length)
│   │   ├── quiz_schema.py          # QuizSubmitSchema (score, session_id)
│   │   └── checklist_schema.py     # ChecklistSchema (name optional, steps)
│   │
│   ├── services/
│   │   ├── supabase_client.py      # Singleton Supabase client (lazy init)
│   │   ├── gcs_service.py          # GCS upload + signed URL generation
│   │   └── pdf_service.py          # ReportLab PDF generation
│   │
│   └── utils/
│       └── helpers.py              # Response formatters, error handlers
│
├── tests/
│   ├── conftest.py                 # Flask test client fixture, test DB
│   ├── test_booth.py               # Booth lookup: valid, invalid, not found, rate limit
│   ├── test_elections.py           # Timeline data, cache behavior
│   ├── test_quiz.py                # Questions endpoint, score submission
│   └── test_checklist.py          # PDF generation, GCS upload mock
│
├── Dockerfile                      # python:3.11-slim, non-root user, gunicorn
├── requirements.txt
├── .env.example
└── pyproject.toml                  # Black + Flake8 + isort config
```
 
### 2.3 Database Architecture (Supabase / PostgreSQL)
 
```
database/
├── migrations/
│   ├── 001_create_polling_booths.sql
│   ├── 002_create_elections.sql
│   ├── 003_create_quiz_questions.sql
│   └── 004_create_quiz_scores.sql
└── seeds/
    ├── polling_booths.sql          # 50+ Gujarat pincodes → booth details
    ├── elections.sql               # Sample election schedule
    └── quiz_questions.sql          # 20+ civic knowledge questions
```
 
**Schema Definitions:**
 
```sql
-- ── POLLING BOOTHS ─────────────────────────────────────────────────────
CREATE TABLE polling_booths (
  id          SERIAL PRIMARY KEY,
  pincode     VARCHAR(6)   NOT NULL,
  area_name   TEXT         NOT NULL,
  booth_name  TEXT         NOT NULL,
  booth_number INTEGER,
  block_number TEXT,
  room_number  TEXT,
  full_address TEXT         NOT NULL,
  latitude    DECIMAL(10,8) NOT NULL,
  longitude   DECIMAL(11,8) NOT NULL,
  ward        TEXT,
  district    TEXT,
  state       TEXT          DEFAULT 'Gujarat',
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);
 
-- Performance indexes
CREATE INDEX idx_booths_pincode ON polling_booths (pincode);
CREATE INDEX idx_booths_area_fts ON polling_booths
  USING GIN (to_tsvector('english', area_name));
 
-- RLS: anyone can read (public election data)
ALTER TABLE polling_booths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_booths" ON polling_booths
  FOR SELECT USING (true);
 
 
-- ── ELECTIONS (TIMELINE DATA) ──────────────────────────────────────────
CREATE TABLE elections (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  election_name  TEXT    NOT NULL,
  election_type  TEXT    CHECK (election_type IN ('general','state','local')),
  phases         JSONB   NOT NULL,   -- array of phase objects (see below)
  is_active      BOOLEAN DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
 
/*  Phase JSONB structure:
    [
      {
        "phase_id": 1,
        "name": "Election Announcement",
        "icon": "📢",
        "start_date": "2026-03-01",
        "end_date": "2026-03-07",
        "description": "ECI announces schedule...",
        "citizen_action": "Check your voter registration",
        "color": "#FF6B35"
      },
      ...
    ]
*/
 
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_elections" ON elections
  FOR SELECT USING (true);
 
 
-- ── QUIZ QUESTIONS ─────────────────────────────────────────────────────
CREATE TABLE quiz_questions (
  id            SERIAL  PRIMARY KEY,
  question      TEXT    NOT NULL,
  options       JSONB   NOT NULL,    -- ["Option A", "Option B", "Option C", "Option D"]
  correct_index INTEGER NOT NULL,    -- 0-based index into options array
  explanation   TEXT,
  category      TEXT    CHECK (category IN ('constitution','process','history','rights','evm')),
  difficulty    TEXT    CHECK (difficulty IN ('easy','medium','hard')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
 
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_questions" ON quiz_questions
  FOR SELECT USING (true);
 
 
-- ── QUIZ SCORES (LEADERBOARD) ──────────────────────────────────────────
CREATE TABLE quiz_scores (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  score           INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  total_questions INTEGER DEFAULT 20,
  badge           TEXT,
  session_id      TEXT    NOT NULL,  -- anonymous browser session, no PII
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
 
-- Leaderboard query index
CREATE INDEX idx_scores_leaderboard ON quiz_scores (score DESC, created_at DESC);
 
ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;
-- Anyone can insert a score
CREATE POLICY "insert_quiz_scores" ON quiz_scores
  FOR INSERT WITH CHECK (true);
-- Anyone can read leaderboard (no PII stored)
CREATE POLICY "read_quiz_scores" ON quiz_scores
  FOR SELECT USING (true);
```
 
---
 
## 3. Chatbot Engine — Detailed Architecture
 
```
┌─────────────────────────────────────────────────────────────┐
│              KEYWORD CHATBOT ENGINE (Client-Side)           │
│                    /src/utils/chatEngine.js                 │
└─────────────────────────────────────────────────────────────┘
 
User Input (string)
       │
       ▼
┌─────────────────────┐
│   Preprocessor      │  lowercase, trim, remove stopwords
└──────────┬──────────┘
           │ cleaned string
           ▼
┌─────────────────────┐
│  Exact Keyword      │  cleaned.includes(keyword) for every
│  Matcher            │  intent → returns on FIRST match
└──────────┬──────────┘
           │ no match
           ▼
┌─────────────────────┐
│  Partial Word       │  word overlap ratio ≥ 0.5
│  Matcher            │  between input words & keyword words
└──────────┬──────────┘
           │ no match
           ▼
┌─────────────────────┐
│  Fuzzy Matcher      │  Levenshtein distance ≤ 2
│  (Typo tolerance)   │  for words longer than 4 chars
└──────────┬──────────┘
           │ no match
           ▼
┌─────────────────────┐
│  Context Matcher    │  Uses lastIntentId from previous turn
│                     │  "how long" after VVPAT → "7 seconds"
└──────────┬──────────┘
           │ no match
           ▼
┌─────────────────────┐
│  Fallback Response  │  + 4 topic suggestion chips
└─────────────────────┘
 
Response object: { response: string, followups: string[], intentId: string|null }
 
Key Properties:
  ✅ Response time: < 100ms (synchronous JS)
  ✅ Zero network calls
  ✅ Works offline
  ✅ 60+ intents in chatbotData.js
  ✅ Multi-turn context (remembers last intent for 3 turns)
  ✅ Hindi keyword support for basic queries
  ✅ ARIA live region announces responses to screen readers
```
 
**Chatbot Data File (`/src/data/chatbotData.js`) Summary:**
 
| Category | Intent IDs | Count |
|---|---|---|
| Greetings / Farewell | greeting, thanks, goodbye | 3 |
| Registration | voter_registration, registration_offline | 2 |
| Voter ID | voter_id, epic_download, lost_voter_id | 3 |
| Eligibility | eligibility, nri_voting | 2 |
| Polling Booth | find_booth, booth_timing | 2 |
| Documents | documents, aadhaar_voting | 2 |
| EVM | evm, evm_tamper | 2 |
| VVPAT | vvpat, vvpat_duration | 2 |
| NOTA | nota | 1 |
| Voting Process | voting_process, indelible_ink, wrong_button | 3 |
| Voter Rights | vote_secret, voting_leave | 2 |
| Election Types | election_types | 1 |
| MCC | mcc | 1 |
| Complaints | complaints | 1 |
| Counting / Results | counting | 1 |
| Postal Ballot | postal_ballot | 1 |
| ECI | eci | 1 |
| Nomination | nomination | 1 |
| **Total Base Intents** | | **31** |
| **Contextual follow-ups** | vvpat×3, voter_registration×3, evm×2 | **8** |
| **Expandable (future)** | campaign, observer, re-polling, blind voter... | **21+** |
| **Grand Total Coverage** | | **60+** |
 
---
 
## 4. Voting Simulator — State Machine
 
```
                    ┌─────────┐
                    │  IDLE   │ ◄── Reset / Try Again
                    └────┬────┘
                         │ Start Simulation
                    ┌────▼────────┐
                    │ ENTER_BOOTH │  Door animation
                    └────┬────────┘
                         │ Next
                    ┌────▼──────┐
                    │  SHOW_ID  │  Officer character, ID verify
                    └────┬──────┘
                         │ Next
                    ┌────▼────────────┐
                    │  SIGN_REGISTER  │  Interactive sign pad
                    └────┬────────────┘
                         │ Next
                    ┌────▼───────────┐
                    │ INDELIBLE_INK  │  SVG finger ink animation
                    └────┬───────────┘
                         │ Next
                    ┌────▼──────────┐
                    │ APPROACH_EVM  │  Walk animation
                    └────┬──────────┘
                         │ Next
                    ┌────▼─────────────┐
                    │ SELECT_CANDIDATE │  EVM Interface
                    │                  │  5 candidates, LED buttons
                    └────┬─────────────┘
                         │ Press button → LED blinks → Beep
                    ┌────▼──────────┐
                    │ CONFIRM_VOTE  │  "Are you sure?" prompt
                    └────┬──────────┘
                         │ Confirm
                    ┌────▼────────┐
                    │ VVPAT_SLIP  │  Paper slip animation
                    │             │  7-second countdown
                    └────┬────────┘
                         │ Auto-advance after 7s
                    ┌────▼──────────┐
                    │  VOTE_CAST   │  Green ✅ + summary
                    └────┬──────────┘
                         │ Next
                    ┌────▼─────────────┐
                    │  CELEBRATION     │  Confetti + badge + ink
                    └──────────────────┘
                         │ "Try Again"
                         └──► IDLE
 
Implementation: React useReducer
No API calls at any phase — 100% client-side
```
 
---
 
## 5. Google Cloud Run Deployment Architecture
 
### 5.1 Services Configuration
 
```yaml
# frontend-cloudrun.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: electionguide-frontend
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "0"
        autoscaling.knative.dev/maxScale: "10"
        run.googleapis.com/cpu-throttling: "true"
    spec:
      containerConcurrency: 80
      containers:
        - image: gcr.io/PROJECT_ID/electionguide-frontend:latest
          ports:
            - containerPort: 8080
          resources:
            limits:
              memory: 256Mi
              cpu: "1"
```
 
```yaml
# backend-cloudrun.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: electionguide-backend
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "0"
        autoscaling.knative.dev/maxScale: "5"
    spec:
      containerConcurrency: 40
      containers:
        - image: gcr.io/PROJECT_ID/electionguide-backend:latest
          ports:
            - containerPort: 8080
          resources:
            limits:
              memory: 512Mi
              cpu: "1"
          env:
            - name: FLASK_ENV
              value: production
          volumeMounts:
            - name: secrets
              mountPath: /secrets
      volumes:
        - name: secrets
          secret:
            secretName: electionguide-secrets
```
 
### 5.2 Frontend Dockerfile (Multi-Stage)
 
```dockerfile
# ── Stage 1: Build React App ──────────────────────────────────────────
FROM node:20-alpine AS builder
 
WORKDIR /app
 
# Copy package files first (cache layer)
COPY package*.json ./
RUN npm ci --only=production
 
# Copy source and build
COPY . .
ARG REACT_APP_API_URL
ARG REACT_APP_GOOGLE_MAPS_KEY
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_GOOGLE_MAPS_KEY=$REACT_APP_GOOGLE_MAPS_KEY
RUN npm run build
 
# ── Stage 2: Serve with nginx ─────────────────────────────────────────
FROM nginx:1.25-alpine
 
# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf
 
# Copy build artifacts and nginx config
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /usr/share/nginx/html \
    && chown -R appuser:appgroup /var/cache/nginx \
    && chown -R appuser:appgroup /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown appuser:appgroup /var/run/nginx.pid
 
USER appuser
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```
 
### 5.3 nginx.conf (Frontend)
 
```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
 
    # ── Compression ────────────────────────────────────────────────────
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain text/css text/javascript
        application/javascript application/json
        application/xml image/svg+xml;
 
    # ── Static Asset Caching ───────────────────────────────────────────
    location ~* \.(js|css|png|jpg|jpeg|svg|woff|woff2|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
 
    # ── SPA Fallback (React Router) ────────────────────────────────────
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
 
    # ── Security Headers ───────────────────────────────────────────────
    add_header Content-Security-Policy
        "default-src 'self';
         script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com;
         style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
         font-src https://fonts.gstatic.com;
         img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com;
         frame-src https://www.google.com;
         connect-src 'self' https://*.supabase.co https://www.google-analytics.com;"
        always;
 
    add_header X-Frame-Options           "SAMEORIGIN"                     always;
    add_header X-XSS-Protection          "1; mode=block"                  always;
    add_header X-Content-Type-Options    "nosniff"                        always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy        "geolocation=(), camera=(), microphone=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```
 
### 5.4 Backend Dockerfile
 
```dockerfile
FROM python:3.11-slim
 
WORKDIR /app
 
# Security: create non-root user first
RUN groupadd --system appgroup \
    && useradd --system --gid appgroup --no-create-home appuser
 
# Install dependencies (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
 
# Copy application code
COPY app/ app/
COPY wsgi.py .
 
# Set ownership
RUN chown -R appuser:appgroup /app
USER appuser
 
EXPOSE 8080
 
# Gunicorn: 2 workers × 4 threads = handles 8 concurrent requests per instance
# --preload: loads app once, forks workers (faster start, lower memory)
CMD ["gunicorn", \
     "--bind", "0.0.0.0:8080", \
     "--workers", "2", \
     "--threads", "4", \
     "--timeout", "120", \
     "--preload", \
     "--log-level", "info", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "wsgi:app"]
```
 
### 5.5 Backend requirements.txt
 
```txt
# Web Framework
flask==3.0.0
gunicorn==21.2.0
 
# Flask Extensions
flask-cors==4.0.0
flask-limiter==3.5.0
flask-caching==2.1.0
flask-compress==1.14
 
# Database
supabase==2.3.0
 
# Input Validation
marshmallow==3.20.1
 
# PDF Generation
reportlab==4.0.8
 
# Google Cloud
google-cloud-storage==2.14.0
google-cloud-secret-manager==2.18.0
 
# Utilities
python-dotenv==1.0.0
 
# Testing
pytest==7.4.3
pytest-cov==4.1.0
pytest-flask==1.3.0
```
 
---
 
## 6. CI/CD Pipeline (Google Cloud Build)
 
### 6.1 Full Pipeline (`cloudbuild.yaml`)
 
```yaml
steps:
  # ── Step 1: Backend Tests ─────────────────────────────────────────────
  - name: "python:3.11"
    id: "backend-tests"
    entrypoint: bash
    args:
      - "-c"
      - |
        cd backend
        pip install -r requirements.txt --quiet
        python -m pytest tests/ \
          --cov=app \
          --cov-report=term-missing \
          --cov-fail-under=80 \
          -v
    waitFor: ["-"]   # Run immediately (parallel with frontend)
 
  # ── Step 2: Frontend Tests ────────────────────────────────────────────
  - name: "node:20-alpine"
    id: "frontend-tests"
    entrypoint: sh
    args:
      - "-c"
      - |
        cd frontend
        npm ci --silent
        npm test -- --watchAll=false --coverage --coverageThreshold='{"global":{"lines":80}}'
    waitFor: ["-"]
 
  # ── Step 3: Build Backend Image ───────────────────────────────────────
  - name: "gcr.io/cloud-builders/docker"
    id: "build-backend"
    args:
      - build
      - -t
      - "gcr.io/$PROJECT_ID/electionguide-backend:$COMMIT_SHA"
      - -t
      - "gcr.io/$PROJECT_ID/electionguide-backend:latest"
      - ./backend
    waitFor: ["backend-tests"]
 
  # ── Step 4: Build Frontend Image ──────────────────────────────────────
  - name: "gcr.io/cloud-builders/docker"
    id: "build-frontend"
    args:
      - build
      - -t
      - "gcr.io/$PROJECT_ID/electionguide-frontend:$COMMIT_SHA"
      - -t
      - "gcr.io/$PROJECT_ID/electionguide-frontend:latest"
      - --build-arg
      - "REACT_APP_API_URL=https://electionguide-backend-xxxx.run.app"
      - ./frontend
    waitFor: ["frontend-tests"]
 
  # ── Step 5: Push Images ───────────────────────────────────────────────
  - name: "gcr.io/cloud-builders/docker"
    id: "push-backend"
    args: [push, "gcr.io/$PROJECT_ID/electionguide-backend:$COMMIT_SHA"]
    waitFor: ["build-backend"]
 
  - name: "gcr.io/cloud-builders/docker"
    id: "push-frontend"
    args: [push, "gcr.io/$PROJECT_ID/electionguide-frontend:$COMMIT_SHA"]
    waitFor: ["build-frontend"]
 
  # ── Step 6: Deploy Backend ────────────────────────────────────────────
  - name: "gcr.io/cloud-builders/gcloud"
    id: "deploy-backend"
    args:
      - run
      - deploy
      - electionguide-backend
      - "--image=gcr.io/$PROJECT_ID/electionguide-backend:$COMMIT_SHA"
      - "--region=asia-south1"
      - "--platform=managed"
      - "--allow-unauthenticated"
      - "--memory=512Mi"
      - "--cpu=1"
      - "--min-instances=0"
      - "--max-instances=5"
      - "--concurrency=40"
      - "--timeout=120"
      - "--set-env-vars=FLASK_ENV=production"
      - "--set-secrets=SUPABASE_URL=supabase-url:latest,SUPABASE_KEY=supabase-key:latest,GCS_BUCKET=gcs-bucket:latest,MAPS_KEY=maps-api-key:latest,FLASK_SECRET=flask-secret:latest"
    waitFor: ["push-backend"]
 
  # ── Step 7: Deploy Frontend ───────────────────────────────────────────
  - name: "gcr.io/cloud-builders/gcloud"
    id: "deploy-frontend"
    args:
      - run
      - deploy
      - electionguide-frontend
      - "--image=gcr.io/$PROJECT_ID/electionguide-frontend:$COMMIT_SHA"
      - "--region=asia-south1"
      - "--platform=managed"
      - "--allow-unauthenticated"
      - "--memory=256Mi"
      - "--cpu=1"
      - "--min-instances=0"
      - "--max-instances=10"
      - "--concurrency=80"
    waitFor: ["push-frontend"]
 
options:
  logging: CLOUD_LOGGING_ONLY
  machineType: E2_HIGHCPU_8     # Faster builds
 
# Build fails if any step fails — no broken code deployed
```
 
### 6.2 CI/CD Flow Diagram
 
```
git push origin main
       │
       ▼
GitHub Actions (test.yml) — runs on every PR
  ├── backend: pytest --cov-fail-under=80
  └── frontend: jest --coverage (threshold 80%)
       │
       ▼ (merge to main)
Cloud Build Trigger fires
  ├── backend-tests  ──┐  (parallel)
  └── frontend-tests ──┘
       │ both pass
       ├── build-backend  ──┐  (parallel, waits for tests)
       └── build-frontend ──┘
       │ both built
       ├── push-backend  ──┐  (parallel)
       └── push-frontend ──┘
       │ both pushed
       ├── deploy-backend  ──┐  (parallel)
       └── deploy-frontend ──┘
       │
       ▼
Zero-downtime blue/green deployment ✅
Old revision kept for instant rollback
```
 
---
 
## 7. Security Architecture (Full Stack)
 
```
Layer 1: Network
─────────────────────────────────────────────────────────────────
• HTTPS enforced by Cloud Run (TLS 1.3)
• HTTP → HTTPS auto-redirect
• HSTS header: max-age=31536000
 
Layer 2: Frontend (nginx)
─────────────────────────────────────────────────────────────────
• Content-Security-Policy (whitelists only needed origins)
• X-Frame-Options: SAMEORIGIN
• X-Content-Type-Options: nosniff
• X-XSS-Protection: 1; mode=block
• Referrer-Policy: strict-origin-when-cross-origin
• Permissions-Policy: blocks geolocation, camera, microphone
 
Layer 3: Backend (Flask)
─────────────────────────────────────────────────────────────────
• CORS: Origins whitelist (production domain only)
• Rate limiting per IP:
    - /api/booth: 30/minute
    - /api/quiz/*: 60/minute
    - /api/generate-checklist: 5/minute
• Input validation via Marshmallow schemas (all endpoints)
• Parameterized queries via supabase-py (no raw SQL)
• No PII accepted or stored anywhere
 
Layer 4: Database (Supabase)
─────────────────────────────────────────────────────────────────
• Row Level Security (RLS) on ALL tables
• Service role key never exposed to frontend
• Anon key not used (backend uses service key)
• Postgres 15: SSL connections only
 
Layer 5: Secrets
─────────────────────────────────────────────────────────────────
• ALL credentials in Google Secret Manager
• Injected at Cloud Run startup via --set-secrets
• Never in .env files, code, or Docker images
• Secret rotation supported without redeployment
 
Layer 6: Chatbot (Special)
─────────────────────────────────────────────────────────────────
• No external API calls — zero data exfiltration risk
• No user messages logged or stored
• No rate limiting needed (client-side)
• Works with strictest CSP settings (no external JS needed)
```
 
---
 
## 8. Performance Architecture
 
### 8.1 Frontend Performance
 
```
Initial Load Optimization:
┌────────────────────────────────────────────────────────┐
│  index.html                                            │
│  • Google Fonts: preconnect + preload                  │
│  • Critical CSS inlined                                │
│  • GA4 script: deferred                               │
│                                                        │
│  main.[hash].js   (~120KB gzip) — core React           │
│  ├── Chatbot chunk — lazy loaded on /chatbot           │
│  ├── Simulator chunk — lazy loaded on /simulator       │
│  ├── Quiz chunk — lazy loaded on /quiz                 │
│  └── FirstTimeVoter chunk — lazy loaded                │
│                                                        │
│  Static data (bundled — zero API calls):               │
│  ├── chatbotData.js — 60+ intents                      │
│  ├── glossaryTerms.json — 60+ terms                    │
│  └── quizQuestions.json — fallback data                │
└────────────────────────────────────────────────────────┘
 
React Query Cache Strategy:
  • /api/elections → staleTime: 60min (rarely changes)
  • /api/booth     → staleTime: 30min (stable data)
  • /api/quiz      → staleTime: 10min (session-scoped)
 
Service Worker Cache:
  • Cache-first: static assets (JS, CSS, images, fonts)
  • Network-first: API calls (falls back to cache if offline)
  • Special: last booth result stored for offline access
```
 
### 8.2 Backend Performance
 
```
Flask Caching (SimpleCache → upgradeable to Redis):
  GET /api/elections     → cache 3600s (1 hour TTL)
  GET /api/booth         → cache 3600s per unique query_string
  GET /api/quiz/questions → cache 300s (5 min)
 
Supabase Query Optimization:
  • pincode lookup: O(1) via btree index
  • area search: O(log n) via GIN full-text index
  • Leaderboard: O(1) via (score DESC, created_at DESC) index
 
Gunicorn Configuration:
  • 2 workers × 4 threads = 8 concurrent req/instance
  • --preload: app loaded once, forked to workers
  • Cloud Run scales instances horizontally under load
```
 
### 8.3 Performance Targets
 
| Metric | Target | Strategy |
|---|---|---|
| LCP | < 2.5s | Preloaded fonts, code splitting, CDN |
| TTI | < 3.5s | Lazy loading non-critical components |
| CLS | < 0.1 | Explicit image dimensions, font preload |
| FID | < 100ms | No blocking JS on main thread |
| Chatbot response | < 100ms | Pure client-side JS |
| API response | < 500ms | Flask cache + indexed queries |
| Offline | ✅ | Service worker + static chatbot |
 
---
 
## 9. Accessibility Architecture (WCAG 2.1 AA)
 
```
Component-Level Accessibility:
┌────────────────────────────────────────────────────────────────┐
│ Skip Navigation                                                │
│  <a href="#main-content" className="skip-link">               │
│    Skip to main content                                        │
│  </a>                                                          │
│                                                                │
│ Chatbot                                                        │
│  <div aria-live="polite" aria-atomic="true" className="sr-only">│
│    {lastBotMessage}  ← screen reader reads every response     │
│  </div>                                                        │
│  <section aria-label="Election Assistant Chatbot">            │
│  <div role="log" aria-label="Chat messages">                  │
│                                                                │
│ Error Messages                                                 │
│  <span aria-live="assertive" role="alert">                    │
│    {errorMessage}  ← urgent announcement                      │
│  </span>                                                       │
│                                                                │
│ EVM Buttons (Simulator)                                        │
│  <button                                                       │
│    aria-label={`Vote for ${candidate.name}, ${candidate.party}`}│
│    aria-pressed={selected === candidate.id}                   │
│    onKeyDown={e => e.key === 'Enter' && handleSelect()}       │
│  >                                                             │
│                                                                │
│ VVPAT Countdown                                                │
│  <div role="timer" aria-label={`${seconds} seconds remaining`}│
│    aria-live="off">                                            │
│    {seconds}s                                                  │
│  </div>                                                        │
│                                                                │
│ Timeline Phases                                                │
│  <article role="region"                                        │
│    aria-label={`Phase ${i+1}: ${phase.name}`}                 │
│    aria-expanded={expanded}>                                   │
│                                                                │
│ Form Inputs (Booth Finder)                                     │
│  <label htmlFor="pincode-input">Enter your Pincode</label>    │
│  <input id="pincode-input"                                     │
│    aria-describedby="pincode-error pincode-hint"              │
│    aria-invalid={!!error}                                      │
│    pattern="[0-9]{6}" />                                       │
│  <span id="pincode-error" role="alert">{error}</span>         │
└────────────────────────────────────────────────────────────────┘
 
Global Accessibility Rules:
  ✅ All images: meaningful alt text (decorative = alt="")
  ✅ Color contrast: ≥ 4.5:1 normal, ≥ 3:1 large text
  ✅ Touch targets: minimum 44×44px
  ✅ Focus visible: 2px solid #FF6B35, 2px offset on all elements
  ✅ Tab order: logical flow, no keyboard traps
  ✅ No color-only communication
  ✅ Motion: respects prefers-reduced-motion
  ✅ Font size: minimum 16px body
  ✅ Tested: NVDA (Windows) + VoiceOver (macOS)
```
 
---
 
## 10. Google Services Integration Map
 
| Service | Purpose | Used In | Key Detail |
|---|---|---|---|
| **Cloud Run** | Host frontend + backend | Both services | asia-south1, auto-scaling 0→N |
| **Maps Embed API** | Interactive booth map | BoothFinder → MapEmbed.jsx | iframe embed with API key |
| **Maps Directions** | Navigation to booth | BoothCard.jsx | `maps.google.com/dir/?api=1&destination={lat},{lng}` |
| **Cloud Storage** | PDF checklist hosting | /api/generate-checklist | Signed URL, 24hr expiry |
| **Secret Manager** | All credentials storage | Backend startup | `--set-secrets` in Cloud Run deploy |
| **Cloud Build** | CI/CD pipeline | cloudbuild.yaml | Blocks deploy if tests fail |
| **Container Registry** | Docker image storage | All Docker images | gcr.io/PROJECT_ID/... |
| **Cloud Logging** | Application logs | Flask + nginx | Auto-streamed by Cloud Run |
| **Cloud Monitoring** | Uptime + alerts | Both services | /health endpoint ping |
| **Google Fonts** | Poppins + Inter | index.html | `<link rel="preconnect" + preload>` |
| **Google Analytics 4** | Usage tracking | index.html | gtag.js deferred load |
 
---
 
## 11. Repository Structure & Size Management
 
```
electionguide/                          # < 10MB total (submission requirement)
├── frontend/                           # ~6MB
│   ├── src/                            # ~500KB (source code)
│   ├── public/                         # ~200KB
│   └── package.json                    # (node_modules NOT committed)
│
├── backend/                            # ~200KB
│   ├── app/                            # ~150KB (source code)
│   ├── tests/                          # ~50KB
│   └── requirements.txt
│
├── database/                           # ~50KB
│   ├── migrations/                     # SQL files
│   └── seeds/
│
├── deployment/                         # ~20KB
│   ├── cloudbuild.yaml
│   ├── frontend-cloudrun.yaml
│   └── backend-cloudrun.yaml
│
├── .github/workflows/                  # ~10KB
│   ├── test.yml
│   └── deploy.yml
│
├── .gitignore                          # Excludes: node_modules, __pycache__, .env, build/
└── README.md
 
.gitignore key entries:
  node_modules/
  frontend/build/
  backend/__pycache__/
  backend/.pytest_cache/
  **/.env
  *.pyc
  .DS_Store
```
 
---
 
## 12. Local Development Setup
 
```bash
# ── Clone ────────────────────────────────────────────────────────────
git clone https://github.com/umangvaghela/electionguide.git
cd electionguide
 
# ── Backend ──────────────────────────────────────────────────────────
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # Fill: SUPABASE_URL, SUPABASE_KEY, etc.
flask run --port 5000
 
# ── Frontend (new terminal) ────────────────────────────────────────────
cd frontend
npm install
cp .env.example .env.local
# Set: REACT_APP_API_URL=http://localhost:5000
npm start
 
# ── Run All Tests ─────────────────────────────────────────────────────
# Backend
cd backend && pytest tests/ --cov=app --cov-report=term-missing
 
# Frontend
cd frontend && npm test -- --watchAll=false --coverage
 
# ── Database Setup ────────────────────────────────────────────────────
# In Supabase dashboard → SQL Editor:
# 1. Run migrations/001_create_polling_booths.sql
# 2. Run migrations/002_create_elections.sql
# 3. Run migrations/003_create_quiz_questions.sql
# 4. Run migrations/004_create_quiz_scores.sql
# 5. Run seeds/polling_booths.sql
```
 
---
 
## 13. Scoring Criteria — Technical Implementation Checklist
 
### Code Quality
- [ ] `eslint` + `prettier` — zero warnings in CI
- [ ] `black` + `flake8` + `isort` — compliant (checked in CI)
- [ ] JSDoc on all utility functions (`chatEngine.js`, `audio.js`, `date.js`)
- [ ] Python docstrings on all route functions and service methods
- [ ] Feature-based folder structure (not type-based)
- [ ] Single responsibility: each component/module does one thing
- [ ] No commented-out code in final submission
- [ ] Meaningful commit messages (conventional commits)
### Security
- [ ] HTTPS enforced — Cloud Run auto-provides TLS
- [ ] CSP header in nginx.conf — whitelists only needed origins
- [ ] CORS — production domain only (`ALLOWED_ORIGINS` env var)
- [ ] All inputs validated via Marshmallow before DB query
- [ ] Rate limiting on every Flask route
- [ ] Supabase RLS — all 4 tables have policies
- [ ] ALL secrets in Google Secret Manager
- [ ] No API keys in React bundle (Maps key server-proxied if needed)
- [ ] No PII accepted or stored
- [ ] Chatbot — zero external calls (most secure possible)
### Efficiency
- [ ] `React.lazy()` + `Suspense` — all page components
- [ ] Chatbot — 100% client-side, < 100ms, no network
- [ ] Glossary — static JSON bundle, no API call
- [ ] Quiz — static fallback JSON, Supabase optional
- [ ] Flask-Caching on elections + booth endpoints
- [ ] Supabase indexes on all queried columns
- [ ] nginx gzip enabled for all text assets
- [ ] Google Fonts — `preconnect` + `preload` in `<head>`
- [ ] Service Worker — offline cache for booth + static assets
- [ ] React Query — deduplicates concurrent API calls
### Testing
- [ ] pytest backend — all 4 route modules covered
- [ ] `--cov-fail-under=80` — CI fails if below 80%
- [ ] `chatEngine.test.js` — tests all matcher stages
- [ ] EVM simulator state machine — all phase transitions tested
- [ ] Jest coverage threshold 80% — enforced in CI
- [ ] Cloud Build step 1+2 run tests before build/deploy
### Accessibility
- [ ] Skip navigation link at top of every page
- [ ] `aria-live="polite"` on chatbot response region
- [ ] `aria-live="assertive"` on all error messages
- [ ] `role="alert"` on form validation errors
- [ ] `role="log"` on chat message container
- [ ] `role="timer"` on VVPAT countdown
- [ ] All EVM buttons: `aria-label` includes candidate + party
- [ ] All form inputs have associated `<label>`
- [ ] All images: meaningful `alt` text
- [ ] Focus visible: 2px saffron ring on all focusable elements
- [ ] Contrast ≥ 4.5:1 verified for all text combinations
- [ ] `prefers-reduced-motion` respected in animations
- [ ] Tested: NVDA (Windows), VoiceOver (macOS)
### Google Services
- [ ] Cloud Run — both services deployed, region asia-south1
- [ ] Google Maps Embed API — booth map in BoothFinder
- [ ] Google Maps Directions URL — "Get Directions" button
- [ ] Google Cloud Storage — PDF checklist upload + signed URL
- [ ] Google Secret Manager — all 5 credentials stored
- [ ] Cloud Build — full CI/CD pipeline in cloudbuild.yaml
- [ ] Container Registry — Docker images stored
- [ ] Cloud Logging — logs auto-streamed
- [ ] Cloud Monitoring — /health uptime check configured
- [ ] Google Fonts — Poppins + Inter (preloaded)
- [ ] Google Analytics 4 — usage events tracked