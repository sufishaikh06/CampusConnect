const express = require('express');
const router = express.Router();
const { calculateRoute, getNodeForLocation } = require('../services/navigationEngine');
const db = require('../services/dataStore');

// GET /api/navigation/nodes
router.get('/nodes', (req, res) => {
  const nodes = db.getNavNodes();
  res.json({ count: nodes.length, data: nodes });
});

// GET /api/navigation/edges
router.get('/edges', (req, res) => {
  const edges = db.getNavEdges();
  res.json({ count: edges.length, data: edges });
});

// POST /api/navigation/route
// Body: { startNodeId, destinationNodeId } OR { startNodeId, locationId }
router.post('/route', (req, res) => {
  let { startNodeId, destinationNodeId, locationId } = req.body;

  if (!startNodeId) startNodeId = 'node-main-gate';

  if (!destinationNodeId && locationId) {
    destinationNodeId = getNodeForLocation(locationId);
    if (!destinationNodeId) {
      return res.status(404).json({
        error: 'This location does not have a navigation route configured yet.',
        fallback: 'text-directions'
      });
    }
  }

  if (!destinationNodeId) {
    return res.status(400).json({ error: 'destinationNodeId or locationId is required.' });
  }

  const result = calculateRoute(startNodeId, destinationNodeId);

  if (result.error) {
    return res.status(404).json({ error: result.error, fallback: 'text-directions' });
  }

  res.json(result);
});

module.exports = router;
