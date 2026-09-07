const express = require('express');
const router = express.Router();
const db = require('../services/dataStore');

router.get('/panoramas', (req, res) => {
  const panoramas = db.getPanoramas();
  res.json({ count: panoramas.length, data: panoramas });
});

router.get('/panoramas/:id', (req, res) => {
  const panoramas = db.getPanoramas();
  const pano = panoramas.find(p => p.id === req.params.id);
  if (!pano) return res.status(404).json({ error: 'Panorama not found.' });
  res.json(pano);
});

module.exports = router;
