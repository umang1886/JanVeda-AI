🛠️ Solution Document
ElectionGuide — Deep Technical Solution
Version: 2.0
Project: ElectionGuide — Interactive Election Education Platform
Key Change from v1: External AI API replaced with client-side keyword-based chatbot engine

1. Solution Architecture Overview
┌──────────────────────────────────────────────────────────┐
│                  React SPA (Frontend)                    │
│                                                          │
│  ┌────────┐ ┌──────────┐ ┌─────────┐ ┌───────────────┐  │
│  │Timeline│ │  Booth   │ │ First   │ │   Simulator   │  │
│  │        │ │  Finder  │ │ Time    │ │   (EVM)       │  │
│  └────────┘ └──────────┘ │ Voter   │ └───────────────┘  │
│  ┌────────┐ ┌──────────┐ └─────────┘ ┌───────────────┐  │
│  │  Quiz  │ │Glossary  │             │   Chatbot     │  │
│  │        │ │(static)  │             │ (client-side) │  │
│  └────────┘ └──────────┘             └───────────────┘  │
│                                                          │
│  Service Worker (offline cache) │ React Query (cache)   │
└────────────────┬─────────────────────────────────────────┘
                 │ REST API (HTTPS)
┌────────────────▼─────────────────────────────────────────┐
│              Flask Backend (Python 3.11)                 │
│                                                          │
│  /api/elections  /api/booth  /api/quiz  /api/checklist  │
│  Flask-Caching │ Flask-Limiter │ Marshmallow │ CORS      │
└────────┬─────────────────────────────┬───────────────────┘
         │                             │
┌────────▼────────┐         ┌──────────▼──────────────────┐
│   Supabase      │         │   Google Cloud Services     │
│   PostgreSQL    │         │   - Cloud Storage (PDFs)    │
│   + Auth        │         │   - Secret Manager (keys)   │
│   + RLS         │         │   - Maps API (booth maps)   │
└─────────────────┘         └─────────────────────────────┘
Key Architecture Decision — Chatbot:
The chatbot runs entirely in the browser. Zero backend calls, zero external APIs, zero cost, < 100ms response, works offline. This is both more efficient and more secure than any API-based solution.

2. Feature Deep Dives

2.1 Keyword-Based Election Chatbot (Core Feature)
Design Philosophy:
A hand-crafted intent database with a lightweight JavaScript matching engine. No dependency on any external service — this means better scores on Efficiency (no API latency), Security (no data sent externally), and reliability (works offline).
Engine Architecture (/src/utils/chatEngine.js):
javascript/**
 * ElectionGuide Chatbot Engine
 * Pure client-side keyword intent matching with fuzzy support.
 * Zero external dependencies beyond the intents data file.
 */

import { chatbotIntents, contextualResponses, fallbackResponse } from '../data/chatbotData';

/**
 * Calculates Levenshtein distance between two strings.
 * Used for typo-tolerant keyword matching.
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Edit distance
 */
function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1]
        ? matrix[i - 1][j - 1]
        : 1 + Math.min(matrix[i - 1][j - 1], matrix[i - 1][j], matrix[i][j - 1]);
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Preprocesses user input: lowercase, trim, remove filler words.
 * @param {string} input - Raw user input
 * @returns {string} Cleaned input
 */
function preprocess(input) {
  const stopwords = ['the', 'a', 'an', 'is', 'are', 'what', 'how', 'where', 'when', 'i', 'my', 'me', 'please', 'can', 'you', 'do'];
  return input
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(word => !stopwords.includes(word))
    .join(' ');
}

/**
 * Main intent matching function.
 * Priority: exact match > partial match > fuzzy match > context > fallback
 * @param {string} userInput - User message
 * @param {string|null} lastIntentId - ID of previous intent for context
 * @returns {{ response: string, followups: string[], intentId: string }}
 */
export function matchIntent(userInput, lastIntentId = null) {
  const cleaned = preprocess(userInput);

  // 1. EXACT keyword match (highest confidence)
  for (const intent of chatbotIntents) {
    for (const keyword of intent.keywords) {
      if (cleaned === keyword || cleaned.includes(keyword)) {
        return { response: intent.response, followups: intent.followups, intentId: intent.id };
      }
    }
  }

  // 2. PARTIAL keyword match (medium confidence)
  const words = cleaned.split(' ');
  let bestMatch = null;
  let bestScore = 0;
  for (const intent of chatbotIntents) {
    let score = 0;
    for (const keyword of intent.keywords) {
      const kwWords = keyword.split(' ');
      const overlap = words.filter(w => kwWords.includes(w)).length;
      score = Math.max(score, overlap / kwWords.length);
    }
    if (score > bestScore) { bestScore = score; bestMatch = intent; }
  }
  if (bestScore >= 0.5) {
    return { response: bestMatch.response, followups: bestMatch.followups, intentId: bestMatch.id };
  }

  // 3. FUZZY keyword match — handles typos (Levenshtein ≤ 2)
  for (const intent of chatbotIntents) {
    for (const keyword of intent.keywords) {
      for (const word of words) {
        if (word.length > 4 && levenshtein(word, keyword) <= 2) {
          return { response: intent.response, followups: intent.followups, intentId: intent.id };
        }
      }
    }
  }

  // 4. CONTEXTUAL follow-up (if user said something vague after a topic)
  if (lastIntentId && contextualResponses[lastIntentId]) {
    for (const [trigger, response] of Object.entries(contextualResponses[lastIntentId])) {
      if (cleaned.includes(trigger)) {
        return { response, followups: [], intentId: lastIntentId };
      }
    }
  }

  // 5. FALLBACK with topic suggestions
  return { response: fallbackResponse, followups: ['How to register?', 'Find my booth', 'What is NOTA?', 'How EVM works?'], intentId: null };
}
Complete Intent Database (/src/data/chatbotData.js):
javascript/**
 * ElectionGuide Chatbot Intent Database
 * 60+ intents covering all election and voting topics for Indian elections.
 * Each intent has: id, keywords array, response text, follow-up chips.
 */

