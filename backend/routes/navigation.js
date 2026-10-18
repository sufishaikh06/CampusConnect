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

// GET /api/navigation/panoramas
router.get('/panoramas', (req, res) => {
  const panos = db.getPanoramas();
  res.json({ count: panos.length, data: panos });
});

// PUT /api/navigation/panoramas/hotspot
// Update pitch and yaw for a specific hotspot in panoramas.json
router.put('/panoramas/hotspot', (req, res) => {
  const { panoramaId, targetNodeId, pitch, yaw, label, direction } = req.body;
  if (!panoramaId || !targetNodeId) {
    return res.status(400).json({ error: 'panoramaId and targetNodeId are required.' });
  }

  const panoramas = db.getPanoramas();
  const pano = panoramas.find(p => p.id === panoramaId);
  if (!pano) {
    return res.status(404).json({ error: `Panorama '${panoramaId}' not found.` });
  }

  if (!Array.isArray(pano.hotspots)) pano.hotspots = [];
  let hotspot = pano.hotspots.find(h => h.targetNodeId === targetNodeId);
  if (!hotspot) {
    hotspot = { targetNodeId, pitch: 0, yaw: 0, label: label || '', direction: direction || 'forward' };
    pano.hotspots.push(hotspot);
  }

  if (pitch !== undefined) hotspot.pitch = Math.round(Number(pitch) * 10) / 10;
  if (yaw !== undefined) hotspot.yaw = Math.round(Number(yaw) * 10) / 10;
  if (label !== undefined) hotspot.label = label;
  if (direction !== undefined) hotspot.direction = direction;

  db.savePanoramas(panoramas);
  res.json({ success: true, message: 'Hotspot updated successfully.', data: hotspot });
});

module.exports = router;
