import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "greeting": "Empowering Citizens 🇮🇳",
      "heading_1": "We are building ",
      "heading_2": "knowledge for your ",
      "heading_3": "electoral voice",
      "subheading": "JanVeda AI simplifies the entire voting process. Find your booth, practice on our EVM simulator, and get instant answers from our AI assistant.",
      "start": "Start Free Trial →",
      "chatbot": "or ask AI 💬",
      "nav_home": "Home",
      "nav_chatbot": "Chatbot",
      "nav_booth": "Booth Finder",
      "nav_simulator": "Mock Voting",
      "nav_quiz": "Quiz",
      "nav_glossary": "Glossary",
      "nav_timeline": "Timeline",
      "nav_first_time": "First-Time Voter",
      "chatbot_title": "Ask me anything about Indian Elections!",
      "chatbot_desc": "I know <strong>60+ topics</strong> — voter registration, EVM, NOTA, booth finder, rights & more.",
      "chatbot_q1": "📋 How to register?",
      "chatbot_q2": "📍 Find my booth",
      "chatbot_q3": "🚫 What is NOTA?",
      "chatbot_q4": "🖥️ How EVM works?",
      "chatbot_q5": "🧾 What is VVPAT?",
      "chatbot_q6": "📄 Voting documents",
      "chatbot_placeholder": "Ask about elections, EVM, voting rights…",
      "chatbot_header": "JanVeda AI Assistant",
      "chatbot_status": "Online · Instant · Offline-ready",
      "chatbot_copy": "📋 Copy",
      "chatbot_clear": "🗑️ Clear"
    }
  },
  hi: {
    translation: {
      "greeting": "नागरिकों को सशक्त बनाना 🇮🇳",
      "heading_1": "हम आपके ",
      "heading_2": "चुनावी अधिकार के लिए ",
      "heading_3": "ज्ञान का निर्माण कर रहे हैं",
      "subheading": "जनवेदा AI पूरी मतदान प्रक्रिया को सरल बनाता है। अपना बूथ खोजें, हमारे EVM सिम्युलेटर पर अभ्यास करें और हमारे AI से त्वरित उत्तर प्राप्त करें।",
      "start": "निःशुल्क परीक्षण शुरू करें →",
      "chatbot": "या AI से पूछें 💬",
      "nav_home": "होम",
      "nav_chatbot": "चैटबॉट",
      "nav_booth": "बूथ खोजें",
      "nav_simulator": "मॉक वोटिंग",
      "nav_quiz": "क्विज़",
      "nav_glossary": "शब्दावली",
      "nav_timeline": "समयरेखा",
      "nav_first_time": "पहली बार मतदाता",
      "chatbot_title": "भारतीय चुनावों के बारे में मुझसे कुछ भी पूछें!",
      "chatbot_desc": "मुझे <strong>60 से अधिक विषयों</strong> के बारे में पता है — मतदाता पंजीकरण, EVM, NOTA, बूथ खोजक, अधिकार और बहुत कुछ।",
      "chatbot_q1": "📋 पंजीकरण कैसे करें?",
      "chatbot_q2": "📍 मेरा बूथ खोजें",
      "chatbot_q3": "🚫 NOTA क्या है?",
      "chatbot_q4": "🖥️ EVM कैसे काम करता है?",
      "chatbot_q5": "🧾 VVPAT क्या है?",
      "chatbot_q6": "📄 मतदान के दस्तावेज़",
      "chatbot_placeholder": "चुनाव, EVM, मतदान अधिकारों के बारे में पूछें...",
      "chatbot_header": "जनवेदा AI सहायक",
      "chatbot_status": "ऑनलाइन · त्वरित · ऑफ़लाइन-तैयार",
      "chatbot_copy": "📋 कॉपी",
      "chatbot_clear": "🗑️ साफ़ करें"
    }
  },
  gu: {
    translation: {
      "greeting": "નાગરિકોનું સશક્તિકરણ 🇮🇳",
      "heading_1": "અમે તમારા ",
      "heading_2": "ચૂંટણી અધિકાર માટે ",
      "heading_3": "જ્ઞાનનું નિર્માણ કરી રહ્યા છીએ",
      "subheading": "JanVeda AI સમગ્ર મતદાન પ્રક્રિયાને સરળ બનાવે છે. તમારું બૂથ શોધો, અમારા EVM સિમ્યુલેટર પર પ્રેક્ટિસ કરો અને અમારા AI પાસેથી ત્વરિત જવાબો મેળવો.",
      "start": "મફત ટ્રાયલ શરૂ કરો →",
      "chatbot": "અથવા AI ને પૂછો 💬",
      "nav_home": "હોમ",
      "nav_chatbot": "ચેટબોટ",
      "nav_booth": "બૂથ શોધો",
      "nav_simulator": "મોક વોટિંગ",
      "nav_quiz": "ક્વિઝ",
      "nav_glossary": "શબ્દાવલી",
      "nav_timeline": "સમયરેખા",
      "nav_first_time": "પહેલીવાર મતદાર",
      "chatbot_title": "ભારતીય ચૂંટણીઓ વિશે મને કંઈપણ પૂછો!",
      "chatbot_desc": "હું <strong>60 થી વધુ વિષયો</strong> જાણું છું — મતદાર નોંધણી, EVM, NOTA, બૂથ શોધક, અધિકારો અને વધુ.",
      "chatbot_q1": "📋 નોંધણી કેવી રીતે કરવી?",
      "chatbot_q2": "📍 મારું બૂથ શોધો",
      "chatbot_q3": "🚫 NOTA શું છે?",
      "chatbot_q4": "🖥️ EVM કેવી રીતે કામ કરે છે?",
      "chatbot_q5": "🧾 VVPAT શું છે?",
      "chatbot_q6": "📄 મતદાન માટે દસ્તાવેજો",
      "chatbot_placeholder": "ચૂંટણી, EVM, મતદાન અધિકારો વિશે પૂછો...",
      "chatbot_header": "જનવેદા AI સહાયક",
      "chatbot_status": "ઓનલાઈન · ત્વરિત · ઓફલાઇન-તૈયાર",
      "chatbot_copy": "📋 કોપી",
      "chatbot_clear": "🗑️ સાફ કરો"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