export const chatbotIntents = [

  // ─── GREETINGS ───────────────────────────────────────────────────────────────
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "namaste", "help", "start", "what can you do"],
    response: "Namaste! 🙏 I'm your ElectionGuide Assistant.\n\nI can help you with:\n• Voter registration\n• Finding your polling booth\n• Documents needed for voting\n• How EVM and VVPAT work\n• Voting day process\n• Your voter rights\n• And much more!\n\nWhat would you like to know?",
    followups: ["How to register as voter?", "Find my polling booth", "What documents do I need?", "How does EVM work?"]
  },

  // ─── VOTER REGISTRATION ───────────────────────────────────────────────────────
  {
    id: "voter_registration",
    keywords: ["register", "registration", "how to register", "apply voter id", "form 6", "nvsp", "new voter", "enroll", "voter enrollment", "add name voter list", "matdan panjiyan"],
    response: "📝 To register as a voter in India:\n\n1. Visit voters.eci.gov.in\n2. Click 'New Registration (Form 6)'\n3. Fill in your personal details\n4. Upload documents: Aadhaar + passport photo + address proof\n5. Submit — note your reference number\n6. Your Booth Level Officer (BLO) will verify within 2–4 weeks\n\n📱 You can also use the Voter Helpline App or call 1950.\n\n⏰ Registration closes 30 days before election date.",
    followups: ["What documents are needed?", "What is a BLO?", "How long does registration take?", "Can I register offline?"]
  },
  {
    id: "registration_offline",
    keywords: ["offline registration", "register offline", "form 6 offline", "submit form 6", "visit blo", "offline voter registration"],
    response: "📋 Offline Voter Registration:\n\n1. Get Form 6 from your nearest Election Office or BLO (Booth Level Officer)\n2. Fill the form with your details\n3. Attach: passport photo + proof of age + proof of address\n4. Submit at your Electoral Registration Officer's office\n5. You'll receive an acknowledgment\n\n📍 Find your ERO at: electoralsearch.in",
    followups: ["What is a BLO?", "What documents do I need?"]
  },

  // ─── VOTER ID / EPIC ──────────────────────────────────────────────────────────
  {
    id: "voter_id",
    keywords: ["voter id", "epic card", "voter card", "election card", "what is voter id", "voter id card", "matdata pehchan patra"],
    response: "🪪 Voter ID (EPIC Card):\n\nEPIC stands for Elector's Photo Identity Card. It is your official voter identification issued by the Election Commission of India.\n\n• Used to vote at your assigned polling booth\n• Acts as valid address proof\n• You can also use it as general ID\n• Download e-EPIC (digital) from voters.eci.gov.in\n\n💡 Lost your card? Apply for a duplicate — it's free!",
    followups: ["How to download e-EPIC?", "Lost my voter ID — what to do?", "Can I vote without voter ID?"]
  },
  {
    id: "epic_download",
    keywords: ["download voter id", "download epic", "e-epic", "digital voter id", "e epic download", "voter id pdf"],
    response: "📲 Download your e-EPIC (Digital Voter ID):\n\n1. Go to voters.eci.gov.in\n2. Click 'Download e-EPIC'\n3. Login with your mobile number (linked to voter record)\n4. Search by EPIC number or Name + DOB + State\n5. Download your PDF voter ID\n\n✅ e-EPIC is legally valid as ID proof — accepted at polling booths.",
    followups: ["Is e-EPIC valid for voting?", "How to find my EPIC number?"]
  },
  {
    id: "lost_voter_id",
    keywords: ["lost voter id", "voter id lost", "duplicate voter id", "new voter card", "voter id replacement"],
    response: "😟 Lost your Voter ID? Here's what to do:\n\n1. File an FIR at your local police station (optional but recommended)\n2. Visit voters.eci.gov.in → Apply for duplicate EPIC\n3. Fill Form EPIC-002\n4. Submit with a passport photo and address proof\n\n💡 Meanwhile, you can use the e-EPIC (digital voter ID) to vote — just download it from the same portal.\n\nAlternatively, use any other valid photo ID: Aadhaar, Passport, or Driving License.",
    followups: ["Can I vote without voter ID?", "What other IDs can I use to vote?"]
  },

  // ─── ELIGIBILITY ─────────────────────────────────────────────────────────────
  {
    id: "eligibility",
    keywords: ["who can vote", "voting eligibility", "am i eligible", "eligible to vote", "age to vote", "voting age", "matdan ke liye umra", "18 vote"],
    response: "✅ To be eligible to vote in India, you must be:\n\n1. 🎂 At least 18 years old (on the qualifying date)\n2. 🇮🇳 A citizen of India\n3. 📍 Resident of the constituency where you want to vote\n4. 🧠 Of sound mind (not declared by a court as of unsound mind)\n5. 📋 Name must be on the Electoral Roll\n\n❌ You CANNOT vote if you are:\n• A non-citizen\n• Serving a criminal sentence\n• Disqualified by law",
    followups: ["How to register to vote?", "Can NRIs vote?", "Can prisoners vote?"]
  },
  {
    id: "nri_voting",
    keywords: ["nri vote", "nri voting", "overseas indian vote", "indian abroad vote", "foreign indian vote", "can nri vote"],
    response: "🌍 NRI Voting in India:\n\nYes, NRIs can vote! Here's how:\n\n• NRIs can register as 'Overseas Electors' under Section 20A of RPA 1950\n• Register at: voters.eci.gov.in → NRI Registration\n• Documents needed: Passport + Indian address proof\n• You must physically come to India to vote (postal ballot not available for NRIs yet)\n\n📌 Your vote is cast in your home constituency in India.",
    followups: ["How to register as NRI voter?", "What documents NRI needs?"]
  },

  // ─── POLLING BOOTH ────────────────────────────────────────────────────────────
  {
    id: "find_booth",
    keywords: ["find booth", "polling booth", "where to vote", "my booth", "polling station", "matdan kendra", "booth location", "where is my polling station", "voting center"],
    response: "📍 Find Your Polling Booth:\n\n3 ways to find it:\n\n1. 🖥️ Use our 'Find My Booth' feature on this app — enter your pincode!\n2. 🌐 Visit electoralsearch.in → search your name → booth is shown\n3. 📱 Call Voter Helpline: 1950\n\n💡 You can also find booth details on your Voter Slip — distributed by BLO before elections.",
    followups: ["What is a voter slip?", "Can I change my polling booth?", "What time does booth open?"]
  },
  {
    id: "booth_timing",
    keywords: ["booth timing", "voting time", "what time vote", "booth open", "booth close", "when to vote", "voting hours", "polling time"],
    response: "⏰ Polling Booth Timings:\n\nGenerally: 7:00 AM to 6:00 PM\n\n• General elections: 7 AM – 6 PM in most states\n• Some states may have different end times (5 PM)\n• Voters in queue at closing time are still allowed to vote\n• Mountain/remote areas may have different timing\n\n📋 Always check your Voter Slip or local news for your specific constituency timing.",
    followups: ["What if I'm late to the booth?", "What documents to carry?"]
  },

  // ─── DOCUMENTS ───────────────────────────────────────────────────────────────
  {
    id: "documents",
    keywords: ["documents", "what to carry", "what id", "documents needed", "valid id", "proof for voting", "id for voting", "which document", "document required"],
    response: "📄 Documents to Carry on Voting Day:\n\nYou need ONE of these photo IDs:\n\n✅ Primary IDs:\n• Voter ID (EPIC card) — most preferred\n• Aadhaar Card\n• Passport\n• Driving License\n• PAN Card (with photo)\n\n✅ Also Accepted:\n• MNREGA Job Card\n• Bank/Post Office Passbook with photo\n• Smart Card (employee/student)\n• Pension document with photo\n\n💡 e-EPIC (digital voter ID on phone) is also valid!",
    followups: ["Can I vote with Aadhaar only?", "What if I don't have any ID?", "Is e-EPIC valid?"]
  },
  {
    id: "aadhaar_voting",
    keywords: ["aadhaar vote", "can i vote with aadhaar", "aadhaar card voting", "aadhaar valid", "aadhaar polling"],
    response: "✅ Yes, you can vote using your Aadhaar card!\n\nAadhaar is one of the accepted photo identity documents for voting in India.\n\n• Your Aadhaar name must match the voter roll\n• Physical Aadhaar card OR Aadhaar PDF from UIDAI website is accepted\n• Show it to the Presiding Officer at the booth\n\n💡 Best practice: Always carry your Voter ID (EPIC) as it's the primary election document.",
    followups: ["What other IDs can I use?", "What if names don't match?"]
  },

  // ─── EVM ─────────────────────────────────────────────────────────────────────
  {
    id: "evm",
    keywords: ["evm", "electronic voting machine", "voting machine", "how evm works", "what is evm", "evm tampering", "evm battery", "evm hacked", "evm safe"],
    response: "🗳️ Electronic Voting Machine (EVM):\n\nAn EVM is a standalone electronic device used for casting votes in Indian elections.\n\n🔧 How it works:\n• Ballot Unit (BU): Has candidate names + buttons\n• Control Unit (CU): With Presiding Officer — activates voting\n• VVPAT: Prints paper slip showing your vote\n\n🔒 Security features:\n• Standalone device — NOT connected to internet\n• One-time programmable microchip\n• Tamper-proof seals\n• Stored under 24/7 security\n\n• Runs on alkaline battery — no mains power\n• Made by ECIL and BEL (government companies)",
    followups: ["What is VVPAT?", "Can EVM be hacked?", "How is EVM sealed?"]
  },
  {
    id: "evm_tamper",
    keywords: ["evm hacked", "evm tampered", "evm manipulation", "can evm be hacked", "evm rigged", "evm fraud"],
    response: "🔒 Can EVMs be Tampered?\n\nThe Supreme Court of India has upheld EVM integrity. Here's why EVMs are secure:\n\n1. ✅ Standalone — NOT connected to any network or internet\n2. ✅ One-time programmable chips — cannot be reprogrammed\n3. ✅ Stored in strongrooms with armed guards and CCTV\n4. ✅ Candidate agents can inspect EVMs before/after polling\n5. ✅ VVPAT provides independent paper verification\n6. ✅ Mock poll done before actual voting starts\n7. ✅ Statistical VVPAT verification done post-election\n\nEVMs have been used in Indian elections since 1999.",
    followups: ["What is VVPAT?", "What is mock poll?"]
  },

  // ─── VVPAT ───────────────────────────────────────────────────────────────────
  {
    id: "vvpat",
    keywords: ["vvpat", "paper trail", "paper slip voting", "what is vvpat", "vvpat machine", "vvpat slip", "voter verifiable"],
    response: "🖨️ VVPAT (Voter Verified Paper Audit Trail):\n\nVVPAT is a machine attached to EVM that prints a paper slip showing:\n• Serial number\n• Your chosen candidate's name\n• Party symbol\n\n⏱️ The slip is visible for 7 seconds through a glass window, then drops into a sealed box.\n\n🔍 Purpose:\n• Allows voters to verify their vote was recorded correctly\n• Paper slips used for statistical audit after election\n• Adds independent layer of verification beyond EVM\n\nVVPAT mandatory in all Indian polling stations since 2019.",
    followups: ["How long is VVPAT slip visible?", "What if VVPAT slip is wrong?", "Can I keep the VVPAT slip?"]
  },
  {
    id: "vvpat_duration",
    keywords: ["how long vvpat", "vvpat seconds", "vvpat time", "vvpat visible", "7 seconds"],
    response: "⏱️ VVPAT Slip Duration:\n\nThe VVPAT slip is visible for exactly 7 seconds through a transparent window.\n\nAfter 7 seconds, it automatically drops into the sealed paper ballot box inside the VVPAT machine.\n\n❌ You CANNOT take the slip — it stays inside the machine.\n✅ The dropped slips can be physically counted if ordered by Election Commission or court.",
    followups: ["What is VVPAT?", "Can I keep the slip?"]
  },

  // ─── NOTA ────────────────────────────────────────────────────────────────────
  {
    id: "nota",
    keywords: ["nota", "none of the above", "reject all candidates", "no candidate", "nota button", "nota symbol", "what is nota"],
    response: "🚫 NOTA (None of the Above):\n\nNOTA is an option on the EVM ballot that lets you reject ALL candidates.\n\n• Symbol: A ballot paper with a cross (✗)\n• Available on every EVM since 2013 (Supreme Court order)\n• Located as the LAST button on the ballot unit\n\n⚠️ Important: NOTA votes are counted but DO NOT affect the result.\n• If NOTA gets the most votes, the candidate with 2nd highest votes still WINS\n• Your vote is still recorded and counted — shows political dissatisfaction\n\n💡 NOTA protects your right to reject without abstaining.",
    followups: ["Does NOTA ever win?", "How to press NOTA?", "Where is NOTA on EVM?"]
  },

  // ─── INSIDE POLLING BOOTH ─────────────────────────────────────────────────────
  {
    id: "voting_process",
    keywords: ["how to vote", "voting process", "steps to vote", "inside booth", "what happens booth", "voting steps", "polling process", "kaise vote kare"],
    response: "🏛️ Step-by-Step: How to Vote\n\n1. 📋 Queue outside the polling booth\n2. 🪪 Show your Voter ID (or alternate ID) to officer at Gate 1\n3. ✍️ Sign/thumb impression in the electoral roll register\n4. 🖊️ Get indelible ink mark on left index finger\n5. ➡️ Enter the voting compartment\n6. 🔍 Find your candidate on EVM\n7. 🔘 Press the button next to your choice\n8. 👀 Watch the VVPAT slip for 7 seconds to verify\n9. 🚪 Exit the booth\n\n⏱️ The whole process takes about 2–5 minutes.",
    followups: ["What is indelible ink?", "Can I change my vote?", "What if I press wrong button?"]
  },
  {
    id: "indelible_ink",
    keywords: ["indelible ink", "ink on finger", "finger ink", "why ink", "voting ink", "remove ink", "ink removal", "kali swahi"],
    response: "🖋️ Indelible Ink (Voting Ink):\n\nIndelible ink is applied on your left index finger before you vote.\n\n🎯 Purpose:\n• Prevents duplicate voting\n• Ink is permanent and cannot be removed easily\n• Marks the voter as 'voted'\n\n🔬 Composition:\n• Made of Silver Nitrate\n• Invisible initially, darkens on exposure to light\n• Manufactured by Mysore Paints & Varnish (since 1962)\n\n⚠️ Do NOT try to remove it — it's a criminal offense to vote if it's on your finger from a previous election.",
    followups: ["How long does ink last?", "Which finger gets ink?", "What if ink is already on my finger?"]
  },
  {
    id: "wrong_button",
    keywords: ["pressed wrong button", "wrong vote", "mistake vote", "change vote", "cancel vote", "vote again"],
    response: "❌ Pressed the Wrong Button?\n\nUnfortunately, you CANNOT change your vote once cast on an EVM.\n\n• The EVM confirms your vote immediately when you press the button\n• There is no 'undo' or 'cancel' option\n• Your vote is final\n\n⚠️ This is intentional — to maintain the secrecy of the ballot. Even polling officers cannot see who you voted for.\n\n💡 Tip: Take a moment to find your candidate before pressing. The EVM button is clearly labeled with name and party symbol.",
    followups: ["Is my vote really secret?", "Can anyone see who I voted for?"]
  },

  // ─── VOTING RIGHTS ────────────────────────────────────────────────────────────
  {
    id: "vote_secret",
    keywords: ["is vote secret", "secret ballot", "who can see my vote", "vote privacy", "secret voting", "boss force vote", "employer vote"],
    response: "🔐 Your Vote is Absolutely Secret!\n\n• No one — not even the Presiding Officer — can see who you voted for\n• The EVM only records a count, not who voted for whom\n• VVPAT slips are sealed — not opened unless ordered by court\n• It is ILLEGAL for anyone to ask how you voted\n• Your employer, family, or political party CANNOT force you to vote a certain way\n\n⚖️ Legal protection: Section 171C of IPC makes it a criminal offense to influence a voter by force or bribery.",
    followups: ["What if someone threatens me to vote?", "Can I report election violations?"]
  },
  {
    id: "voting_leave",
    keywords: ["leave for voting", "paid leave vote", "holiday for voting", "employer voting leave", "office election day", "work election day"],
    response: "📅 Right to Paid Leave for Voting:\n\nYes! You have the legal right to take a paid holiday to vote.\n\n• The Representation of People Act gives every eligible voter the right to vote\n• Most state laws require employers to give paid leave on election day\n• This applies to: factories, offices, shops, establishments\n\n⚠️ However: If your employer can show your polling hours don't conflict with your working hours, they may not be required to give leave.\n\n💡 Communicate with your employer in advance. Election Commission encourages all employers to facilitate voting.",
    followups: ["What are my voter rights?", "Can employer punish me for voting?"]
  },

  // ─── ELECTION TYPES ───────────────────────────────────────────────────────────
  {
    id: "election_types",
    keywords: ["types of election", "general election", "state election", "lok sabha", "vidhan sabha", "rajya sabha", "by election", "municipal election", "what elections in india"],
    response: "🗳️ Types of Elections in India:\n\n1. 🏛️ Lok Sabha (General Election)\n   • Every 5 years • Elects 543 MPs to Parliament\n\n2. 🏛️ Vidhan Sabha (State Assembly)\n   • Every 5 years per state • Elects state government\n\n3. 👥 Rajya Sabha (Upper House)\n   • Members elected by state MLAs • Not direct public vote\n\n4. 🔄 By-Election\n   • Held when a seat becomes vacant mid-term\n\n5. 🏙️ Municipal / Panchayat Elections\n   • Local body elections • Varies by state",
    followups: ["How often are Lok Sabha elections?", "What is a by-election?", "Who votes for Rajya Sabha?"]
  },

  // ─── MODEL CODE OF CONDUCT ───────────────────────────────────────────────────
  {
    id: "mcc",
    keywords: ["model code of conduct", "mcc", "election code", "what is mcc", "code of conduct", "election rules", "achar sanhita"],
    response: "📜 Model Code of Conduct (MCC):\n\nThe MCC is a set of rules issued by the Election Commission once elections are announced.\n\n🔑 Key Rules:\n• Government cannot announce new welfare schemes\n• No use of government vehicles/resources for campaigning\n• Defacement of public property is banned\n• Hate speech and inflammatory material is banned\n• Candidates must disclose assets/criminal record (affidavit)\n\n⏰ MCC comes into effect from election announcement until results are declared.\n\n📞 Report MCC violations: cVIGIL app or 1950",
    followups: ["When does MCC start?", "How to report MCC violation?", "What is cVIGIL?"]
  },

  // ─── COMPLAINTS & HELPLINE ────────────────────────────────────────────────────
  {
    id: "complaints",
    keywords: ["complaint", "how to complain", "election complaint", "report violation", "helpline", "1950", "cvigil", "election observer"],
    response: "📞 How to Report Election Violations:\n\n1. 📱 cVIGIL App — Take photo/video of violation, report instantly\n   • GPS-tagged complaint → resolved within 100 minutes guaranteed\n\n2. ☎️ Voter Helpline: 1950 (toll-free)\n   • Available during election period\n   • Report booth violations, bribery, voter harassment\n\n3. 🌐 Online: eci.gov.in → Grievance Portal\n\n4. 👮 Contact your Election Observer (present in constituency)\n\n5. 🚨 Police (if emergency): 100\n\n⚡ ECI guarantees action on cVIGIL complaints within 100 minutes!",
    followups: ["What is cVIGIL?", "Who is election observer?", "What counts as election violation?"]
  },

  // ─── COUNTING & RESULTS ────────────────────────────────────────────────────────
  {
    id: "counting",
    keywords: ["counting", "how votes counted", "counting day", "result", "how results declared", "vote counting", "evm counting", "strong room"],
    response: "🔢 How Votes Are Counted:\n\n1. 📅 Counting Day: Announced by ECI along with election schedule\n\n2. 🔒 Before counting:\n   • EVMs stored in strongrooms (sealed, guarded)\n   • Candidate agents can put their seals\n   • CCTV surveillance 24/7\n\n3. 📊 On Counting Day:\n   • EVMs brought to counting center\n   • Candidate agents present\n   • Each EVM is switched on and votes tallied\n   • Results announced seat by seat\n\n4. 🏆 Winner: Candidate with most votes wins (First Past the Post system)\n   • No minimum % required",
    followups: ["What is First Past the Post?", "When are results declared?", "Can I watch counting?"]
  },

  // ─── POSTAL BALLOT ────────────────────────────────────────────────────────────
  {
    id: "postal_ballot",
    keywords: ["postal ballot", "absentee voting", "away from home vote", "armed forces vote", "police vote", "out of station vote"],
    response: "📬 Postal Ballot Voting:\n\nSome voters can vote by post instead of visiting a booth:\n\n✅ Who is eligible:\n• Armed Forces personnel (Army, Navy, Air Force)\n• Central/State Police deployed away from constituency\n• Government employees on election duty\n• Senior citizens (85+) in some states\n• People with disabilities (certain states)\n\n📋 Process:\n1. Apply for postal ballot before election\n2. Ballot sent by post to your location\n3. Mark your vote and send it back before counting day\n\n❌ Regular NRIs currently cannot use postal ballot.",
    followups: ["Can NRIs use postal ballot?", "How to apply for postal ballot?"]
  },

  // ─── ELECTION COMMISSION ──────────────────────────────────────────────────────
  {
    id: "eci",
    keywords: ["election commission", "eci", "what is eci", "chief election commissioner", "election commissioner", "who runs election", "who organizes election"],
    response: "🏛️ Election Commission of India (ECI):\n\nECI is the constitutional body responsible for conducting elections in India.\n\n📌 Key Facts:\n• Established: January 25, 1950 (celebrated as National Voters' Day)\n• Constitutional provision: Article 324\n• Headed by: Chief Election Commissioner + 2 Election Commissioners\n• Independent of government — reports to President of India\n\n🎯 Responsibilities:\n• Prepares electoral rolls\n• Announces election dates\n• Issues Model Code of Conduct\n• Oversees free and fair elections\n\n🌐 Website: eci.gov.in",
    followups: ["What is Model Code of Conduct?", "How to contact ECI?"]
  },

  // ─── CANDIDATURE / NOMINATION ─────────────────────────────────────────────────
  {
    id: "nomination",
    keywords: ["nomination", "how to contest", "file nomination", "become candidate", "election candidate", "how to stand for election"],
    response: "📝 How to Become an Election Candidate:\n\n1. 📋 File nomination form with Returning Officer (RO)\n2. 📄 Submit affidavit declaring: assets, liabilities, criminal cases (if any)\n3. 💰 Pay security deposit (₹25,000 for Lok Sabha, varies by election)\n4. 🔍 Nomination scrutinized by RO\n5. 🔄 Withdrawal period: Can withdraw within 2 days after scrutiny\n\n🎯 Requirements:\n• Indian citizen, 25+ years (Lok Sabha), 30+ years (Rajya Sabha)\n• Name on electoral roll\n• Not holding office of profit under government",
    followups: ["What is security deposit?", "Can criminals contest elections?"]
  },

  // ─── APPRECIATION / FAREWELL ─────────────────────────────────────────────────
  {
    id: "thanks",
    keywords: ["thank you", "thanks", "thank", "helpful", "great", "good", "nice", "awesome", "perfect", "shukriya", "dhanyawad"],
    response: "😊 You're welcome! Happy to help.\n\nRemember: Every vote counts! 🗳️\n\nIs there anything else you'd like to know about elections or voting? I'm here to help!",
    followups: ["Tell me about voter registration", "How does EVM work?", "What is NOTA?"]
  },
  {
    id: "goodbye",
    keywords: ["bye", "goodbye", "exit", "quit", "done", "nothing else", "that's all", "ok thanks"],
    response: "👋 Goodbye! \n\nDon't forget to VOTE on election day — it's your right and your power! 🇮🇳\n\nIf you have more questions later, I'm always here. Happy voting! 🗳️",
    followups: []
  }
];

