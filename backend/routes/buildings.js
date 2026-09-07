const express = require('express');
const router = express.Router();
const db = require('../services/dataStore');

router.get('/', (req, res) => {
  const buildings = db.getBuildings();
  res.json({ count: buildings.length, data: buildings });
});

router.get('/:id', (req, res) => {
  const buildings = db.getBuildings();
  const building = buildings.find(b => b.id === req.params.id);
  if (!building) return res.status(404).json({ error: 'Building not found.' });
  res.json(building);
});

module.exports = router;
