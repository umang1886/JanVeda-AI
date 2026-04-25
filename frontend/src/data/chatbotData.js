/**
 * chatbotData.js — ElectionGuide Chatbot Intent Database
 * 60+ intents covering all election and voting topics for Indian elections.
 * Each intent: id, keywords[], response, followups[]
 */

export const chatbotIntents = [

  // ─── GREETINGS ────────────────────────────────────────────────────────
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'namaste', 'help', 'start', 'what can you do', 'helo', 'hii'],
    response: 'Namaste! 🙏 I\'m your JanVeda AI Election Assistant.\n\nI can help you with:\n• Voter registration & EPIC card\n• Finding your polling booth\n• Documents needed for voting\n• How EVM and VVPAT work\n• Voting day process step-by-step\n• Your voting rights\n• Types of elections in India\n• And much more!\n\nWhat would you like to know?',
    followups: ['How to register as voter?', 'Find my polling booth', 'What documents do I need?', 'How does EVM work?'],
  },

  // ─── VOTER REGISTRATION ───────────────────────────────────────────────
  {
    id: 'voter_registration',
    keywords: ['register', 'registration', 'how to register', 'apply voter id', 'form 6', 'nvsp', 'new voter', 'enroll', 'voter enrollment', 'add name voter list', 'matdan panjiyan', 'voter list add', 'register vote'],
    response: '📝 To register as a voter in India:\n\n1. Visit voters.eci.gov.in\n2. Click \'New Registration (Form 6)\'\n3. Fill in your personal details\n4. Upload: Aadhaar + passport photo + address proof\n5. Submit — note your reference number\n6. Your BLO will verify within 2–4 weeks\n\n📱 Also: Use the Voter Helpline App or call 1950\n\n⏰ Registration closes 30 days before election date.',
    followups: ['What documents are needed?', 'What is a BLO?', 'How long does registration take?', 'Can I register offline?'],
  },
  {
    id: 'registration_offline',
    keywords: ['offline registration', 'register offline', 'form 6 offline', 'submit form 6', 'visit blo', 'offline voter', 'ero office'],
    response: '📋 Offline Voter Registration:\n\n1. Get Form 6 from your nearest Election Office or BLO\n2. Fill the form with your details\n3. Attach: passport photo + proof of age + proof of address\n4. Submit at your Electoral Registration Officer\'s office\n5. You\'ll receive an acknowledgment slip\n\n📍 Find your ERO at: electoralsearch.in',
    followups: ['What is a BLO?', 'What documents do I need?'],
  },
  {
    id: 'blo',
    keywords: ['blo', 'booth level officer', 'what is blo', 'who is blo', 'blo contact'],
    response: '👮 Booth Level Officer (BLO):\n\nA BLO is a government official (usually a teacher or government employee) assigned to each polling booth area.\n\n🎯 Their role:\n• Verify voter registration applications\n• Update voter rolls\n• Distribute voter slips before elections\n• Help with address changes\n\n📍 Find your BLO at: voters.eci.gov.in → \'Contact BLO\'',
    followups: ['How to contact BLO?', 'How to register to vote?'],
  },

  // ─── VOTER ID / EPIC ──────────────────────────────────────────────────
  {
    id: 'voter_id',
    keywords: ['voter id', 'epic card', 'voter card', 'election card', 'what is voter id', 'voter id card', 'matdata pehchan patra', 'epic'],
    response: '🪪 Voter ID (EPIC Card):\n\nEPIC = Elector\'s Photo Identity Card — issued by the Election Commission of India.\n\n• Primary ID for voting at your polling booth\n• Valid address proof for other purposes\n• Free of cost — no fee to get it\n• Download e-EPIC (digital) from voters.eci.gov.in\n\n💡 Tip: Lost your card? Apply for a duplicate — it\'s free!',
    followups: ['How to download e-EPIC?', 'Lost my voter ID — what to do?', 'Can I vote without voter ID?'],
  },
  {
    id: 'epic_download',
    keywords: ['download voter id', 'download epic', 'e-epic', 'digital voter id', 'e epic download', 'voter id pdf', 'epic pdf'],
    response: '📲 Download your e-EPIC (Digital Voter ID):\n\n1. Go to voters.eci.gov.in\n2. Click \'Download e-EPIC\'\n3. Login with your mobile number (linked to voter record)\n4. Search by EPIC number or Name + DOB + State\n5. Download your PDF voter ID\n\n✅ e-EPIC is legally valid as ID proof — accepted at polling booths.',
    followups: ['Is e-EPIC valid for voting?', 'How to find my EPIC number?'],
  },
  {
    id: 'lost_voter_id',
    keywords: ['lost voter id', 'voter id lost', 'duplicate voter id', 'new voter card', 'voter id replacement', 'lost epic'],
    response: '😟 Lost your Voter ID? Here\'s what to do:\n\n1. File an FIR at your local police station (recommended)\n2. Visit voters.eci.gov.in → Apply for duplicate EPIC\n3. Fill Form EPIC-002\n4. Submit with passport photo + address proof\n\n💡 Meanwhile, download the e-EPIC (digital voter ID) — it\'s immediately available online.\n\n✅ You can also use Aadhaar, Passport, or Driving License as alternate ID to vote.',
    followups: ['Can I vote without voter ID?', 'What other IDs can I use to vote?'],
  },

  // ─── ELIGIBILITY ──────────────────────────────────────────────────────
  {
    id: 'eligibility',
    keywords: ['who can vote', 'voting eligibility', 'am i eligible', 'eligible to vote', 'age to vote', 'voting age', 'matdan ke liye umra', '18 vote', 'minimum age', 'can i vote'],
    response: '✅ To be eligible to vote in India:\n\n1. 🎂 At least 18 years old (on the qualifying date)\n2. 🇮🇳 Citizen of India\n3. 📍 Resident of the constituency\n4. 🧠 Of sound mind\n5. 📋 Name on the Electoral Roll\n\n❌ You CANNOT vote if you are:\n• A non-citizen\n• Serving a criminal sentence\n• Disqualified by a court',
    followups: ['How to register to vote?', 'Can NRIs vote?', 'Can prisoners vote?'],
  },
  {
    id: 'nri_voting',
    keywords: ['nri vote', 'nri voting', 'overseas indian vote', 'indian abroad vote', 'foreign indian vote', 'can nri vote', 'nri voter'],
    response: '🌍 NRI Voting in India:\n\nYes, NRIs can vote!\n\n• Register as \'Overseas Electors\' under Section 20A of RPA 1950\n• Register at: voters.eci.gov.in → NRI Registration\n• Documents: Passport + Indian address proof\n• ⚠️ Must physically come to India to vote (postal ballot not available for NRIs yet)\n\n📌 Your vote is cast in your home constituency in India.',
    followups: ['How to register as NRI voter?', 'What documents NRI needs?'],
  },
  {
    id: 'prisoner_voting',
    keywords: ['prisoner vote', 'can prisoners vote', 'jail vote', 'criminal vote', 'convicted person vote'],
    response: '⚖️ Prisoners and Voting:\n\n• Persons serving a sentence in jail CANNOT vote\n• Undertrials (not yet convicted) CAN vote if on bail\n• Once sentence is served, voting rights are restored\n• Persons convicted of election-related offenses may be disqualified for a period\n\n📚 Legal basis: Representation of the People Act, 1951 — Section 62(5)',
    followups: ['What are voter rights?', 'How to register after release?'],
  },

  // ─── POLLING BOOTH ────────────────────────────────────────────────────
  {
    id: 'find_booth',
    keywords: ['find booth', 'polling booth', 'where to vote', 'my booth', 'polling station', 'matdan kendra', 'booth location', 'where is my polling station', 'voting center', 'booth number', 'vote kahan'],
    response: '📍 Find Your Polling Booth:\n\n3 ways to find it:\n\n1. 🖥️ Use our \'Find My Booth\' feature — enter your pincode!\n2. 🌐 Visit electoralsearch.in → search your name → booth shown\n3. 📱 Call Voter Helpline: 1950\n\n💡 Also: Your voter slip (distributed before elections) shows booth details.',
    followups: ['What is a voter slip?', 'What time does booth open?', 'What to carry to booth?'],
  },
  {
    id: 'booth_timing',
    keywords: ['booth timing', 'voting time', 'what time vote', 'booth open', 'booth close', 'when to vote', 'voting hours', 'polling time', 'voting hours india'],
    response: '⏰ Polling Booth Timings:\n\nGenerally: 7:00 AM to 6:00 PM\n\n• Urban areas: typically 7 AM – 6 PM\n• Some states may end at 5 PM\n• Voters already in queue at closing are still allowed to vote\n• Mountain/remote areas may have earlier hours\n\n📋 Always check your Voter Slip or official ECI notification for your specific constituency.',
    followups: ['What if I\'m late to booth?', 'What documents to carry?', 'What is a voter slip?'],
  },
  {
    id: 'voter_slip',
    keywords: ['voter slip', 'what is voter slip', 'voter slip download', 'blo slip', 'polling slip'],
    response: '📄 Voter Slip:\n\nA voter slip is a document distributed by the BLO before elections that shows:\n• Your name as in voter roll\n• Voter serial number\n• Your polling booth name and address\n• Booth number\n\n💡 You can also download your voter slip online from voters.eci.gov.in\n\n⚠️ The voter slip alone is NOT an ID proof — you must carry a valid photo ID to vote.',
    followups: ['What is a BLO?', 'What ID do I need to vote?'],
  },

  // ─── DOCUMENTS ───────────────────────────────────────────────────────
  {
    id: 'documents',
    keywords: ['documents', 'what to carry', 'what id', 'documents needed', 'valid id', 'proof for voting', 'id for voting', 'which document', 'document required', 'id needed'],
    response: '📄 Documents to Carry on Voting Day:\n\nYou need ONE of these valid photo IDs:\n\n✅ Primary IDs:\n• Voter ID (EPIC card) — most preferred\n• Aadhaar Card\n• Passport\n• Driving License\n• PAN Card (with photo)\n\n✅ Also Accepted:\n• MNREGA Job Card\n• Bank/Post Office Passbook with photo\n• Smart Card (employee/student)\n• Pension document with photo\n\n💡 e-EPIC (digital voter ID on phone) is also valid!',
    followups: ['Can I vote with Aadhaar only?', 'What if I lost my voter ID?', 'Is e-EPIC valid?'],
  },
  {
    id: 'aadhaar_voting',
    keywords: ['aadhaar vote', 'can i vote with aadhaar', 'aadhaar card voting', 'aadhaar valid', 'aadhaar polling', 'vote using aadhaar'],
    response: '✅ Yes, you can vote using your Aadhaar card!\n\nAadhaar is one of the accepted photo identity documents for voting.\n\n• Show your Aadhaar to the Presiding Officer\n• Physical Aadhaar or UIDAI PDF is accepted\n• Name on Aadhaar should match voter roll (approximately)\n\n💡 Best practice: Always carry your Voter ID (EPIC) as it is the primary election document.',
    followups: ['What other IDs can I use?', 'What if names don\'t match exactly?'],
  },

  // ─── EVM ─────────────────────────────────────────────────────────────
  {
    id: 'evm',
    keywords: ['evm', 'electronic voting machine', 'voting machine', 'how evm works', 'what is evm', 'evm work', 'evm safe', 'about evm'],
    response: '🗳️ Electronic Voting Machine (EVM):\n\nAn EVM is a standalone electronic device used for casting votes in Indian elections.\n\n🔧 Components:\n• Ballot Unit (BU): Has candidate names + buttons\n• Control Unit (CU): With Presiding Officer — activates voting\n• VVPAT: Prints paper slip showing your vote\n\n🔒 Security:\n• NOT connected to internet — standalone device\n• One-time programmable microchip\n• Tamper-proof seals, 24/7 guarded storage\n• Runs on alkaline battery — no mains power\n• Made by ECIL and BEL (government companies)',
    followups: ['What is VVPAT?', 'Can EVM be hacked?', 'How is EVM sealed?'],
  },
  {
    id: 'evm_tamper',
    keywords: ['evm hacked', 'evm tampered', 'evm manipulation', 'can evm be hacked', 'evm rigged', 'evm fraud', 'is evm safe', 'evm hack'],
    response: '🔒 Can EVMs be Tampered?\n\nThe Supreme Court of India has upheld EVM integrity. Why EVMs are secure:\n\n1. ✅ Standalone — NOT connected to any network/internet\n2. ✅ One-time programmable chips — cannot be reprogrammed\n3. ✅ Stored in strongrooms with armed guards + CCTV\n4. ✅ Candidate agents inspect EVMs before/after polling\n5. ✅ VVPAT provides independent paper verification\n6. ✅ Mock poll done before actual voting starts\n7. ✅ Statistical VVPAT verification post-election\n\nEVMs used in Indian elections since 1999.',
    followups: ['What is VVPAT?', 'What is a mock poll?'],
  },
  {
    id: 'evm_battery',
    keywords: ['evm battery', 'evm power', 'battery voting machine', 'evm electricity'],
    response: '🔋 EVM Battery:\n\nEVMs run on standard alkaline batteries — no mains electricity needed.\n\n• This makes them suitable for remote polling stations with no power supply\n• Batteries are tested before deployment\n• A single set of batteries can last through an entire polling day\n• Battery-powered operation also prevents any electrical tampering\n\nThis is one of the key design features that makes Indian elections accessible everywhere.',
    followups: ['How does EVM work?', 'What is VVPAT?'],
  },

  // ─── VVPAT ───────────────────────────────────────────────────────────
  {
    id: 'vvpat',
    keywords: ['vvpat', 'paper trail', 'paper slip voting', 'what is vvpat', 'vvpat machine', 'vvpat slip', 'voter verifiable', 'paper audit'],
    response: '🖨️ VVPAT (Voter Verified Paper Audit Trail):\n\nVVPAT is a machine attached to the EVM that prints a paper slip showing:\n• Your chosen candidate\'s name\n• Party symbol\n• Serial number\n\n⏱️ The slip is visible for 7 seconds through a glass window, then drops into a sealed box.\n\n🔍 Purpose:\n• Lets voters verify their vote was recorded correctly\n• Paper slips used for statistical audit after election\n• Mandatory in all Indian polling stations since 2019',
    followups: ['How long is VVPAT slip visible?', 'What if VVPAT slip is wrong?', 'Can I keep the VVPAT slip?'],
  },
  {
    id: 'vvpat_duration',
    keywords: ['how long vvpat', 'vvpat seconds', 'vvpat time', 'vvpat visible', '7 seconds', 'vvpat duration'],
    response: '⏱️ VVPAT Slip Duration:\n\nThe VVPAT slip is visible for exactly 7 seconds through a transparent glass window.\n\nAfter 7 seconds, it automatically drops into the sealed paper ballot box inside the VVPAT machine.\n\n❌ You CANNOT take the slip — it stays inside the machine.\n✅ The dropped slips can be physically counted if ordered by Election Commission or court.',
    followups: ['What is VVPAT?', 'Can I keep the slip?'],
  },
  {
    id: 'vvpat_wrong',
    keywords: ['vvpat wrong', 'wrong vvpat slip', 'vvpat mismatch', 'wrong candidate vvpat', 'vvpat error'],
    response: '⚠️ If Your VVPAT Slip Shows the Wrong Candidate:\n\n1. Immediately inform the Presiding Officer inside the booth\n2. The officer will record your complaint in the \'Challenged Vote\' register\n3. Do NOT press any button again\n4. Your complaint will be logged for the record\n\nNote: ECI can conduct a VVPAT paper count if ordered by a court after the election.\n\n📞 You can also complain at: 1950 or via cVIGIL app.',
    followups: ['What is cVIGIL?', 'How to file election complaint?'],
  },

  // ─── NOTA ────────────────────────────────────────────────────────────
  {
    id: 'nota',
    keywords: ['nota', 'none of the above', 'reject all candidates', 'no candidate', 'nota button', 'nota symbol', 'what is nota', 'nota vote'],
    response: '🚫 NOTA (None of the Above):\n\nNOTA lets you reject ALL candidates on the ballot.\n\n• Symbol: A ballot paper with a cross (✗)\n• Available on every EVM since 2013 (Supreme Court order)\n• Located as the LAST button on the ballot unit\n\n⚠️ Important: NOTA votes are counted but DO NOT change the winner.\n• The candidate with highest votes still wins even if NOTA gets more\n• Your vote is still counted — expresses democratic dissatisfaction\n\n💡 NOTA protects your right to reject without abstaining.',
    followups: ['Does NOTA ever win?', 'Where is NOTA on EVM?', 'How to press NOTA?'],
  },

  // ─── INSIDE POLLING BOOTH ─────────────────────────────────────────────
  {
    id: 'voting_process',
    keywords: ['how to vote', 'voting process', 'steps to vote', 'inside booth', 'what happens booth', 'voting steps', 'polling process', 'kaise vote kare', 'vote karna', 'how do i vote'],
    response: '🏛️ Step-by-Step: How to Vote\n\n1. 📋 Queue outside the polling booth\n2. 🪪 Show your photo ID to the officer\n3. ✍️ Sign/thumb impression in electoral roll register\n4. 🖊️ Get indelible ink mark on left index finger\n5. ➡️ Enter the voting compartment\n6. 🔍 Find your candidate on the EVM ballot unit\n7. 🔘 Press the button next to your choice\n8. 👀 Watch the VVPAT slip for 7 seconds to verify\n9. 🚪 Exit the booth\n\n⏱️ The whole process takes about 2–5 minutes.',
    followups: ['What is indelible ink?', 'Can I change my vote?', 'What if I press wrong button?'],
  },
  {
    id: 'indelible_ink',
    keywords: ['indelible ink', 'ink on finger', 'finger ink', 'why ink', 'voting ink', 'remove ink', 'ink removal', 'kali swahi', 'black ink finger', 'ink voting'],
    response: '🖋️ Indelible Ink (Voting Ink):\n\nApplied on your left index finger before you vote.\n\n🎯 Purpose:\n• Prevents duplicate voting at another booth\n• Cannot be removed easily — marks \'voted\'\n\n🔬 Composition:\n• Made of Silver Nitrate\n• Invisible initially, darkens on light exposure\n• Manufactured by Mysore Paints & Varnish Ltd. (since 1962)\n\n⚠️ Do NOT attempt to remove it — voting with it from a previous election is a criminal offense.',
    followups: ['How long does ink last?', 'Which finger gets the ink?', 'What if ink is already on finger?'],
  },
  {
    id: 'wrong_button',
    keywords: ['pressed wrong button', 'wrong vote', 'mistake vote', 'change vote', 'cancel vote', 'vote again', 'wrong press evm'],
    response: '❌ Pressed the Wrong Button?\n\nUnfortunately, you CANNOT change your vote once cast on an EVM.\n\n• The EVM confirms your vote immediately when you press the button\n• There is no \'undo\' or \'cancel\' option\n• Your vote is final and secret\n\n⚠️ This is intentional — to maintain ballot secrecy. Even polling officers cannot see who you voted for.\n\n💡 Tip: Take a moment before pressing. The EVM button is clearly labeled with the candidate name and party symbol.',
    followups: ['Is my vote really secret?', 'Can anyone see who I voted for?'],
  },

  // ─── VOTING RIGHTS ────────────────────────────────────────────────────
  {
    id: 'vote_secret',
    keywords: ['is vote secret', 'secret ballot', 'who can see my vote', 'vote privacy', 'secret voting', 'boss force vote', 'employer vote', 'is voting secret'],
    response: '🔐 Your Vote is Absolutely Secret!\n\n• No one — not even the Presiding Officer — can see who you voted for\n• The EVM only records a count, not who voted for whom\n• VVPAT slips are sealed — not opened unless ordered by court\n• It is ILLEGAL for anyone to ask how you voted\n\n⚖️ Legal protection: Section 171C of IPC makes it a criminal offense to influence a voter by force or bribery.\n\n💪 Your employer, family, or political party CANNOT force you to vote any particular way.',
    followups: ['What if someone threatens me to vote?', 'How to report election violations?'],
  },
  {
    id: 'voting_leave',
    keywords: ['leave for voting', 'paid leave vote', 'holiday for voting', 'employer voting leave', 'office election day', 'work election day', 'voting holiday'],
    response: '📅 Right to Paid Leave for Voting:\n\nYes! You have the legal right to a paid holiday to vote.\n\n• The Representation of People Act gives every eligible voter the right to vote\n• Most state laws require employers to give paid leave on election day\n• Applies to: factories, offices, shops, establishments\n\n⚠️ Exception: If your polling hours don\'t conflict with your working hours, employer may not be required to give leave.\n\n💡 Communicate with your employer in advance. ECI encourages all employers to facilitate voting.',
    followups: ['What are my voter rights?', 'Can employer punish me for voting?'],
  },

  // ─── ELECTION TYPES ───────────────────────────────────────────────────
  {
    id: 'election_types',
    keywords: ['types of election', 'general election', 'state election', 'lok sabha', 'vidhan sabha', 'rajya sabha', 'by election', 'municipal election', 'what elections in india', 'indian election types'],
    response: '🗳️ Types of Elections in India:\n\n1. 🏛️ Lok Sabha (General Election)\n   • Every 5 years • Elects 543 MPs to Parliament\n\n2. 🏛️ Vidhan Sabha (State Assembly)\n   • Every 5 years per state • Elects state government\n\n3. 👥 Rajya Sabha (Upper House)\n   • Members elected by state MLAs — not direct public vote\n\n4. 🔄 By-Election\n   • Held when a seat becomes vacant mid-term\n\n5. 🏙️ Municipal / Panchayat Elections\n   • Local body elections — frequency varies by state',
    followups: ['How often are Lok Sabha elections?', 'What is a by-election?', 'Who votes for Rajya Sabha?'],
  },

  // ─── MODEL CODE OF CONDUCT ───────────────────────────────────────────
  {
    id: 'mcc',
    keywords: ['model code of conduct', 'mcc', 'election code', 'what is mcc', 'code of conduct', 'election rules', 'achar sanhita', 'election conduct'],
    response: '📜 Model Code of Conduct (MCC):\n\nRules issued by ECI once elections are announced.\n\n🔑 Key Rules:\n• Government cannot announce new welfare schemes\n• No use of government vehicles/resources for campaigning\n• Defacement of public property is banned\n• Hate speech and inflammatory material is banned\n• Candidates must disclose assets + criminal record (affidavit)\n\n⏰ MCC comes into effect from election announcement until results are declared.\n\n📞 Report MCC violations: cVIGIL app or call 1950',
    followups: ['When does MCC start?', 'How to report MCC violation?', 'What is cVIGIL?'],
  },

  // ─── CAMPAIGNING ─────────────────────────────────────────────────────
  {
    id: 'campaign',
    keywords: ['campaign', 'election campaign', 'campaign rules', 'campaigning', 'campaign end', 'silent period', 'election silence'],
    response: '📢 Election Campaigning Rules:\n\n• Campaigns can start from nomination filing\n• Campaign must stop 48 hours before polling day (silent period)\n• During silent period: no rallies, no speeches, no canvassing\n• No campaigning inside 100 meters of a polling booth on election day\n• Expenditure limits per candidate: ₹70–₹95 lakh (Lok Sabha), varies by state\n\n⚠️ All campaign expenses must be reported to the Returning Officer.',
    followups: ['What is silent period?', 'What is Model Code of Conduct?'],
  },

  // ─── COMPLAINTS ──────────────────────────────────────────────────────
  {
    id: 'complaints',
    keywords: ['complaint', 'how to complain', 'election complaint', 'report violation', 'helpline', '1950', 'cvigil', 'election observer', 'report problem', 'complain'],
    response: '📞 How to Report Election Violations:\n\n1. 📱 cVIGIL App — Photo/video the violation, report instantly\n   • GPS-tagged complaint → resolved within 100 minutes!\n\n2. ☎️ Voter Helpline: 1950 (toll-free)\n   • Report booth violations, bribery, voter harassment\n\n3. 🌐 Online: eci.gov.in → Grievance Portal\n\n4. 👮 Contact your Election Observer (in your constituency)\n\n5. 🚨 Police emergency: 100\n\n⚡ ECI guarantees action on cVIGIL complaints within 100 minutes!',
    followups: ['What is cVIGIL?', 'Who is election observer?', 'What is election violation?'],
  },
  {
    id: 'cvigil',
    keywords: ['cvigil', 'c vigil', 'cvigil app', 'what is cvigil', 'election vigilance app'],
    response: '📱 cVIGIL App:\n\ncVIGIL is a mobile app by the Election Commission of India for citizens to report election violations.\n\n🎯 What you can report:\n• Cash/gift distribution for votes\n• Liquor distribution\n• Defacing public property\n• Threatening voters\n• Unauthorized rallies\n\n⚡ How it works:\n1. Take photo/video of violation\n2. Submit via app — location is auto-tagged\n3. Flying Squad dispatched\n4. Resolution within 100 minutes — guaranteed!\n\n🔒 Complaints are confidential.',
    followups: ['How to download cVIGIL?', 'What is Model Code of Conduct?'],
  },

  // ─── COUNTING ────────────────────────────────────────────────────────
  {
    id: 'counting',
    keywords: ['counting', 'how votes counted', 'counting day', 'result', 'how results declared', 'vote counting', 'evm counting', 'strong room', 'election result'],
    response: '🔢 How Votes Are Counted:\n\n1. 📅 ECI announces counting date along with election schedule\n\n2. 🔒 Before counting:\n   • EVMs stored in strongrooms (sealed, guarded, CCTV 24/7)\n   • Candidate agents can seal them\n\n3. 📊 On Counting Day:\n   • EVMs brought to counting center\n   • Candidate agents present to observe\n   • Each EVM switched on, votes tallied\n   • Results announced seat by seat\n\n4. 🏆 Winner: Candidate with MOST votes wins\n   (First Past the Post — no minimum % needed)',
    followups: ['What is First Past the Post?', 'When are results declared?', 'Can I watch counting?'],
  },

  // ─── POSTAL BALLOT ────────────────────────────────────────────────────
  {
    id: 'postal_ballot',
    keywords: ['postal ballot', 'absentee voting', 'away from home vote', 'armed forces vote', 'police vote', 'out of station vote', 'postal vote'],
    response: '📬 Postal Ballot Voting:\n\nSome voters can vote by post instead of visiting a booth:\n\n✅ Who is eligible:\n• Armed Forces personnel (Army, Navy, Air Force)\n• Central/State Police deployed away from constituency\n• Government employees on election duty\n• Senior citizens (85+) and persons with disability (in some states)\n\n📋 Process:\n1. Apply for postal ballot before the election\n2. Ballot sent by post to your location\n3. Mark your vote and send it back before counting day\n\n❌ Regular NRIs currently cannot use postal ballot.',
    followups: ['Can NRIs use postal ballot?', 'How to apply for postal ballot?'],
  },

  // ─── ELECTION COMMISSION ─────────────────────────────────────────────
  {
    id: 'eci',
    keywords: ['election commission', 'eci', 'what is eci', 'chief election commissioner', 'election commissioner', 'who runs election', 'who organizes election', 'election commission india'],
    response: '🏛️ Election Commission of India (ECI):\n\nECI is the constitutional body responsible for conducting elections in India.\n\n📌 Key Facts:\n• Established: January 25, 1950 (celebrated as National Voters\' Day)\n• Constitutional basis: Article 324\n• Headed by: Chief Election Commissioner + 2 Election Commissioners\n• Independent of the government — reports to President of India\n\n🎯 Responsibilities:\n• Prepares electoral rolls\n• Announces election dates\n• Issues Model Code of Conduct\n• Ensures free and fair elections\n\n🌐 Website: eci.gov.in',
    followups: ['What is Model Code of Conduct?', 'How to contact ECI?', 'Who is Chief Election Commissioner?'],
  },

  // ─── NOMINATION ──────────────────────────────────────────────────────
  {
    id: 'nomination',
    keywords: ['nomination', 'how to contest', 'file nomination', 'become candidate', 'election candidate', 'how to stand for election', 'contest election'],
    response: '📝 How to Become an Election Candidate:\n\n1. 📋 File nomination form with Returning Officer (RO)\n2. 📄 Submit affidavit: assets, liabilities, criminal cases (if any)\n3. 💰 Pay security deposit (₹25,000 for Lok Sabha)\n4. 🔍 Nomination scrutinized by RO\n5. 🔄 Withdrawal period: can withdraw within 2 days after scrutiny\n\n🎯 Requirements:\n• Indian citizen, 25+ years (Lok Sabha), 30+ years (Rajya Sabha)\n• Name on electoral roll\n• Not holding office of profit under government',
    followups: ['What is security deposit?', 'Can criminals contest elections?', 'What is Lok Sabha?'],
  },

  // ─── BLIND / DISABILITY VOTERS ───────────────────────────────────────
  {
    id: 'disabled_voting',
    keywords: ['blind voter', 'disability vote', 'disabled vote', 'handicapped vote', 'wheelchair booth', 'pwd voting', 'differently abled vote'],
    response: '♿ Voting for Persons with Disability:\n\nECI provides special facilities for PwD voters:\n\n• Braille voter slips available at booths\n• Ramps and wheelchair access at all booths\n• Blind voters can bring a companion (of their choice) into the voting compartment\n• Priority in queue for PwD voters\n• Home voting for those with 80%+ disability (in some states)\n\n📱 Register as PwD voter: voters.eci.gov.in → PwD registration\n📞 Special helpline: 1800-111-950',
    followups: ['What facilities are at polling booths?', 'How to register as PwD voter?'],
  },

  // ─── OBSERVER ────────────────────────────────────────────────────────
  {
    id: 'observer',
    keywords: ['election observer', 'who monitors election', 'observer', 'iei observer', 'independent observer'],
    response: '👁️ Election Observers:\n\nECI deploys neutral observers to monitor elections in each constituency.\n\n• General Observers: Monitor overall election process\n• Expenditure Observers: Monitor candidate spending\n• Police Observers: Monitor law enforcement\n\nObservers are IAS/IPS officers from other states — NOT local officers.\n\n📞 You can contact the observer to report complaints:\n• Your local ECI office will have the observer\'s contact\n• Or: call 1950',
    followups: ['How to report election violation?', 'What is cVIGIL?'],
  },

  // ─── RE-POLLING ──────────────────────────────────────────────────────
  {
    id: 'repolling',
    keywords: ['re-polling', 'repolling', 'booth capturing', 'election cancelled', 'fresh election', 'repoll'],
    response: '🔄 When Can Re-Polling Happen:\n\nECI can order re-polling at a booth or constituency if:\n\n• Booth capturing occurs (voting disrupted by force)\n• EVM malfunction or tampering detected\n• Natural disaster disrupts polling\n• Serious law and order breakdown\n• Death of a candidate during campaign\n\n📢 ECI announces re-polling date. Voters vote again at the same booth with the same voter roll.\n\n👮 Re-polling booths have additional security deployed.',
    followups: ['What is booth capturing?', 'How does ECI decide re-polling?'],
  },

  // ─── APPRECIATION ────────────────────────────────────────────────────
  {
    id: 'thanks',
    keywords: ['thank you', 'thanks', 'thank', 'helpful', 'great', 'good', 'nice', 'awesome', 'perfect', 'shukriya', 'dhanyawad', 'bahut accha', 'very helpful'],
    response: '😊 You\'re welcome! Happy to help.\n\nRemember: Every vote counts! 🗳️\n\nIs there anything else you\'d like to know about elections or voting?\n\nI\'m here to help make every Indian citizen a confident voter! 🇮🇳',
    followups: ['Tell me about voter registration', 'How does EVM work?', 'What is NOTA?'],
  },
  {
    id: 'goodbye',
    keywords: ['bye', 'goodbye', 'exit', 'quit', 'done', 'nothing else', 'that\'s all', 'ok thanks', 'no more'],
    response: '👋 Goodbye!\n\nDon\'t forget to VOTE on election day — it\'s your right and your power! 🇮🇳\n\nIf you have more questions later, I\'m always here. Happy voting! 🗳️',
    followups: [],
  },
];