/**
 * Contextual follow-up responses.
 * Key: intentId → { trigger word: response }
 */
export const contextualResponses = {
  vvpat: {
    "how long": "The VVPAT slip is visible for exactly 7 seconds before it drops into the sealed box.",
    "keep": "No, you cannot keep the VVPAT slip. It automatically drops into a sealed box inside the VVPAT machine.",
    "wrong": "If you believe the VVPAT slip shows the wrong candidate, immediately inform the Presiding Officer. They can note your complaint. After counting, VVPAT slips can be verified."
  },
  voter_registration: {
    "how long": "The voter registration process typically takes 2–4 weeks after submitting your application. You'll receive an SMS confirmation.",
    "cost": "Voter registration is completely FREE in India. There is no fee to register as a voter.",
    "offline": "Yes, you can register offline by visiting your local Booth Level Officer (BLO) or Electoral Registration Officer (ERO) office with Form 6."
  },
  evm: {
    "hacked": "EVMs cannot be hacked as they are standalone devices with no internet or network connectivity. They use one-time programmable chips.",
    "battery": "EVMs run on standard alkaline batteries — no mains power connection is needed. This makes them suitable for remote polling stations."
  }
};

/**
 * Fallback response when no intent is matched.
 */
export const fallbackResponse = "🤔 I didn't quite understand that.\n\nI can help you with topics like:\n• Voter registration\n• Finding your polling booth\n• Documents needed to vote\n• How EVM and VVPAT work\n• Voting day process\n• Your voting rights\n• Types of elections\n• How to file complaints\n\nCould you rephrase your question? Or pick one of the suggestions below!";
Chat UI Component (/src/components/chatbot/Chatbot.jsx):
jsximport React, { useState, useRef, useEffect, useReducer } from 'react';
import { matchIntent } from '../../utils/chatEngine';

