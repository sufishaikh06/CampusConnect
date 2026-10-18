const express = require('express');
const router = express.Router();
const db = require('../services/dataStore');
const { processChatQuery } = require('../services/aiService');
const { processQuery } = require('../services/intentService');

// POST /api/chat
router.post('/', async (req, res) => {
  const { message, startNodeId } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      error: 'Message is required.',
      reply: 'Please type a question. For example: "Where is the admission office?"'
    });
  }

  const locations = db.getLocations();
  const faculty   = db.getFaculty();

  let aiResult = null;
  let usedAi = false;

  try {
    aiResult = await processChatQuery(message.trim(), locations);
    if (aiResult) {
      usedAi = true;
    }
  } catch (err) {
    console.warn(`[Chat] Gemini AI unavailable (${err.message}). Gracefully falling back to rule-based intent matching.`);
  }

  if (usedAi && aiResult) {
    let matchedDestination = null;
    let matchedOrigin = null;

    if (aiResult.destinationName) {
      const dName = aiResult.destinationName.toLowerCase().trim();
      matchedDestination = locations.find(loc => {
        const nameMatch = loc.name.toLowerCase() === dName;
        const aliasMatch = loc.aliases && loc.aliases.some(a => a.toLowerCase() === dName);
        const includesMatch = loc.name.toLowerCase().includes(dName) || dName.includes(loc.name.toLowerCase());
        return nameMatch || aliasMatch || includesMatch;
      });
    }

    if (aiResult.originLocationName) {
      const oName = aiResult.originLocationName.toLowerCase().trim();
      matchedOrigin = locations.find(loc => {
        const nameMatch = loc.name.toLowerCase() === oName;
        const aliasMatch = loc.aliases && loc.aliases.some(a => a.toLowerCase() === oName);
        const includesMatch = loc.name.toLowerCase().includes(oName) || oName.includes(loc.name.toLowerCase());
        return nameMatch || aliasMatch || includesMatch;
      });
    }

    const effectiveStartNodeId = (matchedOrigin && matchedOrigin.navigationNodeId)
      ? matchedOrigin.navigationNodeId
      : (startNodeId || 'node-main-gate');

    if (matchedDestination) {
      return res.json({
        query: message.trim(),
        intent: aiResult.intent || 'FIND_LOCATION',
        reply: aiResult.reply || `Found: ${matchedDestination.name} (${matchedDestination.building}, ${matchedDestination.floor}).`,
        destination: matchedDestination,
        origin: matchedOrigin,
        results: [matchedDestination],
        requiresClarification: false,
        suggestions: [],
        confidence: aiResult.confidence,
        source: 'gemini-ai',
        startNodeId: effectiveStartNodeId
      });
    }

    // If AI replied with unknown or general information without a matched location
    if (aiResult.intent === 'GENERAL_INFORMATION' || aiResult.intent === 'UNKNOWN') {
      return res.json({
        query: message.trim(),
        intent: aiResult.intent,
        reply: aiResult.reply || "I'm not sure which campus location you are looking for. Try asking for Admission Office, Library, or Accounts Office.",
        destination: null,
        origin: matchedOrigin,
        results: [],
        requiresClarification: false,
        suggestions: ['Admission Office', 'Central Library', 'Accounts Office', 'Computer Engineering Dept.'],
        confidence: aiResult.confidence,
        source: 'gemini-ai',
        startNodeId: effectiveStartNodeId
      });
    }
  }

  // Graceful fallback to rule-based intentService
  const fallbackResult = processQuery(message.trim(), locations, faculty);

  // Check if query contained "from [X]" or "at [X]" or "near [X]"
  let fallbackOrigin = null;
  const lowerMsg = message.toLowerCase();
  const originMatch = lowerMsg.match(/(?:from|at|near|standing at|looking at)\s+([a-zA-Z0-9\s-]+?)(?:\s+(?:to|for|where|how|and)|$)/i);
  if (originMatch && originMatch[1]) {
    const oQuery = originMatch[1].trim();
    fallbackOrigin = locations.find(loc => 
      loc.name.toLowerCase().includes(oQuery) || 
      (loc.aliases && loc.aliases.some(a => a.toLowerCase().includes(oQuery)))
    );
  }

  const effectiveStartNodeId = (fallbackOrigin && fallbackOrigin.navigationNodeId)
    ? fallbackOrigin.navigationNodeId
    : (startNodeId || 'node-main-gate');

  return res.json({
    query: message.trim(),
    intent: fallbackResult.intent,
    reply: fallbackResult.message,
    destination: fallbackResult.destination || null,
    origin: fallbackOrigin,
    results: fallbackResult.results || [],
    requiresClarification: fallbackResult.requiresClarification || false,
    suggestions: fallbackResult.suggestions || [],
    source: 'rule-based-fallback',
    startNodeId: effectiveStartNodeId
  });
});

module.exports = router;
