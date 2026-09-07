const express = require('express');
const router = express.Router();
const db = require('../services/dataStore');
const { processQuery } = require('../services/intentService');

// POST /api/chat
router.post('/', (req, res) => {
  const { message, startNodeId } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      error: 'Message is required.',
      reply: 'Please type a question. For example: "Where is the admission office?"'
    });
  }

  const locations = db.getLocations();
  const faculty   = db.getFaculty();

  const result = processQuery(message.trim(), locations, faculty);

  res.json({
    query: message.trim(),
    intent: result.intent,
    reply: result.message,
    destination: result.destination || null,
    results: result.results || [],
    requiresClarification: result.requiresClarification || false,
    suggestions: result.suggestions || [],
    startNodeId: startNodeId || 'node-main-gate'
  });
});

module.exports = router;