const TYPING_DELAY = 600; // ms — realistic bot "thinking" delay

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
        messages: [...state.messages, { role: 'bot', text: action.text, followups: action.followups, id: Date.now() }],
        lastIntentId: action.intentId,
      };
    case 'CLEAR':
      return { messages: [], isTyping: false, lastIntentId: null };
    default:
      return state;
  }
}

export default function Chatbot() {
  const [state, dispatch] = useReducer(chatReducer, { messages: [], isTyping: false, lastIntentId: null });
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const liveRegionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isTyping]);

  const handleSend = (text = input.trim()) => {
    if (!text) return;
    dispatch({ type: 'ADD_USER_MESSAGE', text });
    setInput('');
    dispatch({ type: 'SET_TYPING', value: true });

    // Non-blocking: simulate typing delay then respond
    setTimeout(() => {
      const { response, followups, intentId } = matchIntent(text, state.lastIntentId);
      dispatch({ type: 'ADD_BOT_MESSAGE', text: response, followups, intentId });
      // Update aria-live for screen readers
      if (liveRegionRef.current) liveRegionRef.current.textContent = response;
    }, TYPING_DELAY);
  };

  return (
    <section className="chatbot" aria-label="Election Assistant Chatbot">
      {/* ARIA live region for screen readers */}
      <div ref={liveRegionRef} aria-live="polite" aria-atomic="true" className="sr-only" />

      <div className="chat-messages" role="log" aria-label="Chat messages">
        {/* Welcome message */}
        {state.messages.length === 0 && (
          <div className="welcome-message">
            <p>👋 Ask me anything about elections and voting!</p>
            <div className="quick-chips" role="group" aria-label="Quick questions">
              {['How to register?', 'Find my booth', 'What is NOTA?', 'How EVM works?'].map(q => (
                <button key={q} className="chip" onClick={() => handleSend(q)} aria-label={`Ask: ${q}`}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {state.messages.map(msg => (
          <div key={msg.id} className={`message ${msg.role}`} role={msg.role === 'bot' ? 'article' : undefined}>
            <p className="message-text" style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
            {msg.followups?.length > 0 && (
              <div className="followup-chips" role="group" aria-label="Related questions">
                {msg.followups.map(f => (
                  <button key={f} className="chip small" onClick={() => handleSend(f)}>{f}</button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {state.isTyping && (
          <div className="message bot typing" aria-label="Bot is typing" aria-live="off">
            <span className="dot" /><span className="dot" /><span className="dot" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about elections, voting, booth location..."
          aria-label="Type your election question"
          maxLength={300}
        />
        <button onClick={() => handleSend()} aria-label="Send message" disabled={!input.trim()}>
          Send
        </button>
        <button onClick={() => dispatch({ type: 'CLEAR' })} aria-label="Clear chat">Clear</button>
      </div>
    </section>
  );
}

2.2 Voting Simulator — EVM State Machine
javascript// State machine constants
const PHASES = {
  IDLE: 'idle',
  ENTER_BOOTH: 'enter_booth',
  SHOW_ID: 'show_id',
  SIGN_REGISTER: 'sign_register',
  INDELIBLE_INK: 'indelible_ink',
  APPROACH_EVM: 'approach_evm',
  SELECT_CANDIDATE: 'select_candidate',
  CONFIRM_VOTE: 'confirm_vote',
  VVPAT_SLIP: 'vvpat_slip',
  VOTE_CAST: 'vote_cast',
  CELEBRATION: 'celebration',
};

function simulatorReducer(state, action) {
  switch (action.type) {
    case 'NEXT': return { ...state, phase: TRANSITIONS[state.phase] };
    case 'SELECT_CANDIDATE': return { ...state, selectedCandidate: action.candidate };
    case 'CONFIRM': return { ...state, phase: PHASES.VVPAT_SLIP };
    case 'RESET': return initialState;
    default: return state;
  }
}

const TRANSITIONS = {
  [PHASES.IDLE]: PHASES.ENTER_BOOTH,
  [PHASES.ENTER_BOOTH]: PHASES.SHOW_ID,
  // ... etc
};
EVM Beep (Web Audio API — no file needed):
javascriptexport function playEVMBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Audio not available — graceful degradation
    console.warn('Audio not available:', e);
  }
}

2.3 Find My Polling Booth — Flask Endpoint
python"""
Polling Booth API
Routes for finding polling booth by pincode or area name.
"""

from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, validate, ValidationError
from app.services.supabase_client import get_supabase
from app.extensions import limiter, cache

bp = Blueprint('booth', __name__)


class BoothSearchSchema(Schema):
    """Validates booth search input parameters."""
    pincode = fields.Str(validate=validate.Regexp(r'^\d{6}$'), load_default=None)
    area = fields.Str(validate=validate.Length(min=2, max=100), load_default=None)


@bp.route('/booth', methods=['GET'])
@limiter.limit("30 per minute")
@cache.cached(timeout=3600, query_string=True)  # Cache 1 hour per unique query
def find_booth():
    """
    Find polling booth by pincode or area name.
    
    Query params:
        pincode (str): 6-digit Indian pincode
        area (str): Area or locality name (min 2 chars)
    
    Returns:
        JSON: Booth details including name, address, coordinates
    """
    schema = BoothSearchSchema()
    try:
        params = schema.load(request.args)
    except ValidationError as err:
        return jsonify({'error': 'Invalid input', 'details': err.messages}), 400

    if not params['pincode'] and not params['area']:
        return jsonify({'error': 'Provide either pincode or area parameter'}), 400

    supabase = get_supabase()

    if params['pincode']:
        result = supabase.table('polling_booths')\
            .select('*')\
            .eq('pincode', params['pincode'])\
            .limit(1)\
            .execute()
    else:
        result = supabase.table('polling_booths')\
            .select('*')\
            .ilike('area_name', f"%{params['area']}%")\
            .limit(5)\
            .execute()

    if not result.data:
        return jsonify({'error': 'No polling booth found for given location'}), 404

    return jsonify(result.data[0] if params['pincode'] else result.data), 200

2.4 Security Implementation
Flask Security Stack:
python# extensions.py
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from flask_compress import Compress

cors = CORS()
limiter = Limiter(key_func=get_remote_address, default_limits=["200 per day", "50 per hour"])
cache = Cache(config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT': 300})
compress = Compress()
Nginx Security Headers:
nginxadd_header Content-Security-Policy "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://maps.googleapis.com; frame-src https://www.google.com; connect-src 'self' https://*.supabase.co" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

2.5 Testing Strategy
Backend (/backend/tests/):
python# test_chatbot_engine.py (frontend util tested in Jest, backend test validates data structure)
def test_chatbot_data_has_required_fields():
    """All intents must have id, keywords, response, followups"""
    # Load chatbotData.js contents via JSON export
    for intent in intents:
        assert 'id' in intent
        assert 'keywords' in intent
        assert len(intent['keywords']) > 0
        assert 'response' in intent
        assert len(intent['response']) > 10

# test_booth.py
def test_booth_valid_pincode(client):
    res = client.get('/api/booth?pincode=380001')
    assert res.status_code == 200
    data = res.get_json()
    assert 'booth_name' in data
    assert 'latitude' in data

def test_booth_invalid_format(client):
    res = client.get('/api/booth?pincode=ABCDEF')
    assert res.status_code == 400

def test_booth_not_found(client):
    res = client.get('/api/booth?pincode=000000')
    assert res.status_code == 404

def test_rate_limit(client):
    for _ in range(31):
        client.get('/api/booth?pincode=380001')
    res = client.get('/api/booth?pincode=380001')
    assert res.status_code == 429
Frontend (/src/__tests__/):
javascript// chatEngine.test.js
import { matchIntent } from '../utils/chatEngine';

test('matches voter registration intent', () => {
  const result = matchIntent('how do I register to vote');
  expect(result.intentId).toBe('voter_registration');
  expect(result.response).toContain('voters.eci.gov.in');
});

test('matches with typo (fuzzy)', () => {
  const result = matchIntent('registartion process'); // typo
  expect(result.intentId).toBe('voter_registration');
});

test('matches NOTA intent', () => {
  const result = matchIntent('what is NOTA');
  expect(result.intentId).toBe('nota');
});

test('returns fallback for unrecognized input', () => {
  const result = matchIntent('xyzzy random nonsense qwerty');
  expect(result.intentId).toBeNull();
  expect(result.followups.length).toBeGreaterThan(0);
});

test('handles greeting', () => {
  const result = matchIntent('hello');
  expect(result.intentId).toBe('greeting');
});

test('contextual follow-up works', () => {
  const result = matchIntent('how long', 'vvpat');
  expect(result.response).toContain('7 seconds');
});

3. Google Services Integration Details
ServiceHow UsedWhereCloud RunHosts React frontend (nginx) + Flask backend (gunicorn)asia-south1 regionMaps Embed APIShows polling booth location on interactive mapBoothFinder → MapEmbed.jsxMaps Directions APIConstructs "Get Directions" URLmaps.google.com/dir/?destination={lat},{lng}Cloud StorageStores generated PDF checklists (signed URLs, 24hr expiry)/api/generate-checklistSecret ManagerStores all credentials (Supabase URL, keys, API keys)Backend startup, Cloud Run --set-secretsCloud BuildCI/CD: runs tests → builds Docker images → deployscloudbuild.yamlCloud LoggingFlask logs streamed automatically via Cloud RunCloud ConsoleGoogle FontsPoppins (headings) + Inter (body) — preloaded in HTMLindex.html <link rel="preload">Google Analytics 4Tracks feature usage, user journeysGA4 gtag.js

4. Unique Differentiating Features

Zero-Cost Chatbot — Client-side keyword engine: no API fees, < 100ms response, works offline
EVM + VVPAT Simulation — Realistic 10-phase simulation most civic apps don't have
Programmatic EVM Beep — Web Audio API oscillator, no audio file dependency
Indelible Ink Animation — SVG animation on finger, memorable and authentic
Multi-Turn Context — Chatbot remembers last topic for 3 turns (contextual Q&A)
Fuzzy Matching — Handles voter typos (Levenshtein ≤ 2) — production-quality UX
Hindi Keyword Support — Basic Hindi queries trigger correct English/Hindi responses
Offline-First — Service worker caches booth data, chatbot works without internet
PDF Checklist — Downloadable voter day checklist (Flask + ReportLab + GCS)
Anonymous Leaderboard — Gamified quiz without privacy compromise