/**
 * Contextual follow-up responses.
 * Key: intentId → { trigger word: response }
 */
export const contextualResponses = {
  vvpat: {
    'how long': 'The VVPAT slip is visible for exactly 7 seconds before it drops into the sealed box.',
    'keep': 'No, you cannot keep the VVPAT slip. It automatically drops into a sealed box inside the VVPAT machine.',
    'wrong': 'If you believe the VVPAT slip shows the wrong candidate, immediately inform the Presiding Officer. They can note your complaint.',
    'count': 'VVPAT slips can be counted if ordered by court or ECI. Each slip shows candidate name + party symbol.',
  },
  voter_registration: {
    'how long': 'The voter registration process typically takes 2–4 weeks after submitting your application. You\'ll receive an SMS confirmation.',
    'cost': 'Voter registration is completely FREE in India. There is no fee to register as a voter.',
    'offline': 'Yes, you can register offline by visiting your local BLO or Electoral Registration Officer (ERO) office with Form 6.',
    'online': 'Register online at voters.eci.gov.in — click \'New Registration\' and fill Form 6 digitally.',
  },
  evm: {
    'hacked': 'EVMs cannot be hacked — they are standalone devices with no internet/network connectivity and one-time programmable chips.',
    'battery': 'EVMs run on standard alkaline batteries — no mains power needed. Perfect for remote polling stations.',
    'made': 'EVMs are manufactured by ECIL (Electronics Corporation of India) and BEL (Bharat Electronics Limited) — government companies.',
  },
  nota: {
    'win': 'Currently, NOTA cannot win an election in India. The candidate with the next highest votes wins even if NOTA gets most votes.',
    'symbol': 'The NOTA symbol is a ballot paper with a red cross (✗). It\'s the last button on the EVM ballot unit.',
  },
  documents: {
    'aadhaar': 'Yes, Aadhaar is an accepted photo ID for voting. You can use it if you don\'t have your Voter ID card.',
    'without id': 'Without any valid photo ID, you may not be able to vote. Contact your BLO to arrange an alternate document.',
  },
};

/**
 * Fallback response when no intent is matched.
 */
export const fallbackResponse = '🤔 I didn\'t quite understand that.\n\nI can help you with:\n• Voter registration & EPIC card\n• Finding your polling booth\n• Documents needed to vote\n• How EVM and VVPAT work\n• Voting day process\n• Your voting rights\n• Types of elections\n• How to file complaints\n\nCould you rephrase your question? Or pick a suggestion below!';
