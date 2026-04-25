/**
 * chatEngine.js — ElectionGuide Chatbot Engine
 * Pure client-side keyword intent matching with fuzzy support.
 * Zero external dependencies beyond the intents data file.
 * Response time: < 100ms (synchronous JS)
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
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : 1 + Math.min(matrix[i - 1][j - 1], matrix[i - 1][j], matrix[i][j - 1]);
    }
  }
  return matrix[b.length][a.length];
}

/** Stop words to remove before matching */
const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'what', 'how', 'where', 'when', 'why', 'who', 'which', 'whom',
  'i', 'my', 'me', 'we', 'our', 'you', 'your', 'he', 'she', 'it', 'they', 'their',
  'please', 'can', 'could', 'would', 'should', 'do', 'does', 'did',
  'tell', 'say', 'know', 'want', 'need', 'about', 'for', 'of', 'to', 'in', 'on', 'at',
]);

/**
 * Preprocesses user input: lowercase, trim, remove stop words.
 * @param {string} input - Raw user input
 * @returns {string} Cleaned input
 */
function preprocess(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[?!.,;:'"]/g, '') // remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 0 && !STOPWORDS.has(word))
    .join(' ');
}

/**
 * Main intent matching function.
 * Priority: exact match > partial match > fuzzy match > context > fallback
 * @param {string} userInput - User message
 * @param {string|null} lastIntentId - ID of previous intent for context matching
 * @returns {{ response: string, followups: string[], intentId: string|null }}
 */
export function matchIntent(userInput, lastIntentId = null) {
  if (!userInput || !userInput.trim()) {
    return { response: fallbackResponse, followups: ['How to register?', 'Find my booth', 'What is NOTA?', 'How EVM works?'], intentId: null };
  }

  const cleaned = preprocess(userInput);
  const rawLower = userInput.toLowerCase().trim();

  // 1. EXACT keyword match (highest confidence) — check raw and cleaned
  for (const intent of chatbotIntents) {
    for (const keyword of intent.keywords) {
      if (rawLower === keyword || rawLower.includes(keyword) || cleaned === keyword || cleaned.includes(keyword)) {
        return { response: intent.response, followups: intent.followups, intentId: intent.id };
      }
    }
  }

  // 2. PARTIAL word overlap match (medium confidence)
  const words = cleaned.split(' ').filter(w => w.length > 2);
  if (words.length > 0) {
    let bestMatch = null;
    let bestScore = 0;
    for (const intent of chatbotIntents) {
      for (const keyword of intent.keywords) {
        const kwWords = keyword.split(' ');
        const overlap = words.filter(w => kwWords.includes(w)).length;
        const score = overlap / Math.max(kwWords.length, 1);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = intent;
        }
      }
    }
    if (bestScore >= 0.5 && bestMatch) {
      return { response: bestMatch.response, followups: bestMatch.followups, intentId: bestMatch.id };
    }
  }

  // 3. FUZZY keyword match — handles typos (Levenshtein ≤ 2)
  for (const intent of chatbotIntents) {
    for (const keyword of intent.keywords) {
      for (const word of words) {
        if (word.length > 4) {
          for (const kw of keyword.split(' ')) {
            if (kw.length > 4 && levenshtein(word, kw) <= 2) {
              return { response: intent.response, followups: intent.followups, intentId: intent.id };
            }
          }
        }
      }
    }
  }

  // 4. CONTEXTUAL follow-up (using last intent for context)
  if (lastIntentId && contextualResponses[lastIntentId]) {
    for (const [trigger, response] of Object.entries(contextualResponses[lastIntentId])) {
      if (cleaned.includes(trigger) || rawLower.includes(trigger)) {
        return { response, followups: [], intentId: lastIntentId };
      }
    }
  }

  // 5. FALLBACK with topic suggestions
  return {
    response: fallbackResponse,
    followups: ['How to register?', 'Find my booth', 'What is NOTA?', 'How EVM works?'],
    intentId: null,
  };
}
